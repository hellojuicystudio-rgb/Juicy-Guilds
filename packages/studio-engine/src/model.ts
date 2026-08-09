import type { WorkflowNode, WorkflowNodeConfig, WorkflowNodeKind } from "@juicy-guilds/contracts";

export type NodeCategory = "content" | "component" | "logic" | "operation";

export interface NodeDefinition {
  kind: WorkflowNodeKind;
  label: string;
  category: NodeCategory;
  description: string;
  defaultConfig: WorkflowNodeConfig;
  fields: NodeFieldDefinition[];
  validate(node: WorkflowNode): string[];
}

export interface NodeFieldDefinition {
  key: string;
  label: string;
  type: "text" | "textarea" | "color" | "select" | "list";
  options?: ReadonlyArray<{ label: string; value: string }>;
  placeholder?: string;
  required?: boolean;
}

export type ExecutionStep = {
  [Kind in WorkflowNodeKind]: {
    nodeId: string;
    kind: Kind;
    config: Extract<WorkflowNode, { kind: Kind }>["config"];
  };
}[WorkflowNodeKind];

export interface ExecutionPlan {
  workflowId: string;
  workflowVersion: number;
  steps: ExecutionStep[];
}
