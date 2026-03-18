import { createContext, useState, useEffect } from "react"
import api, { setupInterceptors } from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // restore session on refresh
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post("/auth/refresh")
        setAccessToken(res.data.accessToken)
      } catch (error) {
        setAccessToken(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  useEffect(() => {
    setupInterceptors(accessToken, setAccessToken)
  }, [accessToken])

  if (loading) {
    return <div className="p-10">Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}