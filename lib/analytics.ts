import crypto from 'crypto';
import { prisma } from '@/lib/db';

/**
 * First-party, cookieless analytics. Nothing that identifies a person is stored:
 * no IP address, no user agent, no cookie. A visitor is counted with a salted
 * hash of IP + user agent that rotates every day, so it can tell visitors apart
 * within a day but cannot follow anyone across days or be reversed.
 */

export const EVENT_TYPES = ['pageview', 'phone_click', 'email_click', 'website_click'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|monitor|uptime|pingdom|lighthouse|headless|curl|wget|python|httpclient|axios|node-fetch/i;

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_UA.test(userAgent);
}

export function isEventType(value: unknown): value is EventType {
  return typeof value === 'string' && (EVENT_TYPES as readonly string[]).includes(value);
}

export function visitorHash(ip: string, userAgent: string, now: Date = new Date()): string {
  const day = now.toISOString().slice(0, 10);
  const salt = process.env.ADMIN_SESSION_SECRET ?? '';
  return crypto
    .createHash('sha256')
    .update(`${salt}|${day}|${ip}|${userAgent}`)
    .digest('hex')
    .slice(0, 32);
}

export function listingIdFromPath(path: string): string | null {
  const match = /^\/listing\/([^/?#]+)/.exec(path);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/** External referrer hostname, or '' for direct visits and internal navigation. */
export function referrerHost(referrer: unknown, siteHost: string): string {
  if (typeof referrer !== 'string' || !referrer) return '';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    const site = siteHost.split(':')[0].replace(/^www\./, '');
    return host && host !== site ? host.slice(0, 100) : '';
  } catch {
    return '';
  }
}

export interface AnalyticsSummary {
  days: number;
  totals: { pageviews: number; visitors: number; listingViews: number; leads: number };
  daily: { date: string; pageviews: number; visitors: number }[];
  topPages: { path: string; views: number }[];
  topReferrers: { host: string; visits: number }[];
  providers: {
    id: string;
    name: string;
    featured: boolean;
    views: number;
    phone: number;
    email: number;
    website: number;
    leads: number;
  }[];
}

/** Calendar dates (ET) for the last `days` days, oldest first. */
function lastNDates(days: number): string[] {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(fmt.format(new Date(Date.now() - i * 24 * 60 * 60 * 1000)));
  }
  return Array.from(new Set(dates));
}

/**
 * Provider metrics count unique daily visitors, not raw events, so one person
 * tapping a phone number five times is one lead, and a single source spamming
 * the collector can't inflate a provider's numbers.
 */
export async function getAnalytics(days: number): Promise<AnalyticsSummary> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totalsRows, dailyRows, topPages, topReferrers, providerRows, businesses] = await Promise.all([
    prisma.$queryRaw<{ pageviews: number; visitors: number; listingViews: number }[]>`
      SELECT
        COUNT(*) FILTER (WHERE "type" = 'pageview')::int AS "pageviews",
        COUNT(DISTINCT "visitorHash") FILTER (WHERE "type" = 'pageview')::int AS "visitors",
        COUNT(*) FILTER (WHERE "type" = 'pageview' AND "businessId" IS NOT NULL)::int AS "listingViews"
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${since}`,
    prisma.$queryRaw<{ date: string; pageviews: number; visitors: number }[]>`
      SELECT
        to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'America/New_York', 'YYYY-MM-DD') AS "date",
        COUNT(*)::int AS "pageviews",
        COUNT(DISTINCT "visitorHash")::int AS "visitors"
      FROM "AnalyticsEvent"
      WHERE "type" = 'pageview' AND "createdAt" >= ${since}
      GROUP BY 1
      ORDER BY 1`,
    prisma.$queryRaw<{ path: string; views: number }[]>`
      SELECT "path", COUNT(*)::int AS "views"
      FROM "AnalyticsEvent"
      WHERE "type" = 'pageview' AND "createdAt" >= ${since}
      GROUP BY "path"
      ORDER BY "views" DESC
      LIMIT 10`,
    prisma.$queryRaw<{ host: string; visits: number }[]>`
      SELECT "referrer" AS "host", COUNT(DISTINCT "visitorHash")::int AS "visits"
      FROM "AnalyticsEvent"
      WHERE "type" = 'pageview' AND "referrer" <> '' AND "createdAt" >= ${since}
      GROUP BY "referrer"
      ORDER BY "visits" DESC
      LIMIT 10`,
    prisma.$queryRaw<{ id: string; views: number; phone: number; email: number; website: number }[]>`
      SELECT
        "businessId" AS "id",
        COUNT(DISTINCT "visitorHash") FILTER (WHERE "type" = 'pageview')::int AS "views",
        COUNT(DISTINCT "visitorHash") FILTER (WHERE "type" = 'phone_click')::int AS "phone",
        COUNT(DISTINCT "visitorHash") FILTER (WHERE "type" = 'email_click')::int AS "email",
        COUNT(DISTINCT "visitorHash") FILTER (WHERE "type" = 'website_click')::int AS "website"
      FROM "AnalyticsEvent"
      WHERE "businessId" IS NOT NULL AND "createdAt" >= ${since}
      GROUP BY "businessId"`,
    prisma.business.findMany({ select: { id: true, name: true, featured: true } }),
  ]);

  const stats = new Map(providerRows.map((row) => [row.id, row]));
  const providers = businesses
    .map((biz) => {
      const s = stats.get(biz.id);
      const phone = s?.phone ?? 0;
      const email = s?.email ?? 0;
      const website = s?.website ?? 0;
      return {
        id: biz.id,
        name: biz.name,
        featured: biz.featured,
        views: s?.views ?? 0,
        phone,
        email,
        website,
        leads: phone + email + website,
      };
    })
    .sort((a, b) => b.leads - a.leads || b.views - a.views || a.name.localeCompare(b.name));

  const byDate = new Map(dailyRows.map((row) => [row.date, row]));
  const daily = lastNDates(days).map((date) => ({
    date,
    pageviews: byDate.get(date)?.pageviews ?? 0,
    visitors: byDate.get(date)?.visitors ?? 0,
  }));

  const totals = totalsRows[0] ?? { pageviews: 0, visitors: 0, listingViews: 0 };

  return {
    days,
    totals: { ...totals, leads: providers.reduce((sum, p) => sum + p.leads, 0) },
    daily,
    topPages,
    topReferrers,
    providers,
  };
}
