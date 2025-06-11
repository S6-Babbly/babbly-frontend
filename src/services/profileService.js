import { apiRequest } from '@/lib/api';

/**
 * Get a user profile by ID
 * @param {String} userId The user ID
 * @param {Object} params Query parameters
 * @param {Number} params.postsPage Page number for posts (default: 1)
 * @param {Number} params.postsPageSize Posts per page (default: 10)
 * @param {String} token Authentication token
 * @returns {Promise<Object>} The user profile
 */
export const getProfileById = async (userId, params = {}, token) => {
  const { postsPage = 1, postsPageSize = 10 } = params;
  return await apiRequest(
    `/api/users/${userId}?postsPage=${postsPage}&postsPageSize=${postsPageSize}`,
    'get',
    null,
    token
  );
};

/**
 * Get a user profile by username
 * @param {String} username The username
 * @param {Object} params Query parameters
 * @param {Number} params.postsPage Page number for posts (default: 1)
 * @param {Number} params.postsPageSize Posts per page (default: 10)
 * @param {String} token Authentication token
 * @returns {Promise<Object>} The user profile
 */
export const getProfileByUsername = async (username, params = {}, token) => {
  const { postsPage = 1, postsPageSize = 10 } = params;
  return await apiRequest(
    `/api/users/username/${username}?postsPage=${postsPage}&postsPageSize=${postsPageSize}`,
    'get',
    null,
    token
  );
};

/**
 * Get the current user's profile
 * @param {Object} params Query parameters
 * @param {Number} params.postsPage Page number for posts (default: 1)
 * @param {Number} params.postsPageSize Posts per page (default: 10)
 * @param {String} token Authentication token
 * @returns {Promise<Object>} The current user's profile
 */
export const getCurrentProfile = async (params = {}, token) => {
  const { postsPage = 1, postsPageSize = 10 } = params;
  return await apiRequest(
    `/api/users/me?postsPage=${postsPage}&postsPageSize=${postsPageSize}`,
    'get',
    null,
    token
  );
};

/**
 * Update the current user's profile
 * @param {Object} profileData The profile data to update
 * @param {String} token Authentication token
 * @returns {Promise<Object>} The updated profile
 */
export const updateProfile = async (profileData, token) => {
  return await apiRequest('/api/users/profile', 'put', profileData, token);
};

/**
 * Follow a user
 * @param {String} userId The user ID to follow
 * @param {String} token Authentication token
 * @returns {Promise<Object>} The follow relationship
 */
export const followUser = async (userId, token) => {
  return await apiRequest(`/api/users/follow/${userId}`, 'post', null, token);
};

/**
 * Unfollow a user
 * @param {String} userId The user ID to unfollow
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Success response
 */
export const unfollowUser = async (userId, token) => {
  return await apiRequest(`/api/users/follow/${userId}`, 'delete', null, token);
}; 