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
      global: {
        fetch: async (url, options) => {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000)
          try {
            const res = await fetch(url, { ...options, signal: controller.signal })
            clearTimeout(timeoutId)
            return res
          } catch (e: any) {
            clearTimeout(timeoutId)
            if (e.name === 'AbortError') {
              return new Response(null, { status: 408, statusText: 'Request Timeout' })
            }
            throw e
          }
        },
      },
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
  let user = null
  let session = null

  try {
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser()
    const {
      data: { session: supabaseSession },
    } = await supabase.auth.getSession()

    user = supabaseUser
    session = supabaseSession
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('Supabase Auth connection timed out (3s). Proceeding as unauthenticated.')
    } else {
      console.error('Supabase Auth error in middleware:', error)
    }
  }

  // Route Protection Logic
  const publicRoutes = ['/', '/login', '/join']
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname) || request.nextUrl.pathname.startsWith('/auth')
  
  if (!isPublicRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Secondary check: Verify account in local database for sensitive routes
    const isSensitiveRoute = request.nextUrl.pathname.match(/^\/(dashboard|onboarding|profile|settings|chats|create-listing)/)
    if (isSensitiveRoute) {
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
        // Handle sync error
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'sync-error')
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
