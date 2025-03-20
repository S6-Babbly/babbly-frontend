'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);
  
  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
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
            <p className="text-center text-white/60 text-sm">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg">
          <p className="text-sm text-white/70 mb-2">
            <strong>Note for admins:</strong> For further customization of the Auth0 login page:
          </p>
          <ol className="text-sm text-white/70 list-decimal pl-5 space-y-1">
            <li>Go to Auth0 Dashboard &gt; Branding &gt; Universal Login</li>
            <li>Customize colors, logo, and text elements</li>
            <li>Or enable &quot;Customize Page&quot; for advanced HTML/CSS editing</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 