import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const apiKey = (process.env.GEMINI_API_KEY || "").trim();

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables.");
}

// Google Gemini API keys typically begin with "AIza"
if (!apiKey.startsWith("AIza")) {
  console.warn(
    "GEMINI_API_KEY does not appear to follow standard Google API key formatting. " +
      "Expected a key starting with 'AIza', but received '" +
      apiKey.slice(0, 6) +
      "...'."
  );
}

const llm = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  apiKey,
  temperature: 0.1,
  maxOutputTokens: 2500, // Google uses maxOutputTokens
  maxRetries: 2,
});

export default llm;