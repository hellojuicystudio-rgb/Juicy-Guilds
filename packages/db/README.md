# Database

Adaptador server-side para o Supabase compartilhado pelo Web backend e pelo Bot.

- Use `SUPABASE_SECRET_KEY` somente em processos server-side.
- Use os tipos gerados em `src/database.types.ts` para refletir o schema remoto.
- Execute `pnpm check:database` para validar a conexão sem ler conteúdo privado.
- Regenere os tipos após migrations com `supabase gen types --linked --schema public`.

Este pacote não deve ser importado por componentes executados no navegador.
