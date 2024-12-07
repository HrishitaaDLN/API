const mysql = require("mysql2/promise"); // Import the MySQL promise library
const dbConfig = require("../config/db1"); // Import database configuration

// Function to fetch all Films
const getAllFilms = async (req, res) => {
    try {
        // Establish a database connection
        const connection = await mysql.createConnection(dbConfig);
        
        // Query the database to fetch all films
        const [rows] = await connection.execute("SELECT * FROM film");
        
        // Close the connection
        await connection.end();
        
        // Send the data as JSON response
        res.json(rows);
    } catch (error) {
        console.error("Error fetching films:", error.message);
        res.status(500).json(["An error has occurred."]); // Standard error response
    }
};

// Function to fetch a single film by ID
const getFilmById = async (req, res) => {
    const { id } = req.params; // Extract the ID from request parameters
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Query to fetch the film with the specified ID
        const [rows] = await connection.execute("SELECT * FROM film WHERE film_id = ?", [id]);
        
        await connection.end();
        
        if (rows.length === 0) {
            return res.status(404).json(["Film not found."]);
        }
        
        // Return the single Film as JSON
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching film by ID:", error.message);
        res.status(500).json(["An error has occurred."]);
    }
};

// Controller to get all actors for a given film ID
const getActorsByFilmId = async (req, res) => {
    const filmId = req.params.id;

    try {
        const [actors] = await db.query(
            `SELECT actor.* 
             FROM actor
             INNER JOIN film_actor ON actor.id = film_actor.actor_id
             WHERE film_actor.film_id = ?`,
            [filmId]
        );

        if (actors.length === 0) {
            return res.status(404).json({ message: 'No actors found for this film.' });
        }

        res.status(200).json(actors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching actors.', error });
    }
};

// Fetch film details from the film_list view by ID
const getFilmDetail = async (req, res) => {
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
};

// Export the functions for use in routes
module.exports = {
    getAllFilms,
    getFilmById,
    getActorsByFilmId,
    getFilmDetail,
};
