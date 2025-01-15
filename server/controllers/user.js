import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "This email ID is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Username or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Username or password",
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome back ${user.fullName}`,
      });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
