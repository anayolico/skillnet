import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

export const BCRYPT_ROUNDS = 12;
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;
export const PASSWORD_RESET_EXPIRY_MINUTES = 15;
export const PASSWORD_RESET_PREFIX = 'pwd-reset:';
export const PASSWORD_COOLDOWN_DAYS = 7;
export const PASSWORD_COOLDOWN_MS = PASSWORD_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
export const PASSWORD_COOLDOWN_PREFIX = 'pwd-cooldown:';

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

// Shared exact rules (mirrored in frontend/src/utils/validation.ts)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_ALLOWED_REGEX = /^[\p{L}\p{M}'\-\s.]+$/u;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9\s]/;

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
  return raw.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

export function validateRegistrationName(
  firstNameRaw: unknown,
  lastNameRaw: unknown
): { valid: true; firstName: string; lastName: string } | { valid: false; error: string } {
  const firstName = sanitizeName(firstNameRaw, 60);
  const lastName = sanitizeName(lastNameRaw, 60);
  const combined = `${firstName} ${lastName}`.trim();

  if (combined.length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters long.' };
  }
  if (combined.length > 100) {
    return { valid: false, error: 'Full name must be 100 characters or fewer.' };
  }
  if (!NAME_ALLOWED_REGEX.test(combined)) {
    return {
      valid: false,
      error: 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods.',
    };
  }
  return { valid: true, firstName, lastName };
}

export function validateNewPassword(
  raw: unknown
): { valid: true; value: string } | { valid: false; error: string } {
  if (typeof raw !== 'string') {
    return { valid: false, error: 'Password must be a text string.' };
  }
  if (raw.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (Buffer.byteLength(raw, 'utf8') > 72) {
    return { valid: false, error: 'Password must be 72 bytes or fewer.' };
  }
  if (!UPPERCASE_REGEX.test(raw)) {
    return { valid: false, error: 'Password must include at least one uppercase letter (A-Z).' };
  }
  if (!LOWERCASE_REGEX.test(raw)) {
    return { valid: false, error: 'Password must include at least one lowercase letter (a-z).' };
  }
  if (!NUMBER_REGEX.test(raw)) {
    return { valid: false, error: 'Password must include at least one number (0-9).' };
  }
  if (!SPECIAL_CHAR_REGEX.test(raw)) {
    return {
      valid: false,
      error: 'Password must include at least one special character (e.g. . _ / ! @ # $ % & *).',
    };
  }
  return { valid: true, value: raw };
}

export function sanitizeUser<T extends { password?: unknown }>(user: T): Omit<T, 'password'> {
  const { password: _removed, ...safe } = user;
  return safe;
}

export function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export async function createPasswordResetToken(email: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(rawToken);
  const identifier = `${PASSWORD_RESET_PREFIX}${email}`;
  const expires = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MINUTES * 60 * 1000);

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: {
        identifier,
        token: tokenHash,
        expires,
      },
    }),
  ]);

  return rawToken;
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

export async function revokeOtherUserSessions(userId: string, keepJti?: string): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      userId,
      ...(keepJti ? { sessionToken: { not: keepJti } } : {}),
    },
  });
}

export async function getPasswordCooldownUntil(userId: string): Promise<Date | null> {
  const identifier = `${PASSWORD_COOLDOWN_PREFIX}${userId}`;
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier,
      expires: { gt: new Date() },
    },
    orderBy: { expires: 'desc' },
  });
  return record ? record.expires : null;
}

export function formatPasswordCooldownMessage(cooldownUntil: Date): string {
  const remainingMs = Math.max(0, cooldownUntil.getTime() - Date.now());
  const remainingDays = Math.max(1, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
  const formattedDate = cooldownUntil.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `You can only change your password once every ${PASSWORD_COOLDOWN_DAYS} days. Try again in ${remainingDays} day${remainingDays === 1 ? '' : 's'} (${formattedDate}).`;
}

export function createPasswordCooldownData(userId: string): {
  identifier: string;
  token: string;
  expires: Date;
} {
  return {
    identifier: `${PASSWORD_COOLDOWN_PREFIX}${userId}`,
    token: `pwd-cd:${userId}:${crypto.randomBytes(16).toString('hex')}`,
    expires: new Date(Date.now() + PASSWORD_COOLDOWN_MS),
  };
}
