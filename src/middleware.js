import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

// Define an array of protected routes that require authentication
const PROTECTED_ROUTES = [
  // '/profile',     // Currently disabled
  // '/settings',    // Currently disabled  
  // '/create',      // Currently disabled
  // '/messages',    // Currently disabled
];

export default async function middleware(request) {
  // Check if the path is a protected route
  const path = request.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route));
  
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
  
  // Allow all other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}; 