import type { Appointment } from "@/types/journey";
import { applyAction, applySimulation, JourneyError, nextStep, refreshProposal, type SimulationAction } from "./engine";

export const STEP_INTERVAL_MS = 2500;

export const isRunCommand = (type: string) => ["START", "PAUSE", "RESUME", "SET_SPEED", "TICK"].includes(type);
export function startSimulation(a: Appointment, now: number) {
  if (!a.workflow?.id.startsWith("dental-")) throw new JourneyError("Bộ chạy tự động chỉ dành cho mẫu nha khoa mới.");
  a.simulationRun = { status: "RUNNING", speed: 1, preset: "DENTAL_VIDEO", nextTickAt: now + STEP_INTERVAL_MS, nextStepId: nextStep(a)?.id ?? null, reason: null, crowdApplied: false };
}
export function simulate(a: Appointment, command: SimulationAction, now: number): string | null {
  if (command.type === "START") {
    if (!a.intakeContext?.confirmedVersion || a.status !== "PLANNED" || a.simulationRun) throw new JourneyError("Hành trình chưa được xác nhận hoặc đã được khởi tạo.");
    startSimulation(a, now);
    return "Đã khởi tạo hành trình nha khoa.";
  }
  const run = a.simulationRun;
  if (!run) throw new JourneyError("Chưa có hành trình nha khoa.");
  if (command.type === "PAUSE") { run.status = "PAUSED"; run.reason = "Bạn đã tạm dừng."; return run.reason; }
  if (command.type === "SET_SPEED") { run.speed = command.speed; run.nextTickAt = now + STEP_INTERVAL_MS / run.speed; return `Tốc độ cập nhật: ${run.speed}×.`; }
  if (command.type === "RESUME") {
    if (a.status === "COMPLETED" || a.onHoldReason || a.proposal || (a.agentPendingUntil ?? 0) > now || a.intakeContext?.safety !== "CLEAR") throw new JourneyError("Cần xử lý thông tin, đề xuất hoặc hỗ trợ trước khi tiếp tục.");
    run.status = "RUNNING"; run.reason = null; run.nextTickAt = now + STEP_INTERVAL_MS / run.speed;
    return "Hành trình tiếp tục từ trạng thái đã lưu.";
  }
  if (command.type !== "TICK" || run.status !== "RUNNING") return null;
  if (a.status === "COMPLETED") { run.status = "COMPLETED"; return "Hành trình đã hoàn tất."; }
  if (a.onHoldReason || a.proposal || (a.agentPendingUntil ?? 0) > now) {
    run.status = "PAUSED"; run.reason = a.onHoldReason || (a.proposal ? "Chờ bạn xác nhận đề xuất đổi phòng." : "Chờ cập nhật lời khai.");
    return run.reason;
  }
  if (now < run.nextTickAt) return null;
  // After suspension/reload, re-arm rather than fast-forward through overdue states.
  if (now - run.nextTickAt > STEP_INTERVAL_MS * 2) { run.nextTickAt = now + STEP_INTERVAL_MS / run.speed; return "Đã nối lại hành trình; giữ nguyên bước đang thực hiện."; }
  const current = nextStep(a);
  if (!current) { run.status = "COMPLETED"; return "Hoàn tất hành trình."; }
  const before = structuredClone(a);
  let message: string;
  // These are explicit fresh synthetic resource snapshots, never real hospital updates.
  Object.values(a.rooms).forEach((r) => { r.updatedAt = now; });
  try {
    if (a.status === "PLANNED") {
      message = applyAction(a, { type: "CHECKIN" }, now);
      current.startedAt = now; current.completedAt = now;
    } else if (!run.crowdApplied && a.workflow?.id === "dental-pain") {
      run.crowdApplied = true;
      message = applySimulation(a, { type: "ROOM", roomId: "dental-a", status: "BUSY", doctorStatus: "AVAILABLE", queueCount: 3, capacity: 1 }, now);
      message = `Preset video: Phòng A có 3 lượt chờ, A2 đang trống. ${message}`;
    } else if (current.status === "LOCKED") {
      const def = a.workflow!.steps.find((s) => s.id === current.id)!;
      if (!def.condition) throw new JourneyError("Bước đang chờ điều kiện bắt buộc.");
      const value = a.workflow?.id === "dental-pain" && def.condition === "imaging" ? "ORDERED" : "NOT_REQUIRED";
      applySimulation(a, { type: "CONDITION", condition: def.condition, value }, now);
      message = `Hệ thống điều phối · ${def.name}: ${value === "ORDERED" ? "đã mở bước theo thông tin hiện có" : "không áp dụng trong hành trình này"}.`;
    } else if (current.status === "AVAILABLE") {
      if (a.proposal) throw new JourneyError("Chờ xác nhận đổi lộ trình.");
      message = applyAction(a, { type: "ARRIVE", stepId: current.id }, now);
      message = `Đã cập nhật điểm đến · ${a.workflow!.steps.find((s) => s.id === current.id)!.name}. ${message}`;
    } else {
      const event = current.resultPending ? "RESULT_READY" : current.ticket === "SERVING" ? "COMPLETE" : current.ticket === "CALLED" ? "START" : current.ticket === "WAITING" ? "CALL" : null;
      if (!event) throw new JourneyError("Chưa có thao tác tự động hợp lệ.");
      message = applySimulation(a, { type: "STEP", stepId: current.id, event }, now);
      const label = { CALL: "Gọi số", START: "Bắt đầu phục vụ", COMPLETE: "Hoàn tất thực hiện", RESULT_READY: "Trạng thái kết quả đã sẵn sàng" };
      message = `${label[event]} · ${a.workflow!.steps.find((s) => s.id === current.id)!.name}. ${message}`;
    }
  } catch (error) {
    if (!(error instanceof JourneyError)) throw error;
    Object.assign(a, before);
    a.simulationRun!.status = "PAUSED"; a.simulationRun!.reason = error.message;
    return `Hành trình tạm dừng: ${error.message}`;
  }
  refreshProposal(a, now);
  for (const step of Object.values(a.steps)) if (["COMPLETED", "SKIPPED"].includes(step.status) && !step.completedAt) step.completedAt = now;
  run.nextTickAt = now + STEP_INTERVAL_MS / run.speed;
  run.nextStepId = nextStep(a)?.id ?? null;
  if (a.proposal) { run.status = "PAUSED"; run.reason = "Chờ bạn xác nhận đề xuất đổi phòng."; }
  if ((a.status as string) === "COMPLETED") { run.status = "COMPLETED"; run.reason = null; }
  return message;
}
