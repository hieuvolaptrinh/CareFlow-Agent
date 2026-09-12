export type VisitStatus =
  | "PLANNED"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export type StepStatus =
  | "LOCKED"
  | "AVAILABLE"
  | "ACTIVE"
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "SKIPPED"
  | "CANCELLED"
  | "BLOCKED";

export interface VisitStep {
  id: string;
  visitId: string;
  workflowStepId: string;
  name: string;
  type: string;
  status: StepStatus;
  locationId?: string;
  serviceId?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Visit {
  id: string;
  patientId: string;
  siteId: string;
  appointmentId?: string;
  workflowVersionId: string;
  status: VisitStatus;
  startedAt: Date;
  completedAt?: Date;
  currentStepId?: string;
}
