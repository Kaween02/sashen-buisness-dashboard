import 'dotenv/config';
import { db, pool } from '../src/db';
import { users, orders, inventory, expenses, shipping } from '../src/db/schema';
import { hashPassword } from '../src/lib/auth';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Create demo user
    console.log('Creating user...');
    const hashedPassword = await hashPassword('admin123');
    await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
    });

    // Generate data for the last 3 months
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    // Helper function to get random date in range
    const randomDate = (start: Date, end: Date) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // Helper to get month boundaries
    const getMonthRange = (monthsBack: number) => {
      const start = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 0);
      return { start, end };
    };

    // Seed Orders - varying amounts by month
    console.log('Seeding orders...');
    const orderStatuses = ['completed', 'pending', 'cancelled'];
    const ordersData = [];

    for (let monthBack = 0; monthBack < 3; monthBack++) {
      const { start, end } = getMonthRange(monthBack);
      const ordersInMonth = 15 + Math.floor(Math.random() * 10); // 15-25 orders per month

      for (let i = 0; i < ordersInMonth; i++) {
        const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
        // Completed orders have higher amounts
        const baseAmount = status === 'completed' ? 500 : 200;
        const amount = (baseAmount + Math.random() * 2000).toFixed(2);
        
        ordersData.push({
          amount,
          status,
          createdAt: randomDate(start, end),
        });
      }
    }
    await db.insert(orders).values(ordersData);

    // Seed Inventory - input and output pieces
    console.log('Seeding inventory...');
    const inventoryData = [];

    for (let monthBack = 0; monthBack < 3; monthBack++) {
      const { start, end } = getMonthRange(monthBack);
      const entriesInMonth = 20 + Math.floor(Math.random() * 10); // 20-30 entries per month

      for (let i = 0; i < entriesInMonth; i++) {
        const type = Math.random() > 0.5 ? 'input' : 'output';
        const quantity = Math.floor(50 + Math.random() * 500); // 50-550 pieces

        inventoryData.push({
          type,
          quantity,
          timestamp: randomDate(start, end),
        });
      }
    }
    await db.insert(inventory).values(inventoryData);

    // Seed Expenses - materials and other costs
    console.log('Seeding expenses...');
    const expenseCategories = ['materials', 'other'];
    const expensesData = [];

    for (let monthBack = 0; monthBack < 3; monthBack++) {
      const { start, end } = getMonthRange(monthBack);
      const expensesInMonth = 10 + Math.floor(Math.random() * 8); // 10-18 expenses per month

      for (let i = 0; i < expensesInMonth; i++) {
        const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
        // Materials tend to be more expensive
        const baseAmount = category === 'materials' ? 300 : 100;
        const cost = (baseAmount + Math.random() * 1000).toFixed(2);

        expensesData.push({
          category,
          cost,
          date: randomDate(start, end),
        });
      }
    }
    await db.insert(expenses).values(expensesData);

    // Seed Shipping - various destinations and statuses
    console.log('Seeding shipping records...');
    const destinations = [
      'New York, NY',
      'Los Angeles, CA',
      'Chicago, IL',
      'Houston, TX',
      'Phoenix, AZ',
      'Philadelphia, PA',
      'San Antonio, TX',
      'San Diego, CA',
      'Dallas, TX',
      'Austin, TX',
      'Miami, FL',
      'Seattle, WA',
      'Denver, CO',
      'Boston, MA',
      'Atlanta, GA',
    ];
    const shippingStatuses = ['delivered', 'in_transit', 'pending'];
    const shippingData = [];

    for (let monthBack = 0; monthBack < 3; monthBack++) {
      const { start, end } = getMonthRange(monthBack);
      const shipmentsInMonth = 8 + Math.floor(Math.random() * 7); // 8-15 shipments per month

      for (let i = 0; i < shipmentsInMonth; i++) {
        const destination = destinations[Math.floor(Math.random() * destinations.length)];
        const status = shippingStatuses[Math.floor(Math.random() * shippingStatuses.length)];
        const volume = Math.floor(100 + Math.random() * 1000); // 100-1100 units

        shippingData.push({
          destination,
          status,
          volume,
          updatedAt: randomDate(start, end),
        });
      }
    }
    await db.insert(shipping).values(shippingData);

    console.log('✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`  - Users: 1`);
    console.log(`  - Orders: ${ordersData.length}`);
    console.log(`  - Inventory: ${inventoryData.length}`);
    console.log(`  - Expenses: ${expensesData.length}`);
    console.log(`  - Shipping: ${shippingData.length}`);
    console.log('');
    console.log('🔐 Login credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
