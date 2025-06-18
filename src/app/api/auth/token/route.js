import { getSession, getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    // Try to get access token using getAccessToken
    let accessToken = null;
    try {
      const { accessToken: token } = await getAccessToken();
      accessToken = token;
    } catch (tokenError) {
      // Fallback to session if getAccessToken fails
    }

    if (!accessToken && session.accessToken) {
      accessToken = session.accessToken;
    } else if (!accessToken && session.idToken) {
      accessToken = session.idToken;
    }

    if (!accessToken) {
      return NextResponse.json({ 
        error: 'No access token available',
        sessionKeys: Object.keys(session),
        userKeys: Object.keys(session.user || {})
      }, { status: 401 });
    }

    return NextResponse.json({ 
      accessToken,
      user: session.user 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Token retrieval failed',
      message: error.message 
    }, { status: 500 });
  }
} 