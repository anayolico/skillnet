import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add the paths you want to protect here
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  '/catalog',
  '/marketplace',
  '/escrow',
  '/chats',
  '/create-listing'
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const token = request.cookies.get('token')?.value;
  const isOnboarded = request.cookies.get('onboarded')?.value === 'true';
  
  // Check if path is protected
  const isProtectedPath = protectedPaths.some(p => path === p || path.startsWith(`${p}/`));
  
  if (isProtectedPath) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (!isOnboarded) {
      // Redirect to onboarding if not onboarded
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }
  
  // If user is accessing /onboarding
  if (path === '/onboarding') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (isOnboarded) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // Optional: If user is logged in, prevent them from accessing /login or /register
  const isAuthPath = path === '/login' || path === '/register';
  if (isAuthPath) {
    if (token) {
      if (!isOnboarded) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
