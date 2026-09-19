import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import { getCurrentUser } from "./controllers/user.controller.js";
import { isAuth } from "./middleware/isAuth.js";
import { proxyWithHeader } from "./utils/proxyWithHeaders.js";

const gatewayDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.join(gatewayDirectory, ".env"),
  override: true,
});

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
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
const authProxyHandler = process.env.AUTH_SERVICE_URL
  ? proxy(process.env.AUTH_SERVICE_URL)
  : (req, res) => {
      res.status(503).json({ message: "Auth service not configured" });
    };

const resumeProxyHandler = process.env.RESUME_SERVICE_URL
  ? proxyWithHeader(process.env.RESUME_SERVICE_URL)
  : (req, res) => {
      res.status(503).json({ message: "Resume service not configured" });
    };

const interviewProxyHandler = process.env.INTERVIEW_SERVICE_URL
  ? proxyWithHeader(process.env.INTERVIEW_SERVICE_URL)
  : (req, res) => {
      res.status(503).json({ message: "Interview service not configured" });
    };

const pricingProxyHandler = process.env.PRICING_SERVICE_URL
  ? proxyWithHeader(process.env.PRICING_SERVICE_URL)
  : (req, res) => {
      res.status(503).json({ message: "Pricing service not configured" });
    };

const roadmapProxyHandler = process.env.ROADMAP_SERVICE_URL
  ? proxyWithHeader(process.env.ROADMAP_SERVICE_URL)
  : (req, res) => {
      res.status(503).json({ message: "Roadmap service not configured" });
    };

app.use("/api/auth", authProxyHandler);
app.use("/api/resume", isAuth, resumeProxyHandler);
app.use("/api/interview", isAuth, interviewProxyHandler);
app.use("/api/pricing", isAuth, pricingProxyHandler);
app.use("/api/roadmap", isAuth, roadmapProxyHandler);

// It is for current user and I have also added the middleware
app.get("/api/me", isAuth, getCurrentUser);

// Global body parser for non-proxied gateway routes
app.use(express.json());

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Gateway server is running on port ${PORT}`);
  });
}

export default app;
