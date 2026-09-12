import "server-only";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import type { Appointment, ChatMessage } from "@/types/journey";
import {
  createAppointment,
  JourneyError,
  type JourneyAction,
  type SimulationAction,
  applyAction,
  applySimulation,
  refreshProposal,
} from "@/server/workflow/engine";
import { runAgentLoop } from "@/server/agent/core/agent-loop";
import { emptyIntakeContext } from "@/lib/intake-context";
import { isRunCommand, simulate, startSimulation, STEP_INTERVAL_MS } from "@/server/workflow/simulator";
import { generateStepNote } from "@/server/agent/core/step-note-agent";

export const appointmentRef = (id: string) =>
  getFirebaseAdmin().db.collection("appointments").doc(id);
export function assertOwner(
  a: Appointment | undefined,
  uid: string,
): asserts a is Appointment {
  if (!a || a.ownerId !== uid)
    throw new JourneyError("Không tìm thấy ca khám của bạn.", 404, "NOT_FOUND");
}
export async function getAppointment(id: string, uid: string) {
  const a = (await appointmentRef(id).get()).data() as Appointment | undefined;
  assertOwner(a, uid);
  return a;
}
export async function getOrCreateStepNote(id: string, uid: string, stepId: string) {
  const initial = await getAppointment(id, uid);
  const initialStep = initial.steps[stepId];
  if (!initial.workflow?.steps.some((step) => step.id === stepId) || !initialStep)
    throw new JourneyError("Không tìm thấy bước trong hành trình.", 404, "NOT_FOUND");
  if (initialStep.aiNote) return initialStep.aiNote;

  const content = await generateStepNote(initial, stepId);
  const ref = appointmentRef(id);
  return getFirebaseAdmin().db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.data() as Appointment | undefined;
    assertOwner(current, uid);
    const step = current.steps[stepId];
    if (!current.workflow?.steps.some((definition) => definition.id === stepId) || !step)
      throw new JourneyError("Bước không còn tồn tại trong hành trình.", 409, "REVISION_CONFLICT");
    if (step.aiNote) return step.aiNote;
    const note = { ...content, generatedAt: Date.now() };
    step.aiNote = note;
    current.revision++;
    current.updatedAt = note.generatedAt;
    tx.set(ref, current);
    return note;
  });
}
export async function newAppointment(uid: string, requestId: string) {
  const db = getFirebaseAdmin().db;
  const key = db
    .collection("users")
    .doc(uid)
    .collection("creationRequests")
    .doc(requestId);
  const ref = db.collection("appointments").doc();
  return db.runTransaction(async (tx) => {
    const old = await tx.get(key);
    if (old.exists) return { id: old.data()!.appointmentId as string };
    const a = createAppointment(ref.id, uid, Date.now());
    a.intakeContext = emptyIntakeContext();
    tx.create(ref, a);
    tx.create(key, { appointmentId: ref.id });
    tx.create(ref.collection("messages").doc("welcome"), {
      id: "welcome",
      role: "model",
      text: "Chào bạn! Bạn muốn khám mới nha khoa, tái khám hay kiểm tra răng định kỳ? Hãy mô tả ngắn nhu cầu hoặc tình trạng của bạn. Mình chỉ hỏi thêm tối đa 2 ý cần thiết trước khi bạn xác nhận hành trình.",
      createdAt: a.createdAt,
    });
    return { id: ref.id };
  });
}
export async function mutateAppointment(
  id: string,
  uid: string,
  requestId: string,
  revision: number,
  command: JourneyAction | SimulationAction,
  simulation = false,
) {
  const ref = appointmentRef(id),
    event = ref.collection("events").doc(requestId);
  return getFirebaseAdmin().db.runTransaction(async (tx) => {
    const [snap, previous] = await Promise.all([tx.get(ref), tx.get(event)]);
    const a = snap.data() as Appointment | undefined;
    assertOwner(a, uid);
    if (previous.exists) return { revision: a.revision };
    if (a.revision !== revision)
      throw new JourneyError(
        "Ca vừa được cập nhật ở nơi khác. Hãy xem trạng thái mới rồi thử lại.",
        409,
        "REVISION_CONFLICT",
      );
    if (simulation && (process.env.CAREFLOW_DEMO_MODE !== "true" || !a.demo))
      throw new JourneyError(
        "Mô phỏng chưa được bật cho ca này.",
        403,
        "DEMO_DISABLED",
      );
    const now = Date.now();
    if ((a.agentPendingUntil ?? 0) > now && command.type !== "PAUSE" && command.type !== "TICK")
      throw new JourneyError("Agent đang cập nhật lời khai. Vui lòng đợi.", 409, "AGENT_BUSY");
    if (!simulation && command.type === "CHOOSE_TEMPLATE" && a.intakeContext)
      throw new JourneyError("Ca nha khoa cần lời khai đầy đủ. Dùng chat hoặc biểu mẫu lời khai.");
    a.revision++;
    a.updatedAt = now;
    const message = simulation
      ? isRunCommand(command.type) ? simulate(a, command as SimulationAction, now) : applySimulation(a, command as SimulationAction, now)
      : applyAction(a, command as JourneyAction, now);
    if (message === null) return { revision: a.revision - 1 };
    if (command.type === "SAVE_DENTAL_INTAKE" && a.intakeContext) {
      Object.values(a.intakeContext.facts).forEach((fact) => { if (fact.sourceMessageId === "form-pending") fact.sourceMessageId = `form-${requestId}`; });
      tx.create(ref.collection("messages").doc(`form-${requestId}`), { id: `form-${requestId}`, role: "user", text: a.intakeContext.summary, createdAt: now });
      tx.create(ref.collection("contextVersions").doc(String(a.intakeContext.version)), a.intakeContext);
    }
    if (command.type === "CONFIRM_INTAKE" && a.intakeContext && process.env.CAREFLOW_DEMO_MODE === "true") startSimulation(a, now);
    if (["ACCEPT_PROPOSAL", "REJECT_PROPOSAL"].includes(command.type) && a.simulationRun && !a.onHoldReason) {
      a.simulationRun.status = "RUNNING"; a.simulationRun.reason = null;
      a.simulationRun.nextTickAt = now + STEP_INTERVAL_MS / a.simulationRun.speed;
    }
    tx.set(ref, a);
    tx.create(ref.collection("journeyVersions").doc(String(a.revision)), {
      ...a,
      trigger: command.type,
    });
    tx.create(event, {
      id: requestId,
      type: command.type,
      simulation,
      createdAt: a.updatedAt,
      revision: a.revision,
      actorId: uid,
      actor: command.type === "TICK" ? "SIMULATOR" : "PATIENT",
      message,
      stepId: a.simulationRun?.nextStepId ?? null,
      correlationId: requestId,
    });
    const notice = {
      id: requestId,
      text: message,
      read: false,
      createdAt: a.updatedAt,
    };
    tx.create(ref.collection("notifications").doc(requestId), notice);
    tx.create(ref.collection("messages").doc(`action-${requestId}`), {
      id: `action-${requestId}`,
      role: "model",
      text: message,
      createdAt: a.updatedAt,
    });
    if (command.type === "SUPPORT" || (command.type === "SAVE_DENTAL_INTAKE" && a.status === "ON_HOLD"))
      tx.create(ref.collection("supportRequests").doc(requestId), {
        id: requestId,
        status: "DEMO_PENDING",
        createdAt: a.updatedAt,
        currentStepId:
          a.order.find(
            (id) => !["COMPLETED", "SKIPPED"].includes(a.steps[id].status),
          ) ?? null,
      });
    return { revision: a.revision };
  });
}
export async function readNotice(id: string, uid: string, noticeId: string) {
  await getAppointment(id, uid);
  await appointmentRef(id)
    .collection("notifications")
    .doc(noticeId)
    .update({ read: true });
  return { read: true };
}

export async function sendJourneyMessage(
  id: string,
  uid: string,
  requestId: string,
  revision: number,
  message: string,
) {
  const db = getFirebaseAdmin().db,
    ref = appointmentRef(id),
    runRef = ref.collection("agentRuns").doc(requestId);
  const start = await db.runTransaction(async (tx) => {
    const [snap, oldRun] = await Promise.all([tx.get(ref), tx.get(runRef)]);
    const a = snap.data() as Appointment | undefined;
    assertOwner(a, uid);
    if (oldRun.exists) {
      if (
        oldRun.data()!.stage === "FAILED" ||
        (!oldRun.data()!.finishedAt &&
          Date.now() - oldRun.data()!.startedAt > 60000)
      )
        throw new JourneyError(
          "Lượt xử lý trước chưa hoàn tất. Gửi lại để tạo lượt xử lý mới.",
          409,
          "RETRY_MESSAGE",
        );
      return { duplicate: true as const, a };
    }
    if (a.revision !== revision)
      throw new JourneyError(
        "Dữ liệu đã thay đổi. Hãy gửi lại sau khi cập nhật.",
        409,
        "REVISION_CONFLICT",
      );
    if ((a.agentPendingUntil ?? 0) > Date.now()) throw new JourneyError("Agent đang xử lý một tin nhắn. Vui lòng đợi.", 409, "AGENT_BUSY");
    if (!a.simulationRun && Date.now() - a.updatedAt < 700 && a.revision > 0)
      throw new JourneyError(
        "Hãy đợi một chút trước khi gửi tiếp.",
        429,
        "RATE_LIMIT",
      );
    a.revision++;
    a.updatedAt = Date.now();
    a.agentPendingUntil = a.updatedAt + 60000;
    if (a.simulationRun?.status === "RUNNING") { a.simulationRun.status = "PAUSED"; a.simulationRun.reason = "Đang cập nhật lời khai. Bấm Tiếp tục sau khi kiểm tra."; }
    tx.set(ref, a);
    tx.create(runRef, {
      id: requestId,
      stage: "UNDERSTANDING",
      startedAt: a.updatedAt,
      finishedAt: null,
    });
    tx.create(ref.collection("messages").doc(`user-${requestId}`), {
      id: `user-${requestId}`,
      role: "user",
      text: message,
      createdAt: a.updatedAt,
    });
    return { duplicate: false as const, a };
  });
  if (start.duplicate) return { duplicate: true };
  try {
    const history = (
      await ref
        .collection("messages")
        .orderBy("createdAt", "desc")
        .limit(14)
        .get()
    ).docs
      .map((d) => d.data() as ChatMessage)
      .reverse()
      .filter((m) => m.id !== `user-${requestId}`);
    const result = await runAgentLoop(start.a, message, history, `user-${requestId}`, Date.now());
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const a = snap.data() as Appointment | undefined;
      assertOwner(a, uid);
      if (a.revision !== start.a.revision)
        throw new JourneyError(
          "Hành trình đã thay đổi trong lúc AI xử lý. Hãy gửi lại yêu cầu.",
          409,
          "REVISION_CONFLICT",
        );
      a.revision++;
      a.updatedAt = Date.now();
      a.agentPendingUntil = 0;
      if (result.context) {
        a.intakeContext = result.context;
        tx.create(ref.collection("contextVersions").doc(String(result.context.version)), result.context);
        if (!result.draft && !result.failed && (result.context.summary !== start.a.intakeContext?.summary || result.context.workflowId !== start.a.intakeContext?.workflowId || result.context.safety !== "CLEAR")) a.draftIntake = null;
      }
      if (result.draft) a.draftIntake = result.draft;
      if (result.handoff) {
        a.status = "ON_HOLD";
        a.onHoldReason = result.message;
        a.proposal = null;
        tx.create(ref.collection("supportRequests").doc(requestId), {
          id: requestId,
          status: "DEMO_PENDING",
          createdAt: a.updatedAt,
        });
      }
      refreshProposal(a, a.updatedAt);
      tx.set(ref, a);
      tx.create(ref.collection("journeyVersions").doc(String(a.revision)), {
        ...a,
        trigger: "AGENT_RESPONSE",
      });
      tx.update(runRef, {
        stage: result.failed
          ? "FAILED"
          : result.draft
            ? "AWAITING_CONFIRMATION"
            : "COMPLETED",
        finishedAt: a.updatedAt,
      });
      tx.create(ref.collection("messages").doc(`model-${requestId}`), {
        id: `model-${requestId}`,
        role: "model",
        text: result.message,
        createdAt: a.updatedAt,
      });
      tx.create(ref.collection("events").doc(requestId), {
        id: requestId,
        type: "AGENT_RESPONSE",
        createdAt: a.updatedAt,
        revision: a.revision,
        correlationId: requestId,
        actorId: uid,
      });
      if (result.handoff || result.failed)
        tx.create(ref.collection("notifications").doc(requestId), {
          id: requestId,
          text: result.message,
          read: false,
          createdAt: a.updatedAt,
        });
    });
    return { processed: true, revision: start.a.revision + 1 };
  } catch (error) {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (snap.data()?.agentPendingUntil === start.a.agentPendingUntil) tx.update(ref, { agentPendingUntil: 0 });
    }).catch(() => {});
    await runRef
      .update({
        stage: "FAILED",
        finishedAt: Date.now(),
        errorCode: error instanceof JourneyError ? error.code : "AGENT_ERROR",
      })
      .catch(() => {});
    throw error;
  }
}
