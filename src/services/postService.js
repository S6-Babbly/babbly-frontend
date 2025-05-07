import { apiClient } from '@/lib/api';

/**
 * Get a paginated list of posts for the feed
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @returns {Promise<Array>} List of aggregated posts
 */
export const getAllPosts = async (params = {}) => {
  const { page = 1, pageSize = 10 } = params;
  return await apiClient.get(`/api/feed?page=${page}&pageSize=${pageSize}`);
};

/**
 * Get a single post with full details including comments
 * @param {String} postId The post ID
 * @returns {Promise<Object>} The post object with comments
 */
export const getPostById = async (postId) => {
  return await apiClient.get(`/api/feed/${postId}`);
};

/**
 * Create a new post
 * @param {Object} postData The post data
 * @param {String} postData.content The post content
 * @param {String} postData.mediaUrl Optional media URL
 * @returns {Promise<Object>} The created post
 */
export const createPost = async (postData) => {
  return await apiClient.post('/api/posts', postData);
};

/**
 * Update an existing post
 * @param {String} postId The post ID
 * @param {Object} postData The updated post data
 * @returns {Promise<Object>} The updated post
 */
export const updatePost = async (postId, postData) => {
  return await apiClient.put(`/api/posts/${postId}`, postData);
};

/**
 * Delete a post
 * @param {String} postId The post ID
 * @returns {Promise<Object>} Success response
 */
export const deletePost = async (postId) => {
  return await apiClient.delete(`/api/posts/${postId}`);
};

/**
 * Like or unlike a post
 * @param {String} postId The post ID
 * @returns {Promise<Object>} Updated like status
 */
export const likePost = async (postId) => {
  return await apiClient.post(`/api/likes/post/${postId}`);
};

/**
 * Get posts by a specific user
 * @param {String} userId The user ID
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @returns {Promise<Array>} List of user's posts
 */
export const getUserPosts = async (userId, params = {}) => {
  const { page = 1, pageSize = 10 } = params;
  return await apiClient.get(`/api/profiles/id/${userId}?postsPage=${page}&postsPageSize=${pageSize}`);
}; 