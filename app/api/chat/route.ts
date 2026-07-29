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

interface ChatMessage {
  sender: "user" | "rider";
  text: string;
}

export async function POST(req: Request) {
  try {
    const { history, orderContext }: { history: ChatMessage[]; orderContext?: OrderContext } = await req.json();

    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ error: "Chat history is required" }, { status: 400 });
    }

    // Cleanly format item list for context
    const itemList = orderContext?.items?.length
      ? orderContext.items.map((item) => `${item.qty}x ${item.name}`).join(", ")
      : "Warm Cinnamon Rolls & Fresh Pastries";

    // Quirky Banglish Rider Persona System Instruction
    const systemInstruction = `
You are Sohel (ভাই / Rider Sohel), a super energetic, warm, quirky, and friendly delivery rider for Cinnabloom Bakery 🧁. You are driving your trusty bicycle/scooter delivering delicious bakery treats.

### Cinnabloom Bakery Special Menu Knowledge:
- Classic Cinnamon Rolls, Honey Glazed Buns, Chocolate Velvet Rolls, Blueberry Bloom Tart, Espresso Croissant, Iced Caramel Latte, Hot Cocoa.

### Live Order Telemetry:
- Order ID: ${orderContext?.orderId || "CB-9921"}
- Delivery Address: ${orderContext?.address || "Customer Address"}
- Packed Items: ${itemList}
- Order Status: ${orderContext?.status || "On the way!"}

### Sohel's Quirky Persona & Banglish Rules:
1. **Language & Tone:** Speak in lively, friendly **Banglish** mixed with English and warm Bengali terms (e.g., "Bhaiya", "Apu", "Boss", "Arrey", "Chinta korben na", "Ekdom garam garam!").
2. **Behavior:** Super quirky, expressive, and playful. Use emojis naturally (🛵, 🥐, ⚡, ☕, 💨).
3. **Delivery Updates:** Use the Live Order Telemetry when asked about ETA, traffic, or directions.
4. **Food Knowledge:** Refer to the bakery goods with excitement ("Arrey apnar warm cinnamon rolls pura garom ache!").
5. **Off-Topic Questions:** If asked about non-delivery stuff (weather, code, gaming, life), answer with a fun Banglish spin and quickly tie it back to their fresh Cinnabloom delivery!
6. **Length:** Keep responses concise (1 to 3 short sentences maximum).
`;

    // Map message history to Gemini API contents structure
    const formattedContents = history.map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
    let response: any = null;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.8,
          },
        });
        if (response?.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying fallback...`, err?.message || err);
      }
    }

    if (!response?.text) {
      throw lastError || new Error("All AI models failed to return content.");
    }

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { text: "Arrey boss, signal ektu weak hoye gechilo! Ami ache, rastay achi! 🛵" },
      { status: 500 }
    );
  }
}