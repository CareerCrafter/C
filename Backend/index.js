import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dbConnect from "./db.connection.js";
import { userController } from "./user/user.controller.js";
import cors from "cors";
import { expenseController } from "./expense/expense.controller.js";
// backend app
const app = express();

// to make app understand json
app.use(express.json());
app.use(cors());
// database connection
dbConnect();

// register routes
app.use(userController);
app.use(expenseController);

//apis
app.get("/", (req, res) => {
  res.send("API is running");
});
// network port
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
