import express from "express";
import { GoogleAuth, logOut, useCoins } from "../controller/auth.controller.js";

const authRouter = express.Router();

// Route for Login
authRouter.post("/login", GoogleAuth);

// Route for LogOut
authRouter.get("/logout", logOut);

authRouter.post("/use-coins", useCoins);

export default authRouter;
