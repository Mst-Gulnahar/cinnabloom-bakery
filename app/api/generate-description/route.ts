// app/api/generate-description/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

interface GenerateDescriptionRequest {
  name: string;
  category?: string;
  flavor?: string;
  length?: "short" | "medium" | "detailed";
}

export async function POST(req: Request) {
  try {
    const { name, category, flavor, length = "medium" }: GenerateDescriptionRequest = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required to generate a description." },
        { status: 400 }
      );
    }

    // Custom Length Rules (Section 11.A Requirement)
    const lengthInstructions = {
      short: "1 concise, punchy, delicious sentence under 20 words.",
      medium: "2 cozy, inviting sentences describing flavor, warmth, and texture.",
      detailed: "3 rich, sensory sentences highlighting ingredients, warm bakery spices, and fresh aroma.",
    };

    // Custom Prompt Template (Section 11.A Requirement)
    const systemInstruction = `
You are a warm, literary pastry chef writing short menu descriptions for "Cinnabloom Bakery" 🥐✨.

Rules:
1. Item Name: "${name}"
2. Category: "${category || "Bakery treat"}"
3. Flavor Profile: "${flavor || "Delightful"}"
4. Target Length: ${lengthInstructions[length] || lengthInstructions.medium}
5. Tone: Warm, cozy, rustic, and appetizing. Do NOT use generic marketing clichés like "mouth-watering experience" or "delightful culinary journey". Keep it sensory, tactile, and poetic.
6. Output: Output ONLY the finished description text with no introductory text, surrounding quotes, or explanations.
`;

    // Same fallback strategy you used for Pip to handle demand spikes!
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
    let response: any = null;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: `Generate a product description for ${name}.`,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response?.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed for description generation, trying fallback...`, err?.message || err);
      }
    }

    if (!response?.text) {
      throw lastError || new Error("All AI models failed to return content.");
    }

    return NextResponse.json({ description: response.text.trim() });
  } catch (error) {
    console.error("Gemini API Description Generator Error:", error);
    return NextResponse.json(
      { error: "Failed to bake AI description. Please try again." },
      { status: 500 }
    );
  }
}