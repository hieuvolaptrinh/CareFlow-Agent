"use client";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
export default function StaffDashboardPage() {
  const auth = useAuth();
  return (
    <AuthGate role="DOCTOR">
      <section className="max-w-xl mx-auto my-12 rounded-2xl bg-card border p-8 space-y-4">
        <h1 className="text-2xl font-semibold">
          Xin chào, {auth.profile?.name}
        </h1>
        <p>
          Tài khoản bác sĩ demo đã sẵn sàng. Màn hình nghiệp vụ bác sĩ sẽ được
          bổ sung sau.
        </p>
        <p className="text-sm text-muted-foreground">
          Vai trò này chưa được cấp quyền xem hoặc thao tác ca bệnh nhân.
        </p>
        <Button onClick={() => auth.logout()}>Đăng xuất</Button>
      </section>
    </AuthGate>
  );
}
