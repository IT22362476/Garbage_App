// controllers/recycleWasteController.js
const RecycleWaste = require('../models/RecycleWaste');

// CREATE: Add a new recycling dataset
const addRecyclingWaste = async (req, res) => {
  const {
    truckNumber,
    area,
    paperWeight,
    foodWeight,
    polytheneWeight,
    totalWaste,
    calculatedCharge,
  } = req.body;

  try {
    const newWaste = new RecycleWaste({
      truckNumber,
      area,
      paperWeight,
      foodWeight,
      polytheneWeight,
      totalWaste,
      calculatedCharge,
    });

    await newWaste.save();
    res.status(201).json({ message: 'Recycling waste data added successfully', newWaste });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add recycling waste data', error });
  }
};

// READ: Get all recycling datasets
const getAllRecyclingWastes = async (req, res) => {
  try {
    const wastes = await RecycleWaste.find();
    res.status(200).json(wastes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recycling data', error });
  }
};

// READ: Get one recycling dataset by recycleID
const getRecyclingWasteById = async (req, res) => {
  const { recycleID } = req.params;
  // Validate recycleID as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(recycleID)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).json({ message: 'Invalid recycleID format.' });
  }

  try {
  const waste = await RecycleWaste.findById(recycleID);
    if (!waste) {
      return res.status(404).json({ message: 'Recycling waste data not found' });
    }
    res.status(200).json(waste);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recycling waste data', error });
  }
};

// UPDATE: Update a recycling dataset by recycleID
const updateRecyclingWaste = async (req, res) => {
  const { recycleID } = req.params;
  // Validate recycleID as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(recycleID)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).json({ message: 'Invalid recycleID format.' });
  }
  const {
    truckNumber,
    area,
    paperWeight,
    foodWeight,
    polytheneWeight,
    totalWaste,
    calculatedCharge,
  } = req.body;

  try {
    const updatedWaste = await RecycleWaste.findByIdAndUpdate(
      recycleID,
      {
        truckNumber,
        area,
        paperWeight,
        foodWeight,
        polytheneWeight,
        totalWaste,
        calculatedCharge,
      },
      { new: true } // Returns the updated document
    );

    if (!updatedWaste) {
      return res.status(404).json({ message: 'Recycling waste data not found' });
    }

    res.status(200).json({ message: 'Recycling waste data updated successfully', updatedWaste });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update recycling waste data', error });
  }
};

// DELETE: Delete a recycling dataset by recycleID
const deleteRecyclingWaste = async (req, res) => {
  const { recycleID } = req.params;
  // Validate recycleID as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(recycleID)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).json({ message: 'Invalid recycleID format.' });
  }

  try {
  const deletedWaste = await RecycleWaste.findByIdAndDelete(recycleID);

    if (!deletedWaste) {
      return res.status(404).json({ message: 'Recycling waste data not found' });
    }

    res.status(200).json({ message: 'Recycling waste data deleted successfully', deletedWaste });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete recycling waste data', error });
  }
};

// Exporting controller functions
module.exports = {
  addRecyclingWaste,
  getAllRecyclingWastes,
  getRecyclingWasteById,
  updateRecyclingWaste,
  deleteRecyclingWaste,
};
