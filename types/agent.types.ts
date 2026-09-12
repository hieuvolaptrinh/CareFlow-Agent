export interface AgentRequest {
  message: string;
  visitId?: string;
  conversationId?: string;
}

export interface AgentQuickAction {
  id: string;
  label: string;
  action: string;
  payload?: Record<string, unknown>;
}

export interface AgentStructuredResponse {
  message: string;
  action?: string;
  currentStep?: Record<string, unknown>;
  nextStep?: Record<string, unknown>;
  navigation?: {
    building?: string;
    floor?: string;
    room?: string;
    routeId?: string;
  };
  quickActions?: AgentQuickAction[];
  handoffRequired?: boolean;
}
