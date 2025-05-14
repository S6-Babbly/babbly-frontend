'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Higher-order component that protects routes requiring authentication
 */
export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      // Only redirect once loading is complete and we know the user is not authenticated
      if (!isLoading && !isAuthenticated) {
        router.push('/api/auth/login');
      }
    }, [isAuthenticated, isLoading, router]);
    
    // Show loading state or redirect silently
    if (isLoading || !isAuthenticated) {
      return <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>;
    }
    
    // User is authenticated, render the component
    return <Component {...props} />;
  };
}
