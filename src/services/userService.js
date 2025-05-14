import { apiRequest } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010';

export const userService = {
  // Create or update user profile after Auth0 login
  async createOrUpdateUserProfile(userProfile, token) {
    if (!userProfile) {
      throw new Error('User profile is required');
    }
    
    try {
      return await apiRequest(
        '/api/users/profile',
        'post',
        {
          auth0Id: userProfile.sub,
          email: userProfile.email,
          name: userProfile.name,
          picture: userProfile.picture
        },
        token
      );
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  },
  
  // Get the current user's profile
  async getCurrentUserProfile(token) {
    if (!token) {
      throw new Error('Authentication token not available');
    }
    
    try {
      return await apiRequest('/api/users/me', 'get', null, token);
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },
  
  // Validate authorization for a specific resource via Auth service
  async validateAuthorization(resourcePath, operation, token) {
    if (!token) {
      return false;
    }
    
    try {
      const result = await apiRequest(
        `/api/auth/authorize?resourcePath=${encodeURIComponent(resourcePath)}&operation=${encodeURIComponent(operation)}`,
        'get',
        null,
        token
      );
      return result.isAuthorized === true;
    } catch (error) {
      console.error('Error validating authorization:', error);
      return false;
    }
  },
  
  // Get user info from token
  async getUserInfo(token) {
    if (!token) {
      throw new Error('Authentication token not available');
    }
    
    try {
      return await apiRequest('/api/auth/userinfo', 'get', null, token);
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }
}; 