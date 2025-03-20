'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicTitle() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Get page name from pathname
    let pageName = 'Home';
    
    if (pathname === '/') {
      pageName = 'Home';
    } else if (pathname === '/profile') {
      pageName = 'Profile';
    } else if (pathname === '/explore') {
      pageName = 'Explore';
    } else if (pathname === '/notifications') {
      pageName = 'Notifications';
    } else if (pathname === '/messages') {
      pageName = 'Messages';
    } else if (pathname === '/create-post') {
      pageName = 'Create Post';
    } else if (pathname === '/login') {
      pageName = 'Login/Register';
    } else if (pathname.startsWith('/api/auth')) {
      pageName = 'Authentication';
    } else {
      // Extract page name from pathname (remove leading slash and capitalize first letter)
      pageName = pathname.substring(1);
      pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    }
    
    // Update document title
    document.title = `Babbly - ${pageName}`;
  }, [pathname]);
  
  // This component doesn't render anything visible
  return null;
} 