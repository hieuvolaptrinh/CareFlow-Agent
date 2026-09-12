import { AgentRequest, AgentStructuredResponse } from "@/types";

/**
 * CareFlow Agent Loop Skeleton
 * Follows: OBSERVE -> UNDERSTAND INTENT -> LOAD CONTEXT -> CHECK SAFETY -> WORKFLOW -> TOOL -> RESPOND
 */
export async function runAgentLoop(
  _request: AgentRequest
): Promise<AgentStructuredResponse> {
  return {
    message: "CareFlow Agent đang sẵn sàng điều phối hành trình của bạn.",
  };
}
