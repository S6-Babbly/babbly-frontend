'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { apiRequest } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user: auth0User, error: auth0Error, isLoading: auth0Loading } = useUser();
  const [appUser, setAppUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get access token
  const getToken = useCallback(async () => {
    if (!auth0User) return null;
    
    try {
      const response = await fetch('/api/auth/token');
      if (!response.ok) return null;
      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      return null;
    }
  }, [auth0User]);

  // Initialize user when Auth0 user changes
  useEffect(() => {
    if (auth0Loading) return;
    
    if (!auth0User) {
      setAppUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const initUser = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('No access token available');
        }

        // Step 1: Check if user exists
        let backendUser = null;
        try {
          backendUser = await apiRequest('/api/users/me', 'get', null, token);
        } catch (checkError) {
          if (checkError.message.includes('not found') || checkError.message.includes('404')) {
            // Step 2: Create new user
            const userData = {
              auth0Id: auth0User.sub,
              email: auth0User.email,
              fullName: auth0User.name,
              firstName: auth0User.given_name,
              lastName: auth0User.family_name,
              username: auth0User.nickname || auth0User.email.split('@')[0],
              picture: auth0User.picture,
              emailVerified: auth0User.email_verified
            };
            
            backendUser = await apiRequest('/api/users/profile', 'post', userData, token);
          } else {
            throw checkError; // Re-throw other errors
          }
        }

        setAppUser(backendUser);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, [auth0User, auth0Loading, getToken]);

  const value = {
    // Auth state
    isAuthenticated: !!auth0User && !!appUser,
    isLoading: auth0Loading || isLoading,
    
    // User data
    user: appUser,
    auth0User,
    
    // Utils
    getToken,
    
    // Errors
    error: auth0Error?.message || error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}; 