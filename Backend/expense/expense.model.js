import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "utilities",
        "rent",
        "groceries",
        "entertainment",
        "transportation",
        "miscellaneous",
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
  },
  { timestamps: true }
);

const ExpenseTable = mongoose.model("Expense", expenseSchema);

export default ExpenseTable;
