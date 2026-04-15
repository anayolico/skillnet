import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshes the session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect routes logic
  const isProtectedRoute = request.nextUrl.pathname.match(/^\/(dashboard|onboarding|profile|settings|messages|create-listing)/);
  if (isProtectedRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // New check: Ensure user exists in local database
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const checkRes = await fetch(`${apiUrl}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!checkRes.ok) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'no-account')
        return NextResponse.redirect(url)
      }
    } catch (e) {
      // In case of backend failure, we might want to allow or block. 
      // For strictness, we'll redirect if we can't verify.
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'sync-error')
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
