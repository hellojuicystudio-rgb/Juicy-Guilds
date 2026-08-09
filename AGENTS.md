# Instruções obrigatórias para agentes

Este arquivo é o ponto de entrada para Codex, Claude, Copilot, Cursor, CLIs e outros agentes.

## Ordem de leitura

1. `agents/CONTEXT.md`
2. `agents/RULES.md`
3. `agents/TASKS.md`
4. `agents/DECISIONS.md`
5. documentação específica da área alterada

## Antes de editar

- Confirme o objetivo e os critérios de aceite da tarefa.
- Verifique `agents/OWNERSHIP.md` para evitar duas alterações concorrentes na mesma área.
- Não copie código de `dependencias/` sem seguir `dependencias/POLITICA_DE_ADOCAO.md`.
- Preserve a separação entre `apps/web`, `apps/bot` e os pacotes de domínio.
- Não coloque tokens, chaves, IDs privados ou arquivos `.env` no repositório.

## Durante o trabalho

- Mantenha mudanças pequenas, rastreáveis e limitadas ao escopo.
- Tipos usados por mais de uma aplicação pertencem a `packages/contracts`.
- Regras de execução de fluxos pertencem a `packages/studio-engine`.
- Componentes visuais e tokens não devem importar código do Bot.
- Uma decisão arquitetural nova exige um ADR em `docs/decisoes/`.

## Handoff obrigatório

Atualize `agents/HANDOFF.md` com:

- tarefa executada;
- arquivos alterados;
- validações realizadas;
- riscos e pendências;
- próximo passo recomendado.

Depois execute `node tools/validate-structure.mjs`.
