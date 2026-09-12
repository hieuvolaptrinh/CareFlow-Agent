import { describe, it, expect, vi } from "vitest";
import { createAppointment, applyAction, buildJourney } from "@/server/workflow/engine";
import { simulate, startSimulation } from "@/server/workflow/simulator";
import { interpretDental } from "@/server/agent/core/dental-agent";
import { emptyIntakeContext, dentalFields, contextMissing } from "@/lib/intake-context";
import { catalog } from "@/server/workflow/catalog";
import { checkSafetyGuardrails } from "@/server/agent/policies/safety-guardrails";

export function dentalCase() {
  const a = createAppointment("synthetic-dental", "alice", 100000);
  a.intakeContext = emptyIntakeContext();
  return a;
}
export function completedContext(a = dentalCase(), workflowId = "dental-pain") {
  const ctx = a.intakeContext!;
  ctx.workflowId = workflowId; ctx.version = 1; ctx.safety = "CLEAR";
  for (const key of Object.keys(dentalFields)) ctx.facts[key] = { value: "Không có", status: "ANSWERED", sourceMessageId: "synthetic", updatedAt: 100000 };
  ctx.facts.location.value = "răng hàm dưới bên phải";
  ctx.facts.allergies.value = "Tôi dị ứng penicillin";
  ctx.missing = contextMissing(ctx);
  return a;
}
describe("dental context", () => {
  it("requires only three concise intake answers", () => {
    const context = emptyIntakeContext();
    expect(contextMissing(context)).toEqual(["need", "breathing", "swallowing"]);
  });
  it("remembers facts beyond 12 turns and returns them without reasking", async () => {
    const a = completedContext();
    const provider = vi.fn(async (prompt: string) => {
      expect(JSON.parse(prompt).context.facts.allergies.value).toBe("Tôi dị ứng penicillin");
      return { intent: "QUESTION", workflowId: "dental-pain", safety: "CLEAR", updates: [] };
    });
    for (let i = 0; i < 15; i++) {
      const result = await interpretDental(a, "Nhắc lại lời khai", [], provider, `m${i}`, 100000 + i);
      a.intakeContext = result.context;
      expect(result.message).toContain("răng hàm dưới bên phải");
      expect(result.message).toContain("dị ứng penicillin");
    }
  });
  it("records corrections with provenance and unknown/declined without inventing negatives", async () => {
    const a = completedContext(); a.intakeContext!.confirmedVersion = 1;
    const text = "Tôi đau bên trái. Không biết thuốc đang dùng. Không muốn cung cấp bệnh nền.";
    const result = await interpretDental(a, text, [], async () => ({ intent: "CHANGE", workflowId: "dental-pain", safety: "CLEAR", updates: [
      { field: "location", status: "ANSWERED", quote: "đau bên trái" },
      { field: "medications", status: "UNKNOWN", quote: "Không biết thuốc đang dùng" },
      { field: "conditions", status: "DECLINED", quote: "Không muốn cung cấp bệnh nền" },
    ] }), "source-2", 123456);
    expect(result.context!.facts.location).toMatchObject({ value: "đau bên trái", sourceMessageId: "source-2", updatedAt: 123456 });
    expect(result.context!.facts.medications.status).toBe("UNKNOWN");
    expect(result.context!.confirmedVersion).toBeNull();
    expect(a.intakeContext!.facts.location.value).toContain("bên phải");
  });
  it("rejects unsupported quotes and invalid IDs with exactly one retry", async () => {
    const a = dentalCase();
    const provider = vi.fn(async () => ({ intent: "INTAKE", workflowId: "dental-pain", safety: "CLEAR", updates: [{ field: "allergies", status: "ANSWERED", quote: "bịa thông tin" }] }));
    expect((await interpretDental(a, "Đau răng", [], provider, "m", 1)).failed).toBe(true);
    expect(provider).toHaveBeenCalledTimes(2);
    expect(a.intakeContext!.facts).toEqual({});
    expect((await interpretDental(a, "Đau răng", [], async () => ({ workflowId: "fake-room" }), "m", 1)).failed).toBe(true);
  });
  it("does not confirm missing safety, asks at most two missing fields, handles provider timeout", async () => {
    const a = dentalCase();
    const result = await interpretDental(a, "Đau răng", [], async () => ({ intent: "INTAKE", workflowId: "dental-pain", safety: "CLEAR", updates: [] }), "m", 1);
    expect(result.draft).toBeNull();
    expect(result.context!.safety).toBe("UNCLEAR");
    expect((result.message.match(/\?/g) || []).length).toBeLessThanOrEqual(2);
    expect((await interpretDental(a, "hello", [], async () => { throw new Error("timeout"); }, "m", 1)).failed).toBe(true);
  });
  it("understands negation/history and stops current swallowing/breathing danger", async () => {
    expect(checkSafetyGuardrails("Tôi không sốt, không sưng mặt, không khó nuốt, không khó thở.").isEmergency).toBe(false);
    expect(checkSafetyGuardrails("Trước đây khó thở nhưng hiện đã hết.").isEmergency).toBe(false);
    const provider = vi.fn();
    const result = await interpretDental(dentalCase(), "Mặt tôi sưng và hiện khó nuốt.", [], provider, "m", 1);
    expect(result.handoff).toBe(true); expect(provider).not.toHaveBeenCalled();
  });
});
describe("dental simulator", () => {
  function setup(id = "dental-pain") {
    const a = completedContext(dentalCase(), id);
    const w = catalog.workflows.find((w) => w.id === id)!;
    buildJourney(a, { workflowId: id, kind: w.kind, summary: "Dữ liệu tổng hợp hư cấu" });
    a.intakeContext!.confirmedVersion = 1;
    startSimulation(a, 100000);
    return a;
  }
  it.each(["dental-pain", "dental-gum", "dental-followup", "dental-routine"])("finishes %s using legal one-step ticks", (id) => {
    const a = setup(id);
    for (let i = 0; i < 80 && a.status !== "COMPLETED"; i++) {
      const now = a.simulationRun!.nextTickAt;
      if (a.proposal) {
        a.revision++;
        applyAction(a, { type: "ACCEPT_PROPOSAL", proposalId: a.proposal.id }, now);
        simulate(a, { type: "RESUME" }, now);
      } else { a.revision++; simulate(a, { type: "TICK" }, now); }
    }
    expect(a.status).toBe("COMPLETED");
    expect(a.steps.consult.startedAt).toBeGreaterThan(0);
    if (id === "dental-pain") { expect(a.steps.imaging.status).toBe("COMPLETED"); expect(a.steps.lab.status).toBe("SKIPPED"); expect(a.steps.medication.status).toBe("SKIPPED"); }
    if (id === "dental-routine") expect(a.steps.imaging).toBeUndefined();
  });
  it("does not tick early, catch up, bypass pause/proposal or move a serving step", () => {
    const a = setup();
    expect(simulate(a, { type: "TICK" }, 100001)).toBeNull();
    simulate(a, { type: "TICK" }, 200000);
    expect(a.steps.checkin.status).not.toBe("COMPLETED");
    simulate(a, { type: "PAUSE" }, 200001);
    expect(simulate(a, { type: "TICK" }, 300000)).toBeNull();
    simulate(a, { type: "SET_SPEED", speed: 4 }, 300001);
    simulate(a, { type: "RESUME" }, 300001);
    expect(a.simulationRun!.nextTickAt).toBe(300626);
    simulate(a, { type: "TICK" }, 300626);
    simulate(a, { type: "TICK" }, a.simulationRun!.nextTickAt);
    expect(a.proposal).not.toBeNull();
    expect(a.simulationRun!.status).toBe("PAUSED");
    const state = JSON.stringify(a.steps);
    simulate(a, { type: "TICK" }, a.simulationRun!.nextTickAt);
    expect(JSON.stringify(a.steps)).toBe(state);
  });
});
