export const CURRENT_WORKFLOW_SCHEMA_VERSION = 1;

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

export interface WorkflowNodeConfigMap {
  message: { content: string };
  embed: { title: string; description: string; color: string };
  container: { direction: "row" | "column"; label: string };
  button: { customId: string; label: string; style: "primary" | "secondary" | "success" | "danger" };
  "select-menu": { customId: string; placeholder: string; options: string[] };
  modal: { customId: string; title: string };
  condition: { field: string; operator: "equals" | "not-equals" | "exists"; value: string };
  action: { action: "add-role" | "remove-role" | "log"; target: string };
}

export type WorkflowNodeConfig = WorkflowNodeConfigMap[WorkflowNodeKind];

export type WorkflowNode = {
  [Kind in WorkflowNodeKind]: {
    id: string;
    kind: Kind;
    position: { x: number; y: number };
    config: WorkflowNodeConfigMap[Kind];
  };
}[WorkflowNodeKind];

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
}

export interface WorkflowDocument {
  schemaVersion: number;
  id: string;
  version: number;
  guildId: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}
