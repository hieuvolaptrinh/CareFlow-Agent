"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Plus, ArrowUpRight, HeartPulse } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { getFirebaseClient } from "@/lib/firebase/client";
import { api, errorText } from "@/lib/api-client";
import type { Appointment } from "@/types/journey";

function Dashboard() {
  const auth = useAuth(),
    router = useRouter();
  const [items, setItems] = useState<Appointment[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  const pendingId = useRef<string | null>(null);
  useEffect(() => {
    if (!auth.user) return;
    return onSnapshot(
      query(
        collection(getFirebaseClient().db, "appointments"),
        where("ownerId", "==", auth.user.uid),
        orderBy("createdAt", "desc"),
      ),
      (snapshot) => {
        setItems(snapshot.docs.map((d) => d.data() as Appointment));
        setLoading(false);
        setError("");
      },
      (err) => {
        setError(errorText(err));
        setLoading(false);
      },
    );
  }, [auth.user]);
  async function create() {
    if (busy) return;
    setBusy(true);
    setError("");
    pendingId.current ??= crypto.randomUUID();
    try {
      const result = await api<{ id: string }>("/api/appointments", {
        requestId: pendingId.current,
      });
      pendingId.current = null;
      router.push(`/patient/appointments/${result.id}`);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-6xl py-6 space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary font-semibold"
        >
          <HeartPulse /> CareFlow
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span>{auth.profile?.name}</span>
          <Button variant="outline" onClick={() => auth.logout()}>
            Đăng xuất
          </Button>
        </div>
      </header>
      <section className="rounded-2xl bg-card border p-6 sm:p-8">
        <p className="text-xs tracking-widest text-primary uppercase">
          Không gian bệnh nhân
        </p>
        <h1 className="text-2xl font-semibold mt-2">
          Mỗi bước khám, rõ ràng hơn.
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl">
          Trao đổi với CareFlow, theo dõi hành trình và nhận thông báo khi có
          thay đổi. Các ca dưới đây sử dụng dữ liệu mô phỏng.
        </p>
        <Button className="mt-6 h-11" onClick={create} disabled={busy}>
          <Plus />
          {busy ? "Đang tạo…" : "Tạo ca khám demo"}
        </Button>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-4">Hành trình của bạn</h2>
        {error && (
          <p role="alert" className="text-destructive mb-4">
            {error}
          </p>
        )}
        {loading ? (
          <p role="status">Đang tải ca khám…</p>
        ) : !items.length ? (
          <div className="border border-dashed rounded-2xl p-8 text-muted-foreground">
            Chưa có ca khám. Tạo ca demo đầu tiên để bắt đầu.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((a) => (
              <Link
                key={a.id}
                href={`/patient/appointments/${a.id}`}
                className="rounded-2xl border bg-card p-5 hover:border-primary transition-colors"
              >
                <div className="flex justify-between gap-3">
                  <h3 className="font-medium">{a.title}</h3>
                  <ArrowUpRight className="size-5 text-primary shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(a.createdAt).toLocaleString("vi-VN")}
                </p>
                <p className="text-sm text-primary mt-4">
                  {a.status === "COMPLETED"
                    ? "Đã hoàn tất"
                    : a.status === "ON_HOLD"
                      ? "Chờ hỗ trợ"
                      : a.status === "ACTIVE"
                        ? "Đang diễn ra"
                        : "Đang chuẩn bị"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
export default function PatientDashboardPage() {
  return (
    <AuthGate role="PATIENT">
      <Dashboard />
    </AuthGate>
  );
}
