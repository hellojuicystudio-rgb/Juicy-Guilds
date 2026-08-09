export const WORKFLOW_NODE_KINDS = [
  "message",
  "embed",
  "container",
  "button",
  "select-menu",
  "modal",
  "condition",
  "action",
] as const;

export type WorkflowNodeKind = (typeof WORKFLOW_NODE_KINDS)[number];

export interface WorkflowNode {
  id: string;
  kind: WorkflowNodeKind;
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
}

export interface WorkflowDocument {
  id: string;
  version: number;
  guildId: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}
