const express = require("express");
const router = express.Router();
const TotalGarbage = require("../models/Totalgarbage"); // Import your TotalGarbage model
const authorizeRoles = require("../middlewares/auth"); // Importing authorization middleware

// POST route to save total garbage data
// Add total garbage (admin or collector only)
router.post(
  "/total-garbages",
  authorizeRoles("admin", "collector"),
  async (req, res) => {
    try {
      const { userId, totals } = req.body;

      // Create a new TotalGarbage document
      const newTotalGarbage = new TotalGarbage({
        userId,
        totals,
        createdAt: new Date(),
      });

      // Save the document to the database
      await newTotalGarbage.save();

      // Send a success response
      res.status(201).json({
        message: "Total garbage data saved successfully!",
        data: newTotalGarbage,
      });
    } catch (error) {
      console.error("Error saving total garbage data:", error);
      res.status(500).json({
        message: "Server error, could not save data.",
        error: error.message,
      });
    }
  }
);

module.exports = router;
