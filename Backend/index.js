import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import dbConnect from "./db.connection.js";
import { userController } from "./user/user.controller.js";
import { expenseController } from "./expense/expense.controller.js";
import {
  sendResetEmail,
  resetPassword,
} from "./user/passwordResetToken.controller.js";

// backend app
const app = express();

// JSON parser
app.use(express.json());

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// DB connection
dbConnect();

// API routes
app.use(userController); // /register, /login, etc.
app.use(expenseController); // /expense/add, /expense/analysis, etc.

// Password reset
app.post("/api/send-reset-email", sendResetEmail);
app.post("/api/reset-password", resetPassword);

// Base route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
