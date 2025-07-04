import express from "express";
import Yup from "yup";
import isUser from "../middleware/authentication.middleware.js";
import ExpenseTable from "./expense.model.js";
import { validateMongoIdFromReqParams } from "../middleware/validate.mongo.id.js";
import upload from "../middleware/upload.middleware.js";
import Tesseract from "tesseract.js";
import fs from "fs";
import axios from "axios";

const router = express.Router();

// Flask API URL
const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5000";

// Helper function to check anomaly with Flask server
const checkForAnomaly = async (expenseData, token) => {
  try {
    const response = await axios.post(
      `${FLASK_API_URL}/anomaly`,
      {
        Amount: parseFloat(expenseData.amount),
        Category: expenseData.category,
        Date: expenseData.date.toISOString().split("T")[0],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Anomaly check response:", response.data);
    return {
      isAnomaly: response.data.is_anomaly === true,
      score: response.data.score || 0,
    };
  } catch (error) {
    console.error(
      "Error checking anomaly:",
      error.response?.data || error.message
    );
    return { isAnomaly: false, score: 0 };
  }
};

// ✅ Add expense manually
router.post(
  "/expense/add",
  isUser,
  async (req, res, next) => {
    const expenseValidationSchema = Yup.object({
      category: Yup.string()
        .required()
        .trim()
        .oneOf([
          "Rent",
          "Groceries",
          "Entertainment",
          "Utilities",
          "Transportation",
          "Miscellaneous",
        ]),
      amount: Yup.number().required().min(0),
      date: Yup.date().required(),
      notes: Yup.string().optional().trim(),
    });

    try {
      req.body = await expenseValidationSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    try {
      const newExpense = {
        ...req.body,
        user: req.user._id,
      };

      // Check for anomaly
      const token = req.headers.authorization?.split(" ")[1];
      const { isAnomaly, score } = await checkForAnomaly(newExpense, token);

      newExpense.status = isAnomaly ? "Anomaly" : "Normal";
      newExpense.anomaly_score = score;

      console.log("Attempting to create new expense with data:", newExpense);

      const createdExpense = await ExpenseTable.create(newExpense);

      return res.status(201).send({
        message: "Expense added successfully.",
        expense: createdExpense,
      });
    } catch (err) {
      console.error(
        "Backend Error: Failed to add expense to DB. Details:",
        err
      );
      return res.status(500).send({ message: "Failed to add expense." });
    }
  }
);

// ✅ Update expense by ID
router.put(
  "/expense/update/:id",
  isUser,
  validateMongoIdFromReqParams,
  async (req, res, next) => {
    const expenseValidationSchema = Yup.object({
      category: Yup.string()
        .required()
        .trim()
        .oneOf([
          "Rent",
          "Groceries",
          "Entertainment",
          "Utilities",
          "Transportation",
          "Miscellaneous",
        ]),
      amount: Yup.number().required().min(0),
      date: Yup.date().required(),
      notes: Yup.string().optional().trim(),
    });

    try {
      req.body = await expenseValidationSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    try {
      const expenseId = req.params.id;
      const expenseData = {
        ...req.body,
        user: req.user._id,
      };

      // Check for anomaly
      const token = req.headers.authorization?.split(" ")[1];
      const { isAnomaly, score } = await checkForAnomaly(expenseData, token);

      expenseData.status = isAnomaly ? "Anomaly" : "Normal";
      expenseData.anomaly_score = score;

      console.log("Attempting to update expense with data:", expenseData);

      const updatedExpense = await ExpenseTable.findOneAndUpdate(
        { _id: expenseId, user: req.user._id },
        { $set: expenseData },
        { new: true }
      );

      if (!updatedExpense) {
        return res.status(404).send({ message: "Expense not found." });
      }

      return res.status(200).send({
        message: "Expense updated successfully.",
        expense: updatedExpense,
      });
    } catch (err) {
      console.error("Backend Error: Failed to update expense. Details:", err);
      return res.status(500).send({ message: "Failed to update expense." });
    }
  }
);

// ✅ Delete expense by ID
router.delete(
  "/expense/delete/:id",
  isUser,
  validateMongoIdFromReqParams,
  async (req, res) => {
    const expenseId = req.params.id;

    const deleted = await ExpenseTable.findByIdAndDelete(expenseId);

    if (!deleted) {
      return res.status(404).send({ message: "Expense not found." });
    }

    return res.status(200).send({ message: "Expense deleted successfully." });
  }
);

// ✅ Get all expenses for the logged-in user
router.get("/expense/list", isUser, async (req, res) => {
  try {
    const expenses = await ExpenseTable.find({ user: req.user._id });
    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).send({ message: "Failed to fetch expenses." });
  }
});

// ✅ Upload bill and extract text using OCR
router.post(
  "/expense/upload-bill",
  isUser,
  upload.single("billImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: "No file uploaded." });
      }

      const imagePath = req.file.path;

      const result = await Tesseract.recognize(imagePath, "eng", {
        logger: (m) => console.log(m),
      });

      const extractedText = result.data.text;
      fs.unlinkSync(imagePath); // delete file after processing

      const amountMatch = extractedText.match(
        /(?:total|amount)[^\d]*([\d.,]+)/i
      );
      const dateMatch = extractedText.match(/\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/);

      const newExpense = {
        category: "Rent", // Default category
        amount: amountMatch ? parseFloat(amountMatch[1].replace(",", "")) : 0,
        date: dateMatch ? new Date(dateMatch[0]) : new Date(),
        rawText: extractedText,
        user: req.user._id,
      };

      // Check for anomaly
      const token = req.headers.authorization?.split(" ")[1];
      const { isAnomaly, score } = await checkForAnomaly(newExpense, token);

      newExpense.status = isAnomaly ? "Anomaly" : "Normal";
      newExpense.anomaly_score = score;

      const createdExpense = await ExpenseTable.create(newExpense);

      return res.status(201).send({
        message: "Bill uploaded and expense saved.",
        expense: createdExpense,
      });
    } catch (err) {
      console.error("Error processing bill:", err);
      return res.status(500).send({ message: "Failed to process bill image." });
    }
  }
);

// ✅ Analysis endpoint
router.get("/expense/analysis", isUser, async (req, res) => {
  try {
    const expenses = await ExpenseTable.find({ user: req.user._id });

    const categoryTotals = {};
    const monthlyTotals = {};

    for (const exp of expenses) {
      // Category-wise total
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + exp.amount;

      // Monthly-wise total
      const monthKey = `${exp.date.getFullYear()}-${String(
        exp.date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + exp.amount;
    }

    return res.status(200).json({
      count: expenses.length,
      categoryTotals,
      monthlyTotals,
    });
  } catch (err) {
    console.error("Error fetching analysis:", err);
    return res.status(500).send({ message: "Failed to fetch analysis." });
  }
});

export { router as expenseController };
