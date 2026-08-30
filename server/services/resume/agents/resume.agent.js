import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../config/llm.js";

export const resumeAgent = async (resumeText) => {
  try {
    if (!resumeText || resumeText.trim().length === 0) {
      console.error("Resume text is empty");
      return JSON.stringify({
        name: "",
        email: "",
        phone: "",
        summary: "",
        skills: [],
        projects: [],
        education: [],
        experience: [],
        strengths: [],
        weaknesses: [],
        missingSkills: [],
        suggestedRole: "",
        score: 0,
        recommendations: [],
      });
    }

    const response = await llm.invoke([
      new SystemMessage(`You are an Expert ATS Resume Analyzer. Analyze the resume and extract all information.

CRITICAL: Respond ONLY with valid JSON. No markdown, no code blocks, no extra text.

Format your response as this exact JSON structure:
{
  "name": "extracted name",
  "email": "extracted email",
  "phone": "extracted phone",
  "summary": "professional summary",
  "skills": ["skill1", "skill2"],
  "projects": [{"title": "name", "description": "desc", "technologies": ["tech1"]}],
  "education": [{"institution": "name", "degree": "degree", "location": "city", "period": "dates"}],
  "experience": [{"company": "name", "position": "title", "period": "dates", "description": "desc"}],
  "strengths": ["strength1"],
  "weaknesses": ["weakness1"],
  "missingSkills": ["skill1"],
  "suggestedRole": "best role",
  "score": 75,
  "recommendations": ["rec1"]
}`),
      new HumanMessage(resumeText),
    ]);

    const content = response.content;
    console.log("AI Response received, length:", content?.length);
    return content;
  } catch (error) {
    console.error("Error in resumeAgent:", error.message);
    throw error;
  }
};
