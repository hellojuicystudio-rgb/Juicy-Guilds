-- 0001 — Cria as tabelas `projects` e `templates`.
--
-- Aplicar via Supabase (SQL Editor ou `supabase db push` após link).
-- Convenções em packages/db/migrations/README.md — nota: `db push` exige
-- copiar para `supabase/migrations/` (CLI não lê esta pasta por padrão).
--
-- Envolto em transação: aplicação atômica no SQL Editor (erro parcial não
-- deixa estado pela metade).

begin;
-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id          text primary key, -- EntityId gerado pela aplicação (uid("proj"))
  name        text not null,
  description text,
  status      text not null default 'draft'
              constraint projects_status_check
              check (status in ('draft', 'ready', 'published', 'deleting')),
  owner_id    text not null, -- EntityId do dono (identidade futura do Auth)
  definition  jsonb not null, -- BotDefinition serializado
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
-- R2 (PROJECTS.md) — nome único por dono, case-insensitive.
create unique index if not exists projects_owner_name_unique_idx
  on public.projects (owner_id, lower(name));
-- listByOwner (SupabaseProjectRepository) — filtro por dono + ordenação.
create index if not exists projects_owner_id_idx
  on public.projects (owner_id, created_at);
-- ---------------------------------------------------------------------------
-- templates
-- ---------------------------------------------------------------------------
create table if not exists public.templates (
  id             text primary key, -- EntityId gerado pela aplicação (uid("tpl"))
  name           text not null,
  description    text,
  scope          text not null default 'personal'
                 constraint templates_scope_check
                 check (scope in ('official', 'personal')),
  status         text not null default 'draft'
                 constraint templates_status_check
                 check (status in ('draft', 'approved')),
  version        integer not null default 1,
  schema_version integer not null default 1, -- CURRENT_SCHEMA_VERSION (core)
  owner_id       text, -- NULL para templates oficiais
  definition     jsonb not null, -- BotDefinition serializado
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
-- R6 (TEMPLATES.md) — nome único de template pessoal por usuário,
-- case-insensitive. Oficiais (owner_id NULL) não participam da unicidade.
create unique index if not exists templates_owner_name_unique_idx
  on public.templates (owner_id, lower(name))
  where owner_id is not null;
-- listAvailable (SupabaseTemplateRepository) — filtro por (scope, status)
-- e dono pessoal.
create index if not exists templates_scope_status_idx
  on public.templates (scope, status);
create index if not exists templates_owner_id_idx
  on public.templates (owner_id);
-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- O acesso da aplicação é exclusivamente server-side via
-- SUPABASE_SERVICE_ROLE_KEY (a chave de serviço ignora RLS). Habilitar RLS com
-- deny-by-default bloqueia qualquer acesso via chave anônima/pública.
-- Políticas voltadas a usuários (auth.uid()) serão criadas no módulo Auth,
-- quando a identidade for integrada (ADRR-001; DATABASE.md; AUTH.md).
alter table public.projects enable row level security;
alter table public.templates enable row level security;
commit;
