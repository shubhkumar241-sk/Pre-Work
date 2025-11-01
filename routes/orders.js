var express = require('express');
var router = express.Router();
const pool = require('../dbconfig');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: APIs for Order Management System (Customers, Orders, Products, Payments)
 */

//
// =======================
//  CUSTOMERS ENDPOINTS
// =======================
//

/**
 * @swagger
 * /orders/addCustomer:
 *   post:
 *     summary: Add a new customer
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema: { type: string }
 *         description: Customer name
 *       - in: query
 *         name: email
 *         required: true
 *         schema: { type: string }
 *         description: Customer email
 *       - in: query
 *         name: phone
 *         required: false
 *         schema: { type: string }
 *         description: Customer phone number
 *     responses:
 *       201: { description: Customer added successfully }
 *       400: { description: Missing required fields }
 */
router.post('/addCustomer', auth, async (req, res) => {
  try {
    const { name, email, phone } = req.query;
    if (!name || !email)
      return res.status(400).json({ error: "Name and email are required" });

    const query = 'INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [name, email, phone || null]);

    res.status(201).json({ message: "Customer added successfully!", customer: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//
// =======================
//  ORDERS ENDPOINTS
// =======================
//

/**
 * @swagger
 * /orders/addOrder:
 *   post:
 *     summary: Add a new order for a customer
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: customer_id
 *         required: true
 *         schema: { type: integer }
 *         description: ID of the customer
 *       - in: query
 *         name: status
 *         required: false
 *         schema: { type: string }
 *         description: Order status
 *     responses:
 *       201: { description: Order added successfully }
 *       400: { description: Missing required fields }
 */
router.post('/addOrder', auth, async (req, res) => {
  try {
    const { customer_id, status } = req.query;
    if (!customer_id)
      return res.status(400).json({ error: "Customer ID is required" });

    const query = 'INSERT INTO orders (customer_id, status) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [customer_id, status || 'Pending']);

    res.status(201).json({ message: "Order added successfully!", order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//
// =======================
//  QUERY TASKS
// =======================
//

/**
 * @swagger
 * /orders/topCustomers:
 *   get:
 *     summary: Get top 3 customers with the highest number of orders
 *     tags: [Orders]
 *     responses:
 *       200: { description: Top customers retrieved }
 */
router.get('/topCustomers', auth, async (req, res) => {
  try {
    const query = `
      SELECT c.name AS customer_name, COUNT(o.order_id) AS total_orders
      FROM customers c
      JOIN orders o ON c.customer_id = o.customer_id
      GROUP BY c.name
      ORDER BY total_orders DESC
      LIMIT 3;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /orders/recentOrders:
 *   get:
 *     summary: Get orders placed in the last 30 days
 *     tags: [Orders]
 *     responses:
 *       200: { description: Recent orders retrieved }
 */
router.get('/recentOrders', auth, async (req, res) => {
  try {
    const query = `
      SELECT o.order_id, c.name AS customer_name, o.order_date, o.status
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      WHERE o.order_date >= NOW() - INTERVAL '30 days'
      ORDER BY o.order_date DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /orders/revenuePerProduct:
 *   get:
 *     summary: Get total revenue for each product
 *     tags: [Orders]
 *     responses:
 *       200: { description: Revenue per product calculated }
 */
router.get('/revenuePerProduct', auth, async (req, res) => {
  try {
    const query = `
      SELECT 
        p.product_id,
        p.product_name,
        COALESCE(SUM(op.quantity), 0) AS total_quantity_sold,
        COALESCE(SUM(op.subtotal), 0) AS total_revenue
      FROM products p
      LEFT JOIN order_products op ON p.product_id = op.product_id
      GROUP BY p.product_id, p.product_name
      ORDER BY total_revenue DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//
// =======================
//  PAYMENTS ENDPOINT
// =======================
//

/**
 * @swagger
 * /orders/addPayment:
 *   post:
 *     summary: Add a payment for an order
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: order_id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: amount
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: payment_method
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201: { description: Payment added successfully }
 *       400: { description: Missing required fields }
 */
router.post('/addPayment', auth, async (req, res) => {
  try {
    const { order_id, amount, payment_method } = req.query;
    if (!order_id || !amount || !payment_method)
      return res.status(400).json({ error: "order_id, amount, and payment_method are required" });

    const query = `
      INSERT INTO payments (order_id, amount, payment_method, status)
      VALUES ($1, $2, $3, 'Completed') RETURNING *;
    `;
    const result = await pool.query(query, [order_id, amount, payment_method]);

    res.status(201).json({ message: "Payment added successfully!", payment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
