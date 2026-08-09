import {
  CURRENT_WORKFLOW_SCHEMA_VERSION,
  WORKFLOW_NODE_KINDS,
  type WorkflowDocument,
  type WorkflowNodeKind,
} from "@juicy-guilds/contracts";

const kinds = new Set<WorkflowNodeKind>(WORKFLOW_NODE_KINDS);

export function parseWorkflowDocument(value: unknown): WorkflowDocument {
  if (!value || typeof value !== "object") throw new Error("Workflow deve ser um objeto");
  const candidate = value as Partial<WorkflowDocument>;
  const schemaVersion = candidate.schemaVersion ?? 1;
  if (schemaVersion !== CURRENT_WORKFLOW_SCHEMA_VERSION) {
    throw new Error(`Versão de schema não suportada: ${schemaVersion}`);
  }
  if (
    typeof candidate.id !== "string" || typeof candidate.name !== "string" ||
    typeof candidate.guildId !== "string" || !Number.isInteger(candidate.version) ||
    !Array.isArray(candidate.nodes) || !Array.isArray(candidate.edges) ||
    typeof candidate.createdAt !== "string" || typeof candidate.updatedAt !== "string"
  ) throw new Error("Documento de workflow inválido");

  for (const node of candidate.nodes) {
    if (
      !node || typeof node !== "object" || typeof node.id !== "string" ||
      !kinds.has(node.kind) || !node.config || typeof node.config !== "object" ||
      !node.position || !Number.isFinite(node.position.x) || !Number.isFinite(node.position.y)
    ) throw new Error("Nó de workflow inválido");
  }
  for (const edge of candidate.edges) {
    if (!edge || typeof edge.id !== "string" || typeof edge.source !== "string" || typeof edge.target !== "string") {
      throw new Error("Aresta de workflow inválida");
    }
  }
  return { ...candidate, schemaVersion } as WorkflowDocument;
}

export function serializeWorkflowDocument(workflow: WorkflowDocument) {
  return JSON.stringify(parseWorkflowDocument(workflow));
}
