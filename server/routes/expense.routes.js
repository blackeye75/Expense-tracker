import express from "express"
import { protect } from "../middleware/auth.middleware.js"
import { createExpense, deleteExpense, getCategorySummary, getExpenses, getExpenseSummary, getMonthlySummary, updateExpense } from "../controllers/expense.controller.js"

const router = express.Router()

router.post("/", protect, createExpense)

router.get("/", protect, getExpenses)

router.put("/:id", protect, updateExpense)

router.delete("/:id", protect, deleteExpense)


router.get("/summary", protect, getExpenseSummary)

router.get("/category-summary", protect, getCategorySummary)

router.get("/monthly-summary", protect, getMonthlySummary)

export default router
