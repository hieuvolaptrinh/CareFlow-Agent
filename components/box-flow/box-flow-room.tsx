"use client";
import { FlowCard, type FlowData } from "./box-flow-base";
export function BoxFlowRoom({ data }: { data: FlowData }) {
  return <FlowCard data={data} label="Phòng dịch vụ" />;
}
