export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const auth = cookieStore.get('admin_auth');
  if (auth?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const businesses = await prisma.business.findMany({
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    });
    return NextResponse.json(JSON.parse(JSON.stringify(businesses ?? [])));
  } catch (err: any) {
    console.error('Admin businesses error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
