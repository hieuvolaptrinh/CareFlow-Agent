"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const notifications = [
    {
      id: "1",
      title: "Đã có số thứ tự xét nghiệm máu: XN-105",
      time: "09:00 (5 phút trước)",
      type: "QUEUE",
      unread: true,
      content: "Bạn đã được cấp số XN-105 tại Phòng Xét nghiệm 204. Hiện tại còn 4 lượt trước bạn (khoảng 8 phút nữa).",
      actionLabel: "Chỉ đường tới P.204",
      href: "/patient/dashboard",
    },
    {
      id: "2",
      title: "Bác sĩ vừa chỉ định 2 xét nghiệm cận lâm sàng",
      time: "08:36 (29 phút trước)",
      type: "ORDER",
      unread: true,
      content: "TS.BS Trần Thu Hà đã tạo chỉ định: Xét nghiệm sinh hóa máu và Chụp X-quang tim phổi thẳng.",
      actionLabel: "Xem lộ trình khám",
      href: "/patient/dashboard",
    },
    {
      id: "3",
      title: "Check-in thành công tại Kiosk Quầy A",
      time: "08:15 (50 phút trước)",
      type: "SYSTEM",
      unread: false,
      content: "Lịch hẹn Tim mạch lúc 08:30 đã được chuyển sang Lượt khám đang hoạt động #V-2026-0912.",
      actionLabel: "Xem chi tiết",
      href: "/patient/dashboard",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/patient/dashboard"
            className="inline-flex items-center text-xs font-semibold text-[#147D8D] hover:underline gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Về Trang tổng quan
          </Link>
          <h1 className="text-xl font-bold text-[#171A1C]">Trung Tâm Thông Báo</h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Cập nhật realtime về hàng đợi, kết quả xét nghiệm và hướng dẫn từ CareFlow
          </p>
        </div>
        <Button size="sm" variant="ghost" className="text-xs text-[#147D8D]">
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`border transition-colors ${
              n.unread ? "bg-white border-[#ABE3DF] shadow-xs" : "bg-[#F7F9FA] border-[#E8ECEE] opacity-80"
            }`}
          >
            <CardContent className="p-4 flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.unread ? "bg-[#147D8D] text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {n.type === "QUEUE" ? (
                  <Clock className="w-4 h-4" />
                ) : n.type === "ORDER" ? (
                  <Activity className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#171A1C] flex items-center gap-1.5">
                    {n.title}
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
                  </span>
                  <span className="text-[11px] text-[#667078] shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-[#667078] leading-relaxed">{n.content}</p>

                {n.actionLabel && (
                  <div className="pt-2">
                    <Link href={n.href}>
                      <Button size="sm" variant="outline" className="text-[11px] h-7 border-[#ABE3DF] text-[#147D8D] hover:bg-[#EFF9F7]">
                        {n.actionLabel}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
