import type { Appointment } from "@/types/journey";
import { stepLabels } from "@/types/journey";

export function stepPresentation(a: Appointment, id: string) {
  const step = a.steps[id];
  const def = a.workflow?.steps.find((s) => s.id === id);
  const finished = ["COMPLETED", "SKIPPED", "CANCELLED"];
  const current = a.order.find((key) => !finished.includes(a.steps[key].status)) === id;
  const missing = def?.prerequisites.filter((key) => !finished.includes(a.steps[key].status)) ?? [];
  const status = step.resultPending ? "Chờ kết quả" : step.ticket === "CALLED" ? "Đã gọi đến lượt" : step.ticket === "SERVING" ? "Đang phục vụ" : stepLabels[step.status];
  const reason = a.onHoldReason
    ? "Ca đang tạm giữ. Liên hệ hỗ trợ trước khi tiếp tục."
    : missing.length
      ? `Chờ: ${missing.map((key) => a.workflow!.steps.find((s) => s.id === key)!.name).join(", ")}.`
      : def?.condition && a.conditions[def.condition] === "UNDECIDED"
        ? "Chờ chỉ định demo trong bảng mô phỏng; chưa phải bước bắt buộc."
        : step.resultPending
          ? "Đã thực hiện dịch vụ. Nhân viên cần cập nhật kết quả để mở bước sau."
          : step.ticket === "SERVING"
            ? "Bạn đang được phục vụ. Không chuyển phòng cho đến khi hoàn tất."
            : step.ticket === "CALLED"
              ? "Đã đến lượt. Nhân viên xác nhận bắt đầu phục vụ."
              : step.ticket === "WAITING"
                ? "Đã vào hàng đợi. Chờ nhân viên gọi số."
                : step.status === "AVAILABLE"
                  ? current ? "Đã đủ điều kiện. Xác nhận có mặt để bắt đầu bước này." : "Đủ điều kiện, nhưng cần theo thứ tự đã xác nhận."
                  : step.status === "COMPLETED" ? "Bước đã hoàn tất và được lưu." : step.status === "SKIPPED" ? "Không cần thực hiện trong hành trình này." : def?.instruction ?? "";
  return { current, status, reason };
}
