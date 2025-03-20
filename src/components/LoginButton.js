'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function LoginButton() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  
  if (user) return null;

  return (
    <Link href="/api/auth/login" className="bg-primary text-white rounded-full py-2 px-4 text-center font-semibold hover:bg-primary/90 transition-colors">
      Log In
    </Link>
  );
} 