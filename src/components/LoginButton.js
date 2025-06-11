'use client';

import { useAuth } from '@/context/AuthContext';

export default function LoginButton() {
  const { isAuthenticated, isLoading } = useAuth();
  
  const handleLogin = () => {
    // Redirect to the Auth0 login page using full page redirect
    window.location.href = '/api/auth/login';
  };
  
  if (isLoading) {
    return (
      <button
        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 
                  text-white font-medium py-2 px-4 rounded-full transition-colors 
                  backdrop-blur-sm w-full"
        disabled
      >
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </button>
    );
  }
  
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90
                text-white font-medium py-2 px-4 rounded-full transition-colors w-full"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      Login
    </button>
  );
} 