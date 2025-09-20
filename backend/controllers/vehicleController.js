const Vehicle = require("../models/Vehicle");

// Create a new vehicle
const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all available vehicles
const getAllAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isAvailable: true });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    // Validate id as a valid MongoDB ObjectId
    const { id } = req.params;
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      // FIX: Added ObjectId validation to prevent NoSQL injection
      return res.status(400).json({ message: 'Invalid vehicle id format.' });
    }
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a vehicle
const updateVehicle = async (req, res) => {
  try {
    // Validate id as a valid MongoDB ObjectId
    const { id } = req.params;
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      // FIX: Added ObjectId validation to prevent NoSQL injection
      return res.status(400).json({ message: 'Invalid vehicle id format.' });
    }
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedVehicle)
      return res.status(404).json({ message: "Vehicle not found" });
    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a vehicle
const deleteVehicle = async (req, res) => {
  try {
    // Validate id as a valid MongoDB ObjectId
    const { id } = req.params;
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      // FIX: Added ObjectId validation to prevent NoSQL injection
      return res.status(400).json({ message: 'Invalid vehicle id format.' });
    }
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    if (!deletedVehicle)
      return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update vehicle availability
const updateAvailable = async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({
      message: "Vehicle availability updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get vehicle count
const getVehicleCount = async (req, res) => {
  try {
    const count = await Vehicle.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  updateAvailable,
  getAllAvailableVehicles,
  getVehicleCount,
};
