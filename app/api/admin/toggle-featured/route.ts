export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  // Check admin auth
  const cookieStore = cookies();
  const auth = cookieStore.get('admin_auth');
  if (auth?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const businessId = body?.businessId;
    const featured = body?.featured ?? false;

    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
    }

    const now = new Date();
    const featuredUntil = featured ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) : null;

    const updated = await prisma.business.update({
      where: { id: businessId },
      data: { featured, featuredUntil },
    });

    return NextResponse.json({ success: true, business: JSON.parse(JSON.stringify(updated)) });
  } catch (err: any) {
    console.error('Toggle featured error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
