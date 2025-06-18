import { apiRequest } from '@/lib/api';

/**
 * Get a paginated list of posts for the feed
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @param {String} token Authentication token (optional)
 * @returns {Promise<Array>} List of aggregated posts
 */
export const getAllPosts = async (params = {}, token = null) => {
  const { page = 1, pageSize = 10 } = params;
  return await apiRequest(`/api/posts?page=${page}&pageSize=${pageSize}`, 'get', null, token);
};

/**
 * Get a single post with full details including comments
 * @param {String} postId The post ID
 * @param {String} token Authentication token (optional)
 * @returns {Promise<Object>} The post object with comments
 */
export const getPostById = async (postId, token = null) => {
  return await apiRequest(`/api/posts/${postId}`, 'get', null, token);
};

/**
 * Create a new post
 * @param {Object} postData The post data
 * @param {String} postData.content The post content
 * @param {String} postData.mediaUrl Optional media URL
 * @param {String} token Authentication token (required)
 * @returns {Promise<Object>} The created post
 */
export const createPost = async (postData, token = null) => {
  // Ensure postData is an object with content property
  const formattedData = typeof postData === 'string' 
    ? { content: postData } 
    : postData;
  
  // Client-side validation to match backend
  if (!formattedData.content || !formattedData.content.trim()) {
    throw new Error('Post content cannot be empty');
  }
  
  if (formattedData.content.length > 280) {
    throw new Error('Post content cannot exceed 280 characters');
  }
  
  // Authentication is required for creating posts
  if (!token) {
    throw new Error('Authentication required to create posts');
  }
  
  // Prepare request data - backend will get userId from JWT token
  const requestData = {
    content: formattedData.content.trim()
  };
  
  if (formattedData.mediaUrl) {
    requestData.mediaUrl = formattedData.mediaUrl;
  }
    
  return await apiRequest('/api/posts', 'post', requestData, token);
};

/**
 * Update an existing post
 * @param {String} postId The post ID
 * @param {Object} postData The updated post data
 * @param {String} token Authentication token (optional)
 * @returns {Promise<Object>} The updated post
 */
export const updatePost = async (postId, postData, token = null) => {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  // Client-side validation for content if being updated
  if (postData.content !== undefined) {
    if (!postData.content || !postData.content.trim()) {
      throw new Error('Post content cannot be empty');
    }
    
    if (postData.content.length > 280) {
      throw new Error('Post content cannot exceed 280 characters');
    }
  }
  
  // Only send content and mediaUrl - backend handles authorization
  const requestData = {};
  
  if (postData.content !== undefined) {
    requestData.content = postData.content.trim();
  }
  
  if (postData.mediaUrl !== undefined) {
    requestData.mediaUrl = postData.mediaUrl;
  }
  
  return await apiRequest(`/api/posts/${postId}`, 'put', requestData, token);
};

/**
 * Delete a post
 * @param {String} postId The post ID
 * @param {String} token Authentication token (optional)
 * @returns {Promise<Object>} Success response
 */
export const deletePost = async (postId, token = null) => {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  return await apiRequest(`/api/posts/${postId}`, 'delete', null, token);
};

/**
 * Like or unlike a post
 * @param {String} postId The post ID
 * @param {String} token Authentication token (required)
 * @returns {Promise<Object>} Updated like status
 */
export const likePost = async (postId, token = null) => {
  if (!token) {
    throw new Error('Authentication required to like posts');
  }
  
  // Backend will get userId from JWT token
  return await apiRequest('/api/likes', 'post', { postId }, token);
};

/**
 * Unlike a post
 * @param {String} postId The post ID
 * @param {String} token Authentication token (required)
 * @returns {Promise<Object>} Updated like status
 */
export const unlikePost = async (postId, token = null) => {
  if (!token) {
    throw new Error('Authentication required to unlike posts');
  }
  
  // Backend will get userId from JWT token
  return await apiRequest('/api/likes/unlike', 'post', { postId }, token);
};

/**
 * Get posts by a specific user
 * @param {String} userId The user ID
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @param {String} token Authentication token (optional)
 * @returns {Promise<Array>} List of user's posts
 */
export const getUserPosts = async (userId, params = {}, token = null) => {
  const { page = 1, pageSize = 10 } = params;
  return await apiRequest(`/api/posts/user/${userId}?page=${page}&pageSize=${pageSize}`, 'get', null, token);
}; 