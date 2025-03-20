'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';

export default function UserProfile() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  
  if (!user) return null;

  // Get display name - use nickname, name, or extract from email
  const displayName = user.nickname || user.name || (user.email ? user.email.split('@')[0] : 'User');

  return (
    <Link href="/profile">
      <div className="flex items-center gap-3 p-3 rounded-full hover:bg-white/10 transition-colors">
        {user.picture && (
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image 
              src={user.picture} 
              alt={displayName} 
              fill 
              className="object-cover" 
            />
          </div>
        )}
        <div>
          <div className="font-medium text-lg">{displayName}</div>
        </div>
      </div>
    </Link>
  );
} 