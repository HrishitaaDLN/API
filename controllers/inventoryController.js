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
    // Get the third parameter from the query string, default to 1 if not provided
    const thirdParam = req.query.thirdParam || 1;  // Example: Accepting thirdParam from query parameters

    try {
        // Call the stored procedure with three parameters
	const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.query('CALL film_in_stock(?, ?, ?)', [film_id, store_id, thirdParam]);

        // Send the result as JSON response
        res.json(result);
    } catch (err) {
        // Log and handle any errors that occur during the database query
        console.error('Error fetching inventory in stock:', err);
        res.status(500).json(['An error has occurred.']);
    }
};

module.exports = { getInventoryInStock };
