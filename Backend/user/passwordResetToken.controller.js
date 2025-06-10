import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import PasswordResetToken from "./passwordResetToken.model.js";
import UserTable from "./user.model.js";

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
      console.log("Reset link to send in email:", resetLink);

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

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "Reset token is invalid or expired." });
    }

    const user = await UserTable.findOne({ email: resetRecord.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await PasswordResetToken.deleteMany({ email: resetRecord.email });

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
