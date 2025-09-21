const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const dotenv = require("dotenv");
const session = require('express-session');
const passport = require('./config/passport');
const app = express();


// FIX: Add helmet middleware to emit standard security headers
// Helmet helps secure Express apps by setting various HTTP headers
const helmet = require('helmet');
app.use(helmet());

// FIX: Added CSRF protection middleware using csurf
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
app.use(cookieParser());
app.use(csurf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' } }));

dotenv.config(); // Load environment variables
const PORT = process.env.PORT || 8070;

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Middleware
// FIX: Configure CORS to allow credentials and restrict origin for CSRF protection
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));
app.use(bodyParser.json());

// CSRF error handler
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    // FIX: CSRF token errors are handled here
    res.status(403).json({ error: 'Invalid CSRF token' });
});

module.exports = app;


// Import MongoDB singleton connection
const db = require('./database');

// Ensure connection has been established
db.getConnection().once("open", () => {
    console.log("MongoDB connection is active.");
});

const userRouter = require("./routes/Users.js");
app.use("/user",userRouter);

// OAuth routes
const authRouter = require("./routes/auth.js");
app.use("/auth", authRouter);

const pickupRouter = require("./routes/SchedulePickups.js");
app.use("/schedulePickup",pickupRouter);

const collectedWastesRoutes = require('./routes/CollectedWastes.js');
app.use('/collectedwaste', collectedWastesRoutes);

const recycleRoutes = require('./routes/RecycleWastes.js');
app.use('/recycleWaste', recycleRoutes);

const garbageRouter = require("./routes/GarbageDetails.js");
app.use("/garbage",garbageRouter);

const totalgarbageRouter = require("./routes/Totalgarbages.js");
app.use("/totalgarbage",totalgarbageRouter);

const approvedRouter = require("./routes/Approvedpickup.js");
app.use("/approvedpickup",approvedRouter);

app.use('/api/vehicles', require('./routes/vehicleRoutes.js'));

// const vehicleRouter = require("./routes/Vehicles.js");
// app.use("/vehicle",vehicleRouter);
const pickupRoutes = require("./routes/pickupRoutesSingleton"); 
app.use("/pickup", pickupRoutes.getRouter());


if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 8070;
    app.listen(PORT, () => {
        console.log(`Server is up and running on port number: ${PORT}`);
    });
}

