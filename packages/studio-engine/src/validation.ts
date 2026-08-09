import type { WorkflowDocument, WorkflowNodeKind } from "@juicy-guilds/contracts";

const kinds = new Set<WorkflowNodeKind>([
  "message", "embed", "container", "button", "select-menu", "modal", "condition", "action",
]);

export function parseWorkflowDocument(value: unknown): WorkflowDocument {
  if (!value || typeof value !== "object") throw new Error("Workflow deve ser um objeto");
  const candidate = value as Partial<WorkflowDocument>;
  if (
    typeof candidate.id !== "string" || typeof candidate.name !== "string" ||
    typeof candidate.guildId !== "string" || typeof candidate.version !== "number" ||
    !Array.isArray(candidate.nodes) || !Array.isArray(candidate.edges) ||
    typeof candidate.createdAt !== "string" || typeof candidate.updatedAt !== "string"
  ) throw new Error("Documento de workflow inválido");

  for (const node of candidate.nodes) {
    if (
      !node || typeof node !== "object" || typeof node.id !== "string" ||
      !kinds.has(node.kind) || !node.config || typeof node.config !== "object" ||
      !node.position || typeof node.position.x !== "number" || typeof node.position.y !== "number"
    ) throw new Error("Nó de workflow inválido");
  }
  for (const edge of candidate.edges) {
    if (!edge || typeof edge.id !== "string" || typeof edge.source !== "string" || typeof edge.target !== "string") {
      throw new Error("Aresta de workflow inválida");
    }
  }
  return candidate as WorkflowDocument;
}
