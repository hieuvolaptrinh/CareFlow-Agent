"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  type Node,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import type { Appointment, SyncStatus } from "@/types/journey";
import { stepPresentation } from "@/lib/step-presentation";
import { api } from "@/lib/api-client";
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
export function JourneyFlow({
  appointment: a,
  sync = "Synced",
  cached = false,
}: {
  appointment: Appointment;
  sync?: SyncStatus;
  cached?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [noteBusy, setNoteBusy] = useState<string | null>(null);
  const [generatedNotes, setGeneratedNotes] = useState<
    Record<string, NonNullable<Appointment["steps"][string]["aiNote"]>>
  >({});
  const [follow, setFollow] = useState(true);
  const [instance, setInstance] = useState<ReactFlowInstance<
    Node<FlowData>,
    Edge
  > | null>(null);
  const definitionKey = JSON.stringify(
    a.workflow?.steps.map((s) => ({
      id: s.id,
      prerequisites: s.prerequisites,
    })) ?? []
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
    order.forEach((id) => graph.setNode(id, { width: 300, height: 420 }));
    definitions.forEach((s) =>
      s.prerequisites.forEach((p) => graph.setEdge(p, s.id))
    );
    dagre.layout(graph);
    return Object.fromEntries(
      order.map((id) => [
        id,
        { x: graph.node(id).x - 150, y: graph.node(id).y - 210 },
      ])
    );
  }, [definitionKey, orderKey]);
  const current = a.order.find(
    (id) => !["COMPLETED", "SKIPPED", "CANCELLED"].includes(a.steps[id].status)
  );
  useEffect(() => {
    if (!follow || !instance || !current || !positions[current]) return;
    void instance.setCenter(
      positions[current].x + 150,
      positions[current].y + 210,
      {
        zoom: 0.95,
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 250,
      }
    );
  }, [current, follow, instance, positions]);
  if (!a.workflow) return null;
  async function inspectStep(stepId: string) {
    setSelected(stepId);
    if (
      a.steps[stepId]?.aiNote ||
      generatedNotes[stepId] ||
      noteBusy === stepId
    )
      return;
    setNoteBusy(stepId);
    try {
      const note = await api<
        NonNullable<Appointment["steps"][string]["aiNote"]>
      >(
        `/api/appointments/${encodeURIComponent(
          a.id
        )}/steps/${encodeURIComponent(stepId)}/note`,
        {}
      );
      setGeneratedNotes((old) => ({ ...old, [stepId]: note }));
    } catch {
      // The detail panel stays neutral when the generated note is unavailable.
    } finally {
      setNoteBusy((current) => (current === stepId ? null : current));
    }
  }
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
      selected: s.id === selected,
      statusText: stepPresentation(a, s.id).status,
      guidance: stepPresentation(a, s.id).reason,
      inspect: () => void inspectStep(s.id),
      sync: cached ? "Pending" : s.id === current ? sync : "Synced",
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
    }))
  );
  const suggested: Edge[] = a.order.slice(1).flatMap((id, i) =>
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
        ]
  );
  const chosen = a.workflow.steps.find((s) => s.id === selected);
  return (
    <div className="relative h-full min-h-[560px] min-w-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden bg-[#F4F8F8]">
        <ReactFlow<Node<FlowData>, Edge>
          nodes={nodes}
          edges={[...dependencies, ...suggested]}
          nodeTypes={nodeTypes}
          onInit={setInstance}
          onMoveStart={(event) => {
            if (event) setFollow(false);
          }}
          fitViewOptions={{ padding: 0.15, minZoom: 0.75, maxZoom: 1 }}
          minZoom={0.25}
          maxZoom={1.6}
          nodesDraggable={false}
          nodesConnectable={false}
          edgesReconnectable={false}
          deleteKeyCode={null}
          onNodeClick={(_, node) => void inspectStep(node.id)}
          onPaneClick={() => setSelected(null)}
          aria-label="Sơ đồ hành trình nha khoa từ trái sang phải; chọn một bước để xem chi tiết"
        >
          <Background color="var(--border)" gap={22} />
          <Controls showInteractive={false} />
        </ReactFlow>
        <div className="absolute bottom-3 left-14 hidden rounded-lg border bg-card/95 px-3 py-2 text-[11px] text-muted-foreground pointer-events-none sm:block">
          Đường liền: điều kiện bắt buộc · Đường đứt: thứ tự đề xuất
        </div>
        <button
          className="absolute right-3 bottom-3 rounded-lg border bg-card px-3 py-2 text-xs font-medium text-primary shadow-sm"
          aria-pressed={follow}
          onClick={() => setFollow((old) => !old)}
        >
          {follow ? "Đang theo dõi bước hiện tại" : "Theo dõi bước hiện tại"}
        </button>
      </div>
      {chosen && (
        <section
          aria-label="Chi tiết bước"
          className="absolute inset-x-3 bottom-3 z-20 max-h-[72%] overflow-auto rounded-2xl border border-primary/20 bg-card/95 p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:bottom-auto sm:right-3 sm:top-20 sm:max-h-[calc(100%-6rem)] sm:w-[340px]"
        >
          <div className="flex justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-primary">
                Bước {a.order.indexOf(chosen.id) + 1} · Chi tiết
              </p>
              <h3 className="mt-1 font-semibold text-base">{chosen.name}</h3>
            </div>
            <button
              aria-label="Đóng chi tiết"
              className="size-8 rounded-lg border text-muted-foreground hover:bg-muted"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
          </div>
          <p className="text-xs text-primary my-2">
            {stepPresentation(a, chosen.id).status}
          </p>
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-xs font-medium">Việc cần làm</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {chosen.instruction}
            </p>
          </div>
          <div className="mt-3 rounded-lg border p-3">
            <p className="text-xs font-medium">Trạng thái hiện tại</p>
            <p className="mt-1 text-sm leading-6">
              {stepPresentation(a, chosen.id).reason}
            </p>
          </div>
          <div className="mt-3 rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-primary">
                Nhận xét tiếp nhận theo góc nhìn bác sĩ
              </p>
            </div>
            {noteBusy === chosen.id ? (
              <p className="mt-2 text-xs text-muted-foreground" role="status">
                Đang phân tích lời khai và trạng thái bước…
              </p>
            ) : a.steps[chosen.id].aiNote || generatedNotes[chosen.id] ? (
              <div className="mt-2 space-y-2 text-sm leading-6">
                <p>
                  {
                    (a.steps[chosen.id].aiNote || generatedNotes[chosen.id])!
                      .observation
                  }
                </p>
                <p className="border-t border-primary/10 pt-2">
                  <span className="font-medium">Tiếp theo: </span>
                  {
                    (a.steps[chosen.id].aiNote || generatedNotes[chosen.id])!
                      .nextAction
                  }
                </p>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Nhận xét đang được cập nhật.
                </p>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-primary underline underline-offset-4"
                  onClick={() => void inspectStep(chosen.id)}
                >
                  Cập nhật nhận xét
                </button>
              </div>
            )}
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
              Nội dung hỗ trợ tiếp nhận, không thay thế chẩn đoán hoặc kết luận của bác sĩ.
            </p>
          </div>
          {a.steps[chosen.id].roomId &&
            (() => {
              const room = a.rooms[a.steps[chosen.id].roomId!];
              return room ? (
                <dl className="mt-3 grid grid-cols-2 gap-3 rounded-lg border p-3 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Phòng</dt>
                    <dd className="mt-1 font-medium">{room.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Vị trí</dt>
                    <dd className="mt-1 font-medium">{room.floor}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Hàng chờ</dt>
                    <dd className="mt-1 font-medium">{room.queueCount} lượt</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Dự kiến</dt>
                    <dd className="mt-1 font-medium">
                      {Math.ceil(room.queueCount / Math.max(1, room.capacity)) *
                        room.serviceMinutes}{" "}
                      phút
                    </dd>
                  </div>
                </dl>
              ) : null;
            })()}
          <p className="text-xs mt-3">
            Bắt đầu:{" "}
            {a.steps[chosen.id].startedAt
              ? new Date(a.steps[chosen.id].startedAt!).toLocaleTimeString(
                  "vi-VN"
                )
              : "Chưa bắt đầu"}
          </p>
          <p className="text-xs mt-2">
            Kết thúc:{" "}
            {a.steps[chosen.id].completedAt
              ? new Date(a.steps[chosen.id].completedAt!).toLocaleTimeString(
                  "vi-VN"
                )
              : "Chưa hoàn tất"}
          </p>
          <p className="text-xs mt-2 text-muted-foreground">
            {cached
              ? "Đang xem dữ liệu đã tải"
              : `Đã đồng bộ phiên bản ${a.revision}`}
          </p>
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
                ? "Chờ xác nhận chỉ định"
                : a.conditions[chosen.condition] === "ORDERED"
                ? "Đã có chỉ định"
                : "Không cần thực hiện"}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
