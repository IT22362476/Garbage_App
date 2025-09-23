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
const { authenticateJWT, authorizeRoles } = require('../middlewares/jwtAuth');

const router = express.Router();

// SECURITY FIX: Added authentication and role-based authorization for all vehicle routes
router.post("/", authenticateJWT, authorizeRoles("admin"), createVehicle);
router.get("/", authenticateJWT, authorizeRoles("admin", "collector"), getAllVehicles);
router.get("/get/:id", authenticateJWT, authorizeRoles("admin", "collector"), getVehicleById);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), updateVehicle);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteVehicle);
router.put("/:id/availability", authenticateJWT, authorizeRoles("admin", "collector"), updateAvailable);
router.get("/available", authenticateJWT, authorizeRoles("admin", "collector"), getAllAvailableVehicles);
router.get("/count", authenticateJWT, authorizeRoles("admin"), getVehicleCount);

module.exports = router;
/*
const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Add a new vehicle
router.post('/addVehicle', async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.json({ message: 'Vehicle added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all vehicles
router.get('/allVehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific vehicle by ID
router.get('/Vehicle/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a vehicle by ID
router.put('/updateVehicle/:id', async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a vehicle by ID
router.delete('/deleteVehicle/:id', async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
*/