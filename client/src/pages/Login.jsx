import { useState, useContext } from "react"
import api from "../api/axios"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Login() {

  const { setAccessToken } = useContext(AuthContext)

  const navigate = useNavigate()

  const [form, setForm] = useState({
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

      const res = await api.post("/auth/login", form)

      setAccessToken(res.data.accessToken)

      navigate("/")

    } catch (error) {

      alert("Invalid credentials")

    }
  }

  return (
    <div className="flex items-center justify-center h-screen">

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow rounded w-80"
      >

        <h2 className="text-2xl mb-4">Login</h2>

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

        <button className="bg-green-500 text-white p-2 w-full">
          Login
        </button>

      </form>

    </div>
  )
}

export default Login
