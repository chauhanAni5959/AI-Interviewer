import Roadmap from "../models/roadmap.model.js";
import { roadmapAgent } from "../agents/roadmap.agent.js";

const getUserId = (req) => req.headers["x-user-id"];

export const generateRoadmap = async (req, res) => {
  try {
    const userId = getUserId(req);
    const {
      targetRole,
      experienceLevel,
      goal,
      hoursPerWeek,
      currentSkills = "",
      interviewSignals = "",
    } = req.body || {};

    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required in headers." });
    }

    if (!targetRole || !experienceLevel || !goal || !hoursPerWeek) {
      return res.status(400).json({
        success: false,
        message: "Target role, experience level, goal, and weekly hours are required.",
      });
    }

    const roadmap = await roadmapAgent({
      targetRole: String(targetRole).trim(),
      experienceLevel: String(experienceLevel).trim(),
      goal: String(goal).trim(),
      hoursPerWeek: Number(hoursPerWeek),
      currentSkills: String(currentSkills).trim(),
      interviewSignals: String(interviewSignals).trim(),
    });

    const savedRoadmap = await Roadmap.create({
      userId,
      targetRole,
      experienceLevel,
      goal,
      hoursPerWeek: Number(hoursPerWeek),
      roadmap,
    });

    return res.status(201).json({ success: true, roadmap: savedRoadmap });
  } catch (error) {
    console.error("generateRoadmap error:", error);
    return res.status(500).json({ success: false, message: error.message || "Unable to generate roadmap." });
  }
};

export const getLatestRoadmap = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required in headers." });
    }

    const roadmap = await Roadmap.findOne({ userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, roadmap: roadmap || null });
  } catch (error) {
    console.error("getLatestRoadmap error:", error);
    return res.status(500).json({ success: false, message: error.message || "Unable to load roadmap." });
  }
};
