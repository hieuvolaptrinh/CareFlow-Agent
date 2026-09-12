"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { HeartPulse, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import { api, errorText } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/types/journey";

export default function LoginPage() {
  const auth = useAuth(),
    router = useRouter();
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState("");
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const incomplete = !!auth.user && !auth.profile && !auth.loading;
  useEffect(() => {
    if (auth.profile && !busy)
      router.replace(
        auth.profile.role === "PATIENT"
          ? "/patient/dashboard"
          : "/staff/dashboard",
      );
  }, [auth.profile, busy, router]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (!incomplete) {
        const firebase = getFirebaseClient().auth;
        if (register)
          await createUserWithEmailAndPassword(firebase, email, password);
        else await signInWithEmailAndPassword(firebase, email, password);
      }
      let profile: Profile | null = null;
      if (register || incomplete)
        profile = await api<Profile>("/api/profile", { name, role });
      else profile = await api<Profile | null>("/api/profile");
      await auth.reload();
      if (profile)
        router.replace(
          profile.role === "PATIENT"
            ? "/patient/dashboard"
            : "/staff/dashboard",
        );
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="bg-dashboard min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary font-semibold"
        >
          <HeartPulse /> CareFlow Agent
        </Link>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Hành trình của bạn
          </p>
          <h1 className="text-2xl font-semibold">
            {incomplete
              ? "Hoàn tất hồ sơ"
              : register
                ? "Tạo tài khoản"
                : "Chào mừng trở lại"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Đăng nhập để lưu và theo dõi ca khám demo trên các thiết bị.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {(register || incomplete) && (
            <>
              <label className="block text-sm space-y-2">
                <span>Họ và tên</span>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  maxLength={80}
                />
              </label>
              <fieldset>
                <legend className="text-sm mb-2">Vai trò trong demo</legend>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      ["PATIENT", "Bệnh nhân"],
                      ["DOCTOR", "Bác sĩ"],
                    ] as const
                  ).map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 border rounded-xl p-3 text-sm"
                    >
                      <input
                        type="radio"
                        name="role"
                        checked={role === value}
                        onChange={() => setRole(value)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Tài khoản bác sĩ chưa có quyền xem hồ sơ bệnh nhân.
                </p>
              </fieldset>
            </>
          )}
          {!incomplete && (
            <>
              <label className="block text-sm space-y-2">
                <span>Email</span>
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="block text-sm space-y-2">
                <span>Mật khẩu</span>
                <Input
                  type="password"
                  autoComplete={register ? "new-password" : "current-password"}
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </>
          )}
          {(error || auth.error) && (
            <p role="alert" className="text-sm text-destructive">
              {error || auth.error}
            </p>
          )}
          <Button
            className="w-full h-11"
            disabled={busy || auth.loading}
            type="submit"
          >
            {busy
              ? "Đang xử lý…"
              : incomplete
                ? "Lưu hồ sơ"
                : register
                  ? "Đăng ký"
                  : "Đăng nhập"}
            <ArrowRight />
          </Button>
        </form>
        {incomplete ? (
          <Button variant="ghost" onClick={() => auth.logout()}>
            Đăng xuất
          </Button>
        ) : (
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={() => {
              setRegister(!register);
              setError("");
            }}
          >
            {register
              ? "Đã có tài khoản? Đăng nhập"
              : "Chưa có tài khoản? Đăng ký nhanh"}
          </button>
        )}
      </div>
    </main>
  );
}
