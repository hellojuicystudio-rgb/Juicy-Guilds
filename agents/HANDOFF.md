# Último handoff

## Entrega

Supabase inicializado e vinculado ao projeto remoto, ambiente local completado,
baseline SQL recuperada e repositório GitHub preparado para publicação.

## Alterado

- `.env` local atualizado com os três bots, Public Keys, Discord OAuth e Supabase; Bot 1 é o principal.
- `.env.example` alinhado ao contrato de configuração sem valores reais.
- Supabase CLI 2.110.0 inicializada e projeto remoto vinculado.
- Configuração local do Discord Auth adicionada em `supabase/config.toml` com segredos via ambiente.
- Migração remota `20260731120000_create-projects-and-templates.sql` recuperada do histórico.
- Migration pendente `20260809171141_restrict_rls_auto_enable.sql` criada para remover execução pública de função `SECURITY DEFINER`.
- ADR-0004 registra Supabase Postgres, Supabase Auth e migrations pela CLI.
- Runbook e documentação de infraestrutura atualizados.
- Repositório Git local isolado em `/home/jefferson/Juicy`, branch `main`, com
  `origin` configurado para `hellojuicystudio-rgb/Juicy-Guilds` via HTTPS autenticado.
- Commit inicial publicado na branch `main` do repositório `Juicy-Guilds`;
  `.env` e metadados temporários Supabase permaneceram fora do Git.

## Validado

- `node tools/validate-structure.mjs`: estrutura válida, 15 arquivos obrigatórios encontrados.
- `.env` confirmado com modo `600` e ignorado pelo Git.
- A CLI está autenticada e tem acesso ao projeto Supabase configurado.
- `supabase migration list --linked`: baseline local e remota alinhada; migration de segurança apenas local/pendente.
- SQL da migration de segurança validado remotamente dentro de transação com `ROLLBACK`.
- Advisors detectaram duas advertências ligadas à mesma função `public.rls_auto_enable()`; a migration pendente trata ambas.
- `git diff --cached --check` sem erros e varredura sem segredos nos arquivos versionáveis.
- Branch local `main` alinhada a `origin/main` após o push inicial.

## Riscos e pendências

- `DATABASE_URL` continua vazia; a CLI conectou por credenciais próprias, mas aplicações precisam da connection string apropriada.
- A migration remota referencia conceitos e caminhos ausentes neste repositório (`BotDefinition`, `packages/db`), sugerindo origem em outra base; revisar antes de adotá-la no domínio Juicy.
- A migration de segurança ainda não foi aplicada remotamente com `supabase db push`.
- GitHub CLI autenticada como `hellojuicystudio-rgb`; identidade local configurada
  como `JuicyStudio <Hello.Juicystudio@gmail.com>`.
- A URL SSH original não pôde ser usada por ausência de chave autorizada; o remoto
  usa HTTPS autenticado pelo GitHub CLI.
- Fila, gestão de segredos de produção e aplicações executáveis continuam pendentes.

## Próximo passo recomendado

Revisar a baseline SQL recuperada, aplicar a migration de segurança e prosseguir
com a prova de conceito vertical após o primeiro commit/PR no Juicy-Guilds.
