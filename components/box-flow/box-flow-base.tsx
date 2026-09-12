"use client";
import { Handle, Position } from "@xyflow/react";
import {
  CheckCircle2,
  Clock3,
  LockKeyhole,
  MapPin,
  Stethoscope,
  Users,
  LoaderCircle,
} from "lucide-react";
import type { Room, RuntimeStep, StepDefinition, SyncStatus } from "@/types/journey";
import { doctorLabels, roomLabels } from "@/types/journey";

export type FlowData = {
  definition: StepDefinition;
  step: RuntimeStep;
  room: Room | null;
  sequence: number;
  current: boolean;
  selected: boolean;
  statusText: string;
  guidance: string;
  inspect: () => void;
  sync: SyncStatus;
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
  const { definition: def, step, room, sequence, current, selected } = data;
  const processing = step.ticket === "SERVING";
  const completed = ["COMPLETED", "SKIPPED"].includes(step.status);
  return (
    <div
      className={`w-[300px] h-[420px] flex flex-col rounded-2xl border-2 bg-card p-4 text-left shadow-sm transition-colors ${current ? "border-primary ring-4 ring-primary/10" : selected ? "border-primary/60 bg-primary/[0.03]" : "border-border hover:border-primary/40"} ${step.status === "SKIPPED" ? "opacity-70" : ""}`}
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
      <h3 className="font-semibold text-base mt-2 leading-6">{def.name}</h3>
      <p className={`text-[11px] mt-1 ${data.sync === "Error" ? "text-destructive" : "text-muted-foreground"}`}>Dữ liệu: {data.sync}</p>
      {current && <p className="text-xs font-semibold text-primary mt-1">BƯỚC HIỆN TẠI</p>}
      <div
        className={`mt-3 rounded-lg px-2.5 py-2 flex items-center gap-2 text-sm font-medium ${completed ? "bg-emerald-50 text-emerald-800" : processing ? "bg-primary/10 text-primary" : step.status === "LOCKED" ? "bg-muted text-muted-foreground" : "bg-amber-50 text-amber-900"}`}
      >
        {processing ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" /> : completed ? (
          <CheckCircle2 className="size-3.5" />
        ) : step.status === "LOCKED" ? (
          <LockKeyhole className="size-3.5" />
        ) : (
          <Clock3 className="size-3.5" />
        )}
        {data.statusText}
      </div>
      {room && (
        <>
          <p className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {room.name} · {room.floor}
          </p>
          <div className="mt-2 flex justify-between gap-2 text-xs">
            <span>Phòng: {roomLabels[room.status]}</span>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {room.queueCount} lượt
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Chờ dự kiến{" "}
            {Math.ceil(room.queueCount / Math.max(1, room.capacity)) * room.serviceMinutes}{" "}
            phút
          </p>
          <DoctorStatus room={room} />
        </>
      )}
      {def.condition && (
        <p className="mt-3 text-[11px] text-muted-foreground border-t pt-2">
          Chỉ thực hiện nếu được chỉ định
        </p>
      )}
      <p className="text-xs leading-5 mt-3 text-muted-foreground line-clamp-3">{data.guidance}</p>
      <p className="text-[11px] text-muted-foreground mt-2">{step.startedAt ? `Bắt đầu ${new Date(step.startedAt).toLocaleTimeString("vi-VN")}` : "Chưa bắt đầu"}{step.completedAt ? ` · Xong ${new Date(step.completedAt).toLocaleTimeString("vi-VN")}` : ""}</p>
      <button type="button" className="nodrag nopan mt-auto min-h-11 rounded-lg border border-primary/20 bg-primary/5 px-3 text-sm font-medium text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary" onClick={(event) => { event.stopPropagation(); data.inspect(); }}>
        Xem chi tiết bước
      </button>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary !size-2"
      />
    </div>
  );
}
