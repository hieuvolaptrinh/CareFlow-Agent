"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  FileCheck2,
  Filter,
  Search,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AuditLogsAdminPage() {
  const [search, setSearch] = useState("");

  const logs = [
    {
      id: "LOG-2026-9812",
      timestamp: "12:58:20 12/09/2026",
      actor: "CareFlow Agent (Vertex)",
      target: "BN. Lê Thu Trang (BN-142)",
      action: "Tái phân bổ hàng đợi tự động",
      details: "Chuyển từ PK 103 sang PK 105 theo chính sách POL-SAFE-05",
      severity: "info",
    },
    {
      id: "LOG-2026-9811",
      timestamp: "12:56:45 12/09/2026",
      actor: "CareFlow Agent (Vertex)",
      target: "BN. Trần Văn Bình (BN-892)",
      action: "Kích hoạt Cảnh báo Handoff Cấp cứu",
      details: "SpO2 = 92% dưới ngưỡng cho phép. Đã thông báo điều dưỡng trưởng.",
      severity: "critical",
    },
    {
      id: "LOG-2026-9810",
      timestamp: "12:50:14 12/09/2026",
      actor: "BS. Nguyễn Văn Hùng",
      target: "BN. Vũ Quốc An (BN-110)",
      action: "Ký số Đơn thuốc Điện tử",
      details: "Xác nhận đơn thuốc điều trị Viêm họng cấp (Amoxicillin 500mg)",
      severity: "success",
    },
    {
      id: "LOG-2026-9809",
      timestamp: "12:44:30 12/09/2026",
      actor: "BS. Nguyễn Quản Trị",
      target: "Hệ thống AI Cluster",
      action: "Cập nhật Ranh giới Phân loại",
      details: "Điều chỉnh thời gian chờ tối đa tại Khoa Tim Mạch xuống 20 phút",
      severity: "warning",
    },
    {
      id: "LOG-2026-9808",
      timestamp: "12:35:10 12/09/2026",
      actor: "CareFlow Agent (Vertex)",
      target: "BN. Đinh Gia Huy (BN-128)",
      action: "Điều phối Cận lâm sàng song song",
      details: "Sinh lịch chụp X-Quang ngực thẳng và Xét nghiệm Công thức máu",
      severity: "info",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Nhật ký Kiểm toán Y tế & Truy vết Quyết định
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Ghi nhận bất biến 100% các can thiệp hệ thống, quyết định của AI và thao tác của nhân sự y tế.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="border-[#E8ECEE] text-xs text-[#667078] hover:text-[#171A1C] hover:bg-white"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Xuất file CSV/Excel
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
            placeholder="Tìm theo mã log, người thực hiện hoặc bệnh nhân..."
            className="pl-8 text-xs bg-[#F7F9FA] border-[#E8ECEE] h-8"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#667078]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Lưu trữ bất biến: SHA-256 Checksum Verified</span>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F7F9FA]">
            <TableRow className="border-b border-[#E8ECEE]">
              <TableHead className="text-xs font-semibold text-[#171A1C]">Mã Audit</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Thời gian</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Tác nhân thực thi</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Đối tượng</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Hành động & Chi tiết</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-center">Mức độ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#E8ECEE]">
            {logs.map((l) => (
              <TableRow key={l.id} className="hover:bg-[#F0F8F7]/50 transition-colors">
                <TableCell className="text-xs font-mono font-medium text-[#147D8D]">
                  {l.id}
                </TableCell>
                <TableCell className="text-xs text-[#667078]">
                  {l.timestamp}
                </TableCell>
                <TableCell className="text-xs font-medium text-[#171A1C]">
                  {l.actor}
                </TableCell>
                <TableCell className="text-xs text-[#171A1C]">
                  {l.target}
                </TableCell>
                <TableCell className="text-xs">
                  <div className="font-medium text-[#171A1C]">{l.action}</div>
                  <div className="text-[11px] text-[#667078]">{l.details}</div>
                </TableCell>
                <TableCell className="text-center">
                  {l.severity === "critical" ? (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px]">
                      Khẩn cấp
                    </Badge>
                  ) : l.severity === "warning" ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                      Cảnh báo
                    </Badge>
                  ) : l.severity === "success" ? (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      Thành công
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-[#F0F8F7] text-[#147D8D] border-[#ABE3DF] text-[10px]">
                      Thông tin
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
