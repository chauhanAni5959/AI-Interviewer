import llm from "../config/llm.js";
import roadmapPrompt from "../prompts/roadmap.prompt.js";

const cleanJson = (content) => String(content || "")
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/i, "")
  .trim();

const normalizeRoadmap = (roadmap) => {
  if (!roadmap || typeof roadmap !== "object") {
    throw new Error("Roadmap must be a JSON object.");
  }

  if (!roadmap.title || !Array.isArray(roadmap.phases) || roadmap.phases.length === 0) {
    throw new Error("Roadmap title and phases are required.");
  }

  return {
    title: String(roadmap.title),
    overview: String(roadmap.overview || ""),
    duration: String(roadmap.duration || ""),
    focusAreas: Array.isArray(roadmap.focusAreas) ? roadmap.focusAreas.map(String) : [],
    interviewFocus: Array.isArray(roadmap.interviewFocus) ? roadmap.interviewFocus.map(String) : [],
    phases: roadmap.phases.map((phase, index) => ({
      title: String(phase.title || `Phase ${index + 1}`),
      duration: String(phase.duration || ""),
      outcome: String(phase.outcome || ""),
      skills: Array.isArray(phase.skills) ? phase.skills.map(String) : [],
      projects: Array.isArray(phase.projects) ? phase.projects.map(String) : [],
      resources: Array.isArray(phase.resources) ? phase.resources.map(String) : [],
      checkpoint: String(phase.checkpoint || ""),
    })),
  };
};

export const roadmapAgent = async (data) => {
  const response = await llm.invoke(roadmapPrompt(data));
  return normalizeRoadmap(JSON.parse(cleanJson(response.content)));
};
