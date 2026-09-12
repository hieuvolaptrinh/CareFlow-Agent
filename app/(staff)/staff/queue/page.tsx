"use client";

import { useState } from "react";
import {
  ArrowRight,
  Clock,
  Filter,
  Play,
  RefreshCw,
  Search,
  SkipForward,
  UserCheck,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function QueueStaffPage() {
  const [currentCalling, setCurrentCalling] = useState(14);

  const patients = [
    { stt: 14, name: "Nguyễn Văn An", age: 52, room: "PK 101", status: "examining", triage: "Bình thường", wait: "Trong phòng" },
    { stt: 15, name: "Trần Thị Lan", age: 48, room: "PK 101", status: "next", triage: "Bình thường", wait: "8 phút" },
    { stt: 16, name: "Phạm Quốc Dũng", age: 63, room: "PK 101", status: "waiting", triage: "Ưu tiên cao tuổi", wait: "16 phút" },
    { stt: 17, name: "Lê Thu Hà", age: 29, room: "PK 101", status: "waiting", triage: "Bình thường", wait: "22 phút" },
    { stt: 18, name: "Hoàng Minh Trí", age: 37, room: "PK 101", status: "waiting", triage: "Bình thường", wait: "28 phút" },
    { stt: 19, name: "Vũ Đình Nam", age: 41, room: "PK 101", status: "waiting", triage: "Bình thường", wait: "34 phút" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Điều Phối Hàng Đợi & Phát Thanh Gọi Số
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Quản lý số thứ tự trực tiếp tại Phòng khám 101. Hỗ trợ gọi qua loa tự động và chuyển tiếp buồng khám.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
            onClick={() => setCurrentCalling(prev => prev + 1)}
          >
            <Volume2 className="w-3.5 h-3.5 mr-1.5" />
            Gọi số tiếp theo (STT {currentCalling + 1})
          </Button>
        </div>
      </div>

      {/* Realtime Broadcast Speaker Board */}
      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-6 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF9F7] border border-[#ABE3DF] text-xs font-semibold text-[#147D8D]">
            <Volume2 className="w-4 h-4 animate-bounce" />
            Hệ thống Loa Thông Báo Bệnh Viện
          </div>

          <div>
            <div className="text-5xl font-black text-[#147D8D] tracking-tight">
              STT {currentCalling}
            </div>
            <p className="text-sm font-bold text-[#171A1C] mt-2">
              Bệnh nhân: Nguyễn Văn An
            </p>
            <p className="text-xs text-[#667078]">
              Mời vào <strong>Phòng khám 101 (Tầng 1 - Khu A)</strong>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="border-[#E8ECEE] text-xs hover:bg-[#F0F8F7] text-[#147D8D]"
            >
              <Volume2 className="w-3.5 h-3.5 mr-1" />
              Phát lại âm thanh
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-[#E8ECEE] text-xs hover:bg-rose-50 text-rose-600"
            >
              <SkipForward className="w-3.5 h-3.5 mr-1" />
              Bỏ qua / Vắng mặt
            </Button>
          </div>
        </div>
      </Card>

      {/* Queue List Table */}
      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl overflow-hidden">
        <CardHeader className="p-4 pb-3 border-b border-[#E8ECEE]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-[#171A1C]">
              Danh Sách Đang Chờ Trước Buồng 101 ({patients.length} bệnh nhân)
            </CardTitle>
            <span className="text-xs text-[#667078]">Tự động cập nhật qua WebSocket</span>
          </div>
        </CardHeader>

        <Table>
          <TableHeader className="bg-[#F7F9FA]">
            <TableRow className="border-b border-[#E8ECEE]">
              <TableHead className="text-xs font-semibold text-[#171A1C] text-center w-20">Số TT</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Bệnh nhân</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Phân loại ưu tiên</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C]">Thời gian chờ</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-center">Trạng thái</TableHead>
              <TableHead className="text-xs font-semibold text-[#171A1C] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#E8ECEE]">
            {patients.map((p) => (
              <TableRow key={p.stt} className="hover:bg-[#F0F8F7]/50 transition-colors">
                <TableCell className="text-center font-bold font-mono text-sm text-[#147D8D]">
                  {p.stt}
                </TableCell>
                <TableCell className="text-xs font-medium text-[#171A1C]">
                  {p.name} <span className="text-[#667078] font-normal">({p.age}t)</span>
                </TableCell>
                <TableCell className="text-xs">
                  {p.triage.includes("Ưu tiên") ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                      {p.triage}
                    </Badge>
                  ) : (
                    <span className="text-[#667078]">{p.triage}</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-[#667078]">
                  {p.wait}
                </TableCell>
                <TableCell className="text-center">
                  {p.status === "examining" ? (
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      Đang khám
                    </Badge>
                  ) : p.status === "next" ? (
                    <Badge className="bg-[#147D8D] text-white text-[10px]">
                      Kế tiếp
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-[#667078]">
                      Chờ gọi
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-[#E8ECEE] text-[#147D8D] hover:bg-[#F0F8F7]"
                  >
                    Gọi vào
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
