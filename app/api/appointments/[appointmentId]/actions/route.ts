import { endpoint, parseBody, requirePatient } from "@/server/http";
import {
  mutateAppointment,
  readNotice,
} from "@/server/repositories/appointments";
import { idSchema, actionCommand } from "@/server/commands";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  context: { params: Promise<{ appointmentId: string }> },
) {
  return endpoint(async () => {
    const uid = await requirePatient(request),
      id = idSchema.parse((await context.params).appointmentId);
    const c = await parseBody(request, actionCommand);
    if (c.action.type === "READ_NOTICE")
      return readNotice(id, uid, c.action.noticeId);
    return mutateAppointment(id, uid, c.requestId, c.revision, c.action);
  });
}
