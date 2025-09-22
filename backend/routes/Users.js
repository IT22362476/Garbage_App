const bcrypt = require("bcryptjs");
const router = require("express").Router();
const {
  body,
  param,
  validationResult,
  normalizeEmail,
} = require("express-validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { authenticateJWT } = require("../middlewares/jwtAuth");
let User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// FIX: Added endpoint to provide CSRF token to frontend
router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// FIX: Added rate limiting to prevent brute-force attacks on login and registration
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many attempts from this IP, please try again later.",
});

// User login
router.post(
  "/login",
  authLimiter,
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password").isString().notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      console.log("Login attempt for normalized email:", email);

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Not Registered, re-register" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Auth cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // User cookie
      res.cookie("userId", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({
        message:
          user.role === "admin" ? "Admin Login successful" : "Login successful",
        userId: user.id,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error logging in" });
    }
  }
);

// Protected route to get current user profile
router.get("/profile", authenticateJWT, (req, res) => {
  try {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      address: req.user.address,
      contact: req.user.contact,
      role: req.user.role,
      avatar: req.user.avatar,
      isOAuthUser: req.user.isOAuthUser,
    });
  } catch (error) {
    console.error("Error in /profile route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// User registration with password hashing and input validation
// FIX: Added express-validator to validate and sanitize registration fields
router.post(
  "/register",
  authLimiter,
  [
    body("name").isString().trim().notEmpty().withMessage("Name is required"),
    body("address")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Address is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("contact")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Contact is required"),
    // Strong password: min 8 chars, upper, lower, number, special char
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
      .withMessage("Password must contain a special character"),
    body("role")
      .isIn(["admin", "collector", "resident", "recorder"])
      .withMessage("Invalid role"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, return error response
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, address, email, contact, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        address,
        email,
        contact,
        password: hashedPassword,
        role,
      });
      await newUser.save();
      return res.status(201).json("User Registered");
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error(err);
      res.status(500).json({ error: "Error registering user" });
    }
  }
);

// //get all users
// router.route("/getall").get((req, res) => {
//   User.find()
//     .then((users) => {
//       res.json(users);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

router.route("/").get((req, res) => {
  User.find()
    .then((users) => {
      // Categorize users by role
      const categorizedUsers = users.reduce((acc, user) => {
        const role = user.role || "Guest"; // Default to 'Guest' if no role
        if (!acc[role]) {
          acc[role] = [];
        }
        acc[role].push(user);
        return acc;
      }, {});

      res.json(categorizedUsers);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error fetching users" });
    });
});

// Get a single user by ID
router.route("/get/:id").get(
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value) && isNaN(Number(value))) {
      throw new Error("Invalid user ID");
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.params.id;
    try {
      // Try both ObjectId and integer id
      let user = null;
      if (mongoose.Types.ObjectId.isValid(userId)) {
        user = await User.findById(userId);
      } else if (!isNaN(Number(userId))) {
        user = await User.findOne({ id: Number(userId) });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ status: "User fetched", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching user" });
    }
  }
);

// Get user by userid

router.get(
  "/collector/:userid",
  param("userid").isInt().withMessage("User ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({ id: req.params.userid });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Error fetching user profile." });
    }
  }
);

// Update profile information
router.post(
  "/collector/updateProfile",
  [
    body("userId").isInt().withMessage("User ID must be an integer"),
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("contact").optional().isString().trim().escape(),
    body("name").optional().isString().trim().escape(),
    body("address").optional().isString().trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId, name, address, email, contact } = req.body;
    try {
      // Validate userId as integer
      if (isNaN(Number(userId))) {
        // FIX: Added userId validation to prevent NoSQL injection
        return res.status(400).json({ message: "Invalid userId format." });
      }
      const user = await User.findOne({ id: Number(userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      user.name = name || user.name;
      user.address = address || user.address;
      user.email = email || user.email;
      user.contact = contact || user.contact;
      await user.save();
      res.json({ message: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile." });
    }
  }
);

// Update password
router.post("/collector/updatePassword", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  // Validate userId as integer
  if (isNaN(Number(userId))) {
    // FIX: Added userId validation to prevent NoSQL injection
    return res.status(400).json({ message: "Invalid userId format." });
  }
  try {
    const user = await User.findOne({ id: Number(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password." });
  }
});

// Get all users, with optional filtering by role
router.get("/:role?", async (req, res) => {
  let role = req.params.role;

  const query = role ? { role: role } : {};

  try {
    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Get count of collectors
router.get("/collectors/count", async (req, res) => {
  try {
    const collectorCount = await User.countDocuments({ role: "collector" });
    res.json({ count: collectorCount });
  } catch (error) {
    console.error("Error fetching collector count:", error);
    res.status(500).json({ error: "Error fetching collector count" });
  }
});

router.route("/get/:id").get(async (req, res) => {
  let userId = req.params.id;
  // Validate userId as integer
  if (isNaN(Number(userId))) {
    // FIX: Added userId validation to prevent NoSQL injection
    return res.status(400).send({ status: "Invalid userId format" });
  }
  try {
    const user = await User.findOne({ id: Number(userId) });
    if (!user) {
      return res.status(404).send({ status: "User not found" });
    }
    res.status(200).send({ status: "User fetched", user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "Error fetching user", error: err.message });
  }
});
router.put("/updatePassword/:userID", async (req, res) => {
  const { userID } = req.params;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing old or new password" });
  }

  // Logic to handle password update here
  // Find user by userID, verify old password, update with new password
  try {
    // Assuming you have a function to handle the password update
    const user = await User.findOne({ id: userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the old password, then update with the new password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  // Clear cookies with the same options they were set with
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  res.clearCookie("userId", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  res.json({ message: "Logged out successfully" });
});

// Test route to debug JWT authentication
router.get("/test-auth", authenticateJWT, (req, res) => {
  console.log("Test auth route hit, req.user:", req.user);
  res.json({
    message: "Auth test successful",
    user: req.user,
    userId: req.user?.id,
    userRole: req.user?.role,
  });
});

module.exports = router;
