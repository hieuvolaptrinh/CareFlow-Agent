"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Filter,
  Flame,
  Gauge,
  HelpCircle,
  Pause,
  Play,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgentMonitorPage() {
  const [filterType, setFilterType] = useState("all");

  const sessions = [
    {
      id: "SESS-9041",
      patient: "Nguyễn Văn An (BN-2026-081)",
      intent: "Hỏi bước tiếp theo sau khi lấy máu",
      status: "completed",
      latency: "342ms",
      tokens: "428 tok",
      decision: "Chỉ đường tới Phòng Đo Điện tim 108 theo sơ đồ Tầng 1",
      handoff: false,
    },
    {
      id: "SESS-9040",
      patient: "Lê Thị Bích (BN-2026-094)",
      intent: "Than phiền chóng mặt và đau ngực sau chạy bộ",
      status: "escalated",
      latency: "210ms",
      tokens: "196 tok",
      decision: "KÍCH HOẠT HANDOFF: Cảnh báo triệu chứng nguy cơ cao -> Bác sĩ PK 102",
      handoff: true,
    },
    {
      id: "SESS-9039",
      patient: "Trần Quốc Hưng (BN-2026-112)",
      intent: "Tra cứu kết quả xét nghiệm sinh hóa máu",
      status: "completed",
      latency: "512ms",
      tokens: "810 tok",
      decision: "Trích xuất RAG: Bác sĩ đã duyệt kết quả lúc 12:45, hướng dẫn quay lại PK 101",
      handoff: false,
    },
    {
      id: "SESS-9038",
      patient: "Phạm Thu Thảo (BN-2026-115)",
      intent: "Hỏi thuốc kháng sinh uống trước hay sau ăn",
      status: "completed",
      latency: "395ms",
      tokens: "380 tok",
      decision: "Trích dẫn Dược thư quốc gia & đơn thuốc điện tử: Uống sau ăn 30 phút",
      handoff: false,
    },
    {
      id: "SESS-9037",
      patient: "Đỗ Minh Khang (BN-2026-120)",
      intent: "Xin đổi phòng khám do chờ lâu",
      status: "completed",
      latency: "288ms",
      tokens: "245 tok",
      decision: "Tự động phân bổ lại sang PK Nội 104 (thời gian chờ còn 6 phút)",
      handoff: false,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse inline-block" />
              Vertex AI Cluster Health
            </Badge>
            <span className="text-xs text-[#667078]">Region: asia-southeast1 (Singapore)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Giám sát AI Agent & Vertex AI Runtime
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Theo dõi độ trễ, lưu lượng token, tỷ lệ chuyển giao người thật (Handoff) và phiên hội thoại y tế trực tiếp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="border-[#E8ECEE] text-xs text-[#667078] hover:text-[#171A1C] hover:bg-white"
          >
            <Pause className="w-3.5 h-3.5 mr-1.5" />
            Tạm dừng Stream
          </Button>
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Làm mới số liệu
          </Button>
        </div>
      </div>

      {/* Cluster Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Tốc độ phản hồi TB (Latency)</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F8F7] text-[#147D8D] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#171A1C]">372 ms</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              ✓ Nhanh hơn 18% so với SLA tối đa 500ms
            </p>
          </div>
        </Card>

        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Lưu lượng Token / Phút</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#171A1C]">48.2k tok/min</div>
            <p className="text-[11px] text-[#667078] font-medium mt-1">
              Đỉnh tải: 72k tok lúc 09:15 sáng
            </p>
          </div>
        </Card>

        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Tỷ lệ Human Handoff</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#171A1C]">1.42%</div>
            <p className="text-[11px] text-[#147D8D] font-medium mt-1">
              Ngưỡng quy chuẩn: Dưới 3.0%
            </p>
          </div>
        </Card>

        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Độ chính xác RAG Y khoa</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-[#171A1C]">99.85%</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              100% câu trả lời có trích dẫn nguồn
            </p>
          </div>
        </Card>
      </div>

      {/* Realtime Session Stream Table */}
      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl">
        <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-bold text-[#171A1C] flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#147D8D]" />
              Các Phiên Điều phối AI Đang Diễn ra (Active AI Dispatch Sessions)
            </CardTitle>
            <CardDescription className="text-xs text-[#667078] mt-0.5">
              Chi tiết prompt bệnh nhân, chuỗi suy luận (Reasoning Trace) và quyết định y khoa của Agent.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#667078]" />
              <input
                type="text"
                placeholder="Lọc phiên hoặc tên BN..."
                className="w-full bg-[#F7F9FA] border border-[#E8ECEE] rounded-lg pl-8 pr-3 py-1 text-xs text-[#171A1C] placeholder:text-[#667078] focus:outline-none focus:border-[#147D8D]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F7F9FA]">
                <TableRow className="border-b border-[#E8ECEE]">
                  <TableHead className="text-xs font-semibold text-[#171A1C]">Mã phiên</TableHead>
                  <TableHead className="text-xs font-semibold text-[#171A1C]">Bệnh nhân</TableHead>
                  <TableHead className="text-xs font-semibold text-[#171A1C]">Ý định (Intent)</TableHead>
                  <TableHead className="text-xs font-semibold text-[#171A1C]">Quyết định Điều phối của Agent</TableHead>
                  <TableHead className="text-xs font-semibold text-[#171A1C] text-right">Độ trễ</TableHead>
                  <TableHead className="text-xs font-semibold text-[#171A1C] text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#E8ECEE]">
                {sessions.map((sess) => (
                  <TableRow key={sess.id} className="hover:bg-[#F0F8F7]/50 transition-colors">
                    <TableCell className="text-xs font-mono font-medium text-[#147D8D]">
                      {sess.id}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#171A1C]">
                      {sess.patient}
                    </TableCell>
                    <TableCell className="text-xs text-[#667078] max-w-[220px] truncate">
                      {sess.intent}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className={`font-medium ${sess.handoff ? "text-amber-800 font-semibold" : "text-[#171A1C]"}`}>
                        {sess.decision}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono text-[#667078]">
                      {sess.latency}
                    </TableCell>
                    <TableCell className="text-center">
                      {sess.handoff ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                          Handoff Bác sĩ
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-[#F0F8F7] text-[#147D8D] border-[#ABE3DF] text-[10px]">
                          Tự động 100%
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
