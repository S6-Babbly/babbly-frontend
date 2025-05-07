'use client';

import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import useAuthStore from '@/stores/authStore';

export default function AuthProvider({ children }) {
  const { user, isLoading } = useUser();
  const { setUser, clearUser, fetchUserProfile } = useAuthStore();

  // Sync Auth0 user state with our Zustand store
  useEffect(() => {
    if (isLoading) return;
    
    if (user) {
      setUser(user);
      // Fetch additional user data from our API
      fetchUserProfile();
    } else {
      clearUser();
    }
  }, [user, isLoading, setUser, clearUser, fetchUserProfile]);

  return children;
} 