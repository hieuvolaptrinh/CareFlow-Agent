"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  DoorOpen,
  FileCheck2,
  Plus,
  QrCode,
  Search,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ReceptionStaffPage() {
  const [activeTab, setActiveTab] = useState("scan");
  const [scannedPatient, setScannedPatient] = useState({
    name: "Hoàng Minh Trí",
    cccd: "001094012938",
    dob: "14/08/1989 (37 tuổi)",
    gender: "Nam",
    address: "24/6 Phố Vọng, Hai Bà Trưng, Hà Nội",
    bhyt: "DN-4-01-01-2918239 (Hạn dùng: 31/12/2026)",
    department: "Khoa Khám Bệnh - Khám Nội Tổng Quát",
    assignedRoom: "PK 101 (BS. Lê Quốc Bảo)",
    suggestedStt: 19,
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Quầy Tiếp Đón & Quét Mã BHYT / CCCD VNeID
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Nhận diện người bệnh tức thì, kiểm tra tính hợp lệ BHYT và AI tự động cấp số thứ tự vào buồng khám tối ưu.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Tiếp nhận thủ công (Không có QR)
          </Button>
        </div>
      </div>

      {/* Main Reception Form & Scanner Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Scan Area (Left 1/3) */}
        <div className="space-y-4">
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-5 text-center">
            <div className="w-full aspect-square max-w-[240px] mx-auto rounded-2xl bg-gradient-to-br from-[#EFF9F7] via-white to-[#EEF7FA] border-2 border-dashed border-[#147D8D]/40 flex flex-col items-center justify-center p-6 relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-[#F0F8F7] border border-[#ABE3DF] text-[#147D8D] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <QrCode className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-[#171A1C]">Khu vực Quét QR Code</span>
              <p className="text-[11px] text-[#667078] mt-1">
                Đặt thẻ CCCD gắn chip hoặc mã QR Thẻ BHYT / VNeID trước máy quét
              </p>
              <div className="absolute inset-x-4 top-1/2 h-0.5 bg-[#147D8D] animate-pulse opacity-70" />
            </div>

            <div className="mt-4 pt-4 border-t border-[#E8ECEE] flex items-center justify-between text-xs text-[#667078]">
              <span>Thiết bị quét: HoneyWell Xenon</span>
              <span className="text-emerald-600 font-medium">● Đang sẵn sàng</span>
            </div>
          </Card>
        </div>

        {/* Scanned Patient Information (Right 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8ECEE] mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#171A1C]">
                  Thông tin Bệnh nhân Vừa Quét Thành Công
                </h3>
              </div>
              <Badge className="bg-[#147D8D] text-white text-[10px]">
                BHYT Hợp lệ (100% Quyền lợi)
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <Label className="text-[#667078] text-[11px]">Họ và tên</Label>
                <Input value={scannedPatient.name} readOnly className="bg-[#F7F9FA] font-bold text-xs h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-[#667078] text-[11px]">Số CCCD / Định danh</Label>
                <Input value={scannedPatient.cccd} readOnly className="bg-[#F7F9FA] font-mono text-xs h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-[#667078] text-[11px]">Ngày sinh & Độ tuổi</Label>
                <Input value={scannedPatient.dob} readOnly className="bg-[#F7F9FA] text-xs h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-[#667078] text-[11px]">Mã thẻ BHYT</Label>
                <Input value={scannedPatient.bhyt} readOnly className="bg-[#F7F9FA] font-mono text-xs h-8" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-[#667078] text-[11px]">Địa chỉ thường trú</Label>
                <Input value={scannedPatient.address} readOnly className="bg-[#F7F9FA] text-xs h-8" />
              </div>
            </div>

            {/* AI Smart Assignment Box */}
            <div className="mt-5 p-4 rounded-xl bg-[#F0F8F7] border border-[#ABE3DF] text-xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#147D8D]" />
                <span className="font-bold text-[#147D8D]">Phân bổ Buồng khám Tối ưu bởi CareFlow Agent</span>
              </div>
              <p className="text-[#171A1C] leading-relaxed mb-3">
                Dựa trên tiền sử bệnh lý và thời gian chờ hiện tại giữa các phòng khám, Agent đề xuất điều phối bệnh nhân vào <strong>{scannedPatient.assignedRoom}</strong> với <strong>Số thứ tự khám: STT {scannedPatient.suggestedStt}</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-8 shadow-xs">
                  <DoorOpen className="w-3.5 h-3.5 mr-1.5" />
                  Xác nhận & Cấp phiếu STT {scannedPatient.suggestedStt}
                </Button>
                <Button variant="outline" className="border-[#E8ECEE] text-xs text-[#171A1C] hover:bg-white h-8">
                  Đổi buồng khám khác
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
