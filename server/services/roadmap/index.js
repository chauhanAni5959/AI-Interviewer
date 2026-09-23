import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import roadmapRouter from "./routes/roadmap.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || process.env.ROADMAP_PORT || 6005;

app.get("/", (req, res) => {
  res.send("Hello from the Roadmap service");
});

app.use("/", roadmapRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Roadmap service is running on port ${PORT}`);
    connectDB();
  });
}

export default app;
