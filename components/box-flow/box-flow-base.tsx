"use client";
import { Handle, Position } from "@xyflow/react";
import {
  CheckCircle2,
  Clock3,
  LockKeyhole,
  MapPin,
  Stethoscope,
  Users,
} from "lucide-react";
import type { Room, RuntimeStep, StepDefinition } from "@/types/journey";
import { doctorLabels, roomLabels, stepLabels } from "@/types/journey";

export type FlowData = {
  definition: StepDefinition;
  step: RuntimeStep;
  room: Room | null;
  sequence: number;
  current: boolean;
} & Record<string, unknown>;
export function DoctorStatus({ room }: { room: Room }) {
  return room.doctorName ? (
    <div className="border-t pt-3 mt-3 flex gap-2 text-xs text-muted-foreground">
      <Stethoscope className="size-4 shrink-0 text-primary" />
      <div>
        <p className="text-foreground font-medium">{room.doctorName}</p>
        <p>
          {room.doctorSpecialty} · {doctorLabels[room.doctorStatus]}
        </p>
      </div>
    </div>
  ) : null;
}
export function FlowCard({ data, label }: { data: FlowData; label: string }) {
  const { definition: def, step, room, sequence, current } = data;
  const completed = ["COMPLETED", "SKIPPED"].includes(step.status);
  return (
    <div
      className={`w-[264px] rounded-2xl border bg-card p-4 text-left ${current ? "border-primary ring-2 ring-primary/10" : "border-border"} ${step.status === "SKIPPED" ? "opacity-60" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !size-2"
      />
      <div className="flex justify-between items-center gap-2">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="text-xs text-primary font-medium">
          {String(sequence).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-semibold text-sm mt-2 leading-5">{def.name}</h3>
      <div
        className={`mt-3 flex items-center gap-1.5 text-xs ${completed ? "text-primary" : step.status === "LOCKED" ? "text-muted-foreground" : "text-foreground"}`}
      >
        {completed ? (
          <CheckCircle2 className="size-3.5" />
        ) : step.status === "LOCKED" ? (
          <LockKeyhole className="size-3.5" />
        ) : (
          <Clock3 className="size-3.5" />
        )}
        {step.resultPending
          ? "Đang chờ kết quả"
          : step.ticket === "CALLED"
            ? "Đã gọi đến lượt bạn"
            : stepLabels[step.status]}
      </div>
      {room && (
        <>
          <p className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {room.name} · {room.floor}
          </p>
          <div className="mt-2 flex justify-between gap-2 text-xs">
            <span>{roomLabels[room.status]}</span>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {room.queueCount} lượt
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Chờ dự kiến{" "}
            {Math.ceil(room.queueCount / room.capacity) * room.serviceMinutes}{" "}
            phút · demo
          </p>
          <DoctorStatus room={room} />
        </>
      )}
      {def.condition && (
        <p className="mt-3 text-[11px] text-muted-foreground border-t pt-2">
          Chỉ thực hiện nếu được chỉ định
        </p>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary !size-2"
      />
    </div>
  );
}
