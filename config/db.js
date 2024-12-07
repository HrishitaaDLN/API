const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017"; // Use environment variable or default

let dbInstance;

async function connectToDatabase() {
    if (dbInstance) return dbInstance; // Return existing connection if available

    const client = new MongoClient(uri);
    await client.connect();
    dbInstance = client.db("cs480-project2"); // Connect to the correct database
    console.log("Connected to MongoDB!");
    return dbInstance;
}

module.exports = connectToDatabase;
