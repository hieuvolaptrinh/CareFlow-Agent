"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  DoorOpen,
  FileCheck2,
  FileSpreadsheet,
  HeartPulse,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Network,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationGroups = [
    {
      group: "ĐIỀU HÀNH & GIÁM SÁT",
      items: [
        {
          name: "Tổng quan điều hành",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
          active: pathname === "/admin/dashboard",
        },
        {
          name: "Giám sát AI Agent",
          href: "/admin/agent-monitor",
          icon: Cpu,
          active: pathname === "/admin/agent-monitor",
          badge: "Live",
          badgeColor: "bg-[#147D8D] text-white",
        },
        {
          name: "Quy trình & Luồng khám",
          href: "/admin/workflows",
          icon: Network,
          active: pathname === "/admin/workflows",
        },
      ],
    },
    {
      group: "QUẢN TRỊ BỆNH VIỆN",
      items: [
        {
          name: "Khoa & Chuyên khoa",
          href: "/admin/departments",
          icon: Building2,
          active: pathname === "/admin/departments",
        },
        {
          name: "Phòng khám & Thiết bị",
          href: "/admin/rooms",
          icon: DoorOpen,
          active: pathname === "/admin/rooms",
        },
        {
          name: "Dịch vụ & Bảng giá",
          href: "/admin/services",
          icon: FileSpreadsheet,
          active: pathname === "/admin/services",
        },
        {
          name: "Sơ đồ & Chỉ đường (Map)",
          href: "/admin/maps",
          icon: MapPin,
          active: pathname === "/admin/maps",
        },
      ],
    },
    {
      group: "AN TOÀN & HỆ THỐNG",
      items: [
        {
          name: "Chính sách & An toàn AI",
          href: "/admin/ai-policies",
          icon: Shield,
          active: pathname === "/admin/ai-policies",
          badge: "Safety",
          badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
        },
        {
          name: "Cơ sở tri thức (RAG)",
          href: "/admin/knowledge",
          icon: Database,
          active: pathname === "/admin/knowledge",
        },
        {
          name: "Nhân sự & Phân quyền",
          href: "/admin/users",
          icon: Users,
          active: pathname === "/admin/users",
        },
        {
          name: "Nhật ký kiểm toán",
          href: "/admin/audit-logs",
          icon: FileCheck2,
          active: pathname === "/admin/audit-logs",
        },
      ],
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-[#E8ECEE]">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#147D8D] flex items-center justify-center text-white shadow-sm shadow-[#147D8D]/20 transition-transform group-hover:scale-105">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-[#171A1C] flex items-center gap-1.5">
              CareFlow <span className="text-[#147D8D] font-medium text-xs px-1.5 py-0.5 rounded bg-[#F0F8F7] border border-[#ABE3DF]">ADMIN</span>
            </div>
            <p className="text-[11px] text-[#667078] font-medium">Trung tâm Điều hành Y tế</p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-semibold text-[#667078] tracking-wider uppercase mb-1.5">
              {group.group}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    item.active
                      ? "bg-[#F0F8F7] text-[#147D8D] font-semibold shadow-xs"
                      : "text-[#667078] hover:text-[#171A1C] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        item.active ? "text-[#147D8D]" : "text-[#667078]"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold border ${
                        item.badgeColor || "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* AI Health Widget in Sidebar */}
        <div className="mx-1 p-3 rounded-xl bg-gradient-to-br from-[#EFF9F7] to-[#F0F8F7] border border-[#ABE3DF]/60 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-[#147D8D] flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" /> Vertex AI Engine
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-[#667078] leading-tight mb-2">
            Hạ tầng điều phối tự động: <strong>99.98% SLA</strong>
          </p>
          <div className="flex items-center justify-between text-[10px] text-[#147D8D] font-medium pt-1 border-t border-[#ABE3DF]/40">
            <span>Độ trễ trung bình</span>
            <span>412ms</span>
          </div>
        </div>
      </div>

      {/* Footer / Signed In User */}
      <div className="p-3 border-t border-[#E8ECEE] bg-white">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="w-8 h-8 rounded-lg border border-[#ABE3DF]">
              <AvatarFallback className="bg-[#147D8D] text-white text-xs font-semibold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#171A1C] truncate">
                BS. Nguyễn Quản Trị
              </p>
              <p className="text-[10px] text-[#667078] truncate">
                Giám đốc Điều hành BV
              </p>
            </div>
          </div>
          <Link href="/login">
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-[#667078] hover:text-red-600 hover:bg-red-50"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F9FA] flex">
      {/* Desktop Sidebar (240px wide per Evergreen standard) */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-[#E8ECEE] fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-white sm:max-w-xs">
          <SheetTitle className="sr-only">Menu Quản trị Bệnh viện</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen">
        {/* Top Bar (Height 64px, Light Divider) */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-[#E8ECEE] px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg h-9 w-9 text-[#667078] hover:bg-[#F0F8F7] cursor-pointer"
              title="Mở menu quản trị"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#667078]">
              <Link href="/admin/dashboard" className="hover:text-[#147D8D]">
                Trung tâm Quản trị
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="font-semibold text-[#171A1C]">
                {navigationGroups
                  .flatMap((g) => g.items)
                  .find((i) => i.active)?.name || "Bảng điều hành"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Quick Bar */}
            <div className="relative hidden md:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#667078]" />
              <input
                type="text"
                placeholder="Tìm khoa, bác sĩ, ca khám..."
                className="w-full bg-[#F7F9FA] border border-[#E8ECEE] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#171A1C] placeholder:text-[#667078] focus:outline-none focus:border-[#147D8D]"
              />
            </div>

            {/* Live Queue / Handoff Alert Badge */}
            <Link href="/admin/audit-logs">
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-[#E8ECEE] text-xs font-medium text-[#171A1C] hover:bg-[#F0F8F7] hover:text-[#147D8D] flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Cảnh báo</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </Button>
            </Link>

            {/* Portal Switch Link */}
            <Link href="/patient/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-[#147D8D] hover:bg-[#F0F8F7]"
              >
                Cổng Bệnh nhân →
              </Button>
            </Link>

            {/* Hospital Site Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F8F7] border border-[#ABE3DF] text-[11px] font-medium text-[#147D8D]">
              <Building2 className="w-3 h-3" />
              <span>Cơ sở 1 - Trung tâm</span>
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
