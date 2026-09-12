export type QueueTicketStatus =
  | "WAITING"
  | "CALLED"
  | "SERVING"
  | "SKIPPED"
  | "DONE"
  | "CANCELLED";

export interface QueueTicket {
  id: string;
  queueId: string;
  visitId: string;
  ticketNumber: string;
  priority: number;
  status: QueueTicketStatus;
  calledAt?: Date;
  servedAt?: Date;
}
