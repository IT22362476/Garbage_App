const express = require("express");
const router = express.Router();
const CollectedWasteController = require("../controllers/CollectedWasteController");
const { authenticateJWT, authorizeRoles } = require("../middlewares/jwtAuth");

// POST - Store new waste collection data (route: /addCollectedWaste)
// SECURITY FIX: Added authentication and role-based authorization
router.post(
  "/addCollectedWaste",
  authenticateJWT,
  authorizeRoles("admin", "collector", "recorder"),
  CollectedWasteController.addCollectedWaste
);

// GET - Fetch all waste collection records (route: /getCollectedWaste)
// SECURITY FIX: Added authentication and role-based authorization
router.get(
  "/getCollectedWaste",
  authenticateJWT,
  authorizeRoles("admin", "collector", "recorder"),
  CollectedWasteController.getCollectedWaste
);

// GET - Fetch a single waste collection record by ID
// SECURITY FIX: Added authentication and role-based authorization
router.get(
  "/:collectedId",
  authenticateJWT,
  authorizeRoles("admin", "collector", "recorder"),
  CollectedWasteController.getCollectedWasteById
);

// PUT - Update a waste collection record by ID
// SECURITY FIX: Added authentication and role-based authorization
router.put(
  "/update/:collectedId",
  authenticateJWT,
  authorizeRoles("admin", "collector", "recorder"),
  CollectedWasteController.updateCollectedWaste
);

// DELETE - Delete a waste collection record by ID
// SECURITY FIX: Added authentication and role-based authorization
router.delete(
  "/delete/:collectedId",
  authenticateJWT,
  authorizeRoles("admin", "recorder"),
  CollectedWasteController.deleteCollectedWaste
);

module.exports = router;
