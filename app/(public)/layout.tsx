import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F9FA] text-[#171A1C] flex flex-col selection:bg-[#ABE3DF] selection:text-[#147D8D]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
