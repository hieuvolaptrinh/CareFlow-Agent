"use client";
import type { Appointment } from "@/types/journey";
import { Button } from "@/components/ui/button";

export function StepDemoControl({ appointment: a, stepId, disabled, send }: {
  appointment: Appointment;
  stepId: string;
  disabled: boolean;
  send: (target: "simulation", value: unknown) => Promise<boolean>;
}) {
  const step = a.steps[stepId];
  if (!a.demo || a.status !== "ACTIVE" || a.onHoldReason) return null;
  const event = step.resultPending ? "RESULT_READY" : step.ticket === "SERVING" ? "COMPLETE" : step.ticket === "CALLED" ? "START" : step.ticket === "WAITING" ? "CALL" : null;
  if (!event) return null;
  const room = step.roomId ? a.rooms[step.roomId] : null;
  const unavailable = room && (!["OPEN", "BUSY"].includes(room.status) || room.doctorStatus === "ABSENT");
  const blocked = !!unavailable && ["CALL", "START"].includes(event);
  const labels = { CALL: "Gọi số", START: "Bắt đầu phục vụ", COMPLETE: "Hoàn tất thực hiện", RESULT_READY: "Kết quả đã sẵn sàng" };
  return (
    <div className="mt-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 space-y-2">
      <p className="text-xs font-medium">Điều khiển demo · đóng vai nhân viên</p>
      <p className="text-xs text-muted-foreground">Chỉ cập nhật ca mô phỏng này, chưa kết nối nhân viên bệnh viện thật.</p>
      {blocked && <p className="text-xs text-destructive">Phòng/bác sĩ chưa sẵn sàng. Kiểm tra bảng mô phỏng bên dưới.</p>}
      <Button className="min-h-11 w-full sm:w-auto" disabled={disabled || blocked} onClick={() => void send("simulation", { type: "STEP", stepId, event })}>
        Mô phỏng: {labels[event]}
      </Button>
    </div>
  );
}
