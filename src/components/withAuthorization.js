'use client';

import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Higher-order component that protects routes requiring specific authorization
 * @param {Component} Component - The component to wrap
 * @param {string} resourcePath - The resource path to check authorization for
 * @param {string} operation - The operation to check (read, write, delete)
 */
export default function withAuthorization(Component, resourcePath, operation = 'read') {
  return function AuthorizedComponent(props) {
    const { isAuthenticated, isLoading, getToken } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isAuthorizationChecking, setIsAuthorizationChecking] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
      // Don't check authorization if not authenticated
      if (isLoading) return;
      
      if (!isAuthenticated) {
        router.push('/api/auth/login');
        return;
      }
      
      async function checkAuthorization() {
        try {
          setIsAuthorizationChecking(true);
          const token = await getToken();
          
          if (!token) {
            setIsAuthorized(false);
            return;
          }
          
          const authorized = await userService.validateAuthorization(
            resourcePath, 
            operation, 
            token
          );
          
          setIsAuthorized(authorized);
        } catch (error) {
          setIsAuthorized(false);
        } finally {
          setIsAuthorizationChecking(false);
        }
      }
      
      checkAuthorization();
    }, [isAuthenticated, isLoading, getToken, resourcePath, operation, router]);
    
    // Show loading state
    if (isLoading || isAuthorizationChecking) {
      return <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Checking permission...</div>
      </div>;
    }
    
    // Show unauthorized state
    if (!isAuthorized) {
      return <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-red-500">
          You don't have permission to access this resource.
        </div>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Go to Home
        </button>
      </div>;
    }
    
    // User is authorized, render the component
    return <Component {...props} />;
  };
} 