import express from "express";
import {
  getRecentInterviews,
  getInterview,
  startInterview,
  submitAnswer,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/start", startInterview);

interviewRouter.post("/answer", submitAnswer);

interviewRouter.get("/", getRecentInterviews);

interviewRouter.post("/:id", getInterview);

export default interviewRouter;
