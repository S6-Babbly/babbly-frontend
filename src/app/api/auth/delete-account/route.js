import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // In a real application, you would:
    // 1. Call Auth0 Management API to delete the user
    // 2. Delete user data from your database
    // 3. Perform any cleanup tasks
    
    // For now, we'll just redirect to a confirmation page
    // with instructions on contacting support
    return NextResponse.redirect(new URL('/account/deletion-requested', req.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/error?message=Account+deletion+failed', req.url));
  }
} 