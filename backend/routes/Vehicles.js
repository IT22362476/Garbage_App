const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const { authenticateJWT, authorizeRoles } = require("../middlewares/jwtAuth");

// Add a new vehicle (admin only) with input validation and sanitization
// FIX: Added express-validator to validate and sanitize input fields
const { body, validationResult } = require("express-validator");
router.post(
  "/addVehicle",
  authenticateJWT,
  authorizeRoles("admin"),
  [
    body("truckNo")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Truck number is required"),
    body("name").isString().trim().notEmpty().withMessage("Name is required"),
    body("area").isString().trim().notEmpty().withMessage("Area is required"),
    body("owner").isString().trim().notEmpty().withMessage("Owner is required"),
    body("year")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year must be a valid integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, return error response
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Only use validated and sanitized fields
      const { truckNo, name, area, owner, year } = req.body;
      const newVehicle = new Vehicle({ truckNo, name, area, owner, year });
      await newVehicle.save();
      res.json({ message: "Vehicle added successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Get all vehicles
// SECURITY FIX: Added authentication and role-based access
router.get(
  "/allVehicles",
  authenticateJWT,
  authorizeRoles("admin", "collector"),
  async (req, res) => {
    try {
      const vehicles = await Vehicle.find();
      res.json(vehicles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Import express-validator for input validation
const { param } = require("express-validator");

// Get a specific vehicle by ID
// Validate the vehicle ID to prevent NoSQL injection attacks
// SECURITY FIX: Added authentication and role-based access
router.get(
  "/Vehicle/:id",
  authenticateJWT,
  authorizeRoles("admin", "collector"),
  // Only allow valid MongoDB ObjectId format
  param("id").custom((value) => {
    if (!/^[a-fA-F0-9]{24}$/.test(value)) {
      throw new Error("Invalid vehicle ID");
    }
    return true;
  }),
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, return error response
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Safe to use req.params.id in query now
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Update a vehicle by ID (admin only) with input validation and sanitization
// FIX: Added express-validator to validate and sanitize input fields for update
// SECURITY FIX: Added authenticateJWT middleware
router.put(
  "/updateVehicle/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  [
    // Validate id as a valid MongoDB ObjectId
    param("id").custom((value) => {
      if (!require("mongoose").Types.ObjectId.isValid(value)) {
        throw new Error("Invalid vehicle id format.");
      }
      return true;
    }),
    // Only allow specific fields to be updated
    body("truckNo")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Truck number must be a non-empty string"),
    body("name")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Name must be a non-empty string"),
    body("area")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Area must be a non-empty string"),
    body("owner")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Owner must be a non-empty string"),
    body("year")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year must be a valid integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, return error response
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    // Only use validated and sanitized fields
    const allowedFields = ["truckNo", "name", "area", "owner", "year"];
    const updateData = {};
    for (const key of allowedFields) {
      if (Object.hasOwn(req.body, key)) {
        updateData[key] = req.body[key];
      }
    }
    try {
      const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json({ message: "Vehicle updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete a vehicle by ID
// Delete a vehicle by ID with input validation to prevent NoSQL injection
// Delete a vehicle by ID (admin only)
// SECURITY FIX: Added authenticateJWT middleware
router.delete(
  "/deleteVehicle/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    const { id } = req.params;
    // Validate id as a valid MongoDB ObjectId
    if (!require("mongoose").Types.ObjectId.isValid(id)) {
      // FIX: Added ObjectId validation to prevent NoSQL injection
      return res.status(400).json({ error: "Invalid vehicle id format." });
    }
    try {
      const deletedVehicle = await Vehicle.findByIdAndDelete(id);
      if (!deletedVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json({ message: "Vehicle deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
