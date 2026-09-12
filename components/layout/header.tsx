"use client";

import Link from "next/link";
import {
  ArrowRight,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <>
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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#147D8D] flex items-center justify-center text-white shadow-sm shadow-[#147D8D]/20 transition-transform group-hover:scale-105">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight text-[#171A1C] flex items-center gap-1.5">
                CareFlow <span className="text-[#147D8D] font-normal">Agent</span>
              </div>
              <p className="text-[11px] text-[#667078] -mt-1 font-medium">Hành trình y tế liền mạch</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#667078]">
            <Link href="/#features" className="hover:text-[#147D8D] transition-colors">Tính năng cốt lõi</Link>
            <Link href="/#journey" className="hover:text-[#147D8D] transition-colors">Hành trình mẫu</Link>
            <Link href="/#portals" className="hover:text-[#147D8D] transition-colors">Phân hệ chuyên biệt</Link>
            <Link href="/#safety" className="hover:text-[#147D8D] transition-colors">An toàn y khoa</Link>
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
    </>
  );
}
