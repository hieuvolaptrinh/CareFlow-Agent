export type OrderType = "LAB" | "IMAGING" | "PROCEDURE" | "PHARMACY";

export type OrderStatus =
  | "PENDING"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "RESULT_READY"
  | "CANCELLED";

export interface ClinicalOrder {
  id: string;
  visitId: string;
  externalOrderId?: string;
  type: OrderType;
  serviceId: string;
  status: OrderStatus;
  createdAt: Date;
  completedAt?: Date;
}
