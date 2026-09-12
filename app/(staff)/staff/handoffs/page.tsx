"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  HeartPulse,
  PhoneCall,
  Search,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HandoffsStaffPage() {
  const [handoffs, setHandoffs] = useState([
    {
      id: "HO-2026-081",
      patient: "Lê Thị Bích",
      age: 74,
      gender: "Nữ",
      code: "BN-2026-094",
      location: "Ghế chờ G-14 (Sảnh Tầng 1)",
      time: "4 phút trước",
      severity: "critical",
      reason: "SpO2 giảm còn 92%, mạch nhanh 114 bpm ghi nhận tại Kiosk đo sinh hiệu",
      aiSummary: "Bệnh nhân có tiền sử suy tim mạn tính. Đang thở dốc. AI lập tức kích hoạt Handoff ưu tiên cấp cứu, đề xuất điều dưỡng mang bình oxy tiếp cận sảnh.",
      status: "pending",
    },
    {
      id: "HO-2026-080",
      patient: "Đặng Văn Nam",
      age: 45,
      gender: "Nam",
      code: "BN-2026-098",
      location: "Cổng đón tiếp số 1",
      time: "9 phút trước",
      severity: "critical",
      reason: "Bệnh nhân báo đau thắt ngực kiểu đè ép lan lên hàm trái và cánh tay",
      aiSummary: "Dấu hiệu Red-flag của hội chứng vành cấp (Acute Coronary Syndrome). Cần chuyển thẳng phòng Cấp Cứu đo ECG 12 chuyển đạo trong 10 phút.",
      status: "pending",
    },
    {
      id: "HO-2026-079",
      patient: "Vũ Minh Anh",
      age: 31,
      gender: "Nữ",
      code: "BN-2026-102",
      location: "Khu vực Chờ Xét Nghiệm",
      time: "18 phút trước",
      severity: "warning",
      reason: "Bệnh nhân muốn trao đổi trực tiếp với Bác sĩ vì lo lắng kết quả men gan cao",
      aiSummary: "Bệnh nhân đặt câu hỏi vượt ngoài phạm vi giải thích tự động của Agent. AI kích hoạt chuyển giao bác sĩ tư vấn.",
      status: "handled",
    },
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[11px] font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              Human-in-the-Loop Protocol
            </Badge>
            <span className="text-xs text-[#667078]">Quy chuẩn bàn giao an toàn y khoa</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Hộp Thư Can Thiệp Lâm Sàng (AI Human Handoff)
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Danh sách các trường hợp được CareFlow Agent chuyển giao khẩn cho Bác sĩ & Điều dưỡng viên can thiệp trực tiếp.
          </p>
        </div>
      </div>

      {/* Handoff Cards List */}
      <div className="space-y-4">
        {handoffs.map((ho) => (
          <Card key={ho.id} className={`bg-white border shadow-none rounded-xl p-5 transition-colors ${
            ho.severity === "critical"
              ? "border-red-200 hover:border-red-300"
              : "border-[#E8ECEE] hover:border-[#ABE3DF]"
          }`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#147D8D] bg-[#F0F8F7] px-2 py-0.5 rounded border border-[#ABE3DF]">
                    {ho.id}
                  </span>
                  <h3 className="text-sm font-bold text-[#171A1C]">
                    {ho.patient} ({ho.gender}, {ho.age}t)
                  </h3>
                  <span className="text-xs text-[#667078]">Mã BN: {ho.code}</span>
                  <Badge variant="outline" className={`text-[10px] ${
                    ho.severity === "critical"
                      ? "bg-red-50 text-red-700 border-red-200 font-bold"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}>
                    {ho.severity === "critical" ? "Nguy cơ cao (Red-flag)" : "Cần tư vấn"}
                  </Badge>
                </div>

                <p className="text-xs font-semibold text-[#171A1C]">
                  Triệu chứng cảnh báo: <span className="font-normal text-rose-700">{ho.reason}</span>
                </p>

                <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-xs flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#147D8D] shrink-0 mt-0.5" />
                  <p className="text-[#171A1C] leading-relaxed">
                    <strong>Đánh giá AI:</strong> {ho.aiSummary}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-[#667078]">
                  <span>Vị trí: <strong>{ho.location}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ho.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 md:self-center shrink-0">
                <Button
                  size="sm"
                  className={`text-xs shadow-xs ${
                    ho.severity === "critical"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-[#147D8D] hover:bg-[#106b79] text-white"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                  Tiếp nhận can thiệp ngay
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
