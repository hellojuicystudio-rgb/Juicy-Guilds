import assert from "node:assert/strict";
import test from "node:test";

import { compileWorkflow, coreNodeDefinitions, NodeRegistry, parseWorkflowDocument, serializeWorkflowDocument } from "../src/index.ts";

function validWorkflow(content = "Hello Juicy") {
  return {
    schemaVersion: 1,
    id: "workflow-1",
    version: 1,
    guildId: "123456789012345678",
    name: "Saudação",
    nodes: [{ id: "message-1", kind: "message", position: { x: 0, y: 0 }, config: { content } }],
    edges: [],
    createdAt: "2026-08-09T00:00:00.000Z",
    updatedAt: "2026-08-09T00:00:00.000Z",
  };
}

test("parseia e compila um workflow de mensagem", () => {
  const registry = new NodeRegistry();
  for (const definition of coreNodeDefinitions) registry.register(definition);
  const result = compileWorkflow(parseWorkflowDocument(validWorkflow()), registry);

  assert.equal(result.errors.length, 0);
  const step = result.plan?.steps[0];
  assert.equal(step?.kind, "message");
  if (step?.kind === "message") assert.equal(step.config.content, "Hello Juicy");
});

test("rejeita documento sem estrutura e mensagem vazia", () => {
  assert.throws(() => parseWorkflowDocument({ id: "incompleto" }), /inválido/);

  const registry = new NodeRegistry();
  for (const definition of coreNodeDefinitions) registry.register(definition);
  const result = compileWorkflow(parseWorkflowDocument(validWorkflow("")), registry);
  assert.deepEqual(result.errors, ["message-1: Conteúdo é obrigatório"]);
});

test("valida e serializa os oito tipos de nó", () => {
  const document = parseWorkflowDocument(validWorkflow());
  document.nodes = coreNodeDefinitions.map((definition, index) => ({
    id: `node-${index}`,
    kind: definition.kind,
    position: { x: index * 100, y: 0 },
    config: structuredClone(definition.defaultConfig),
  })) as typeof document.nodes;
  document.edges = document.nodes.slice(1).map((node, index) => ({ id: `edge-${index}`, source: document.nodes[index]!.id, target: node.id }));
  const registry = new NodeRegistry();
  for (const definition of coreNodeDefinitions) registry.register(definition);

  const result = compileWorkflow(parseWorkflowDocument(JSON.parse(serializeWorkflowDocument(document))), registry);
  assert.deepEqual(result.errors, []);
  assert.equal(result.plan?.steps.length, 8);
});

test("rejeita ciclos no grafo", () => {
  const document = parseWorkflowDocument(validWorkflow());
  document.nodes.push({ id: "message-2", kind: "message", position: { x: 1, y: 1 }, config: { content: "Fim" } });
  document.edges = [
    { id: "a", source: "message-1", target: "message-2" },
    { id: "b", source: "message-2", target: "message-1" },
  ];
  const registry = new NodeRegistry();
  for (const definition of coreNodeDefinitions) registry.register(definition);
  assert.deepEqual(compileWorkflow(document, registry).errors, ["Workflow contém ciclo"]);
});
