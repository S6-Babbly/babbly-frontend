'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { userService } from '@/services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, error, isLoading } = useUser();
  const [appUser, setAppUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Get access token for API calls using NextJS Auth0's built-in method
  const getToken = useCallback(async () => {
    if (!user) return null;
    
    try {
      const response = await fetch('/api/auth/token');
      if (!response.ok) {
        if (response.status === 401) {
          return null; // User not authenticated
        }
        throw new Error('Failed to fetch token');
      }
      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error('Token fetch error:', error);
      setAuthError(error.message);
      return null;
    }
  }, [user]);

  // Initialize user data after authentication
  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      // User is not logged in
      setIsInitialized(true);
      setAppUser(null);
      setAuthError(null);
      return;
    }

    // User is logged in, sync with backend
    const initializeUser = async () => {
      try {
        const token = await getToken();
        
        if (!token) {
          console.log('No token available - user may need to complete authentication');
          setIsInitialized(true);
          return;
        }

        // Sync user profile with backend
        try {
          const userProfile = await userService.createOrUpdateUserProfile(user, token);
          setAppUser(userProfile);
          setAuthError(null);
          
          console.log('User profile synchronized successfully:', {
            auth0Id: userProfile.auth0Id,
            email: userProfile.email,
            id: userProfile.id
          });
        } catch (profileError) {
          console.error('Failed to sync user profile (non-fatal):', profileError);
          // Set a temporary user object based on Auth0 data to allow the user to proceed
          setAppUser({
            auth0Id: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture,
            emailVerified: user.email_verified,
            // Mark as not synced so we can retry later
            _profileSyncPending: true
          });
          setAuthError('Profile sync pending - some features may be limited');
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
        setAuthError(error.message);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeUser();
  }, [isLoading, user, getToken]);

  // Refresh user profile
  const refreshUserProfile = useCallback(async () => {
    if (!user) return null;
    
    try {
      const token = await getToken();
      if (!token) return null;
      
      const profile = await userService.getCurrentUserProfile(token);
      setAppUser(profile);
      return profile;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      setAuthError(error.message);
      return null;
    }
  }, [user, getToken]);

  const value = {
    // Authentication state
    isAuthenticated: !!user,
    isLoading: isLoading || !isInitialized,
    
    // User data
    user: appUser,           // App-specific user data from backend
    auth0User: user,         // Raw Auth0 user data
    
    // Methods
    getToken,
    refreshUserProfile,
    
    // Error handling
    error: error || authError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 