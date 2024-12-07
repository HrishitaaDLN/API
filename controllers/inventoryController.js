const mysql = require("mysql2/promise");
require("dotenv").config();
const pool = require("../config/db1");  // Assuming you have a shared pool for DB connections

// MySQL Database Configuration
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "sakila",
};

// Get inventory IDs in stock for a specific film and store by calling the film_in_stock procedure
const getInventoryInStock = async (req, res) => {
    const { film_id, store_id } = req.params;

    try {
        const query = `CALL film_in_stock(?, ?)`;
        
        const [rows] = await pool.execute(query, [film_id, store_id]);

        if (rows[0].length === 0) {
            return res.status(404).json({ message: "No inventory found for this film in the given store." });
        }

        res.status(200).json(rows[0]); // Return the result set as JSON
    } catch (error) {
        console.error(`Error fetching inventory for film ${film_id} at store ${store_id}:`, error);
        res.status(500).json({ message: "An error occurred while fetching the inventory." });
    }
};

module.exports = { getInventoryInStock };
