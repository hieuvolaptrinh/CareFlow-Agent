"use client";
import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import type { Appointment } from "@/types/journey";
import { stepLabels } from "@/types/journey";
import { stepPresentation } from "@/lib/step-presentation";
import { BoxFlowRoom } from "@/components/box-flow/box-flow-room";
import {
  BoxFlowBilling,
  BoxFlowCheckin,
  BoxFlowDoctor,
  BoxFlowFinish,
  BoxFlowOrder,
  BoxFlowPharmacy,
} from "@/components/box-flow/box-flow-stations";
import type { FlowData } from "@/components/box-flow/box-flow-base";

const nodeTypes = {
  ROOM: BoxFlowRoom,
  CHECKIN: BoxFlowCheckin,
  DOCTOR: BoxFlowDoctor,
  ORDER: BoxFlowOrder,
  BILLING: BoxFlowBilling,
  PHARMACY: BoxFlowPharmacy,
  FINISH: BoxFlowFinish,
};
export function JourneyFlow({ appointment: a }: { appointment: Appointment }) {
  const [selected, setSelected] = useState<string | null>(null);
  const definitionKey = JSON.stringify(
    a.workflow?.steps.map((s) => ({
      id: s.id,
      prerequisites: s.prerequisites,
    })) ?? [],
  );
  const orderKey = JSON.stringify(a.order);
  const positions = useMemo(() => {
    const definitions = JSON.parse(definitionKey) as {
      id: string;
      prerequisites: string[];
    }[];
    const order = JSON.parse(orderKey) as string[];
    const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    graph.setGraph({
      rankdir: "LR",
      nodesep: 40,
      ranksep: 85,
      marginx: 24,
      marginy: 24,
    });
    order.forEach((id) => graph.setNode(id, { width: 320, height: 460 }));
    definitions.forEach((s) =>
      s.prerequisites.forEach((p) => graph.setEdge(p, s.id)),
    );
    dagre.layout(graph);
    return Object.fromEntries(
      order.map((id) => [
        id,
        { x: graph.node(id).x - 160, y: graph.node(id).y - 230 },
      ]),
    );
  }, [definitionKey, orderKey]);
  if (!a.workflow) return null;
  const current = a.order.find(
    (id) => !["COMPLETED", "SKIPPED", "CANCELLED"].includes(a.steps[id].status),
  );
  const nodes: Node<FlowData>[] = a.workflow.steps.map((s) => ({
    id: s.id,
    type: s.kind,
    position: positions[s.id],
    data: {
      definition: s,
      step: a.steps[s.id],
      room: a.steps[s.id].roomId ? a.rooms[a.steps[s.id].roomId!] : null,
      sequence: a.order.indexOf(s.id) + 1,
      current: s.id === current,
      statusText: stepPresentation(a, s.id).status,
      guidance: stepPresentation(a, s.id).reason,
      inspect: () => setSelected(s.id),
    },
  }));
  const dependencies: Edge[] = a.workflow.steps.flatMap((s) =>
    s.prerequisites.map((p) => ({
      id: `dep-${p}-${s.id}`,
      source: p,
      target: s.id,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "var(--primary)", strokeWidth: 1.5 },
      label: s.condition ? "Nếu được chỉ định" : undefined,
    })),
  );
  const suggested: Edge[] = a.order
    .slice(1)
    .flatMap((id, i) =>
      a
        .workflow!.steps.find((s) => s.id === id)!
        .prerequisites.includes(a.order[i])
        ? []
        : [
            {
              id: `order-${id}`,
              source: a.order[i],
              target: id,
              type: "smoothstep",
              label: "Thứ tự đề xuất",
              style: {
                stroke: "var(--muted-foreground)",
                strokeDasharray: "5 5",
              },
            },
          ],
    );
  const chosen = a.workflow.steps.find((s) => s.id === selected);
  return (
    <div className="relative h-[650px] min-w-0 rounded-2xl overflow-hidden border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={[...dependencies, ...suggested]}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15, minZoom: 0.75, maxZoom: 1 }}
        minZoom={0.25}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesReconnectable={false}
        deleteKeyCode={null}
        onNodeClick={(_, node) => setSelected(node.id)}
        onPaneClick={() => setSelected(null)}
        aria-label="Sơ đồ hành trình khám từ trái sang phải"
      >
        <Background color="var(--border)" gap={22} />
        <Controls showInteractive={false} />
      </ReactFlow>
      <div className="absolute top-3 left-3 rounded-lg border bg-card/95 px-3 py-2 text-[11px] text-muted-foreground pointer-events-none">
        Đường liền: điều kiện bắt buộc · Đường đứt: thứ tự đề xuất
      </div>
      {chosen && (
        <section
          aria-label="Chi tiết bước"
          className="absolute bottom-3 right-3 left-16 sm:left-auto sm:w-80 bg-card border rounded-xl p-4 shadow-sm"
        >
          <div className="flex justify-between gap-2">
            <h3 className="font-semibold text-sm">{chosen.name}</h3>
            <button
              aria-label="Đóng chi tiết"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
          </div>
          <p className="text-xs text-primary my-2">
            {stepLabels[a.steps[chosen.id].status]}
          </p>
          <p className="text-sm text-muted-foreground">{chosen.instruction}</p>
          <p className="text-sm mt-3 rounded-lg bg-muted p-3">{stepPresentation(a, chosen.id).reason}</p>
          {chosen.prerequisites.length > 0 && (
            <p className="text-xs mt-3">
              Cần hoàn tất:{" "}
              {chosen.prerequisites
                .map((p) => a.workflow!.steps.find((s) => s.id === p)!.name)
                .join(", ")}
            </p>
          )}
          {chosen.condition && (
            <p className="text-xs mt-2">
              Điều kiện:{" "}
              {a.conditions[chosen.condition] === "UNDECIDED"
                ? "Chờ quyết định chỉ định demo"
                : a.conditions[chosen.condition] === "ORDERED"
                  ? "Đã có chỉ định demo"
                  : "Không cần thực hiện"}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
