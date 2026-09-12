"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DoorOpen,
  HeartPulse,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  QrCode,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationGroups = [
    {
      group: "LÂM SÀNG & TIẾP ĐÓN",
      items: [
        {
          name: "Trạm điều hành trực",
          href: "/staff/dashboard",
          icon: LayoutDashboard,
          active: pathname === "/staff/dashboard",
        },
        {
          name: "Tiếp đón & Quét QR",
          href: "/staff/reception",
          icon: QrCode,
          active: pathname === "/staff/reception",
        },
        {
          name: "Hàng đợi & Gọi số",
          href: "/staff/queue",
          icon: Users,
          active: pathname === "/staff/queue",
          badge: "12 chờ",
          badgeColor: "bg-[#F0F8F7] text-[#147D8D] border-[#ABE3DF]",
        },
        {
          name: "Khám bệnh & Chỉ định",
          href: "/staff/clinical",
          icon: Stethoscope,
          active: pathname === "/staff/clinical",
        },
      ],
    },
    {
      group: "CAN THIỆP & DỊCH VỤ",
      items: [
        {
          name: "Handoff cần can thiệp",
          href: "/staff/handoffs",
          icon: ShieldAlert,
          active: pathname === "/staff/handoffs",
          badge: "3 ca khẩn",
          badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
        },
        {
          name: "Quầy Dược & Cấp thuốc",
          href: "/staff/pharmacy",
          icon: Pill,
          active: pathname === "/staff/pharmacy",
        },
        {
          name: "Viện phí & Thu ngân",
          href: "/staff/billing",
          icon: CreditCard,
          active: pathname === "/staff/billing",
        },
      ],
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-[#E8ECEE]">
        <Link href="/staff/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#147D8D] flex items-center justify-center text-white shadow-sm shadow-[#147D8D]/20 transition-transform group-hover:scale-105">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-[#171A1C] flex items-center gap-1.5">
              CareFlow <span className="text-[#147D8D] font-medium text-xs px-1.5 py-0.5 rounded bg-[#F0F8F7] border border-[#ABE3DF]">STAFF</span>
            </div>
            <p className="text-[11px] text-[#667078] font-medium">Bảng Y tế & Điều dưỡng</p>
          </div>
        </Link>
      </div>

      {/* Quick Action Widget: Calling Next Patient */}
      <div className="p-3 border-b border-[#E8ECEE] bg-[#F7F9FA]">
        <div className="p-2.5 rounded-xl bg-white border border-[#E8ECEE] shadow-xs">
          <div className="flex items-center justify-between mb-1.5 text-[11px]">
            <span className="text-[#667078] font-medium">Phòng khám hiện tại:</span>
            <span className="font-bold text-[#147D8D] bg-[#F0F8F7] px-1.5 py-0.5 rounded border border-[#ABE3DF]">
              PK 101
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#171A1C] font-semibold">Đang khám: STT 14</span>
            <span className="text-emerald-600 text-[10px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Trong phòng
            </span>
          </div>
          <Link href="/staff/queue" className="block">
            <Button
              size="sm"
              className="w-full h-8 bg-[#147D8D] hover:bg-[#106b79] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Gọi số kế tiếp (STT 15)
            </Button>
          </Link>
        </div>
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

        {/* Realtime Ward Status */}
        <div className="mx-1 p-3 rounded-xl bg-gradient-to-br from-[#EFF9F7] to-[#F0F8F7] border border-[#ABE3DF]/60 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-[#147D8D] flex items-center gap-1.5 text-[11px]">
              <Clock className="w-3.5 h-3.5" /> Ca trực Sáng
            </span>
            <Badge variant="outline" className="text-[9px] bg-white border-[#ABE3DF] text-[#147D8D]">
              07:00 - 15:30
            </Badge>
          </div>
          <p className="text-[11px] text-[#667078] leading-tight">
            Khoa Khám Bệnh • Khu A Tầng 1
          </p>
          <div className="flex items-center justify-between text-[10px] text-[#147D8D] font-medium pt-2 mt-2 border-t border-[#ABE3DF]/40">
            <span>Bệnh nhân đã tiếp đón</span>
            <span className="font-bold">48 ca</span>
          </div>
        </div>
      </div>

      {/* Footer / Doctor Profile */}
      <div className="p-3 border-t border-[#E8ECEE] bg-white">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F9FA] border border-[#E8ECEE]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="w-8 h-8 rounded-lg border border-[#ABE3DF]">
              <AvatarFallback className="bg-[#147D8D] text-white text-xs font-semibold">
                QB
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#171A1C] truncate">
                BS. CKI. Lê Quốc Bảo
              </p>
              <p className="text-[10px] text-[#667078] truncate">
                Khoa Khám Bệnh (PK 101)
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
      {/* Desktop Sidebar (240px wide per Evergreen Hospital standard) */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-[#E8ECEE] fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-white sm:max-w-xs">
          <SheetTitle className="sr-only">Menu Nhân viên Y tế</SheetTitle>
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
              title="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#667078]">
              <Link href="/staff/dashboard" className="hover:text-[#147D8D]">
                Trạm Y tế
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="font-semibold text-[#171A1C]">
                {navigationGroups
                  .flatMap((g) => g.items)
                  .find((i) => i.active)?.name || "Bảng điều khiển"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Patient Bar */}
            <div className="relative hidden md:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#667078]" />
              <input
                type="text"
                placeholder="Tra cứu BN theo STT, Họ tên, Mã..."
                className="w-full bg-[#F7F9FA] border border-[#E8ECEE] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#171A1C] placeholder:text-[#667078] focus:outline-none focus:border-[#147D8D]"
              />
            </div>

            {/* Handoff Alerts Quick Badge */}
            <Link href="/staff/handoffs">
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-[#E8ECEE] text-xs font-medium text-[#171A1C] hover:bg-[#F0F8F7] hover:text-[#147D8D] flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Handoff AI</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  3
                </span>
              </Button>
            </Link>

            {/* Switch to Admin */}
            <Link href="/admin/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-[#667078] hover:text-[#171A1C] hover:bg-[#F0F8F7]"
              >
                Cổng Quản trị →
              </Button>
            </Link>
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
