import { Expense } from "../models/expense.model.js"

export const createExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body

    const expense = await Expense.create({
      userId: req.user.userId,
      amount,
      category,
      description,
      date
    })

    res.status(201).json({
      message: "Expense created",
      expense
    })

  } catch (error) {
    res.status(500).json({
      message: "Error creating expense",
      error: error.message
    })
  }
}


// export const getExpenses = async (req, res) => {
//   try {

//     const expenses = await Expense.find({
//       userId: req.user.userId
//     }).sort({ date: -1 })

//     res.json(expenses)

//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching expenses"
//     })
//   }
// }

export const getExpenses = async (req, res) => {
  try {

    const userId = req.user.userId

    const {
      page = 1,
      limit = 10,
      category,
      startDate,
      endDate
    } = req.query

    const query = { userId }

    if (category) {
      query.category = category
    }

    if (startDate || endDate) {
      query.date = {}

      if (startDate) {
        query.date.$gte = new Date(startDate)
      }

      if (endDate) {
        query.date.$lte = new Date(endDate)
      }
    }

    const skip = (page - 1) * limit

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Expense.countDocuments(query)

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      expenses
    })

  } catch (error) {

    res.status(500).json({
      message: "Error fetching expenses"
    })

  }
}



export const updateExpense = async (req, res) => {
  try {

    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      req.body,
      { new: true }
    )

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found"
      })
    }

    res.json({
      message: "Expense updated",
      expense
    })

  } catch (error) {

    res.status(500).json({
      message: "Error updating expense",
      error: error.message
    })

  }
}


export const deleteExpense = async (req, res) => {

  try {

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    })

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found"
      })
    }

    res.json({
      message: "Expense deleted"
    })

  } catch (error) {

    res.status(500).json({
      message: "Error deleting expense",
      error: error.message
    })

  }

}


export const getExpenseSummary = async (req, res) => {
  try {

    const userId = req.user.userId

    const summary = await Expense.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ])

    res.json(summary[0] || { totalSpent: 0, count: 0 })

  } catch (error) {
    res.status(500).json({
      message: "Error calculating summary"
    })
  }
}


export const getCategorySummary = async (req, res) => {

  try {

    const userId = req.user.userId

    const categories = await Expense.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { total: -1 }
      }
    ])

    res.json(categories)

  } catch (error) {

    res.status(500).json({
      message: "Error generating category summary"
    })

  }

}


export const getMonthlySummary = async (req, res) => {

  try {

    const userId = req.user.userId

    const monthly = await Expense.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      }
    ])

    res.json(monthly)

  } catch (error) {

    res.status(500).json({
      message: "Error generating monthly summary"
    })

  }

}
