const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
require("dotenv").config();
const pool = require("../config/db1");


// MySQL Database Configuration
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "sakila",
};

// Get all actors
router.get("/", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM actor");
        res.json(rows); // Return all actors as JSON
        await connection.end();
    } catch (error) {
        console.error("Error fetching actors:", error);
        res.status(500).json(["An error has occurred."]);
    }
});

// Get a specific actor by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM actor WHERE actor_id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Actor not found." });
        }

        res.json(rows[0]); // Return the actor as JSON
        await connection.end();
    } catch (error) {
        console.error(`Error fetching actor with ID ${id}:`, error);
        res.status(500).json(["An error has occurred."]);
    }
});

// Get films for a specific actor by actor_id
router.get("/:id/films", async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT f.film_id, f.title, f.description, f.release_year
            FROM film f
            INNER JOIN film_actor fa ON f.film_id = fa.film_id
            WHERE fa.actor_id = ?;
        `;
        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No films found for this actor." });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching films:", error);
        res.status(500).json({ message: "An error occurred while fetching films." });
    }
});

// Get all actors for a specific film by film_id
router.get("/films/:id/actors", async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT a.actor_id, a.first_name, a.last_name
            FROM actor a
            INNER JOIN film_actor fa ON a.actor_id = fa.actor_id
            WHERE fa.film_id = ?;
        `;
        const [rows] = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No actors found for this film." });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching actors for film:", error);
        res.status(500).json({ message: "An error occurred while fetching actors." });
    }
});

// Get actor details from the actor_info view by ID
router.get("/:id/detail", async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT *
            FROM actor_info
            WHERE actor_id = ?;
        `;

        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Actor not found in the actor_info view." });
        }

        res.status(200).json(rows[0]); // Return the single row as JSON
    } catch (error) {
        console.error(`Error fetching actor details with ID ${id}:`, error);
        res.status(500).json({ message: "An error occurred while fetching actor details." });
    }
});

module.exports = router;
