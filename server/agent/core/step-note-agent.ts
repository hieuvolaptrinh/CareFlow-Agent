import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import type { Appointment } from "@/types/journey";

export const stepNoteSchema = z
  .object({
    observation: z.string().trim().min(1).max(500),
    nextAction: z.string().trim().min(1).max(300),
  })
  .strict();

export type StepNoteContent = z.infer<typeof stepNoteSchema>;
type Provider = (prompt: string) => Promise<unknown>;

export async function createStepNote(
  appointment: Appointment,
  stepId: string,
  provider: Provider,
): Promise<StepNoteContent> {
  const definition = appointment.workflow?.steps.find((step) => step.id === stepId);
  const step = appointment.steps[stepId];
  if (!definition || !step) throw new Error("STEP_NOT_FOUND");
  const room = step.roomId ? appointment.rooms[step.roomId] : null;
  const prompt = JSON.stringify({
    task:
      "Viết nhận xét tiếp nhận nha khoa ngắn cho đúng bước hiện tại. Chỉ dựa trên lời khai và trạng thái được cung cấp; không chẩn đoán, không kê thuốc, không tạo kết quả khám, không khẳng định bác sĩ thật đã đánh giá. observation tối đa 2 câu, nêu điều đã ghi nhận liên quan đến bước. nextAction đúng 1 câu, chỉ hướng dẫn thao tác tiếp theo trong hành trình. Không dùng từ demo, mô phỏng hoặc dữ liệu giả. Không thêm trường JSON.",
    patientStatement: appointment.intakeContext?.summary || appointment.intake?.summary || "",
    safety: appointment.intakeContext?.safety ?? "UNCLEAR",
    journeyStatus: appointment.status,
    step: {
      id: definition.id,
      name: definition.name,
      kind: definition.kind,
      instruction: definition.instruction,
      status: step.status,
      ticket: step.ticket,
      resultPending: step.resultPending,
    },
    room: room
      ? {
          name: room.name,
          floor: room.floor,
          status: room.status,
          queueCount: room.queueCount,
        }
      : null,
  });
  return stepNoteSchema.parse(await provider(prompt));
}

export async function generateStepNote(
  appointment: Appointment,
  stepId: string,
): Promise<StepNoteContent> {
  return createStepNote(appointment, stepId, async (prompt) => {
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 400,
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(stepNoteSchema),
        httpOptions: { timeout: 20000 },
      },
    });
    return JSON.parse(response.text || "{}");
  });
}
