begin;

create table public.guild_channels (
  guild_id text not null,
  channel_id text not null,
  channel_name text not null,
  parent_name text,
  channel_type integer not null,
  position integer not null default 0,
  bot_user_ids jsonb not null default '[]'::jsonb,
  synced_at timestamptz not null default now(),
  primary key (guild_id, channel_id)
);

create index guild_channels_order_idx
  on public.guild_channels (guild_id, parent_name, position, channel_name);

alter table public.guild_channels enable row level security;

create policy "members_read_guild_channels"
  on public.guild_channels for select to authenticated
  using (
    exists (
      select 1 from public.guild_memberships membership
      where membership.auth_user_id = (select auth.uid())
        and membership.guild_id = guild_channels.guild_id
    )
  );

revoke all on public.guild_channels from anon, authenticated;
grant select on public.guild_channels to authenticated;
grant all on public.guild_channels to service_role;

commit;
