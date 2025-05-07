import { create } from 'zustand';
import { getCurrentProfile } from '@/services/profileService';

// Auth store for managing user authentication state
const useAuthStore = create((set, get) => ({
  // User state
  user: null,
  profile: null,
  isLoading: false,
  error: null,

  // Set user from Auth0
  setUser: (user) => set({ user }),

  // Clear user on logout
  clearUser: () => set({ user: null, profile: null }),

  // Fetch the user's profile data from the API
  fetchUserProfile: async () => {
    const { user } = get();
    
    // Only fetch if we have a user from Auth0
    if (!user) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const profileData = await getCurrentProfile();
      set({ profile: profileData, isLoading: false });
      return profileData;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      set({ 
        error: error.displayMessage || 'Failed to load profile', 
        isLoading: false 
      });
      return null;
    }
  },

  // Update user profile data
  updateProfile: (profileData) => {
    set({ profile: { ...get().profile, ...profileData } });
  },
}));

export default useAuthStore; 