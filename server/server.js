const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./db/connection");
const authRoutes = require("./routes/auth");
// const { check } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const { check, validationResult } = require("express-validator");

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Built-in middleware to parse JSON
app.use(express.urlencoded({ extended: true })); // Built-in middleware to parse URL-encoded data

// CORS options
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// Enable CORS
app.use(cors());

// MongoDB Connection
connection();
// Routes
app.post("/api/auth/signup", 
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;
      console.log(req.body);
      // console.log("req.body");

      try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
          console.log("User already exists");
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
      } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).send("Server error");
        console.log(err);
      }
    }
);

app.post(
  '/api/auth/login',
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(req.body);

    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      };
      console.log(payload);

      // Sign the token
      jwt.sign(
        payload,
        process.env.JWT_SECRET, // Use environment variable
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.error("Token signing error:", err.message);
            return res.status(500).send("Server error");
          }
          res.json({ token });
          console.log(token);
        }
      );
    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).send("Server error");
    }
  }
);

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// }

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
