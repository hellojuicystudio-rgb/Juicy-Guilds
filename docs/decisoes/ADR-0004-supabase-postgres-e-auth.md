# ADR-0004: Supabase para Postgres e autenticação

- Estado: Aceita
- Data: 2026-08-09

## Contexto

O Juicy Guilds precisa persistir workflows e autenticar administradores pelo
Discord sem aproximar o cliente Web de credenciais privilegiadas. A fundação
também precisa de migrations reproduzíveis e de uma conexão independente para
Web e Bot.

## Decisão

Adotar Supabase Postgres como persistência e Supabase Auth com Discord como
provedor de identidade. Alterações de esquema serão registradas em
`supabase/migrations` pela Supabase CLI e revisadas antes de `db push`.

Tabelas expostas terão RLS habilitado. A chave publishable poderá ser usada pelo
cliente sob políticas explícitas; `SUPABASE_SECRET_KEY`, Client Secrets e a
conexão Postgres serão exclusivos de processos server-side e do ambiente de
deploy. A Web continuará sem acesso ao token do Bot.

## Consequências

- O projeto passa a depender da disponibilidade e das convenções do Supabase.
- Desenvolvimento local requer Supabase CLI e, para a stack completa, Docker.
- O histórico remoto precisa permanecer alinhado às migrations versionadas.
- Autorização por guilda continuará sendo regra de domínio e não será delegada
  apenas ao papel `authenticated`.
- Fila e comunicação Web → Bot permanecem fora desta decisão.

## Alternativas consideradas

- Postgres gerenciado sem Supabase: mantém maior independência, mas exige montar
  autenticação, APIs e ferramentas operacionais separadamente.
- Persistência específica por aplicação: rejeitada porque duplicaria a fonte de
  verdade e enfraqueceria os contratos compartilhados.
