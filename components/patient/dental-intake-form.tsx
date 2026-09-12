"use client";
import { useState } from "react";
import type { Appointment, IntakeFact } from "@/types/journey";
import { dentalFields, dentalWorkflowIds } from "@/lib/intake-context";
import { Button } from "@/components/ui/button";

export function DentalIntakeForm({ appointment: a, send, disabled }: { appointment: Appointment; send: (target: "actions", value: unknown) => Promise<boolean>; disabled: boolean }) {
  const [fields, setFields] = useState<Record<string, Pick<IntakeFact, "value" | "status">>>({});
  const [workflow, setWorkflow] = useState(a.intakeContext?.workflowId || "dental-pain");
  const options: Record<string, string[]> = { breathing: ["Thở bình thường", "Đang khó thở", "Không biết"], swallowing: ["Nuốt bình thường", "Đang khó nuốt", "Không biết"], swelling: ["Không sưng", "Có sưng", "Không biết"] };
  return <details className="border-t p-4"><summary className="text-sm text-primary cursor-pointer">Biểu mẫu lời khai · khi trợ lý chưa sẵn sàng</summary>
    <form className="mt-3 space-y-3 max-h-96 overflow-auto" onSubmit={(e) => { e.preventDefault(); void send("actions", { type: "SAVE_DENTAL_INTAKE", workflowId: workflow, facts: fields }); }}>
      <p className="text-xs text-muted-foreground">Điền thông tin thật bạn muốn khai. Không biết/không cung cấp được lưu riêng, không tự hiểu là không có.</p>
      <label className="block text-xs">Nhu cầu nha khoa<select aria-label="Mẫu nha khoa" value={workflow} onChange={(e) => setWorkflow(e.target.value)} className="block w-full border rounded-lg p-2 bg-card">{dentalWorkflowIds.map((id, i) => <option key={id} value={id}>{["Đau / ê răng", "Khám nướu", "Tái khám", "Kiểm tra định kỳ"][i]}</option>)}</select></label>
      {Object.entries(dentalFields).map(([key, label]) => {
        const fact = fields[key] ?? a.intakeContext?.facts[key] ?? { value: "", status: "ANSWERED" as const };
        const update = (value: string, status = fact.status) => setFields((old) => ({ ...old, [key]: { value, status } }));
        return <fieldset key={key} className="space-y-1"><legend className="text-xs font-medium">{label}</legend>
          <select aria-label={`Trạng thái ${label}`} className="w-full border rounded-lg p-2 text-xs bg-card" value={fact.status} onChange={(e) => update(e.target.value === "UNKNOWN" ? "Không biết" : e.target.value === "DECLINED" ? "Không muốn cung cấp" : "", e.target.value as IntakeFact["status"])}><option value="ANSWERED">Khai thông tin</option><option value="UNKNOWN">Không biết / không nhớ</option><option value="DECLINED">Không muốn cung cấp</option></select>
          {options[key] && fact.status === "ANSWERED" ? <select aria-label={label} className="w-full border rounded-lg p-2 text-sm bg-card" value={fact.value} onChange={(e) => update(e.target.value, e.target.value === "Không biết" ? "UNKNOWN" : "ANSWERED")}><option value="">Chọn lời khai</option>{options[key].map((value) => <option key={value}>{value}</option>)}</select> : <input aria-label={label} className="w-full border rounded-lg p-2 text-sm" maxLength={400} disabled={fact.status !== "ANSWERED"} value={fact.value} onChange={(e) => update(e.target.value)} />}
        </fieldset>;
      })}
      <Button type="submit" disabled={disabled}>Lưu lời khai để xác nhận</Button>
    </form>
  </details>;
}
