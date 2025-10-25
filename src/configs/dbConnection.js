
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Database Connected...!");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};

export { dbConnection };
