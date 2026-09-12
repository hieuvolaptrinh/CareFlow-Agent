import { StepStatus } from "./visit.types";

export interface WorkflowDefinition {
  id: string;
  siteId: string;
  name: string;
  version: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
}

export interface WorkflowStep {
  id: string;
  workflowId: string;
  code: string;
  name: string;
  order: number;
  required: boolean;
  serviceId?: string;
  locationId?: string;
  prerequisites: string[];
}
