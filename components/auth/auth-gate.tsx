"use client";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";

export function AuthGate({
  children,
  role,
}: {
  children: ReactNode;
  role: "PATIENT" | "DOCTOR";
}) {
  const auth = useAuth(),
    router = useRouter();
  useEffect(() => {
    if (!auth.loading && !auth.user) router.replace("/login");
  }, [auth.loading, auth.user, router]);
  if (auth.loading)
    return (
      <p role="status" className="p-8 text-muted-foreground">
        Đang tải tài khoản…
      </p>
    );
  if (auth.error)
    return (
      <div role="alert" className="p-8 space-y-4">
        <p>{auth.error}</p>
        <Button onClick={() => location.reload()}>Thử lại</Button>
      </div>
    );
  if (!auth.user || !auth.profile)
    return (
      <div className="p-8">
        <Link className="text-primary underline" href="/login">
          Đăng nhập hoặc hoàn tất hồ sơ để tiếp tục
        </Link>
      </div>
    );
  if (auth.profile.role !== role)
    return (
      <div className="p-8">
        <p>Trang này không thuộc vai trò của bạn.</p>
        <Link
          className="text-primary underline"
          href={
            auth.profile.role === "DOCTOR"
              ? "/staff/dashboard"
              : "/patient/dashboard"
          }
        >
          Về trang tài khoản
        </Link>
      </div>
    );
  return children;
}
