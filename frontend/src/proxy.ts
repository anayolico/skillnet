import { type NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  // In the future, we can add NextAuth middleware logic here
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
