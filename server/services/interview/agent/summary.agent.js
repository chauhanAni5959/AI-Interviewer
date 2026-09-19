import llm from "../config/llm.js";
import summaryPrompt from "../prompts/summaryPrompt.js";

const normalizeSummary = (report) => {
  if (!report || typeof report !== "object") {
    throw new Error("Summary must be a JSON object.");
  }

  const overallscore = Number(report.overallscore ?? report.overallScore);
  if (!Number.isFinite(overallscore) || overallscore < 0 || overallscore > 100) {
    throw new Error("Invalid summary score.");
  }

  if (typeof report.summary !== "string" || !report.summary.trim()) {
    throw new Error("Summary explanation is missing.");
  }

  return {
    ...report,
    overallscore: Math.round(overallscore),
    strengths: Array.isArray(report.strengths) ? report.strengths : [],
    weaknesses: Array.isArray(report.weaknesses) ? report.weaknesses : [],
    recommendations: Array.isArray(report.recommendations)
      ? report.recommendations
      : [],
  };
};

export const summaryAgent = async (data) => {
  try {
    const prompt = summaryPrompt(data);

    const response = await llm.invoke(prompt);
    const cleaned = response.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return normalizeSummary(JSON.parse(cleaned));
  } catch (error) {
    console.error("Summary Agent Parse Error!", error);
    throw new Error("Failed to generate summary!");
  }
};
