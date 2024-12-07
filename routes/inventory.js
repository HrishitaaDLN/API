const express = require("express");
const router = express.Router();
const { getInventoryInStock } = require("../controllers/inventoryController");

// Route to get inventory IDs in stock for a specific film and store
router.get("/inventory-in-stock/:film_id/:store_id", getInventoryInStock);

module.exports = router;
