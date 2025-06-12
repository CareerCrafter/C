import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dbConnect from "./db.connection.js";
import { userController } from "./user/user.controller.js";
import cors from "cors";
import { expenseController } from "./expense/expense.controller.js";
import {
  sendResetEmail,
  resetPassword,
} from "./user/passwordResetToken.controller.js";

// backend app
const app = express();

// to make app understand json
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// database connection
dbConnect();

// register routes
app.use(userController);
app.use(expenseController);

//apis
app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/api/send-reset-email", sendResetEmail);
app.post("/api/reset-password", resetPassword);
// network port
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
