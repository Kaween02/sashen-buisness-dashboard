import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('[LOGIN] Starting login request');
    
    // Check environment variables
    if (!process.env.DATABASE_URL) {
      console.error('[LOGIN] DATABASE_URL not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('[LOGIN] JWT_SECRET not set');
      return NextResponse.json(
        { error: 'Authentication configuration error' },
        { status: 500 }
      );
    }
    const body = await request.json();
    const { username, password } = body;
    console.log('[LOGIN] Attempting login for user:', username);
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    // Find user by username
    console.log('[LOGIN] Querying database for user');
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (!user) {
      console.log('[LOGIN] User not found:', username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('[LOGIN] User found, verifying password');
    
    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      console.log('[LOGIN] Invalid password for user:', username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('[LOGIN] Password valid, generating token');
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });
    console.log('[LOGIN] Login successful for user:', username);
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('[LOGIN] Login error:', error);
    console.error('[LOGIN] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}