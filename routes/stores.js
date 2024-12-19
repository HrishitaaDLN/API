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

// Get all stores
router.get("/", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM store");
        res.json(rows); // Return all stores as JSON
        await connection.end();
    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json(["An error has occurred."]);
    }
});

// Get a specific store by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
	const connection = await mysql.createConnection(dbConfig);
        const [store] = await connection.query('SELECT * FROM store WHERE store_id = ?', [id]);
        res.json(store);
    } catch (err) {
        console.error('Error fetching store:', err);
        res.status(500).json(['An error has occurred.']);
    }
});

module.exports = router;
