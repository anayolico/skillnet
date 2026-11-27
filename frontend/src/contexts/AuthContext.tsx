'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getApiUrl } from '../utils/config';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  isOnboarded?: boolean;
  subscriptionTier?: string;
  profile?: {
    experienceLevel?: string;
    headline?: string;
  };
}

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

interface GoogleLoginPayload {
  code: string;
  codeVerifier?: string;
  redirectUri?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (payload: string | GoogleLoginPayload) => Promise<AuthResult>;
  refreshSession: (newToken?: string, updatedUser?: User) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // Matches 7-day JWT lifetime

function setCookie(name: string, value: string) {
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${secure}`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = (authToken: string, userData: User) => {
    localStorage.setItem('token', authToken);
    setCookie('token', authToken);
    setCookie('onboarded', String(Boolean(userData.isOnboarded)));
    setToken(authToken);
    setUser(userData);
  };

  const clearSession = () => {
    localStorage.removeItem('token');
    clearCookie('token');
    clearCookie('onboarded');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setCookie('token', storedToken);
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const res = await fetch(`${getApiUrl()}/api/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCookie('onboarded', String(Boolean(data.user.isOnboarded)));
        setUser(data.user);
      } else {
        clearSession();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      persistSession(data.token, data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const googleLogin = async (payload: string | GoogleLoginPayload): Promise<AuthResult> => {
    try {
      const body = typeof payload === 'string' ? { code: payload } : payload;

      const res = await fetch(`${getApiUrl()}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Google login failed' };
      }

      persistSession(data.token, data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const refreshSession = async (newToken?: string, updatedUser?: User) => {
    const activeToken = newToken || token || localStorage.getItem('token');
    if (!activeToken) return;

    if (newToken && updatedUser) {
      persistSession(newToken, updatedUser);
      return;
    }

    if (newToken) {
      localStorage.setItem('token', newToken);
      setCookie('token', newToken);
      setToken(newToken);
    }

    await fetchUser(activeToken);
  };

  const logout = async () => {
    const activeToken = token || localStorage.getItem('token');
    clearSession();

    if (activeToken) {
      try {
        await fetch(`${getApiUrl()}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}` },
        });
      } catch {
        // Local session is already cleared; ignore transient network error on logout
      }
    }
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        googleLogin,
        refreshSession,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
