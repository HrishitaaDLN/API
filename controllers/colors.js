const connectToDatabase = require("../config/db");
const { ObjectId } = require("mongodb");

// Get all colors
async function getColors(req, res) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("colors");
        const colors = await collection.find().toArray();
        res.status(200).json(colors);
    } catch (error) {
        console.error(error);
        res.status(500).json(["An error has occurred."]);
    }
}

// Get a single color by ID
async function getColorById(req, res) {
    try {
        const { id } = req.params;
        const db = await connectToDatabase();
        const collection = db.collection("colors");
        const color = await collection.findOne({ _id: new ObjectId(id) });

        if (!color) {
            return res.status(404).json(["Color not found."]);
        }

        res.status(200).json(color);
    } catch (error) {
        console.error(error);
        res.status(500).json(["An error has occurred."]);
    }
}

// Add a new color
async function createColor(req, res) {
    try {
        const newColor = req.body;
        const db = await connectToDatabase();
        const collection = db.collection("colors");
        const result = await collection.insertOne(newColor);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(["An error has occurred."]);
    }
}

// Update a color by ID
async function updateColor(req, res) {
    try {
        const { id } = req.params;
        const updatedColor = req.body;
        const db = await connectToDatabase();
        const collection = db.collection("colors");
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedColor }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json(["Color not found."]);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(["An error has occurred."]);
    }
}

// Delete a color by ID
async function deleteColor(req, res) {
    try {
        const { id } = req.params;
        const db = await connectToDatabase();
        const collection = db.collection("colors");
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json(["Color not found."]);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(["An error has occurred."]);
    }
}

module.exports = {
    getColors,
    getColorById,
    createColor,
    updateColor,
    deleteColor,
};
