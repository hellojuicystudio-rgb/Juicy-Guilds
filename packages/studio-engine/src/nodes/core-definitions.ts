import type { WorkflowNode, WorkflowNodeConfig, WorkflowNodeKind } from "@juicy-guilds/contracts";
import type { NodeCategory, NodeDefinition, NodeFieldDefinition } from "../model.ts";

interface CatalogEntry {
  kind: WorkflowNodeKind;
  label: string;
  category: NodeCategory;
  description: string;
  defaultConfig: WorkflowNodeConfig;
  fields: NodeFieldDefinition[];
}

const catalog: CatalogEntry[] = [
  { kind: "message", label: "Mensagem", category: "content", description: "Envia conteúdo textual.", defaultConfig: { content: "Hello Juicy" }, fields: [{ key: "content", label: "Conteúdo", type: "textarea", required: true }] },
  { kind: "embed", label: "Embed", category: "content", description: "Monta conteúdo rico do Discord.", defaultConfig: { title: "Novo embed", description: "Descrição", color: "#536877" }, fields: [{ key: "title", label: "Título", type: "text", required: true }, { key: "description", label: "Descrição", type: "textarea", required: true }, { key: "color", label: "Cor", type: "color", required: true }] },
  { kind: "container", label: "Container", category: "component", description: "Agrupa componentes relacionados.", defaultConfig: { direction: "column", label: "Grupo" }, fields: [{ key: "label", label: "Nome", type: "text", required: true }, { key: "direction", label: "Direção", type: "select", options: [{ label: "Coluna", value: "column" }, { label: "Linha", value: "row" }] }] },
  { kind: "button", label: "Botão", category: "component", description: "Captura uma interação por botão.", defaultConfig: { customId: "button", label: "Continuar", style: "primary" }, fields: [{ key: "label", label: "Texto", type: "text", required: true }, { key: "customId", label: "ID", type: "text", required: true }, { key: "style", label: "Estilo", type: "select", options: ["primary", "secondary", "success", "danger"].map((value) => ({ label: value, value })) }] },
  { kind: "select-menu", label: "Select Menu", category: "component", description: "Captura uma escolha em lista.", defaultConfig: { customId: "select", placeholder: "Escolha uma opção", options: ["Opção 1", "Opção 2"] }, fields: [{ key: "customId", label: "ID", type: "text", required: true }, { key: "placeholder", label: "Placeholder", type: "text", required: true }, { key: "options", label: "Opções (uma por linha)", type: "list", required: true }] },
  { kind: "modal", label: "Modal", category: "component", description: "Coleta dados estruturados do usuário.", defaultConfig: { customId: "modal", title: "Novo formulário" }, fields: [{ key: "title", label: "Título", type: "text", required: true }, { key: "customId", label: "ID", type: "text", required: true }] },
  { kind: "condition", label: "Condição", category: "logic", description: "Direciona o fluxo por uma regra.", defaultConfig: { field: "member.id", operator: "exists", value: "" }, fields: [{ key: "field", label: "Campo", type: "text", required: true }, { key: "operator", label: "Operador", type: "select", options: [{ label: "Existe", value: "exists" }, { label: "Igual", value: "equals" }, { label: "Diferente", value: "not-equals" }] }, { key: "value", label: "Valor", type: "text" }] },
  { kind: "action", label: "Ação", category: "operation", description: "Executa uma operação registrada.", defaultConfig: { action: "log", target: "workflow concluído" }, fields: [{ key: "action", label: "Ação", type: "select", options: [{ label: "Registrar log", value: "log" }, { label: "Adicionar cargo", value: "add-role" }, { label: "Remover cargo", value: "remove-role" }] }, { key: "target", label: "Alvo", type: "text", required: true }] },
];

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateConfig(node: WorkflowNode, fields: NodeFieldDefinition[]) {
  const config = node.config as unknown as Record<string, unknown>;
  const errors: string[] = [];
  for (const field of fields) {
    const value = config[field.key];
    if (field.required && (field.type === "list" ? !Array.isArray(value) || value.length === 0 : !text(value))) {
      errors.push(`${field.label} é obrigatório`);
    }
  }
  if (node.kind === "message" && node.config.content.length > 2000) errors.push("Mensagem excede 2000 caracteres");
  return errors;
}

export const coreNodeDefinitions: NodeDefinition[] = catalog.map((item) => ({
  ...item,
  validate(node) {
    if (node.kind !== item.kind) return [`Esperado nó ${item.kind}, recebido ${node.kind}`];
    return validateConfig(node, item.fields);
  },
}));
