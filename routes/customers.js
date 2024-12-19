const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
require("dotenv").config();

// MySQL Database Configuration
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "sakila",
};

// Get all customers
router.get("/", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM customer");
        res.json(rows); // Return all customers as JSON
        await connection.end();
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json(["An error has occurred."]);
    }
});

// Get a specific customer by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
	const connection = await mysql.createConnection(dbConfig);
        const [customer] = await connection.query('SELECT * FROM customer WHERE customer_id = ?', [id]);
        res.json(customer);
    } catch (err) {
        console.error('Error fetching customer:', err);
        res.status(500).json(['An error has occurred.']);
    }
});

// Get customer details from the customer_list view by ID
router.get("/:id/detail", async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT *
            FROM customer_list
            WHERE ID = ?;
        `;

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Customer not found in the customer_list view." });
        }

        res.status(200).json(rows[0]); // Return the single row as JSON
        await connection.end();
    } catch (error) {
        console.error(`Error fetching customer details with ID ${id}:`, error);
        res.status(500).json({ message: "An error occurred while fetching customer details." });
    }
});


module.exports = router;
