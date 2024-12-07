require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise"); // Include MySQL package
const colorsRoutes = require("./routes/colors");
const actorsRoutes = require("./routes/actors");
const filmsRoutes = require("./routes/films");
const customersRoutes = require("./routes/customers");
const storesRoutes = require("./routes/stores");
const inventoryRoutes = require("./routes/inventory");
const movieRoutes = require('./routes/movie');  // Import the movie routes


const app = express();
const PORT = process.env.PORT || 3000;

// Database Configuration
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "sakila",
};

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/colors", colorsRoutes);
app.use("/api/v1/actors", actorsRoutes);
app.use("/api/v1/films" , filmsRoutes);
app.use("/api/v1/customers" , customersRoutes);
app.use("/api/v1/stores" , storesRoutes);
app.use("/api/v1", inventoryRoutes);
app.use("/api/v1", movieRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
