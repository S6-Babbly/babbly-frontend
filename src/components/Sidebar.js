'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import UserProfile from './UserProfile';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  
  // Check if the current path matches the link
  const isActive = (path) => pathname === path;

  return (
    <nav className="fixed">
      <div className="flex flex-col gap-6">
        <div className="text-3xl font-bold text-primary">Babbly</div>
        <div className="mb-2">
          <UserProfile />
        </div>
        <div className="flex flex-col gap-1">
          <Link 
            href="/" 
            className={`text-xl p-3 rounded-full transition-colors ${
              isActive('/') 
                ? 'bg-white/10 font-semibold border-b-2 border-primary' 
                : 'hover:bg-white/10'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/explore" 
            className={`text-xl p-3 rounded-full transition-colors ${
              isActive('/explore') 
                ? 'bg-white/10 font-semibold border-b-2 border-primary' 
                : 'hover:bg-white/10'
            }`}
          >
            Explore
          </Link>
          <Link 
            href="/notifications" 
            className={`text-xl p-3 rounded-full transition-colors ${
              isActive('/notifications') 
                ? 'bg-white/10 font-semibold border-b-2 border-primary' 
                : 'hover:bg-white/10'
            }`}
          >
            Notifications
          </Link>
          <Link 
            href="/messages" 
            className={`text-xl p-3 rounded-full transition-colors ${
              isActive('/messages') 
                ? 'bg-white/10 font-semibold border-b-2 border-primary' 
                : 'hover:bg-white/10'
            }`}
          >
            Messages
          </Link>
          
          {!isLoading && user ? (
            <Link 
              href="/profile" 
              className={`text-xl p-3 rounded-full transition-colors ${
                isActive('/profile') 
                  ? 'bg-white/10 font-semibold border-b-2 border-primary' 
                  : 'hover:bg-white/10'
              }`}
            >
              Profile
            </Link>
          ) : (
            <Link 
              href="/login" 
              className={`text-xl p-3 rounded-full transition-colors ${
                isActive('/login') 
                  ? 'bg-white/10 font-semibold border-b-2 border-primary' 
                  : 'hover:bg-white/10'
              }`}
            >
              Login/Register
            </Link>
          )}
        </div>
        {!isLoading && user && (
          <Link href="/create-post" className="bg-primary text-white rounded-full py-3 px-8 text-xl font-bold hover:bg-primary/90 transition-colors text-center">
            Post
          </Link>
        )}
      </div>
    </nav>
  );
} 