// routes/RecycleWastes.js
const express = require("express");
const router = express.Router();
const {
  addRecyclingWaste,
  getAllRecyclingWastes,
  getRecyclingWasteById,
  updateRecyclingWaste,
  deleteRecyclingWaste,
} = require("../controllers/recycleWasteController");
const authorizeRoles = require("../middlewares/auth"); // Importing authorization middleware

// CREATE: Add a new recycling dataset (admin or collector only) with input validation and sanitization
// FIX: Added express-validator to validate and sanitize input fields
const { body, validationResult } = require("express-validator");
router.post(
  "/addRecyclingWastes",
  authorizeRoles("admin", "collector" , "recorder"),
  [
    body("truckNumber").isString().trim().notEmpty().withMessage("Truck number is required"),
    body("area").isString().trim().notEmpty().withMessage("Area is required"),
    body("paperWeight").isFloat({ min: 0 }).withMessage("Paper weight must be a non-negative number"),
    body("foodWeight").isFloat({ min: 0 }).withMessage("Food weight must be a non-negative number"),
    body("polytheneWeight").isFloat({ min: 0 }).withMessage("Polythene weight must be a non-negative number"),
    body("totalWaste").optional().isFloat({ min: 0 }).withMessage("Total waste must be a non-negative number"),
    body("calculatedCharge").optional().isFloat({ min: 0 }).withMessage("Calculated charge must be a non-negative number"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, return error response
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addRecyclingWaste
);

// READ: Get all recycling datasets
router.get("/allRecyclingWastes", getAllRecyclingWastes);

// READ: Get one recycling dataset by recycleID
router.get("/getRecyclingWaste/:recycleID", getRecyclingWasteById);


// UPDATE: Update a recycling dataset by recycleID (admin or collector only) with input validation and sanitization
// FIX: Added express-validator to validate and sanitize input fields for update
router.put(
  "/updateRecyclingWaste/:recycleID",
  authorizeRoles("admin", "collector" , "recorder"),
  [
    // Validate recycleID as a valid MongoDB ObjectId
    require("express-validator").param("recycleID").custom((value) => {
      if (!require("mongoose").Types.ObjectId.isValid(value)) {
        throw new Error("Invalid recycleID format.");
      }
      return true;
    }),
    require("express-validator").body("truckNumber").optional().isString().trim().notEmpty().withMessage("Truck number must be a non-empty string"),
    require("express-validator").body("area").optional().isString().trim().notEmpty().withMessage("Area must be a non-empty string"),
    require("express-validator").body("paperWeight").optional().isFloat({ min: 0 }).withMessage("Paper weight must be a non-negative number"),
    require("express-validator").body("foodWeight").optional().isFloat({ min: 0 }).withMessage("Food weight must be a non-negative number"),
    require("express-validator").body("polytheneWeight").optional().isFloat({ min: 0 }).withMessage("Polythene weight must be a non-negative number"),
    require("express-validator").body("totalWaste").optional().isFloat({ min: 0 }).withMessage("Total waste must be a non-negative number"),
    require("express-validator").body("calculatedCharge").optional().isFloat({ min: 0 }).withMessage("Calculated charge must be a non-negative number"),
  ],
  (req, res, next) => {
    const errors = require("express-validator").validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, return error response
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateRecyclingWaste
);

// DELETE: Delete a recycling dataset by recycleID
// DELETE: Delete a recycling dataset by recycleID (admin only)
router.delete(
  "/deleteRecyclingWaste/:recycleID",
  authorizeRoles("admin"),
  deleteRecyclingWaste
);

module.exports = router;
