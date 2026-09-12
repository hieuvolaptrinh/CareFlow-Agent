"use client";

import { useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Mic,
  Pill,
  Plus,
  Save,
  Search,
  Sparkles,
  Stethoscope,
  TestTube2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ClinicalStaffPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState(
    "Bệnh nhân tỉnh, tiếp xúc tốt. Đau vùng thượng vị âm ỉ, không lan sau lưng. Bụng mềm, ấn đau tức nhẹ vùng thượng vị. Không có phản ứng thành bụng. Tiếng tim đều, phổi thông khí tốt không rales."
  );

  const [orders, setOrders] = useState([
    { id: "ORD-01", name: "Nội soi thực quản - dạ dày - tá tràng không đau", code: "CLS-NS-01", status: "Chỉ định" },
    { id: "ORD-02", name: "Test hơi thở tìm vi khuẩn Helicobacter pylori (C13)", code: "CLS-XN-09", status: "Chỉ định" },
    { id: "ORD-03", name: "Tổng phân tích tế bào máu ngoại vi (24 chỉ số)", code: "CLS-XN-01", status: "Chỉ định" },
  ]);

  const [medications, setMedications] = useState([
    { id: "MED-01", name: "Esomeprazole 40mg", dosage: "Uống 1 viên/ngày trước ăn sáng 30p", quantity: "28 viên" },
    { id: "MED-02", name: "Gaviscon Dual Action", dosage: "Uống 1 gói sau 3 bữa ăn và trước ngủ", quantity: "40 gói" },
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-xs text-[#147D8D] bg-[#F0F8F7] px-2 py-0.5 rounded border border-[#ABE3DF]">
              Hồ sơ: BN-2026-081 • STT 14
            </span>
            <span className="text-xs text-[#667078]">Nguyễn Văn An (52t, Nam)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Khám Lâm Sàng & Chỉ Định Cận Lâm Sàng
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Chẩn đoán sơ bộ: <strong>K29.5 - Viêm dạ dày mạn tính, không đặc hiệu</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
            Ký số Bác sĩ & Chuyển luồng CLS
          </Button>
        </div>
      </div>

      {/* Main Examination Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Clinical Examination & Voice Notes */}
        <div className="space-y-6">
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-sm font-bold text-[#171A1C] flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#147D8D]" />
                Diễn Biến Lâm Sàng & Ghi Chú Y Khoa
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsRecording(!isRecording)}
                className={`h-7 text-xs ${
                  isRecording
                    ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                    : "border-[#E8ECEE] text-[#147D8D] hover:bg-[#F0F8F7]"
                }`}
              >
                <Mic className="w-3.5 h-3.5 mr-1" />
                {isRecording ? "Đang ghi âm..." : "Voice-to-Text"}
              </Button>
            </div>

            <Textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={6}
              className="text-xs bg-[#F7F9FA] border-[#E8ECEE] leading-relaxed resize-none"
              placeholder="Nhập triệu chứng cơ năng, thực thể hoặc dùng micro để đọc chẩn đoán..."
            />

            {/* AI Assistant Diagnostics Card */}
            <div className="mt-4 p-3 rounded-lg bg-[#F0F8F7] border border-[#ABE3DF] text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#147D8D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#147D8D]">Đề xuất chẩn đoán phân biệt từ AI Copilot:</p>
                <p className="text-[#171A1C] text-[11px] mt-0.5">
                  1. Loét dạ dày tá tràng nhiễm HP (85%) • 2. Trào ngược dạ dày thực quản GERD độ A (65%) • 3. Rối loạn tiêu hóa chức năng (20%).
                </p>
              </div>
            </div>
          </Card>

          {/* Laboratory & Radiology Orders */}
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-sm font-bold text-[#171A1C] flex items-center gap-2">
                <TestTube2 className="w-4 h-4 text-[#147D8D]" />
                Phiếu Chỉ Định Cận Lâm Sàng ({orders.length})
              </CardTitle>
              <Button size="sm" variant="outline" className="h-7 text-xs border-[#E8ECEE] text-[#147D8D]">
                <Plus className="w-3 h-3 mr-1" /> Thêm chỉ định
              </Button>
            </div>

            <div className="space-y-2">
              {orders.map((ord) => (
                <div key={ord.id} className="p-2.5 rounded-lg border border-[#E8ECEE] bg-[#F7F9FA] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#171A1C]">{ord.name}</span>
                    <span className="text-[#667078] ml-2 font-mono text-[10px]">({ord.code})</span>
                  </div>
                  <Badge variant="outline" className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] text-[10px]">
                    BHYT chi trả
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Electronic Prescription & Drug Interaction Guardrail */}
        <div className="space-y-6">
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-sm font-bold text-[#171A1C] flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#147D8D]" />
                Đơn Thuốc Điện Tử Dự Thảo
              </CardTitle>
              <Button size="sm" variant="outline" className="h-7 text-xs border-[#E8ECEE] text-[#147D8D]">
                <Plus className="w-3 h-3 mr-1" /> Thêm thuốc
              </Button>
            </div>

            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} className="p-3 rounded-lg border border-[#E8ECEE] bg-[#F7F9FA] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#171A1C]">{med.name}</span>
                    <span className="font-semibold text-[#147D8D]">{med.quantity}</span>
                  </div>
                  <p className="text-[11px] text-[#667078]">{med.dosage}</p>
                </div>
              ))}
            </div>

            {/* AI Drug-Drug Interaction Safety Alert */}
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-800">Kiểm tra an toàn Dược lâm sàng: ĐẠT CHUẨN</p>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Không phát hiện tương tác đối kháng giữa Esomeprazole và Gaviscon. Liều lượng phù hợp chức năng thận và tiền sử bệnh nhân.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E8ECEE] flex justify-end gap-2.5">
              <Button variant="outline" className="border-[#E8ECEE] text-xs">
                Lưu tạm
              </Button>
              <Button className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs">
                <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
                Hoàn tất & Ký số đơn thuốc
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
