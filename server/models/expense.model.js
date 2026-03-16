import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
)

// optimize queries for user + date
expenseSchema.index({ userId: 1, date: -1 })

export const Expense = mongoose.model("Expense", expenseSchema)
