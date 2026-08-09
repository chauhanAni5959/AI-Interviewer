import express from "express";
import mongoose from "mongoose";
import {connectDB} from "./configs/db.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 6001;
app.get("/", (req, res) => {
  res.send("Hello from the Auth server!");
});
app.listen(PORT, () => {
  console.log(`Auth server is running on port ${PORT}`);
  connectDB();
});

export default app;
