import type { Database, Json } from "@juicy-guilds/db";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PermissionFlagsBits } from "discord.js";

import type { BotConnection } from "./workflow-queue.js";

interface SyncedChannel {
  botIds: Set<string>;
  channelId: string;
  channelName: string;
  channelType: number;
  guildId: string;
  parentName: string | null;
  position: number;
}

export async function syncGuildChannels(
  database: SupabaseClient<Database>,
  bots: BotConnection[],
) {
  const channels = new Map<string, SyncedChannel>();
  const guildIds = new Set<string>();

  for (const { client } of bots) {
    if (!client.user) continue;
    for (const guild of client.guilds.cache.values()) {
      guildIds.add(guild.id);
      const fetched = await guild.channels.fetch();
      for (const channel of fetched.values()) {
        if (!channel?.isSendable() || !channel.isTextBased()) continue;
        const permissions = channel.permissionsFor(client.user);
        const canSend = channel.isThread()
          ? permissions?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessagesInThreads])
          : permissions?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]);
        if (!canSend) continue;

        const key = `${guild.id}:${channel.id}`;
        const current = channels.get(key) ?? {
          botIds: new Set<string>(),
          channelId: channel.id,
          channelName: channel.name,
          channelType: channel.type,
          guildId: guild.id,
          parentName: channel.parent?.name ?? null,
          position: channel.rawPosition,
        };
        current.botIds.add(client.user.id);
        channels.set(key, current);
      }
    }
  }

  const now = new Date().toISOString();
  for (const guildId of guildIds) {
    const rows = [...channels.values()].filter((channel) => channel.guildId === guildId);
    if (rows.length > 0) {
      const { error } = await database.from("guild_channels").upsert(
        rows.map((channel) => ({
          guild_id: channel.guildId,
          channel_id: channel.channelId,
          channel_name: channel.channelName,
          parent_name: channel.parentName,
          channel_type: channel.channelType,
          position: channel.position,
          bot_user_ids: [...channel.botIds] as Json,
          synced_at: now,
        })),
        { onConflict: "guild_id,channel_id" },
      );
      if (error) throw error;
    }

    let stale = database.from("guild_channels").delete().eq("guild_id", guildId);
    if (rows.length > 0) {
      stale = stale.not("channel_id", "in", `(${rows.map((channel) => channel.channelId).join(",")})`);
    }
    const { error: staleError } = await stale;
    if (staleError) throw staleError;
  }

  console.log(`Canais sincronizados: ${channels.size} canal(is) em ${guildIds.size} guilda(s).`);
}
