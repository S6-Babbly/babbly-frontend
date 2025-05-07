import { apiClient } from './api';

// Default fetcher function for SWR that uses our API client
export const fetcher = async (url) => {
  try {
    return await apiClient.get(url);
  } catch (error) {
    throw error;
  }
};

// Default SWR configuration
export const swrConfig = {
  // We need to create a client-safe version of the fetcher
  // This is done in the SWRConfig component
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // Dedupe requests with the same key for 5 seconds
  errorRetryCount: 3, // Retry failed requests 3 times
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

export default swrConfig; 