'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { consumeGoogleOAuthState } from '@/src/utils/googleOAuth';
import BrandLogo from '@/components/BrandLogo';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { googleLogin } = useAuth();
  const { showToast } = useToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const oauthError = searchParams.get('error');
    const code = searchParams.get('code');
    const returnedState = searchParams.get('state');

    // Immediately strip sensitive authorization code & state from browser URL/history
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, '/api/auth/google/callback');
    }

    if (oauthError) {
      consumeGoogleOAuthState(null);
      showToast(
        oauthError === 'access_denied'
          ? 'Google sign-in was cancelled.'
          : 'Google sign-in could not be completed.',
        'error'
      );
      router.replace('/login');
      return;
    }

    if (!code) {
      consumeGoogleOAuthState(null);
      showToast('No authorization code received.', 'error');
      router.replace('/login');
      return;
    }

    const stateCheck = consumeGoogleOAuthState(returnedState);
    if (!stateCheck.ok) {
      showToast(stateCheck.error, 'error');
      router.replace('/login');
      return;
    }

    const handleLogin = async () => {
      const result = await googleLogin({
        code,
        codeVerifier: stateCheck.codeVerifier,
        redirectUri: stateCheck.redirectUri,
      });

      if (result.success) {
        router.replace(result.user?.isOnboarded ? '/dashboard' : '/onboarding');
      } else {
        showToast(result.error || 'Google login failed.', 'error');
        router.replace('/login');
      }
    };

    handleLogin();
  }, [searchParams, googleLogin, router, showToast]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.1rem',
        background: '#f7f9fc',
        padding: '1.5rem',
      }}
    >
      <BrandLogo variant="dark" size="md" />
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #0a1f3c',
          borderRadius: '50%',
          animation: 'spin 0.85s linear infinite',
        }}
      />
      <p style={{ fontSize: '0.94rem', color: '#475569', fontWeight: 500 }}>
        Completing secure Google sign-in...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f7f9fc',
            color: '#475569',
          }}
        >
          Loading...
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
