export type UserRole =
  | "PATIENT"
  | "RECEPTIONIST"
  | "DOCTOR"
  | "NURSE"
  | "LAB_STAFF"
  | "IMAGING_STAFF"
  | "PHARMACY_STAFF"
  | "BILLING_STAFF"
  | "HOSPITAL_ADMIN"
  | "SYSTEM_ADMIN";

export interface UserSession {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  hospitalSiteId?: string;
}
