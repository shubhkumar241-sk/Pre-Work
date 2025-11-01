-- Create database
CREATE DATABASE order_management;

\c order_management;

-- Customers table
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0
);

-- Orders table
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10, 2)
);

-- Order_Products table (Many-to-Many relationship)
CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id),
  product_id INT REFERENCES products(product_id),
  quantity INT NOT NULL
);

-- Payments table
CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50)
);

-- ✅ Sample data
INSERT INTO customers (name, email, phone) VALUES
('Amit Sharma', 'amit@example.com', '9998887771'),
('Priya Verma', 'priya@example.com', '9998887772'),
('Rahul Mehta', 'rahul@example.com', '9998887773'),
('Sneha Gupta', 'sneha@example.com', '9998887774'),
('Karan Patel', 'karan@example.com', '9998887775');

INSERT INTO products (name, price, stock) VALUES
('Laptop', 60000, 10),
('Smartphone', 25000, 30),
('Headphones', 3000, 50),
('Monitor', 12000, 15),
('Keyboard', 1500, 40);

-- Orders and payments (simplified)
INSERT INTO orders (customer_id, total_amount) VALUES
(1, 90000),
(2, 25000),
(3, 12000),
(1, 3000),
(4, 75000),
(5, 60000),
(3, 25000),
(4, 9000),
(2, 1500),
(5, 12000);

INSERT INTO payments (order_id, amount, payment_method) VALUES
(1, 90000, 'Credit Card'),
(2, 25000, 'UPI'),
(3, 12000, 'Cash'),
(4, 3000, 'UPI'),
(5, 75000, 'Net Banking'),
(6, 60000, 'Credit Card'),
(7, 25000, 'Debit Card'),
(8, 9000, 'Cash'),
(9, 1500, 'UPI'),
(10, 12000, 'Debit Card');



📊 Queries

1️⃣ Top 3 Customers with Highest Number of Orders
SELECT 
  c.name, 
  COUNT(o.order_id) AS total_orders
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.name
ORDER BY total_orders DESC
LIMIT 3;


📝 Purpose: To identify your most frequent customers (useful for loyalty or discounts).

2️⃣ Orders Placed in the Last 30 Days
SELECT 
  o.order_id, 
  c.name AS customer_name, 
  o.order_date, 
  o.total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date >= NOW() - INTERVAL '30 days';


📝 Purpose: Helps businesses track recent activity for reporting or delivery follow-ups.

3️⃣ Total Revenue per Product
SELECT 
  p.name AS product_name, 
  SUM(op.quantity * p.price) AS total_revenue
FROM order_products op
JOIN products p ON op.product_id = p.product_id
GROUP BY p.name
ORDER BY total_revenue DESC;


📝 Purpose: To find out which products generate the most income and guide inventory or marketing decisions.

🧩 Design Choices Explained

Decision:Separate tables for customers, orders, products, and payments	
Reason:Improves normalization and avoids redundancy

Decision:order_products junction table	
Reason:Handles many-to-many relationship between orders and products

Decision:payment linked by order_id	
Reason:Maintains clear payment tracking for each order

Decision:Timestamp fields (created_at, order_date, etc.)	
Reason:Supports audit logs and chronological reports

Reason:Use of foreign keys	
Reason:Ensures referential integrity between entities