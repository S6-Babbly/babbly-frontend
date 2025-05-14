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
 * Get comments for a specific post
 * @param {String} postId The post ID
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @returns {Promise<Array>} List of comments
 */
export const getPostComments = async (postId, params = {}) => {
  const { page = 1, pageSize = 10 } = params;
  return await authenticatedFetch(`/api/comments/post/${postId}?page=${page}&pageSize=${pageSize}`);
};

/**
 * Create a new comment on a post
 * @param {String} postId The post ID
 * @param {Object} commentData The comment data
 * @param {String} commentData.content The comment content
 * @returns {Promise<Object>} The created comment
 */
export const createComment = async (postId, commentData) => {
  return await authenticatedFetch(`/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId,
      ...commentData
    })
  });
};

/**
 * Update an existing comment
 * @param {String} commentId The comment ID
 * @param {Object} commentData The updated comment data
 * @returns {Promise<Object>} The updated comment
 */
export const updateComment = async (commentId, commentData) => {
  return await authenticatedFetch(`/api/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commentData)
  });
};

/**
 * Delete a comment
 * @param {String} commentId The comment ID
 * @returns {Promise<Object>} Success response
 */
export const deleteComment = async (commentId) => {
  return await authenticatedFetch(`/api/comments/${commentId}`, {
    method: 'DELETE'
  });
};

/**
 * Like a comment
 * @param {String} commentId The comment ID
 * @returns {Promise<Object>} Updated like status
 */
export const likeComment = async (commentId) => {
  return await authenticatedFetch(`/api/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      commentId 
    })
  });
};

/**
 * Unlike a comment
 * @param {String} commentId The comment ID
 * @returns {Promise<Object>} Updated like status
 */
export const unlikeComment = async (commentId) => {
  return await authenticatedFetch(`/api/likes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      commentId 
    })
  });
}; 