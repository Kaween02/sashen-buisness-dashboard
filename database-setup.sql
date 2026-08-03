-- Business Management Dashboard - PostgreSQL Setup Script
-- This script creates all tables and inserts mock data for the last 3 months

-- Drop existing tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS shipping CASCADE;

-- Create Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create Inventory Table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create Expenses Table
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create Shipping Table
CREATE TABLE shipping (
  id SERIAL PRIMARY KEY,
  destination VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  volume INTEGER NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Insert Demo User (password: admin123)
-- Note: In production, use the seed script which properly hashes the password
INSERT INTO users (username, password, email) VALUES
('admin', '$2a$10$zQX8vP3YGnGZxvJxV1YFKewO5tDqYXFqRQNxKxVxJxWxPxNxPxNxP', 'admin@example.com');

-- Insert Sample Orders (Last 3 months)
-- Month -2 (October 2024)
INSERT INTO orders (amount, status, created_at) VALUES
(1245.50, 'completed', '2024-10-03 09:15:00'),
(890.25, 'completed', '2024-10-05 14:30:00'),
(2340.00, 'completed', '2024-10-08 11:20:00'),
(567.80, 'pending', '2024-10-12 16:45:00'),
(1890.00, 'completed', '2024-10-15 10:10:00'),
(3200.50, 'completed', '2024-10-18 13:25:00'),
(450.00, 'cancelled', '2024-10-20 09:30:00'),
(1670.30, 'completed', '2024-10-23 15:40:00'),
(2100.00, 'completed', '2024-10-26 12:15:00'),
(980.75, 'pending', '2024-10-29 14:50:00');

-- Month -1 (November 2024)
INSERT INTO orders (amount, status, created_at) VALUES
(1567.90, 'completed', '2024-11-02 10:20:00'),
(2340.00, 'completed', '2024-11-05 14:15:00'),
(890.50, 'completed', '2024-11-08 11:30:00'),
(3450.25, 'completed', '2024-11-11 16:40:00'),
(1200.00, 'pending', '2024-11-14 09:25:00'),
(2780.50, 'completed', '2024-11-17 13:50:00'),
(560.00, 'cancelled', '2024-11-19 10:10:00'),
(1990.30, 'completed', '2024-11-22 15:20:00'),
(3100.00, 'completed', '2024-11-25 12:35:00'),
(1450.75, 'completed', '2024-11-28 14:45:00');

-- Current Month (December 2024)
INSERT INTO orders (amount, status, created_at) VALUES
(2890.50, 'completed', '2024-12-01 09:30:00'),
(1670.25, 'completed', '2024-12-04 14:20:00'),
(3450.00, 'completed', '2024-12-07 11:15:00'),
(987.80, 'pending', '2024-12-10 16:30:00'),
(2340.00, 'completed', '2024-12-13 10:40:00'),
(4100.50, 'completed', '2024-12-16 13:55:00'),
(650.00, 'pending', '2024-12-18 09:20:00'),
(2890.30, 'completed', '2024-12-21 15:10:00'),
(3600.00, 'completed', '2024-12-24 12:25:00'),
(1780.75, 'completed', '2024-12-27 14:35:00');

-- Insert Sample Inventory (Input/Output pieces)
-- Month -2 (October)
INSERT INTO inventory (type, quantity, timestamp) VALUES
('input', 450, '2024-10-02 08:00:00'),
('output', 320, '2024-10-05 10:30:00'),
('input', 600, '2024-10-08 09:15:00'),
('output', 480, '2024-10-12 14:20:00'),
('input', 380, '2024-10-15 11:00:00'),
('output', 290, '2024-10-18 15:30:00'),
('input', 520, '2024-10-22 09:45:00'),
('output', 410, '2024-10-26 13:15:00'),
('input', 470, '2024-10-29 10:30:00');

-- Month -1 (November)
INSERT INTO inventory (type, quantity, timestamp) VALUES
('input', 550, '2024-11-01 08:30:00'),
('output', 430, '2024-11-04 10:45:00'),
('input', 680, '2024-11-07 09:20:00'),
('output', 520, '2024-11-10 14:35:00'),
('input', 420, '2024-11-13 11:15:00'),
('output', 360, '2024-11-16 15:40:00'),
('input', 590, '2024-11-19 09:50:00'),
('output', 470, '2024-11-22 13:25:00'),
('input', 510, '2024-11-25 10:40:00'),
('output', 395, '2024-11-28 14:50:00');

-- Current Month (December)
INSERT INTO inventory (type, quantity, timestamp) VALUES
('input', 620, '2024-12-01 08:45:00'),
('output', 490, '2024-12-04 10:55:00'),
('input', 730, '2024-12-07 09:30:00'),
('output', 580, '2024-12-10 14:45:00'),
('input', 460, '2024-12-13 11:25:00'),
('output', 410, '2024-12-16 15:50:00'),
('input', 640, '2024-12-19 10:00:00'),
('output', 520, '2024-12-22 13:35:00'),
('input', 570, '2024-12-25 10:50:00'),
('output', 445, '2024-12-28 14:55:00');

-- Insert Sample Expenses
-- Month -2 (October)
INSERT INTO expenses (category, cost, date) VALUES
('materials', 1250.00, '2024-10-03 10:00:00'),
('materials', 890.50, '2024-10-07 11:30:00'),
('other', 340.25, '2024-10-10 14:15:00'),
('materials', 1680.00, '2024-10-14 09:45:00'),
('other', 210.75, '2024-10-18 13:20:00'),
('materials', 945.30, '2024-10-22 10:30:00'),
('other', 450.00, '2024-10-26 15:40:00'),
('materials', 1120.50, '2024-10-30 11:25:00');

-- Month -1 (November)
INSERT INTO expenses (category, cost, date) VALUES
('materials', 1450.00, '2024-11-02 10:15:00'),
('materials', 1020.75, '2024-11-06 11:45:00'),
('other', 380.50, '2024-11-09 14:30:00'),
('materials', 1890.00, '2024-11-13 09:55:00'),
('other', 275.25, '2024-11-17 13:35:00'),
('materials', 1050.80, '2024-11-21 10:40:00'),
('other', 520.00, '2024-11-25 15:50:00'),
('materials', 1280.60, '2024-11-29 11:35:00');

-- Current Month (December)
INSERT INTO expenses (category, cost, date) VALUES
('materials', 1680.00, '2024-12-02 10:25:00'),
('materials', 1150.90, '2024-12-05 11:55:00'),
('other', 420.75, '2024-12-08 14:40:00'),
('materials', 2100.00, '2024-12-12 10:05:00'),
('other', 315.50, '2024-12-15 13:45:00'),
('materials', 1230.40, '2024-12-19 10:50:00'),
('other', 580.00, '2024-12-23 16:00:00'),
('materials', 1450.25, '2024-12-27 11:45:00');

-- Insert Sample Shipping Records
-- Month -2 (October)
INSERT INTO shipping (destination, status, volume, updated_at) VALUES
('New York, NY', 'delivered', 320, '2024-10-05 12:00:00'),
('Los Angeles, CA', 'delivered', 480, '2024-10-10 14:30:00'),
('Chicago, IL', 'delivered', 290, '2024-10-15 11:20:00'),
('Houston, TX', 'delivered', 410, '2024-10-20 15:45:00'),
('Phoenix, AZ', 'delivered', 350, '2024-10-25 13:10:00');

-- Month -1 (November)
INSERT INTO shipping (destination, status, volume, updated_at) VALUES
('Philadelphia, PA', 'delivered', 430, '2024-11-03 12:15:00'),
('San Antonio, TX', 'delivered', 520, '2024-11-08 14:40:00'),
('San Diego, CA', 'delivered', 360, '2024-11-13 11:30:00'),
('Dallas, TX', 'delivered', 470, '2024-11-18 15:55:00'),
('Austin, TX', 'delivered', 395, '2024-11-23 13:20:00'),
('Miami, FL', 'delivered', 445, '2024-11-28 16:10:00');

-- Current Month (December)
INSERT INTO shipping (destination, status, volume, updated_at) VALUES
('Seattle, WA', 'delivered', 490, '2024-12-02 12:25:00'),
('Denver, CO', 'delivered', 580, '2024-12-07 14:50:00'),
('Boston, MA', 'in_transit', 410, '2024-12-12 11:40:00'),
('Atlanta, GA', 'in_transit', 520, '2024-12-17 16:05:00'),
('New York, NY', 'pending', 445, '2024-12-22 13:30:00'),
('Los Angeles, CA', 'pending', 550, '2024-12-27 16:15:00');

-- Create indexes for better query performance
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_inventory_timestamp ON inventory(timestamp);
CREATE INDEX idx_inventory_type ON inventory(type);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_shipping_updated_at ON shipping(updated_at);

-- Verify data
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Inventory', COUNT(*) FROM inventory
UNION ALL
SELECT 'Expenses', COUNT(*) FROM expenses
UNION ALL
SELECT 'Shipping', COUNT(*) FROM shipping;

-- Display summary
SELECT 
  TO_CHAR(created_at, 'YYYY-MM') as month,
  COUNT(*) as order_count,
  SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_income
FROM orders
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month;
