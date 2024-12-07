const express = require("express");
const MovieController = require("../controllers/MovieController");

const router = express.Router();
const movieController = new MovieController();

// Route to fetch movies
router.get("/movies", movieController.getMovies.bind(movieController));

module.exports = router;
