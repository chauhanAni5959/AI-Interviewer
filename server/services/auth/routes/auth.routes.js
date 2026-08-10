import express from "express";
import { GoogleAuth, logOut } from "../controller/auth.controller.js";

const authRouter = express.Router();

// Route for Login
authRouter.post("/login", GoogleAuth);

// Route for LogOut
authRouter.get("/logout", logOut);

export default authRouter;
