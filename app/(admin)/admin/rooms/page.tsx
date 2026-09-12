"use client";

import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  DoorOpen,
  Filter,
  Plus,
  Power,
  Search,
  Settings2,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RoomsAdminPage() {
  const [search, setSearch] = useState("");

  const rooms = [
    {
      code: "PK-101",
      name: "Phòng Khám Nội Tổng Quát 1",
      department: "Khoa Khám Bệnh",
      doctor: "BS. CKI. Lê Quốc Bảo",
      nurse: "ĐD. Phạm Thị Mai",
      patientCurrent: "Trần Văn An (STT 14)",
      waitingQueue: 6,
      status: "active", // active, maintenance, idle
    },
    {
      code: "PK-102",
      name: "Phòng Khám Tim Mạch Can Thiệp",
      department: "Khoa Tim Mạch",
      doctor: "TS. BS. Nguyễn Hoài Nam",
      nurse: "ĐD. Hoàng Hải Yến",
      patientCurrent: "Đỗ Minh Khang (STT 08)",
      waitingQueue: 9,
      status: "busy",
    },
    {
      code: "CDHA-01",
      name: "Phòng Chụp X-Quang Kỹ Thuật Số",
      department: "Chẩn Đoán Hình Ảnh",
      doctor: "KTV. Trần Đình Trọng",
      nurse: "ĐD. Vũ Lan Anh",
      patientCurrent: "Nguyễn Thị Hoa (STT 22)",
      waitingQueue: 4,
      status: "active",
    },
    {
      code: "CDHA-03",
      name: "Phòng Cộng Hưởng Từ MRI 1.5 Tesla",
      department: "Chẩn Đoán Hình Ảnh",
      doctor: "BS. CKII. Lê Hoàng Long",
      nurse: "KTV. Bùi Văn Tuấn",
      patientCurrent: "Đang hiệu chuẩn định kỳ",
      waitingQueue: 0,
      status: "maintenance",
    },
    {
      code: "XN-02",
      name: "Bàn Lấy Mẫu Huyết Học Số 2",
      department: "Khoa Xét Nghiệm",
      doctor: "KTV. Đoàn Thị Nga",
      nurse: "ĐD. Ngô Thị Bích",
      patientCurrent: "Lê Văn Tùng (STT 35)",
      waitingQueue: 5,
      status: "active",
    },
    {
      code: "PK-105",
      name: "Phòng Khám Khám Linh Hoạt (Backup)",
      department: "Khoa Khám Bệnh",
      doctor: "Chưa phân bổ",
      nurse: "Sẵn sàng",
      patientCurrent: "Phòng dự phòng giờ cao điểm",
      waitingQueue: 0,
      status: "idle",
    },
  ];

  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Quản trị Buồng khám & Thiết bị Y tế
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Trạng thái trực tiếp của các phòng khám, thiết bị chẩn đoán hình ảnh và phân bổ kíp trực.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Thêm phòng / Thiết bị mới
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E8ECEE]">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#667078]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã phòng, khoa hoặc thiết bị..."
            className="pl-8 text-xs bg-[#F7F9FA] border-[#E8ECEE] h-8"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#667078]">
          <span>Hiển thị: <strong>{filtered.length} buồng trực</strong></span>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Card key={r.code} className="bg-white border-[#E8ECEE] shadow-none rounded-xl hover:border-[#ABE3DF] transition-colors">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#147D8D] bg-[#F0F8F7] px-2 py-0.5 rounded border border-[#ABE3DF]">
                  {r.code}
                </span>
                {r.status === "active" ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    Đang khám
                  </Badge>
                ) : r.status === "busy" ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                    Hàng đợi dài
                  </Badge>
                ) : r.status === "maintenance" ? (
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                    Bảo trì máy
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200 text-[10px]">
                    Dự phòng
                  </Badge>
                )}
              </div>

              <CardTitle className="text-sm font-bold text-[#171A1C] mt-2">
                {r.name}
              </CardTitle>
              <CardDescription className="text-[11px] text-[#667078]">
                {r.department}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-2 space-y-3">
              <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#667078]">Bác sĩ trực:</span>
                  <span className="font-medium text-[#171A1C]">{r.doctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667078]">Điều dưỡng:</span>
                  <span className="text-[#171A1C]">{r.nurse}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E8ECEE]">
                  <span className="text-[#667078]">Đang phục vụ:</span>
                  <span className="font-semibold text-[#147D8D]">{r.patientCurrent}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#667078]">Hàng đợi chờ vào:</span>
                <span className="font-bold text-[#171A1C]">{r.waitingQueue} người</span>
              </div>

              <div className="pt-2 border-t border-[#E8ECEE] flex items-center justify-between">
                <Button variant="ghost" size="sm" className="h-7 text-[11px] text-[#667078]">
                  Lịch sử ca
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px] border-[#E8ECEE] text-[#147D8D] hover:bg-[#F0F8F7]">
                  <Settings2 className="w-3 h-3 mr-1" />
                  Điều phối
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
