import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { shipping } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const allShipping = await db
      .select()
      .from(shipping)
      .orderBy(desc(shipping.updatedAt));

    return NextResponse.json(allShipping);
  } catch (error) {
    console.error('Error fetching shipping:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { destination, status, volume } = body;

    if (!destination || !status || !volume) {
      return NextResponse.json(
        { error: 'Destination, status, and volume are required' },
        { status: 400 }
      );
    }

    const [newShipment] = await db
      .insert(shipping)
      .values({
        destination,
        status,
        volume: parseInt(volume),
      })
      .returning();

    return NextResponse.json(newShipment, { status: 201 });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
