import type { WorkflowNode, WorkflowNodeKind } from "@juicy-guilds/contracts";

export type NodeCategory = "content" | "component" | "logic" | "operation";

export interface NodeDefinition {
  kind: WorkflowNodeKind;
  label: string;
  category: NodeCategory;
  description: string;
  validate(node: WorkflowNode): string[];
}

export interface ExecutionStep {
  nodeId: string;
  kind: WorkflowNodeKind;
  config: Record<string, unknown>;
}

export interface ExecutionPlan {
  workflowId: string;
  workflowVersion: number;
  steps: ExecutionStep[];
}
