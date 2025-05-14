'use client';

import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import useAuthStore from '@/stores/authStore';
import { userService } from '@/services/userService';

export default function AuthProvider({ children }) {
  const { user, isLoading } = useUser();
  const { 
    setUser, 
    clearUser, 
    fetchUserProfile, 
    clearPermissions 
  } = useAuthStore();

  // Sync Auth0 user state with our Zustand store
  useEffect(() => {
    if (isLoading) return;
    
    if (user) {
      setUser(user);
      
      // Register user with our backend (which will handle Kafka integration)
      const registerUser = async () => {
        try {
          await userService.createOrUpdateUserProfile(user);
          // After registration, fetch the full profile which includes data from Kafka events
          await fetchUserProfile();
        } catch (error) {
          console.error('Error syncing user with backend:', error);
        }
      };
      
      registerUser();
    } else {
      clearUser();
      clearPermissions();
    }
  }, [user, isLoading, setUser, clearUser, fetchUserProfile, clearPermissions]);

  return children;
} 