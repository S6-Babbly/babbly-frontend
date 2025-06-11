import { apiRequest } from '@/lib/api';

/**
 * Get comments for a specific post
 * @param {String} postId The post ID
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @param {String} token Authentication token
 * @returns {Promise<Array>} List of comments
 */
export const getPostComments = async (postId, params = {}, token) => {
  const { page = 1, pageSize = 10 } = params;
  return await apiRequest(`/api/comments/post/${postId}?page=${page}&pageSize=${pageSize}`, 'get', null, token);
};

/**
 * Create a new comment on a post
 * @param {String} postId The post ID
 * @param {Object} commentData The comment data
 * @param {String} commentData.content The comment content
 * @param {String} token Authentication token
 * @returns {Promise<Object>} The created comment
 */
export const createComment = async (postId, commentData, token) => {
  return await apiRequest('/api/comments', 'post', {
    postId,
    ...commentData
  }, token);
};

/**
 * Update an existing comment
 * @param {String} commentId The comment ID
 * @param {Object} commentData The updated comment data
 * @param {String} token Authentication token
 * @returns {Promise<Object>} The updated comment
 */
export const updateComment = async (commentId, commentData, token) => {
  return await apiRequest(`/api/comments/${commentId}`, 'put', commentData, token);
};

/**
 * Delete a comment
 * @param {String} commentId The comment ID
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Success response
 */
export const deleteComment = async (commentId, token) => {
  return await apiRequest(`/api/comments/${commentId}`, 'delete', null, token);
};

/**
 * Like a comment
 * @param {String} commentId The comment ID
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Updated like status
 */
export const likeComment = async (commentId, token) => {
  return await apiRequest('/api/likes', 'post', { commentId }, token);
};

/**
 * Unlike a comment
 * @param {String} commentId The comment ID
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Updated like status
 */
export const unlikeComment = async (commentId, token) => {
  return await apiRequest('/api/likes', 'delete', { commentId }, token);
}; 