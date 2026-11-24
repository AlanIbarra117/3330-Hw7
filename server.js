
const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Dashboard route
app.get('/', async (req, res) => {
    try {
        // Customer pagination
        const limit = 5;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const offset = (page - 1) * limit;

        // 1. Total customers
        const customerCount = await pool.query(
            'SELECT count(*) FROM customers'
        );

        // 2. Customers for the current page
        const customers = await pool.query(
            'SELECT * FROM customers ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        // 3. Total sales revenue
        const totalRevenue = await pool.query(
            'SELECT sum(saleamount) FROM sales'
        );

        // 4. Sales with product names
        const sales = await pool.query(
            `SELECT products.name, sales.quantity, sales.saleamount
             FROM sales
             LEFT JOIN products ON sales.productid = products.id
             ORDER BY sales.id ASC`
        );

        // 5. Orders quantity count
        const orderCount = await pool.query(
            'SELECT count(quantity) FROM orders'
        );

        // 6. Issue alert count
        const issueCount = await pool.query(
            "SELECT count(id) FROM alerts WHERE type = 'issues'"
        );

        // 7. Issue alerts
        const issues = await pool.query(
            "SELECT * FROM alerts WHERE type = 'issues'"
        );

        // 8. Notification count
        const notificationCount = await pool.query(
            "SELECT count(id) FROM alerts WHERE type = 'notifications'"
        );

        // 9. Notification alerts
        const notifications = await pool.query(
            "SELECT * FROM alerts WHERE type = 'notifications'"
        );

        // 10. Task alerts
        const tasks = await pool.query(
            "SELECT * FROM alerts WHERE type = 'tasks'"
        );

        // Send database results to the dashboard
        res.render('index', {
            totalCustomers: Number(customerCount.rows[0].count),
            customers: customers.rows,
            totalPages: Math.ceil(Number(customerCount.rows[0].count) / limit),
            currentPage: page,
            totalRevenue: Number(totalRevenue.rows[0].sum) || 0,
            sales: sales.rows,
            orderCount: Number(orderCount.rows[0].count),
            issueCount: Number(issueCount.rows[0].count),
            issues: issues.rows,
            notificationCount: Number(notificationCount.rows[0].count),
            notifications: notifications.rows,
            tasks: tasks.rows
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).send('Error loading dashboard data.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
