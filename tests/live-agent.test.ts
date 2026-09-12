import { it, expect } from "vitest";
import { loadEnvConfig } from "@next/env";
import { runAgentLoop } from "@/server/agent/core/agent-loop";
import { createAppointment } from "@/server/workflow/engine";
import { emptyIntakeContext } from "@/lib/intake-context";

it.skipIf(process.env.CAREFLOW_LIVE_AI_TEST !== "true")("Vertex dental context extracts synthetic symptoms and recalls them", async () => {
  loadEnvConfig(process.cwd());
  const a = createAppointment("synthetic-dental", "synthetic", Date.now());
  a.intakeContext = emptyIntakeContext();
  const first = await runAgentLoop(a, "Tôi muốn khám mới nha khoa. Tôi đau răng hàm dưới bên phải ba ngày, đau 6/10 từng lúc khi nhai. Tôi không khó thở và không khó nuốt. Tôi dị ứng penicillin.", [], "synthetic-source");
  expect(first.failed).toBe(false); expect(first.handoff).toBe(false);
  expect(first.context?.facts.location.value).toContain("phải");
  expect(first.context?.facts.allergies.value).toContain("penicillin");
  a.intakeContext = first.context;
  const recall = await runAgentLoop(a, "Bạn nhắc lại vị trí đau và dị ứng tôi đã khai?", [], "synthetic-recall");
  expect(recall.failed).toBe(false); expect(recall.message).toContain("penicillin");
  expect(recall.message).toContain("phải");
}, 95000);

it.skipIf(process.env.CAREFLOW_LIVE_AI_TEST !== "true")(
  "Vertex AI returns validated structured intake for a synthetic case",
  async () => {
    loadEnvConfig(process.cwd());
    const result = await runAgentLoop(
      createAppointment("synthetic", "synthetic", Date.now()),
      "Đây là dữ liệu giả lập. Tôi muốn khám sức khỏe theo gói demo của CareFlow, tôi xác nhận chọn gói demo.",
      [],
    );
    expect(result.failed).toBe(false);
    expect(result.handoff).toBe(false);
    expect(result.draft?.workflowId).toBe("checkup");
  },
  50000,
);
