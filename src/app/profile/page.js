'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';

export default function ProfilePage() {
  const { user, isLoading, getToken } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (isLoading) return;
      
      try {
        setIsLoadingProfile(true);
        const token = await getToken();
        const data = await userService.getCurrentUserProfile(token);
        setProfileData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    fetchProfileData();
  }, [isLoading, getToken]);

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

  if (error) {
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
      
      <div className="p-4">
        {user && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20">
                {user.picture && (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-white/70">@{user.nickname || user.email?.split('@')[0]}</p>
                
                <div className="mt-4 border-t border-white/10 pt-4">
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-white/90">{user.email}</p>
                </div>
                
                {profileData && profileData.additionalInfo && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <h3 className="font-bold mb-2">Additional Info</h3>
                    <p className="text-white/90 whitespace-pre-line">
                      {JSON.stringify(profileData.additionalInfo, null, 2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <a 
                  href="/api/auth/logout" 
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors"
                >
                  Logout
                </a>
                
                <button 
                  className="border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 