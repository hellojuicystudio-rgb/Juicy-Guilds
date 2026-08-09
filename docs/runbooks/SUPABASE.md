# Supabase: conexão e migrations

## Preparação

1. Mantenha `.env` fora do Git e use `.env.example` apenas como contrato.
2. Autentique a CLI com `supabase login`.
3. Vincule o projeto com `supabase link --project-ref <project-ref>`.
4. Confira o alinhamento com `supabase migration list --linked`.

## Fluxo de alteração SQL

1. Crie migrations com `supabase migration new <descricao>`.
2. Desenvolva e valide localmente com `supabase db reset`.
3. Revise RLS, grants, índices e advisors antes do deploy.
4. Versione a migration no Git.
5. Aplique remotamente com `supabase db push` apenas após revisão.

Nunca use a chave secret no cliente Web. Não altere o histórico remoto com
`migration repair` sem confirmar primeiro a origem da divergência.
