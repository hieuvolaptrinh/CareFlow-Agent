"use client";

import { useState } from "react";
import {
  Clock,
  Download,
  FileSpreadsheet,
  Filter,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ServicesAdminPage() {
  const [search, setSearch] = useState("");

  const services = [
    {
      code: "DV-01",
      name: "Khám bệnh chuyên khoa Tim Mạch",
      category: "Khám Lâm Sàng",
      department: "Khoa Tim Mạch",
      price: "150.000 đ",
      insuranceCover: "80%",
      avgDuration: "15 phút",
      status: "active",
    },
    {
      code: "DV-02",
      name: "Chụp X-Quang Ngực Thẳng Kỹ Thuật Số (1 tư thế)",
      category: "Chẩn Đoán Hình Ảnh",
      department: "Chẩn Đoán Hình Ảnh",
      price: "120.000 đ",
      insuranceCover: "100%",
      avgDuration: "8 phút",
      status: "active",
    },
    {
      code: "DV-03",
      name: "Tổng Phân Tích Tế Bào Máu Ngoại Vi (24 chỉ số)",
      category: "Xét Nghiệm",
      department: "Khoa Xét Nghiệm",
      price: "95.000 đ",
      insuranceCover: "100%",
      avgDuration: "25 phút",
      status: "active",
    },
    {
      code: "DV-04",
      name: "Siêu Âm Doppler Tim Màu Trực Tiếp",
      category: "Thăm Dò Chức Năng",
      department: "Khoa Tim Mạch",
      price: "350.000 đ",
      insuranceCover: "80%",
      avgDuration: "20 phút",
      status: "active",
    },
    {
      code: "DV-05",
      name: "Chụp Cắt Lớp Vi Tính (CT-Scanner) Sọ Não không tiêm thuốc",
      category: "Chẩn Đoán Hình Ảnh",
      department: "Chẩn Đoán Hình Ảnh",
      price: "1.050.000 đ",
      insuranceCover: "80%",
      avgDuration: "30 phút",
      status: "active",
    },
  ];

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Danh mục Kỹ thuật Y tế & Bảng giá Dịch vụ
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Định mức thời gian thực hiện (SLA), tỷ lệ thanh toán BHYT và kết nối mã tương thích TT50/Bộ Y Tế.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Thêm dịch vụ kỹ thuật
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E8ECEE]">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#667078]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên dịch vụ, mã kỹ thuật..."
            className="pl-8 text-xs bg-[#F7F9FA] border-[#E8ECEE] h-8"
          />
        </div>

        <div className="text-xs text-[#667078]">
          Hiển thị: <strong>{filtered.length} dịch vụ</strong>
        </div>
      </div>

      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F7F9FA]">
            <TableRow className="border-b border-[#E8ECEE]">
              <TableHead className="text-xs font-semibold text-[#171A1C]">Mã DV</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Tên dịch vụ kỹ thuật</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Phân loại</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Khoa thực hiện</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-right">Đơn giá</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-center">BHYT</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-right">Thời gian chuẩn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#E8ECEE]">
            {filtered.map((s) => (
              <TableRow key={s.code} className="hover:bg-[#F0F8F7]/50 transition-colors">
                <TableCell className="text-xs font-mono font-medium text-[#147D8D]">
                  {s.code}
                </TableCell>
                <TableCell className="text-xs font-medium text-[#171A1C]">
                  {s.name}
                </TableCell>
                <TableCell className="text-xs text-[#667078]">
                  {s.category}
                </TableCell>
                <TableCell className="text-xs text-[#667078]">
                  {s.department}
                </TableCell>
                <TableCell className="text-xs font-semibold text-right text-[#171A1C]">
                  {s.price}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-[#F0F8F7] text-[#147D8D] border-[#ABE3DF] text-[10px]">
                    {s.insuranceCover}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-right font-medium text-[#667078]">
                  {s.avgDuration}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
