import type { WorkflowDocument } from "@juicy-guilds/contracts";
import type { ExecutionPlan, ExecutionStep } from "./model.ts";
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
  const edgeIds = new Set<string>();

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
    if (edgeIds.has(edge.id)) errors.push(`ID de aresta duplicado: ${edge.id}`);
    edgeIds.add(edge.id);
    if (!ids.has(edge.source)) errors.push(`Origem inexistente: ${edge.source}`);
    if (!ids.has(edge.target)) errors.push(`Destino inexistente: ${edge.target}`);
    if (edge.source === edge.target) errors.push(`Auto conexão não permitida: ${edge.source}`);
  }

  if (errors.length > 0) return { errors };

  const indegree = new Map(workflow.nodes.map((node) => [node.id, 0]));
  const targets = new Map(workflow.nodes.map((node) => [node.id, [] as string[]]));
  for (const edge of workflow.edges) {
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
    targets.get(edge.source)?.push(edge.target);
  }
  const queue = workflow.nodes.filter((node) => indegree.get(node.id) === 0);
  const ordered = [] as typeof workflow.nodes;
  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) break;
    ordered.push(node);
    for (const target of targets.get(node.id) ?? []) {
      const next = (indegree.get(target) ?? 1) - 1;
      indegree.set(target, next);
      if (next === 0) {
        const targetNode = workflow.nodes.find((candidate) => candidate.id === target);
        if (targetNode) queue.push(targetNode);
      }
    }
  }
  if (ordered.length !== workflow.nodes.length) return { errors: ["Workflow contém ciclo"] };

  return {
    errors,
    plan: {
      workflowId: workflow.id,
      workflowVersion: workflow.version,
      steps: ordered.map(({ id, kind, config }) => ({
        nodeId: id,
        kind,
        config,
      }) as ExecutionStep),
    },
  };
}
