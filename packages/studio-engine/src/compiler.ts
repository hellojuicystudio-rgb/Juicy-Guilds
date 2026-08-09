import type { WorkflowDocument } from "@juicy-guilds/contracts";
import type { ExecutionPlan } from "./model.ts";
import type { NodeRegistry } from "./registry.ts";

export interface CompileResult {
  errors: string[];
  plan?: ExecutionPlan;
}

export function compileWorkflow(
  workflow: WorkflowDocument,
  registry: NodeRegistry,
): CompileResult {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const node of workflow.nodes) {
    if (ids.has(node.id)) errors.push(`ID de nó duplicado: ${node.id}`);
    ids.add(node.id);

    const definition = registry.get(node.kind);
    if (!definition) {
      errors.push(`Tipo de nó não registrado: ${node.kind}`);
      continue;
    }

    errors.push(...definition.validate(node).map((error) => `${node.id}: ${error}`));
  }

  for (const edge of workflow.edges) {
    if (!ids.has(edge.source)) errors.push(`Origem inexistente: ${edge.source}`);
    if (!ids.has(edge.target)) errors.push(`Destino inexistente: ${edge.target}`);
  }

  if (errors.length > 0) return { errors };

  return {
    errors,
    plan: {
      workflowId: workflow.id,
      workflowVersion: workflow.version,
      steps: workflow.nodes.map(({ id, kind, config }) => ({
        nodeId: id,
        kind,
        config,
      })),
    },
  };
}
