import { AuthGate } from "@/components/auth/auth-gate";
import { AppointmentWorkspace } from "@/components/patient/appointment-workspace";

export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  return (
    <AuthGate role="PATIENT">
      <AppointmentWorkspace appointmentId={appointmentId} />
    </AuthGate>
  );
}
