const mysql = require("mysql2/promise"); // Import the MySQL promise library
const dbConfig = require("../config/db1"); // Import database configuration

// Function to fetch all Stores
const getAllStores = async (req, res) => {
    try {
        // Establish a database connection
        const connection = await mysql.createConnection(dbConfig);
        
        // Query the database to fetch all stores
        const [rows] = await connection.execute("SELECT * FROM store");
        
        // Close the connection
        await connection.end();
        
        // Send the data as JSON response
        res.json(rows);
    } catch (error) {
        console.error("Error fetching stores:", error.message);
        res.status(500).json(["An error has occurred."]); // Standard error response
    }
};

// Function to fetch a single store by ID
const getStoreById = async (req, res) => {
     const { id } = req.params;
    try {
        const [store] = await mysqlConnection.query('SELECT * FROM store WHERE store_id = ?', [id]);
        res.json(store);
    } catch (err) {
        console.error('Error fetching store:', err);
        res.status(500).json(['An error has occurred.']);
    }
};

// Export the functions for use in routes
module.exports = {
    getAllStores,
    getStoreById,
};
