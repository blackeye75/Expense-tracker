import { useState, useEffect } from "react"
import api from "../api/axios"

function Dashboard() {

  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: ""
  })

  // fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses")
      setExpenses(res.data.expenses || res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // create expense
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post("/expenses", form)

      setForm({
        amount: "",
        category: "",
        description: ""
      })

      fetchExpenses()

    } catch (error) {
      console.log(error)
    }
  }

  // delete expense
  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`)
      fetchExpenses()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Expense Dashboard
      </h1>

      {/* Add Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-4 rounded mb-6"
      >

        <h2 className="text-xl mb-3">Add Expense</h2>

        <input
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="border p-2 mr-2"
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 mr-2"
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 mr-2"
        />

        <button className="bg-blue-500 text-white px-4 py-2">
          Add
        </button>

      </form>

      {/* Expense List */}
      <div className="bg-white shadow p-4 rounded">

        <h2 className="text-xl mb-3">Expenses</h2>

        {expenses.map((exp) => (
          <div
            key={exp._id}
            className="flex justify-between border-b py-2"
          >
            <div>
              <p className="font-semibold">{exp.category}</p>
              <p className="text-sm text-gray-500">
                {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="font-bold">₹{exp.amount}</p>

              <button
                onClick={() => handleDelete(exp._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>

    </div>
  )
}

export default Dashboard