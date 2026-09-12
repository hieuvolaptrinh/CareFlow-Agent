"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bot,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Lock,
  Plus,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function AiPoliciesAdminPage() {
  const [policies, setPolicies] = useState([
    {
      id: "POL-SAFE-01",
      name: "Cấm AI Tự Kê Đơn Thuốc Độc Lập",
      desc: "Mọi chỉ định thuốc bắt buộc phải do Bác sĩ chuyên khoa xác nhận và ký số. AI chỉ đóng vai trò đề xuất tương tác thuốc & liều lượng tham khảo.",
      category: "Kê đơn & Dược lý",
      level: "BẮT BUỘC (Strict)",
      active: true,
      immutable: true,
    },
    {
      id: "POL-SAFE-02",
      name: "Tự Động Kích Hoạt Handoff Khẩn Cấp (Red-Flag Symptoms)",
      desc: "Khi người bệnh nhập triệu chứng: Đau thắt ngực lan ra vai, khó thở cấp tính, SpO2 < 93%, hoặc yếu liệt nửa người, AI lập tức chuyển chế độ cấp cứu và thông báo kíp trực.",
      category: "Cấp cứu & Phân luồng",
      level: "BẮT BUỘC (Strict)",
      active: true,
      immutable: true,
    },
    {
      id: "POL-SAFE-03",
      name: "Kiểm Định Trích Dẫn RAG Y Khoa (Anti-Hallucination)",
      desc: "AI chỉ được phép cung cấp thông tin y khoa nếu có ít nhất 1 nguồn tham chiếu chính thức từ Dược Thư Quốc Gia hoặc Phác đồ Bệnh viện được index.",
      category: "Kiểm soát Suy luận",
      level: "Tiêu chuẩn cao",
      active: true,
      immutable: false,
    },
    {
      id: "POL-SAFE-04",
      name: "Tự Động Làm Mờ Thông Tin Cá Nhân Nhạy Cảm (De-identification)",
      desc: "Loại bỏ số CCCD, số điện thoại, địa chỉ nhà riêng trong prompt gửi lên mô hình ngôn ngữ lớn để bảo đảm quyền riêng tư.",
      category: "Bảo mật & Quyền riêng tư",
      level: "Tiêu chuẩn cao",
      active: true,
      immutable: false,
    },
    {
      id: "POL-SAFE-05",
      name: "Cân Bằng Tải Hàng Đợi Thông Minh (Dynamic Queue Leveling)",
      desc: "Cho phép AI tự động đề xuất đổi phòng khám nếu phòng hiện tại có hơn 8 bệnh nhân đang đợi và phòng lân cận cùng chuyên khoa còn trống.",
      category: "Điều phối Vận hành",
      level: "Tối ưu hóa",
      active: true,
      immutable: false,
    },
  ]);

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id && !p.immutable) {
        return { ...p, active: !p.active };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[11px] font-semibold">
              <Shield className="w-3.5 h-3.5 mr-1" />
              Medical AI Safety Guardrails
            </Badge>
            <span className="text-xs text-[#667078]">Tuân thủ Quyết định 4888/QĐ-BYT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Chính sách An toàn Y khoa & Ranh giới Quyết định AI
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Thiết lập các chốt an toàn bắt buộc, ngăn chặn ảo giác (hallucination) và bảo vệ an toàn tối thượng cho người bệnh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Lưu thay đổi chính sách
          </Button>
        </div>
      </div>

      {/* Safety Summary Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#EFF9F7] to-[#F0F8F7] border border-[#ABE3DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#147D8D] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#171A1C]">Hệ thống Chốt chặn Đang Kích Hoạt 100%</h3>
            <p className="text-[11px] text-[#667078] mt-0.5">
              Tất cả các chính sách an toàn y tế nghiêm ngặt (Strict Policies) đều đang khóa chặt và không thể bị vô hiệu hóa khi chưa có Hội đồng Y khoa phê duyệt.
            </p>
          </div>
        </div>
        <Badge className="bg-[#147D8D] text-white text-xs self-start sm:self-auto">
          Audit Verified
        </Badge>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {policies.map((p) => (
          <Card key={p.id} className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-5 hover:border-[#ABE3DF] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold text-[#171A1C]">{p.name}</span>
                  <span className="text-[10px] font-mono text-[#667078] px-1.5 py-0.5 rounded bg-[#F7F9FA] border border-[#E8ECEE]">
                    {p.id}
                  </span>
                  <span className="text-[10px] text-[#147D8D] font-medium bg-[#F0F8F7] px-2 py-0.5 rounded-full border border-[#ABE3DF]">
                    {p.category}
                  </span>
                  {p.immutable && (
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Khóa bảo vệ
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#667078] leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="flex items-center gap-3 sm:self-center shrink-0">
                <span className="text-xs text-[#667078]">
                  {p.active ? "Đang áp dụng" : "Tạm dừng"}
                </span>
                <Switch
                  checked={p.active}
                  onCheckedChange={() => togglePolicy(p.id)}
                  disabled={p.immutable}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
