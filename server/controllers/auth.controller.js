import { User } from "../models/user.model.js"
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js"
import { redisClient } from "../config/redis.js"

export const registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const user = await User.create({
      name,
      email,
      password
    })

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    })

  }

}

export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const accessToken = generateAccessToken(user._id)

    const refreshToken = generateRefreshToken(user._id)

    await redisClient.set(
      `refresh:${user._id}`,
      refreshToken,
      { EX: 7 * 24 * 60 * 60 }
    )
    

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    })

  }

}



export const refreshToken = async (req, res) => {

  try {

    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({
        message: "Refresh token missing"
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    )

    const userId = decoded.userId

    const storedToken = await redisClient.get(`refresh:${userId}`)

    if (!storedToken || storedToken !== token) {
      return res.status(403).json({
        message: "Invalid session"
      })
    }

    const newAccessToken = generateAccessToken(userId)

    res.json({
      accessToken: newAccessToken
    })

  } catch (error) {

    return res.status(403).json({
      message: "Invalid refresh token"
    })

  }

}
