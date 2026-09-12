"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { StartAgentCard } from "@/components/patient/start-agent-card";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Download,
  Eye,
  FileCheck,
  FileText,
  Heart,
  HeartPulse,
  Info,
  MapPin,
  Navigation,
  PhoneCall,
  Pill,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

function Dashboard() {
  const [activeStepId, setActiveStepId] = useState<number>(2);

  const visitTimeline = [
    {
      id: 0,
      title: "Check-in Kiosk Quầy A",
      location: "Tầng 1 - Sảnh chính",
      time: "08:15",
      status: "COMPLETED",
      doctor: "Hệ thống tự động",
      note: "Xác nhận lịch hẹn tim mạch bằng mã QR thành công.",
    },
    {
      id: 1,
      title: "Khám Lâm Sàng Tim Mạch",
      location: "Phòng 203 - Tầng 2, Tòa A",
      time: "08:35",
      status: "COMPLETED",
      doctor: "TS.BS Trần Thu Hà",
      note: "Khám tổng quát. Bác sĩ ra 2 chỉ định: Xét nghiệm máu & Chụp X-quang.",
    },
    {
      id: 2,
      title: "Xét Nghiệm Sinh Hóa Máu",
      location: "Phòng 204 - Tầng 2, Tòa A",
      time: "09:00",
      status: "IN_PROGRESS",
      doctor: "KTV. Lê Minh Tuấn",
      ticketNumber: "XN-105",
      currentServing: "XN-101",
      waitCount: 4,
      estTime: "~8 phút",
      note: "Vui lòng lấy số thứ tự và chờ gọi tên tại sảnh chờ trước phòng 204.",
    },
    {
      id: 3,
      title: "Chụp X-quang Tim Phổi Thẳng",
      location: "Phòng 205 - Tầng 2, Tòa A",
      time: "Dự kiến 09:35",
      status: "WAITING",
      doctor: "BS. Nguyễn Văn Hùng",
      note: "Thực hiện sau khi hoàn tất lấy mẫu máu.",
    },
    {
      id: 4,
      title: "Tái Khám Nhận Kết Luận",
      location: "Phòng 203 - Tầng 2, Tòa A",
      time: "Dự kiến 10:15",
      status: "LOCKED",
      doctor: "TS.BS Trần Thu Hà",
      note: "Bác sĩ đọc kết quả cận lâm sàng và kê đơn điều trị.",
    },
    {
      id: 5,
      title: "Thanh Toán & Lĩnh Thuốc",
      location: "Quầy 5 & Nhà thuốc Tầng 1",
      time: "Dự kiến 10:45",
      status: "LOCKED",
      doctor: "Dược sĩ phụ trách",
      note: "Quyết toán BHYT và nhận thuốc theo đơn tại nhà thuốc bệnh viện.",
    },
  ];

  const medicalHistory = [
    {
      title: "Tăng huyết áp vô căn (Độ 1)",
      date: "Chẩn đoán: 05/2023",
      doctor: "Khoa Tim mạch",
      badge: "Đang kiểm soát",
      desc: "Huyết áp mục tiêu < 130/80 mmHg. Đo huyết áp tại nhà 2 lần/ngày.",
    },
    {
      title: "Hen phế quản nhẹ (Dị ứng)",
      date: "Chẩn đoán: 11/2021",
      doctor: "Khoa Hô hấp",
      badge: "Ổn định",
      desc: "Tiền sử kích ứng với thời tiết lạnh và khói bụi. Dự phòng Salbutamol.",
    },
    {
      title: "Viêm dạ dày mạn tính",
      date: "Chẩn đoán: 08/2022",
      doctor: "Khoa Tiêu hóa",
      badge: "Theo dõi",
      desc: "Hạn chế đồ chua cay, tránh dùng thuốc giảm đau nhóm NSAIDs.",
    },
  ];

  const documents = [
    {
      name: "Phiếu chỉ định Xét nghiệm Máu",
      code: "ORD-LAB-20260912-01",
      date: "Hôm nay, 08:35",
      size: "1.2 MB",
      type: "Xét nghiệm",
    },
    {
      name: "Phiếu chỉ định Chụp X-quang Ngực",
      code: "ORD-RAD-20260912-02",
      date: "Hôm nay, 08:36",
      size: "2.4 MB",
      type: "Chẩn đoán hình ảnh",
    },
    {
      name: "Bản đồng thuận hướng dẫn AI CareFlow",
      code: "CONSENT-CF-89211",
      date: "12/09/2026",
      size: "680 KB",
      type: "Pháp lý",
    },
  ];

  return (
    <div className="space-y-6">
      <StartAgentCard />
      <p className="text-xs text-muted-foreground">
        Các thẻ thông tin bên dưới là dữ liệu giao diện minh họa, không phải hồ sơ hoặc tiến độ thực tế của bạn.
      </p>
      {/* Active Visit Banner */}
      <div className="bg-white rounded-2xl border border-[#ABE3DF] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#EFF9F7] via-white to-[#EFF9F7]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#147D8D] text-white flex items-center justify-center shrink-0 shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#147D8D] uppercase tracking-wider">
                Lượt khám đang hoạt động (Active Visit)
              </span>
              <Badge className="bg-[#147D8D] text-white text-[10px] h-4.5 px-2">
                Mã: V-2026-0912
              </Badge>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#171A1C] mt-0.5">
              Khám Chuyên Khoa Tim Mạch • TS.BS Trần Thu Hà
            </h2>
            <p className="text-xs text-[#667078] flex items-center gap-2 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#147D8D]" />
              Bắt đầu lúc 08:15 • Tiến độ: 2/6 bước hoàn thành
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="#start-agent-title">
            <Button
              size="sm"
              className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-9 gap-1.5 shadow-xs"
            >
              <Bot className="w-4 h-4" />
              Hỏi CareFlow AI
            </Button>
          </Link>
          <Link href="/patient/support">
            <Button
              size="sm"
              variant="outline"
              className="border-[#E8ECEE] text-xs h-9 gap-1 text-[#667078]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              Cần người thật hỗ trợ
            </Button>
          </Link>
        </div>
      </div>

      {/* 2:1 LAYOUT (Follows AGENTS.md & Evergreen Hospital reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* MAIN COLUMN (Flexible, ~8 of 12 cols = 2/3) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. PATIENT INFORMATION CARD */}
          <Card className="border-[#E8ECEE] bg-white shadow-xs">
            <CardHeader className="pb-4 border-b border-[#E8ECEE]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-[#171A1C]">
                    Thông Tin Bệnh Nhân (Patient Information)
                  </CardTitle>
                  <CardDescription className="text-xs text-[#667078]">
                    Hồ sơ định danh bệnh nhân tại Bệnh viện Đa khoa Evergreen
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-[#ABE3DF] bg-[#EFF9F7] text-[#147D8D] text-xs font-semibold"
                >
                  Mã BN: CF-89211
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-5">
              <div className="flex flex-col sm:flex-row items-start gap-5 mb-5 pb-5 border-b border-[#E8ECEE]">
                <Avatar className="w-20 h-20 border-2 border-white shadow-sm shrink-0">
                  <AvatarFallback className="bg-[#147D8D] text-white text-2xl font-bold">
                    NA
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-[#171A1C]">
                      Nguyễn Văn A
                    </h3>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                      Đang ở Bệnh viện
                    </Badge>
                  </div>
                  <p className="text-xs text-[#667078] mt-1">
                    Nam • 45 tuổi (Sinh ngày 14/06/1981) • Nhóm máu: O+
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-[#F7F9FA] rounded-md border border-[#E8ECEE] text-[#171A1C]">
                      BHYT: <strong>GD-4-79-1234567890</strong> (Đúng tuyến 80%)
                    </span>
                    <span className="px-2.5 py-1 bg-[#F7F9FA] rounded-md border border-[#E8ECEE] text-[#171A1C]">
                      Người liên hệ khẩn cấp:{" "}
                      <strong>Nguyễn Thị B (Vợ - 0988 123 456)</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Labeled Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[#667078] block">Số điện thoại</span>
                  <span className="font-semibold text-[#171A1C] mt-0.5 block">
                    +84 912 345 678
                  </span>
                </div>
                <div>
                  <span className="text-[#667078] block">Email liên hệ</span>
                  <span className="font-semibold text-[#171A1C] mt-0.5 block truncate">
                    nguyenvana@gmail.com
                  </span>
                </div>
                <div>
                  <span className="text-[#667078] block">
                    Địa chỉ thường trú
                  </span>
                  <span className="font-semibold text-[#171A1C] mt-0.5 block">
                    Q.5, TP. Hồ Chí Minh
                  </span>
                </div>
                <div>
                  <span className="text-[#667078] block">Hỗ trợ tiếp cận</span>
                  <span className="font-semibold text-emerald-600 mt-0.5 block">
                    Tự di chuyển bình thường
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. MEDICAL HISTORY */}
          <Card className="border-[#E8ECEE] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#E8ECEE]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-[#171A1C] flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#147D8D]" />
                    Tiền Sử Bệnh Lý (Medical History)
                  </CardTitle>
                  <CardDescription className="text-xs text-[#667078]">
                    Tóm tắt bệnh lý mạn tính và cảnh báo lâm sàng từ EMR
                  </CardDescription>
                </div>
                <span className="text-xs text-[#667078]">
                  Cập nhật gần nhất: 12/09/2026
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-4 divide-y divide-[#E8ECEE]">
              {medicalHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#171A1C]">
                        {item.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF]"
                      >
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#667078] leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="text-[11px] text-[#667078] flex items-center gap-3">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.doctor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 3. TODAY'S VISIT JOURNEY TIMELINE */}
          <Card className="border-[#E8ECEE] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#E8ECEE]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-[#171A1C] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#147D8D]" />
                    Tiến Trình Khám Hôm Nay (Visit Timeline)
                  </CardTitle>
                  <CardDescription className="text-xs text-[#667078]">
                    Lộ trình các bước khám được hệ thống CareFlow điều phối tự
                    động
                  </CardDescription>
                </div>
                <Badge className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] text-xs">
                  Bước 3 / 6: Xét nghiệm máu
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8ECEE]">
                {visitTimeline.map((step) => {
                  const isCurrent = step.id === activeStepId;
                  const isDone = step.status === "COMPLETED";

                  return (
                    <div
                      key={step.id}
                      onClick={() => setActiveStepId(step.id)}
                      className={`relative pl-4 transition-all cursor-pointer group`}
                    >
                      {/* Timeline Marker */}
                      <div
                        className={`absolute -left-[27px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : isCurrent
                            ? "bg-white border-[#147D8D] text-[#147D8D] shadow-xs"
                            : "bg-white border-gray-300 text-gray-300"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        ) : isCurrent ? (
                          <div className="w-2 h-2 rounded-full bg-[#147D8D] animate-ping" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        )}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`p-4 rounded-xl border transition-all ${
                          isCurrent
                            ? "bg-[#F0F8F7] border-[#147D8D] shadow-xs ring-1 ring-[#147D8D]"
                            : isDone
                            ? "bg-white border-[#E8ECEE] hover:border-gray-300"
                            : "bg-white/60 border-[#E8ECEE] opacity-70"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-bold ${
                                isCurrent ? "text-[#147D8D]" : "text-[#171A1C]"
                              }`}
                            >
                              {step.title}
                            </span>
                            {isDone && (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                                Đã xong
                              </Badge>
                            )}
                            {isCurrent && (
                              <Badge className="bg-[#147D8D] text-white text-[10px] animate-pulse">
                                Bước đang thực hiện
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-[#667078]">
                            {step.time}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#667078]">
                          <span className="flex items-center gap-1 font-medium text-[#171A1C]">
                            <MapPin className="w-3.5 h-3.5 text-[#147D8D]" />
                            {step.location}
                          </span>
                          <span>•</span>
                          <span>Phụ trách: {step.doctor}</span>
                        </div>

                        <p className="mt-2 text-xs text-[#171A1C] leading-relaxed">
                          {step.note}
                        </p>

                        {/* Interactive Queue Information for Current Step */}
                        {isCurrent && step.ticketNumber && (
                          <div className="mt-3 pt-3 border-t border-[#ABE3DF] flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border">
                            <div>
                              <div className="text-[11px] text-[#667078]">
                                Số thứ tự của bạn:
                              </div>
                              <div className="text-2xl font-black text-[#147D8D] tracking-tight">
                                {step.ticketNumber}
                              </div>
                            </div>

                            <div className="text-xs text-right">
                              <div className="text-[#667078]">
                                Đang phục vụ:{" "}
                                <strong className="text-[#171A1C]">
                                  {step.currentServing}
                                </strong>
                              </div>
                              <div className="text-emerald-600 font-bold">
                                Phía trước còn {step.waitCount} người (
                                {step.estTime})
                              </div>
                            </div>

                            <Button
                              size="sm"
                              className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-8"
                            >
                              <Navigation className="w-3.5 h-3.5 mr-1" />
                              Chỉ đường tới P.204
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 4. ORDERS & DOCUMENTS */}
          <Card className="border-[#E8ECEE] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#E8ECEE]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-[#171A1C] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#147D8D]" />
                    Chỉ Định & Tài Liệu Khám (Orders & Documents)
                  </CardTitle>
                  <CardDescription className="text-xs text-[#667078]">
                    Hồ sơ phiếu chỉ định điện tử đồng bộ từ hệ thống bệnh viện
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-[#147D8D] h-7"
                >
                  Tải tất cả (ZIP)
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-3 divide-y divide-[#E8ECEE]">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-[#147D8D] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#171A1C]">
                        {doc.name}
                      </div>
                      <p className="text-[11px] text-[#667078]">
                        Mã: {doc.code} • {doc.date} • {doc.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-[#667078] hover:text-[#171A1C]"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Xem
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs border-[#E8ECEE] text-[#147D8D] hover:bg-[#EFF9F7]"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Tải về
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ========================================================= */}
        {/* SIDE COLUMN (Medical Summary & AI Panel, ~4 of 12 cols = 1/3) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. ACTIVE QUEUE TICKET CARD */}
          <Card className="border-[#ABE3DF] bg-gradient-to-br from-[#EFF9F7] via-white to-white shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#147D8D]">
                  Phiếu Khám Thời Gian Thực
                </span>
                <Badge className="bg-[#147D8D] text-white hover:bg-[#147D8D] text-[10px]">
                  Phòng 204
                </Badge>
              </div>
              <CardTitle className="text-3xl font-black text-[#171A1C] tracking-tight mt-2">
                XN-105
              </CardTitle>
              <CardDescription className="text-xs text-[#667078]">
                Khoa Xét nghiệm Hóa sinh • Tầng 2, Tòa A
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#ABE3DF] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#667078]">Đang phục vụ số:</span>
                  <span className="font-bold text-[#171A1C]">XN-101</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667078]">Lượt chờ phía trước:</span>
                  <span className="font-bold text-emerald-600">4 người</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667078]">Ước tính chờ:</span>
                  <span className="font-semibold text-[#171A1C]">
                    ~ 8 - 10 phút
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Button className="w-full bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-9">
                  <Navigation className="w-3.5 h-3.5 mr-1.5" />
                  Chỉ đường Indoor Map tới P.204
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#E8ECEE] text-xs h-8 text-[#667078]"
                >
                  <QrCode className="w-3.5 h-3.5 mr-1.5" />
                  Mở mã QR Check-in
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 2. CAREFLOW AI ASSISTANT PANEL */}
          <Card className="border-[#E8ECEE] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#E8ECEE]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#147D8D] text-white flex items-center justify-center shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-bold text-[#171A1C]">
                      Điều Phối Viên CareFlow AI
                    </CardTitle>
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Đồng bộ theo thời gian thực
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-[#ABE3DF] text-[#147D8D] text-[10px]"
                >
                  Active
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="bg-[#EFF9F7] p-3 rounded-xl border border-[#ABE3DF] text-[#171A1C] space-y-2">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#147D8D]">
                  <Sparkles className="w-3 h-3" />
                  Chỉ dẫn tự động cho bạn:
                </div>
                <p className="text-xs leading-relaxed text-[#171A1C]">
                  Bác sĩ Hà đã chỉ định 2 xét nghiệm. Bước ưu tiên hiện tại là{" "}
                  <strong>Lấy mẫu máu tại Phòng 204</strong> (Tầng 2, rẽ phải
                  sau thang máy).
                </p>
                <p className="text-[11px] text-[#667078]">
                  Sau khi lấy máu xong, CareFlow sẽ tự động báo bạn di chuyển
                  tiếp sang Phòng 205 để chụp X-quang.
                </p>
              </div>

              {/* Quick Action Chips */}
              <div className="space-y-1.5">
                <button className="w-full text-left p-2 bg-[#F7F9FA] hover:bg-[#F0F8F7] border border-[#E8ECEE] hover:border-[#ABE3DF] rounded-lg text-xs font-medium text-[#147D8D] transition-colors flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Chỉ đường theo thang máy
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button className="w-full text-left p-2 bg-[#F7F9FA] hover:bg-[#F0F8F7] border border-[#E8ECEE] hover:border-[#ABE3DF] rounded-lg text-xs font-medium text-[#147D8D] transition-colors flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Báo khi còn 2 lượt nữa tới tôi
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <Link href="/patient/careflow" className="block">
                  <Button
                    variant="outline"
                    className="w-full text-xs h-8 border-[#147D8D] text-[#147D8D] hover:bg-[#EFF9F7]"
                  >
                    Mở khung chat đầy đủ với AI
                  </Button>
                </Link>
              </div>

              <div className="text-[10px] text-[#667078] text-center pt-2 border-t border-[#E8ECEE]">
                Tuân thủ quy trình SOP Bệnh viện • Không chẩn đoán bệnh
              </div>
            </CardContent>
          </Card>

          {/* 3. MEDICAL SUMMARY & VITALS (Inspired by Evergreen Heart Rate Card) */}
          <Card className="border-[#E8ECEE] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-[#171A1C] uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  Sinh Hiệu Hiện Tại (Vital Signs)
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-[10px] border-[#E8ECEE] text-[#667078]"
                >
                  Đo lúc 08:35
                </Badge>
              </div>
              <CardDescription className="text-xs text-[#667078]">
                Được ghi nhận tại phòng khám của TS.BS Trần Thu Hà
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {/* Prominent Heart Rate Measurement */}
              <div className="p-3.5 rounded-xl bg-[#F7F9FA] border border-[#E8ECEE] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#667078] block">
                    Nhịp tim (Heart Rate)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-[#171A1C]">
                      78
                    </span>
                    <span className="text-xs text-[#667078]">bpm</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Nhịp xoang đều, ổn định
                  </span>
                </div>

                {/* Min / Max Stats */}
                <div className="text-right text-xs space-y-1 border-l border-[#E8ECEE] pl-4">
                  <div>
                    <span className="text-[#667078]">Thấp nhất:</span>{" "}
                    <strong className="text-[#171A1C]">62 bpm</strong>
                  </div>
                  <div>
                    <span className="text-[#667078]">Cao nhất:</span>{" "}
                    <strong className="text-[#171A1C]">89 bpm</strong>
                  </div>
                </div>
              </div>

              {/* Blood Pressure & Oxygen */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F7F9FA] border border-[#E8ECEE]">
                  <span className="text-[11px] text-[#667078] block">
                    Huyết áp
                  </span>
                  <strong className="text-base text-[#171A1C] block mt-0.5">
                    120 / 80
                  </strong>
                  <span className="text-[10px] text-emerald-600">
                    Mức chuẩn
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F9FA] border border-[#E8ECEE]">
                  <span className="text-[11px] text-[#667078] block">
                    SpO2 (Khí máu)
                  </span>
                  <strong className="text-base text-[#171A1C] block mt-0.5">
                    98 %
                  </strong>
                  <span className="text-[10px] text-emerald-600">
                    Bình thường
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
