const router = require("express").Router();
let SchedulePickup = require("../models/SchedulePickup"); // Import the correct model
const { authenticateJWT, authorizeRoles } = require("../middlewares/jwtAuth");

// Route to add a new pickup
// SECURITY FIX: Added authentication and user validation
router.route("/addPickup").post(authenticateJWT, (req, res) => {
  const { date, time, location, userID } = req.body;

  // SECURITY FIX: Validate user can only create pickups for themselves (unless admin)
  if (req.user.role !== "admin" && req.user.id !== parseInt(userID)) {
    return res
      .status(403)
      .json({ error: "You can only create pickups for yourself" });
  }

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
// SECURITY FIX: Added authentication and user validation
router.route("/getPickups").get(authenticateJWT, (req, res) => {
  const { userID } = req.query;

  // SECURITY FIX: Validate user can only access their own pickups (unless admin)
  if (req.user.role !== "admin" && req.user.id !== parseInt(userID)) {
    return res
      .status(403)
      .json({ error: "You can only access your own pickups" });
  }

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
// SECURITY FIX: Added authentication and admin-only access
router
  .route("/getAllPickups")
  .get(authenticateJWT, authorizeRoles("admin"), (req, res) => {
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
// SECURITY FIX: Added authentication and user validation
router.route("/getOnePickup/:id").get(authenticateJWT, async (req, res) => {
  let pickupId = req.params.id;
  // Validate pickupId as a valid MongoDB ObjectId
  if (!require("mongoose").Types.ObjectId.isValid(pickupId)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).send({ status: "Invalid pickupId format." });
  }

  try {
    const schedulePickup = await SchedulePickup.findById(pickupId);
    if (!schedulePickup) {
      return res.status(404).send({ status: "Pickup not found" });
    }

    // SECURITY FIX: Validate user can only access their own pickups (unless admin)
    if (req.user.role !== "admin" && req.user.id !== schedulePickup.userID) {
      return res
        .status(403)
        .json({ error: "You can only access your own pickups" });
    }

    res.status(200).send({ status: "Pickup fetched", schedulePickup });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error with fetching pickup", error: err });
  }
});

//delete pickups
// SECURITY FIX: Added authentication and user validation
router.route("/deletePickup/:id").delete(authenticateJWT, async (req, res) => {
  let pickupId = req.params.id; // Access the _id from the URL parameter
  // Validate pickupId as a valid MongoDB ObjectId
  if (!require("mongoose").Types.ObjectId.isValid(pickupId)) {
    // FIX: Added ObjectId validation to prevent NoSQL injection
    return res.status(400).send({ status: "Invalid pickupId format." });
  }

  try {
    // SECURITY FIX: First check if pickup exists and user owns it
    const pickup = await SchedulePickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).send({ status: "Pickup not found" });
    }

    // SECURITY FIX: Validate user can only delete their own pickups (unless admin)
    if (req.user.role !== "admin" && req.user.id !== pickup.userID) {
      return res
        .status(403)
        .json({ error: "You can only delete your own pickups" });
    }

    await SchedulePickup.findByIdAndDelete(pickupId);
    res.status(200).send({ status: "Pickup deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .send({ status: "Error with delete pickup", error: error.message });
  }
});

// Get count of all pickups
// SECURITY FIX: Added authentication and admin-only access
router
  .route("/count")
  .get(authenticateJWT, authorizeRoles("admin"), (req, res) => {
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
// SECURITY FIX: Added authentication and role validation
router
  .route("/updateStatus/:id")
  .put(
    authenticateJWT,
    authorizeRoles("admin", "collector"),
    async (req, res) => {
      const { status } = req.body;
      const pickupId = req.params.id;
      // Validate pickupId as a valid MongoDB ObjectId
      if (!require("mongoose").Types.ObjectId.isValid(pickupId)) {
        // FIX: Added ObjectId validation to prevent NoSQL injection
        return res.status(400).send({ status: "Invalid pickupId format." });
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
        res
          .status(200)
          .send({ status: "Pickup status updated", updatedPickup });
      } catch (err) {
        res
          .status(500)
          .send({ status: "Error with updating pickup status", error: err });
      }
    }
  );

module.exports = router;
