const STORAGE_KEY = 'skillnet_google_oauth_state';
const MAX_STATE_AGE_MS = 10 * 60 * 1000; // 10 minutes

interface StoredOAuthState {
  state: string;
  codeVerifier?: string;
  redirectUri: string;
  createdAt: number;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function generateRandomToken(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

async function createCodeChallenge(verifier: string): Promise<string | null> {
  if (!window.crypto?.subtle) return null;
  const encoded = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', encoded);
  return toBase64Url(new Uint8Array(digest));
}

export async function startGoogleOAuth(): Promise<{ ok: true } | { ok: false; error: string }> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return { ok: false, error: 'Google sign-in is not configured.' };
  }

  const redirectUri = `${window.location.origin}/api/auth/google/callback`;
  const state = generateRandomToken(32);
  const codeVerifier = generateRandomToken(32);
  const codeChallenge = await createCodeChallenge(codeVerifier);

  const payload: StoredOAuthState = {
    state,
    ...(codeChallenge ? { codeVerifier } : {}),
    redirectUri,
    createdAt: Date.now(),
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  if (codeChallenge) {
    params.set('code_challenge', codeChallenge);
    params.set('code_challenge_method', 'S256');
  }

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return { ok: true };
}

export function consumeGoogleOAuthState(
  returnedState: string | null
): { ok: true; codeVerifier?: string; redirectUri: string } | { ok: false; error: string } {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);

  if (!returnedState || !raw) {
    return { ok: false, error: 'Sign-in session expired or invalid. Please try again.' };
  }

  try {
    const parsed = JSON.parse(raw) as StoredOAuthState;
    const isFresh =
      typeof parsed.createdAt === 'number' && Date.now() - parsed.createdAt <= MAX_STATE_AGE_MS;

    if (!isFresh || parsed.state !== returnedState) {
      return { ok: false, error: 'Sign-in verification failed. Please start Google sign-in again.' };
    }

    return {
      ok: true,
      codeVerifier: parsed.codeVerifier,
      redirectUri: parsed.redirectUri,
    };
  } catch {
    return { ok: false, error: 'Invalid sign-in state. Please try again.' };
  }
}
