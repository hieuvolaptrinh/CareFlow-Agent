"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  Package,
  Pill,
  QrCode,
  Search,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PharmacyStaffPage() {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: "RX-2026-8921",
      patient: "Nguyễn Văn An",
      code: "BN-2026-081",
      doctor: "BS. Lê Quốc Bảo",
      medCount: 2,
      time: "12:54",
      status: "ready", // ready | preparing | completed
    },
    {
      id: "RX-2026-8920",
      patient: "Trần Văn Bình",
      code: "BN-2026-075",
      doctor: "BS. Nguyễn Hoài Nam",
      medCount: 4,
      time: "12:48",
      status: "preparing",
    },
    {
      id: "RX-2026-8919",
      patient: "Lê Thị Thu",
      code: "BN-2026-068",
      doctor: "BS. Phạm Văn Dũng",
      medCount: 3,
      time: "12:35",
      status: "completed",
    },
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Quầy Dược & Cấp Phát Thuốc Điện Tử
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Dược sĩ lâm sàng đối soát đơn thuốc, kiểm tra tương tác chéo và bàn giao thuốc kèm hướng dẫn sử dụng.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 mr-1.5" />
            Quét mã đơn thuốc trên toa
          </Button>
        </div>
      </div>

      {/* Pharmacy Queue Table */}
      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F7F9FA]">
            <TableRow className="border-b border-[#E8ECEE]">
              <TableHead className="text-xs font-semibold text-[#171A1C]">Mã Đơn</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Bệnh nhân</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Bác sĩ kê đơn</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-center">Số khoản thuốc</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Thời gian</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-center">Trạng thái</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#E8ECEE]">
            {prescriptions.map((rx) => (
              <TableRow key={rx.id} className="hover:bg-[#F0F8F7]/50 transition-colors">
                <TableCell className="text-xs font-mono font-medium text-[#147D8D]">
                  {rx.id}
                </TableCell>
                <TableCell className="text-xs font-medium text-[#171A1C]">
                  <div>{rx.patient}</div>
                  <div className="text-[10px] text-[#667078] font-mono">{rx.code}</div>
                </TableCell>
                <TableCell className="text-xs text-[#667078]">
                  {rx.doctor}
                </TableCell>
                <TableCell className="text-xs text-center font-bold text-[#171A1C]">
                  {rx.medCount} loại
                </TableCell>
                <TableCell className="text-xs text-[#667078]">
                  {rx.time}
                </TableCell>
                <TableCell className="text-center">
                  {rx.status === "ready" ? (
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      Sẵn sàng phát
                    </Badge>
                  ) : rx.status === "preparing" ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                      Đang soạn thuốc
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-[#F0F8F7] text-[#147D8D] border-[#ABE3DF] text-[10px]">
                      Đã bàn giao
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={rx.status === "ready" ? "default" : "outline"}
                    className={`h-7 text-xs ${
                      rx.status === "ready"
                        ? "bg-[#147D8D] hover:bg-[#106b79] text-white"
                        : "border-[#E8ECEE] text-[#667078]"
                    }`}
                  >
                    <Package className="w-3 h-3 mr-1" />
                    Bàn giao thuốc
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
