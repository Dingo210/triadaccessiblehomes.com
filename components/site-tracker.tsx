'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

type TrackType = 'pageview' | 'phone_click' | 'email_click' | 'website_click';

/**
 * Fire-and-forget event to the first-party collector. sendBeacon survives the
 * page unloading, which matters for taps that leave the site (website links).
 */
export function track(type: TrackType, data: { businessId?: string; path?: string; referrer?: string } = {}) {
  try {
    const payload = JSON.stringify({ type, path: window.location.pathname, ...data });
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'text/plain' }));
    } else {
      fetch('/api/track', { method: 'POST', body: payload, keepalive: true }).catch(() => {});
    }
  } catch {
    // Tracking must never interfere with the page.
  }
}

export function SiteTracker() {
  const pathname = usePathname();
  const isLanding = useRef(true);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    // Only the landing pageview carries the external referrer; in-app navigations don't.
    track('pageview', { path: pathname, referrer: isLanding.current ? document.referrer : '' });
    isLanding.current = false;
  }, [pathname]);

  return null;
}
