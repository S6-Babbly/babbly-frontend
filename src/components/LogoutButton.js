'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LogoutButton() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    // Redirect to the Auth0 logout page
    router.push('/api/auth/logout');
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
                text-white font-medium py-2 px-4 rounded-full transition-colors w-full"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  );
} 