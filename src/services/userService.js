import { apiRequest } from '@/lib/api';

/**
 * Create a new user profile based on Auth0 data
 */
export const createUserProfile = async (auth0User, token) => {
  try {
    const userData = {
      auth0Id: auth0User.sub,
      email: auth0User.email,
      fullName: auth0User.name,
      firstName: auth0User.given_name,
      lastName: auth0User.family_name,
      username: auth0User.nickname || auth0User.email.split('@')[0],
      picture: auth0User.picture,
      emailVerified: auth0User.email_verified
    };

    const newUser = await apiRequest('/api/users/profile', 'post', userData, token);
    
    return newUser;
  } catch (error) {
    throw new Error(error.message || 'Failed to create user profile');
  }
};

/**
 * Sync user profile with Auth0 data (create or update)
 */
export const syncUserProfile = async (auth0User, token) => {
  try {
    const userData = {
      auth0Id: auth0User.sub,
      email: auth0User.email,
      fullName: auth0User.name,
      firstName: auth0User.given_name,
      lastName: auth0User.family_name,
      username: auth0User.nickname || auth0User.email.split('@')[0],
      picture: auth0User.picture,
      emailVerified: auth0User.email_verified
    };

    const user = await apiRequest('/api/users/profile', 'post', userData, token);
    
    return user;
  } catch (error) {
    throw new Error(error.message || 'Failed to sync user profile');
  }
};

/**
 * Get current user profile 
 */
export const getUserProfile = async (token) => {
  try {
    return await apiRequest('/api/users/me', 'get', null, token);
  } catch (error) {
    throw new Error(error.message || 'Failed to get user profile');
  }
};

/**
 * Validate user authorization for a specific action
 */
export const validateAuthorization = async (resource, action, token) => {
  try {
    const response = await apiRequest('/api/auth/validate', 'post', { resource, action }, token);
    return response.authorized === true;
  } catch (error) {
    return false;
  }
};

/**
 * Get user information by username
 */
export const getUserInfo = async (username, token) => {
  try {
    return await apiRequest(`/api/users/username/${username}`, 'get', null, token);
  } catch (error) {
    throw new Error(error.message || 'Failed to get user info');
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData, token) => {
  try {
    return await apiRequest('/api/users/profile', 'put', profileData, token);
  } catch (error) {
    throw new Error(error.message || 'Failed to update user profile');
  }
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (token) => {
  try {
    return await apiRequest('/api/users/me', 'delete', null, token);
  } catch (error) {
    throw new Error(error.message || 'Failed to delete user account');
  }
};

// Export as default object for compatibility
export const userService = {
  createUserProfile,
  syncUserProfile,
  getUserProfile,
  validateAuthorization,
  getUserInfo,
  updateUserProfile,
  deleteUserAccount
}; 