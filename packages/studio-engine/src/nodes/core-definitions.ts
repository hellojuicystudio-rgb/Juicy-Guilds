import type { WorkflowNodeKind } from "@juicy-guilds/contracts";
import type { NodeCategory, NodeDefinition } from "../model.ts";

const catalog: ReadonlyArray<{
  kind: WorkflowNodeKind;
  label: string;
  category: NodeCategory;
  description: string;
}> = [
  { kind: "message", label: "Mensagem", category: "content", description: "Envia conteúdo textual." },
  { kind: "embed", label: "Embed", category: "content", description: "Monta conteúdo rico do Discord." },
  { kind: "container", label: "Container", category: "component", description: "Agrupa componentes relacionados." },
  { kind: "button", label: "Botão", category: "component", description: "Captura uma interação por botão." },
  { kind: "select-menu", label: "Select Menu", category: "component", description: "Captura uma escolha em lista." },
  { kind: "modal", label: "Modal", category: "component", description: "Coleta dados estruturados do usuário." },
  { kind: "condition", label: "Condição", category: "logic", description: "Direciona o fluxo por uma regra." },
  { kind: "action", label: "Ação", category: "operation", description: "Executa uma operação registrada." },
];

export const coreNodeDefinitions: NodeDefinition[] = catalog.map((item) => ({
  ...item,
  validate(node) {
    if (node.kind !== item.kind) return [`Esperado nó ${item.kind}, recebido ${node.kind}`];
    if (item.kind === "message") {
      const content = node.config.content;
      if (typeof content !== "string" || content.trim().length === 0) return ["Mensagem vazia"];
      if (content.length > 2000) return ["Mensagem excede 2000 caracteres"];
    }
    return [];
  },
}));
