import express from "express";
import dotenv from "dotenv";
dotenv.config();
import proxy from "express-http-proxy";
const app = express();
const PORT = process.env.PORT || 6000;
app.get("/", (req, res) => {
  res.send("Hello from the Gateway server!");
});

// http://localhost/api/auth
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL));
app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});

export default app;
