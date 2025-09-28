const express = require("express");
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  updateAvailable,
  getAllAvailableVehicles,
  getVehicleCount,
} = require("../controllers/vehicleController");
const { authenticateJWT, authorizeRoles } = require("../middlewares/jwtAuth");

const router = express.Router();

// SECURITY FIX: Added authentication and role-based authorization for all vehicle routes
router.post("/", authenticateJWT, authorizeRoles("admin"), createVehicle);
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "collector", "recorder"),
  getAllVehicles
);
router.get(
  "/get/:id",
  authenticateJWT,
  authorizeRoles("admin", "collector"),
  getVehicleById
);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), updateVehicle);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteVehicle);
router.put(
  "/:id/availability",
  authenticateJWT,
  authorizeRoles("admin", "collector"),
  updateAvailable
);
router.get(
  "/available",
  authenticateJWT,
  authorizeRoles("admin", "collector"),
  getAllAvailableVehicles
);
router.get("/count", authenticateJWT, authorizeRoles("admin"), getVehicleCount);

module.exports = router;
