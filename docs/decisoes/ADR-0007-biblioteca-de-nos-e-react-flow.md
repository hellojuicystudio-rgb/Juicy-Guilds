# ADR-0007 — Biblioteca de nós própria e React Flow no Web

- **Estado:** aceita
- **Data:** 2026-08-09

## Contexto

O Studio precisa editar oito tipos de nó sem acoplar contratos e regras de
execução a uma biblioteca React. O SDK Workflow Builder adicionaria recursos e
dependências genéricas que não são necessários ao primeiro domínio Discord.

## Decisão

- Contratos serializáveis permanecem em `packages/contracts`.
- Defaults, campos, validação, versionamento e compilação pertencem a
  `packages/studio-engine`, sem React ou Discord.
- `@xyflow/react` 12.11.2 fornece somente a interação do canvas em `apps/web`.
- O adaptador converte nós do domínio para nós React Flow e de volta antes de
  salvar.
- Nenhum código das bases externas foi copiado.

## Consequências

A biblioteca de domínio pode ser testada e executada pelo Bot sem carregar a UI.
Trocar o canvas no futuro não altera o documento persistido. Os componentes
Discord além de Mensagem exigirão adaptadores de execução próprios antes de
serem publicáveis.
