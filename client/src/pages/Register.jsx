import { useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"

function Register() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      await api.post("/auth/register", form)

      alert("User registered successfully")

      navigate("/login")

    } catch (error) {

      alert(error.response?.data?.message || "Error")

    }
  }

  return (
    <div className="flex items-center justify-center h-screen">

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow rounded w-80"
      >

        <h2 className="text-2xl mb-4">Register</h2>

        <input
          name="name"
          placeholder="Name"
          className="border p-2 w-full mb-2"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={handleChange}
        />

        <button className="bg-blue-500 text-white p-2 w-full">
          Register
        </button>

      </form>

    </div>
  )
}

export default Register
