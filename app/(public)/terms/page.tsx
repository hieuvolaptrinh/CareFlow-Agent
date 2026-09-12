"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Download,
  FileCheck,
  FileText,
  HeartPulse,
  HelpCircle,
  Lock,
  PhoneCall,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>("scope");

  const sections = [
    { id: "scope", title: "1. Phạm vi nền tảng CareFlow" },
    { id: "boundaries", title: "2. Ranh giới Y khoa & Không chẩn đoán" },
    { id: "emergency", title: "3. Tình huống Khẩn cấp (Red Flags)" },
    { id: "privacy", title: "4. Bảo mật dữ liệu & Quyền riêng tư (PII)" },
    { id: "handoff", title: "5. Quyền yêu cầu hỗ trợ người thật (Handoff)" },
    { id: "consent", title: "6. Thỏa thuận Đồng thuận & Rút lại" },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-[#147D8D] hover:underline gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại Trang chủ CareFlow
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-[#ABE3DF] bg-[#EFF9F7] text-[#147D8D] text-xs py-1 px-3">
            Phiên bản 1.0 • Có hiệu lực từ 12/09/2026
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="border-[#E8ECEE] text-[#171A1C] hover:bg-white gap-1.5 text-xs h-8"
            onClick={() => window.print()}
          >
            <Download className="w-3.5 h-3.5 text-[#147D8D]" />
            In / Lưu PDF
          </Button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6F4] text-[#147D8D] text-xs font-semibold mb-4 border border-[#ABE3DF]">
          <Scale className="w-3.5 h-3.5" />
          Chính Sách Pháp Lý & Đồng Thuận Bệnh Nhân
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171A1C] tracking-tight">
          Điều Khoản Sử Dụng & Thỏa Thuận Đồng Thuận CareFlow
        </h1>
        <p className="mt-4 text-sm sm:text-base text-[#667078] leading-relaxed">
          Tài liệu này xác lập các quyền, nghĩa vụ và nguyên tắc bảo vệ bạn khi sử dụng nền tảng điều phối hành trình y tế CareFlow Agent. Vui lòng đọc kỹ để hiểu rõ cách thức hệ thống hỗ trợ và bảo vệ thông tin sức khỏe của bạn.
        </p>
      </div>

      {/* 3 Key Takeaways Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <Card className="border-[#E8ECEE] bg-white shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-bold text-[#171A1C]">Không Thay Thế Bác Sĩ</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#667078] leading-relaxed">
            CareFlow là công cụ chỉ đường và điều phối lượt khám. AI tuyệt đối <strong>không chẩn đoán</strong>, <strong>không kê đơn</strong> và không can thiệp phác đồ điều trị lâm sàng.
          </CardContent>
        </Card>

        <Card className="border-[#E8ECEE] bg-white shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-bold text-[#171A1C]">Bảo Mật Y Tế (PII)</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#667078] leading-relaxed">
            Dữ liệu nhân thân và lịch sử khám của bạn được mã hóa an toàn. Chúng tôi chỉ thu thập dữ liệu tối thiểu cần thiết để điều phối bước khám tiếp theo.
          </CardContent>
        </Card>

        <Card className="border-[#E8ECEE] bg-white shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center mb-2">
              <UserCheck className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-bold text-[#171A1C]">Quyền Rút Đồng Thuận</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#667078] leading-relaxed">
            Bạn có quyền tắt hỗ trợ AI bất kỳ lúc nào và chuyển toàn bộ quá trình hướng dẫn sang nhân viên y tế tại quầy mà không bị gián đoạn lượt khám.
          </CardContent>
        </Card>
      </div>

      {/* Main Content Layout (Table of contents + Content blocks) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sticky Sidebar (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            <Card className="border-[#E8ECEE] bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#667078]">
                  Mục lục điều khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                      activeSection === sec.id
                        ? "bg-[#F0F8F7] text-[#147D8D] font-semibold"
                        : "text-[#667078] hover:bg-gray-50 hover:text-[#171A1C]"
                    }`}
                  >
                    <span>{sec.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Hotline Alert */}
            <Alert className="border-red-200 bg-red-50/50 text-[#171A1C]">
              <PhoneCall className="w-4 h-4 text-red-600" />
              <AlertTitle className="text-xs font-bold text-red-700">Đường dây cấp cứu khẩn</AlertTitle>
              <AlertDescription className="text-xs text-[#667078] mt-1">
                Nếu bạn bị đau ngực dữ dội, khó thở hoặc ngất xỉu, hãy bấm gọi ngay <strong>115</strong> hoặc báo điều dưỡng gần nhất.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Right Main Articles (8 Cols) */}
        <div className="lg:col-span-8 space-y-8 text-sm leading-relaxed text-[#171A1C]">
          {/* Section 1 */}
          <section id="scope" className="bg-white rounded-2xl border border-[#E8ECEE] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-[#171A1C]">1. Phạm vi nền tảng CareFlow</h2>
            </div>
            <p className="text-[#667078] mb-4">
              CareFlow Agent là nền tảng điều phối hành trình khám chữa bệnh tại bệnh viện, được thiết kế để:
            </p>
            <ul className="space-y-2.5 text-xs text-[#171A1C] pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Theo dõi trạng thái lượt khám (Visit) từ lúc Check-in đến khi hoàn tất nhận thuốc.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Hướng dẫn người bệnh tới đúng phòng khám, phòng xét nghiệm, quầy viện phí theo chỉ định thực tế của bác sĩ.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Cung cấp số thứ tự điện tử (Queue Ticket) và ước lượng thời gian chờ để giảm bớt áp lực tại phòng chờ.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Cung cấp sơ đồ chỉ đường trong nhà (Indoor Map) phù hợp với cả người đi bộ và người sử dụng xe lăn.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="boundaries" className="bg-white rounded-2xl border border-[#ABE3DF] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-[#147D8D]" />
              </div>
              <h2 className="text-xl font-bold text-[#171A1C]">2. Ranh giới Y khoa & Không chẩn đoán</h2>
            </div>
            <div className="bg-[#EFF9F7]/70 border border-[#ABE3DF] p-4 rounded-xl mb-4 text-xs">
              <strong className="text-[#147D8D] font-bold block mb-1">
                NGUYÊN TẮC CỐT LÕI (NON-CLINICAL GUARANTEE):
              </strong>
              CareFlow Agent KHÔNG PHẢI LÀ BÁC SĨ và KHÔNG ĐƯA RA LỜI KHUYÊN Y TẾ HOẶC CHẨN ĐOÁN LÂM SÀNG DƯỚI BẤT KỲ HÌNH THỨC NÀO.
            </div>
            <p className="text-xs text-[#667078] leading-relaxed mb-3">
              Người bệnh thừa nhận và đồng thuận rằng:
            </p>
            <ul className="space-y-2 text-xs text-[#667078] pl-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>AI không bao giờ tự ý kê đơn, thay đổi đơn thuốc hoặc gợi ý liều lượng dùng thuốc.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>AI không tự giải thích các chỉ số xét nghiệm máu, hình ảnh X-quang theo hướng kết luận bệnh.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Mọi chỉ định y khoa phải do bác sĩ trực tiếp thăm khám ban hành trên hệ thống bệnh viện (HIS/EMR).</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="emergency" className="bg-white rounded-2xl border border-[#E8ECEE] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-[#171A1C]">3. Tình huống Khẩn cấp (Red Flags Policy)</h2>
            </div>
            <p className="text-xs text-[#667078] mb-4">
              Hệ thống được lập trình với cơ chế bảo vệ an toàn cao nhất:
            </p>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl text-red-950">
                <strong className="block text-red-700 font-semibold mb-1">Dấu hiệu cờ đỏ (Red Flags):</strong>
                Nếu người bệnh nhập các triệu chứng nguy kịch (ví dụ: đau thắt ngực, đột ngột khó thở dữ dội, mất thị lực, xuất huyết lớn, co giật...), CareFlow sẽ ngay lập tức dừng luồng định tuyến thông thường và kích hoạt thông báo hỗ trợ khẩn cấp tới nhân viên y tế gần nhất.
              </div>
              <p className="text-[#667078]">
                Người bệnh hiểu rằng trong các trường hợp nguy kịch, người bệnh cần gọi sự trợ giúp trực tiếp từ nhân viên y tế xung quanh thay vì chờ đợi tương tác qua màn hình ứng dụng.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="privacy" className="bg-white rounded-2xl border border-[#E8ECEE] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-[#171A1C]">4. Bảo mật dữ liệu & Quyền riêng tư (PII)</h2>
            </div>
            <p className="text-xs text-[#667078] mb-3">
              Chúng tôi áp dụng nguyên tắc <em>Tối thiểu hóa Dữ liệu (Data Minimization)</em>:
            </p>
            <ul className="space-y-2 text-xs text-[#667078] pl-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#147D8D] shrink-0 mt-0.5" />
                <span>Chỉ truyền tải dữ liệu cần thiết (mã lượt khám, tên khoa/phòng hiện tại) vào phiên xử lý của AI.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#147D8D] shrink-0 mt-0.5" />
                <span>Dữ liệu nhạy cảm được làm mờ (Masking) trong nhật ký kiểm toán (Audit logs).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#147D8D] shrink-0 mt-0.5" />
                <span>Không chia sẻ dữ liệu sức khỏe của người bệnh cho bên thứ ba cho mục đích thương mại.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="handoff" className="bg-white rounded-2xl border border-[#E8ECEE] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-[#171A1C]">5. Quyền yêu cầu hỗ trợ người thật (Human Handoff)</h2>
            </div>
            <p className="text-xs text-[#667078] leading-relaxed mb-3">
              Bất kỳ lúc nào cảm thấy chỉ dẫn của AI chưa rõ ràng, người bệnh đều có quyền bấm nút <strong>&ldquo;Hỏi nhân viên&rdquo;</strong>.
            </p>
            <p className="text-xs text-[#667078] leading-relaxed">
              Khi kích hoạt chuyển giao, CareFlow sẽ gửi tóm tắt ngắn gọn về trạng thái khám hiện tại sang màn hình điều dưỡng/quầy tiếp đón để nhân viên y tế hỗ trợ người bệnh trực tiếp mà không bắt người bệnh phải kể lại sự việc từ đầu.
            </p>
          </section>

          {/* Section 6 */}
          <section id="consent" className="bg-white rounded-2xl border border-[#E8ECEE] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#EFF9F7] text-[#147D8D] flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-[#171A1C]">6. Thỏa thuận Đồng thuận & Quyền rút lại</h2>
            </div>
            <p className="text-xs text-[#667078] leading-relaxed mb-4">
              Bằng việc đăng nhập và sử dụng CareFlow Agent, người bệnh xác nhận đã đọc, hiểu và đồng thuận cho phép CareFlow điều phối hành trình khám chữa bệnh theo các điều khoản nêu trên.
            </p>
            <div className="p-4 bg-[#F7F9FA] rounded-xl border border-[#E8ECEE] text-xs space-y-2">
              <strong className="block text-[#171A1C]">Cách thức rút lại đồng thuận:</strong>
              <p className="text-[#667078]">
                Người bệnh có thể vào mục <em>Hồ sơ cá nhân &gt; Quản lý đồng thuận</em> để tắt tính năng trợ lý AI hoặc báo trực tiếp nhân viên tiếp đón tại sảnh bệnh viện. Lượt khám của bạn vẫn diễn ra bình thường theo quy trình thủ công của bệnh viện.
              </p>
            </div>
          </section>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl border border-[#E8ECEE] p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#171A1C] mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#147D8D]" />
              Câu hỏi thường gặp về Đồng thuận y tế
            </h3>
            <Accordion className="w-full text-xs">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-xs font-semibold text-[#171A1C]">
                  Nếu tôi không đồng ý dùng CareFlow, tôi có được khám bệnh không?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-[#667078] leading-relaxed">
                  Có. Việc sử dụng CareFlow Agent là hoàn toàn tự nguyện. Nếu từ chối, bạn vẫn được nhân viên tiếp nhận cấp phiếu số thứ tự và sổ khám giấy theo quy trình truyền thống của bệnh viện.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-xs font-semibold text-[#171A1C]">
                  CareFlow có tự ý huỷ lịch hẹn của tôi không?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-[#667078] leading-relaxed">
                  Không. AI chỉ hỗ trợ tra cứu và nhắc nhở. Việc hủy hoặc dời lịch khám chỉ được thực hiện khi có xác nhận chủ động từ bạn hoặc thông báo chính thức từ bệnh viện theo quy chế.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger className="text-xs font-semibold text-[#171A1C]">
                  Nếu AI chỉ đường sai phòng thì sao?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-[#667078] leading-relaxed">
                  Bản đồ Indoor Map dựa trên sơ đồ chuẩn đã được ban quản trị bệnh viện phê duyệt. Tuy nhiên, nếu có thay đổi đột xuất tại hiện trường, bạn có thể bấm nút &ldquo;Báo sai vị trí&rdquo; hoặc liên hệ điều dưỡng trực tại tầng để được chỉ dẫn chính xác nhất.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* User Confirmation Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#EFF9F7] via-white to-[#EFF9F7] border border-[#ABE3DF] p-6 text-center space-y-3">
            <h4 className="text-base font-bold text-[#171A1C]">Bạn đã sẵn sàng trải nghiệm hành trình khám bệnh thông minh?</h4>
            <p className="text-xs text-[#667078] max-w-lg mx-auto">
              Bắt đầu theo dõi lượt khám, nhận số thứ tự và chỉ đường tức thì với CareFlow Agent.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link href="/patient/dashboard">
                <Button className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs px-6 h-9">
                  Đồng ý & Vào Cổng Bệnh Nhân
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-[#E8ECEE] text-xs h-9">
                  Về Trang chủ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
