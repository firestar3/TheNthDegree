
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMathProblem = async (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  try {
    const response = await ai.models.generateContent({
      // Fix: Use a more powerful model for generating math problems, as per guidelines for complex tasks.
      model: "gemini-3-pro-preview",
      contents: `Generate a ${difficulty} level high school math contest problem. The problem should have a single numerical or simple algebraic expression as the answer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problem: {
              type: Type.STRING,
              description: 'The full problem text in Markdown format, including any equations.'
            },
            answer: {
              type: Type.STRING,
              description: 'The exact, simplified answer as a string, without any extra explanation.'
            }
          },
          required: ["problem", "answer"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation
    if (result && typeof result.problem === 'string' && typeof result.answer === 'string') {
        return result as { problem: string; answer: string };
    } else {
        throw new Error("Invalid format received from Gemini API");
    }

  } catch (error) {
    console.error("Error generating math problem:", error);
    throw new Error("Failed to generate a math problem. Please check your API key and try again.");
  }
};
