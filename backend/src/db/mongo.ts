import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/library_management');
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log(error)
  }
}