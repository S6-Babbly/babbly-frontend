'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getCurrentProfile, updateProfile, deleteAccount } from '@/services/profileService';

export default function ProfileClient() {
  const { user: auth0User, isLoading: authLoading, error: authError, getToken } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [editFormData, setEditFormData] = useState({
    username: '',
    displayName: '',
    profilePicture: '',
    address: '',
    phoneNumber: ''
  });
  
  // Load user profile when auth0User is available
  useEffect(() => {
    if (auth0User && !authLoading) {
      loadUserProfile();
    }
  }, [auth0User, authLoading]);
  
  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setEditFormData({
        username: user.username || '',
        displayName: user.extraData?.displayName || '',
        profilePicture: user.extraData?.profilePicture || '',
        address: user.extraData?.address || '',
        phoneNumber: user.extraData?.phoneNumber || ''
      });
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = await getToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const profileData = await getCurrentProfile(token);
      setUser(profileData);
    } catch (error) {
      setError(error.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSaveError('');
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    
    try {
      const token = await getToken();
      if (!token) {
        setSaveError('Authentication required. Please log in again.');
        return;
      }

      const updatedUser = await updateProfile(editFormData, token);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      setSaveError(error.message || 'Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      const token = await getToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      await deleteAccount(token);
      
      // Redirect to logout after successful deletion
      window.location.href = '/api/auth/logout';
    } catch (error) {
      setError(error.message || 'Failed to delete account');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (authLoading || isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (authError || error) return <div className="p-6 text-center text-red-400">Error: {authError || error}</div>;
  
  if (!auth0User) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  // Get display values (use form data when editing, user data when viewing)
  const displayName = isEditing ? editFormData.displayName : 
    (user?.extraData?.displayName || user?.username || auth0User.nickname || auth0User.name || (auth0User.email ? auth0User.email.split('@')[0] : 'User'));
  const username = isEditing ? editFormData.username : 
    (user?.username || auth0User.nickname || auth0User.email?.split('@')[0]);
  const profilePicture = isEditing ? editFormData.profilePicture :
    (user?.extraData?.profilePicture || auth0User.picture);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          onClick={handleEditToggle}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      <div className="bg-white/10 rounded-xl p-6">
        <div className="flex items-center gap-6 mb-6">
          {profilePicture && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image 
                src={profilePicture} 
                alt={displayName} 
                fill 
                className="object-cover" 
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{displayName}</h2>
            <p className="text-white/70">@{username}</p>
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={editFormData.username}
                onChange={(e) => handleFormChange('username', e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={editFormData.displayName}
                onChange={(e) => handleFormChange('displayName', e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white"
                placeholder="Enter display name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Profile Picture URL</label>
              <input
                type="url"
                value={editFormData.profilePicture}
                onChange={(e) => handleFormChange('profilePicture', e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white"
                placeholder="Enter profile picture URL"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                value={editFormData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white"
                placeholder="Enter address (optional)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={editFormData.phoneNumber}
                onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white"
                placeholder="Enter phone number (optional)"
              />
            </div>
            
            {saveError && (
              <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded">
                {saveError}
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-lg font-semibold mb-2">Account Details</h3>
            <dl className="space-y-2">
              <div className="grid grid-cols-3">
                <dt className="text-white/60">Email:</dt>
                <dd className="col-span-2">{user?.email || auth0User.email}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-white/60">Email Verified:</dt>
                <dd className="col-span-2">{auth0User.email_verified ? 'Yes' : 'No'}</dd>
              </div>
              {user?.extraData?.address && (
                <div className="grid grid-cols-3">
                  <dt className="text-white/60">Address:</dt>
                  <dd className="col-span-2">{user.extraData.address}</dd>
                </div>
              )}
              {user?.extraData?.phoneNumber && (
                <div className="grid grid-cols-3">
                  <dt className="text-white/60">Phone:</dt>
                  <dd className="col-span-2">{user.extraData.phoneNumber}</dd>
                </div>
              )}
              {(user?.createdAt || auth0User.updated_at) && (
                <div className="grid grid-cols-3">
                  <dt className="text-white/60">Joined:</dt>
                  <dd className="col-span-2">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : new Date(auth0User.updated_at).toLocaleDateString()
                    }
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
        
        {/* Account Actions Section */}
        {!isEditing && (
          <div className="mt-8 space-y-4">
            <Link 
              href="/api/auth/logout" 
              className="block w-full py-3 bg-primary text-white text-center rounded-lg hover:bg-primary/90"
            >
              Logout
            </Link>
            
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="block w-full py-3 bg-red-600/80 text-white text-center rounded-lg hover:bg-red-600"
                disabled={isDeleting}
              >
                Delete Account
              </button>
            ) : (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                <p className="text-white mb-3">
                  Are you sure you want to delete your account? This action cannot be undone and will delete all your posts, comments, and likes.
                </p>
                <div className="flex gap-3">
                  <button 
                    className="flex-1 py-2 bg-white/10 text-white text-center rounded-md hover:bg-white/20"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex-1 py-2 bg-red-600 text-white text-center rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 