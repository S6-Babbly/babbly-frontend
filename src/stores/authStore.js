import { create } from 'zustand';
import { userService } from '@/services/userService';

// Auth store for managing user authentication state
const useAuthStore = create((set, get) => ({
  // User state
  user: null,
  profile: null,
  userInfo: null,
  isLoading: false,
  error: null,
  permissions: {},

  // Set user from Auth0
  setUser: (user) => set({ user }),

  // Clear user on logout
  clearUser: () => set({ 
    user: null, 
    profile: null, 
    userInfo: null, 
    permissions: {},
    error: null 
  }),

  // Fetch the user's profile data from the API
  fetchUserProfile: async () => {
    const { user } = get();
    
    // Only fetch if we have a user from Auth0
    if (!user) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const profileData = await userService.getCurrentUserProfile();
      const userInfo = await userService.getUserInfo();
      
      set({ 
        profile: profileData, 
        userInfo,
        isLoading: false 
      });
      
      return profileData;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      set({ 
        error: error.message || 'Failed to load profile', 
        isLoading: false 
      });
      return null;
    }
  },

  // Update user profile data
  updateProfile: (profileData) => {
    set({ profile: { ...get().profile, ...profileData } });
  },
  
  // Check if user has permission for a resource
  checkPermission: async (resourcePath, operation) => {
    const { permissions } = get();
    const permissionKey = `${resourcePath}:${operation}`;
    
    // Return cached permission if available
    if (permissions[permissionKey] !== undefined) {
      return permissions[permissionKey];
    }
    
    try {
      const isAuthorized = await userService.validateAuthorization(resourcePath, operation);
      
      // Cache the permission result
      set({
        permissions: {
          ...get().permissions,
          [permissionKey]: isAuthorized
        }
      });
      
      return isAuthorized;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  },
  
  // Clear permission cache
  clearPermissions: () => {
    set({ permissions: {} });
  }
}));

export default useAuthStore; 