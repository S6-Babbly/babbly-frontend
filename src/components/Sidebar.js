'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginButton from '@/components/LoginButton';
import LogoutButton from '@/components/LogoutButton';

export default function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      protected: true
    },
    {
      name: 'Create Post',
      href: '/create-post',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      protected: true
    },
  ];

  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between py-8">
      <div>
        <div className="text-2xl font-bold mb-8 text-white">
          <Link href="/">
            <span className="bg-primary px-3 py-1 rounded-md">Babbly</span>
          </Link>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            // Skip protected routes for non-authenticated users
            if (item.protected && !isAuthenticated) return null;
            
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-4 p-3 rounded-full transition-colors ${
                  isActive 
                    ? 'bg-white/20 font-semibold text-white' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="text-lg">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto space-y-4">
        {isAuthenticated && !isLoading && user && (
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name || 'User avatar'} 
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {(user.name || 'User')[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-bold text-white">{user.name || 'User'}</div>
                <div className="text-white/60 text-sm">{user.email || ''}</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="w-full">
          {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
        </div>
      </div>
    </div>
  );
} 