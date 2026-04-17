import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
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
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
