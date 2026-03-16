import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import testRoutes from "./routes/test.routes.js"
import expenseRoutes from "./routes/expense.routes.js"


const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)
app.use("/api/expenses", expenseRoutes)

app.get("/health", (req, res) => {
  res.status(200).json({ message: "API running" })
})

export default app
