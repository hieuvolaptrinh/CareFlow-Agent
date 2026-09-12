"use client";

import { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UsersAdminPage() {
  const [search, setSearch] = useState("");

  const staff = [
    {
      id: "NV-01",
      name: "BS. CKI. Lê Quốc Bảo",
      email: "lequocbao@evergreen.care",
      role: "Bác Sĩ Điều Trị",
      department: "Khoa Khám Bệnh",
      phone: "0912 345 678",
      status: "active",
      duty: "Đang trực tại PK 101",
    },
    {
      id: "NV-02",
      name: "TS. BS. Nguyễn Hoài Nam",
      email: "nguyenhoainam@evergreen.care",
      role: "Trưởng Khoa / Bác Sĩ",
      department: "Khoa Tim Mạch",
      phone: "0913 456 789",
      status: "active",
      duty: "Đang khám tại PK 102",
    },
    {
      id: "NV-03",
      name: "ĐD. Phạm Thị Mai",
      email: "maipham@evergreen.care",
      role: "Điều Dưỡng Trưởng",
      department: "Khoa Khám Bệnh",
      phone: "0918 888 999",
      status: "active",
      duty: "Hỗ trợ buồng khám tầng 1",
    },
    {
      id: "NV-04",
      name: "KTV. Trần Đình Trọng",
      email: "trongtran@evergreen.care",
      role: "Kỹ Thuật Viên CĐHA",
      department: "Chẩn Đoán Hình Ảnh",
      phone: "0904 112 233",
      status: "active",
      duty: "Trực phòng X-Quang 01",
    },
    {
      id: "NV-05",
      name: "BS. Nguyễn Quản Trị",
      email: "quantri@evergreen.care",
      role: "Quản Trị Viên Cấp Cao",
      department: "Ban Giám Đốc BV",
      phone: "0909 999 888",
      status: "active",
      duty: "Điều hành trung tâm",
    },
  ];

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Quản trị Nhân sự & Phân quyền Hệ thống
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Danh sách bác sĩ chuyên khoa, điều dưỡng, kỹ thuật viên và cấp phép tài khoản truy cập.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Cấp mới tài khoản nhân viên
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E8ECEE]">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#667078]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bác sĩ, khoa, email..."
            className="pl-8 text-xs bg-[#F7F9FA] border-[#E8ECEE] h-8"
          />
        </div>

        <div className="text-xs text-[#667078]">
          Hiển thị: <strong>{filtered.length} nhân sự</strong>
        </div>
      </div>

      {/* Staff Table */}
      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F7F9FA]">
            <TableRow className="border-b border-[#E8ECEE]">
              <TableHead className="text-xs font-semibold text-[#171A1C]">Nhân sự y tế</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Vai trò</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Khoa phòng</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Liên hệ</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Ca trực hiện tại</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#E8ECEE]">
            {filtered.map((s) => (
              <TableRow key={s.id} className="hover:bg-[#F0F8F7]/50 transition-colors">
                <TableCell className="text-xs font-medium text-[#171A1C]">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="w-7 h-7 border border-[#ABE3DF]">
                      <AvatarFallback className="bg-[#147D8D] text-white text-[10px]">
                        {s.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{s.name}</div>
                      <div className="text-[10px] text-[#667078]">{s.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-[#147D8D]">
                  {s.role}
                </TableCell>
                <TableCell className="text-xs text-[#667078]">
                  {s.department}
                </TableCell>
                <TableCell className="text-xs text-[#667078]">
                  {s.phone}
                </TableCell>
                <TableCell className="text-xs text-[#171A1C]">
                  {s.duty}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    Đang trực
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
