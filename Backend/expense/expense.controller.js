import express from "express";
import mongoose from "mongoose";
import Yup from "yup";
import isUser from "../middleware/authentication.middleware.js";
import ExpenseTable from "./expense.model.js";
import { validateMongoIdFromReqParams } from "../middleware/validate.mongo.id.js";

const router = express.Router();

// Add expense
router.post(
  "/expense/add",
  isUser,
  async (req, res, next) => {
    const expenseValidationSchema = Yup.object({
      category: Yup.string()
        .required()
        .trim()
        .oneOf([
          "utilities",
          "rent",
          "groceries",
          "entertainment",
          "transportation",
          "miscellaneous",
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
    const newExpense = req.body;

    await ExpenseTable.create(newExpense);

    return res.status(201).send({ message: "Expense added successfully." });
  }
);

// Delete expense by ID
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

export { router as expenseController };
