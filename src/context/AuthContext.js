'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { userService } from '@/services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, error, isLoading } = useUser();
  const [appUser, setAppUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [tokenError, setTokenError] = useState(null);

  // Fetch token from API
  const fetchToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/token');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch token');
      }
      const data = await response.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error('Token fetch error:', error);
      setTokenError(error.message);
      return null;
    }
  }, []);

  // Initialize user data after authentication
  useEffect(() => {
    // Only proceed when auth0 has completed loading and user is authenticated
    if (isLoading) return;
    
    if (!user) {
      setIsInitialized(true);
      setAppUser(null);
      setAccessToken(null);
      return;
    }

    const initializeUser = async () => {
      try {
        // First get the access token
        const token = await fetchToken();
        
        if (!token) {
          console.error('No token available for API calls');
          setIsInitialized(true);
          return;
        }

        // After successful Auth0 login, create or update the user in our database
        const userProfile = await userService.createOrUpdateUserProfile(user, token);
        setAppUser(userProfile);
      } catch (error) {
        console.error('Failed to initialize user:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeUser();
  }, [isLoading, user, fetchToken]);

  // Function to get access token for API calls
  const getToken = useCallback(async () => {
    if (!user) return null;
    
    // If we already have a token, return it
    if (accessToken) return accessToken;
    
    // Otherwise fetch a new token
    return await fetchToken();
  }, [user, accessToken, fetchToken]);

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
      return null;
    }
  }, [user, getToken]);

  const value = {
    isAuthenticated: !!user,
    isLoading: isLoading || !isInitialized,
    user: appUser,
    auth0User: user,
    getToken,
    refreshUserProfile,
    error: error || tokenError
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