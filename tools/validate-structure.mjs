import { readFile, stat } from "node:fs/promises";

const required = [
  "AGENTS.md",
  "agents/CONTEXT.md",
  "agents/RULES.md",
  "agents/TASKS.md",
  "agents/HANDOFF.md",
  "apps/web/package.json",
  "apps/bot/package.json",
  "packages/contracts/package.json",
  "packages/studio-engine/package.json",
  "packages/design-tokens/package.json",
  "docs/roadmap/CHECKLIST.md",
  "FONTES_OPEN_SOURCE.md",
  "dependencias/next-generation/FONTE.md",
  "dependencias/workflow-builder/FONTE.md",
  "dependencias/discord-js/FONTE.md",
];

const sourceFields = ["Criador", "Nome do projeto", "Repositório"];
const errors = [];

for (const path of required) {
  try {
    const info = await stat(path);
    if (!info.isFile()) errors.push(`${path} não é um arquivo`);
  } catch {
    errors.push(`${path} está ausente`);
  }
}

for (const path of required.filter((item) => item.endsWith("/FONTE.md"))) {
  try {
    const content = await readFile(path, "utf8");
    for (const field of sourceFields) {
      if (!content.includes(field)) errors.push(`${path} não registra ${field}`);
    }
  } catch {
    // A ausência já é reportada acima.
  }
}

if (errors.length > 0) {
  console.error("Estrutura inválida:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Estrutura válida: ${required.length} arquivos obrigatórios encontrados.`);
}
