"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  HeartPulse,
  HelpCircle,
  LogOut,
  Pill,
  Play,
  Plus,
  QrCode,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  TestTube2,
  UserCheck,
  Users,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StaffDashboardPage() {
  const [examStatus, setExamStatus] = useState<"examining" | "idle">("examining");

  // Current Patient inside room
  const currentPatient = {
    stt: 14,
    visitId: "V-2026-0912",
    code: "BN-2026-081",
    name: "Nguyễn Văn An",
    gender: "Nam",
    age: 52,
    insurance: "BHYT: GD-4-79-12-8931289",
    reason: "Đau tức thượng vị âm ỉ liên tục 3 ngày, kèm ợ chua và đầy bụng sau khi ăn.",
    vitals: {
      bloodPressure: "125/80 mmHg",
      heartRate: "76 bpm",
      spo2: "98%",
      temp: "36.8 °C",
      weight: "65 kg",
      bmi: "22.4",
    },
    history: "Viêm dạ dày tá tràng mạn tính (2024), Không tiền sử dị ứng thuốc.",
    aiSuggestion: "Đề xuất: Chỉ định Nội soi Dạ dày - Tá tràng không đau & Xét nghiệm tìm Vi khuẩn HP qua hơi thở.",
  };

  // Waiting list in queue for PK 101
  const queuePatients = [
    { stt: 15, name: "Trần Thị Lan", age: 48, gender: "Nữ", waitTime: "8 phút", status: "next", badge: "Kế tiếp" },
    { stt: 16, name: "Phạm Quốc Dũng", age: 63, gender: "Nam", waitTime: "16 phút", status: "waiting", badge: "Ưu tiên cao tuổi" },
    { stt: 17, name: "Lê Thu Hà", age: 29, gender: "Nữ", waitTime: "22 phút", status: "waiting", badge: "Đã có sinh hiệu" },
    { stt: 18, name: "Hoàng Minh Trí", age: 37, gender: "Nam", waitTime: "28 phút", status: "waiting", badge: "Đã có sinh hiệu" },
  ];

  // Urgent Handoff Cases needing Doctor review
  const handoffCases = [
    {
      id: "HO-01",
      patient: "Lê Thị Bích (74t)",
      flag: "SpO2 giảm còn 92% tại sảnh chờ tầng 1",
      time: "4 phút trước",
      severity: "high",
    },
    {
      id: "HO-02",
      patient: "Đặng Văn Nam (45t)",
      flag: "Đau ngực trái lan lên cằm nghi ngờ thiếu máu cơ tim",
      time: "9 phút trước",
      severity: "critical",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Clinic Room Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse inline-block" />
              Buồng khám trực tiếp
            </Badge>
            <span className="text-xs text-[#667078]">Phòng 101 • Khoa Khám Tổng Quát</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Trạm Y tế Lâm sàng & Phân luồng Bác sĩ
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Bác sĩ điều trị: <strong>BS. CKI. Lê Quốc Bảo</strong> • Điều dưỡng hỗ trợ: <strong>ĐD. Phạm Thị Mai</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/staff/queue">
            <Button
              size="sm"
              className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs font-semibold shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5 mr-1.5" />
              Phát thanh gọi số 15
            </Button>
          </Link>
          <Link href="/staff/clinical">
            <Button
              variant="outline"
              size="sm"
              className="border-[#E8ECEE] text-xs text-[#171A1C] hover:bg-[#F0F8F7]"
            >
              <Stethoscope className="w-3.5 h-3.5 mr-1.5" />
              Mở Bệnh án Đầy đủ
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Đang đợi trước phòng</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F8F7] text-[#147D8D] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#171A1C]">12 bệnh nhân</div>
            <p className="text-[11px] text-[#667078] font-medium mt-1">
              Thời gian chờ trung bình: ~11 phút
            </p>
          </div>
        </Card>

        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Đã khám xong ca trực</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#171A1C]">24 ca</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              ✓ Hoàn thành 100% đúng tiến độ
            </p>
          </div>
        </Card>

        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Đang làm cận lâm sàng</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TestTube2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#171A1C]">8 ca</div>
            <p className="text-[11px] text-[#147D8D] font-medium mt-1">
              Chờ kết quả xét nghiệm / X-Quang
            </p>
          </div>
        </Card>

        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Cảnh báo Handoff AI</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-amber-700">3 trường hợp</div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Cần bác sĩ duyệt / can thiệp khẩn
            </p>
          </div>
        </Card>
      </div>

      {/* Main 2-Column Work Area (2:1 ratio) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (2/3): Current Patient Examination Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl overflow-hidden">
            {/* Patient Header */}
            <div className="p-5 bg-gradient-to-r from-[#EFF9F7] via-[#F0F8F7] to-[#EEF7FA] border-b border-[#ABE3DF]/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#147D8D] text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
                    <span className="text-[9px] uppercase font-normal tracking-wider opacity-90">STT</span>
                    <span className="text-lg leading-none">{currentPatient.stt}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#171A1C]">{currentPatient.name}</h2>
                      <Badge variant="outline" className="bg-white text-[#147D8D] border-[#ABE3DF] text-[10px]">
                        {currentPatient.gender} • {currentPatient.age} tuổi
                      </Badge>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        Đang khám
                      </Badge>
                    </div>
                    <p className="text-xs text-[#667078] mt-0.5">
                      Mã hồ sơ: <span className="font-mono text-[#147D8D]">{currentPatient.code}</span> • {currentPatient.insurance}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href="/staff/clinical">
                    <Button size="sm" className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-8">
                      Vào khám chi tiết →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <CardContent className="p-5 space-y-5">
              {/* Vital Signs Grid */}
              <div>
                <h4 className="text-xs font-bold text-[#171A1C] mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#147D8D]" />
                  Chỉ số sinh hiệu ghi nhận tại Kiosk
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-center">
                    <p className="text-[10px] text-[#667078]">Huyết áp</p>
                    <p className="text-xs font-bold text-[#171A1C] mt-0.5">{currentPatient.vitals.bloodPressure}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-center">
                    <p className="text-[10px] text-[#667078]">Nhịp tim</p>
                    <p className="text-xs font-bold text-[#147D8D] mt-0.5">{currentPatient.vitals.heartRate}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-center">
                    <p className="text-[10px] text-[#667078]">SpO2</p>
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">{currentPatient.vitals.spo2}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-center">
                    <p className="text-[10px] text-[#667078]">Nhiệt độ</p>
                    <p className="text-xs font-bold text-[#171A1C] mt-0.5">{currentPatient.vitals.temp}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-center">
                    <p className="text-[10px] text-[#667078]">Cân nặng</p>
                    <p className="text-xs font-bold text-[#171A1C] mt-0.5">{currentPatient.vitals.weight}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-center">
                    <p className="text-[10px] text-[#667078]">Chỉ số BMI</p>
                    <p className="text-xs font-bold text-[#171A1C] mt-0.5">{currentPatient.vitals.bmi}</p>
                  </div>
                </div>
              </div>

              {/* Chief Complaint & Clinical History */}
              <div className="p-3.5 rounded-xl border border-[#E8ECEE] bg-[#F7F9FA] text-xs space-y-2">
                <div>
                  <span className="font-semibold text-[#171A1C]">Lý do đến khám:</span>
                  <p className="text-[#667078] mt-0.5 leading-relaxed">{currentPatient.reason}</p>
                </div>
                <div className="pt-2 border-t border-[#E8ECEE]">
                  <span className="font-semibold text-[#171A1C]">Tiền sử bệnh án:</span>
                  <p className="text-[#667078] mt-0.5 leading-relaxed">{currentPatient.history}</p>
                </div>
              </div>

              {/* AI Agent Clinical Recommendation */}
              <div className="p-3.5 rounded-xl bg-[#F0F8F7] border border-[#ABE3DF] text-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#147D8D] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#147D8D]">Gợi ý từ CareFlow AI Copilot</span>
                    <Badge variant="outline" className="bg-white text-[#147D8D] border-[#ABE3DF] text-[9px]">
                      Tham khảo lâm sàng
                    </Badge>
                  </div>
                  <p className="text-[#171A1C] leading-relaxed">
                    {currentPatient.aiSuggestion}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Current Patient */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <Link href="/staff/clinical">
                  <Button className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-8">
                    <TestTube2 className="w-3.5 h-3.5 mr-1.5" />
                    Chỉ định Cận lâm sàng
                  </Button>
                </Link>
                <Link href="/staff/clinical">
                  <Button variant="outline" className="border-[#E8ECEE] text-xs text-[#171A1C] hover:bg-[#F0F8F7] h-8">
                    <Pill className="w-3.5 h-3.5 mr-1.5" />
                    Kê đơn thuốc điện tử
                  </Button>
                </Link>
                <Button variant="outline" className="border-[#E8ECEE] text-xs text-emerald-700 hover:bg-emerald-50 h-8 ml-auto">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Hoàn tất ca khám
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Realtime Queue List for PK 101 */}
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-bold text-[#171A1C] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#147D8D]" />
                  Danh sách Bệnh nhân Chờ khám tại Buồng 101
                </CardTitle>
                <CardDescription className="text-xs text-[#667078] mt-0.5">
                  Thứ tự được tối ưu hóa động bởi thuật toán phân luồng CareFlow.
                </CardDescription>
              </div>
              <Link href="/staff/queue">
                <Button variant="ghost" size="sm" className="text-xs text-[#147D8D] hover:bg-[#F0F8F7]">
                  Toàn bộ hàng đợi →
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-5 pt-1">
              <div className="divide-y divide-[#E8ECEE]">
                {queuePatients.map((qp) => (
                  <div key={qp.stt} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        qp.status === "next"
                          ? "bg-[#147D8D] text-white"
                          : "bg-[#F7F9FA] text-[#667078] border border-[#E8ECEE]"
                      }`}>
                        {qp.stt}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#171A1C]">{qp.name}</span>
                          <span className="text-[#667078]">({qp.gender} • {qp.age}t)</span>
                          <Badge variant="outline" className={`text-[9px] ${
                            qp.status === "next"
                              ? "bg-[#F0F8F7] text-[#147D8D] border-[#ABE3DF]"
                              : "bg-gray-50 text-[#667078] border-[#E8ECEE]"
                          }`}>
                            {qp.badge}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-[#667078] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> Đã đợi: {qp.waitTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={qp.status === "next" ? "default" : "outline"}
                        className={`h-7 text-xs ${
                          qp.status === "next"
                            ? "bg-[#147D8D] hover:bg-[#106b79] text-white"
                            : "border-[#E8ECEE] text-[#667078]"
                        }`}
                      >
                        <Volume2 className="w-3 h-3 mr-1" />
                        Gọi vào khám
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Summary Column (1/3): Escalations & Quick Links */}
        <div className="space-y-6">
          {/* Urgent Handoff Alerts Inbox */}
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-bold text-[#171A1C] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Handoff Khẩn Yêu cầu Bác sĩ ({handoffCases.length})
              </CardTitle>
              <Link href="/staff/handoffs">
                <Badge variant="outline" className="text-[9px] border-amber-300 bg-amber-50 text-amber-800 cursor-pointer">
                  Xem tất cả
                </Badge>
              </Link>
            </CardHeader>

            <CardContent className="p-4 pt-1 space-y-3">
              {handoffCases.map((hc) => (
                <div
                  key={hc.id}
                  className={`p-3 rounded-lg border text-xs ${
                    hc.severity === "critical"
                      ? "bg-red-50/50 border-red-200"
                      : "bg-amber-50/40 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] text-[#171A1C]">{hc.patient}</span>
                    <span className="text-[10px] text-[#667078]">{hc.time}</span>
                  </div>
                  <p className="text-[11px] text-[#667078] leading-tight mb-2">
                    {hc.flag}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link href="/staff/handoffs">
                      <Button
                        size="sm"
                        className="h-6 text-[10px] px-2 bg-white border border-[#E8ECEE] hover:bg-gray-50 text-[#171A1C]"
                      >
                        Tiếp nhận xử lý
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Staff Navigation */}
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
            <h4 className="text-xs font-bold text-[#171A1C] mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#147D8D]" />
              Tiện ích trạm khám y tế
            </h4>
            <div className="space-y-1.5">
              <Link href="/staff/reception" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs h-8 font-medium text-[#171A1C] border-[#E8ECEE] hover:bg-[#F0F8F7] hover:text-[#147D8D]"
                >
                  <span className="flex items-center gap-2">
                    <QrCode className="w-3.5 h-3.5 text-[#147D8D]" />
                    Quầy tiếp đón & Check-in QR
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </Link>
              <Link href="/staff/pharmacy" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs h-8 font-medium text-[#171A1C] border-[#E8ECEE] hover:bg-[#F0F8F7] hover:text-[#147D8D]"
                >
                  <span className="flex items-center gap-2">
                    <Pill className="w-3.5 h-3.5 text-[#147D8D]" />
                    Quầy Dược & Cấp phát thuốc
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </Link>
              <Link href="/staff/billing" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs h-8 font-medium text-[#171A1C] border-[#E8ECEE] hover:bg-[#F0F8F7] hover:text-[#147D8D]"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-[#147D8D]" />
                    Thu viện phí & Giám định BHYT
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
