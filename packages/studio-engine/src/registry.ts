import type { WorkflowNodeKind } from "@juicy-guilds/contracts";
import type { NodeDefinition } from "./model.ts";

export class NodeRegistry {
  readonly #definitions = new Map<WorkflowNodeKind, NodeDefinition>();

  register(definition: NodeDefinition): void {
    if (this.#definitions.has(definition.kind)) {
      throw new Error(`Node kind already registered: ${definition.kind}`);
    }

    this.#definitions.set(definition.kind, definition);
  }

  get(kind: WorkflowNodeKind): NodeDefinition | undefined {
    return this.#definitions.get(kind);
  }

  list(): NodeDefinition[] {
    return [...this.#definitions.values()];
  }
}
