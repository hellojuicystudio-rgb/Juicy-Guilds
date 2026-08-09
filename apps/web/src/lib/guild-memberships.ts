import { createServerDatabaseClient } from "@juicy-guilds/db";

import type { DiscordGuild } from "./discord";

export async function syncGuildMemberships(
  authUserId: string,
  guilds: DiscordGuild[],
) {
  const database = createServerDatabaseClient(process.env);
  const currentGuildIds = guilds.map((guild) => guild.id);

  if (guilds.length > 0) {
    const { error } = await database.from("guild_memberships").upsert(
      guilds.map((guild) => ({
        auth_user_id: authUserId,
        guild_id: guild.id,
        guild_name: guild.name,
        is_owner: guild.owner,
        permissions: guild.permissions,
        synced_at: new Date().toISOString(),
      })),
      { onConflict: "auth_user_id,guild_id" },
    );
    if (error) throw error;
  }

  let stale = database
    .from("guild_memberships")
    .delete()
    .eq("auth_user_id", authUserId);
  if (currentGuildIds.length > 0) stale = stale.not("guild_id", "in", `(${currentGuildIds.join(",")})`);
  const { error: staleError } = await stale;
  if (staleError) throw staleError;
}
