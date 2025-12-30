
// src/firebase/auth/use-user.tsx
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '../provider';
import { useRouter } from 'next/navigation';

/**
 * A hook to get the current Firebase Auth user.
 * This is fast and only communicates with the auth service.
 * It does NOT touch Firestore.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is highly optimized and fast.
    const unsubscribe = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}

/**
 * A hook to protect a route and ensure a user is authenticated.
 * It redirects to a login page if the user is not signed in.
 */
export function useRequireUser(redirectTo = '/login') {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If the auth state is done loading and there's no user, redirect.
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}

/**
 * A hook to redirect an authenticated user away from public-only pages.
 * It redirects to the home page if the user is signed in.
 */
export function useRedirectIfAuthenticated(redirectTo = '/') {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push(redirectTo);
        }
    }, [user, loading, router, redirectTo]);

    return { user, loading };
}
