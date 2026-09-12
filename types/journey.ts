import type { StepStatus, VisitStatus } from "./visit.types";

export type DemoRole = "PATIENT" | "DOCTOR";
export interface Profile {
  uid: string;
  email: string;
  name: string;
  role: DemoRole;
}
export type Kind = "NEW" | "FOLLOW_UP" | "CHECKUP";
export type NodeKind =
  "CHECKIN" | "ROOM" | "DOCTOR" | "ORDER" | "BILLING" | "PHARMACY" | "FINISH";
export interface StepDefinition {
  id: string;
  name: string;
  kind: NodeKind;
  prerequisites: string[];
  roomIds: string[];
  required: boolean;
  reorderGroup: string | null;
  condition: string | null;
  instruction: string;
}
export interface Workflow {
  id: string;
  name: string;
  kind: Kind;
  version: number;
  demo: true;
  questions: string[];
  selection: string;
  steps: StepDefinition[];
}
export interface Room {
  id: string;
  name: string;
  floor: string;
  serviceId: string;
  doctorName: string | null;
  doctorSpecialty: string | null;
  serviceMinutes: number;
  travelMinutes: number;
  status: "OPEN" | "BUSY" | "PAUSED" | "CLOSED" | "UNKNOWN";
  doctorStatus: "AVAILABLE" | "SERVING" | "ABSENT";
  queueCount: number;
  capacity: number;
  updatedAt: number;
}
export interface RuntimeStep {
  id: string;
  status: StepStatus;
  roomId: string | null;
  ticket: "NONE" | "WAITING" | "CALLED" | "SERVING" | "DONE";
  resultPending: boolean;
}
export interface Intake {
  workflowId: string;
  kind: Kind;
  summary: string;
}
export interface Proposal {
  id: string;
  baseRevision: number;
  order: string[];
  assignments: Record<string, string | null>;
  reason: string;
  savingMinutes: number | null;
  fingerprint: string;
  createdAt: number;
}
export interface Appointment {
  id: string;
  ownerId: string;
  demo: true;
  visitId: string;
  title: string;
  revision: number;
  createdAt: number;
  updatedAt: number;
  status: VisitStatus;
  intake: Intake | null;
  draftIntake: Intake | null;
  workflow: Workflow | null;
  steps: Record<string, RuntimeStep>;
  order: string[];
  rooms: Record<string, Room>;
  conditions: Record<string, "UNDECIDED" | "ORDERED" | "NOT_REQUIRED">;
  proposal: Proposal | null;
  rejected: { fingerprint: string; at: number; unavailable: boolean } | null;
  onHoldReason: string | null;
}
export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  createdAt: number;
}
export interface Notice {
  id: string;
  text: string;
  read: boolean;
  createdAt: number;
}
export interface AgentRun {
  id: string;
  stage:
    | "RECEIVED"
    | "UNDERSTANDING"
    | "AWAITING_CONFIRMATION"
    | "COMPLETED"
    | "FAILED";
  startedAt: number;
  finishedAt: number | null;
  errorCode?: string;
}

export const stepLabels: Record<StepStatus, string> = {
  LOCKED: "Chưa đủ điều kiện",
  AVAILABLE: "Có thể thực hiện",
  ACTIVE: "Đang đến phòng",
  WAITING: "Đang chờ",
  IN_PROGRESS: "Đang thực hiện",
  COMPLETED: "Đã hoàn thành",
  SKIPPED: "Không cần thực hiện",
  CANCELLED: "Đã hủy",
  BLOCKED: "Tạm dừng",
};
export const roomLabels: Record<Room["status"], string> = {
  OPEN: "Đang mở",
  BUSY: "Đang phục vụ",
  PAUSED: "Tạm nghỉ",
  CLOSED: "Đã đóng",
  UNKNOWN: "Chưa rõ",
};
export const doctorLabels: Record<Room["doctorStatus"], string> = {
  AVAILABLE: "Có mặt",
  SERVING: "Đang phục vụ",
  ABSENT: "Tạm vắng",
};
