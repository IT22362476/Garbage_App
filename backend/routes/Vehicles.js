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

module.exports = router;