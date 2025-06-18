import useSWR from 'swr';
import { apiRequest } from './api';

// SWR fetcher that uses our API request function with authentication
export const fetcher = async (url) => {
  try {
    // Try to get token but don't fail if unavailable
    let token = null;
    try {
      const response = await fetch('/api/auth/token');
      if (response.ok) {
        const data = await response.json();
        token = data.accessToken;
      }
    } catch (tokenError) {
      // Silently handle token errors
    }
    
    // Make API call with or without token (backend handles both)
    return await apiRequest(url, 'get', null, token);
  } catch (error) {
    // If auth fails, try again without token
    if (error.message?.includes('401') || error.message?.includes('auth')) {
      try {
        return await apiRequest(url, 'get', null, null);
      } catch (retryError) {
        throw retryError;
      }
    }
    throw error;
  }
};

/**
 * SWR configuration - used by SWRProvider
 */
export default {
  // Default to revalidate data every 5 seconds
  refreshInterval: 5000,
  
  // Revalidate on window focus after 3 seconds
  focusThrottleInterval: 3000,
  
  // Deduplicate requests within a time window
  dedupingInterval: 2000,
  
  // Error retry configuration
  errorRetryCount: 3,
  
  // Suspense mode is disabled as we use custom loading states
  suspense: false,
  
  // Keep previous data when fetching new data
  keepPreviousData: true,
  
  // Revalidate on:
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  
  // Don't automatically revalidate on mount
  revalidateOnMount: true,
};

// Constants for SWR cache keys
export const SWR_KEYS = {
  FEED: '/api/feed',
  PROFILE: (id) => `/api/profiles/id/${id}`,
  PROFILE_BY_USERNAME: (username) => `/api/profiles/username/${username}`,
  CURRENT_PROFILE: '/api/profiles/me',
  POST: (id) => `/api/feed/${id}`,
  COMMENTS: (postId) => `/api/comments/post/${postId}`,
};

// Custom hook for authenticated SWR requests
export const useAuthenticatedSWR = (url, options = {}) => {
  return useSWR(url, fetcher, {
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    ...options,
  });
};

// Custom hook for SWR requests with manual token
export const useSWRWithToken = (url, token, options = {}) => {
  const tokenFetcher = async (url) => {
    return await apiRequest(url, 'get', null, token);
  };

  return useSWR(token ? url : null, tokenFetcher, options);
}; 