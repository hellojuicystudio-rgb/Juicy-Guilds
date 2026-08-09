import { type WorkflowDocument } from "@juicy-guilds/contracts";
import { compileWorkflow, coreNodeDefinitions, NodeRegistry, parseWorkflowDocument } from "@juicy-guilds/studio-engine";

export interface StudioSubmission {
  channelId: string;
  workflow: WorkflowDocument;
}

export function parseStudioSubmission(value: unknown): { errors: string[]; submission?: StudioSubmission } {
  try {
    if (!value || typeof value !== "object") throw new Error("Payload inválido");
    const candidate = value as { channelId?: unknown; workflow?: unknown };
    if (typeof candidate.channelId !== "string" || !/^\d{16,22}$/.test(candidate.channelId)) {
      throw new Error("Canal inválido");
    }
    const workflow = parseWorkflowDocument(candidate.workflow);
    if (workflow.name.trim().length < 2 || workflow.name.length > 80) throw new Error("Nome deve ter entre 2 e 80 caracteres");
    const registry = new NodeRegistry();
    for (const definition of coreNodeDefinitions) registry.register(definition);
    const compilation = compileWorkflow(workflow, registry);
    if (!compilation.plan) return { errors: compilation.errors };
    return { errors: [], submission: { channelId: candidate.channelId, workflow } };
  } catch (error) {
    return { errors: [error instanceof Error ? error.message : "Workflow inválido"] };
  }
}
