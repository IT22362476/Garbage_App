const express = require("express");
const router = express.Router();
const GarbageDetail = require("../models/GarbageDetail"); // Import the GarbageDetail model
const ApprovedPickup = require("../models/Approvedpickup"); // Import the ApprovedPickup model

// Route to get completed garbage details
router.get("/completed-garbage", async (req, res) => {
  try {
    // Fetch approved pickups with 'Completed' status
    const completedPickups = await ApprovedPickup.find({ status: "Completed" });

    // Extract user IDs from completed pickups
    const userIds = completedPickups.map((pickup) => pickup.userid);

    // Fetch garbage details for these user IDs
    const garbageDetails = await GarbageDetail.find({
      userid: { $in: userIds },
    });

    // Send garbage details back as response
    res.json(garbageDetails);
  } catch (error) {
    console.error("Error fetching completed garbage details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to add a new garbage entry
router.post("/addGarbage", async (req, res) => {
  const { date, category, weight, userID } = req.body;

  const newGarbage = new GarbageDetail({
    date,
    category,
    weight,
    userID,
  });

  try {
    await newGarbage.save();
    res.json("Garbage Added");
  } catch (err) {
    console.error("Error adding garbage:", err);
    res.status(500).json({ message: "Error adding garbage" });
  }
});

// Route to get all garbage entries
router.get("/getAllGarbage", async (req, res) => {
  try {
    const garbages = await GarbageDetail.find();
    res.json(garbages);
  } catch (err) {
    console.error("Error fetching garbage entries:", err);
    res.status(500).json({ message: "Error fetching garbage entries" });
  }
});

// Route to get a single garbage entry by ID
router.get("/getOneGarbage/:id", async (req, res) => {
  const garbageId = req.params.id;

  try {
    const garbage = await GarbageDetail.findById(garbageId);
    if (!garbage) {
      return res
        .status(404)
        .send({ status: "Not Found", message: "Garbage entry not found" });
    }
    res.status(200).send({ status: "garbage fetched", garbage });
  } catch (err) {
    console.error("Error fetching garbage by ID:", err);
    res.status(500).send({ status: "Error with get garbage", error: err });
  }
});

module.exports = router;
