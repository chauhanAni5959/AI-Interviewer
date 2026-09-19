import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import pricingRouter from "./routes/pricing.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  req.user = { userId: req.headers["x-user-id"] };
  next();
});
app.get("/", (req, res) => res.send("Hello from the Pricing service"));
app.use("/", pricingRouter);

const PORT = process.env.PORT || 6005;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Pricing service is running on port ${PORT}`);
  });
}

export default app;
