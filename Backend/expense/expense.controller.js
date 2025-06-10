import express from "express";
import Yup from "yup";
import isUser from "../middleware/authentication.middleware.js";
import ExpenseTable from "./expense.model.js";
import { validateMongoIdFromReqParams } from "../middleware/validate.mongo.id.js";
import upload from "../middleware/upload.middleware.js";
import Tesseract from "tesseract.js";
import fs from "fs";

const router = express.Router();

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
        user: req.user._id, // ✅ attach user ID from authentication middleware
      };

      console.log("Attempting to create new expense with data:", newExpense);

      const createdExpense = await ExpenseTable.create(newExpense); // This line is the suspect
      return res.status(201).send({
        message: "Expense added successfully.",
        expense: createdExpense,
      });

      // TEMP LOG: Console log success
      // Send back the created expense
    } catch (err) {
      // ✅ CRITICAL: LOG THE ACTUAL ERROR HERE
      console.error(
        "Backend Error: Failed to add expense to DB. Details:",
        err
      );
      // You can even send a more specific error in dev mode, but for now just log it
      return res.status(500).send({ message: "Failed to add expense." });
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
      fs.unlinkSync(imagePath); // delete the file after extraction

      const amountMatch = extractedText.match(
        /(?:total|amount)[^\d]*([\d.,]+)/i
      );
      const dateMatch = extractedText.match(/\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/);

      const dummyParsed = {
        category: "Rent",
        amount: amountMatch ? parseFloat(amountMatch[1].replace(",", "")) : 0,
        date: dateMatch ? new Date(dateMatch[0]) : new Date(),
        rawText: extractedText,
      };

      const newExpense = await ExpenseTable.create({
        ...dummyParsed,
        user: req.user._id, // ✅ associate expense with user
      });

      return res.status(201).send({
        message: "Bill uploaded and expense saved.",
        expense: newExpense,
      });
    } catch (err) {
      console.error("Error processing bill:", err);
      return res.status(500).send({ message: "Failed to process bill image." });
    }
  }
);

export { router as expenseController };
