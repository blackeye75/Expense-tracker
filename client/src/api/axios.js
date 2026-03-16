import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
})

export const setupInterceptors = (accessToken, setAccessToken) => {

  api.interceptors.request.use((config) => {

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  })

  api.interceptors.response.use(
    (response) => response,
    async (error) => {

      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {

        originalRequest._retry = true

        try {

          const res = await api.post("/auth/refresh")

          const newAccessToken = res.data.accessToken

          setAccessToken(newAccessToken)

          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`

          return api(originalRequest)

        } catch (refreshError) {

          window.location.href = "/login"

        }

      }

      return Promise.reject(error)
    }
  )
}

export default api