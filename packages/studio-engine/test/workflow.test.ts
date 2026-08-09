import assert from "node:assert/strict";
import test from "node:test";

import { compileWorkflow, coreNodeDefinitions, NodeRegistry, parseWorkflowDocument } from "../src/index.ts";

function validWorkflow(content = "Hello Juicy") {
  return {
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
  assert.equal(result.plan?.steps[0]?.config.content, "Hello Juicy");
});

test("rejeita documento sem estrutura e mensagem vazia", () => {
  assert.throws(() => parseWorkflowDocument({ id: "incompleto" }), /inválido/);

  const registry = new NodeRegistry();
  for (const definition of coreNodeDefinitions) registry.register(definition);
  const result = compileWorkflow(parseWorkflowDocument(validWorkflow("")), registry);
  assert.deepEqual(result.errors, ["message-1: Mensagem vazia"]);
});
