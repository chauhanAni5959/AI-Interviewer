import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./configs/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 6001;

app.get("/", (req, res) => {
  res.send("Hello from the Auth server!");
});

app.use("/", authRouter);
app.listen(PORT, () => {
  console.log(`Auth server is running on port ${PORT}`);
  connectDB();
});

export default app;
