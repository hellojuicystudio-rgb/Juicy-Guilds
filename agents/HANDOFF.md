# Último handoff

## Tarefa executada

Fluxo 1–6 do construtor visual: contratos dos oito nós, schema/serialização,
catálogo e validação, componentes React, canvas, persistência, publicação e
execução de Mensagem pelo Bot.

## Arquivos alterados

- `packages/contracts/src/workflow.ts`: documento versionado e configurações
  discriminadas para Mensagem, Embed, Container, Botão, Select Menu, Modal,
  Condição e Ação.
- `packages/studio-engine`: defaults, campos, validação, parser, serializador,
  detecção de ciclos e compilação topológica.
- `apps/web/src/app/studio`: canvas React Flow, paleta, nós visuais, conexões,
  inspector, seleção de canal, lista de projetos e ações Salvar/Publicar.
- `apps/web/src/lib/studio-submission.ts`: validação server-side compartilhada.
- Rotas `/studio/save` e `/studio/publish`: persistência RLS e criação de job.
- React Flow 12.11.2 fixado no manifesto/lockfile e registrado em
  `dependencias/react-flow/FONTE.md`.
- ADR-0007 e documentação operacional atualizados.

## Validações realizadas

- `pnpm check`: estrutura, TypeScript e testes de DB, Engine, Web e Bot passam.
- Testes cobrem os oito tipos, round-trip de serialização, configuração
  obrigatória, ciclos, canal inválido e submissão compilável.
- `pnpm build:web`: build de produção aprovado com dez rotas App Router.
- `pnpm audit --prod`: nenhuma vulnerabilidade conhecida.
- `/studio` sem sessão retorna 307 para login.
- Execução real anterior do pipeline foi confirmada nos logs:
  workflow concluído pelo Bot 1 com registro no banco.
- `node tools/validate-structure.mjs`: 17 arquivos obrigatórios encontrados.
- Build de produção e três Bots permanecem ativos para teste em localhost.

## Riscos e pendências

- Somente nós `message` podem ser publicados; os outros sete já podem ser
  criados, conectados, validados e salvos como rascunho.
- O editor ainda não possui undo/redo, auto-layout, atalhos documentados,
  colaboração ou preview Discord fiel.
- Versionamento existe no contrato, mas histórico de versões e rollback ainda
  pertencem ao MVP.
- A fila ainda precisa de retry, timeout, idempotência e claim transacional para
  escala horizontal.
- O advisor Supabase mantém apenas o aviso de leaked-password protection, não
  aplicável enquanto a autenticação for exclusivamente Discord OAuth.

## Próximo passo recomendado

Validar interativamente Salvar/Publicar no Studio e implementar o runtime de
Embed e componentes Discord, começando por preview fiel no painel lateral.
