import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  '/catalog',
  '/marketplace',
  '/escrow',
  '/chats',
  '/create-listing',
];

interface VerifiedJwtPayload {
  userId?: string;
  sub?: string;
  email?: string;
  isOnboarded?: boolean;
  exp?: number;
}

function base64UrlToUint8Array(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function verifyJwtEdge(token: string, secret: string): Promise<VerifiedJwtPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    const headerJson = new TextDecoder().decode(base64UrlToUint8Array(headerB64));
    const header = JSON.parse(headerJson) as { alg?: string };
    if (header.alg !== 'HS256') return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBytes = base64UrlToUint8Array(signatureB64);
    const signatureBuffer = signatureBytes.buffer.slice(
      signatureBytes.byteOffset,
      signatureBytes.byteOffset + signatureBytes.byteLength
    ) as ArrayBuffer;

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      encoder.encode(`${headerB64}.${payloadB64}`)
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(payloadB64));
    const payload = JSON.parse(payloadJson) as VerifiedJwtPayload;

    if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    if (!payload.userId && !payload.sub) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some((p) => path === p || path.startsWith(`${p}/`));
  const isOnboardingPath = path === '/onboarding';

  if (!isProtectedPath && !isOnboardingPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const secret = process.env.AUTH_SECRET || process.env.SUPABASE_JWT_SECRET;

  let verifiedPayload: VerifiedJwtPayload | null = null;
  if (token && secret) {
    verifiedPayload = await verifyJwtEdge(token, secret);
  }

  if (!verifiedPayload) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    if (token) {
      response.cookies.delete('token');
      response.cookies.delete('onboarded');
    }
    return response;
  }

  // Trust signed JWT claim; only fall back to cookie for pre-existing verified legacy tokens
  const isOnboarded =
    typeof verifiedPayload.isOnboarded === 'boolean'
      ? verifiedPayload.isOnboarded
      : request.cookies.get('onboarded')?.value === 'true';

  if (isProtectedPath && !isOnboarded) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (isOnboardingPath && isOnboarded) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
