"use client";

import { useState } from "react";
import {
  Compass,
  CornerDownRight,
  Layers,
  MapPin,
  Navigation,
  Plus,
  QrCode,
  Radio,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MapsAdminPage() {
  const [selectedFloor, setSelectedFloor] = useState("Tầng 1");

  const floors = [
    { id: "FL-0", name: "Tầng Trệt", desc: "Cấp cứu, Tiếp nhận, Nhà thuốc, Chẩn đoán hình ảnh", nodes: 18 },
    { id: "FL-1", name: "Tầng 1", desc: "Khoa Khám Tổng Quát, Khu đo sinh hiệu, Phòng xét nghiệm máu", nodes: 24 },
    { id: "FL-2", name: "Tầng 2", desc: "Khoa Tim Mạch, Khoa Nội Tiết, Khu hội chẩn liên chuyên khoa", nodes: 16 },
    { id: "FL-3", name: "Tầng 3", desc: "Khoa Mắt, Tai Mũi Họng, Răng Hàm Mặt, Phòng phẫu thuật trong ngày", nodes: 14 },
  ];

  const waypoints = [
    { id: "WP-101", name: "Cửa vào Sảnh Tiếp Đón Chính", type: "Entrance", beacon: "BLE-01 (Hoạt động)", floor: "Tầng 1" },
    { id: "WP-102", name: "Cụm Kiosk Đo Sinh Hiệu Tự Động", type: "Kiosk", beacon: "BLE-02 (Hoạt động)", floor: "Tầng 1" },
    { id: "WP-103", name: "Hành lang Buồng Khám 101 - 106", type: "Hallway", beacon: "BLE-03 (Hoạt động)", floor: "Tầng 1" },
    { id: "WP-104", name: "Thang máy Trung tâm Khu A", type: "Elevator", beacon: "BLE-04 (Hoạt động)", floor: "Tầng 1" },
    { id: "WP-105", name: "Phòng Xét Nghiệm Huyết Học 108", type: "Lab", beacon: "BLE-05 (Hoạt động)", floor: "Tầng 1" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171A1C]">
            Sơ đồ Mặt bằng & Bản đồ Định vị Trong nhà (Indoor Map)
          </h1>
          <p className="text-xs text-[#667078] mt-0.5">
            Đồ thị toạ độ các buồng khám, nút giao thông và trạm phát sóng Bluetooth Beacon chỉ đường cho bệnh nhân.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            className="bg-[#147D8D] hover:bg-[#106b79] text-white text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Thêm Điểm mốc (Waypoint)
          </Button>
        </div>
      </div>

      {/* Floor selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {floors.map((fl) => (
          <button
            key={fl.id}
            onClick={() => setSelectedFloor(fl.name)}
            className={`p-4 rounded-xl text-left border transition-all ${
              selectedFloor === fl.name
                ? "bg-[#F0F8F7] border-[#147D8D] shadow-xs"
                : "bg-white border-[#E8ECEE] hover:border-[#ABE3DF]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold ${selectedFloor === fl.name ? "text-[#147D8D]" : "text-[#171A1C]"}`}>
                {fl.name}
              </span>
              <Badge variant="outline" className="text-[10px] bg-white border-[#E8ECEE]">
                {fl.nodes} điểm mốc
              </Badge>
            </div>
            <p className="text-[11px] text-[#667078] line-clamp-2">
              {fl.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Interactive Map Canvas Mockup */}
      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8ECEE] mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#147D8D]" />
            <span className="text-xs font-bold text-[#171A1C]">
              Bản đồ Toạ độ Vector 2D — {selectedFloor} (Khu Khám Ngoại Trú A)
            </span>
          </div>
          <Badge className="bg-[#147D8D] text-white text-[10px]">
            Beacon Grid Sync: Active
          </Badge>
        </div>

        {/* Visual Map Layout Graphic */}
        <div className="h-64 rounded-xl bg-gradient-to-br from-[#EFF9F7]/80 via-white to-[#EEF7FA]/70 border border-dashed border-[#ABE3DF] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#147D8D_1px,transparent_1px)] [background-size:16px_16px]" />
          <Navigation className="w-10 h-10 text-[#147D8D] mb-3 animate-bounce" />
          <h3 className="text-sm font-bold text-[#171A1C] z-10">Toạ độ Số hóa Không gian Bệnh viện</h3>
          <p className="text-xs text-[#667078] max-w-md mt-1 z-10">
            Hệ thống tự động vẽ đường đi ngắn nhất từ vị trí người bệnh (theo Beacon BLE) đến phòng xét nghiệm, tránh các khu vực cách ly hoặc đang sửa chữa.
          </p>
        </div>
      </Card>

      {/* Waypoints List */}
      <Card className="bg-white border-[#E8ECEE] shadow-none rounded-xl p-5">
        <CardTitle className="text-sm font-bold text-[#171A1C] mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#147D8D]" />
          Danh mục Điểm mốc & Trạm phát tín hiệu tại {selectedFloor}
        </CardTitle>

        <div className="divide-y divide-[#E8ECEE]">
          {waypoints.map((wp) => (
            <div key={wp.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-[#147D8D] bg-[#F0F8F7] px-2 py-0.5 rounded border border-[#ABE3DF]">
                  {wp.id}
                </span>
                <div>
                  <span className="font-semibold text-[#171A1C]">{wp.name}</span>
                  <span className="text-[#667078] ml-2">({wp.type})</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <Radio className="w-3 h-3" /> {wp.beacon}
                </span>
                <Button variant="ghost" size="sm" className="h-6 text-[11px] text-[#667078]">
                  Sửa toạ độ
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
