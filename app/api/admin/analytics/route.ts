export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';
import { getAnalytics } from '@/lib/analytics';

const ALLOWED_RANGES = [7, 30, 90];

export async function GET(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const requested = Number(request.nextUrl.searchParams.get('days'));
  const days = ALLOWED_RANGES.includes(requested) ? requested : 30;

  try {
    return NextResponse.json(await getAnalytics(days));
  } catch (err: any) {
    console.error('Admin analytics error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
