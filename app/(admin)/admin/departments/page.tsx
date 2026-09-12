"use client";

import { useState } from "react";
import {
  Building2,
  Clock,
  DoorOpen,
  Filter,
  Plus,
  Search,
  Settings2,
  Stethoscope,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DepartmentsAdminPage() {
  const [search, setSearch] = useState("");

  const departments = [
    {
      id: "K-01",
      name: "Khoa Khám Bệnh Tổng Quát",
      headDoctor: "PGS. TS. Trần Minh Tuấn",
      location: "Tầng 1 - Khu A",
      roomsTotal: 10,
      roomsActive: 8,
      doctorsOnDuty: 8,
      patientsWaiting: 42,
      avgWait: "11 phút",
      loadLevel: 68,
      status: "active",
    },
    {
      id: "K-02",
      name: "Khoa Tim Mạch & Chuyển Hóa",
      headDoctor: "TS. BS. Nguyễn Hoài Nam",
      location: "Tầng 2 - Khu B",
      roomsTotal: 6,
      roomsActive: 4,
      doctorsOnDuty: 5,
      patientsWaiting: 36,
      avgWait: "24 phút",
      loadLevel: 88,
      status: "busy",
    },
    {
      id: "K-03",
      name: "Khoa Chẩn Đoán Hình Ảnh",
      headDoctor: "BS. CKII. Lê Hoàng Long",
      location: "Tầng Trệt - Khu C",
      roomsTotal: 5,
      roomsActive: 3,
      doctorsOnDuty: 4,
      patientsWaiting: 22,
      avgWait: "14 phút",
      loadLevel: 62,
      status: "active",
    },
    {
      id: "K-04",
      name: "Khoa Xét Nghiệm Y Khoa & Huyết Học",
      headDoctor: "TS. Dược sĩ. Đỗ Thị Hải",
      location: "Tầng 2 - Khu A",
      roomsTotal: 8,
      roomsActive: 6,
      doctorsOnDuty: 6,
      patientsWaiting: 49,
      avgWait: "8 phút",
      loadLevel: 54,
      status: "active",
    },
    {
      id: "K-05",
      name: "Khoa Tai - Mũi - Họng",
      headDoctor: "BS. CKI. Phạm Văn Dũng",
      location: "Tầng 3 - Khu B",
      roomsTotal: 4,
      roomsActive: 3,
      doctorsOnDuty: 4,
      patientsWaiting: 28,
      avgWait: "16 phút",
      loadLevel: 74,
      status: "active",
    },
    {
      id: "K-06",
      name: "Khoa Cấp Cứu Ban Đầu & Hồi Sức",
      headDoctor: "ThS. BS. Vũ Quốc Cường",
      location: "Tầng Trệt - Cổng Số 1",
      roomsTotal: 8,
      roomsActive: 8,
      doctorsOnDuty: 6,
      patientsWaiting: 7,
      avgWait: "2 phút",
      loadLevel: 45,
      status: "active",
    },
  ];

  const filtered = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Quản trị Khoa & Chuyên khoa Bệnh viện
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Cấu hình nhân sự trực, buồng khám thực tế và định mức phân tải cho AI Agent.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Thêm khoa chuyên môn mới
          </Button>
        </div>
      </div>

      {/* Filter / Search bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E8ECEE]">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#667078]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên khoa hoặc mã..."
            className="pl-8 text-xs bg-[#F7F9FA] border-[#E8ECEE] h-8"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-[#667078]">
          <span>Hiển thị: <strong>{filtered.length} khoa hoạt động</strong></span>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((dept) => (
          <Card key={dept.id} className="bg-white border-[#E8ECEE] shadow-none rounded-xl hover:border-[#ABE3DF] transition-colors">
            <CardHeader className="p-4 pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-[#F0F8F7] text-[#147D8D] border-[#ABE3DF] text-[10px]">
                  {dept.id}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    dept.status === "busy"
                      ? "bg-amber-50 text-amber-800 border-amber-200 text-[10px]"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                  }
                >
                  {dept.status === "busy" ? "Tải cao" : "Bình thường"}
                </Badge>
              </div>

              <CardTitle className="text-sm font-bold text-[#171A1C] mt-2">
                {dept.name}
              </CardTitle>
              <CardDescription className="text-[11px] text-[#667078]">
                {dept.location} • Trưởng khoa: {dept.headDoctor}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-1 space-y-3">
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE] text-center">
                <div>
                  <p className="text-[10px] text-[#667078]">Phòng trực</p>
                  <p className="text-xs font-bold text-[#171A1C]">{dept.roomsActive}/{dept.roomsTotal}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#667078]">Đang chờ</p>
                  <p className="text-xs font-bold text-[#147D8D]">{dept.patientsWaiting}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#667078]">Chờ TB</p>
                  <p className="text-xs font-bold text-[#171A1C]">{dept.avgWait}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#667078]">Mức độ phân tải</span>
                  <span className={`font-semibold ${dept.loadLevel >= 85 ? "text-amber-600" : "text-[#147D8D]"}`}>
                    {dept.loadLevel}%
                  </span>
                </div>
                <div className="w-full bg-gray-200/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dept.loadLevel >= 85 ? "bg-amber-500" : "bg-[#147D8D]"}`}
                    style={{ width: `${dept.loadLevel}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8ECEE] flex items-center justify-between">
                <Button variant="ghost" size="sm" className="h-7 text-[11px] text-[#667078] hover:text-[#171A1C]">
                  Xem hàng đợi
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px] border-[#E8ECEE] text-[#147D8D] hover:bg-[#F0F8F7]">
                  <Settings2 className="w-3 h-3 mr-1" />
                  Cấu hình tải
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
