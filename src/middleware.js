import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

// DEMO MODE: Disable route protection for demo purposes
// Define an array of protected routes (currently disabled for demo)
const PROTECTED_ROUTES = [
  // '/profile',     // Commented out for demo
  // '/settings',    // Commented out for demo  
  // '/create',      // Commented out for demo
  // '/messages',    // Commented out for demo
];

export default async function middleware(request) {
  // DEMO MODE: Allow access to all routes without authentication
  const path = request.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route));
  
  // For demo purposes, we'll log what would have been protected but allow access
  if (path.startsWith('/profile') || path.startsWith('/settings') || path.startsWith('/create') || path.startsWith('/messages')) {
    console.log(`Demo mode: Allowing access to ${path} without authentication`);
  }
  
  if (isProtectedRoute) {
    // Get the session from the edge
    const response = NextResponse.next();
    const session = await getSession(request, response);
    const isAuthenticated = !!session?.user;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', path);
      return NextResponse.redirect(loginUrl);
    }
    
    return response;
  }
  
  // If path is login and user is authenticated, redirect to home page
  if (path === '/login') {
    const response = NextResponse.next();
    const session = await getSession(request, response);
    const isAuthenticated = !!session?.user;
    
    if (isAuthenticated) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
    
    return response;
  }
  
  // DEMO MODE: Allow all other requests to proceed without authentication checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}; 