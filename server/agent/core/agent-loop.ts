import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import type { Appointment, ChatMessage } from "@/types/journey";
import { interpretationSchema, interpretJourney } from "./journey-agent";
import { dentalInterpretationSchema, interpretDental } from "./dental-agent";

/**
 * CareFlow Agent Loop Skeleton
 * Follows: OBSERVE -> UNDERSTAND INTENT -> LOAD CONTEXT -> CHECK SAFETY -> WORKFLOW -> TOOL -> RESPOND
 */
export async function runAgentLoop(
  appointment: Appointment,
  message: string,
  history: ChatMessage[],
  sourceMessageId = "synthetic-message",
  now = Date.now(),
) {
  const provider = async (prompt: string) => {
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
        maxOutputTokens: 3000,
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(appointment.intakeContext ? dentalInterpretationSchema : interpretationSchema),
        httpOptions: { timeout: 20000 },
      },
    });
    return JSON.parse(response.text || "{}");
  };
  return appointment.intakeContext
    ? interpretDental(appointment, message, history, provider, sourceMessageId, now)
    : interpretJourney(appointment, message, history, provider);
}
