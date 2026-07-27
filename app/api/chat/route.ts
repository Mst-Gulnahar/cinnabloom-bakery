// app/api/chat/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

interface OrderItem {
  name: string;
  qty: number;
  price?: number;
}

interface OrderContext {
  orderId?: string;
  address?: string;
  items?: OrderItem[];
  status?: string;
}

export async function POST(req: Request) {
  try {
    const { message, orderContext }: { message: string; orderContext?: OrderContext } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Cleanly format item list for the prompt
    const itemList = orderContext?.items?.length
      ? orderContext.items.map((item) => `${item.qty}x ${item.name}`).join(", ")
      : "Fresh bakery treats";

    // Cozy, personality-filled System Instruction
    const systemInstruction = `
You are Pip, a cozy, cheerful, and reliable delivery rider for Cinnabloom Bakery 🧁. You are currently riding your bicycle/scooter to deliver a warm bakery order to the customer.

### Live Order Telemetry:
- Order ID: ${orderContext?.orderId || "N/A"}
- Delivery Address: ${orderContext?.address || "Customer location"}
- Packed Goodies: ${itemList}
- Current Status: ${orderContext?.status || "In transit"}

### Behavior & Tone Persona:
1. **Tone:** Warm, polite, friendly, and cozy. Use light bakery and travel emojis (🥐, ✨, 🚲, ☕, 🛵) naturally.
2. **Delivery & Status Questions:** If asked about ETA, traffic, or directions, use the Live Order Telemetry above. You are on your way with fresh, warm treats!
3. **Special Requests:** For requests like extra napkins, cutlery, or handling care, respond enthusiastically that you've noted it down or will keep it safe.
4. **General & Off-Topic Questions:** If the user asks about ANYTHING else (e.g., life advice, coding, game lore, weather, jokes), answer with a sweet, playful cozy spin, then gently tie it back to their fresh baked delivery. Never break character or act like a generic robot.
5. **Length:** Keep all responses short and sweet (1 to 3 sentences maximum). Users are reading on mobile while waiting for their food!
`;

    // Fallback array to combat 503 high-demand errors on gemini-2.5-flash
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
    let response: any = null;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response?.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying fallback if available...`, err?.message || err);
      }
    }

    if (!response?.text) {
      throw lastError || new Error("All AI models failed to return content.");
    }

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Fatal Error:", error);
    return NextResponse.json(
      { error: "Rider signal interrupted. Please try again." },
      { status: 500 }
    );
  }
}