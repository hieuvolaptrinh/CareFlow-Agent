import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import type { Appointment, ChatMessage } from "@/types/journey";
import { interpretationSchema, interpretJourney } from "./journey-agent";

/**
 * CareFlow Agent Loop Skeleton
 * Follows: OBSERVE -> UNDERSTAND INTENT -> LOAD CONTEXT -> CHECK SAFETY -> WORKFLOW -> TOOL -> RESPOND
 */
export async function runAgentLoop(
  appointment: Appointment,
  message: string,
  history: ChatMessage[],
) {
  return interpretJourney(appointment, message, history, async (prompt) => {
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        temperature: 0.1,
        maxOutputTokens: 1400,
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(interpretationSchema),
        httpOptions: { timeout: 20000 },
      },
    });
    return JSON.parse(response.text || "{}");
  });
}
