// pickupRoutesSingleton.js
const express = require("express");
let SchedulePickup = require("../models/SchedulePickup"); // Import the correct model

// Step 1: Define the Singleton class for managing the router
class PickupRoutesSingleton {
    constructor() {
        // Step 2: Check if an instance already exists
        if (!PickupRoutesSingleton.instance) {
            // Step 3: Create the router and initialize the routes only if it doesn't exist
            this.router = express.Router();
            this.initializeRoutes();
            // Save the instance
            PickupRoutesSingleton.instance = this;
        }
        // Step 4: Return the existing instance
        return PickupRoutesSingleton.instance;
    }

    // Step 5: Define all the routes inside this method
    initializeRoutes() {
        // Route to add a new pickup
        this.router.route("/addPickup").post((req, res) => {
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
        this.router.route("/getPickups").get((req, res) => {
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
        this.router.route("/getAllPickups").get((req, res) => {
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
        this.router.route("/getOnePickup/:id").get(async (req, res) => {
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
                res.status(500).send({
                    status: "Error with fetching pickup",
                    error: err,
                });
            }
        });

        // Route to delete pickups
        this.router.route("/deletePickup/:id").delete(async (req, res) => {
            let pickupId = req.params.id;
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
                    res.status(500).send({
                        status: "Error with delete pickup",
                        error: error.message,
                    });
                });
        });
    }

    // Step 6: Provide a method to get the router instance
    getRouter() {
        return this.router;
    }
}

// Step 7: Ensure only one instance of the class is created and exported
const instance = new PickupRoutesSingleton();
Object.freeze(instance);

module.exports = instance;
