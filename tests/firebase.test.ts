import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  newAppointment,
  mutateAppointment,
  getAppointment,
  sendJourneyMessage,
} from "@/server/repositories/appointments";
import { runAgentLoop } from "@/server/agent/core/agent-loop";

vi.mock("@/server/agent/core/agent-loop", () => ({ runAgentLoop: vi.fn() }));

const enabled = !!process.env.FIRESTORE_EMULATOR_HOST;
describe.skipIf(!enabled)(
  "Firebase Emulator authorization and transactions",
  () => {
    let env: RulesTestEnvironment;
    beforeAll(async () => {
      process.env.FIREBASE_PROJECT_ID = "demo-careflow";
      process.env.CAREFLOW_DEMO_MODE = "true";
      env = await initializeTestEnvironment({
        projectId: "demo-careflow",
        firestore: { rules: readFileSync("firestore.rules", "utf8") },
      });
      await env.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        for (const [uid, role] of [
          ["alice", "PATIENT"],
          ["bob", "PATIENT"],
          ["doctor", "DOCTOR"],
        ])
          await setDoc(doc(db, "users", uid), { uid, role });
        await setDoc(doc(db, "appointments", "rules-case"), {
          ownerId: "alice",
        });
        await setDoc(
          doc(db, "appointments", "rules-case", "messages", "welcome"),
          { text: "hello" },
        );
      });
    });
    afterAll(async () => {
      await env?.cleanup();
    });
    it("separates patients, blocks doctor and anonymous reads", async () => {
      await assertSucceeds(
        getDoc(
          doc(
            env.authenticatedContext("alice").firestore(),
            "appointments/rules-case",
          ),
        ),
      );
      for (const context of [
        env.authenticatedContext("bob"),
        env.authenticatedContext("doctor"),
        env.unauthenticatedContext(),
      ]) {
        await assertFails(
          getDoc(doc(context.firestore(), "appointments/rules-case")),
        );
        await assertFails(
          getDoc(
            doc(
              context.firestore(),
              "appointments/rules-case/messages/welcome",
            ),
          ),
        );
      }
    });
    it("blocks direct mutation of role, visit and audit", async () => {
      const db = env.authenticatedContext("alice").firestore();
      await assertFails(updateDoc(doc(db, "users/alice"), { role: "DOCTOR" }));
      await assertFails(
        updateDoc(doc(db, "appointments/rules-case"), { status: "COMPLETED" }),
      );
      await assertFails(
        setDoc(doc(db, "appointments/rules-case/events/fake"), {
          type: "COMPLETED",
        }),
      );
    });
    it("persists a chat result once and prevents a late model response overwriting newer state", async () => {
      const { id } = await newAppointment("alice", crypto.randomUUID());
      const requestId = crypto.randomUUID();
      const result = {
        message: "Hãy xác nhận gói demo.",
        draft: {
          workflowId: "checkup",
          kind: "CHECKUP" as const,
          summary: "Khám sức khỏe",
        },
        handoff: false,
        failed: false,
      };
      vi.mocked(runAgentLoop).mockResolvedValue(result);
      await sendJourneyMessage(id, "alice", requestId, 0, "Khám sức khỏe");
      await sendJourneyMessage(id, "alice", requestId, 0, "Khám sức khỏe");
      expect(runAgentLoop).toHaveBeenCalledTimes(1);
      expect((await getAppointment(id, "alice")).draftIntake?.workflowId).toBe(
        "checkup",
      );

      const newer = await newAppointment("alice", crypto.randomUUID());
      let release!: (value: typeof result) => void;
      let entered!: () => void;
      const started = new Promise<void>((resolve) => {
        entered = resolve;
      });
      vi.mocked(runAgentLoop).mockImplementationOnce(() => {
        entered();
        return new Promise((resolve) => {
          release = resolve;
        });
      });
      const pending = sendJourneyMessage(
        newer.id,
        "alice",
        crypto.randomUUID(),
        0,
        "Khám sức khỏe",
      );
      const rejection = expect(pending).rejects.toMatchObject({
        code: "REVISION_CONFLICT",
      });
      await started;
      await mutateAppointment(newer.id, "alice", crypto.randomUUID(), 1, {
        type: "CHOOSE_TEMPLATE",
        workflowId: "followup",
        summary: "Thông tin tái khám mới",
      });
      release(result);
      await rejection;
      expect(
        (await getAppointment(newer.id, "alice")).draftIntake?.workflowId,
      ).toBe("followup");
    });
    it("creates once, deduplicates mutations and rejects conflicting revisions", async () => {
      const creationId = crypto.randomUUID();
      const [one, two] = await Promise.all([
        newAppointment("alice", creationId),
        newAppointment("alice", creationId),
      ]);
      expect(one.id).toBe(two.id);
      const requestId = crypto.randomUUID();
      const action = {
        type: "CHOOSE_TEMPLATE" as const,
        workflowId: "checkup" as const,
        summary: "Khám sức khỏe demo",
      };
      await Promise.all([
        mutateAppointment(one.id, "alice", requestId, 0, action),
        mutateAppointment(one.id, "alice", requestId, 0, action),
      ]);
      expect((await getAppointment(one.id, "alice")).revision).toBe(1);
      await expect(
        mutateAppointment(one.id, "alice", crypto.randomUUID(), 0, action),
      ).rejects.toMatchObject({ code: "REVISION_CONFLICT" });
      await expect(getAppointment(one.id, "bob")).rejects.toMatchObject({
        status: 404,
      });
    });
  },
);
