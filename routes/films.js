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

// Get all films
router.get("/", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM film");
        res.json(rows); // Return all films as JSON
        await connection.end();
    } catch (error) {
        console.error("Error fetching films:", error);
        res.status(500).json(["An error has occurred."]);
    }
});

// Get a specific film by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM film WHERE film_id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Film not found." });
        }

        res.json(rows[0]); // Return the film as JSON
        await connection.end();
    } catch (error) {
        console.error(`Error fetching film with ID ${id}:`, error);
        res.status(500).json(["An error has occurred."]);
    }
});

router.get("/:id/actors", async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT a.actor_id, a.first_name, a.last_name
            FROM actor a
            INNER JOIN film_actor fa ON a.actor_id = fa.actor_id
            WHERE fa.film_id = ?;
        `;

        // Use a new database connection for this route
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No actors found for this film." });
        }

        res.status(200).json(rows);
        await connection.end(); // Close the connection
    } catch (error) {
        console.error("Error fetching actors for film:", error);
        res.status(500).json({ message: "An error occurred while fetching actors." });
    }
});

// Get film details from the film_list view by ID
router.get("/:id/detail", async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT *
            FROM film_list
            WHERE FID = ?;
        `;

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Film not found in the film_list view." });
        }

        res.status(200).json(rows[0]); // Return the single row as JSON
        await connection.end();
    } catch (error) {
        console.error("Error fetching film detail from film_list:", error);
        res.status(500).json({ message: "An error occurred while fetching film details." });
    }
});

module.exports = router;
