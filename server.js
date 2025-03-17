import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import { User } from "./models/User.js";

const app = express();

dotenv.config();

// Connecting to MongoDB
connectDb();
console.log("Mongo URI:", process.env.MONGO_URL);

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// User Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Hashing the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    // Saving user to the database
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// User Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if user exists in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Email does not exist"
      });
    }

    // Comparing entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Incorrect password"
      });
    }

    // Generating JWT token for authentication
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    return res.status(200)
      .cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 })
      .json({
        success: true,
        message: "User logged in successfully",
      });

  } catch (err) {
    console.log(err);
  }
});

// Get User by ID Route
app.get("/user/:id", async (req, res) => {
  try {
    // Fetch user details except the password
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update User Details Route
app.put("/user/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Updating user info
    const user = await User.findByIdAndUpdate(req.params.id, { fullName: name, email }, { new: true });
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User updated successfully", user });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete User Route
app.delete("/user/:id", async (req, res) => {
  try {
    // Deleting user from DB
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out successfully" });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
