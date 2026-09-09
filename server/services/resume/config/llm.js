import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables.");
}

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.7-flash",
  apiKey: apiKey,
  temperature: 0.1,
  maxOutputTokens: 2500,
  maxRetries: 2,
});

export default llm;