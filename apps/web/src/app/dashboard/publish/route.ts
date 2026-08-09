import { CURRENT_WORKFLOW_SCHEMA_VERSION, type WorkflowDocument } from "@juicy-guilds/contracts";
import { compileWorkflow, coreNodeDefinitions, NodeRegistry } from "@juicy-guilds/studio-engine";
import { NextResponse, type NextRequest } from "next/server";

import { canManageDiscordGuild } from "../../../lib/discord";
import { createServerSupabaseClient } from "../../../lib/supabase/server";

const SNOWFLAKE = /^\d{16,22}$/;

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.redirect(new URL("/", request.url), 303);

  const { data: sessionData } = await supabase.auth.getSession();
  const providerToken = sessionData.session?.provider_token;
  const form = await request.formData();
  const guildId = form.get("guildId");
  const channelId = form.get("channelId");
  const name = form.get("name");
  const content = form.get("content");

  if (
    !providerToken || typeof guildId !== "string" || !SNOWFLAKE.test(guildId) ||
    typeof channelId !== "string" || !SNOWFLAKE.test(channelId) ||
    typeof name !== "string" || name.trim().length < 2 || name.length > 80 ||
    typeof content !== "string" || content.trim().length === 0 || content.length > 2000
  ) {
    return NextResponse.redirect(new URL("/dashboard?error=invalid-workflow", request.url), 303);
  }

  if (!(await canManageDiscordGuild(providerToken, guildId))) {
    return NextResponse.redirect(new URL("/dashboard?error=guild-not-authorized", request.url), 303);
  }

  const { data: channel } = await supabase
    .from("guild_channels")
    .select("channel_id")
    .eq("guild_id", guildId)
    .eq("channel_id", channelId)
    .maybeSingle();
  if (!channel) {
    return NextResponse.redirect(new URL("/dashboard?error=channel-not-available", request.url), 303);
  }

  const now = new Date().toISOString();
  const projectId = crypto.randomUUID();
  const definition: WorkflowDocument = {
    schemaVersion: CURRENT_WORKFLOW_SCHEMA_VERSION,
    id: projectId,
    version: 1,
    guildId,
    name: name.trim(),
    nodes: [{ id: "message-1", kind: "message", position: { x: 0, y: 0 }, config: { content: content.trim() } }],
    edges: [],
    createdAt: now,
    updatedAt: now,
  };
  const registry = new NodeRegistry();
  for (const node of coreNodeDefinitions) registry.register(node);
  const compilation = compileWorkflow(definition, registry);
  if (!compilation.plan) {
    return NextResponse.redirect(new URL("/dashboard?error=invalid-workflow", request.url), 303);
  }

  const { error: projectError } = await supabase.from("projects").insert({
    id: projectId,
    name: definition.name,
    owner_id: userData.user.id,
    guild_id: guildId,
    channel_id: channelId,
    definition,
    status: "published",
    published_at: now,
  });
  if (projectError) return NextResponse.redirect(new URL("/dashboard?error=project-save", request.url), 303);

  const { error: jobError } = await supabase.from("workflow_jobs").insert({
    project_id: projectId,
    requester_id: userData.user.id,
    guild_id: guildId,
    channel_id: channelId,
    definition,
  });
  const suffix = jobError ? "?error=job-create" : "?published=1";
  return NextResponse.redirect(new URL(`/dashboard${suffix}`, request.url), 303);
}
