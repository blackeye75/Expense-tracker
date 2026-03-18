import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

function Navbar() {

  const { setAccessToken } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (error) {}

    setAccessToken(null)
    navigate("/login")
  }

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between">

      <h1 className="font-bold text-lg">
        Expense Tracker
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded"
      >
        Logout
      </button>

    </div>
  )
}

export default Navbar