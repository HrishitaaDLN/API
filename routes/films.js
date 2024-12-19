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
        const [film] = await connection.query('SELECT * FROM film WHERE film_id = ?', [id]);
        res.json(film);
    } catch (err) {
        console.error('Error fetching film:', err);
        res.status(500).json(['An error has occurred.']);
    }
});

router.get("/:id/actors", async (req, res) => {
    const { id } = req.params;
    try {
	const connection = await mysql.createConnection(dbConfig);

        const [actors] = await connection.query(
            'SELECT actor.* FROM actor JOIN film_actor ON actor.actor_id = film_actor.actor_id WHERE film_actor.film_id = ?',
            [id]
        );
        res.json(actors);
    } catch (err) {
        console.error('Error fetching film actors:', err);
        res.status(500).json(['An error has occurred.']);
    }
});

// Get film details from the film_list view by ID
router.get("/:id/detail", async (req, res) => {
     const { id } = req.params;
    try {
	const connection = await mysql.createConnection(dbConfig);

        const [details] = await connection.query('SELECT * FROM film_list WHERE FID = ?', [id]);
        res.json(details);
    } catch (err) {
        console.error('Error fetching film details:', err);
        res.status(500).json(['An error has occurred.']);
    }
});

module.exports = router;
