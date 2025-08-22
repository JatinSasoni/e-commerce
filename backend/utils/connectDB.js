import mongoose from "mongoose";

export const connectToDB = async (MONGODB_URI) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting with database", error?.message);
  }
};
