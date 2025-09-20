const router = require("express").Router();
let SchedulePickup = require("../models/SchedulePickup"); // Import the correct model

// Route to add a new pickup
router.route("/addPickup").post((req, res) => {
  const { date, time, location, userID } = req.body;

  const newPickup = new SchedulePickup({
    date,
    time,
    location,
    userID,
  });

  newPickup
    .save()
    .then(() => {
      res.json("Pickup Added");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error: " + err);
    });
});

// Route to get all pickups for a specific user
router.route("/getPickups").get((req, res) => {
  const { userID } = req.query;

  SchedulePickup.find({ userID }) // Filter by userID
    .then((schedulePickups) => {
      res.json(schedulePickups);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error: " + err);
    });
});

// Route to get all pickups
router.route("/getAllPickups").get((req, res) => {
  SchedulePickup.find()
    .then((schedulePickups) => {
      res.json(schedulePickups);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error: " + err);
    });
});

// Route to get a single pickup by ID
router.route("/getOnePickup/:id").get(async (req, res) => {
  let pickupId = req.params.id;
  // Validate pickupId as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(pickupId)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).send({ status: 'Invalid pickupId format.' });
  }

  try {
  const schedulePickup = await SchedulePickup.findById(pickupId);
    if (!schedulePickup) {
      return res.status(404).send({ status: "Pickup not found" });
    }
    res.status(200).send({ status: "Pickup fetched", schedulePickup });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error with fetching pickup", error: err });
  }
});

//delete pickups

router.route("/deletePickup/:id").delete(async (req, res) => {
  let pickupId = req.params.id; // Access the _id from the URL parameter
  // Validate pickupId as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(pickupId)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).send({ status: 'Invalid pickupId format.' });
  }

  await SchedulePickup.findByIdAndDelete(pickupId)
    .then(() => {
      res.status(200).send({ status: "Pickup deleted successfully" });
    })
    .catch((error) => {
      console.log(error.message);
      res
        .status(500)
        .send({ status: "Error with delete pickup", error: error.message });
    });
});

// Get count of all pickups
router.route("/count").get((req, res) => {
  SchedulePickup.countDocuments()
    .then((count) => {
      res.json({ count });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error: " + err);
    });
});

// Update the status of a pickup request
router.route("/updateStatus/:id").put(async (req, res) => {
  const { status } = req.body;
  const pickupId = req.params.id;
  // Validate pickupId as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(pickupId)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).send({ status: 'Invalid pickupId format.' });
  }

  try {
    const updatedPickup = await SchedulePickup.findByIdAndUpdate(
      pickupId,
      { status },
      { new: true }
    );
    if (!updatedPickup) {
      return res.status(404).send({ status: "Pickup not found" });
    }
    res.status(200).send({ status: "Pickup status updated", updatedPickup });
  } catch (err) {
    res
      .status(500)
      .send({ status: "Error with updating pickup status", error: err });
  }
});

module.exports = router;
