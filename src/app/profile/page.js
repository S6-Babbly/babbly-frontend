'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';

export default function ProfilePage() {
  const { user, isLoading, getToken, auth0User } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (isLoading) return;
      
      try {
        setIsLoadingProfile(true);
        const token = await getToken();
        
        // Use the user data we already have if profile fetch fails
        let data = user;
        try {
          data = await userService.getCurrentUserProfile(token);
        } catch (err) {
          console.log('Using fallback user data:', user);
        }
        
        setProfileData(data);
        setEditForm({
          username: data.username || data.email?.split('@')[0] || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          bio: data.extraData?.bio || '',
          displayName: data.extraData?.displayName || data.name || '',
          phoneNumber: data.extraData?.phoneNumber || '',
          address: data.extraData?.address || ''
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    fetchProfileData();
  }, [isLoading, getToken, user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!profileData?.id) return;

    setIsSaving(true);
    try {
      const token = await getToken();
      const updatedProfile = await userService.updateUserProfile(profileData.id, editForm, token);
      setProfileData(updatedProfile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profileData?.id) return;

    setIsDeleting(true);
    try {
      const token = await getToken();
      await userService.deleteUserAccount(profileData.id, token);
      
      // Redirect to logout after successful deletion
      window.location.href = '/api/auth/logout';
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div>
        <div className="sticky top-0 backdrop-blur-md bg-secondary/80 border-b border-white/20 px-4 py-3 z-10">
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div>
        <div className="sticky top-0 backdrop-blur-md bg-secondary/80 border-b border-white/20 px-4 py-3 z-10">
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <div className="p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            className="mt-4 bg-primary text-white px-4 py-2 rounded-full" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 backdrop-blur-md bg-secondary/80 border-b border-white/20 px-4 py-3 z-10">
        <h1 className="text-xl font-bold">Profile</h1>
      </div>
      
      <div className="p-4 max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {profileData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20">
                {(profileData.picture || auth0User?.picture) && (
                  <img 
                    src={profileData.picture || auth0User?.picture} 
                    alt={profileData.name || 'User'} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold">
                  {profileData.extraData?.displayName || profileData.name || 'No name set'}
                </h2>
                <p className="text-white/70">
                  @{profileData.username || profileData.email?.split('@')[0]}
                </p>
                
                {profileData.extraData?.bio && (
                  <p className="mt-2 text-white/90">{profileData.extraData.bio}</p>
                )}
              </div>
            </div>

            {!isEditing ? (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-white/90">{profileData.email}</p>
                  </div>
                  
                  {profileData.firstName && (
                    <div>
                      <h3 className="font-bold mb-1">First Name</h3>
                      <p className="text-white/90">{profileData.firstName}</p>
                    </div>
                  )}
                  
                  {profileData.lastName && (
                    <div>
                      <h3 className="font-bold mb-1">Last Name</h3>
                      <p className="text-white/90">{profileData.lastName}</p>
                    </div>
                  )}
                  
                  {profileData.extraData?.phoneNumber && (
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <p className="text-white/90">{profileData.extraData.phoneNumber}</p>
                    </div>
                  )}
                  
                  {profileData.extraData?.address && (
                    <div>
                      <h3 className="font-bold mb-1">Address</h3>
                      <p className="text-white/90">{profileData.extraData.address}</p>
                    </div>
                  )}
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-full transition-colors"
                    >
                      Edit Profile
                    </button>
                    
                    <a 
                      href="/api/auth/logout" 
                      className="border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      Logout
                    </a>
                    
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                      placeholder="Username"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-bold mb-1">Display Name</label>
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                      placeholder="Display name"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-bold mb-1">First Name</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                      placeholder="First name"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-bold mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                      placeholder="Last name"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-bold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                      placeholder="Phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-bold mb-1">Address</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                      placeholder="Address"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 h-24 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/80 disabled:opacity-50 text-white px-6 py-2 rounded-full transition-colors"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-secondary rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-red-400">Delete Account</h3>
              <p className="text-white/90 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
                All your posts, comments, and profile data will be permanently removed.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-full transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
                </button>
                
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 