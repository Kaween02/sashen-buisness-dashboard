
import 'dotenv/config';
import { db } from '../src/db';
import { users, orders, inventory, expenses, shipping } from '../src/db/schema';
import { hashPassword } from '../src/lib/auth';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // ============================================
    // CREATE OR UPDATE ADMIN USER
    // ============================================
    console.log('Checking admin user...');

    const hashedPassword = await hashPassword('admin123');

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, 'admin'))
      .limit(1);

    if (existingUser.length > 0) {
      // Admin already exists - update password and email
      console.log('Admin user already exists. Updating password...');

      await db
        .update(users)
        .set({
          password: hashedPassword,
          email: 'admin@example.com',
        })
        .where(eq(users.username, 'admin'));

      console.log('✅ Admin user updated successfully!');
    } else {
      // Admin doesn't exist - create new user
      console.log('Admin user does not exist. Creating user...');

      await db.insert(users).values({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
      });

      console.log('✅ Admin user created successfully!');
    }

    // ============================================
    // GENERATE DATA FOR THE LAST 3 MONTHS
    // ============================================
    const now = new Date();

    // Helper function to get random date in range
    const randomDate = (start: Date, end: Date) => {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    };

    // Helper to get month boundaries
    const getMonthRange = (monthsBack: number) => {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - monthsBack,
        1
      );

      const end = new Date(
        now.getFullYear(),
        now.getMonth() - monthsBack + 1,
        0
      );

      return { start, end };
    };

    // ============================================
    // SEED ORDERS
    // ============================================
    console.log('Seeding orders...');

    const orderStatuses = ['completed', 'pending', 'cancelled'];
    const ordersData = [];

    for (let monthBack = 0; monthBack < 3; monthBack++) {
      const { start, end } = getMonthRange(monthBack);

      const ordersInMonth =
        15 + Math.floor(Math.random() * 10);

      for (let i = 0; i < ordersInMonth; i++) {
        const status =
          orderStatuses[
            Math.floor(Math.random() * orderStatuses.length)
          ];

        const baseAmount = status === 'completed' ? 500 : 200;

        const amount = (
          baseAmount +
          Math.random() * 2000
        ).toFixed(2);

        ordersData.push({
          amount,
          status,
          createdAt: randomDate(start, end),
        });
      }
    }

    await db.insert(orders).values(ordersData);

    // ============================================
    // SEED INVENTORY
    // ============================================
    console.log('Seeding inventory...');

    const inventoryData = [];

    for (let monthBack = 0; monthBack < 3; monthBack++) {
      const { start, end } = getMonthRange(monthBack);

      const entriesInMonth =
        20 + Math.floor(Math.random() * 10);

      for (let i = 0; i < entriesInMonth; i++) {
        const type = Math.random() > 0.5 ? 'input' : 'output';

        const quantity = Math.floor(
          50 + Math.random() * 500
        );

        inventoryData.push({
          type,
          quantity,
          timestamp: randomDate(start, end),
        });
      }
    }

    await db.insert(inventory).values(inventoryData);

    // ============================================
    // SEED EXPENSES
    // ============================================
    console.log('Seeding expenses...');

    const expenseCategories = ['materials', 'other'];
    const expensesData = [];

    for (let monthBack = 0; monthBack < 3; monthBack++) {
      const { start, end } = getMonthRange(monthBack);

      const expensesInMonth =
        10 + Math.floor(Math.random() * 8);

      for (let i = 0; i < expensesInMonth; i++) {
        const category =
          expenseCategories[
            Math.floor(Math.random() * expenseCategories.length)
          ];

        const baseAmount =
          category === 'materials' ? 300 : 100;

        const cost = (
          baseAmount +
          Math.random() * 1000
        ).toFixed(2);

        expensesData.push({
          category,
          cost,
          date: randomDate(start, end),
        });
      }
    }

    await db.insert(expenses).values(expensesData);

    // ============================================
    // SEED SHIPPING
    // ============================================
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

    const shippingStatuses = [
      'delivered',
      'in_transit',
      'pending',
    ];

    const shippingData = [];

    for (let monthBack = 0; monthBack < 3; monthBack++) {
      const { start, end } = getMonthRange(monthBack);

      const shipmentsInMonth =
        8 + Math.floor(Math.random() * 7);

      for (let i = 0; i < shipmentsInMonth; i++) {
        const destination =
          destinations[
            Math.floor(Math.random() * destinations.length)
          ];

        const status =
          shippingStatuses[
            Math.floor(Math.random() * shippingStatuses.length)
          ];

        const volume = Math.floor(
          100 + Math.random() * 1000
        );

        shippingData.push({
          destination,
          status,
          volume,
          updatedAt: randomDate(start, end),
        });
      }
    }

    await db.insert(shipping).values(shippingData);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log('  - Users: 1');
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
    await db.$client.end();
  }
}

seed();

