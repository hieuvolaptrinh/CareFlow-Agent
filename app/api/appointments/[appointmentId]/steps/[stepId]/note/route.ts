import { z } from "zod";
import { endpoint, requirePatient } from "@/server/http";
import { getOrCreateStepNote } from "@/server/repositories/appointments";
import { idSchema } from "@/server/commands";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ appointmentId: string; stepId: string }> },
) {
  return endpoint(async () => {
    const uid = await requirePatient(request);
    const params = await context.params;
    return getOrCreateStepNote(
      idSchema.parse(params.appointmentId),
      uid,
      z.string().min(1).max(80).regex(/^[a-zA-Z0-9_-]+$/).parse(params.stepId),
    );
  });
}
