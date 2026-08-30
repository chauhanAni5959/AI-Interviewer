import fs from "fs/promises";
import fsSync from "fs";
import { resumeAgent } from "../agents/resume.agent.js";
import extractedText from "../config/pdf.js";
import Resume from "../models/resume.model.js";
import redis from "../../../shared/redis/redis.js";

// Helper function to safely parse JSON from AI response
const parseAIJSON = (text) => {
  if (!text) {
    console.error("AI Response is empty or undefined");
    return {};
  }
  if (typeof text === "object") return text;

  // Clean markdown code blocks if present
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  if (!cleaned) {
    console.error("AI Response became empty after cleaning:", text);
    return {};
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error("Failed to parse AI response:", cleaned.substring(0, 500));
    console.error("Parse error:", parseError.message);
    return {};
  }
};

export const uploadResume = async (req, res) => {
  const file = req.file; // Declare in function scope so catch block can access it

  try {
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    // 1. Extract text from uploaded PDF
    const resumeText = await extractedText(file.path);

    // 2. Call AI Agent
    const aiResponse = await resumeAgent(resumeText);
    const resumeData = parseAIJSON(aiResponse);

    // 3. Update or create Resume in MongoDB
    let resume = await Resume.findOne({ userId });

    if (resume) {
      Object.assign(resume, {
        ...resumeData,
        extractedName: resumeData.name || "",
        extractedText: resumeText,
      });
      await resume.save();
    } else {
      resume = await Resume.create({
        userId,
        extractedName: resumeData.name || "",
        extractedText: resumeText,
        ...resumeData,
      });
    }

    // 4. Update Redis Cache
    await redis.set(`resume:${userId}`, JSON.stringify(resume));

    // 5. Clean up temporary uploaded file
    if (file?.path && fsSync.existsSync(file.path)) {
      await fs.unlink(file.path);
    }

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Error in uploadResume:", error);

    // Safe file cleanup in catch block
    if (file?.path && fsSync.existsSync(file.path)) {
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        console.error("Failed to delete temp file:", unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process resume",
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    // Check Redis cache first
    const cache = await redis.get(`resume:${userId}`);

    if (cache) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cache),
      });
    }

    // Fallback to MongoDB
    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Store in cache
    await redis.set(`resume:${userId}`, JSON.stringify(resume));

    return res.status(200).json({
      success: true,
      source: "mongoDb",
      data: resume,
    });
  } catch (error) {
    console.error("Error in getResume:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch resume",
    });
  }
};
