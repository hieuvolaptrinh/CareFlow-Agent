"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  MapPin,
  MessageSquare,
  PhoneCall,
  Send,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PatientSupportPage() {
  const [reason, setReason] = useState("lost");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link
          href="/patient/dashboard"
          className="inline-flex items-center text-xs font-semibold text-[#147D8D] hover:underline gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Về Trang tổng quan
        </Link>
        <h1 className="text-xl font-bold text-[#171A1C]">Yêu Cầu Hỗ Trợ Từ Nhân Viên (Human Handoff)</h1>
        <p className="text-xs text-[#667078] mt-0.5">
          Nếu bạn gặp khó khăn, lạc đường hoặc cần nhân viên y tế trợ giúp trực tiếp
        </p>
      </div>

      {/* Emergency Callout */}
      <Alert className="border-red-200 bg-red-50 text-red-950">
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <AlertTitle className="text-xs font-bold text-red-700">CẢNH BÁO CẤP CỨU Y TẾ</AlertTitle>
        <AlertDescription className="text-xs text-red-800 mt-1">
          Nếu bạn đang có triệu chứng đau ngực dữ dội, khó thở, ngất xỉu hoặc co giật, vui lòng gọi lớn cho điều dưỡng xung quanh hoặc bấm gọi ngay <strong>115</strong>.
        </AlertDescription>
      </Alert>

      {isSubmitted ? (
        <Card className="border-[#ABE3DF] bg-[#EFF9F7] p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#171A1C]">Đã Gửi Y Cầu Trợ Giúp Thành Công!</h3>
            <p className="text-xs text-[#667078] mt-1 max-w-md mx-auto">
              Thông tin lượt khám và vị trí hiện tại của bạn đã được chuyển tới màn hình trực ban của Quầy Tiếp Đón Tầng 2. Nhân viên điều dưỡng sẽ liên hệ hoặc tìm đến vị trí của bạn trong 2-3 phút.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/patient/dashboard">
              <Button className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-9">
                Quay lại Bảng điều khiển
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="border-[#E8ECEE] bg-white shadow-xs p-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#171A1C] block mb-1">
                Vấn đề bạn đang cần nhân viên hỗ trợ là gì?
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#F7F9FA] border border-[#E8ECEE] rounded-xl p-2.5 text-xs text-[#171A1C] outline-none focus:border-[#147D8D]"
              >
                <option value="lost">Tôi không tìm thấy phòng xét nghiệm / lạc đường</option>
                <option value="queue">Số thứ tự bị bỏ qua hoặc tôi đến muộn</option>
                <option value="health">Tôi cảm thấy mệt và cần hỗ trợ xe lăn / chỗ ngồi</option>
                <option value="workflow">Tôi không hiểu hướng dẫn tiếp theo của bác sĩ</option>
                <option value="other">Vấn đề khác</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#171A1C] block mb-1">
                Ghi chú thêm vị trí hoặc thông tin (Không bắt buộc):
              </label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Tôi đang đứng gần thang máy số 2 ở tầng 2..."
                className="w-full bg-[#F7F9FA] border border-[#E8ECEE] rounded-xl p-3 text-xs text-[#171A1C] outline-none focus:border-[#147D8D]"
              />
            </div>

            <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE] text-[#667078]">
              <strong className="block text-[#171A1C] mb-0.5">Thông tin tự động gửi kèm:</strong>
              Mã BN: CF-89211 • Lượt khám: #V-2026-0912 (Tim mạch) • Vị trí gần nhất: Phòng 204
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Link href="/patient/dashboard">
                <Button type="button" variant="outline" className="text-xs h-9 border-[#E8ECEE]">
                  Hủy bỏ
                </Button>
              </Link>
              <Button type="submit" className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-9 px-5">
                <Send className="w-3.5 h-3.5 mr-1" />
                Gửi yêu cầu hỗ trợ ngay
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
