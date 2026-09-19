import express from "express";
import { generateRoadmap, getLatestRoadmap } from "../controllers/roadmap.controller.js";

const roadmapRouter = express.Router();

roadmapRouter.post("/generate", generateRoadmap);
roadmapRouter.get("/latest", getLatestRoadmap);

export default roadmapRouter;
