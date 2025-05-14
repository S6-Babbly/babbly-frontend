import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getSession();
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ accessToken: session.accessToken });
  } catch (error) {
    console.error('Token retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve access token' },
      { status: 500 }
    );
  }
} 