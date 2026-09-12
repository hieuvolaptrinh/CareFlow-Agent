"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  HeartPulse,
  List,
  MessageCircle,
  Network,
  Send,
  Sparkles,
  WifiOff,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/auth-provider";
import { useAppointment } from "./use-appointment";
import { stepPresentation } from "@/lib/step-presentation";
import { useDemoClock } from "./dental-demo-panel";
import { DentalIntakeForm } from "./dental-intake-form";
import { doctorLabels, roomLabels } from "@/types/journey";

const JourneyFlow = dynamic(
  () => import("./journey-flow").then((m) => m.JourneyFlow),
  {
    ssr: false,
    loading: () => (
      <p className="p-8" role="status">
        Đang tải sơ đồ…
      </p>
    ),
  }
);
export function AppointmentWorkspace({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const {
    appointment: a,
    messages,
    notices,
    run,
    loading,
    error,
    busy,
    online,
    cached,
    send,
    sync,
    loadOlder,
    hasOlder,
    historyBusy,
  } = useAppointment(appointmentId);
  const auth = useAuth();
  const [input, setInput] = useState(""),
    [mobileTab, setMobileTab] = useState("chat"),
    [view, setView] = useState("auto"),
    [template, setTemplate] = useState("checkup"),
    [summary, setSummary] = useState(""),
    [inbox, setInbox] = useState(false),
    [showDataInfo, setShowDataInfo] = useState(false),
    [chatOpen, setChatOpen] = useState(true);
  const [now, setNow] = useState(Date.now),
    [showSupport, setShowSupport] = useState(false);
  useDemoClock(
    a,
    send,
    busy ||
      loading ||
      !online ||
      cached ||
      (run?.stage === "UNDERSTANDING" && now - run.startedAt < 60000),
    error
  );
  const chatEnd = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages.length]);
  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    setInput("");
    if (!(await send("messages", message))) {
      setInput((current) => current || message);
    }
  }
  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-8 space-y-4" role="status">
        <p>Đang tải hành trình…</p>
        <div className="h-80 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  if (!a)
    return (
      <div className="max-w-xl mx-auto py-12 space-y-4">
        <h1 className="text-xl font-semibold">Chưa mở được ca khám</h1>
        <p role="alert">
          Chưa thể tải ca khám này. Vui lòng quay lại danh sách và thử lại.
        </p>
        <Button onClick={() => location.reload()}>Thử lại</Button>
        <Link
          className="block text-primary underline"
          href="/patient/dashboard"
        >
          Về danh sách ca khám
        </Link>
      </div>
    );
  const next = a.order
    .map((id) => a.steps[id])
    .find((s) => !["COMPLETED", "SKIPPED", "CANCELLED"].includes(s.status));
  const definition = a.workflow?.steps.find((s) => s.id === next?.id);
  const room = next?.roomId ? a.rooms[next.roomId] : null;
  const roomUnavailable =
    !!room &&
    (!["OPEN", "BUSY"].includes(room.status) || room.doctorStatus === "ABSENT");
  const requiredSteps = Object.values(a.steps).filter(
    (s) => !["SKIPPED", "CANCELLED"].includes(s.status)
  );
  const completed = requiredSteps.filter(
    (s) => s.status === "COMPLETED"
  ).length;
  const stale = Object.values(a.rooms).some((r) => now - r.updatedAt > 300000);
  const working = run?.stage === "UNDERSTANDING" && now - run.startedAt < 60000;
  const disabled = busy || working || !online || cached;
  const statusText =
    a.status === "ON_HOLD"
      ? "Chờ hỗ trợ"
      : a.status === "COMPLETED"
      ? "Đã hoàn tất"
      : a.status === "ACTIVE"
      ? "Đang diễn ra"
      : "Đang chuẩn bị";
  const stageText = working
    ? "Đang kiểm tra thông tin và nhu cầu…"
    : busy
    ? "Đang tiếp nhận và lưu cập nhật…"
    : run?.stage === "FAILED"
    ? "Cần thử lại · có thể dùng biểu mẫu bên dưới"
    : a.draftIntake
    ? "Chờ bạn xác nhận thông tin"
    : "Sẵn sàng hỗ trợ bạn";
  if (a.workflow) {
    const workflow = a.workflow;
    const unreadCount = notices.filter((notice) => !notice.read).length;
    const currentName = definition?.name ?? "Hành trình đã hoàn tất";
    return (
      <main className="relative -m-4 h-[calc(100dvh-4rem)] min-h-[640px] overflow-hidden bg-[#F4F8F8] sm:-m-6 lg:-m-8">
        {a.status === "COMPLETED" && <h2 className="sr-only">Hành trình đã hoàn tất</h2>}
        <div className="absolute inset-0">
          <JourneyFlow appointment={a} sync={sync} cached={cached} />
        </div>

        <header className="absolute inset-x-3 top-3 z-40 flex min-h-14 items-center justify-between gap-3 rounded-2xl border bg-card/95 px-3 py-2 shadow-sm backdrop-blur sm:inset-x-4 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              aria-label="Về danh sách ca khám"
              href="/patient/dashboard"
              className="grid size-9 shrink-0 place-items-center rounded-xl border bg-card hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold sm:text-base">{a.title}</h1>
                <span className="hidden shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground sm:inline">
                  {statusText}
                </span>
              </div>
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                {completed}/{requiredSteps.length} bước · {currentName}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="hidden items-center gap-1 text-[11px] text-muted-foreground xl:flex">
              {!online ? <><WifiOff className="size-3" /> Ngoại tuyến</> : cached ? "Đang đồng bộ…" : "Đã đồng bộ"}
            </span>
            <Button
              size="icon"
              variant={showDataInfo ? "secondary" : "ghost"}
              aria-label="Thông tin dữ liệu"
              aria-expanded={showDataInfo}
              onClick={() => {
                setShowDataInfo((visible) => !visible);
                setInbox(false);
                setShowSupport(false);
              }}
            >
              <HeartPulse />
            </Button>
            <Button
              size="icon"
              variant={inbox ? "secondary" : "ghost"}
              aria-label={`Thông báo${unreadCount ? `, ${unreadCount} chưa đọc` : ""}`}
              aria-expanded={inbox}
              onClick={() => {
                setInbox((visible) => !visible);
                setShowDataInfo(false);
                setShowSupport(false);
              }}
              className="relative"
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />
              )}
            </Button>
            <Button
              size="icon"
              variant={showSupport ? "secondary" : "ghost"}
              aria-label="Yêu cầu hỗ trợ"
              aria-expanded={showSupport}
              onClick={() => {
                setShowSupport((visible) => !visible);
                setShowDataInfo(false);
                setInbox(false);
              }}
            >
              <LifeBuoy />
            </Button>
            <Button
              size="icon"
              variant={chatOpen ? "secondary" : "default"}
              aria-label={chatOpen ? "Thu gọn trò chuyện" : "Mở trò chuyện"}
              aria-expanded={chatOpen}
              onClick={() => setChatOpen((visible) => !visible)}
            >
              <MessageCircle />
            </Button>
          </div>
        </header>

        {showDataInfo && (
          <aside className="absolute right-3 top-20 z-40 w-[min(360px,calc(100%-1.5rem))] rounded-2xl border bg-card/95 p-4 text-xs leading-5 text-muted-foreground shadow-lg backdrop-blur sm:right-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-foreground">Thông tin dữ liệu</h2>
              <button className="rounded-md px-2 py-1 hover:bg-muted" onClick={() => setShowDataInfo(false)}>Đóng</button>
            </div>
            Hành trình hiện tại được lưu trong tài khoản CareFlow. Môi trường này chưa kết nối trực tiếp với hồ sơ hoặc hệ thống vận hành của bệnh viện.
          </aside>
        )}

        {inbox && (
          <aside aria-label="Thông báo hành trình" className="absolute right-3 top-20 z-40 max-h-[60vh] w-[min(380px,calc(100%-1.5rem))] overflow-y-auto rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur sm:right-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Thông báo gần đây</h2>
              <button className="rounded-md px-2 py-1 text-xs hover:bg-muted" onClick={() => setInbox(false)}>Đóng</button>
            </div>
            {!notices.length && <p className="text-sm text-muted-foreground">Chưa có thông báo.</p>}
            {notices.map((notice) => (
              <div key={notice.id} className="flex justify-between gap-3 border-t py-3 first:border-t-0">
                <div>
                  <p className={`text-sm ${notice.read ? "text-muted-foreground" : "font-medium"}`}>{notice.text}</p>
                  <time className="text-[11px] text-muted-foreground">{new Date(notice.createdAt).toLocaleString("vi-VN")}</time>
                </div>
                {!notice.read && (
                  <Button size="icon" variant="ghost" aria-label="Đánh dấu đã đọc" disabled={disabled} onClick={() => send("actions", { type: "READ_NOTICE", noticeId: notice.id })}>
                    <Check />
                  </Button>
                )}
              </div>
            ))}
          </aside>
        )}

        {showSupport && (
          <aside className="absolute right-3 top-20 z-40 w-[min(380px,calc(100%-1.5rem))] rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur sm:right-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Yêu cầu hỗ trợ</h2>
              <button className="rounded-md px-2 py-1 text-xs hover:bg-muted" onClick={() => setShowSupport(false)}>Đóng</button>
            </div>
            <p className="my-3 text-sm leading-6 text-muted-foreground">Ca sẽ được tạm giữ và chuyển yêu cầu tới quầy tiếp nhận.</p>
            <Button
              className="w-full"
              disabled={disabled || a.status === "ON_HOLD"}
              onClick={async () => {
                if (await send("actions", { type: "SUPPORT" })) setShowSupport(false);
              }}
            >
              Xác nhận yêu cầu hỗ trợ
            </Button>
          </aside>
        )}

        {chatOpen && (
          <section aria-label="Chat với CareFlow" className="absolute bottom-3 left-3 top-20 z-30 flex w-[min(330px,calc(100%-1.5rem))] flex-col overflow-hidden rounded-2xl border bg-card/95 shadow-xl backdrop-blur sm:bottom-4 sm:left-4 sm:w-[330px]">
            <div className="flex items-center justify-between gap-3 border-b px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Sparkles className="size-4" /></span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold">Trợ lý hành trình</h2>
                  <p role="status" aria-live="polite" className="truncate text-[11px] text-muted-foreground">{stageText}</p>
                </div>
              </div>
              <button className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted" onClick={() => setChatOpen(false)}>Thu gọn</button>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3" role="log" aria-label="Hội thoại">
              {hasOlder && (
                <Button className="w-full" variant="ghost" disabled={historyBusy} onClick={() => void loadOlder()}>
                  {historyBusy ? "Đang tải…" : "Tải hội thoại trước"}
                </Button>
              )}
              {messages.map((message) => (
                <article key={message.id} className={`max-w-[94%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2.5 text-sm leading-5 ${message.role === "user" ? "ml-auto rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted/80"}`}>
                  <span className="sr-only">{message.role === "user" ? "Bạn: " : "CareFlow: "}</span>
                  {message.text}
                </article>
              ))}
              {working && <p className="text-xs text-primary" role="status">Đang kiểm tra nhu cầu…</p>}
              <div ref={chatEnd} />
            </div>
            <form onSubmit={submit} className="relative border-t p-3">
              <label htmlFor="patient-message-flow" className="sr-only">Tin nhắn cho CareFlow</label>
              <Textarea
                id="patient-message-flow"
                placeholder="Nhắn cho trợ lý…"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={4000}
                className="min-h-16 resize-none pr-12 text-sm"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    if (!disabled) void submit();
                  }
                }}
              />
              <Button type="submit" size="icon" aria-label="Gửi tin nhắn" className="absolute bottom-5 right-5" disabled={disabled || !input.trim()}><Send /></Button>
            </form>
          </section>
        )}

        {!chatOpen && (
          <Button className="absolute bottom-4 left-4 z-30 rounded-full shadow-lg" onClick={() => setChatOpen(true)}>
            <MessageCircle /> Mở trò chuyện
          </Button>
        )}

        {(!online || stale || a.onHoldReason) && (
          <div role="alert" className="absolute bottom-4 left-1/2 z-30 w-[min(560px,calc(100%-2rem))] -translate-x-1/2 rounded-xl border bg-card/95 px-4 py-3 text-sm shadow-lg backdrop-blur">
            {a.onHoldReason || (!online ? "Đang ngoại tuyến. Kết nối mạng để tiếp tục." : "Thông tin phòng đang chờ cập nhật mới.")}
          </div>
        )}

        {a.proposal && (
          <section aria-label="Đề xuất đổi lộ trình" className="absolute bottom-4 left-1/2 z-30 w-[min(560px,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-xl backdrop-blur">
            <h2 className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-primary" /> Có lộ trình phù hợp hơn</h2>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">{a.proposal.reason}</p>
            <p className="mt-2 truncate text-xs">Đề xuất: {a.proposal.order.filter((id) => !["COMPLETED", "SKIPPED"].includes(a.steps[id].status)).map((id) => workflow.steps.find((step) => step.id === id)?.name).filter(Boolean).join(" → ")}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" disabled={disabled || stale} onClick={() => send("actions", { type: "ACCEPT_PROPOSAL", proposalId: a.proposal!.id })}>Đồng ý đổi</Button>
              <Button size="sm" variant="outline" disabled={disabled} onClick={() => send("actions", { type: "REJECT_PROPOSAL", proposalId: a.proposal!.id })}>Giữ lộ trình</Button>
            </div>
          </section>
        )}

        {!a.simulationRun && !a.onHoldReason && a.status !== "COMPLETED" && (
          <div className="absolute right-4 top-20 z-30 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-xl border bg-card/95 p-2 shadow-lg backdrop-blur">
            {a.status === "PLANNED" && <Button size="sm" disabled={disabled} onClick={() => send("actions", { type: "CHECKIN" })}>Tôi đã đến · Check-in <ArrowRight /></Button>}
            {a.status === "ACTIVE" && next?.status === "AVAILABLE" && <Button size="sm" disabled={disabled || stale || !!a.proposal || roomUnavailable} onClick={() => send("actions", { type: "ARRIVE", stepId: next.id })}>Tôi đã đến phòng <ArrowRight /></Button>}
            {a.status === "ACTIVE" && <Button size="sm" variant="ghost" disabled={disabled} onClick={() => send("actions", { type: "REASSESS" })}>Kiểm tra lộ trình</Button>}
          </div>
        )}
      </main>
    );
  }
  return (
    <div className="mx-auto max-w-[1600px] space-y-5 py-3">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link
            aria-label="Về danh sách ca khám"
            href="/patient/dashboard"
            className="rounded-xl border bg-card p-2"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <Link
              href="/patient/dashboard"
              className="text-primary font-semibold flex items-center gap-1.5 text-sm"
            >
              <HeartPulse className="size-4" />
              CareFlow
            </Link>
            <h1 className="text-xl font-semibold mt-1">{a.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {auth.profile?.name}
          </span>
          <span className="text-xs rounded-full bg-secondary text-secondary-foreground px-3 py-1.5">
            {statusText}
          </span>
          <Button
            variant="outline"
            onClick={() => setInbox(!inbox)}
            aria-expanded={inbox}
          >
            <Bell />
            Thông báo ({notices.filter((n) => !n.read).length})
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSupport(!showSupport)}
          >
            <LifeBuoy />
            Hỗ trợ
          </Button>
        </div>
      </header>
      <div className="flex justify-between flex-wrap gap-2 text-xs text-muted-foreground">
        <button
          type="button"
          className="rounded-md px-2 py-1 hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
          aria-expanded={showDataInfo}
          onClick={() => setShowDataInfo((visible) => !visible)}
        >
          {showDataInfo ? "Ẩn thông tin dữ liệu" : "Thông tin dữ liệu"}
        </button>
        <span className="flex items-center gap-1">
          {!online ? (
            <>
              <WifiOff className="size-3" /> Ngoại tuyến
            </>
          ) : cached ? (
            "Đang đồng bộ với máy chủ…"
          ) : (
            "Đã đồng bộ"
          )}
        </span>
      </div>
      {showDataInfo && (
        <div className="rounded-xl border bg-card p-3 text-xs leading-5 text-muted-foreground">
          Hành trình hiện tại được lưu trong tài khoản CareFlow. Môi trường này
          chưa kết nối trực tiếp với hồ sơ hoặc hệ thống vận hành của bệnh viện.
        </div>
      )}
      {(!online || stale) && (
        <div role="status" className="rounded-xl border bg-card p-3 text-sm">
          {!online
            ? "Bạn đang xem dữ liệu đã tải. Kết nối mạng để tiếp tục; nội dung đang nhập được giữ trên trang."
            : "Thông tin phòng đã quá 5 phút chưa cập nhật. CareFlow đang chờ dữ liệu mới trước khi điều chỉnh lộ trình."}
        </div>
      )}
      {showSupport && (
        <section className="rounded-xl border bg-card p-4 space-y-3">
          <h2 className="font-semibold">Yêu cầu hỗ trợ</h2>
          <p className="text-sm text-muted-foreground">
            Hành trình sẽ được tạm giữ và lưu yêu cầu. Nếu bạn đang cần hỗ trợ
            trực tiếp, hãy liên hệ quầy tiếp nhận.
          </p>
          <div className="flex gap-2">
            <Button
              disabled={disabled || a.status === "ON_HOLD"}
              onClick={async () => {
                if (await send("actions", { type: "SUPPORT" }))
                  setShowSupport(false);
              }}
            >
              Xác nhận yêu cầu hỗ trợ
            </Button>
            <Button variant="ghost" onClick={() => setShowSupport(false)}>
              Đóng
            </Button>
          </div>
        </section>
      )}
      {a.onHoldReason && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 p-4 bg-card"
        >
          <h2 className="font-semibold mb-1">Hành trình đang tạm giữ</h2>
          <p className="text-sm">{a.onHoldReason}</p>
          <Link
            href="/patient/dashboard"
            className="text-primary underline text-sm mt-2 inline-block"
          >
            Về trang tổng quan
          </Link>
        </div>
      )}
      {inbox && (
        <section
          aria-label="Thông báo hành trình"
          className="rounded-xl border bg-card p-4 max-h-72 overflow-y-auto"
        >
          <h2 className="font-semibold mb-3">Thông báo gần đây</h2>
          {!notices.length && (
            <p className="text-sm text-muted-foreground">Chưa có thông báo.</p>
          )}
          {notices.map((n) => (
            <div
              key={n.id}
              className="py-3 border-t flex justify-between gap-4"
            >
              <div>
                <p
                  className={`text-sm ${
                    n.read ? "text-muted-foreground" : "font-medium"
                  }`}
                >
                  {n.text}
                </p>
                <time className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString("vi-VN")}
                </time>
              </div>
              {!n.read && (
                <Button
                  aria-label="Đánh dấu đã đọc"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() =>
                    send("actions", { type: "READ_NOTICE", noticeId: n.id })
                  }
                >
                  <Check />
                </Button>
              )}
            </div>
          ))}
        </section>
      )}
      <div
        className="lg:hidden flex gap-2"
        role="tablist"
        aria-label="Khu vực hành trình"
      >
        <Button
          role="tab"
          aria-selected={mobileTab === "chat"}
          variant={mobileTab === "chat" ? "default" : "outline"}
          onClick={() => setMobileTab("chat")}
        >
          <MessageCircle />
          Trò chuyện
        </Button>
        <Button
          role="tab"
          aria-selected={mobileTab === "journey"}
          variant={mobileTab === "journey" ? "default" : "outline"}
          onClick={() => setMobileTab("journey")}
        >
          <Network />
          Hành trình
        </Button>
      </div>
      <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)] gap-5 items-start">
        <section
          aria-label="Chat với CareFlow"
          className={`${
            mobileTab === "chat" ? "flex" : "hidden"
          } lg:flex lg:sticky lg:top-3 flex-col rounded-2xl border bg-card min-w-0 overflow-hidden`}
        >
          <div className="border-b p-4 flex gap-3 items-center">
            <div className="rounded-xl bg-secondary p-2 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Trợ lý hành trình</h2>
              <p
                role="status"
                aria-live="polite"
                className="text-xs text-muted-foreground mt-1"
              >
                {stageText}
              </p>
            </div>
          </div>
          <div
            className="h-[280px] lg:h-[320px] overflow-y-auto p-4 space-y-4"
            role="log"
            aria-label="Hội thoại"
          >
            <p className="text-center text-[11px] text-muted-foreground">
              Hôm nay
            </p>
            {hasOlder && (
              <Button
                variant="ghost"
                disabled={historyBusy}
                onClick={() => void loadOlder()}
              >
                {historyBusy ? "Đang tải…" : "Tải hội thoại trước"}
              </Button>
            )}
            {messages.map((m) => (
              <article
                key={m.id}
                className={`max-w-[94%] rounded-2xl px-3.5 py-3 text-sm leading-6 whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted/70"
                }`}
              >
                <span className="sr-only">
                  {m.role === "user" ? "Bạn: " : "CareFlow: "}
                </span>
                {m.text}
              </article>
            ))}
            {working && (
              <p className="text-sm text-primary" role="status">
                Đang kiểm tra nhu cầu…
              </p>
            )}
            <div ref={chatEnd} />
          </div>
          <div className="p-4 border-t space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                "Tôi muốn khám mới nha khoa",
                "Tôi muốn tái khám nha khoa",
                "Tôi muốn kiểm tra răng định kỳ",
              ].map((text) => (
                <button
                  key={text}
                  className="rounded-full border px-2.5 py-1.5 text-xs text-primary hover:bg-secondary"
                  onClick={() => setInput(text)}
                >
                  {text.replace("Tôi muốn ", "")}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="relative">
              <label htmlFor="patient-message" className="sr-only">
                Tin nhắn cho CareFlow
              </label>
              <Textarea
                id="patient-message"
                placeholder="Mô tả nhu cầu, tình trạng của bạn…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={4000}
                className="min-h-20 pr-12 resize-y"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    if (!disabled) void submit();
                  }
                }}
              />
              <Button
                type="submit"
                aria-label="Gửi tin nhắn"
                className="absolute right-2 bottom-2"
                size="icon"
                disabled={disabled || !input.trim()}
              >
                <Send />
              </Button>
            </form>
            <p className="text-[11px] text-muted-foreground">
              Enter gửi · Shift + Enter xuống dòng
            </p>
          </div>

          {a.draftIntake && (
            <section className="m-4 mt-0 p-4 rounded-xl border border-primary/30 bg-secondary/40">
              <h3 className="text-sm font-semibold">Kiểm tra thông tin</h3>
              <p className="text-sm my-3 leading-6 whitespace-pre-wrap max-h-60 overflow-auto">
                {a.draftIntake.summary}
              </p>
              <Button
                disabled={disabled || a.status !== "PLANNED"}
                className="w-full"
                onClick={() => send("actions", { type: "CONFIRM_INTAKE" })}
              >
                Xác nhận & lập hành trình
              </Button>
              <p className="text-xs mt-2 text-muted-foreground">
                Chưa đúng? Hãy sửa thông tin qua chat hoặc biểu mẫu.
              </p>
            </section>
          )}
          {a.intakeContext && a.status === "PLANNED" && (
            <DentalIntakeForm appointment={a} send={send} disabled={disabled} />
          )}
          {!a.intakeContext && a.status === "PLANNED" && (
            <details className="border-t p-4">
              <summary className="text-sm text-primary cursor-pointer">
                Chọn quy trình trực tiếp / khi trợ lý chưa sẵn sàng
              </summary>
              <form
                className="mt-3 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send("actions", {
                    type: "CHOOSE_TEMPLATE",
                    workflowId: template,
                    summary,
                  });
                }}
              >
                <label className="text-xs block space-y-1">
                  <span>Quy trình khám</span>
                  <select
                    className="w-full border border-input rounded-lg bg-card p-2 text-sm"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    <option value="dental">Khám mới · Nha khoa</option>
                    <option value="followup">Tái khám</option>
                    <option value="checkup">Kiểm tra định kỳ</option>
                  </select>
                </label>
                <label className="text-xs block space-y-1">
                  <span>Nhu cầu khám / thông tin tái khám</span>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    minLength={3}
                    maxLength={3000}
                    required
                  />
                </label>
                <Button type="submit" variant="outline" disabled={disabled}>
                  Tạo bản tóm tắt để xác nhận
                </Button>
              </form>
            </details>
          )}
        </section>
        <section
          aria-label="Hành trình khám"
          className={`${
            mobileTab === "journey" ? "block" : "hidden"
          } lg:block min-w-0 space-y-4`}
        >
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="text-xs text-primary uppercase tracking-wider">
                  Việc cần làm tiếp theo
                </p>
                <h2 className="mt-2 font-semibold text-lg">
                  {a.onHoldReason
                    ? "Liên hệ quầy tiếp nhận"
                    : a.status === "COMPLETED"
                    ? "Hành trình đã hoàn tất"
                    : definition?.name ?? "Chia sẻ nhu cầu khám của bạn"}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-primary font-semibold">
                  {completed}/{requiredSteps.length}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  bước hoàn tất
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-6">
              {a.onHoldReason
                ? "Ca được tạm giữ để hỗ trợ. Bạn có thể xem lại thông tin đã lưu."
                : next?.resultPending
                ? "Dịch vụ đã thực hiện, đang chờ kết quả để mở bước tiếp theo."
                : next?.ticket === "CALLED"
                ? "Đã đến lượt bạn. Vui lòng đến phòng đang hiển thị."
                : next?.status === "LOCKED"
                ? "Bước này đang chờ hoàn tất điều kiện hoặc xác nhận chỉ định. CareFlow sẽ tự cập nhật khi có thông tin mới."
                : definition?.instruction ??
                  "Chọn loại khám, nhập tình trạng và xác nhận thông tin. CareFlow sẽ lập hành trình phù hợp."}
            </p>
            {room && (
              <p className="mt-3 text-sm">
                <strong>{room.name}</strong> · {room.floor} ·{" "}
                {roomLabels[room.status]}
                {room.doctorName ? ` · ${doctorLabels[room.doctorStatus]}` : ""}
              </p>
            )}
            {roomUnavailable && !a.onHoldReason && (
              <p role="status" className="text-sm text-destructive mt-3">
                Phòng hoặc nhân sự chưa sẵn sàng. Hãy xem đề xuất thay thế; nếu
                chưa có phương án, bạn có thể chờ hoặc yêu cầu hỗ trợ.
              </p>
            )}
            <div
              className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Tiến độ hành trình"
              aria-valuenow={completed}
              aria-valuemin={0}
              aria-valuemax={requiredSteps.length || 1}
            >
              <div
                className="h-full bg-primary"
                style={{
                  width: `${
                    requiredSteps.length
                      ? (completed / requiredSteps.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            {!a.simulationRun &&
              !a.onHoldReason &&
              a.workflow &&
              a.status === "PLANNED" && (
                <Button
                  className="mt-4 h-10"
                  disabled={disabled}
                  onClick={() => send("actions", { type: "CHECKIN" })}
                >
                  Tôi đã đến · Check-in <ArrowRight />
                </Button>
              )}
            {!a.simulationRun &&
              !a.onHoldReason &&
              a.status === "ACTIVE" &&
              next?.status === "AVAILABLE" && (
                <Button
                  className="mt-4 h-10"
                  disabled={
                    disabled || stale || !!a.proposal || roomUnavailable
                  }
                  onClick={() =>
                    send("actions", { type: "ARRIVE", stepId: next.id })
                  }
                >
                  Tôi đã đến phòng này <ArrowRight />
                </Button>
              )}
            {!a.onHoldReason && a.status === "ACTIVE" && (
              <Button
                variant="ghost"
                className="mt-4 ml-1"
                disabled={disabled}
                onClick={() => send("actions", { type: "REASSESS" })}
              >
                Kiểm tra lộ trình
              </Button>
            )}
            {next && (
              <p className="mt-4 text-sm font-medium" role="status">
                {stepPresentation(a, next.id).status} ·{" "}
                {stepPresentation(a, next.id).reason}
              </p>
            )}
            {a.workflow && (
              <details className="mt-4 rounded-xl border bg-card p-3 text-sm">
                <summary className="cursor-pointer font-medium">
                  Hành trình này hoạt động như thế nào?
                </summary>
                <ol className="mt-3 list-decimal pl-5 space-y-2 text-muted-foreground">
                  <li>Xác nhận nhu cầu, sau đó check-in khi bạn đã đến.</li>
                  <li>Ở mỗi bước, xác nhận khi bạn đã đến đúng phòng.</li>
                  <li>
                    CareFlow tự theo dõi các hoạt động nghiệp vụ và cập nhật
                    bước tiếp theo cho bạn.
                  </li>
                </ol>
              </details>
            )}
          </div>
          {a.proposal && (
            <section
              className="rounded-2xl border border-primary/40 bg-secondary/60 p-5"
              aria-label="Đề xuất đổi lộ trình"
            >
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Có lộ trình phù hợp hơn
              </h3>
              <p className="text-sm my-3 leading-6">
                {a.proposal.reason} Đề xuất được tính từ trạng thái phòng hiện có.
              </p>
              <p className="text-xs text-muted-foreground">
                Hiện tại:{" "}
                {a.order
                  .filter(
                    (id) =>
                      !["COMPLETED", "SKIPPED"].includes(a.steps[id].status)
                  )
                  .map((id) => a.workflow!.steps.find((s) => s.id === id)!.name)
                  .join(" → ")}
              </p>
              <p className="text-sm my-3">
                Đề xuất:{" "}
                {a.proposal.order
                  .filter(
                    (id) =>
                      !["COMPLETED", "SKIPPED"].includes(a.steps[id].status)
                  )
                  .map((id) => a.workflow!.steps.find((s) => s.id === id)!.name)
                  .join(" → ")}
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  disabled={disabled || stale}
                  onClick={() =>
                    send("actions", {
                      type: "ACCEPT_PROPOSAL",
                      proposalId: a.proposal!.id,
                    })
                  }
                >
                  Đồng ý đổi
                </Button>
                <Button
                  variant="outline"
                  disabled={disabled}
                  onClick={() =>
                    send("actions", {
                      type: "REJECT_PROPOSAL",
                      proposalId: a.proposal!.id,
                    })
                  }
                >
                  Giữ lộ trình
                </Button>
              </div>
            </section>
          )}
          {a.workflow ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">Hành trình của bạn</h2>
                <div className="flex gap-1">
                  <Button
                    aria-label="Xem danh sách"
                    variant={view === "list" ? "secondary" : "ghost"}
                    onClick={() => setView("list")}
                  >
                    <List />
                  </Button>
                  <Button
                    aria-label="Xem sơ đồ"
                    variant={view === "flow" ? "secondary" : "ghost"}
                    onClick={() => setView("flow")}
                  >
                    <Network />
                  </Button>
                </div>
              </div>
              <div
                className={
                  view === "list"
                    ? "hidden"
                    : view === "auto"
                    ? "hidden md:block"
                    : "block"
                }
              >
                <JourneyFlow appointment={a} sync={sync} cached={cached} />
              </div>
              <ol
                className={`${
                  view === "flow"
                    ? "hidden"
                    : view === "auto"
                    ? "md:hidden"
                    : "block"
                } space-y-3`}
              >
                {a.order.map((id, index) => {
                  const def = a.workflow!.steps.find((s) => s.id === id)!,
                    s = a.steps[id],
                    r = s.roomId ? a.rooms[s.roomId] : null;
                  return (
                    <li
                      key={id}
                      className={`rounded-xl border bg-card p-4 ${
                        next?.id === id ? "border-primary" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="text-primary font-semibold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-medium text-sm">{def.name}</h3>
                          <p className="text-xs text-primary my-1">
                            {s.resultPending
                              ? "Đang chờ kết quả"
                              : stepPresentation(a, id).status}
                          </p>
                          {r && (
                            <p className="text-xs text-muted-foreground">
                              {r.name} · {r.floor} · {roomLabels[r.status]}
                            </p>
                          )}
                          <p className="text-xs mt-2 text-muted-foreground">
                            {stepPresentation(a, id).reason}
                          </p>
                          {def.condition && (
                            <p className="text-xs mt-1">
                              Chỉ thực hiện nếu được chỉ định.
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <div className="grid place-items-center min-h-80 text-center rounded-2xl border border-dashed p-8">
              <div>
                <Network className="size-10 mx-auto text-primary/50" />
                <h3 className="mt-4 font-medium">
                  Hành trình bắt đầu từ cuộc trò chuyện
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  Sau khi bạn xác nhận nhu cầu, các bước sẽ xuất hiện tại đây
                  với phòng, trạng thái và hướng dẫn tiếp theo.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
