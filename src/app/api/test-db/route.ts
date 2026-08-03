import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    console.log('[TEST-DB] Testing database connection');
    console.log('[TEST-DB] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('[TEST-DB] JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Try to query users table
    const allUsers = await db.select().from(users);
    
    console.log('[TEST-DB] Database connected successfully');
    console.log('[TEST-DB] Users count:', allUsers.length);
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      environment: {
        databaseConfigured: !!process.env.DATABASE_URL,
        jwtConfigured: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
      },
      database: {
        userCount: allUsers.length,
        users: allUsers.map(u => ({ 
          id: u.id, 
          username: u.username,
          email: u.email 
        }))
      }
    });
  } catch (error) {
    console.error('[TEST-DB] Database connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      environment: {
        databaseConfigured: !!process.env.DATABASE_URL,
        jwtConfigured: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    }, { status: 500 });
  }
}
