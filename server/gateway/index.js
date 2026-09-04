import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import { getCurrentUser } from "./controllers/user.controller.js";
import { isAuth } from "./middleware/isAuth.js";
import { proxyWithHeader } from "./utils/proxyWithHeaders.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(cookieParser());

// Root health check endpoint
app.get("/", (req, res) => {
  res.send("Hello from the Gateway server!");
});

// Proxy routes (Place before express.json() if you want proxying to stream raw request bodies reliably)
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL));
app.use("/api/resume", isAuth, proxyWithHeader(process.env.RESUME_SERVICE_URL));
app.use("/api/interview", isAuth, proxyWithHeader(process.env.INTERVIEW_SERVICE_URL));
// It is for current user and I have also added the middleware
app.get("/api/me", isAuth, getCurrentUser);

// Global body parser for non-proxied gateway routes
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});

export default app;
