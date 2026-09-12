"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarCheck2,
  Check,
  CircleHelp,
  ClipboardCheck,
  History,
  MessageCircleMore,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ToothbrushSparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { StartAgentCard } from "@/components/patient/start-agent-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dentalServices = [
  {
    title: "Đau hoặc ê răng",
    description: "Mô tả vị trí và cảm giác khó chịu để CareFlow chọn hành trình phù hợp.",
    icon: Zap,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Khám răng và nướu",
    description: "Ghi nhận nhu cầu kiểm tra nướu, chảy máu hoặc vệ sinh răng miệng.",
    icon: ShieldCheck,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Tái khám nha khoa",
    description: "Tiếp tục hành trình sau lần khám hoặc xử lý nha khoa trước đó.",
    icon: History,
    tone: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Kiểm tra định kỳ",
    description: "Bắt đầu luồng kiểm tra răng định kỳ khi hiện tại không có khó chịu.",
    icon: CalendarCheck2,
    tone: "bg-rose-50 text-rose-700",
  },
];

const journeySteps = [
  {
    title: "Chia sẻ nhu cầu",
    description: "Nói ngắn tình trạng của bạn. AI chỉ hỏi thêm tối đa vài ý cần thiết.",
    icon: MessageCircleMore,
  },
  {
    title: "Kiểm tra và xác nhận",
    description: "Bạn xem lại lời khai trước khi CareFlow tạo hành trình nha khoa.",
    icon: ClipboardCheck,
  },
  {
    title: "Theo dõi từng bước",
    description: "CareFlow cập nhật phòng, trạng thái và việc bạn cần làm tiếp theo.",
    icon: Sparkles,
  },
];

function Dashboard() {
  const { profile } = useAuth();
  const firstName = profile?.name?.trim().split(/\s+/).at(-1);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-[#DCEDEA] bg-white p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-[#E6F7F3] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-32 size-48 rounded-full bg-[#EEF7FA] blur-2xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#147D8D] text-white">
              <ToothbrushSparkles className="size-6" aria-hidden="true" />
            </div>
            <div>
              <Badge className="mb-2 border-0 bg-[#F0F8F7] text-[#147D8D] hover:bg-[#F0F8F7]">
                CareFlow Dental
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight text-[#171A1C]">
                {firstName ? `Chào ${firstName},` : "Xin chào,"} bạn cần hỗ trợ gì về răng hôm nay?
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667078]">
                Bắt đầu bằng một mô tả ngắn. CareFlow sẽ ghi nhận lời khai, hỏi những ý cần thiết và hướng dẫn hành trình nha khoa từng bước.
              </p>
            </div>
          </div>
          <Link
            href="#start-agent-title"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#147D8D] px-3 text-sm font-medium text-white transition-colors hover:bg-[#106b79] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#147D8D]/30"
          >
            Bắt đầu cùng AI <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <StartAgentCard />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <Card className="border-[#E8ECEE] bg-white shadow-none">
            <CardHeader className="border-b border-[#E8ECEE]">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#147D8D]">Nhu cầu nha khoa</p>
                  <CardTitle className="mt-1 text-lg">CareFlow có thể hỗ trợ</CardTitle>
                </div>
                <span className="text-xs text-[#667078]">Chọn bằng cách mô tả trong cuộc trò chuyện</span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 pt-5 sm:grid-cols-2">
              {dentalServices.map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className="rounded-xl border border-[#E8ECEE] p-4">
                    <div className={`mb-3 flex size-9 items-center justify-center rounded-xl ${service.tone}`}>
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <h2 className="text-sm font-semibold text-[#171A1C]">{service.title}</h2>
                    <p className="mt-1.5 text-xs leading-5 text-[#667078]">{service.description}</p>
                  </article>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-[#E8ECEE] bg-white shadow-none">
            <CardHeader className="border-b border-[#E8ECEE]">
              <p className="text-xs font-medium uppercase tracking-wider text-[#147D8D]">Quy trình đơn giản</p>
              <CardTitle className="mt-1 text-lg">Hành trình nha khoa của bạn</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-5 md:grid-cols-3">
              {journeySteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="relative rounded-xl bg-[#F7F9FA] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-white text-[#147D8D] ring-1 ring-[#E8ECEE]">
                        <Icon className="size-4" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-semibold text-[#9AA3A8]">0{index + 1}</span>
                    </div>
                    <h2 className="text-sm font-semibold">{step.title}</h2>
                    <p className="mt-1.5 text-xs leading-5 text-[#667078]">{step.description}</p>
                  </article>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="border-[#ABE3DF] bg-gradient-to-br from-[#EFF9F7] to-white shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CircleHelp className="size-4 text-[#147D8D]" aria-hidden="true" />
                Chuẩn bị trước khi bắt đầu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-[#667078]">
                {["Nhu cầu hoặc vị trí đang khó chịu", "Thông tin lần khám nha khoa trước nếu có", "Thuốc đang dùng và dị ứng bạn đã biết"].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-[#147D8D] ring-1 ring-[#ABE3DF]">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-5 text-[#667078]">Không nhớ hoặc không muốn cung cấp một mục? Bạn có thể nói rõ với CareFlow.</p>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-[#FCF5F8] shadow-none">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-semibold text-[#171A1C]">Khi cần hỗ trợ trực tiếp</h2>
                  <p className="mt-1.5 text-xs leading-5 text-[#667078]">Nếu đang khó thở, khó nuốt, sưng lan nhanh vùng mặt hoặc cổ, hay chảy máu nhiều không cầm, hãy tìm hỗ trợ y tế trực tiếp ngay.</p>
                  <Link href="/patient/support" className="mt-3 inline-flex h-8 items-center justify-center rounded-lg border border-rose-200 bg-white px-3 text-xs font-medium text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-rose-200">
                    Mở trang hỗ trợ
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E8ECEE] bg-white shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Truy cập nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/patient/profile" className="flex h-9 w-full items-center justify-between rounded-lg px-2.5 text-sm font-medium text-[#667078] hover:bg-[#F0F8F7] hover:text-[#147D8D] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#147D8D]/20">
                <span className="flex items-center gap-2"><UserRound className="size-4" />Hồ sơ của tôi</span><ArrowRight className="size-4" />
              </Link>
              <Link href="/patient/notifications" className="flex h-9 w-full items-center justify-between rounded-lg px-2.5 text-sm font-medium text-[#667078] hover:bg-[#F0F8F7] hover:text-[#147D8D] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#147D8D]/20">
                <span className="flex items-center gap-2"><Bell className="size-4" />Thông báo</span><ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
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
