export interface PatientProfile {
  id: string;
  userId: string;
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  insuranceNumber?: string;
  language: string;
  accessibilityPreference?: {
    wheelchairNeeded?: boolean;
    visualAssistance?: boolean;
    hearingAssistance?: boolean;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}
