"use client";
import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Appointment, Room } from "@/types/journey";
import { roomLabels, doctorLabels } from "@/types/journey";

type Send = (target: "simulation", value: unknown) => Promise<boolean>;
const selectStyle =
  "w-full rounded-lg border border-input bg-card px-2 py-2 text-sm";
function RoomControl({
  room,
  send,
  disabled,
}: {
  room: Room;
  send: Send;
  disabled: boolean;
}) {
  const [status, setStatus] = useState(room.status),
    [doctor, setDoctor] = useState(room.doctorStatus),
    [queue, setQueue] = useState(room.queueCount),
    [capacity, setCapacity] = useState(room.capacity);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void send("simulation", {
          type: "ROOM",
          roomId: room.id,
          status,
          doctorStatus: doctor,
          queueCount: queue,
          capacity,
        });
      }}
      className="rounded-xl border bg-card p-3 space-y-3"
    >
      <h4 className="font-medium text-sm">{room.name}</h4>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs space-y-1">
          <span>Trạng thái phòng</span>
          <select
            className={selectStyle}
            value={status}
            onChange={(e) => setStatus(e.target.value as Room["status"])}
          >
            {Object.entries(roomLabels).map(([v, l]) => (
              <option value={v} key={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs space-y-1">
          <span>Nhân sự</span>
          <select
            className={selectStyle}
            value={doctor}
            onChange={(e) => setDoctor(e.target.value as Room["doctorStatus"])}
          >
            {Object.entries(doctorLabels).map(([v, l]) => (
              <option value={v} key={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs space-y-1">
          <span>Số lượt chờ</span>
          <input
            className={selectStyle}
            type="number"
            min={0}
            max={100}
            required
            value={queue}
            onChange={(e) => setQueue(Number(e.target.value))}
          />
        </label>
        <label className="text-xs space-y-1">
          <span>Số chỗ phục vụ</span>
          <input
            className={selectStyle}
            type="number"
            min={1}
            max={10}
            required
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </label>
      </div>
      <Button type="submit" variant="outline" disabled={disabled}>
        Áp dụng mô phỏng
      </Button>
    </form>
  );
}
export function SimulationPanel({
  appointment: a,
  send,
  disabled,
}: {
  appointment: Appointment;
  send: Send;
  disabled: boolean;
}) {
  const used = new Set(a.workflow?.steps.flatMap((s) => s.roomIds) ?? []);
  return (
    <details className="rounded-2xl border bg-muted/30 p-4">
      <summary className="cursor-pointer text-sm font-medium flex items-center gap-2">
        <FlaskConical className="size-4 text-primary" /> Bảng mô phỏng · chỉ ảnh
        hưởng ca này
      </summary>
      <div className="mt-4 space-y-4">
        <p className="text-xs text-muted-foreground">
          Thao tác dưới đây đóng vai nhân viên trong demo. Không cập nhật dữ
          liệu bệnh viện thật.
        </p>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={() => send("simulation", { type: "REFRESH_ROOMS" })}
        >
          Xác nhận lại trạng thái tất cả phòng
        </Button>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.values(a.rooms)
            .filter((r) => used.has(r.id))
            .map((room) => (
              <RoomControl
                key={`${room.id}-${room.updatedAt}`}
                room={room}
                send={send}
                disabled={disabled}
              />
            ))}
        </div>
        <div className="space-y-3">
          {a.workflow?.steps
            .filter((def) => !["CHECKIN", "FINISH"].includes(def.kind))
            .map((def) => {
              const step = a.steps[def.id];
              return (
                <div key={def.id} className="border rounded-xl p-3 bg-card">
                  <p className="text-sm font-medium mb-2">{def.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {def.condition &&
                      a.conditions[def.condition] === "UNDECIDED" && (
                        <>
                          <Button
                            variant="outline"
                            disabled={disabled}
                            onClick={() =>
                              send("simulation", {
                                type: "CONDITION",
                                condition: def.condition,
                                value: "ORDERED",
                              })
                            }
                          >
                            Có chỉ định demo
                          </Button>
                          <Button
                            variant="outline"
                            disabled={disabled}
                            onClick={() =>
                              send("simulation", {
                                type: "CONDITION",
                                condition: def.condition,
                                value: "NOT_REQUIRED",
                              })
                            }
                          >
                            Không cần thực hiện
                          </Button>
                        </>
                      )}
                    {step.ticket === "WAITING" && (
                      <Button
                        disabled={disabled}
                        onClick={() =>
                          send("simulation", {
                            type: "STEP",
                            stepId: def.id,
                            event: "CALL",
                          })
                        }
                      >
                        Gọi số
                      </Button>
                    )}
                    {step.ticket === "CALLED" && (
                      <Button
                        disabled={disabled}
                        onClick={() =>
                          send("simulation", {
                            type: "STEP",
                            stepId: def.id,
                            event: "START",
                          })
                        }
                      >
                        Bắt đầu phục vụ
                      </Button>
                    )}
                    {step.ticket === "SERVING" && (
                      <Button
                        disabled={disabled}
                        onClick={() =>
                          send("simulation", {
                            type: "STEP",
                            stepId: def.id,
                            event: "COMPLETE",
                          })
                        }
                      >
                        Hoàn tất thực hiện
                      </Button>
                    )}
                    {step.resultPending && (
                      <Button
                        disabled={disabled}
                        onClick={() =>
                          send("simulation", {
                            type: "STEP",
                            stepId: def.id,
                            event: "RESULT_READY",
                          })
                        }
                      >
                        Kết quả đã sẵn sàng
                      </Button>
                    )}
                    {!def.condition && step.ticket === "NONE" && (
                      <span className="text-xs text-muted-foreground">
                        {step.status === "LOCKED"
                          ? "Chờ hoàn tất các bước tiên quyết."
                          : "Bệnh nhân cần đến phòng trước khi được gọi."}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </details>
  );
}
