import { describe, it, expect } from "vitest";
import {
  applyAction,
  applySimulation,
  buildJourney,
  calculateProposal,
  createAppointment,
} from "@/server/workflow/engine";
import { catalog, catalogSchema } from "@/server/workflow/catalog";
import type { Appointment } from "@/types/journey";

const now = 1000000;
function setup(workflowId = "checkup") {
  const a = createAppointment("a", "u", now);
  const workflow = catalog.workflows.find((w) => w.id === workflowId)!;
  buildJourney(a, {
    workflowId,
    kind: workflow.kind,
    summary: "Thông tin demo",
  });
  a.revision++;
  applyAction(a, { type: "CHECKIN" }, now);
  return a;
}
function finish(a: Appointment, stepId: string) {
  applyAction(a, { type: "ARRIVE", stepId }, now);
  for (const event of ["CALL", "START", "COMPLETE"] as const)
    applySimulation(a, { type: "STEP", stepId, event }, now);
  if (a.steps[stepId].resultPending)
    applySimulation(a, { type: "STEP", stepId, event: "RESULT_READY" }, now);
}
describe("workflow prerequisites and lifecycle", () => {
  it("rejects duplicate IDs, missing references, unsafe alternative rooms and cycles", () => {
    const duplicate = structuredClone(catalog);
    duplicate.workflows[0].steps[1].id = "checkin";
    expect(catalogSchema.safeParse(duplicate).success).toBe(false);
    const missing = structuredClone(catalog);
    missing.workflows[0].steps[0].prerequisites = ["missing"];
    expect(catalogSchema.safeParse(missing).success).toBe(false);
    const cycle = structuredClone(catalog);
    cycle.workflows[0].steps[0].prerequisites = ["consult"];
    expect(catalogSchema.safeParse(cycle).success).toBe(false);
    const room = structuredClone(catalog);
    room.workflows[0].steps[1].roomIds.push("lab-a");
    expect(catalogSchema.safeParse(room).success).toBe(false);
  });
  it("never permits results review before investigations", () => {
    const a = setup();
    expect(a.steps.lab.status).toBe("AVAILABLE");
    expect(a.steps.review.status).toBe("LOCKED");
    expect(() =>
      applyAction(a, { type: "ARRIVE", stepId: "review" }, now),
    ).toThrow();
    finish(a, "lab");
    finish(a, "imaging");
    finish(a, "review");
    expect(a.status).toBe("COMPLETED");
  });
  it("requires an explicit demo order decision and never lets Gemini start it", () => {
    const a = setup("dental");
    expect(() =>
      applySimulation(
        a,
        { type: "CONDITION", condition: "lab", value: "ORDERED" },
        now,
      ),
    ).toThrow();
    finish(a, "consult");
    expect(a.steps.lab.status).toBe("LOCKED");
    applySimulation(
      a,
      { type: "CONDITION", condition: "lab", value: "NOT_REQUIRED" },
      now,
    );
    applySimulation(
      a,
      { type: "CONDITION", condition: "imaging", value: "NOT_REQUIRED" },
      now,
    );
    expect(a.steps.review.status).toBe("AVAILABLE");
    expect(a.steps.lab.status).toBe("SKIPPED");
    expect(() =>
      applySimulation(
        a,
        { type: "CONDITION", condition: "lab", value: "ORDERED" },
        now,
      ),
    ).toThrow();
  });
  it("allows only one waiting visit step and requires results-ready", () => {
    const a = setup();
    applyAction(a, { type: "ARRIVE", stepId: "lab" }, now);
    expect(() =>
      applyAction(a, { type: "ARRIVE", stepId: "imaging" }, now),
    ).toThrow();
    expect(() =>
      applySimulation(
        a,
        { type: "STEP", stepId: "lab", event: "COMPLETE" },
        now,
      ),
    ).toThrow();
    for (const event of ["CALL", "START", "COMPLETE"] as const)
      applySimulation(a, { type: "STEP", stepId: "lab", event }, now);
    expect(a.steps.lab.resultPending).toBe(true);
    expect(a.steps.review.status).toBe("LOCKED");
  });
});
describe("replanning", () => {
  it("compares the remaining path and changes only after confirmation", () => {
    const a = setup();
    a.rooms["lab-a"].queueCount = 5;
    a.proposal = calculateProposal(a, now);
    expect(a.order[1]).toBe("lab");
    expect(a.proposal!.order[1]).toBe("imaging");
    expect(a.proposal!.savingMinutes).toBeGreaterThanOrEqual(5);
    a.revision++;
    applyAction(
      a,
      { type: "ACCEPT_PROPOSAL", proposalId: a.proposal!.id },
      now,
    );
    expect(a.order[1]).toBe("imaging");
    expect(a.steps.review.status).toBe("LOCKED");
  });
  it("can choose only a room with the same service", () => {
    const a = setup("dental");
    a.rooms["dental-a"].status = "CLOSED";
    const proposal = calculateProposal(a, now);
    expect(proposal?.assignments.consult).toBe("dental-a2");
    a.rooms["dental-a2"].doctorStatus = "ABSENT";
    expect(calculateProposal(a, now)).toBeNull();
  });
  it("does not reroute a called patient or use stale snapshots", () => {
    const a = setup();
    applyAction(a, { type: "ARRIVE", stepId: "lab" }, now);
    applySimulation(a, { type: "STEP", stepId: "lab", event: "CALL" }, now);
    a.rooms["lab-a"].queueCount = 10;
    expect(calculateProposal(a, now)).toBeNull();
    const fresh = setup();
    fresh.rooms["lab-a"].queueCount = 10;
    expect(calculateProposal(fresh, now + 300001)).toBeNull();
  });
  it("releases a waiting ticket and rejects outdated acceptance", () => {
    const a = setup();
    applyAction(a, { type: "ARRIVE", stepId: "lab" }, now);
    a.rooms["lab-a"].queueCount = 10;
    a.proposal = calculateProposal(a, now);
    const proposalId = a.proposal!.id;
    a.revision += 2;
    expect(() =>
      applyAction(a, { type: "ACCEPT_PROPOSAL", proposalId }, now),
    ).toThrow();
    a.revision--;
    applyAction(a, { type: "ACCEPT_PROPOSAL", proposalId }, now);
    expect(a.steps.lab.ticket).toBe("NONE");
  });
  it("respects rejection cooldown and freezes held cases", () => {
    const a = setup();
    a.rooms["lab-a"].queueCount = 10;
    a.proposal = calculateProposal(a, now);
    a.revision++;
    applyAction(
      a,
      { type: "REJECT_PROPOSAL", proposalId: a.proposal!.id },
      now,
    );
    expect(calculateProposal(a, now + 100)).toBeNull();
    applyAction(a, { type: "SUPPORT" }, now);
    expect(calculateProposal(a, now)).toBeNull();
    expect(() => applySimulation(a, { type: "REFRESH_ROOMS" }, now)).toThrow();
  });
});
