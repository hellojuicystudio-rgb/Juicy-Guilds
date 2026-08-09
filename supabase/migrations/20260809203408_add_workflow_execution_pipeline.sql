begin;

create table public.guild_memberships (
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  guild_id text not null,
  guild_name text not null,
  is_owner boolean not null default false,
  permissions text not null,
  synced_at timestamptz not null default now(),
  primary key (auth_user_id, guild_id)
);

create table public.user_settings (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  selected_guild_id text,
  updated_at timestamptz not null default now(),
  constraint user_settings_selected_guild_fkey
    foreign key (auth_user_id, selected_guild_id)
    references public.guild_memberships(auth_user_id, guild_id)
    on delete cascade
);

alter table public.projects
  add column guild_id text,
  add column channel_id text,
  add column published_at timestamptz;

create table public.workflow_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.projects(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  guild_id text not null,
  channel_id text not null,
  definition jsonb not null,
  status text not null default 'pending'
    constraint workflow_jobs_status_check
    check (status in ('pending', 'processing', 'completed', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  completed_at timestamptz
);

create index workflow_jobs_pending_idx
  on public.workflow_jobs (created_at)
  where status = 'pending';

create table public.execution_logs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.workflow_jobs(id) on delete cascade,
  project_id text not null references public.projects(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  guild_id text not null,
  channel_id text not null,
  status text not null
    constraint execution_logs_status_check
    check (status in ('completed', 'failed')),
  bot_user_id text,
  error text,
  created_at timestamptz not null default now()
);

create index execution_logs_requester_created_idx
  on public.execution_logs (requester_id, created_at desc);

alter table public.guild_memberships enable row level security;
alter table public.user_settings enable row level security;
alter table public.workflow_jobs enable row level security;
alter table public.execution_logs enable row level security;

drop policy if exists "owners_manage_projects" on public.projects;
create policy "owners_manage_projects"
  on public.projects for all to authenticated
  using ((select auth.uid())::text = owner_id)
  with check (
    (select auth.uid())::text = owner_id
    and exists (
      select 1 from public.guild_memberships membership
      where membership.auth_user_id = (select auth.uid())
        and membership.guild_id = projects.guild_id
    )
  );

create policy "users_read_memberships"
  on public.guild_memberships for select to authenticated
  using ((select auth.uid()) = auth_user_id);

create policy "users_manage_settings"
  on public.user_settings for all to authenticated
  using ((select auth.uid()) = auth_user_id)
  with check ((select auth.uid()) = auth_user_id);

create policy "users_create_jobs_for_owned_projects"
  on public.workflow_jobs for insert to authenticated
  with check (
    (select auth.uid()) = requester_id
    and exists (
      select 1 from public.projects project
      where project.id = workflow_jobs.project_id
        and project.owner_id = (select auth.uid())::text
        and project.guild_id = workflow_jobs.guild_id
        and project.channel_id = workflow_jobs.channel_id
        and project.status = 'published'
    )
  );

create policy "users_read_own_jobs"
  on public.workflow_jobs for select to authenticated
  using ((select auth.uid()) = requester_id);

create policy "users_read_own_execution_logs"
  on public.execution_logs for select to authenticated
  using ((select auth.uid()) = requester_id);

revoke all on public.guild_memberships from anon;
revoke all on public.user_settings from anon;
revoke all on public.workflow_jobs from anon;
revoke all on public.execution_logs from anon;

grant select on public.guild_memberships to authenticated;
grant select, insert, update on public.user_settings to authenticated;
grant select, insert, update on public.projects to authenticated;
grant select, insert on public.workflow_jobs to authenticated;
grant select on public.execution_logs to authenticated;
grant all on public.guild_memberships, public.user_settings,
  public.workflow_jobs, public.execution_logs to service_role;

commit;
