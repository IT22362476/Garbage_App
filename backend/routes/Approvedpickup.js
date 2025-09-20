const router = require("express").Router();
let Approvedpickup = require("../models/Approvedpickup");

// Route to get approved pickups for a specific user
router.route("/getapproved/:userID").get((req, res) => {
  const userID = req.params.userID;

  // Find approved pickups for the logged-in user
  Approvedpickup.find({ collectorid: userID })
    .then((Approvedpickup) => {
      res.json(Approvedpickup);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error: " + err);
    });
});

// Route to update the status of a pickup
router.route("/update/:id").post((req, res) => {
  const pickupId = req.params.id;
  const { status, collectorId } = req.body;
  // Validate pickupId as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(pickupId)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).json({ message: 'Invalid pickupId format.' });
  }
  // If status is present, update status
  if (status !== undefined) {
    Approvedpickup.findByIdAndUpdate(pickupId, { status: status }, { new: true })
      .then((updatedPickup) => {
        console.log("Updated pickup:", updatedPickup);
        res.json(updatedPickup);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error updating pickup: " + err);
      });
    return;
  }
  // If collectorId is present, update collector
  if (collectorId !== undefined) {
    Approvedpickup.findByIdAndUpdate(pickupId, { collector: collectorId }, { new: true })
      .then((updatedPickup) => {
        console.log('Updated pickup:', updatedPickup); // Log the updated document
        res.json(updatedPickup);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error updating pickup: " + err);
      });
    return;
  }
  res.status(400).json({ message: 'No valid update field provided.' });
});


// Route to get all approved pickups
router.route("/getApprovedPickups").get((req, res) => {
    Approvedpickup.find()
        .then((approvedPickups) => {
            res.json(approvedPickups);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error fetching approved pickups: " + err);
        });
});

module.exports = router;

// Allocate a collector to a pickup
router.route("/update/:id").post((req, res) => {
  const pickupId = req.params.id;
  const { collectorId } = req.body;
  // Validate pickupId as a valid MongoDB ObjectId
  if (!require('mongoose').Types.ObjectId.isValid(pickupId)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).json({ message: 'Invalid pickupId format.' });
  }
  // Validate collectorId as a string and sanitize input
  if (typeof collectorId !== 'string' || /[$.]/.test(collectorId)) {
    // FIX: Added collectorId sanitization to prevent NoSQL injection
    return res.status(400).json({ message: 'Invalid collectorId format.' });
  }
  // Find the pickup by id and update the collector
  Approvedpickup.findByIdAndUpdate(pickupId, { collector: collectorId }, { new: true })
    .then((updatedPickup) => {
      console.log('Updated pickup:', updatedPickup); // Log the updated document
      res.json(updatedPickup);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error allocating collector: " + err);
    });
});


router.route("/add").post((req, res) => {
  const { userid, collectorid, date, time, location, truckid } = req.body;

  const newApprovedpickup = new Approvedpickup({
    collectorid,
    date,
    time,
    userid,
    location,
    truckid,
  });

  newApprovedpickup
    .save()
    .then(() => {
      res.json("Approved pickup added!");
    })
    .catch((err) => {
      res.status(400).send("Error: " + err);
    });
});

router.route("/getall").get((req, res) => {
  Approvedpickup.find()
    .then((approvedpickups) => {
      res.json(approvedpickups);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

module.exports = router;

