import { apiClient } from '@/lib/api';

/**
 * Get comments for a specific post
 * @param {String} postId The post ID
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @returns {Promise<Array>} List of comments
 */
export const getPostComments = async (postId, params = {}) => {
  const { page = 1, pageSize = 10 } = params;
  return await apiClient.get(`/api/comments/post/${postId}?page=${page}&pageSize=${pageSize}`);
};

/**
 * Create a new comment on a post
 * @param {String} postId The post ID
 * @param {Object} commentData The comment data
 * @param {String} commentData.content The comment content
 * @returns {Promise<Object>} The created comment
 */
export const createComment = async (postId, commentData) => {
  return await apiClient.post(`/api/comments/post/${postId}`, commentData);
};

/**
 * Update an existing comment
 * @param {String} commentId The comment ID
 * @param {Object} commentData The updated comment data
 * @returns {Promise<Object>} The updated comment
 */
export const updateComment = async (commentId, commentData) => {
  return await apiClient.put(`/api/comments/${commentId}`, commentData);
};

/**
 * Delete a comment
 * @param {String} commentId The comment ID
 * @returns {Promise<Object>} Success response
 */
export const deleteComment = async (commentId) => {
  return await apiClient.delete(`/api/comments/${commentId}`);
};

/**
 * Like or unlike a comment
 * @param {String} commentId The comment ID
 * @returns {Promise<Object>} Updated like status
 */
export const likeComment = async (commentId) => {
  return await apiClient.post(`/api/likes/comment/${commentId}`);
}; 