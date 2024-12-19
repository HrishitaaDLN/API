const mysql = require("mysql2/promise"); // Import the MySQL promise library
const dbConfig = require("../config/db1"); // Import database configuration

// Function to fetch all Customers
const getAllCustomers = async (req, res) => {
    try {
        // Establish a database connection
        const connection = await mysql.createConnection(dbConfig);
        
        // Query the database to fetch all customers
        const [rows] = await connection.execute("SELECT * FROM customer");
        
        // Close the connection
        await connection.end();
        
        // Send the data as JSON response
        res.json(rows);
    } catch (error) {
        console.error("Error fetching customers:", error.message);
        res.status(500).json(["An error has occurred."]); // Standard error response
    }
};

// Function to fetch a single customer by ID
const getCustomerById = async (req, res) => {
    const { id } = req.params; // Extract the ID from request parameters
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Query to fetch the customer with the specified ID
        const [rows] = await connection.execute("SELECT * FROM customer WHERE customer_id = ?", [id]);
        
        await connection.end();
        
        if (rows.length === 0) {
            return res.status(404).json(["Customer not found."]);
        }
        
        // Return the single Customer as JSON
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching customer by ID:", error.message);
        res.status(500).json(["An error has occurred."]);
    }
};

// Fetch customer details from the customer_list view by ID
const getCustomerDetail = async (req, res) => {
    const { id } = req.params;
    try {
	const connection = await mysql.createConnection(dbConfig);
        const [customer] = await connection.query('SELECT * FROM customer WHERE customer_id = ?', [id]);
        res.json(customer);
    } catch (err) {
        console.error('Error fetching customer:', err);
        res.status(500).json(['An error has occurred.']);
    }
};


// Export the functions for use in routes
module.exports = {
    getAllCustomers,
    getCustomerById,
    getCustomerDetail,
};
