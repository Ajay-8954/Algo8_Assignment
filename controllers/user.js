import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// ============================= SIGNUP =============================

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check if the email is already registered
    const UserExist = await User.findOne({ email: email });
    if (UserExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    // Save the user to the database
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ============================= LOGIN =============================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: "false", msg: "Incorrect Password" });
    }

    // Generate a JWT token for authentication
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Set the token in a cookie and send a response
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true, // Secure cookie that can't be accessed via JavaScript
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
      })
      .json({
        success: true,
        message: "User logged in successfully",
      });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ============================= GET USER DETAILS =============================

export const getUser = async (req, res) => {
  try {
    // Fetch user details from the database excluding the password field
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ============================= UPDATE USER =============================

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Extracting user ID from URL parameters
    const { name, password } = req.body;

    // Find the user in the database
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if provided (should be hashed before saving)
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hash the password before updating
    }

    // Save the updated user details
    await user.save();

    res.status(200).json({ msg: "User updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ============================= DELETE USER =============================

export const deleteUser = async (req, res) => {
  try {
    // Find user in the database
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Delete the user
    await user.deleteOne();

    // Clear the authentication token from cookies
    return res.cookie("token", "", { maxAge: 0 }).json({ msg: "User deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ============================= LOGOUT =============================

export const logout = async (req, res) => {
  try {
    // Clear the authentication token by setting an empty value with maxAge 0
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: 'Logged out successfully' });

  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
};
