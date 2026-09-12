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
    tx.create(ref, a);
    tx.create(key, { appointmentId: ref.id });
    tx.create(ref.collection("messages").doc("welcome"), {
      id: "welcome",
      role: "model",
      text: "Chào bạn! Bạn muốn khám mới, tái khám hay khám sức khỏe? Hãy cho mình biết nhu cầu và tình trạng bạn muốn trao đổi. Đây là hành trình mô phỏng.",
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
    a.revision++;
    a.updatedAt = Date.now();
    const message = simulation
      ? applySimulation(a, command as SimulationAction, a.updatedAt)
      : applyAction(a, command as JourneyAction, a.updatedAt);
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
    if (command.type === "SUPPORT")
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
    if (Date.now() - a.updatedAt < 700 && a.revision > 0)
      throw new JourneyError(
        "Hãy đợi một chút trước khi gửi tiếp.",
        429,
        "RATE_LIMIT",
      );
    a.revision++;
    a.updatedAt = Date.now();
    a.proposal = null;
    a.draftIntake = null;
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
    const result = await runAgentLoop(start.a, message, history);
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
    return { processed: true };
  } catch (error) {
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
