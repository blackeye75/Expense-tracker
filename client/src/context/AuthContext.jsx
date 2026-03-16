import { createContext, useState, useEffect } from "react"
import api, { setupInterceptors } from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    setupInterceptors(accessToken, setAccessToken)
  }, [accessToken])

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}