"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, LoaderCircle } from "lucide-react";
import { api, errorText } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export function StartAgentCard() {
  const router = useRouter();
  const requestId = useRef<string | null>(null);
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    if (pending.current) return;
    if (!navigator.onLine) {
      setError("Bạn đang ngoại tuyến. Kết nối mạng rồi thử lại nhé.");
      return;
    }
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      // Keep the same ID on retry if the server saved the case but the response was lost.
      requestId.current ??= crypto.randomUUID();
      const result = await api<{ id: string }>("/api/appointments", {
        requestId: requestId.current,
      });
      router.push(`/patient/appointments/${encodeURIComponent(result.id)}`);
    } catch (err) {
      setError(errorText(err));
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby="start-agent-title"
      className="rounded-2xl border border-primary/20 bg-card p-4 sm:p-5 space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-xl bg-primary/10 p-3 text-primary shrink-0">
            <Bot className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h2 id="start-agent-title" className="text-lg font-semibold">
              Bắt đầu hành trình cùng CareFlow
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Không cần đặt lịch. Mở chat, mô tả tình trạng hoặc nhu cầu khám;
              Agent sẽ hỏi thêm và hướng dẫn bạn từng bước.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Hành trình demo được lưu riêng vào tài khoản, không phải lịch hẹn với bệnh viện.
            </p>
          </div>
        </div>
        <Button
          onClick={start}
          disabled={busy}
          aria-busy={busy}
          className="min-h-11 w-full sm:w-auto shrink-0"
        >
          {busy ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Bot className="size-4" aria-hidden="true" />}
          {busy ? "Đang mở Agent…" : error ? "Thử lại · Bắt đầu với Agent" : "Bắt đầu với Agent"}
        </Button>
      </div>
      {busy && <p role="status" className="text-sm text-muted-foreground">Đang chuẩn bị cuộc trò chuyện của bạn…</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </section>
  );
}
