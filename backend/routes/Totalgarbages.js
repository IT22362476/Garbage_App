const express = require("express");
const router = express.Router();
const TotalGarbage = require("../models/Totalgarbage"); // Import your TotalGarbage model
const { authenticateJWT, authorizeRoles } = require("../middlewares/jwtAuth");

// POST route to save total garbage data
// Add total garbage (admin or collector only)
// SECURITY FIX: Added authenticateJWT middleware
router.post(
  "/total-garbages",
  authenticateJWT,
  authorizeRoles("admin", "collector"),
  async (req, res) => {
    try {
      const { userId, totals } = req.body;

      // SECURITY FIX: Validate user can only create records for themselves (unless admin)
      if (req.user.role !== "admin" && req.user.id !== parseInt(userId)) {
        return res
          .status(403)
          .json({ error: "You can only create records for yourself" });
      }

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
