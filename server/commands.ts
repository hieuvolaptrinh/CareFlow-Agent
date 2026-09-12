import { z } from "zod";
import { actionSchema, simulationSchema } from "@/server/workflow/engine";
export const idSchema = z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/);
export const envelope = z.object({
  requestId: z.string().uuid(),
  revision: z.number().int().nonnegative(),
});
export const messageCommand = envelope.extend({
  message: z.string().trim().min(1).max(4000),
});
export const actionCommand = envelope.extend({
  action: z.union([
    actionSchema,
    z.object({ type: z.literal("READ_NOTICE"), noticeId: idSchema }),
  ]),
});
export const simulationCommand = envelope.extend({ action: simulationSchema });
