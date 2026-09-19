import llm from "../config/llm.js";
import hrInterviewPrompt from "../prompts/hrInterviewPrompt.js";
import technicalInterviewPrompt from "../prompts/technicalInterviewPrompt.js";

const interviewResponseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: { type: "string" },
      difficulty: {
        type: "string",
        enum: ["easy", "medium", "hard"],
      },
      timer: { type: "integer" },
    },
    required: ["question", "difficulty", "timer"],
    additionalProperties: false,
  },
};

const structuredInterviewLlm = llm.withStructuredOutput(
  interviewResponseSchema,
  { method: "jsonSchema" },
);

const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length !== 6) {
    throw new Error("The model must return exactly 6 interview questions.");
  }

  return questions.map((question, index) => {
    const text = typeof question?.question === "string"
      ? question.question.trim()
      : "";
    const difficulty = question?.difficulty;
    const timer = Number(question?.timer);

    if (
      !text ||
      !["easy", "medium", "hard"].includes(difficulty) ||
      !Number.isInteger(timer) ||
      timer < 60
    ) {
      throw new Error(`Invalid interview question at index ${index}.`);
    }

    return { question: text, difficulty, timer };
  });
};

export const interviewAgent = async (data) => {
  try {
    const isHrInterview = data?.type?.toLowerCase() === "hr";
    const prompt = isHrInterview
      ? hrInterviewPrompt(data)
      : technicalInterviewPrompt(data);

    const questions = await structuredInterviewLlm.invoke(prompt);
    return normalizeQuestions(questions);
  } catch (error) {
    console.error("Interview Agent Parse Error!", error);
    throw new Error("Failed to generate interview questions!");
  }
};
