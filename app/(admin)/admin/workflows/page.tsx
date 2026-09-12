"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  GitFork,
  Network,
  Plus,
  QrCode,
  Settings,
  Sparkles,
  Stethoscope,
  TestTube2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkflowsAdminPage() {
  const steps = [
    {
      step: 1,
      name: "Tiếp đón & Nhận diện Bệnh nhân",
      icon: QrCode,
      targetTime: "2 phút",
      automationRate: "94%",
      desc: "Quét QR CCCD gắn chip / VNeID hoặc Thẻ BHYT. Phân bổ số thứ tự thông minh vào buồng khám theo tiền sử bệnh án.",
      agentAction: "Tạo Visit ID mới, kiểm tra quyền lợi BHYT, xếp hàng tự động.",
    },
    {
      step: 2,
      name: "Đo Chỉ số Sinh hiệu Tự động",
      icon: Activity,
      targetTime: "4 phút",
      automationRate: "88%",
      desc: "Kiosk sinh hiệu đo Huyết áp, Nhịp tim, SpO2, Chiều cao, Cân nặng, Nhiệt độ. Dữ liệu đồng bộ thẳng vào hồ sơ khám.",
      agentAction: "So sánh ngưỡng an toàn. Kích hoạt cảnh báo Red-flag nếu SpO2 < 93% hoặc HA > 160mmHg.",
    },
    {
      step: 3,
      name: "Khám Lâm sàng với Bác sĩ Chuyên khoa",
      icon: Stethoscope,
      targetTime: "12 phút",
      automationRate: "45%",
      desc: "Bác sĩ thăm khám trực tiếp, hỏi bệnh sử. Bác sĩ chỉ định các xét nghiệm hoặc cận lâm sàng cần thiết trên phần mềm.",
      agentAction: "Hỗ trợ ghi chú lâm sàng bằng giọng nói (Speech-to-Text), đề xuất chỉ định tương quan.",
    },
    {
      step: 4,
      name: "Điều phối Cận Lâm Sàng Song Song (Multi-modal)",
      icon: TestTube2,
      targetTime: "25 phút",
      automationRate: "96%",
      desc: "Phân bổ bệnh nhân thực hiện Xét nghiệm máu, Siêu âm, X-Quang theo thứ tự tối ưu hóa quãng đường di chuyển và độ đông.",
      agentAction: "Thuật toán Travelling Salesperson giải bài toán đường đi ngắn nhất trong khuôn viên bệnh viện.",
    },
    {
      step: 5,
      name: "Bác sĩ Kết luận & Ký số Đơn thuốc",
      icon: FileSpreadsheet,
      targetTime: "8 phút",
      automationRate: "60%",
      desc: "Tổng hợp toàn bộ kết quả xét nghiệm và chẩn đoán hình ảnh. Bác sĩ đưa ra kết luận bệnh lý và đơn thuốc.",
      agentAction: "Kiểm tra tương tác chéo giữa các loại thuốc (Drug-Drug Interaction) và chống chỉ định dị ứng.",
    },
    {
      step: 6,
      name: "Nhận thuốc & Hướng dẫn Sau khám",
      icon: CheckCircle2,
      targetTime: "5 phút",
      automationRate: "90%",
      desc: "Nhận thuốc tại Nhà thuốc Bệnh viện hoặc nhận đơn qua ứng dụng. Nhận lịch hẹn tái khám tự động.",
      agentAction: "Gửi tóm tắt bệnh án điện tử, lịch uống thuốc và chỉ dẫn chế độ ăn qua Zalo / Mobile App.",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] text-[11px] font-semibold">
              <Network className="w-3.5 h-3.5 mr-1" />
              Dynamic Clinical Pathway v2.4
            </Badge>
            <span className="text-xs text-[#667078]">Áp dụng toàn diện cho Khối Ngoại trú</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Quy trình & Luồng Hành trình Khám Ngoại trú
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Cấu hình thứ tự các chặng khám, định mức thời gian cho phép và thuật toán AI can thiệp điều phối tự động.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Tạo luồng chuyên khoa đặc thù
          </Button>
        </div>
      </div>

      {/* Pathway Steps List */}
      <div className="space-y-4">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.step} className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-5 hover:border-[#ABE3DF] transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F8F7] border border-[#ABE3DF] text-[#147D8D] flex items-center justify-center font-bold text-sm shrink-0">
                    0{s.step}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-bold text-[#171A1C]">{s.name}</h3>
                      <span className="text-[10px] text-[#667078] bg-[#F7F9FA] px-2 py-0.5 rounded border border-[#E8ECEE] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> SLA: {s.targetTime}
                      </span>
                      <span className="text-[10px] text-[#147D8D] bg-[#EFF9F7] px-2 py-0.5 rounded border border-[#ABE3DF] font-semibold">
                        Tự động hóa: {s.automationRate}
                      </span>
                    </div>
                    <p className="text-xs text-[#667078] leading-relaxed">
                      {s.desc}
                    </p>
                    <div className="text-[11px] text-[#147D8D] bg-[#F0F8F7] p-2 rounded-lg border border-[#ABE3DF]/50 flex items-center gap-2 mt-2">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span><strong>AI Agent Runtime:</strong> {s.agentAction}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:self-center shrink-0">
                  <Button variant="outline" size="sm" className="h-8 text-xs border-[#E8ECEE] text-[#171A1C] hover:bg-[#F0F8F7]">
                    <Settings className="w-3.5 h-3.5 mr-1" />
                    Thiết lập chặng
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
