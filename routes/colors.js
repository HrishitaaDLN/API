const express = require("express");
const {
    getColors,
    getColorById,
    createColor,
    updateColor,
    deleteColor,
} = require("../controllers/colors");

const router = express.Router();

// Routes
router.get("/", getColors);           // GET /api/v1/colors
router.get("/:id", getColorById);     // GET /api/v1/colors/:id
router.post("/", createColor);        // POST /api/v1/colors
router.put("/:id", updateColor);      // PUT /api/v1/colors/:id
router.delete("/:id", deleteColor);   // DELETE /api/v1/colors/:id

module.exports = router;
