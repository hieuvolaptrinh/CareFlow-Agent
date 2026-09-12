"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  HeartPulse,
  HelpCircle,
  Hospital,
  MapPin,
  MessageSquare,
  Navigation,
  PhoneCall,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  ChevronRight,
  CreditCard,
  Building2,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState<number>(2);

  const journeySteps = [
    {
      id: 0,
      name: "Check-in",
      location: "Kiosk Quầy A - Tầng 1",
      status: "Đã hoàn thành",
      done: true,
      time: "08:15",
      desc: "Xác nhận lịch hẹn tim mạch qua mã QR.",
    },
    {
      id: 1,
      name: "Khám Tim mạch",
      location: "Phòng 203 - Tầng 2",
      status: "Đã hoàn thành",
      done: true,
      time: "08:35",
      desc: "Bác sĩ khám lâm sàng, chỉ định xét nghiệm máu và X-quang.",
    },
    {
      id: 2,
      name: "Xét nghiệm máu",
      location: "Phòng 204 - Tầng 2",
      status: "Đang diễn ra",
      current: true,
      time: "09:00",
      desc: "Lấy mẫu máu. Số thứ tự: XN-105 (Còn 4 lượt phía trước).",
    },
    {
      id: 3,
      name: "Chụp X-quang phổi",
      location: "Phòng 205 - Tầng 2",
      status: "Chờ thực hiện",
      pending: true,
      time: "Dự kiến 09:30",
      desc: "Thực hiện chụp sau khi hoàn thành xét nghiệm máu.",
    },
    {
      id: 4,
      name: "Tái khám Bác sĩ",
      location: "Phòng 203 - Tầng 2",
      status: "Chờ thực hiện",
      pending: true,
      time: "Dự kiến 10:10",
      desc: "Bác sĩ đọc kết quả xét nghiệm và kết luận phác đồ điều trị.",
    },
    {
      id: 5,
      name: "Thanh toán & Nhà thuốc",
      location: "Quầy 5 & Nhà thuốc Tầng 1",
      status: "Chờ thực hiện",
      pending: true,
      time: "Dự kiến 10:40",
      desc: "Quyết toán BHYT và nhận thuốc kê đơn tại quầy dược.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-[#171A1C] flex flex-col selection:bg-[#ABE3DF] selection:text-[#147D8D]">
      {/* Top Announcement Bar */}
      <div className="bg-[#EFF9F7] border-b border-[#E8ECEE] px-4 py-2 text-center text-xs font-medium text-[#147D8D] flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#147D8D]" />
        <span>CareFlow Agent v1.0 — Nền tảng AI Điều phối Hành trình Khám bệnh thông minh đầu tiên tại Bệnh viện</span>
        <Badge variant="outline" className="text-[10px] bg-white border-[#ABE3DF] text-[#147D8D] ml-1">
          Healthcare AI
        </Badge>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8ECEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#147D8D] flex items-center justify-center text-white shadow-sm shadow-[#147D8D]/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight text-[#171A1C] flex items-center gap-1.5">
                CareFlow <span className="text-[#147D8D] font-normal">Agent</span>
              </div>
              <p className="text-[11px] text-[#667078] -mt-1 font-medium">Hành trình y tế liền mạch</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#667078]">
            <a href="#features" className="hover:text-[#147D8D] transition-colors">Tính năng cốt lõi</a>
            <a href="#journey" className="hover:text-[#147D8D] transition-colors">Hành trình mẫu</a>
            <a href="#portals" className="hover:text-[#147D8D] transition-colors">Phân hệ chuyên biệt</a>
            <a href="#safety" className="hover:text-[#147D8D] transition-colors">An toàn y khoa</a>
            <Link href="/test-ai" className="text-[#147D8D] hover:underline font-semibold flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Test Vertex AI
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-[#667078] hover:text-[#171A1C] hover:bg-[#F0F8F7]">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/patient/dashboard">
              <Button className="bg-[#147D8D] hover:bg-[#106b79] text-white shadow-sm shadow-[#147D8D]/20 rounded-lg">
                Cổng Bệnh Nhân
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#EFF9F7]/60 via-[#F7F9FA] to-[#F7F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6F4] text-[#147D8D] text-xs font-semibold mb-5 border border-[#ABE3DF]">
              <Compass className="w-3.5 h-3.5" />
              <span>Định vị • Điều phối • Chỉ đường thời gian thực</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#171A1C] tracking-tight leading-[1.15]">
              Biết bệnh nhân đang ở đâu. <br />
              <span className="text-[#147D8D] bg-clip-text text-transparent bg-gradient-to-r from-[#147D8D] to-[#0d9488]">
                Hướng dẫn bước tiếp theo chính xác.
              </span>
            </h1>

            <p className="mt-6 text-lg text-[#667078] leading-relaxed">
              Xóa tan nỗi lo và sự bối rối tại bệnh viện đông đúc. CareFlow Agent kết nối thông minh giữa
              chỉ định bác sĩ, phòng cận lâm sàng và hàng đợi thực tế để luôn trả lời câu hỏi:
              <strong className="text-[#171A1C] font-semibold"> &ldquo;Bây giờ tôi cần làm gì? Tôi phải đi đâu tiếp?&rdquo;</strong>
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/patient/dashboard">
                <Button size="lg" className="bg-[#147D8D] hover:bg-[#106b79] text-white shadow-md shadow-[#147D8D]/20 px-6 h-12 text-base">
                  Vào Cổng Bệnh Nhân
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/staff/dashboard">
                <Button size="lg" variant="outline" className="border-[#E8ECEE] bg-white hover:bg-[#F0F8F7] text-[#171A1C] h-12 text-base">
                  <Stethoscope className="w-4 h-4 mr-2 text-[#147D8D]" />
                  Bảng Y Tế (Staff)
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button size="lg" variant="ghost" className="text-[#667078] hover:text-[#171A1C] h-12 text-base">
                  <Building2 className="w-4 h-4 mr-2 text-[#147D8D]" />
                  Cổng Quản Trị
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-[#E8ECEE] max-w-2xl mx-auto text-left">
              <div>
                <div className="text-2xl font-bold text-[#147D8D]">100%</div>
                <div className="text-xs text-[#667078] mt-0.5">Quy trình chuẩn hóa, không bỏ sót chỉ định</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#147D8D]">~35%</div>
                <div className="text-xs text-[#667078] mt-0.5">Giảm thời gian chờ đợi & đi lại lòng vòng</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#147D8D]">24/7</div>
                <div className="text-xs text-[#667078] mt-0.5">Hỗ trợ thông minh & Handoff người thật tức thì</div>
              </div>
            </div>
          </div>

          {/* LIVE WORKSPACE MOCKUP (Evergreen Hospital Reference Style) */}
          <div className="relative mx-auto max-w-6xl rounded-2xl border border-[#E8ECEE] bg-white shadow-xl shadow-[#147D8D]/5 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-[#E8ECEE] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-[#667078] ml-2">
                  CareFlow Workspace • Bệnh viện Đa khoa Evergreen
                </span>
              </div>
              <Badge className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] hover:bg-[#EFF9F7]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse" />
                Đang trực tuyến
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Patient Profile & Status (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <Card className="border-[#E8ECEE] shadow-none bg-[#F7F9FA]">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-[#147D8D] text-white font-semibold text-lg">
                          NA
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-base text-[#171A1C]">Nguyễn Văn A</div>
                        <p className="text-xs text-[#667078]">Mã BN: CF-89211 • Nam, 45 tuổi</p>
                        <Badge variant="outline" className="mt-1 text-[11px] bg-white border-[#ABE3DF] text-[#147D8D]">
                          BHYT: Đúng tuyến (80%)
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E8ECEE] grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#667078] block">Chuyên khoa:</span>
                        <span className="font-semibold text-[#171A1C]">Tim mạch</span>
                      </div>
                      <div>
                        <span className="text-[#667078] block">Bác sĩ phụ trách:</span>
                        <span className="font-semibold text-[#171A1C]">TS.BS Trần Thu Hà</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Active Ticket */}
                <Card className="border-[#ABE3DF] bg-gradient-to-br from-[#EFF9F7] to-white shadow-none">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#147D8D] uppercase tracking-wider">
                        Số thứ tự hiện tại
                      </span>
                      <Badge className="bg-[#147D8D] text-white hover:bg-[#147D8D]">
                        Phòng Xét nghiệm 204
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-black text-[#171A1C] tracking-tight mt-2">
                      XN-105
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#667078]">
                      <span>Đang phục vụ:</span>
                      <span className="font-semibold text-[#171A1C]">XN-101</span>
                    </div>
                    <div className="flex justify-between text-[#667078]">
                      <span>Số người phía trước:</span>
                      <span className="font-bold text-emerald-600">4 người</span>
                    </div>
                    <div className="flex justify-between text-[#667078]">
                      <span>Ước tính thời gian:</span>
                      <span className="font-medium text-[#171A1C]">~ 8 - 10 phút</span>
                    </div>
                    <div className="pt-2">
                      <Button size="sm" className="w-full bg-[#147D8D] hover:bg-[#106b79] text-white">
                        <Navigation className="w-3.5 h-3.5 mr-1.5" />
                        Chỉ đường tới Phòng 204
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column: Visual Journey Timeline (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#171A1C] uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#147D8D]" />
                    Tiến trình khám hôm nay
                  </h3>
                  <span className="text-xs text-[#667078]">2/6 bước hoàn thành</span>
                </div>

                <div className="space-y-3">
                  {journeySteps.map((step) => {
                    const isCurrent = step.id === activeStep;
                    return (
                      <div
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-[#F0F8F7] border-[#147D8D] shadow-sm ring-1 ring-[#147D8D]"
                            : step.done
                            ? "bg-white border-[#E8ECEE] opacity-90"
                            : "bg-white/60 border-[#E8ECEE]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {step.done ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : isCurrent ? (
                              <div className="w-5 h-5 rounded-full border-2 border-[#147D8D] flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#147D8D] animate-ping" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-gray-300 bg-gray-50" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-bold ${isCurrent ? "text-[#147D8D]" : "text-[#171A1C]"}`}>
                                {step.name}
                              </span>
                              <span className="text-[11px] text-[#667078]">{step.time}</span>
                            </div>
                            <p className="text-xs text-[#667078] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#147D8D]" />
                              {step.location}
                            </p>
                            <p className="text-xs text-[#171A1C] mt-1 line-clamp-1">{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: AI Agent Assistant (3 Cols) */}
              <div className="lg:col-span-3 flex flex-col justify-between rounded-xl border border-[#E8ECEE] bg-[#FCF5F8]/40 p-4">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b border-[#E8ECEE]">
                    <div className="w-8 h-8 rounded-lg bg-[#147D8D] text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#171A1C]">Trợ lý CareFlow</div>
                      <span className="text-[10px] text-emerald-600 font-medium">● Sẵn sàng điều phối</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5 text-xs">
                    {/* User Question */}
                    <div className="bg-white p-2.5 rounded-lg border border-[#E8ECEE] text-[#171A1C] shadow-2xs">
                      <p className="text-[11px] text-[#667078] mb-0.5 font-medium">Bệnh nhân hỏi:</p>
                      &ldquo;Tôi vừa khám tim mạch xong, bây giờ làm gì tiếp?&rdquo;
                    </div>

                    {/* AI Structured Answer */}
                    <div className="bg-[#EFF9F7] p-3 rounded-lg border border-[#ABE3DF] text-[#171A1C] space-y-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#147D8D]">
                        <Sparkles className="w-3 h-3" />
                        Hướng dẫn hành trình:
                      </div>
                      <p className="text-xs leading-relaxed text-[#171A1C]">
                        Bác sĩ chỉ định 2 xét nghiệm. <strong>Bước tiếp theo của bạn là Xét nghiệm máu tại Phòng 204</strong> (Tầng 2, rẽ phải sau thang máy).
                      </p>
                      <div className="pt-1 flex flex-col gap-1.5">
                        <button className="w-full text-left px-2.5 py-1.5 bg-white border border-[#ABE3DF] rounded text-[11px] font-medium text-[#147D8D] hover:bg-[#F0F8F7] transition-colors flex items-center justify-between">
                          <span>Chỉ đường tới P.204</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                        <button className="w-full text-left px-2.5 py-1.5 bg-white border border-[#ABE3DF] rounded text-[11px] font-medium text-[#147D8D] hover:bg-[#F0F8F7] transition-colors flex items-center justify-between">
                          <span>Xem số thứ tự XN-105</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                        <button className="w-full text-left px-2.5 py-1.5 bg-white border border-gray-200 rounded text-[11px] text-[#667078] hover:bg-gray-50 transition-colors flex items-center justify-between">
                          <span>Kết nối nhân viên thật</span>
                          <PhoneCall className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 text-[11px] text-[#667078] text-center border-t border-[#E8ECEE] mt-4">
                  AI tuân thủ SOP bệnh viện • Không chẩn đoán bệnh
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES SECTION */}
      <section id="features" className="py-20 bg-white border-t border-[#E8ECEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] mb-3">Tính Năng Vượt Trội</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171A1C] tracking-tight">
              Bốn Trụ Cột Điều Phối Thông Minh
            </h2>
            <p className="mt-3 text-base text-[#667078]">
              Không chỉ là một chatbot thông thường, CareFlow là cỗ máy điều phối quy trình vận hành y tế thời gian thực.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <Card className="border-[#E8ECEE] hover:border-[#147D8D] hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center mb-2">
                  <Compass className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-[#171A1C]">Định Vị Bước Tiếp Theo</CardTitle>
                <CardDescription className="text-sm text-[#667078]">
                  Tự động nhận biết các chỉ định còn thiếu (Pending Orders) để hướng dẫn bệnh nhân đi đúng phòng, không bỏ sót xét nghiệm.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 2 */}
            <Card className="border-[#E8ECEE] hover:border-[#147D8D] hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-[#EEF7FA] text-[#147D8D] flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-[#171A1C]">Hàng Đợi Thông Minh</CardTitle>
                <CardDescription className="text-sm text-[#667078]">
                  Số thứ tự gắn liền với hành trình khám. Dự báo thời gian chờ ước tính, thông báo chủ động khi sắp đến lượt phục vụ.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 3 */}
            <Card className="border-[#E8ECEE] hover:border-[#147D8D] hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-[#FCF5F8] text-[#147D8D] flex items-center justify-center mb-2">
                  <Navigation className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-[#171A1C]">Chỉ Đường Trong Nhà</CardTitle>
                <CardDescription className="text-sm text-[#667078]">
                  Bản đồ Indoor Navigation dạng đồ thị. Hỗ trợ tuyến đường riêng cho người đi xe lăn hoặc người cao tuổi cần hỗ trợ.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 4 */}
            <Card className="border-[#E8ECEE] hover:border-[#147D8D] hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-[#171A1C]">An Toàn & Handoff</CardTitle>
                <CardDescription className="text-sm text-[#667078]">
                  Phát hiện triệu chứng cấp cứu (Red Flags) để chuyển người thật lập tức. Tuyệt đối không thay thế chẩn đoán bác sĩ.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* GOLDEN JOURNEY WALKTHROUGH */}
      <section id="journey" className="py-20 bg-[#F7F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] mb-3">Quy Trình Chuẩn</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171A1C] tracking-tight">
              Luồng Vàng Hành Trình Bệnh Nhân
            </h2>
            <p className="mt-3 text-base text-[#667078]">
              Từ lúc bước chân vào sảnh bệnh viện cho đến khi nhận thuốc về nhà, mọi nút thắt đều có CareFlow đồng hành.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Đặt Lịch & Check-in",
                desc: "Quét mã QR tại Kiosk hoặc check-in trên di động để chuyển Appointment thành Active Visit ngay lập tức.",
                icon: UserCheck,
              },
              {
                step: "02",
                title: "Khám Lâm Sàng với Bác Sĩ",
                desc: "Được gọi số chính xác vào phòng khám chuyên khoa. Bác sĩ thăm khám và ra các chỉ định cận lâm sàng cần thiết.",
                icon: Stethoscope,
              },
              {
                step: "03",
                title: "Cận Lâm Sàng (Lab & Imaging)",
                desc: "CareFlow định tuyến thông minh: Xét nghiệm máu trước, chụp X-quang sau, tránh bệnh nhân chờ chồng chéo.",
                icon: Activity,
              },
              {
                step: "04",
                title: "Tái Khám Nhận Kết Quả",
                desc: "Ngay khi hệ thống LIS/RIS hoàn tất, CareFlow tự động nhắc bệnh nhân quay lại phòng bác sĩ để nhận kết luận.",
                icon: FileText,
              },
              {
                step: "05",
                title: "Thanh Toán Viện Phí",
                desc: "Tự động chuyển tiếp đến Quầy Thu ngân hoặc hỗ trợ thanh toán trực tuyến nhanh chóng, minh bạch hóa đơn BHYT.",
                icon: CreditCard,
              },
              {
                step: "06",
                title: "Lĩnh Thuốc & Xuất Viện",
                desc: "Nhắc nhở trạng thái đóng gói đơn thuốc tại Nhà thuốc bệnh viện. Hướng dẫn dặn dò tái khám chu đáo.",
                icon: Pill,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E8ECEE] relative overflow-hidden group hover:border-[#147D8D] transition-colors">
                  <div className="text-4xl font-black text-[#147D8D]/10 absolute right-4 top-4 group-hover:text-[#147D8D]/20 transition-colors">
                    {item.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#171A1C]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#667078] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORTALS EXPLORATION */}
      <section id="portals" className="py-20 bg-white border-t border-[#E8ECEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] mb-3">Hệ Sinh Thái Toàn Diện</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171A1C] tracking-tight">
              Ba Phân Hệ Chuyên Biệt
            </h2>
            <p className="mt-3 text-base text-[#667078]">
              Thiết kế tối ưu cho từng đối tượng sử dụng: Bệnh nhân, Nhân viên y tế và Ban quản lý bệnh viện.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Portal 1: Patient */}
            <div className="rounded-2xl border border-[#E8ECEE] bg-[#F7F9FA] p-8 flex flex-col justify-between hover:border-[#147D8D] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#147D8D] text-white flex items-center justify-center mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#171A1C]">Cổng Bệnh Nhân & Kiosk</h3>
                <p className="mt-3 text-sm text-[#667078] leading-relaxed">
                  Dành cho người bệnh và người nhà: Xem số thứ tự, theo dõi lộ trình khám, hỏi trợ lý AI và nhận bản đồ chỉ đường chi tiết.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[#171A1C]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#147D8D]" />
                    Giao diện chữ lớn, thân thiện người cao tuổi
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#147D8D]" />
                    Chat trực tiếp với AI điều phối hành trình
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#147D8D]" />
                    Chỉ đường theo thang máy / xe lăn
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-[#E8ECEE]">
                <Link href="/patient/dashboard">
                  <Button className="w-full bg-[#147D8D] hover:bg-[#106b79] text-white">
                    Vào Cổng Bệnh Nhân
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Portal 2: Staff */}
            <div className="rounded-2xl border border-[#ABE3DF] bg-[#EFF9F7]/40 p-8 flex flex-col justify-between hover:border-[#147D8D] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#147D8D] text-white flex items-center justify-center mb-5">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#171A1C]">Bảng Y Tế & Điều Dưỡng</h3>
                <p className="mt-3 text-sm text-[#667078] leading-relaxed">
                  Dành cho nhân viên tiếp đón, điều dưỡng, kỹ thuật viên xét nghiệm và dược sĩ điều phối hàng đợi và tiếp nhận ca chuyển giao.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[#171A1C]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#147D8D]" />
                    Quản lý gọi số, chuyển queue thông minh
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#147D8D]" />
                    Hộp thư tiếp nhận ca Human Handoff từ AI
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#147D8D]" />
                    Cập nhật trạng thái mẫu xét nghiệm, thuốc
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-[#E8ECEE]">
                <Link href="/staff/dashboard">
                  <Button className="w-full bg-white hover:bg-gray-50 border border-[#147D8D] text-[#147D8D]">
                    Vào Bảng Điều Khiển Staff
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Portal 3: Admin */}
            <div className="rounded-2xl border border-[#E8ECEE] bg-[#F7F9FA] p-8 flex flex-col justify-between hover:border-[#147D8D] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#147D8D] text-white flex items-center justify-center mb-5">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#171A1C]">Quản Trị & Vận Hành Bệnh Viện</h3>
                <p className="mt-3 text-sm text-[#667078] leading-relaxed">
                  Dành cho ban giám đốc và kỹ sư vận hành: Cấu hình quy trình khám (Workflow Builder), giám sát AI và kiểm toán dữ liệu.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[#171A1C]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#147D8D]" />
                    Thiết lập sơ đồ tòa nhà, khoa phòng
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#147D8D]" />
                    Giám sát chỉ số nghẽn và thời gian chờ
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#147D8D]" />
                    Kiểm soát chính sách an toàn AI (Safety Rules)
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-[#E8ECEE]">
                <Link href="/admin/dashboard">
                  <Button variant="outline" className="w-full bg-white hover:bg-gray-50 text-[#171A1C]">
                    Vào Cổng Admin
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY & COMPLIANCE SECTION */}
      <section id="safety" className="py-16 bg-[#EFF9F7]/50 border-t border-[#ABE3DF]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-[#ABE3DF] p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF6F4] text-[#147D8D] flex items-center justify-center shrink-0 border border-[#ABE3DF]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[#171A1C]">
                  Cam kết An toàn Y khoa & Bảo vệ Dữ liệu (Safety First)
                </h3>
                <p className="text-sm text-[#667078] leading-relaxed">
                  CareFlow Agent được xây dựng trên nguyên tắc tuân thủ nghiêm ngặt chuẩn mực y tế:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#171A1C]">
                  <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE]">
                    <strong className="block text-red-600 mb-1">✕ KHÔNG Chẩn đoán bệnh</strong>
                    AI tuyệt đối không kết luận bệnh, không kê đơn và không giải thích bệnh học.
                  </div>
                  <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE]">
                    <strong className="block text-emerald-700 mb-1">✓ Nhận diện Cấp cứu (Red Flag)</strong>
                    Tự động nhận biết các dấu hiệu nguy hiểm (đau ngực, ngất xỉu) để chuyển cấp cứu tức thì.
                  </div>
                  <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE]">
                    <strong className="block text-[#147D8D] mb-1">✓ Tuân thủ SOP Bệnh viện</strong>
                    Chỉ sử dụng tài liệu và quy trình khám đã được Hội đồng Y khoa phê duyệt.
                  </div>
                  <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE]">
                    <strong className="block text-[#147D8D] mb-1">✓ Bảo mật Thông tin Y tế (PII)</strong>
                    Mã hóa danh tính, không lưu trữ thông tin nhạy cảm trên prompt công khai.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-[#147D8D] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">Sẵn Sàng Chuyển Đổi Số Y Tế</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Nâng Cao Trải Nghiệm Khám Bệnh Tại Bệnh Viện Của Bạn
          </h2>
          <p className="mt-4 text-base text-white/80 max-w-2xl mx-auto">
            Khám phá cách CareFlow Agent tối ưu hóa luồng di chuyển của bệnh nhân, giảm áp lực quầy tiếp nhận và chuẩn hóa dịch vụ y tế.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/patient/dashboard">
              <Button size="lg" className="bg-white text-[#147D8D] hover:bg-white/90 shadow-md font-semibold px-8 h-12">
                Trải Nghiệm Cổng Bệnh Nhân
              </Button>
            </Link>
            <Link href="/staff/dashboard">
              <Button
                size="lg"
                className="border border-white/70 bg-transparent text-white hover:bg-white/15 hover:text-white px-8 h-12 shadow-none font-medium transition-colors"
              >
                Dành Cho Nhân Viên Y Tế
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E8ECEE] py-12 text-xs text-[#667078]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#147D8D] text-white flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-[#171A1C]">CareFlow Agent</span>
              </div>
              <p className="text-xs leading-relaxed">
                Nền tảng AI điều phối hành trình bệnh nhân toàn diện, kết nối thông minh giữa quy trình bệnh viện và người khám.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#171A1C] mb-3">Phân hệ</h4>
              <ul className="space-y-2">
                <li><Link href="/patient/dashboard" className="hover:text-[#147D8D]">Cổng Bệnh nhân</Link></li>
                <li><Link href="/staff/dashboard" className="hover:text-[#147D8D]">Bảng Y tế / Tiếp nhận</Link></li>
                <li><Link href="/admin/dashboard" className="hover:text-[#147D8D]">Cổng Quản trị Admin</Link></li>
                <li><Link href="/test-ai" className="hover:text-[#147D8D]">Test Vertex AI Chat</Link></li>
                <li><Link href="/login" className="hover:text-[#147D8D]">Đăng nhập hệ thống</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#171A1C] mb-3">Tính năng</h4>
              <ul className="space-y-2">
                <li><span className="hover:text-[#147D8D]">Điều phối bước tiếp theo</span></li>
                <li><span className="hover:text-[#147D8D]">Hàng đợi thời gian thực</span></li>
                <li><span className="hover:text-[#147D8D]">Chỉ đường bệnh viện (Indoor Map)</span></li>
                <li><span className="hover:text-[#147D8D]">Chuyển giao người thật (Handoff)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#171A1C] mb-3">Đường dây khẩn cấp</h4>
              <p className="text-xs text-[#667078]">
                Khi có dấu hiệu cấp cứu y tế nguy kịch, vui lòng liên hệ ngay:
              </p>
              <div className="mt-2 text-base font-bold text-red-600 flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                115 hoặc Hotline Bệnh viện
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E8ECEE] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 CareFlow Agent. Toàn quyền sở hữu trí tuệ.</p>
            <p className="text-[11px] text-[#667078]">
              Thiết kế theo chuẩn định hướng Evergreen Hospital & Tuân thủ Nguyên tắc An toàn Y khoa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
