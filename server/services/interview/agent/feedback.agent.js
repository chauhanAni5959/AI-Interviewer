import llm from "../config/llm.js";
import feedbackPrompt from "../prompts/feedbackPrompt.js";

const scoreFields = [
  "score",
  "correctness",
  "clarity",
  "relevance",
  "detail",
  "efficiency",
  "communication",
  "problemSolving",
  "creativity",
];

const normalizeFeedback = (feedback) => {
  if (!feedback || typeof feedback !== "object") {
    throw new Error("Feedback must be a JSON object.");
  }

  const normalized = { ...feedback };
  for (const field of scoreFields) {
    const score = Number(normalized[field]);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      throw new Error(`Invalid feedback score: ${field}`);
    }
    normalized[field] = Math.round(score);
  }

  if (typeof normalized.feedback !== "string" || !normalized.feedback.trim()) {
    throw new Error("Feedback explanation is missing.");
  }

  return normalized;
};

export const feedbackAgent = async (data) => {
  try {
    const prompt = feedbackPrompt(data)
      

    const response = await llm.invoke(prompt)
    const cleaned = response.content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    return normalizeFeedback(JSON.parse(cleaned));
  } catch (error) {
    console.error("Feedback Agent Parse Error!", error);
    throw new Error("Failed to generate feedback!")
  }
};
