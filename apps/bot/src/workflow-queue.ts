import type { Database } from "@juicy-guilds/db";
import { compileWorkflow, coreNodeDefinitions, NodeRegistry, parseWorkflowDocument } from "@juicy-guilds/studio-engine";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Client } from "discord.js";

import { DiscordJsRuntime } from "./runtime/discord-adapter.js";

export interface BotConnection {
  client: Client;
  label: string;
}

function registry() {
  const value = new NodeRegistry();
  for (const definition of coreNodeDefinitions) value.register(definition);
  return value;
}

export async function processPendingJob(
  database: SupabaseClient<Database>,
  bots: BotConnection[],
) {
  const { data: pending, error: readError } = await database
    .from("workflow_jobs")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (readError) throw readError;
  if (!pending) return false;

  const { data: claimed, error: claimError } = await database
    .from("workflow_jobs")
    .update({ status: "processing", claimed_at: new Date().toISOString(), attempts: pending.attempts + 1 })
    .eq("id", pending.id)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();
  if (claimError) throw claimError;
  if (!claimed) return true;

  const bot = bots.find(({ client }) => client.guilds.cache.has(claimed.guild_id));
  let status: "completed" | "failed" = "completed";
  let errorMessage: string | null = null;

  try {
    if (!bot) throw new Error("Nenhum bot conectado à guilda");
    const workflow = parseWorkflowDocument(claimed.definition);
    if (workflow.guildId !== claimed.guild_id) throw new Error("Guilda da definição não confere");
    const compilation = compileWorkflow(workflow, registry());
    if (!compilation.plan) throw new Error(compilation.errors.join("; "));
    await new DiscordJsRuntime(bot.client).execute(compilation.plan, {
      guildId: claimed.guild_id,
      channelId: claimed.channel_id,
    });
  } catch (error) {
    status = "failed";
    errorMessage = error instanceof Error ? error.message.slice(0, 1000) : "Falha desconhecida";
  }

  const completedAt = new Date().toISOString();
  const { error: updateError } = await database.from("workflow_jobs").update({
    status,
    completed_at: completedAt,
    last_error: errorMessage,
  }).eq("id", claimed.id);
  if (updateError) throw updateError;

  const { error: logError } = await database.from("execution_logs").insert({
    job_id: claimed.id,
    project_id: claimed.project_id,
    requester_id: claimed.requester_id,
    guild_id: claimed.guild_id,
    channel_id: claimed.channel_id,
    status,
    bot_user_id: bot?.client.user?.id ?? null,
    error: errorMessage,
  });
  if (logError) throw logError;
  console.log(`Workflow ${claimed.project_id}: ${status}${bot ? ` via ${bot.label}` : ""}.`);
  return true;
}
