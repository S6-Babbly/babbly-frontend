'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.replace('/api/auth/login');
      }
    }, [isLoading, user, router]);

    if (isLoading) {
      return <div className="p-6 text-center">Loading...</div>;
    }

    if (!user) {
      return <div className="p-6 text-center">Redirecting to login...</div>;
    }

    return <Component {...props} user={user} />;
  };
}
