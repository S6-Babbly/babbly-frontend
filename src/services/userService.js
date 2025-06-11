import { apiRequest } from '@/lib/api';

export const userService = {
  // Create or update user profile after Auth0 login
  async createOrUpdateUserProfile(userProfile, token) {
    if (!userProfile) {
      throw new Error('User profile is required');
    }
    
    if (!token) {
      throw new Error('Authentication token is required');
    }
    
    try {
      const profileData = {
        auth0Id: userProfile.sub,
        email: userProfile.email,
        fullName: userProfile.name,
        firstName: userProfile.given_name,
        lastName: userProfile.family_name,
        username: userProfile.nickname || userProfile.preferred_username,
        picture: userProfile.picture,
        emailVerified: userProfile.email_verified,
        updatedAt: userProfile.updated_at
      };
      
      const result = await apiRequest(
        '/api/users/profile',
        'post',
        profileData,
        token
      );
      
      console.log('User profile sync successful:', {
        auth0Id: result.auth0Id,
        email: result.email,
        id: result.id,
        isNewUser: !result.updatedAt || result.createdAt === result.updatedAt
      });
      
      return result;
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      
      // Enhance error message for better debugging
      if (error.message.includes('Auth0Id is required')) {
        throw new Error('Invalid Auth0 user data - missing user ID');
      } else if (error.message.includes('Email is required')) {
        throw new Error('Invalid Auth0 user data - missing email');
      } else if (error.message.includes('Cannot create or update another user\'s profile')) {
        throw new Error('Authentication mismatch - please log out and log back in');
      } else {
        throw new Error(`User profile sync failed: ${error.message}`);
      }
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
  
  // Validate authorization for a specific resource via User service
  async validateAuthorization(resourcePath, operation, token) {
    if (!token) {
      return false;
    }
    
    try {
      // Use the API Gateway's authorization endpoint
      const result = await apiRequest(
        `/api/users/authorize?resourcePath=${encodeURIComponent(resourcePath)}&operation=${encodeURIComponent(operation)}`,
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
  },

  // Update user profile
  async updateUserProfile(userId, profileData, token) {
    if (!token) {
      throw new Error('Authentication token not available');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    try {
      return await apiRequest(`/api/users/${userId}`, 'put', profileData, token);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Delete user account
  async deleteUserAccount(userId, token) {
    if (!token) {
      throw new Error('Authentication token not available');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    try {
      return await apiRequest(`/api/users/${userId}`, 'delete', null, token);
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  }
}; 