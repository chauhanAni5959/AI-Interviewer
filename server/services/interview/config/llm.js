import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is missing from environment variables.");
}

const llm = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  apiKey,
  temperature: 0.1,
  maxOutputTokens: 2500,
  maxRetries: 2,
});

export default llm;