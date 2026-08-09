import assert from "node:assert/strict";
import test from "node:test";
import type { WorkflowDocument } from "@juicy-guilds/contracts";

import { parseStudioSubmission } from "../src/lib/studio-submission.ts";

function workflow(): WorkflowDocument {
  const now = "2026-08-09T00:00:00.000Z";
  return {
    schemaVersion: 1,
    id: "workflow-1",
    version: 1,
    guildId: "123456789012345678",
    name: "Saudação",
    nodes: [{ id: "message-1", kind: "message", position: { x: 0, y: 0 }, config: { content: "Hello Juicy" } }],
    edges: [],
    createdAt: now,
    updatedAt: now,
  };
}

test("aceita submissão serializável e compilável", () => {
  const result = parseStudioSubmission({ channelId: "123456789012345678", workflow: workflow() });
  assert.deepEqual(result.errors, []);
  assert.equal(result.submission?.workflow.nodes.length, 1);
});

test("rejeita canal adulterado e workflow cíclico", () => {
  assert.deepEqual(parseStudioSubmission({ channelId: "inválido", workflow: workflow() }).errors, ["Canal inválido"]);
  const cyclic = workflow();
  cyclic.nodes.push({ id: "message-2", kind: "message", position: { x: 1, y: 1 }, config: { content: "Fim" } });
  cyclic.edges = [
    { id: "a", source: "message-1", target: "message-2" },
    { id: "b", source: "message-2", target: "message-1" },
  ];
  assert.deepEqual(parseStudioSubmission({ channelId: "123456789012345678", workflow: cyclic }).errors, ["Workflow contém ciclo"]);
});
