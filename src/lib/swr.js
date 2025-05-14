import { apiClient } from './api';

// Default fetcher function for SWR that uses our API client
export const fetcher = async (url) => {
  try {
    return await apiClient.get(url);
  } catch (error) {
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