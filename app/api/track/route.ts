export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthenticated } from '@/lib/admin-auth';
import { isBot, isEventType, listingIdFromPath, referrerHost, visitorHash } from '@/lib/analytics';

const MAX_BODY_BYTES = 2048;

/**
 * Public, cookieless collector for pageviews and provider contact clicks.
 * Always answers 204: tracking must never break or slow a visitor's page, so
 * bots, the signed-in admin, and malformed events are dropped silently.
 */
export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') ?? '';
    if (isBot(userAgent) || isAuthenticated()) return noContent();

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return noContent();
    const body = JSON.parse(raw || '{}');

    const type = body?.type;
    if (!isEventType(type)) return noContent();

    const path = typeof body?.path === 'string' ? body.path.slice(0, 300) : '';
    if (path.startsWith('/admin')) return noContent();

    let businessId: string | null =
      type === 'pageview'
        ? listingIdFromPath(path)
        : typeof body?.businessId === 'string'
          ? body.businessId
          : null;

    if (businessId) {
      const exists = await prisma.business.findUnique({
        where: { id: businessId },
        select: { id: true },
      });
      if (!exists) businessId = null;
    }
    // A contact click only means something if it belongs to a real listing.
    if (type !== 'pageview' && !businessId) return noContent();

    const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim();
    await prisma.analyticsEvent.create({
      data: {
        type,
        businessId,
        path,
        referrer: referrerHost(body?.referrer, request.headers.get('host') ?? ''),
        visitorHash: visitorHash(ip, userAgent),
      },
    });
  } catch (err: any) {
    console.error('Track error:', err?.message ?? err);
  }
  return noContent();
}

function noContent() {
  return new NextResponse(null, { status: 204 });
}
