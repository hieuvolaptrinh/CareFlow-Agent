import { endpoint, requirePatient } from "@/server/http";
import { getAppointment } from "@/server/repositories/appointments";
import { idSchema } from "@/server/commands";
export const runtime = "nodejs";
export async function GET(
  request: Request,
  context: { params: Promise<{ appointmentId: string }> },
) {
  return endpoint(async () =>
    getAppointment(
      idSchema.parse((await context.params).appointmentId),
      await requirePatient(request),
    ),
  );
}
