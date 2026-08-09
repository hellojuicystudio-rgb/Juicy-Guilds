# Último handoff

## Tarefa executada

Conclusão da parte executável da prova de conceito: dashboard Next.js, login
Discord pelo Supabase Auth, listagem de guildas administradas, acesso tipado ao
banco e runtime Gateway para três bots.

## Arquivos alterados

- `apps/web`: aplicação Next.js 16 com App Router, callback OAuth, logout,
  dashboard protegido e clientes Supabase separados para browser e servidor.
- `apps/bot`: configuração dos três tokens, runtime discord.js e smoke test do
  Gateway integrado ao banco.
- `packages/db`: imports TypeScript compatíveis com consumo direto no workspace.
- `.env.example`, manifestos e `pnpm-lock.yaml`: contrato público e dependências
  fixadas; o `.env` real continua local, ignorado e fora do Git.
- `docs/decisoes/ADR-0005-runtimes-web-e-bot.md`: decisão dos runtimes Web/Bot.
- `agents/TASKS.md`, `docs/roadmap/CHECKLIST.md` e fonte do discord.js:
  progresso e versão adotada atualizados.
- `supabase/migrations/20260809171141_restrict_rls_auto_enable.sql`: aplicada
  ao projeto remoto para revogar execução pública de função privilegiada.

## Validações realizadas

- `pnpm check`: estrutura, TypeScript e testes de DB/Bot aprovados.
- `pnpm build:web`: build de produção Next.js concluído, incluindo todas as
  rotas estáticas e dinâmicas.
- Smoke HTTP: `/` respondeu 200; `/dashboard` anônimo redirecionou; callback sem
  código e com destino externo foi redirecionado para erro local seguro.
- Supabase Auth hospedado: autorização Discord respondeu 302.
- `pnpm check:bot`: Supabase conectado e os três bots autenticados pelo Gateway;
  Bot 1 viu duas guildas e Bots 2/3 viram uma guilda cada.
- `supabase migration list --linked`: as duas migrations estão alinhadas local e
  remotamente.
- `supabase db advisors --linked --type security --level warn`: nenhum alerta.
- `node tools/validate-structure.mjs`: estrutura válida.

## Riscos e pendências

- O login está implementado e o provedor responde, mas o fluxo interativo em
  navegador depende de um usuário concluir o consentimento do Discord.
- A dashboard lista guildas gerenciáveis, mas seleção persistida e autorização
  por guilda pertencem à próxima etapa.
- O runtime executa passos de mensagem, porém publicação, fila, retry,
  idempotência e carregamento de workflows persistidos ainda não existem.
- Segredos de produção devem migrar do `.env` local para um cofre no ambiente de
  deploy antes da publicação.
- A CLI não atualizou seu cache de catálogo após o push porque Docker não está
  instalado; a migration remota e o advisor foram verificados separadamente.

## Próximo passo recomendado

Implementar seleção persistida de guilda e o primeiro fluxo vertical completo:
salvar, publicar e executar um workflow `message`, com autorização, fila e log.
