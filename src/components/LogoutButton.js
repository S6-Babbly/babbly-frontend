'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function LogoutButton() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  
  if (!user) return null;

  return (
    <Link href="/api/auth/logout" className="border border-white/20 text-white rounded-full py-2 px-4 text-center font-semibold hover:bg-white/10 transition-colors">
      Log Out
    </Link>
  );
} 