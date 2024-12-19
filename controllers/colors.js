const connectToDatabase = require("../config/db");
const { ObjectId } = require("mongodb");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI || "mongodb://localhost:27017"; // Use environment variable or default

// Get all colors
async function getColors(req, res) {
    try {
	const client = new MongoClient(uri);
    	await client.connect();
    	dbInstance = client.db("cs480-project2");
        const colorsCollection = client.collection('colors');
        const colors = await colorsCollection.find().toArray();
        res.json(colors);
    } catch (err) {
        console.error('Error fetching colors:', err);
        res.status(500).json(['An error has occurred.']);
    }
}

// Get a single color by ID
async function getColorById(req, res) {
    try {
	const client = new MongoClient(uri);
        const db = client.db('cs480-project2');
        const colorsCollection = db.collection('colors');
        const color = await colorsCollection.findOne({ _id: new ObjectId(req.params.id) });
        res.json(color);
    } catch (err) {
        console.error('Error fetching color:', err);
        res.status(500).json(['An error has occurred.']);
    }
}

// Add a new color
async function createColor(req, res) {
    try {
	const client = new MongoClient(uri);
        const db = client.db('cs480-project2');
        const colorsCollection = db.collection('colors');
        const result = await colorsCollection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error inserting color:', err);
        res.status(500).json(['An error has occurred.']);
    }

}

// Update a color by ID
async function updateColor(req, res) {
    try {
        const client = new MongoClient(uri);
        const db = client.db('cs480-project2');
        const colorsCollection = db.collection('colors');
        const result = await colorsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json(result);
    } catch (err) {
        console.error('Error updating color:', err);
        res.status(500).json(['An error has occurred.']);
    }
}

// Delete a color by ID
async function deleteColor(req, res) {
       try {
        const client = new MongoClient(uri);
        const db = client.db('cs480-project2');
        const colorsCollection = db.collection('colors');
        const result = await colorsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json(result);
    } catch (err) {
        console.error('Error deleting color:', err);
        res.status(500).json(['An error has occurred.']);
    }
}

module.exports = {
    getColors,
    getColorById,
    createColor,
    updateColor,
    deleteColor,
};
