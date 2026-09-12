import { endpoint, parseBody, requirePatient } from "@/server/http";
import { sendJourneyMessage } from "@/server/repositories/appointments";
import { idSchema, messageCommand } from "@/server/commands";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  context: { params: Promise<{ appointmentId: string }> },
) {
  return endpoint(async () => {
    const uid = await requirePatient(request),
      id = idSchema.parse((await context.params).appointmentId);
    const c = await parseBody(request, messageCommand);
    return sendJourneyMessage(id, uid, c.requestId, c.revision, c.message);
  });
}
