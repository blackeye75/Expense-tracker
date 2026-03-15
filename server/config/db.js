import mongoose from 'mongoose';

export const connectDB = async () => {
  // console.log(process.env.MONGO_URI)
  try {
    
    await mongoose.connect(process.env.MONGO_URI)

    console.log("MongoDB Connected")

  } catch (error) {

    console.error("MongoDB connection error:", error)
    process.exit(1)

  }
}