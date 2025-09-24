const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../models/testUser");
const bcrypt = require("bcryptjs");

describe("Auth API", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(8090, () => {
      console.log("Test server is running");
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  // afterEach(async () => {
  //   await User.deleteMany({});
  // });

  console.log("MongoDB connection state:", mongoose.connection.readyState);

  // Contact number will be encrypted by User model setter
  const mockUserData = {
    name: "Test name",
    address: "Test address",
    email: "test120@gmail.com",
    contact: "1234567890",
    password: "password123",
    role: "resident",
  };

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/user/register").send({
        name: "Test name",
        address: "Test address",
        email: "test120@gmail.com",
        contact: "1234567890",
        password: "password123",
        role: "resident",
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toBe("User Registered");
      const user = await User.findOne({ email: "test120@gmail.com" });
      expect(user).not.toBeNull();
    });

    it("should not register a user with an existing email", async () => {
      const user = new User({
  name: "Test name",
  address: "Test address",
  email: "test1200@gmail.com",
  // Contact number will be encrypted by User model setter
  contact: "1234567890",
  password: "password123",
  role: "resident",
      });
      await user.save();

      const res = await request(app).post("/user/register").send({
        name: "Test name",
        address: "Test address",
        email: "test1200@gmail.com",
        contact: "1234567890",
        password: "password123",
        role: "resident",
      });
      expect(res.statusCode).toEqual(400); // Expect 400 for duplicate
      expect(res.body.error).toBe("Email already exists");
    });
  });

  //   describe("POST /login", () => {
  //     beforeEach(async () => {
  //       const hashedPassword = await bcrypt.hash("password123", 10);
  //       const user = new User({
  //         ...mockUserData,
  //         email: "login@example.com",
  //         password: hashedPassword,
  //       });
  //       await user.save();
  //     });

  //     it("should login successfully with valid credentials", async () => {
  //       const res = await request(app).post("/user/login").send({
  //         email: "login@example.com",
  //         password: "password123",
  //       });
  //       expect(res.statusCode).toEqual(200);
  //       expect(res.body).toHaveProperty("message", "Login successful");
  //     });

  //     it("should fail to login with incorrect password", async () => {
  //       const res = await request(app).post("/user/login").send({
  //         email: "login@example.com",
  //         password: "wrongpassword",
  //       });
  //       expect(res.statusCode).toEqual(401);
  //       expect(res.body.error).toBe("Invalid credentials");
  //     });
  //   });
});
