const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI || "mongodb://localhost:27017"; // Use environment variable or default

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
        // Connect to the MongoDB database and collection
	const client = new MongoClient(uri)
        const db = client.db('sample_mflix');
        const moviesCollection = db.collection('movies');

        // Filter query based on optional query parameters
        const filter = {};

        // Add filters for each query parameter
        if (query.genre) {
            filter.genre = query.genre;
        }
        if (query.year) {
            filter.year = parseInt(query.year, 10); // Convert to integer for year filtering
        }
        if (query.director) {
            filter.director = query.director;
        }

        // Fetch the movies from MongoDB based on the filter
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
