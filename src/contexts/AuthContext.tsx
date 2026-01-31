'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import type { User } from '@/types/user';

interface AuthContextValue {
  user: User | null;
  isLoaded: boolean;
  login: () => void;
  logout: () => void;
  setUserFromCredential: (credential: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = 'outboxlab_user';

function parseJwtPayload(token: string): { sub: string; email?: string; name?: string; picture?: string } | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as { sub: string; email?: string; name?: string; picture?: string };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const setUserFromCredential = useCallback((credential: string) => {
    const payload = parseJwtPayload(credential);
    if (payload) {
      const u: User = {
        id: payload.sub,
        email: payload.email ?? '',
        name: payload.name ?? null,
        picture: payload.picture,
      };
      setUserState(u);
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
      }
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          const u: User = {
            id: data.sub,
            email: data.email ?? '',
            name: data.name ?? null,
            picture: data.picture,
          };
          setUserState(u);
          if (typeof window !== 'undefined') {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
            try { router.push('/dashboard'); } catch {}
          }
        })
        .catch(console.error);
    },
    onError: () => console.error('Google login failed'),
    flow: 'implicit',
  });

  const logout = useCallback(() => {
    setUserState(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    try { router.push('/'); } catch {}
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        const u = JSON.parse(stored) as User;
        if (u?.id && u?.email) setUserState(u);
      } catch {}
    }
    setIsLoaded(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoaded, login, logout, setUserFromCredential }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
