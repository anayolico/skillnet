import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

export const BCRYPT_ROUNDS = 12;
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;

// Precomputed valid bcrypt hash used for constant-time comparison when user does not exist
export const DUMMY_PASSWORD_HASH = bcrypt.hashSync('skillnet-dummy-timing-guard-value', 10);

export const SAFE_USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
  isOnboarded: true,
  subscriptionTier: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const PUBLIC_USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
  subscriptionTier: true,
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.SUPABASE_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'FATAL: AUTH_SECRET environment variable must be set and at least 32 characters long.'
    );
  }
  return secret;
}

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const normalized = raw.trim().toLowerCase();
  if (!normalized || normalized.length > 254 || !EMAIL_REGEX.test(normalized)) {
    return null;
  }
  return normalized;
}

export function sanitizeName(raw: unknown, maxLength = 80): string {
  if (typeof raw !== 'string') return '';
  return raw.trim().slice(0, maxLength);
}

export function validateNewPassword(
  raw: unknown
): { valid: true; value: string } | { valid: false; error: string } {
  if (typeof raw !== 'string') {
    return { valid: false, error: 'Password must be a text string' };
  }
  if (raw.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (Buffer.byteLength(raw, 'utf8') > 72) {
    return { valid: false, error: 'Password must be at most 72 bytes long' };
  }
  return { valid: true, value: raw };
}

export function sanitizeUser<T extends { password?: unknown }>(user: T): Omit<T, 'password'> {
  const { password: _removed, ...safe } = user;
  return safe;
}

export async function createSessionToken(user: {
  id: string;
  email: string | null;
  isOnboarded: boolean;
}): Promise<{ token: string; jti: string }> {
  const jti = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      sessionToken: jti,
      userId: user.id,
      expires,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      isOnboarded: user.isOnboarded,
      jti,
    },
    getAuthSecret(),
    { algorithm: 'HS256', expiresIn: SESSION_DURATION_SECONDS }
  );

  return { token, jti };
}

export async function refreshSessionToken(
  user: {
    id: string;
    email: string | null;
    isOnboarded: boolean;
  },
  existingJti?: string
): Promise<string> {
  if (existingJti) {
    const existing = await prisma.session.findUnique({
      where: { sessionToken: existingJti },
    });
    if (existing && existing.userId === user.id && existing.expires > new Date()) {
      const remainingSeconds = Math.max(
        60,
        Math.floor((existing.expires.getTime() - Date.now()) / 1000)
      );
      return jwt.sign(
        {
          userId: user.id,
          email: user.email,
          isOnboarded: user.isOnboarded,
          jti: existingJti,
        },
        getAuthSecret(),
        { algorithm: 'HS256', expiresIn: remainingSeconds }
      );
    }
  }

  const { token } = await createSessionToken(user);
  return token;
}

export async function revokeSession(jti?: string): Promise<void> {
  if (!jti) return;
  await prisma.session.deleteMany({
    where: { sessionToken: jti },
  });
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId },
  });
}
