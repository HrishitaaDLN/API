const { MongoClient } = require("mongodb");

class MovieController {
    constructor() {
        this.url = "mongodb://localhost:27017";
        this.dbName = "sample_mflix";
        this.db = null;
    }

    // Connect to the database
    async connectToDatabase() {
        try {
            const client = await MongoClient.connect(this.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            this.db = client.db(this.dbName);
            console.log("Connected to database:", this.dbName);
        } catch (error) {
            console.error("Error connecting to database:", error);
            throw new Error('Database connection failed');
        }
    }

    // Fetch movies from MongoDB with optional query parameters
    async getMovies(req, res) {
        const query = req.query;  // Get query parameters from the request

        try {
            // Ensure the database is connected
            if (!this.db) {
                await this.connectToDatabase(); // Ensure connection is made
            }

            const moviesCollection = this.db.collection('movies');
            const filter = {};

            // Apply filters based on query parameters
            if (query.genre) {
                filter.genre = query.genre;
            }
            if (query.year) {
                filter.year = parseInt(query.year, 10);
            }
            if (query.director) {
                filter.director = query.director;
            }

            // Fetch the movies from MongoDB
            const movies = await moviesCollection.find(filter).limit(10).toArray();

            // Return the movies as a JSON response
            res.json(movies);
        } catch (err) {
            console.error('Error fetching movies:', err);
            res.status(500).json(['An error has occurred.']);
        }
    }
}

module.exports = MovieController;
