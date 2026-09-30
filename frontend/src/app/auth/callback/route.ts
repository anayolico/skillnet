import { getApiUrl } from '@/src/utils/config';
// This file is currently disabled because Supabase is marked as "Legacy/Disabled" 
// and the required utility files (utils/supabase/server) are missing.
// This allows the build to pass while the project migrates to NextAuth.

/*
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
      const apiUrl = getApiUrl();
}
