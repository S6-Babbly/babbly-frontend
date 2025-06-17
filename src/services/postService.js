import { apiRequest } from '@/lib/api';

/**
 * Get a paginated list of posts for the feed (demo mode: auth optional)
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @param {String} token Authentication token (optional for demo)
 * @returns {Promise<Array>} List of aggregated posts
 */
export const getAllPosts = async (params = {}, token = null) => {
  const { page = 1, pageSize = 10 } = params;
  return await apiRequest(`/api/posts?page=${page}&pageSize=${pageSize}`, 'get', null, token);
};

/**
 * Get a single post with full details including comments (demo mode: auth optional)
 * @param {String} postId The post ID
 * @param {String} token Authentication token (optional for demo)
 * @returns {Promise<Object>} The post object with comments
 */
export const getPostById = async (postId, token = null) => {
  return await apiRequest(`/api/posts/${postId}`, 'get', null, token);
};

/**
 * Create a new post (demo mode: auth optional)
 * @param {Object} postData The post data
 * @param {String} postData.content The post content
 * @param {String} postData.mediaUrl Optional media URL
 * @param {String} postData.userId Optional user ID for demo mode
 * @param {String} token Authentication token (optional for demo)
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
  
  // Prepare request data
  const requestData = {
    content: formattedData.content.trim()
  };
  
  if (formattedData.mediaUrl) {
    requestData.mediaUrl = formattedData.mediaUrl;
  }
  
  // For demo mode: include userId if provided (backend will use this or default)
  if (formattedData.userId) {
    requestData.userId = formattedData.userId;
  }
    
  return await apiRequest('/api/posts', 'post', requestData, token);
};

/**
 * Update an existing post (demo mode: auth optional)
 * @param {String} postId The post ID
 * @param {Object} postData The updated post data
 * @param {String} token Authentication token (optional for demo)
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
 * Delete a post (demo mode: auth optional)
 * @param {String} postId The post ID
 * @param {String} token Authentication token (optional for demo)
 * @returns {Promise<Object>} Success response
 */
export const deletePost = async (postId, token = null) => {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  return await apiRequest(`/api/posts/${postId}`, 'delete', null, token);
};

/**
 * Like or unlike a post (demo mode: auth optional)
 * @param {String} postId The post ID
 * @param {String} token Authentication token (optional for demo)
 * @returns {Promise<Object>} Updated like status
 */
export const likePost = async (postId, token = null) => {
  return await apiRequest('/api/likes', 'post', { postId }, token);
};

/**
 * Unlike a post (demo mode: auth optional)
 * @param {String} postId The post ID
 * @param {String} token Authentication token (optional for demo)
 * @returns {Promise<Object>} Updated like status
 */
export const unlikePost = async (postId, token = null) => {
  return await apiRequest('/api/likes', 'delete', { postId }, token);
};

/**
 * Get posts by a specific user (demo mode: auth optional)
 * @param {String} userId The user ID
 * @param {Object} params Query parameters
 * @param {Number} params.page Page number (default: 1)
 * @param {Number} params.pageSize Items per page (default: 10)
 * @param {String} token Authentication token (optional for demo)
 * @returns {Promise<Array>} List of user's posts
 */
export const getUserPosts = async (userId, params = {}, token = null) => {
  const { page = 1, pageSize = 10 } = params;
  return await apiRequest(`/api/posts/user/${userId}?page=${page}&pageSize=${pageSize}`, 'get', null, token);
}; 