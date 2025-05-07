import { apiClient } from '@/lib/api';

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
  return await apiClient.get(`/api/profiles/id/${userId}?postsPage=${postsPage}&postsPageSize=${postsPageSize}`);
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
  return await apiClient.get(`/api/profiles/username/${username}?postsPage=${postsPage}&postsPageSize=${postsPageSize}`);
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
  return await apiClient.get(`/api/profiles/me?postsPage=${postsPage}&postsPageSize=${postsPageSize}`);
};

/**
 * Update the current user's profile
 * @param {Object} profileData The profile data to update
 * @returns {Promise<Object>} The updated profile
 */
export const updateProfile = async (profileData) => {
  return await apiClient.put('/api/users/profile', profileData);
};

/**
 * Follow a user
 * @param {String} userId The user ID to follow
 * @returns {Promise<Object>} The follow relationship
 */
export const followUser = async (userId) => {
  return await apiClient.post(`/api/users/follow/${userId}`);
};

/**
 * Unfollow a user
 * @param {String} userId The user ID to unfollow
 * @returns {Promise<Object>} Success response
 */
export const unfollowUser = async (userId) => {
  return await apiClient.delete(`/api/users/follow/${userId}`);
}; 