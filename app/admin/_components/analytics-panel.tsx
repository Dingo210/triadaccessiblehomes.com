'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Eye, Globe, Mail, MousePointerClick, Phone, Star, Users } from 'lucide-react';

interface Analytics {
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

const RANGES = [7, 30, 90];

export function AnalyticsPanel() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async (range: number) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/admin/analytics?days=${range}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  const totals = loading ? undefined : data?.totals;
  const daily = data?.daily ?? [];
  const peak = Math.max(1, ...daily.map((d) => d.pageviews));
  const isEmpty = !loading && !error && data && data.totals.pageviews === 0 && data.totals.leads === 0;

  return (
    <section className="mb-10 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Traffic &amp; Leads</h2>
          <p className="text-sm text-muted-foreground">
            How families use the site, and which providers they contact.
          </p>
        </div>
        <div className="flex gap-1">
          {RANGES.map((range) => (
            <Button
              key={range}
              size="sm"
              variant={days === range ? 'default' : 'outline'}
              onClick={() => setDays(range)}
            >
              {range} days
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Couldn&apos;t load analytics. Try refreshing the page.
          </CardContent>
        </Card>
      )}

      {isEmpty && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No tracked visits in this range yet. Tracking started when this dashboard was deployed, so
            there is no history from before then.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Eye} label="Pageviews" value={totals?.pageviews} />
        <Stat icon={Users} label="Visitors" hint="unique per day" value={totals?.visitors} />
        <Stat icon={BarChart3} label="Listing views" value={totals?.listingViews} />
        <Stat
          icon={MousePointerClick}
          label="Provider leads"
          hint="phone, email & website taps"
          value={totals?.leads}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daily pageviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex h-32 items-end gap-[2px]"
            role="img"
            aria-label={`Daily pageviews over the last ${days} days`}
          >
            {daily.map((d) => (
              <div
                key={d.date}
                className="flex-1 min-h-[2px] rounded-t bg-primary/70 transition-colors hover:bg-primary"
                style={{ height: `${(d.pageviews / peak) * 100}%` }}
                title={`${d.date}: ${d.pageviews} pageviews, ${d.visitors} visitors`}
              />
            ))}
          </div>
          {daily.length > 0 && (
            <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
              <span>{daily[0].date}</span>
              <span>{daily[daily.length - 1].date}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <RankedList
          title="Top pages"
          rows={(data?.topPages ?? []).map((p) => ({ label: p.path, value: p.views }))}
        />
        <RankedList
          title="Top referrers"
          rows={(data?.topReferrers ?? []).map((r) => ({ label: r.host, value: r.visits }))}
          emptyText="No external referrers yet — visits so far are direct."
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Leads by provider</CardTitle>
          <p className="text-xs text-muted-foreground">
            Unique visitors per day who viewed a listing or tapped its phone, email, or website link.
            Tapping the same link repeatedly counts once.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Provider</th>
                  <th className="text-right p-3 font-semibold">Views</th>
                  <th className="text-right p-3 font-semibold">
                    <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone</span>
                  </th>
                  <th className="text-right p-3 font-semibold">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</span>
                  </th>
                  <th className="text-right p-3 font-semibold">
                    <span className="inline-flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Website</span>
                  </th>
                  <th className="text-right p-3 font-semibold">Leads</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  (data?.providers ?? []).map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">
                        {p.name}
                        {p.featured && (
                          <Badge className="ml-2 bg-amber-500 text-white border-0 gap-1 text-[10px]">
                            <Star className="h-2.5 w-2.5 fill-current" /> Featured
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-right tabular-nums">{p.views}</td>
                      <td className="p-3 text-right tabular-nums">{p.phone}</td>
                      <td className="p-3 text-right tabular-nums">{p.email}</td>
                      <td className="p-3 text-right tabular-nums">{p.website}</td>
                      <td className="p-3 text-right tabular-nums font-semibold">{p.leads}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Counts exclude bots and anything you do while signed in here. No cookies, IP addresses, or
        personal data are stored — visitors are counted with an anonymous hash that resets daily.
      </p>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  hint,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
  value?: number;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </div>
        <p className="mt-2 font-display text-3xl font-bold tabular-nums">
          {value === undefined ? '—' : value.toLocaleString()}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function RankedList({
  title,
  rows,
  emptyText = 'No data yet.',
}: {
  title: string;
  rows: { label: string; value: number }[];
  emptyText?: string;
}) {
  const top = Math.max(1, ...rows.map((r) => r.value));
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((row) => (
              <li key={row.label} className="relative">
                <div
                  className="absolute inset-y-0 left-0 rounded bg-primary/10"
                  style={{ width: `${(row.value / top) * 100}%` }}
                />
                <div className="relative flex justify-between gap-3 px-2 py-1 text-sm">
                  <span className="truncate">{row.label}</span>
                  <span className="tabular-nums font-medium">{row.value}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
