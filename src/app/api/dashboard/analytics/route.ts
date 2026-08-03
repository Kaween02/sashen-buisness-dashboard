import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, inventory, expenses, shipping } from '@/db/schema';
import { sql, gte, and, eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Calculate date ranges
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgoStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    // Current Month KPIs
    const [currentMonthIncome] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${orders.amount}), 0)`,
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, currentMonthStart),
          eq(orders.status, 'completed')
        )
      );

    const [currentMonthInputPieces] = await db
      .select({
        count: sql<string>`COALESCE(SUM(${inventory.quantity}), 0)`,
      })
      .from(inventory)
      .where(
        and(
          gte(inventory.timestamp, currentMonthStart),
          eq(inventory.type, 'input')
        )
      );

    const [currentMonthOutputPieces] = await db
      .select({
        count: sql<string>`COALESCE(SUM(${inventory.quantity}), 0)`,
      })
      .from(inventory)
      .where(
        and(
          gte(inventory.timestamp, currentMonthStart),
          eq(inventory.type, 'output')
        )
      );

    const [currentMonthMaterialCosts] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${expenses.cost}), 0)`,
      })
      .from(expenses)
      .where(
        and(
          gte(expenses.date, currentMonthStart),
          eq(expenses.category, 'materials')
        )
      );

    // Historical comparison data (last 3 months)
    const monthlyData = await db
      .select({
        month: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        income: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} = 'completed' THEN ${orders.amount} ELSE 0 END), 0)`,
      })
      .from(orders)
      .where(gte(orders.createdAt, twoMonthsAgoStart))
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

    const monthlyCosts = await db
      .select({
        month: sql<string>`TO_CHAR(${expenses.date}, 'YYYY-MM')`,
        costs: sql<string>`COALESCE(SUM(${expenses.cost}), 0)`,
      })
      .from(expenses)
      .where(gte(expenses.date, twoMonthsAgoStart))
      .groupBy(sql`TO_CHAR(${expenses.date}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${expenses.date}, 'YYYY-MM')`);

    const monthlyOutput = await db
      .select({
        month: sql<string>`TO_CHAR(${inventory.timestamp}, 'YYYY-MM')`,
        output: sql<string>`COALESCE(SUM(CASE WHEN ${inventory.type} = 'output' THEN ${inventory.quantity} ELSE 0 END), 0)`,
      })
      .from(inventory)
      .where(gte(inventory.timestamp, twoMonthsAgoStart))
      .groupBy(sql`TO_CHAR(${inventory.timestamp}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${inventory.timestamp}, 'YYYY-MM')`);

    // Combine historical data
    const monthNames: { [key: string]: string } = {};
    const historicalData: { [key: string]: any } = {};

    // Helper to format month name
    const formatMonthName = (dateStr: string) => {
      const date = new Date(dateStr + '-01');
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    monthlyData.forEach((item) => {
      const monthKey = item.month;
      if (!historicalData[monthKey]) {
        historicalData[monthKey] = { month: formatMonthName(monthKey), income: 0, costs: 0, output: 0 };
      }
      historicalData[monthKey].income = parseFloat(item.income);
    });

    monthlyCosts.forEach((item) => {
      const monthKey = item.month;
      if (!historicalData[monthKey]) {
        historicalData[monthKey] = { month: formatMonthName(monthKey), income: 0, costs: 0, output: 0 };
      }
      historicalData[monthKey].costs = parseFloat(item.costs);
    });

    monthlyOutput.forEach((item) => {
      const monthKey = item.month;
      if (!historicalData[monthKey]) {
        historicalData[monthKey] = { month: formatMonthName(monthKey), income: 0, costs: 0, output: 0 };
      }
      historicalData[monthKey].output = parseInt(item.output);
    });

    const historicalArray = Object.values(historicalData);

    // Recent shipping data
    const recentShipping = await db
      .select()
      .from(shipping)
      .orderBy(sql`${shipping.updatedAt} DESC`)
      .limit(10);

    return NextResponse.json({
      currentMonth: {
        income: parseFloat(currentMonthIncome.total),
        inputPieces: parseInt(currentMonthInputPieces.count),
        outputPieces: parseInt(currentMonthOutputPieces.count),
        materialCosts: parseFloat(currentMonthMaterialCosts.total),
      },
      historical: historicalArray,
      shipping: recentShipping.map((item) => ({
        id: item.id,
        destination: item.destination,
        status: item.status,
        volume: item.volume,
        updatedAt: item.updatedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
