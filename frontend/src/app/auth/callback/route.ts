import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      
      // Sync the user to our backend database immediately after OAuth flow
      try {
        const response = await fetch(`${apiUrl}/api/auth/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ metadata: session.user.user_metadata || {} })
        })
        
        if (!response.ok) {
          console.error('Callback: Failed to sync user to backend', await response.text())
        }
      } catch (e) {
         console.error('Callback: Network error syncing user to backend', e)
      }

      // Check onboarding status to decide where to redirect
      let redirectPath = next
      try {
        const verifyRes = await fetch(`${apiUrl}/api/auth/verify`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        if (verifyRes.ok) {
          const data = await verifyRes.json()
          redirectPath = data.isOnboarded ? '/dashboard' : '/onboarding'
        }
      } catch (e) {
        console.error('Callback: Could not check onboarding status', e)
      }

      return NextResponse.redirect(`${origin}${redirectPath}`)
    }
  }

  // Redirect to login if there's no code or code exchange failed
  return NextResponse.redirect(`${origin}/login?error=true`)
}
