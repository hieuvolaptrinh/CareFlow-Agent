"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileSpreadsheet,
  Plus,
  QrCode,
  Receipt,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BillingStaffPage() {
  const [invoices, setInvoices] = useState([
    {
      id: "HD-2026-1042",
      patient: "Nguyễn Văn An",
      code: "BN-2026-081",
      totalCost: "595.000 đ",
      insurancePay: "476.000 đ",
      patientPay: "119.000 đ",
      status: "paid",
      time: "12:56",
    },
    {
      id: "HD-2026-1041",
      patient: "Trần Văn Bình",
      code: "BN-2026-075",
      totalCost: "1.250.000 đ",
      insurancePay: "1.000.000 đ",
      patientPay: "250.000 đ",
      status: "pending",
      time: "12:51",
    },
    {
      id: "HD-2026-1040",
      patient: "Lê Thị Thu",
      code: "BN-2026-068",
      totalCost: "340.000 đ",
      insurancePay: "272.000 đ",
      patientPay: "68.000 đ",
      status: "paid",
      time: "12:40",
    },
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Thu Viện Phí & Giám Định BHYT Tự Động
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Quyết toán viện phí điện tử, tự động bóc tách tỷ lệ chi trả của BHYT và đồng bộ hoá đơn điện tử sang cổng cơ quan thuế.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <CreditCard className="w-3.5 h-3.5 mr-1.5" />
            Tạo phiếu thu viện phí mới
          </Button>
        </div>
      </div>

      {/* Invoice Table */}
      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F7F9FA]">
            <TableRow className="border-b border-[#E8ECEE]">
              <TableHead className="text-xs font-semibold text-[#171A1C]">Mã Hoá Đơn</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Bệnh nhân</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-right">Tổng chi phí</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-right">BHYT chi trả (80%)</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-right">BN cùng chi trả</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-center">Trạng thái</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#E8ECEE]">
            {invoices.map((inv) => (
              <TableRow key={inv.id} className="hover:bg-[#F0F8F7]/50 transition-colors">
                <TableCell className="text-xs font-mono font-medium text-[#147D8D]">
                  {inv.id}
                </TableCell>
                <TableCell className="text-xs font-medium text-[#171A1C]">
                  <div>{inv.patient}</div>
                  <div className="text-[10px] text-[#667078] font-mono">{inv.code}</div>
                </TableCell>
                <TableCell className="text-xs font-semibold text-right text-[#171A1C]">
                  {inv.totalCost}
                </TableCell>
                <TableCell className="text-xs text-right text-emerald-600 font-medium">
                  {inv.insurancePay}
                </TableCell>
                <TableCell className="text-xs font-bold text-right text-[#147D8D]">
                  {inv.patientPay}
                </TableCell>
                <TableCell className="text-center">
                  {inv.status === "paid" ? (
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      Đã thanh toán
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                      Chờ thanh toán
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {inv.status === "paid" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-[#E8ECEE] text-[#147D8D] hover:bg-[#F0F8F7]"
                    >
                      <Receipt className="w-3 h-3 mr-1" />
                      In biên lai
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-[#147D8D] hover:bg-[#106b79] text-white"
                    >
                      <QrCode className="w-3 h-3 mr-1" />
                      Quét VietQR
                    </Button>
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
