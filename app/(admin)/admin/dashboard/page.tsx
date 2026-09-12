"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  Eye,
  FileCheck2,
  Filter,
  Flame,
  HeartPulse,
  HelpCircle,
  Layers,
  MoreVertical,
  Network,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for real-time departments
  const departments = [
    {
      id: "K-01",
      name: "Khoa Khám Tổng Quát",
      doctorCount: 8,
      roomsActive: 8,
      waitingCount: 42,
      avgWaitTime: "11 phút",
      loadPercent: 68,
      status: "optimal", // optimal | high | busy
    },
    {
      id: "K-02",
      name: "Khoa Tim Mạch & Nội Tiết",
      doctorCount: 5,
      roomsActive: 4,
      waitingCount: 36,
      avgWaitTime: "24 phút",
      loadPercent: 88,
      status: "high",
    },
    {
      id: "K-03",
      name: "Chẩn Đoán Hình Ảnh (X-Quang, CT, MRI)",
      doctorCount: 4,
      roomsActive: 3,
      waitingCount: 22,
      avgWaitTime: "14 phút",
      loadPercent: 62,
      status: "optimal",
    },
    {
      id: "K-04",
      name: "Khoa Xét Nghiệm & Huyết Học",
      doctorCount: 6,
      roomsActive: 6,
      waitingCount: 49,
      avgWaitTime: "8 phút",
      loadPercent: 54,
      status: "optimal",
    },
    {
      id: "K-05",
      name: "Khoa Tai Mũi Họng & Mắt",
      doctorCount: 4,
      roomsActive: 3,
      waitingCount: 28,
      avgWaitTime: "16 phút",
      loadPercent: 74,
      status: "optimal",
    },
    {
      id: "K-06",
      name: "Khoa Cấp Cứu Ban Đầu",
      doctorCount: 6,
      roomsActive: 6,
      waitingCount: 7,
      avgWaitTime: "2 phút",
      loadPercent: 45,
      status: "optimal",
    },
  ];

  // Live Agent event stream
  const liveEvents = [
    {
      id: "EV-108",
      time: "12:58:20",
      type: "reroute",
      title: "Tối ưu hóa hàng đợi động",
      desc: "Agent tự động chuyển BN Lê Thu Trang (STT 142) từ PK 103 sang PK 105 để giảm thời gian chờ 15 phút.",
      tag: "Dynamic Reroute",
      color: "bg-[#F0F8F7] text-[#147D8D] border-[#ABE3DF]",
    },
    {
      id: "EV-107",
      time: "12:56:45",
      type: "safety_flag",
      title: "Cảnh báo chỉ số sinh hiệu",
      desc: "Phát hiện SpO2 BN Trần Văn Bình (74t) giảm còn 92% tại sảnh chờ. Đã kích hoạt điều dưỡng viên tiếp cận hỗ trợ.",
      tag: "Safety Escalation",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      id: "EV-106",
      time: "12:54:10",
      type: "order_dispatch",
      title: "Điều phối cận lâm sàng song song",
      desc: "Bác sĩ hoàn thành chỉ định: Agent kích hoạt đồng thời Xét nghiệm Máu và Siêu âm Doppler tối ưu quãng đường di chuyển.",
      tag: "Smart Batching",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "EV-105",
      time: "12:51:30",
      type: "completed",
      title: "Hoàn tất hành trình khám & Đơn thuốc số",
      desc: "BN Hoàng Minh Tâm hoàn tất nhận thuốc tại Quầy Dược 2. Tóm tắt bệnh án điện tử đã gửi về Zalo bệnh nhân.",
      tag: "Careflow Finished",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  // Active Safety & Escalations
  const activeAlerts = [
    {
      id: "ALT-01",
      severity: "warning",
      title: "Chờ lấy mẫu xét nghiệm tăng cục bộ tại Tầng 2",
      desc: "Số lượng mẫu huyết học tăng 30% trong 20 phút qua. Đề xuất mở thêm Bàn lấy mẫu số 5.",
      time: "5 phút trước",
    },
    {
      id: "ALT-02",
      severity: "critical",
      title: "Yêu cầu can thiệp Handoff người thật (Ca #BN-892)",
      desc: "Bệnh nhân có triệu chứng đau ngực cấp chưa qua phân loại sơ bộ tại Cổng tiếp nhận.",
      time: "8 phút trước",
    },
    {
      id: "ALT-03",
      severity: "info",
      title: "Bảo trì định kỳ Máy MRI 1.5T",
      desc: "Dự kiến 16:30 - 17:30. Hệ thống đã tự động dời lịch các ca chụp không khẩn sang ngày mai.",
      time: "25 phút trước",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Operational Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping inline-block" />
              Live Hospital Operations
            </Badge>
            <span className="text-xs text-[#667078]">Ca trực: 07:00 - 15:30 (Hôm nay)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Trung tâm Điều hành & Giám sát Bệnh viện
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Bảng theo dõi thời gian thực phân bổ bệnh nhân, năng lực phòng khám và hoạt động AI Agent.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="border-[#E8ECEE] text-xs text-[#667078] hover:text-[#171A1C] hover:bg-white"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Làm mới (30s)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#E8ECEE] text-xs text-[#667078] hover:text-[#171A1C] hover:bg-white"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Xuất báo cáo ca
          </Button>
          <Link href="/admin/workflows">
            <Button
              size="sm"
              className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
            >
              <Network className="w-3.5 h-3.5 mr-1.5" />
              Cấu hình luồng khám
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Key Performance Indicator (KPI) Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Tổng lượt tiếp nhận</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F8F7] text-[#147D8D] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#171A1C] tracking-tight">1,284</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% so với cùng giờ hôm qua</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E8ECEE] flex justify-between text-[11px] text-[#667078]">
            <span>Mục tiêu ngày: 1,450 ca</span>
            <span className="font-semibold text-[#171A1C]">88.5%</span>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">BN đang trong luồng khám</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#171A1C] tracking-tight">342</div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#147D8D] mt-1 font-medium">
              <Bot className="w-3.5 h-3.5" />
              <span>318 ca (93%) AI đang dẫn hướng</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E8ECEE] flex justify-between text-[11px] text-[#667078]">
            <span>Đã xuất viện / Ra về</span>
            <span className="font-semibold text-emerald-600">942 ca</span>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Thời gian chờ trung bình</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#171A1C] tracking-tight">18.5 phút</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-1 font-medium">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Giảm 32% (so với 27.2p trước đây)</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E8ECEE] flex justify-between text-[11px] text-[#667078]">
            <span>Chỉ tiêu bệnh viện</span>
            <span className="font-semibold text-[#171A1C]">&lt; 25 phút</span>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667078]">Độ an toàn & Tuân thủ AI</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#171A1C] tracking-tight">99.7%</div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>3 trường hợp cần Handoff BS</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E8ECEE] flex justify-between text-[11px] text-[#667078]">
            <span>Lỗi sai lệch y khoa</span>
            <span className="font-semibold text-emerald-600">0 trường hợp</span>
          </div>
        </Card>
      </div>

      {/* Main 2-Column Layout (2:1 ratio per Evergreen Hospital guidelines) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Capacity & Load Meter Card */}
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-bold text-[#171A1C] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#147D8D]" />
                  Tải công suất & Thời gian chờ theo Khoa
                </CardTitle>
                <CardDescription className="text-xs text-[#667078] mt-0.5">
                  Giám sát phòng khám đang mở, số lượng bệnh nhân chờ và thời gian chờ dự tính.
                </CardDescription>
              </div>
              <Link href="/admin/departments">
                <Button variant="ghost" size="sm" className="text-xs text-[#147D8D] hover:bg-[#F0F8F7]">
                  Chi tiết tất cả khoa →
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-5 pt-2">
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="p-3.5 rounded-xl border border-[#E8ECEE] bg-[#F7F9FA] hover:bg-white hover:border-[#ABE3DF] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#171A1C]">{dept.name}</span>
                        <span className="text-[10px] text-[#667078] px-1.5 py-0.5 rounded bg-white border border-[#E8ECEE]">
                          {dept.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-[#667078]">
                          Đang chờ: <strong className="text-[#171A1C]">{dept.waitingCount} người</strong>
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[#667078]">
                          Thời gian chờ TB: <strong className="text-[#147D8D]">{dept.avgWaitTime}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Badges */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#667078]">
                          Công suất: {dept.roomsActive}/{dept.doctorCount} phòng trực
                        </span>
                        <span
                          className={`font-semibold ${
                            dept.loadPercent >= 85
                              ? "text-amber-600"
                              : "text-[#147D8D]"
                          }`}
                        >
                          {dept.loadPercent}% tải
                        </span>
                      </div>
                      <div className="w-full bg-gray-200/80 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            dept.loadPercent >= 85
                              ? "bg-amber-500"
                              : "bg-[#147D8D]"
                          }`}
                          style={{ width: `${dept.loadPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Realtime Live AI Dispatch Activity Feed */}
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-bold text-[#171A1C] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#147D8D]" />
                  Nhật ký Điều phối Trực tiếp (Live AI Dispatch Feed)
                </CardTitle>
                <CardDescription className="text-xs text-[#667078] mt-0.5">
                  Các quyết định điều hướng, phân luồng và cảnh báo sinh hiệu do CareFlow Agent thực thi.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] text-[10px]">
                Auto-updating
              </Badge>
            </CardHeader>

            <CardContent className="p-5 pt-2">
              <div className="divide-y divide-[#E8ECEE]">
                {liveEvents.map((ev) => (
                  <div key={ev.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-[#F0F8F7] border border-[#ABE3DF] text-[#147D8D] flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#171A1C]">{ev.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${ev.color}`}>
                            {ev.tag}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#667078] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#667078] leading-relaxed">
                        {ev.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8ECEE] text-center">
                <Link href="/admin/audit-logs">
                  <Button variant="ghost" size="sm" className="text-xs text-[#147D8D] hover:bg-[#F0F8F7]">
                    Xem toàn bộ nhật ký kiểm toán y tế (Audit Logs) →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Summary Column (1/3) */}
        <div className="space-y-6">
          {/* AI Cluster Engine Health Widget */}
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-[#EFF9F7] via-[#F0F8F7] to-[#EEF7FA] border-b border-[#ABE3DF]/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#147D8D] text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#171A1C]">Google Vertex AI Cluster</h3>
                    <p className="text-[10px] text-[#147D8D] font-medium">Healthcare Decision Agent</p>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px] hover:bg-emerald-600">
                  Online
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E8ECEE]">
                <span className="text-[#667078]">Mô hình cốt lõi</span>
                <span className="font-semibold text-[#171A1C]">Gemini 2.5 Flash Med</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E8ECEE]">
                <span className="text-[#667078]">Tốc độ phản hồi (P95)</span>
                <span className="font-semibold text-emerald-600">380ms</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E8ECEE]">
                <span className="text-[#667078]">Tỷ lệ Handoff Bác sĩ</span>
                <span className="font-semibold text-[#171A1C]">1.8% (Ngưỡng an toàn)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E8ECEE]">
                <span className="text-[#667078]">Medical Safety Guardrails</span>
                <span className="font-semibold text-[#147D8D]">Kích hoạt 100%</span>
              </div>

              <Link href="/admin/agent-monitor" className="block pt-1">
                <Button className="w-full bg-[#147D8D] hover:bg-[#106b79] text-white text-xs h-8">
                  Mở Trình giám sát Agent →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Active Escalation & Human Handoff Alerts */}
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-bold text-[#171A1C] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Cảnh báo khẩn cần giám sát ({activeAlerts.length})
              </CardTitle>
              <Badge variant="outline" className="text-[9px] border-amber-300 bg-amber-50 text-amber-800">
                Action Required
              </Badge>
            </CardHeader>

            <CardContent className="p-4 pt-1 space-y-3">
              {activeAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-3 rounded-lg border text-xs ${
                    alt.severity === "critical"
                      ? "bg-red-50/50 border-red-200"
                      : alt.severity === "warning"
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-[#F0F8F7] border-[#ABE3DF]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-bold text-[11px] ${
                        alt.severity === "critical"
                          ? "text-red-700"
                          : alt.severity === "warning"
                          ? "text-amber-800"
                          : "text-[#147D8D]"
                      }`}
                    >
                      {alt.title}
                    </span>
                    <span className="text-[10px] text-[#667078]">{alt.time}</span>
                  </div>
                  <p className="text-[11px] text-[#667078] leading-tight mb-2">
                    {alt.desc}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-[10px] px-2 bg-white border-[#E8ECEE] hover:bg-gray-50 text-[#171A1C]"
                    >
                      Phê duyệt xử lý
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] px-2 text-[#667078] hover:text-[#171A1C]"
                    >
                      Bỏ qua
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Administrative Shortcuts */}
          <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4">
            <h4 className="text-xs font-bold text-[#171A1C] mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#147D8D]" />
              Thao tác nhanh Quản trị viên
            </h4>
            <div className="space-y-1.5">
              <Link href="/admin/workflows" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs h-8 font-medium text-[#171A1C] border-[#E8ECEE] hover:bg-[#F0F8F7] hover:text-[#147D8D]"
                >
                  <span>Điều chỉnh quy trình khám</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </Link>
              <Link href="/admin/ai-policies" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs h-8 font-medium text-[#171A1C] border-[#E8ECEE] hover:bg-[#F0F8F7] hover:text-[#147D8D]"
                >
                  <span>Cập nhật chính sách an toàn AI</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </Link>
              <Link href="/admin/rooms" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs h-8 font-medium text-[#171A1C] border-[#E8ECEE] hover:bg-[#F0F8F7] hover:text-[#147D8D]"
                >
                  <span>Bật phòng khám bổ sung (Overload)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </Link>
              <Link href="/admin/maps" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs h-8 font-medium text-[#171A1C] border-[#E8ECEE] hover:bg-[#F0F8F7] hover:text-[#147D8D]"
                >
                  <span>Cập nhật bản đồ di chuyển trong viện</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
