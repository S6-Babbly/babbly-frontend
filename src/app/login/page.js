'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect to home if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="sticky top-0 backdrop-blur-md bg-secondary/80 border-b border-white/20 px-4 py-3 z-10">
        <h1 className="text-xl font-bold">Login / Register</h1>
      </div>
      
      <div className="p-6">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Welcome to Babbly</h2>
          
          <div className="space-y-6">
            <div>
              <Link 
                href="/api/auth/login?screen_hint=signup"
                className="block w-full bg-primary text-white rounded-full py-3 px-4 text-center font-semibold text-lg hover:bg-primary/90 transition-colors"
              >
                Create an Account
              </Link>
              <p className="text-center mt-2 text-white/70">New to Babbly? Sign up now!</p>
            </div>
            
            <div className="flex items-center my-8">
              <div className="flex-grow border-t border-white/20"></div>
              <div className="mx-4 text-lg text-white">or</div>
              <div className="flex-grow border-t border-white/20"></div>
            </div>
            
            <div>
              <Link 
                href="/api/auth/login"
                className="block w-full border border-white/30 text-white rounded-full py-3 px-4 text-center font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
              <p className="text-center mt-2 text-white/70">Already have an account? Sign in</p>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/20">
            <div className="text-center text-white/60 text-sm space-y-2">
              <p><strong>How it works:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Sign in with Auth0 (secure authentication)</li>
                <li>New users: We'll create your Babbly profile automatically</li>
                <li>Returning users: You'll be logged in immediately</li>
                <li>Start posting and connecting with others!</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-center text-white/60 text-sm">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 