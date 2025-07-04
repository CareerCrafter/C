import express from "express";
import UserTable from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Yup from "yup";
import nodemailer from "nodemailer";

import cors from "cors";
import crypto from "crypto";
import PasswordResetToken from "./passwordResetToken.model.js";
import isUser from "../middleware/authentication.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserTable.findOne({ email });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      await PasswordResetToken.deleteMany({ email });
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await PasswordResetToken.create({ email, token, expiresAt });

      const resetLink = `http://localhost:5173/reset-password?token=${token}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      });
    }

    // Respond success regardless to avoid email enumeration
    return res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const resetRecord = await PasswordResetToken.findOne({ token });

    if (!resetRecord) {
      return res.status(400).json({ message: "Reset token not found." });
    }

    if (resetRecord.expiresAt < new Date()) {
      // Token expired, delete it to keep DB clean
      await PasswordResetToken.deleteOne({ token });
      return res.status(400).json({ message: "Reset token has expired." });
    }

    const user = await UserTable.findOne({ email: resetRecord.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove all reset tokens for this user (including current)
    await PasswordResetToken.deleteMany({ email: resetRecord.email });

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Register route with validation and password hashing
router.post(
  "/user/register",
  async (req, res, next) => {
    const userValidationSchema = Yup.object({
      fullName: Yup.string().required().trim().max(255),
      email: Yup.string().email().required().trim().max(100).lowercase(),
      address: Yup.string().notRequired().max(255).trim(),
      password: Yup.string().required().trim().min(8).max(30),
      gender: Yup.string()
        .required()
        .trim()
        .oneOf(["male", "female", "other", "preferNotToSay"]),
      phoneNumber: Yup.string().required().trim().min(10).max(20),
    });

    try {
      req.body = await userValidationSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    const newUser = req.body;

    const user = await UserTable.findOne({ email: newUser.email });

    if (user) {
      return res.status(409).send({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;

    await UserTable.create(newUser);

    return res
      .status(201)
      .send({ message: "User is registered successfully." });
  }
);

// Login route with bcrypt password compare
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserTable.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials." });
    }

    user.password = undefined; // remove password before sending user info

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res
        .status(500)
        .send({ message: "JWT secret key not configured." });
    }
    const payload = {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });
    return res
      .status(200)
      .send({ message: "success", userDetails: user, accessToken: token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ message: "Internal server error." });
  }
});

router.post("/api/reset-password", sendResetEmail);
router.post("/api/reset-password/confirm", resetPassword);

router.get("/user/me", isUser, async (req, res) => {
  try {
    const { fullName, email } = req.user;
    res.status(200).json({ fullName, email });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});

export { router as userController };
