import crypto from 'crypto';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'admin_auth';
export const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours

/**
 * Admin sessions are stateless: the cookie holds `<expiry>.<hmac>` where the
 * HMAC is over the expiry, keyed by ADMIN_SESSION_SECRET. Without the secret a
 * value cannot be forged, so knowing the source is not enough to authenticate
 * (the previous implementation used a constant string, which was).
 */
function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null;
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/** Constant-time compare that tolerates unequal lengths without throwing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createSessionToken(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const separator = token.lastIndexOf('.');
  if (separator <= 0) return false;

  const expiresAt = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!/^\d+$/.test(expiresAt)) return false;

  if (!safeEqual(signature, sign(expiresAt, secret))) return false;
  return Number(expiresAt) > Date.now();
}

/** Verifies a submitted password against ADMIN_PASSWORD. Fails closed. */
export function verifyPassword(candidate: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof candidate !== 'string') return false;
  return safeEqual(candidate, expected);
}

/** True when the current request carries a valid admin session cookie. */
export function isAuthenticated(): boolean {
  return verifySessionToken(cookies().get(COOKIE_NAME)?.value);
}

/** True when the server is missing the config needed to authenticate at all. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSecret());
}
