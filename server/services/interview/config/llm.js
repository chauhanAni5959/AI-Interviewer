import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();

if (!apiKey) {
  throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is missing from environment variables.");
}

if (!/^AIza[0-9A-Za-z\-_]+$/.test(apiKey)) {
  console.warn(
    "GEMINI_API_KEY/GOOGLE_API_KEY does not look like a valid Google AI Studio key. " +
      "Expected a key starting with 'AIza...' but received '" + apiKey.slice(0, 12) + "...'."
  );
}

const llm = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  apiKey,
  temperature: 0.1,
  maxOutputTokens: 2500,
  maxRetries: 2,
});

export default llm;