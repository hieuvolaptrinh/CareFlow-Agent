"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  HeartPulse,
  MapPin,
  Navigation,
  PhoneCall,
  QrCode,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VisitDetailPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/patient/dashboard"
            className="inline-flex items-center text-xs font-semibold text-[#147D8D] hover:underline gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Về Trang tổng quan
          </Link>
          <h1 className="text-xl font-bold text-[#171A1C]">Chi Tiết Lượt Khám #V-2026-0912</h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Bệnh nhân: Nguyễn Văn A (CF-89211) • Khám Tim Mạch • Bắt đầu 08:15
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/patient/careflow">
            <Button size="sm" className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-9 gap-1">
              <Bot className="w-4 h-4" />
              Hỏi CareFlow
            </Button>
          </Link>
          <Link href="/patient/support">
            <Button size="sm" variant="outline" className="text-xs h-9 border-[#E8ECEE] text-[#667078]">
              <PhoneCall className="w-4 h-4 text-red-500 mr-1" />
              Hỗ trợ
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-[#E8ECEE] bg-white shadow-xs p-5">
          <span className="text-xs text-[#667078]">Trạng thái lượt khám</span>
          <div className="text-lg font-bold text-[#147D8D] mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            ĐANG KHÁM
          </div>
          <p className="text-xs text-[#667078] mt-1">Đang chờ tại Phòng Xét nghiệm 204</p>
        </Card>

        <Card className="border-[#E8ECEE] bg-white shadow-xs p-5">
          <span className="text-xs text-[#667078]">Bác sĩ phụ trách</span>
          <div className="text-lg font-bold text-[#171A1C] mt-1">TS.BS Trần Thu Hà</div>
          <p className="text-xs text-[#667078] mt-1">Phòng 203 - Khoa Tim Mạch</p>
        </Card>

        <Card className="border-[#E8ECEE] bg-white shadow-xs p-5">
          <span className="text-xs text-[#667078]">Tiến trình các bước</span>
          <div className="text-lg font-bold text-[#171A1C] mt-1">2 / 6 Bước</div>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Đã hoàn thành 33% quy trình</p>
        </Card>
      </div>

      {/* Re-route link to dashboard */}
      <Card className="border-[#ABE3DF] bg-[#EFF9F7] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#147D8D]">Cần xem timeline trực quan từng bước?</h3>
          <p className="text-xs text-[#667078] mt-0.5">
            Trang tổng quan cung cấp giao diện tương tác chi tiết theo đúng thiết kế chuẩn của Evergreen Hospital.
          </p>
        </div>
        <Link href="/patient/dashboard">
          <Button className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-9">
            Mở Bảng Điều Khiển
          </Button>
        </Link>
      </Card>
    </div>
  );
}
