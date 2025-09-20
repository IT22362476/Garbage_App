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

// Import express-validator for input validation
const { param, validationResult } = require('express-validator');

// Get a specific vehicle by ID
// Validate the vehicle ID to prevent NoSQL injection attacks
router.get('/Vehicle/:id',
  // Only allow valid MongoDB ObjectId format
  param('id').custom((value) => {
    if (!/^[a-fA-F0-9]{24}$/.test(value)) {
      throw new Error('Invalid vehicle ID');
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
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.json(vehicle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Update a vehicle by ID
// Update a vehicle by ID with input validation to prevent NoSQL injection
router.put('/updateVehicle/:id', async (req, res) => {
  const { id } = req.params;
  // Validate id as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(id)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).json({ error: 'Invalid vehicle id format.' });
  }
  // Only allow specific fields to be updated to prevent NoSQL injection via update operators
  // FIX: Sanitize req.body to only allow safe fields
  const allowedFields = ['name', 'type', 'number', 'capacity', 'isAvailable'];
  const updateData = {};
  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      updateData[key] = req.body[key];
    }
  }
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a vehicle by ID
// Delete a vehicle by ID with input validation to prevent NoSQL injection
router.delete('/deleteVehicle/:id', async (req, res) => {
  const { id } = req.params;
  // Validate id as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(id)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).json({ error: 'Invalid vehicle id format.' });
  }
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    if (!deletedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;