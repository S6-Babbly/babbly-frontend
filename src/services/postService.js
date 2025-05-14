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
 * Get a paginated list of posts for the feed
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @returns {Promise<Array>} List of aggregated posts
 */
export const getAllPosts = async (params = {}) => {
  const { page = 1, pageSize = 10 } = params;
  return await authenticatedFetch(`/api/posts?page=${page}&pageSize=${pageSize}`);
};

/**
 * Get a single post with full details including comments
 * @param {String} postId The post ID
 * @returns {Promise<Object>} The post object with comments
 */
export const getPostById = async (postId) => {
  return await authenticatedFetch(`/api/posts/${postId}`);
};

/**
 * Create a new post
 * @param {Object} postData The post data
 * @param {String} postData.content The post content
 * @param {String} postData.mediaUrl Optional media URL
 * @returns {Promise<Object>} The created post
 */
export const createPost = async (postData) => {
  return await authenticatedFetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
};

/**
 * Update an existing post
 * @param {String} postId The post ID
 * @param {Object} postData The updated post data
 * @returns {Promise<Object>} The updated post
 */
export const updatePost = async (postId, postData) => {
  return await authenticatedFetch(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
};

/**
 * Delete a post
 * @param {String} postId The post ID
 * @returns {Promise<Object>} Success response
 */
export const deletePost = async (postId) => {
  return await authenticatedFetch(`/api/posts/${postId}`, {
    method: 'DELETE'
  });
};

/**
 * Like or unlike a post
 * @param {String} postId The post ID
 * @returns {Promise<Object>} Updated like status
 */
export const likePost = async (postId) => {
  return await authenticatedFetch(`/api/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ postId })
  });
};

/**
 * Unlike a post
 * @param {String} postId The post ID
 * @returns {Promise<Object>} Updated like status
 */
export const unlikePost = async (postId) => {
  return await authenticatedFetch(`/api/likes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ postId })
  });
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
  return await authenticatedFetch(`/api/posts/user/${userId}?page=${page}&pageSize=${pageSize}`);
}; 