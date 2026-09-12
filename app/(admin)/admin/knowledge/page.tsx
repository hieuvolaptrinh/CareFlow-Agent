"use client";

import { useState } from "react";
import {
  BookOpen,
  Database,
  Download,
  FileCheck2,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function KnowledgeAdminPage() {
  const [search, setSearch] = useState("");

  const documents = [
    {
      id: "DOC-BYT-01",
      title: "Dược Thư Quốc Gia Việt Nam - Lần xuất bản thứ III",
      category: "Dược lý & Tương tác thuốc",
      chunks: "14,280 chunks",
      source: "Bộ Y Tế ban hành",
      lastIndexed: "10/09/2026",
      status: "synced",
    },
    {
      id: "DOC-BYT-02",
      title: "Hướng Dẫn Chẩn Đoán & Điều Trị Bệnh Tăng Huyết Áp (QĐ 3192/QĐ-BYT)",
      category: "Phác đồ Lâm sàng",
      chunks: "2,450 chunks",
      source: "Cục Quản lý Khám Chữa Bệnh",
      lastIndexed: "08/09/2026",
      status: "synced",
    },
    {
      id: "DOC-BYT-03",
      title: "Phác Đồ Cấp Cứu Sốc Phản Vệ & Phản Ứng Dị Ứng Thuốc",
      category: "Cấp cứu khẩn cấp",
      chunks: "1,120 chunks",
      source: "Thông tư 51/2017/TT-BYT",
      lastIndexed: "05/09/2026",
      status: "synced",
    },
    {
      id: "DOC-BV-01",
      title: "Quy Chế Tiếp Nhận & Phân Luồng Khám Bệnh Ngoại Trú BV 2026",
      category: "Quy trình Bệnh viện",
      chunks: "890 chunks",
      source: "Hội đồng Y khoa Bệnh viện",
      lastIndexed: "Hôm qua",
      status: "synced",
    },
  ];

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] text-[11px] font-semibold">
              <Database className="w-3.5 h-3.5 mr-1" />
              Vertex AI Vector Search Store
            </Badge>
            <span className="text-xs text-[#667078]">Dimensions: 768 • Cosine Similarity</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Cơ sở Tri thức Y khoa & Nguồn Dữ liệu RAG
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Quản lý tài liệu lâm sàng, dược thư và phác đồ điều trị được mô hình AI trích dẫn khi tư vấn bệnh nhân.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
            Tải lên tài liệu y khoa (.pdf, .docx)
          </Button>
        </div>
      </div>

      {/* Search & Statistics Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E8ECEE]">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#667078]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tài liệu hoặc phác đồ điều trị..."
            className="pl-8 text-xs bg-[#F7F9FA] border-[#E8ECEE] h-8"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-[#667078]">
          <span>Tổng số chunks index: <strong className="text-[#147D8D]">18,740 vector</strong></span>
          <span className="text-gray-300">•</span>
          <span className="text-emerald-600 font-medium">Embedding: text-embedding-004</span>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filtered.map((doc) => (
          <Card key={doc.id} className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-4 hover:border-[#ABE3DF] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F0F8F7] text-[#147D8D] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-xs text-[#171A1C]">{doc.title}</span>
                    <Badge variant="outline" className="bg-[#EFF9F7] text-[#147D8D] border-[#ABE3DF] text-[9px]">
                      {doc.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#667078]">
                    Nguồn: {doc.source} • Quy mô: {doc.chunks} • Cập nhật: {doc.lastIndexed}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center shrink-0">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                  Đã index Vector
                </Badge>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-[#667078]">
                  Chi tiết chunks
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
