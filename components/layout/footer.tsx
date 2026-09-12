import Link from "next/link";
import { HeartPulse, PhoneCall } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E8ECEE] py-12 text-xs text-[#667078]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-[#147D8D] text-white flex items-center justify-center transition-transform group-hover:scale-105">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-[#171A1C]">CareFlow Agent</span>
            </Link>
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
              <li><Link href="/login" className="hover:text-[#147D8D]">Đăng nhập hệ thống</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#171A1C] mb-3">Tính năng</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="hover:text-[#147D8D]">Điều phối bước tiếp theo</Link></li>
              <li><Link href="/#features" className="hover:text-[#147D8D]">Hàng đợi thời gian thực</Link></li>
              <li><Link href="/#features" className="hover:text-[#147D8D]">Chỉ đường bệnh viện (Indoor Map)</Link></li>
              <li><Link href="/#features" className="hover:text-[#147D8D]">Chuyển giao người thật (Handoff)</Link></li>
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
          <div className="flex items-center gap-4">
            <p>© 2026 CareFlow Agent. Toàn quyền sở hữu trí tuệ.</p>
            <span className="hidden sm:inline text-gray-300">•</span>
            <Link href="/terms" className="hover:text-[#147D8D] underline underline-offset-4">
              Điều khoản & Đồng thuận bệnh nhân
            </Link>
          </div>
          <p className="text-[11px] text-[#667078]">
            Thiết kế theo chuẩn định hướng Evergreen Hospital & Tuân thủ Nguyên tắc An toàn Y khoa.
          </p>
        </div>
      </div>
    </footer>
  );
}
