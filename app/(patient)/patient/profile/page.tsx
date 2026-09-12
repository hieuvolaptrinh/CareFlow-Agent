"use client";

import Link from "next/link";
import {
  FileCheck,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function PatientProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-[#171A1C]">Hồ Sơ Cá Nhân & Quản Lý Đồng Thuận</h1>
        <p className="text-xs text-[#667078] mt-0.5">
          Thông tin bệnh nhân và cài đặt quyền riêng tư đối với Trợ lý AI CareFlow
        </p>
      </div>

      <Card className="border-[#E8ECEE] bg-white shadow-xs p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#E8ECEE]">
          <Avatar className="w-20 h-20 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-[#147D8D] text-white text-2xl font-bold">
              NA
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-[#171A1C]">Nguyễn Văn A</h2>
              <Badge variant="outline" className="border-[#ABE3DF] text-[#147D8D] text-xs">
                CF-89211
              </Badge>
            </div>
            <p className="text-xs text-[#667078]">Nam • 45 tuổi (14/06/1981) • Nhóm máu: O+</p>
            <p className="text-xs text-[#171A1C]">BHYT: GD-4-79-1234567890 (Hạn dùng: 31/12/2026)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs">
          <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE]">
            <span className="text-[#667078] block">Số điện thoại:</span>
            <span className="font-semibold text-[#171A1C] mt-1 block">+84 912 345 678</span>
          </div>
          <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE]">
            <span className="text-[#667078] block">Email:</span>
            <span className="font-semibold text-[#171A1C] mt-1 block">nguyenvana@gmail.com</span>
          </div>
          <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE]">
            <span className="text-[#667078] block">Địa chỉ:</span>
            <span className="font-semibold text-[#171A1C] mt-1 block">123 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM</span>
          </div>
          <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE]">
            <span className="text-[#667078] block">Người liên hệ khẩn cấp:</span>
            <span className="font-semibold text-[#171A1C] mt-1 block">Nguyễn Thị B (Vợ - 0988 123 456)</span>
          </div>
        </div>
      </Card>

      {/* Consent Management (UC-P05) */}
      <Card className="border-[#ABE3DF] bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-[#E8ECEE]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-[#171A1C] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#147D8D]" />
              Quản Lý Đồng Thuận & Quyền Riêng Tư (Consent)
            </CardTitle>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
              Đang hoạt động
            </Badge>
          </div>
          <CardDescription className="text-xs text-[#667078]">
            Bạn có quyền kiểm soát việc Trợ lý AI CareFlow sử dụng thông tin lượt khám để hỗ trợ điều phối
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="p-3.5 bg-[#EFF9F7] rounded-xl border border-[#ABE3DF] space-y-1">
            <div className="font-bold text-[#147D8D] flex items-center gap-1.5 text-xs">
              <FileCheck className="w-4 h-4" />
              Đồng thuận hỗ trợ điều phối tự động
            </div>
            <p className="text-xs text-[#171A1C] leading-relaxed">
              Bạn đã ký xác nhận đồng ý cho CareFlow Agent đọc trạng thái chỉ định xét nghiệm và số thứ tự để chỉ đường.
            </p>
            <div className="text-[11px] text-[#667078] pt-1">
              Thời gian xác nhận: 12/09/2026 08:15 • Mã thỏa thuận: CONSENT-CF-89211
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link href="/terms">
              <Button size="sm" variant="outline" className="border-[#E8ECEE] text-xs h-8">
                Xem điều khoản chi tiết
              </Button>
            </Link>

            <Button size="sm" variant="ghost" className="text-xs h-8 text-red-600 hover:bg-red-50">
              Rút lại đồng thuận (Tắt AI)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
