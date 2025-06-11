import { getSession, getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getSession();
    const { accessToken } = await getAccessToken();

    console.log('=== AUTH TOKEN DEBUG (with getAccessToken) ===');
    console.log('Session exists:', !!session);

    if (session) {
      console.log('Has user:', !!session.user);
      console.log(
        'User info:',
        session.user
          ? {
              sub: session.user.sub,
              email: session.user.email,
              email_verified: session.user.email_verified,
            }
          : 'No user'
      );
    }

    console.log('Has accessToken:', !!accessToken);

    if (accessToken) {
      console.log('✅ Access token found');
    } else {
      console.log('❌ No access token found with getAccessToken');
    }
    console.log('============================================');

    if (!session || !accessToken) {
      return NextResponse.json(
        {
          error: 'Not authenticated or access token missing',
          debug: {
            hasSession: !!session,
            hasAccessToken: !!accessToken,
            sessionKeys: session ? Object.keys(session) : [],
            userSub: session?.user?.sub || null,
            instructions: 'Try visiting /api/auth/login to authenticate',
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Token retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve access token', details: error.message },
      { status: 500 }
    );
  }
} 