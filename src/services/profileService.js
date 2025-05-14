import { useAccessToken } from '@/lib/auth0';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010';

// Helper function to make authenticated API requests
const authenticatedFetch = async (endpoint, options = {}) => {
  const { getToken } = useAccessToken();
  const token = await getToken();
  
  if (!token) {
    throw new Error('Authentication token not available');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API request failed with status: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Get a user profile by ID
 * @param {String} userId The user ID
 * @param {Object} params Query parameters
 * @param {Number} params.postsPage Page number for posts (default: 1)
 * @param {Number} params.postsPageSize Posts per page (default: 10)
 * @returns {Promise<Object>} The user profile
 */
export const getProfileById = async (userId, params = {}) => {
  const { postsPage = 1, postsPageSize = 10 } = params;
  return await authenticatedFetch(
    `/api/users/${userId}?postsPage=${postsPage}&postsPageSize=${postsPageSize}`
  );
};

/**
 * Get a user profile by username
 * @param {String} username The username
 * @param {Object} params Query parameters
 * @param {Number} params.postsPage Page number for posts (default: 1)
 * @param {Number} params.postsPageSize Posts per page (default: 10)
 * @returns {Promise<Object>} The user profile
 */
export const getProfileByUsername = async (username, params = {}) => {
  const { postsPage = 1, postsPageSize = 10 } = params;
  return await authenticatedFetch(
    `/api/users/username/${username}?postsPage=${postsPage}&postsPageSize=${postsPageSize}`
  );
};

/**
 * Get the current user's profile
 * @param {Object} params Query parameters
 * @param {Number} params.postsPage Page number for posts (default: 1)
 * @param {Number} params.postsPageSize Posts per page (default: 10)
 * @returns {Promise<Object>} The current user's profile
 */
export const getCurrentProfile = async (params = {}) => {
  const { postsPage = 1, postsPageSize = 10 } = params;
  return await authenticatedFetch(
    `/api/users/me?postsPage=${postsPage}&postsPageSize=${postsPageSize}`
  );
};

/**
 * Update the current user's profile
 * @param {Object} profileData The profile data to update
 * @returns {Promise<Object>} The updated profile
 */
export const updateProfile = async (profileData) => {
  return await authenticatedFetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
};

/**
 * Follow a user
 * @param {String} userId The user ID to follow
 * @returns {Promise<Object>} The follow relationship
 */
export const followUser = async (userId) => {
  return await authenticatedFetch(`/api/users/follow/${userId}`, {
    method: 'POST'
  });
};

/**
 * Unfollow a user
 * @param {String} userId The user ID to unfollow
 * @returns {Promise<Object>} Success response
 */
export const unfollowUser = async (userId) => {
  return await authenticatedFetch(`/api/users/follow/${userId}`, {
    method: 'DELETE'
  });
}; 