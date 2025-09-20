// routes/RecycleWastes.js
const express = require("express");
const router = express.Router();
const {
  addRecyclingWaste,
  getAllRecyclingWastes,
  getRecyclingWasteById,
  updateRecyclingWaste,
  deleteRecyclingWaste,
} = require("../controllers/recycleWasteController");
const authorizeRoles = require("../middlewares/auth"); // Importing authorization middleware

// CREATE: Add a new recycling dataset
// CREATE: Add a new recycling dataset (admin or collector only)
router.post(
  "/addRecyclingWastes",
  authorizeRoles("admin", "collector"),
  addRecyclingWaste
);

// READ: Get all recycling datasets
router.get("/allRecyclingWastes", getAllRecyclingWastes);

// READ: Get one recycling dataset by recycleID
router.get("/getRecyclingWaste/:recycleID", getRecyclingWasteById);

// UPDATE: Update a recycling dataset by recycleID
// UPDATE: Update a recycling dataset by recycleID (admin or collector only)
router.put(
  "/updateRecyclingWaste/:recycleID",
  authorizeRoles("admin", "collector"),
  updateRecyclingWaste
);

// DELETE: Delete a recycling dataset by recycleID
// DELETE: Delete a recycling dataset by recycleID (admin only)
router.delete(
  "/deleteRecyclingWaste/:recycleID",
  authorizeRoles("admin"),
  deleteRecyclingWaste
);

module.exports = router;
