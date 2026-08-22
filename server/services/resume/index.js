import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import resumeRouter from "./routes/resume.router.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6002;

app.get("/", (req, res) => {
  res.send("Hello from the Resume-service");
});

app.use("/", resumeRouter);

app.listen(PORT, () => {
  console.log(`Resume service is running on port ${PORT}`);
  connectDB();
});

export default app;
