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

// Get all actors
router.get("/", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM actor");
        res.json(rows); // Return all actors as JSON
        await connection.end();
    } catch (error) {
        console.error("Error fetching actors:", error);
        res.status(500).json({ message: "An error has occurred." });
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
        res.status(500).json({ message: "An error has occurred." });
    }
});

// Get all films for a specific actor
router.get("/:id/films", async (req, res) => {
    const { id } = req.params; // Actor ID
    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            SELECT film.* 
            FROM film
            INNER JOIN film_actor ON film.film_id = film_actor.film_id
            WHERE film_actor.actor_id = ?;
        `;
        const [rows] = await connection.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No films found for the specified actor." });
        }

        res.json(rows); // Return films as JSON
        await connection.end();
    } catch (error) {
        console.error(`Error fetching films for actor ID ${id}:`, error);
        res.status(500).json({ message: "An error has occurred." });
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

// Fetch actor details from the actor_info view by ID
const getActorDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT *
            FROM actor_info
            WHERE ID = ?;
        `;

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Actor not found in the actor_info view." });
        }

        res.status(200).json(rows[0]); // Return the single row as JSON
        await connection.end();
    } catch (error) {
        console.error(`Error fetching actor details with ID ${id}:`, error);
        res.status(500).json({ message: "An error occurred while fetching actor details." });
    }
};


module.exports = { getFilmsByActor, getActorsByFilm, getActorDetail };

module.exports = router;
