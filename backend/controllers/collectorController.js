// Contact number encryption/decryption is handled automatically by User model.
// In controllers/collectorController.js

const User = require("../models/User"); // User model
const ResidentRequest = require("../models/ResidentRequest"); // Resident Request model

// Fetch all users with the role of 'collector'
exports.getCollectors = async (req, res) => {
  try {
    const collectors = await User.find({ role: "collector" });
    res.json(collectors);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// Fetch all resident requests that need to be allocated
exports.getResidentRequests = async (req, res) => {
  try {
    const requests = await ResidentRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// Allocate resident requests to a collector
exports.allocateRequestsToCollector = async (req, res) => {
  const { requests } = req.body;
  const { id: collectorId } = req.params;

  try {
    // Update resident requests by adding the collector ID
    await ResidentRequest.updateMany(
      { _id: { $in: requests } },
      { $set: { collector: collectorId } }
    );

    res.send("Requests allocated successfully");
  } catch (error) {
    res.status(500).send("Error allocating requests");
  }
};
