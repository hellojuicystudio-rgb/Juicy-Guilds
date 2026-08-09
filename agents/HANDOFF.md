# Último handoff

## Tarefa executada

Implementação do primeiro pipeline vertical Web → Postgres → Bot: sincronização
e seleção persistida de guilda, publicação de workflow `message`, fila durável,
execução pelo Discord Gateway e auditoria do resultado.

## Arquivos alterados

- `supabase/migrations/20260809203408_add_workflow_execution_pipeline.sql`:
  memberships, preferências, campos de publicação, jobs, logs, grants e RLS.
- `packages/db/src/database.types.ts`: tipos regenerados do schema remoto.
- `apps/web`: sincronização pós-OAuth, seleção de guilda, formulário validado de
  mensagem e publicação de projeto/job.
- `apps/bot`: claim condicional, validação/compilação, execução e log do job.
- `packages/studio-engine`: parser de documento, validação da mensagem e testes.
- ADR-0006, tarefas, checklist e READMEs atualizados com o modelo de comunicação.

## Validações realizadas

- Migration aplicada e três versões alinhadas local/remotamente.
- Advisors Supabase de segurança e desempenho: nenhum alerta.
- Data API anônima recebeu HTTP 401 nas quatro tabelas novas.
- `pnpm check`: estrutura, TypeScript e todos os testes aprovados.
- `pnpm build:web`: build de produção aprovado com sete rotas do App Router.
- `pnpm check:database`: conexão server-side aprovada.
- `BOT_PROCESS_ONCE=true`: três bots conectados, consumidor iniciado e encerrado
  corretamente com a fila vazia; nenhuma mensagem adicional foi enviada.
- `node tools/validate-structure.mjs`: estrutura válida.

## Riscos e pendências

- O pipeline completo depende de um usuário concluir o OAuth, selecionar uma
  guilda e informar um canal Discord válido para gerar o primeiro job real.
- A fila atual é suficiente para um consumidor. Escala horizontal exige claim
  atômico com `FOR UPDATE SKIP LOCKED` ou Supabase Queues/PGMQ.
- Retry, timeout, idempotência e rate-limit ainda pertencem ao MVP.
- Só o nó `message` possui execução concreta; os outros sete tipos ainda
  precisam de UI e adaptadores operacionais.
- Segredos de produção devem sair do `.env` local e ir para um cofre de deploy.
- A CLI não atualiza o cache local do catálogo sem Docker, mas schema, tipos,
  migration e advisors foram confirmados diretamente no projeto remoto.

## Próximo passo recomendado

Concluir o OAuth pelo navegador e executar um job real pelo novo formulário;
depois iniciar o Studio visual com os oito tipos de nó.
