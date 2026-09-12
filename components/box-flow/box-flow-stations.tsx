"use client";
import { FlowCard, type FlowData } from "./box-flow-base";
export function BoxFlowCheckin({ data }: { data: FlowData }) {
  return <FlowCard data={data} label="Tiếp nhận" />;
}
export function BoxFlowDoctor({ data }: { data: FlowData }) {
  return <FlowCard data={data} label="Khám với bác sĩ" />;
}
export function BoxFlowOrder({ data }: { data: FlowData }) {
  return <FlowCard data={data} label="Chỉ định & kết quả" />;
}
export function BoxFlowBilling({ data }: { data: FlowData }) {
  return <FlowCard data={data} label="Thanh toán mô phỏng" />;
}
export function BoxFlowPharmacy({ data }: { data: FlowData }) {
  return <FlowCard data={data} label="Nhận thuốc" />;
}
export function BoxFlowFinish({ data }: { data: FlowData }) {
  return <FlowCard data={data} label="Hoàn tất" />;
}
