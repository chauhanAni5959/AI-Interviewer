import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config({ override: true });

const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();

if (!apiKey) {
  throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is missing from the roadmap service environment.");
}

const llm = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
  apiKey,
  temperature: 0.2,
  maxOutputTokens: 3500,
  maxRetries: 2,
});

export default llm;
