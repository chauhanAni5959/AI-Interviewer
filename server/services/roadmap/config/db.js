import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from the roadmap service environment.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
};
