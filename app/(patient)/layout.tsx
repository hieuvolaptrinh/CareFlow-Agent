"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  ToothbrushSparkles,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  PhoneCall,
  Search,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationGroups = [
    {
      group: "NHA KHOA",
      items: [
        {
          name: "Tổng quan nha khoa",
          href: "/patient/dashboard",
          icon: Home,
          active: pathname === "/patient/dashboard",
          badge: undefined,
        },
      ],
    },
    {
      group: "TRỢ LÝ & THÔNG BÁO",
      items: [
        {
          name: "Thông báo",
          href: "/patient/notifications",
          icon: Bell,
          active: pathname === "/patient/notifications",
          badge: "2",
        },
      ],
    },
    {
      group: "CÁ NHÂN & HỖ TRỢ",
      items: [
        {
          name: "Hồ sơ y tế",
          href: "/patient/profile",
          icon: User,
          active: pathname === "/patient/profile",
          badge: undefined,
        },
        {
          name: "Yêu cầu trợ giúp",
          href: "/patient/support",
          icon: HelpCircle,
          active: pathname === "/patient/support",
          badge: undefined,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white justify-between">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-[#E8ECEE] gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#147D8D] text-white flex items-center justify-center shadow-xs">
              <ToothbrushSparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-[#171A1C]">
                CareFlow <span className="text-[#147D8D] font-normal">Agent</span>
              </div>
              <p className="text-[10px] text-[#667078] -mt-0.5">Cổng Nha Khoa</p>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <div className="p-4 space-y-6">
          {navigationGroups.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="px-3 text-[10px] font-bold text-[#667078] tracking-wider uppercase">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        item.active
                          ? "bg-[#F0F8F7] text-[#147D8D] font-semibold"
                          : "text-[#667078] hover:bg-[#F7F9FA] hover:text-[#171A1C]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${item.active ? "text-[#147D8D]" : "text-[#667078]"}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-4.5 px-1.5 ${
                            item.active
                              ? "bg-white border-[#ABE3DF] text-[#147D8D]"
                              : "bg-[#EFF9F7] text-[#147D8D] border-transparent"
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Card & Emergency Assistance */}
      <div className="p-4 border-t border-[#E8ECEE] space-y-3">
        <div className="bg-[#EFF9F7] p-3 rounded-xl border border-[#ABE3DF] text-xs">
          <div className="flex items-center gap-1.5 text-[#147D8D] font-bold text-[11px] mb-1">
            <PhoneCall className="w-3.5 h-3.5" />
            Cần người thật trợ giúp?
          </div>
          <p className="text-[11px] text-[#667078] leading-tight mb-2">
            Gửi yêu cầu hỗ trợ trực tiếp tới quầy tiếp đón nha khoa.
          </p>
          <Link href="/patient/support">
            <Button size="sm" className="w-full h-7 bg-[#147D8D] hover:bg-[#106b79] text-white text-[11px]">
              Yêu cầu hỗ trợ
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <Avatar className="w-8 h-8 border border-[#E8ECEE]">
              <AvatarFallback className="bg-[#147D8D] text-white text-xs font-bold">
                NA
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="text-xs font-semibold text-[#171A1C] leading-tight">Nguyễn Văn A</div>
              <div className="text-[10px] text-[#667078]">Mã BN: CF-89211</div>
            </div>
          </div>
          <Link href="/login" title="Đăng xuất">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[#667078] hover:text-red-600">
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${pathname.startsWith("/patient/appointments/") ? "lg:h-screen lg:overflow-hidden" : "min-h-screen"} bg-[#F7F9FA] text-[#171A1C] flex`}>
      {/* Desktop Sidebar (230px wide, following AGENTS.md) */}
      <aside id="patient-sidebar" className={`${sidebarOpen ? "hidden lg:block" : "hidden"} w-[230px] shrink-0 border-r border-[#E8ECEE] bg-white h-screen sticky top-0 overflow-y-auto`}>
        {sidebarContent}
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Compact Top Bar (following AGENTS.md) */}
        <header className="h-16 shrink-0 bg-white border-b border-[#E8ECEE] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex shrink-0"
              aria-label={sidebarOpen ? "Ẩn thanh bên" : "Mở thanh bên"}
              aria-expanded={sidebarOpen}
              aria-controls="patient-sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <Menu className="size-5" />
            </Button>
            {/* Mobile Sheet Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger aria-label="Mở menu bệnh nhân" className="lg:hidden inline-flex items-center justify-center rounded-lg h-11 w-11 text-[#667078] hover:bg-[#F0F8F7] cursor-pointer">
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[260px]">
                <SheetTitle className="sr-only">Menu Cổng Nha Khoa</SheetTitle>
                {sidebarContent}
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-[#171A1C]">
                Hồ Sơ & Hành Trình Nha Khoa
              </h1>
              <p className="text-[11px] text-[#667078] hidden sm:block">
                CareFlow Dental • Trợ lý hành trình nha khoa
              </p>
            </div>
          </div>

          {/* Utility actions & Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-[#F7F9FA] border border-[#E8ECEE] rounded-lg px-3 py-1.5 w-56 text-xs text-[#667078]">
              <Search className="w-3.5 h-3.5 mr-2 text-[#667078]" />
              <span>Tìm hướng dẫn nha khoa...</span>
            </div>

            <Link href="/patient/notifications">
              <Button variant="ghost" size="icon" className="h-9 w-9 relative text-[#667078] hover:bg-[#F0F8F7]">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
              </Button>
            </Link>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 border border-[#E8ECEE]">
                <AvatarFallback className="bg-[#147D8D] text-white text-xs font-bold">
                  NA
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-[#171A1C] leading-none">Nguyễn Văn A</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Đang trực tuyến
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className={`flex-1 min-h-0 p-4 sm:p-6 lg:p-8 ${pathname.startsWith("/patient/appointments/") ? "max-w-none lg:overflow-y-auto" : "max-w-7xl"} w-full mx-auto`}>
          {children}
        </main>
      </div>
    </div>
  );
}
