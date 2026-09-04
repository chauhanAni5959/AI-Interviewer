import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();



const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6003;

app.get("/", (req, res) => {
  res.send("Hello from the Interview-service");
});


app.listen(PORT, () => {
  console.log(`Interview service is running on port ${PORT}`);
  connectDB();
});

export default app;
