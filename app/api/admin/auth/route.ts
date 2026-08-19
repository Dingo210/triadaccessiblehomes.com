export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_NAME,
  SESSION_TTL_SECONDS,
  createSessionToken,
  isAdminConfigured,
  isAuthenticated,
  verifyPassword,
} from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      console.error('Admin login attempted but ADMIN_PASSWORD / ADMIN_SESSION_SECRET are not set.');
      return NextResponse.json({ error: 'Admin is not configured' }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));

    if (!verifyPassword(body?.password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = createSessionToken();
    if (!token) {
      return NextResponse.json({ error: 'Admin is not configured' }, { status: 503 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_TTL_SECONDS,
      path: '/',
    });
    return response;
  } catch (err: any) {
    console.error('Admin auth error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ authenticated: isAuthenticated() });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
