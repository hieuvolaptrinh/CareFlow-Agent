import { z } from "zod";
import raw from "@/config/workflows/patient-demo.json";

const stepSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  kind: z.enum([
    "CHECKIN",
    "ROOM",
    "DOCTOR",
    "ORDER",
    "BILLING",
    "PHARMACY",
    "FINISH",
  ]),
  prerequisites: z.array(z.string()),
  roomIds: z.array(z.string()),
  required: z.boolean(),
  reorderGroup: z.string().nullable(),
  condition: z.string().nullable(),
  instruction: z.string(),
});
export const catalogSchema = z
  .object({
    version: z.number().int().positive(),
    policy: z.object({
      minSavingMinutes: z.number().positive(),
      rejectionCooldownMs: z.number().positive(),
      freshnessMs: z.number().positive(),
      redFlags: z.array(z.string().min(1)),
      handoffMessage: z.string(),
    }),
    resources: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        floor: z.string(),
        serviceId: z.string(),
        doctorName: z.string().nullable(),
        doctorSpecialty: z.string().nullable(),
        serviceMinutes: z.number().positive(),
        travelMinutes: z.number().nonnegative(),
      }),
    ),
    workflows: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        kind: z.enum(["NEW", "FOLLOW_UP", "CHECKUP"]),
        version: z.number().int().positive(),
        demo: z.literal(true),
        questions: z.array(z.string()),
        selection: z.string(),
        steps: z.array(stepSchema).min(1).max(12),
      }),
    ),
  })
  .superRefine((value, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    if (
      new Set(value.resources.map((r) => r.id)).size !== value.resources.length
    )
      fail("Duplicate room ID");
    if (
      new Set(value.workflows.map((w) => w.id)).size !== value.workflows.length
    )
      fail("Duplicate workflow ID");
    for (const workflow of value.workflows) {
      const ids = new Set(workflow.steps.map((s) => s.id));
      if (ids.size !== workflow.steps.length) fail("Duplicate step ID");
      const done = new Set<string>();
      for (const step of workflow.steps) {
        if (step.prerequisites.some((id) => !ids.has(id)))
          fail("Unknown prerequisite");
        if (
          step.roomIds.some((id) => !value.resources.some((r) => r.id === id))
        )
          fail("Unknown room");
        const services = new Set(
          step.roomIds.map(
            (id) => value.resources.find((r) => r.id === id)?.serviceId,
          ),
        );
        if (services.size > 1)
          fail("Alternative rooms must offer the same service");
        // Default sequence must itself be a valid topological ordering.
        if (step.prerequisites.some((id) => !done.has(id)))
          fail("Cycle or invalid default order");
        done.add(step.id);
      }
    }
  });
export const catalog = catalogSchema.parse(raw);
