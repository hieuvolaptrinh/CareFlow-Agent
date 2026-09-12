import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "model") &&
    typeof message.text === "string" &&
    message.text.trim().length > 0
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages) || !body.messages.every(isChatMessage)) {
      return NextResponse.json(
        { error: "Danh sách tin nhắn không hợp lệ." },
        { status: 400 },
      );
    }

    const messages = body.messages.slice(-20);
    if (messages.length === 0 || messages.at(-1)?.role !== "user") {
      return NextResponse.json(
        { error: "Tin nhắn cuối cùng phải là của người dùng." },
        { status: 400 },
      );
    }

    const project = process.env.GCP_PROJECT_ID;
    const location = process.env.GCP_LOCATION || "us-central1";
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!project) {
      return NextResponse.json(
        { error: "Server chưa cấu hình GCP_PROJECT_ID." },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({
      vertexai: true,
      project,
      location,
    });

    const response = await ai.models.generateContent({
      model,
      contents: messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
      config: {
        systemInstruction:
          "Bạn là trợ lý CareFlow thân thiện và hữu ích. Hãy trả lời rõ ràng bằng ngôn ngữ mà người dùng sử dụng.",
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "Gemini không trả về nội dung." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    const safeMessage =
      process.env.NODE_ENV === "development"
        ? `Không gọi được Gemini: ${message}`
        : "Không gọi được Gemini. Vui lòng thử lại sau.";

    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}
