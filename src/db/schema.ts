import { pgTable, serial, varchar, decimal, timestamp, integer, text } from 'drizzle-orm/pg-core';

// Users table for authentication
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'pending', 'completed', 'cancelled'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Inventory table
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 20 }).notNull(), // 'input' or 'output'
  quantity: integer('quantity').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Expenses table
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  category: varchar('category', { length: 50 }).notNull(), // 'materials', 'other'
  cost: decimal('cost', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').defaultNow().notNull(),
});

// Shipping table
export const shipping = pgTable('shipping', {
  id: serial('id').primaryKey(),
  destination: varchar('destination', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'pending', 'in_transit', 'delivered'
  volume: integer('volume').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Shipping = typeof shipping.$inferSelect;
