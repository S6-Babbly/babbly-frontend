'use client';

// Auth0 configuration and utility functions
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import { jwtDecode } from 'jwt-decode';

// Auth0 Configuration constants
export const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'your-auth0-domain.auth0.com',
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'your-auth0-client-id',
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'https://api.babbly.com',
  redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  scope: 'openid profile email',
};

// Auth0 Provider Component
export const Auth0ProviderWithRedirect = ({ children }) => {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

// Hook to get access token
export const useAccessToken = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  const getToken = async () => {
    if (!isAuthenticated || isLoading) return null;
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  return { getToken, isAuthenticated, isLoading };
};

// Utility function to decode JWT
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Function to get token from our API route
export const getAccessToken = async () => {
  try {
    const response = await fetch('/api/auth/token');
    if (response.ok) {
      const { accessToken } = await response.json();
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
};

// Function to create API headers with auth token
export const createAuthHeaders = async () => {
  const token = await getAccessToken();
  if (!token) return {};
  
  return {
    Authorization: `Bearer ${token}`,
  };
}; 