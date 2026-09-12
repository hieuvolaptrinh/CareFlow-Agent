import { it, expect } from "vitest";
import { loadEnvConfig } from "@next/env";
import { runAgentLoop } from "@/server/agent/core/agent-loop";
import { createAppointment } from "@/server/workflow/engine";

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
