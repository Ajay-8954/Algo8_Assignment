import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

// Connecting to MongoDB
connectDb();
console.log("Mongo URI:", process.env.MONGO_URL);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;



// Routes
app.use("/user", router); // Use user routes

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});



// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
