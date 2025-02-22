import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.GOOGLE_API_KEY);

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Get the Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function summarizeChanges(oldContent: string, newContent: string): Promise<string> {
    if (!oldContent || !newContent) return "No significant changes detected.";

    const prompt = `
    Compare the following two versions of a webpage and summarize the key changes in simple terms:
    
    Old Version:
    ${oldContent.slice(0, 1000)}...
    
    New Version:
    ${newContent.slice(0, 1000)}...
    
    Provide a concise summary of the changes:
  `;

    try {
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        return response.text().trim() || "No changes detected.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating summary.";
    }
}
