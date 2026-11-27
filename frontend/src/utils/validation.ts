/**
 * Shared client-side input validation — mirrors backend/src/lib/auth.ts rules exactly.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_ALLOWED_REGEX = /^[\p{L}\p{M}'\-\s.]+$/u;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9\s]/;

export interface PasswordChecks {
  minLength: boolean;
  maxBytes: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function validateEmail(raw: string): { valid: true; value: string } | { valid: false; error: string } {
  const normalized = normalizeEmail(raw);
  if (!normalized || normalized.length > 254 || !EMAIL_REGEX.test(normalized)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true, value: normalized };
}

export function validateFullName(
  raw: string
): { valid: true; firstName: string; lastName: string } | { valid: false; error: string } {
  const cleaned = raw.trim().replace(/\s+/g, ' ');
  if (cleaned.length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters long.' };
  }
  if (cleaned.length > 100) {
    return { valid: false, error: 'Full name must be 100 characters or fewer.' };
  }
  if (!NAME_ALLOWED_REGEX.test(cleaned)) {
    return {
      valid: false,
      error: 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods.',
    };
  }
  const [firstName, ...rest] = cleaned.split(' ');
  return {
    valid: true,
    firstName: firstName.slice(0, 60),
    lastName: rest.join(' ').slice(0, 60),
  };
}

export function getPasswordChecks(password: string): PasswordChecks {
  const byteLength = new TextEncoder().encode(password).length;
  return {
    minLength: password.length >= 8,
    maxBytes: byteLength <= 72,
    hasUppercase: UPPERCASE_REGEX.test(password),
    hasLowercase: LOWERCASE_REGEX.test(password),
    hasNumber: NUMBER_REGEX.test(password),
    hasSpecial: SPECIAL_CHAR_REGEX.test(password),
  };
}

export function isPasswordStrong(password: string): boolean {
  const c = getPasswordChecks(password);
  return c.minLength && c.maxBytes && c.hasUppercase && c.hasLowercase && c.hasNumber && c.hasSpecial;
}

export function validatePassword(
  password: string
): { valid: true } | { valid: false; error: string } {
  const c = getPasswordChecks(password);
  if (!c.minLength) return { valid: false, error: 'Password must be at least 8 characters long.' };
  if (!c.maxBytes) return { valid: false, error: 'Password must be 72 bytes or fewer.' };
  if (!c.hasUppercase) return { valid: false, error: 'Password must include at least one uppercase letter (A-Z).' };
  if (!c.hasLowercase) return { valid: false, error: 'Password must include at least one lowercase letter (a-z).' };
  if (!c.hasNumber) return { valid: false, error: 'Password must include at least one number (0-9).' };
  if (!c.hasSpecial) {
    return {
      valid: false,
      error: 'Password must include at least one special character (e.g. . _ / ! @ # $ % & *).',
    };
  }
  return { valid: true };
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): { valid: true } | { valid: false; error: string } {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password.' };
  }
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match.' };
  }
  return { valid: true };
}
