import { z } from "zod";
import { endpoint, parseBody, requirePatient } from "@/server/http";
import { newAppointment } from "@/server/repositories/appointments";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return endpoint(async () => {
    const uid = await requirePatient(request);
    const { requestId } = await parseBody(
      request,
      z.object({ requestId: z.string().uuid() }),
    );
    return newAppointment(uid, requestId);
  }, 201);
}
