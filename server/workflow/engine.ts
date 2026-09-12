import { z } from "zod";
import type {
  Appointment,
  Intake,
  Proposal,
  Room,
  RuntimeStep,
} from "@/types/journey";
import { catalog } from "./catalog";

export class JourneyError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code = "INVALID_TRANSITION",
  ) {
    super(message);
  }
}
const done = (step: RuntimeStep) =>
  ["COMPLETED", "SKIPPED", "CANCELLED"].includes(step.status);
const committed = (step: RuntimeStep) =>
  ["CALLED", "SERVING"].includes(step.ticket) ||
  step.status === "IN_PROGRESS" ||
  step.resultPending;
export const actionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("CONFIRM_INTAKE") }),
  z.object({
    type: z.literal("CHOOSE_TEMPLATE"),
    workflowId: z.enum(["dental", "followup", "checkup"]),
    summary: z.string().trim().min(3).max(3000),
  }),
  z.object({ type: z.literal("CHECKIN") }),
  z.object({ type: z.literal("ARRIVE"), stepId: z.string() }),
  z.object({ type: z.literal("ACCEPT_PROPOSAL"), proposalId: z.string() }),
  z.object({ type: z.literal("REJECT_PROPOSAL"), proposalId: z.string() }),
  z.object({ type: z.literal("SUPPORT") }),
  z.object({ type: z.literal("REASSESS") }),
]);
export const simulationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ROOM"),
    roomId: z.string(),
    status: z.enum(["OPEN", "BUSY", "PAUSED", "CLOSED", "UNKNOWN"]),
    doctorStatus: z.enum(["AVAILABLE", "SERVING", "ABSENT"]),
    queueCount: z.number().int().min(0).max(100),
    capacity: z.number().int().min(1).max(10),
  }),
  z.object({
    type: z.literal("STEP"),
    stepId: z.string(),
    event: z.enum(["CALL", "START", "COMPLETE", "RESULT_READY"]),
  }),
  z.object({
    type: z.literal("CONDITION"),
    condition: z.string(),
    value: z.enum(["ORDERED", "NOT_REQUIRED"]),
  }),
  z.object({ type: z.literal("REFRESH_ROOMS") }),
]);
export type JourneyAction = z.infer<typeof actionSchema>;
export type SimulationAction = z.infer<typeof simulationSchema>;

export function createAppointment(
  id: string,
  ownerId: string,
  now: number,
): Appointment {
  return {
    id,
    ownerId,
    demo: true,
    visitId: id,
    title: "Ca khám demo mới",
    revision: 0,
    createdAt: now,
    updatedAt: now,
    status: "PLANNED",
    intake: null,
    draftIntake: null,
    workflow: null,
    steps: {},
    order: [],
    rooms: Object.fromEntries(
      catalog.resources.map((room) => [
        room.id,
        {
          ...room,
          status: "OPEN",
          doctorStatus: "AVAILABLE",
          queueCount: 0,
          capacity: 1,
          updatedAt: now,
        },
      ]),
    ),
    conditions: {},
    proposal: null,
    rejected: null,
    onHoldReason: null,
  };
}

export function buildJourney(a: Appointment, intake: Intake) {
  if (a.status !== "PLANNED")
    throw new JourneyError(
      "Ca đã bắt đầu. Hãy yêu cầu hỗ trợ để thay đổi nhu cầu khám.",
    );
  const definition = catalog.workflows.find(
    (w) => w.id === intake.workflowId && w.kind === intake.kind,
  );
  if (!definition)
    throw new JourneyError("Quy trình không có trong danh mục demo.");
  a.workflow = structuredClone(definition);
  a.intake = intake;
  a.draftIntake = null;
  a.title = definition.name;
  a.steps = Object.fromEntries(
    definition.steps.map((s) => [
      s.id,
      {
        id: s.id,
        status: "LOCKED",
        roomId: s.roomIds[0] ?? null,
        ticket: "NONE",
        resultPending: false,
      },
    ]),
  );
  a.order = definition.steps.map((s) => s.id);
  a.conditions = Object.fromEntries(
    definition.steps
      .filter((s) => s.condition)
      .map((s) => [s.condition!, "UNDECIDED"]),
  );
  a.proposal = null;
  a.onHoldReason = null;
  reconcile(a);
}

export function roomReady(room: Room, now: number) {
  return (
    ["OPEN", "BUSY"].includes(room.status) &&
    room.doctorStatus !== "ABSENT" &&
    now - room.updatedAt <= catalog.policy.freshnessMs
  );
}
export function estimateWait(room: Room) {
  return Math.ceil(room.queueCount / room.capacity) * room.serviceMinutes;
}
export function nextStep(a: Appointment) {
  return a.order.map((id) => a.steps[id]).find((s) => !done(s));
}

export function reconcile(a: Appointment) {
  if (!a.workflow) return;
  for (const definition of a.workflow.steps) {
    const step = a.steps[definition.id];
    if (
      done(step) ||
      committed(step) ||
      ["WAITING", "ACTIVE"].includes(step.status)
    )
      continue;
    const condition = definition.condition
      ? a.conditions[definition.condition]
      : "ORDERED";
    if (condition === "NOT_REQUIRED") {
      step.status = "SKIPPED";
      continue;
    }
    if (
      condition === "UNDECIDED" ||
      !definition.prerequisites.every((id) => done(a.steps[id]))
    ) {
      step.status = "LOCKED";
      continue;
    }
    step.status = definition.kind === "FINISH" ? "COMPLETED" : "AVAILABLE";
  }
  if (a.workflow.steps.every((s) => done(a.steps[s.id]))) {
    a.status = "COMPLETED";
    a.proposal = null;
  }
}

function eligibleOrder(a: Appointment, order: string[]) {
  const wf = a.workflow!;
  const seen = new Set<string>();
  for (const id of order) {
    const def = wf.steps.find((s) => s.id === id)!;
    if (!def || def.prerequisites.some((p) => !seen.has(p))) return false;
    seen.add(id);
  }
  return true;
}
// Enumerate only reorder groups (small, bounded demo graph). Other steps keep their positions.
function candidateOrders(a: Appointment): string[][] {
  let orders = [[...a.order]];
  const groups = new Set(
    a.workflow!.steps.map((s) => s.reorderGroup).filter(Boolean),
  );
  for (const group of groups) {
    const indices = a.order
      .map((id, i) => ({ id, i }))
      .filter(
        ({ id }) =>
          a.workflow!.steps.find((s) => s.id === id)?.reorderGroup === group &&
          !done(a.steps[id]) &&
          !committed(a.steps[id]),
      );
    const permutations = (ids: string[]): string[][] =>
      ids.length <= 1
        ? [ids]
        : ids.flatMap((id, i) =>
            permutations(ids.filter((_, j) => i !== j)).map((rest) => [
              id,
              ...rest,
            ]),
          );
    // Bound search even if a later catalog grows.
    if (indices.length > 5) continue;
    orders = orders
      .flatMap((order) =>
        permutations(indices.map((v) => v.id)).map((ids) => {
          const next = [...order];
          indices.forEach((v, i) => {
            next[v.i] = ids[i];
          });
          return next;
        }),
      )
      .slice(0, 120);
  }
  return orders.filter((order) => eligibleOrder(a, order));
}

function duration(
  a: Appointment,
  order: string[],
  now: number,
  optimizeRooms: boolean,
) {
  let elapsed = 0;
  const assignments: Record<string, string | null> = {};
  for (const id of order) {
    const step = a.steps[id];
    assignments[id] = step.roomId;
    const def = a.workflow!.steps.find((s) => s.id === id)!;
    if (
      done(step) ||
      def.kind === "FINISH" ||
      (def.condition && a.conditions[def.condition] !== "ORDERED")
    )
      continue;
    const choices =
      optimizeRooms && !committed(step)
        ? def.roomIds
        : step.roomId
          ? [step.roomId]
          : [];
    if (!choices.length) continue;
    let best = Infinity,
      roomId: string | null = step.roomId;
    for (const id of choices) {
      const room = a.rooms[id];
      if (!room || !roomReady(room, now)) continue;
      // Queue release is relative to this snapshot. Work elsewhere can overlap the wait.
      const finish =
        Math.max(elapsed + room.travelMinutes, estimateWait(room)) +
        room.serviceMinutes;
      if (finish < best) {
        best = finish;
        roomId = id;
      }
    }
    assignments[id] = roomId;
    elapsed = best;
  }
  return { minutes: elapsed, assignments };
}

export function calculateProposal(
  a: Appointment,
  now: number,
): Proposal | null {
  if (
    !a.workflow ||
    a.status !== "ACTIVE" ||
    a.onHoldReason ||
    Object.values(a.steps).some(committed)
  )
    return null;
  const first = nextStep(a);
  if (
    !first ||
    !["AVAILABLE", "WAITING", "ACTIVE", "BLOCKED"].includes(first.status)
  )
    return null;
  if (
    Object.values(a.rooms).some(
      (r) => now - r.updatedAt > catalog.policy.freshnessMs,
    )
  )
    return null;
  const current = duration(a, a.order, now, false);
  let best = { order: a.order, ...current };
  for (const order of candidateOrders(a)) {
    const cost = duration(a, order, now, true);
    if (cost.minutes < best.minutes) best = { order, ...cost };
  }
  if (
    !Number.isFinite(best.minutes) ||
    current.minutes - best.minutes < catalog.policy.minSavingMinutes
  )
    return null;
  // The next step itself must be unlocked; this also excludes unconfirmed conditional branches.
  const nextId = best.order.find((id) => !done(a.steps[id]));
  if (!nextId || a.steps[nextId].status === "LOCKED") return null;
  const fingerprint = JSON.stringify([best.order, best.assignments]);
  const unavailable = first.roomId && !roomReady(a.rooms[first.roomId], now);
  if (
    !(unavailable && !a.rejected?.unavailable) &&
    a.rejected?.fingerprint === fingerprint &&
    now - a.rejected.at < catalog.policy.rejectionCooldownMs
  )
    return null;
  const saving = Number.isFinite(current.minutes)
    ? Math.round(current.minutes - best.minutes)
    : null;
  const target = best.assignments[nextId];
  return {
    id: `proposal-${a.revision}`,
    baseRevision: a.revision,
    order: best.order,
    assignments: best.assignments,
    savingMinutes: saving,
    reason:
      saving === null
        ? `Phòng hiện tại không sẵn sàng. Có thể tiếp tục tại ${target ? a.rooms[target].name : "bước tiếp theo"}.`
        : `Lộ trình mới dự kiến giảm ${saving} phút chờ. Bước tiếp theo: ${target ? a.rooms[target].name : nextId}.`,
    fingerprint,
    createdAt: now,
  };
}

export function refreshProposal(a: Appointment, now: number) {
  a.proposal = calculateProposal(a, now);
}

export function applyAction(
  a: Appointment,
  action: JourneyAction,
  now: number,
): string {
  if (action.type === "SUPPORT") {
    a.onHoldReason = catalog.policy.handoffMessage;
    a.status = "ON_HOLD";
    a.proposal = null;
    return catalog.policy.handoffMessage;
  }
  if (action.type === "CHOOSE_TEMPLATE") {
    if (a.status !== "PLANNED")
      throw new JourneyError(
        "Ca đã bắt đầu; hãy yêu cầu hỗ trợ để thay đổi nhu cầu.",
      );
    const wf = catalog.workflows.find((w) => w.id === action.workflowId)!;
    a.draftIntake = {
      workflowId: wf.id,
      kind: wf.kind,
      summary: action.summary,
    };
    return "Hãy kiểm tra bản tóm tắt và xác nhận để lập hành trình demo.";
  }
  if (action.type === "CONFIRM_INTAKE") {
    if (!a.draftIntake)
      throw new JourneyError("Chưa có thông tin để xác nhận.");
    buildJourney(a, a.draftIntake);
    return "Hành trình đã được lưu. Khi đến bệnh viện, hãy xác nhận check-in.";
  }
  if (a.onHoldReason) throw new JourneyError(a.onHoldReason);
  if (action.type === "CHECKIN") {
    if (!a.workflow || a.status !== "PLANNED")
      throw new JourneyError("Không thể check-in ở trạng thái này.");
    a.steps.checkin.status = "COMPLETED";
    a.steps.checkin.ticket = "DONE";
    a.status = "ACTIVE";
  } else if (action.type === "ARRIVE") {
    const step = a.steps[action.stepId];
    if (
      !step ||
      nextStep(a)?.id !== step.id ||
      step.status !== "AVAILABLE" ||
      a.status !== "ACTIVE"
    )
      throw new JourneyError(
        "Bước này chưa sẵn sàng hoặc không phải bước tiếp theo.",
      );
    if (
      Object.values(a.steps).some((s) =>
        ["WAITING", "IN_PROGRESS", "ACTIVE"].includes(s.status),
      )
    )
      throw new JourneyError("Bạn đang có một bước chưa hoàn tất.");
    if (step.roomId && !roomReady(a.rooms[step.roomId], now))
      throw new JourneyError(
        "Phòng chưa sẵn sàng hoặc dữ liệu đã cũ. Hãy kiểm tra lại.",
      );
    step.status = "WAITING";
    step.ticket = "WAITING";
  } else if (
    action.type === "ACCEPT_PROPOSAL" ||
    action.type === "REJECT_PROPOSAL"
  ) {
    const proposal = a.proposal;
    if (!proposal || proposal.id !== action.proposalId)
      throw new JourneyError(
        "Đề xuất đã thay đổi. Hãy xem thông tin mới.",
        409,
        "STALE_PROPOSAL",
      );
    // Service increases revision before applying action, so validate against its previous value.
    const current = calculateProposal(
      { ...a, revision: proposal.baseRevision },
      now,
    );
    if (
      proposal.baseRevision !== a.revision - 1 ||
      !current ||
      current.fingerprint !== proposal.fingerprint
    )
      throw new JourneyError(
        "Đề xuất không còn phù hợp. Hãy cập nhật hành trình.",
        409,
        "STALE_PROPOSAL",
      );
    if (action.type === "REJECT_PROPOSAL") {
      const first = nextStep(a);
      a.rejected = {
        fingerprint: proposal.fingerprint,
        at: now,
        unavailable: !!first?.roomId && !roomReady(a.rooms[first.roomId], now),
      };
      a.proposal = null;
      return "Đã giữ lộ trình hiện tại theo lựa chọn của bạn.";
    }
    a.order = proposal.order;
    for (const step of Object.values(a.steps)) {
      if (committed(step) || done(step)) continue;
      // Release the old waiting ticket before moving to the new itinerary.
      if (step.ticket === "WAITING") {
        step.ticket = "NONE";
        step.status = "AVAILABLE";
      }
      step.roomId = proposal.assignments[step.id];
    }
    a.proposal = null;
  }
  reconcile(a);
  refreshProposal(a, now);
  return a.status === "COMPLETED"
    ? "Bạn đã hoàn tất hành trình demo. Lịch sử đã được lưu."
    : "Hành trình đã cập nhật. Hãy xem thẻ việc cần làm tiếp theo.";
}

export function applySimulation(
  a: Appointment,
  command: SimulationAction,
  now: number,
): string {
  if (a.status === "COMPLETED" || a.onHoldReason)
    throw new JourneyError("Ca này đã kết thúc hoặc đang chờ hỗ trợ.");
  if (command.type === "ROOM") {
    const room = a.rooms[command.roomId];
    if (!room) throw new JourneyError("Phòng không tồn tại trong ca demo.");
    Object.assign(room, {
      status: command.status,
      doctorStatus: command.doctorStatus,
      queueCount: command.queueCount,
      capacity: command.capacity,
      updatedAt: now,
    });
  } else if (command.type === "REFRESH_ROOMS") {
    Object.values(a.rooms).forEach((room) => {
      room.updatedAt = now;
    });
  } else if (command.type === "CONDITION") {
    const def = a.workflow?.steps.find(
      (s) => s.condition === command.condition,
    );
    if (!def || !def.prerequisites.every((id) => done(a.steps[id])))
      throw new JourneyError(
        "Cần hoàn thành bước khám trước khi mô phỏng chỉ định.",
      );
    const step = a.steps[def.id];
    if (step.status !== "LOCKED")
      throw new JourneyError(
        "Chỉ định đã được quyết định hoặc bước đã bắt đầu.",
      );
    a.conditions[command.condition] = command.value;
  } else {
    const step = a.steps[command.stepId];
    const def = a.workflow?.steps.find((s) => s.id === command.stepId);
    if (!step || !def) throw new JourneyError("Bước không tồn tại.");
    if (command.event === "CALL") {
      if (step.ticket !== "WAITING" || step.resultPending)
        throw new JourneyError("Chỉ gọi bệnh nhân đang đợi tại phòng.");
      if (step.roomId && !roomReady(a.rooms[step.roomId], now))
        throw new JourneyError("Phòng/bác sĩ chưa sẵn sàng.");
      step.ticket = "CALLED";
    } else if (command.event === "START") {
      if (step.ticket !== "CALLED")
        throw new JourneyError("Phải gọi số trước khi bắt đầu phục vụ.");
      if (step.roomId && !roomReady(a.rooms[step.roomId], now))
        throw new JourneyError("Phòng/bác sĩ chưa sẵn sàng để bắt đầu.");
      step.ticket = "SERVING";
      step.status = "IN_PROGRESS";
      if (step.roomId) {
        a.rooms[step.roomId].status = "BUSY";
        a.rooms[step.roomId].doctorStatus = "SERVING";
        a.rooms[step.roomId].updatedAt = now;
      }
    } else if (command.event === "COMPLETE") {
      if (step.ticket !== "SERVING")
        throw new JourneyError("Bước chưa được thực hiện.");
      step.ticket = "DONE";
      step.resultPending = def.kind === "ORDER";
      step.status = step.resultPending ? "WAITING" : "COMPLETED";
      if (step.roomId) {
        a.rooms[step.roomId].status = "OPEN";
        a.rooms[step.roomId].doctorStatus = "AVAILABLE";
        a.rooms[step.roomId].updatedAt = now;
      }
    } else {
      if (!step.resultPending)
        throw new JourneyError("Chưa có kết quả đang chờ.");
      step.resultPending = false;
      step.status = "COMPLETED";
    }
  }
  reconcile(a);
  refreshProposal(a, now);
  const next = nextStep(a);
  if (!a.proposal && next?.roomId && !roomReady(a.rooms[next.roomId], now))
    return "Phòng hoặc bác sĩ của bước tiếp theo chưa sẵn sàng. Chưa tìm thấy phương án thay thế hợp lệ; bạn có thể chờ hoặc yêu cầu hỗ trợ.";
  return Object.values(a.steps).length > 0 && Object.values(a.steps).every(done)
    ? "Đã hoàn tất hành trình demo. Bạn có thể xem lại toàn bộ các bước."
    : (a.proposal?.reason ??
        "Dữ liệu mô phỏng đã cập nhật. Kiểm tra bước tiếp theo của bạn.");
}
