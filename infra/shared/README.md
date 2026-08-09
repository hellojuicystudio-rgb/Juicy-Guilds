# Recursos compartilhados

## Supabase

O ADR-0004 aprova Supabase Postgres e Supabase Auth. A configuração local e as
migrations versionáveis ficam em `supabase/`. Segredos permanecem fora do Git;
a chave publishable pode chegar ao cliente Web, mas a chave secret é exclusiva
de processos server-side.

Fila, telemetria e gestão de segredos de produção ainda exigem decisões próprias.
