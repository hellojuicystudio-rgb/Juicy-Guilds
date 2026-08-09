# Último handoff

## Tarefa executada

Correção do OAuth Discord e substituição do ID manual por dropdown seguro de
canais graváveis, sincronizados pelos Bots e protegidos por RLS.

## Arquivos alterados

- `supabase/config.toml`: callback sem override local, allow-list de localhost e
  configuração local alinhada ao estado hospedado.
- `apps/web/src/app/auth/callback/route.ts` e `page.tsx`: erro do provedor agora
  é distinguido de callback sem código e exibido ao usuário.
- `supabase/migrations/20260809210559_add_guild_channels.sql`: catálogo de
  canais, RLS por membership e grants mínimos.
- `apps/bot/src/guild-channels.ts`: união dos canais em que ao menos um Bot tem
  `VIEW_CHANNEL` e permissão de envio.
- Dashboard e publicação: dropdown de canal e validação server-side contra o
  catálogo autorizado.
- `supabase/migrations/20260809203408_add_workflow_execution_pipeline.sql`:
  memberships, preferências, campos de publicação, jobs, logs, grants e RLS.
- `packages/db/src/database.types.ts`: tipos regenerados do schema remoto.
- `apps/web`: sincronização pós-OAuth, seleção de guilda, formulário validado de
  mensagem e publicação de projeto/job.
- `apps/bot`: claim condicional, validação/compilação, execução e log do job.
- `packages/studio-engine`: parser de documento, validação da mensagem e testes.
- ADR-0006, tarefas, checklist e READMEs atualizados com o modelo de comunicação.

## Validações realizadas

- `supabase config push`: Auth atualizado; Client Secret hospedado passou a ter
  o mesmo fingerprint da credencial local; Storage ficou sem alterações.
- OAuth real concluído: callback recebeu código, sessão foi criada, dashboard
  abriu e a guilda foi selecionada.
- Quatro migrations alinhadas; 6 canais sincronizados em 2 guildas.
- `guild_channels` respondeu HTTP 401 para chave pública sem sessão.
- Advisors: desempenho sem alertas; segurança somente alerta de proteção de
  senha vazada, não aplicável ao login exclusivamente por Discord.
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

Escolher um canal no dropdown e executar o primeiro job real; depois iniciar o
Studio visual com os oito tipos de nó.
