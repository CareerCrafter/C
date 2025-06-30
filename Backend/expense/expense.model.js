import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Rent",
        "Groceries",
        "Entertainment",
        "Utilities",
        "Transportation",
        "Miscellaneous",
      ],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    receipt: {
      type: String, // URL or file path
      required: false,
    },
    rawText: {
      type: String,
    },
  },
  { timestamps: true }
);

const ExpenseTable = mongoose.model("Expense", expenseSchema);

export default ExpenseTable;
