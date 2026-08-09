import { CURRENT_WORKFLOW_SCHEMA_VERSION, type WorkflowDocument } from "@juicy-guilds/contracts";
import { parseWorkflowDocument } from "@juicy-guilds/studio-engine";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { StudioClient } from "./studio-client";

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/");

  const { data: settings } = await supabase.from("user_settings").select("selected_guild_id").maybeSingle();
  if (!settings?.selected_guild_id) redirect("/dashboard");
  const { project: requestedProject } = await searchParams;
  const [{ data: channels }, { data: projects }] = await Promise.all([
    supabase.from("guild_channels").select("channel_id,channel_name,parent_name").eq("guild_id", settings.selected_guild_id).order("parent_name").order("position"),
    supabase.from("projects").select("id,name,status,updated_at").eq("guild_id", settings.selected_guild_id).order("updated_at", { ascending: false }),
  ]);

  const { data: savedProject } = requestedProject
    ? await supabase.from("projects").select("id,name,definition,channel_id,status").eq("id", requestedProject).maybeSingle()
    : { data: null };
  const now = new Date().toISOString();
  let workflow: WorkflowDocument = {
    schemaVersion: CURRENT_WORKFLOW_SCHEMA_VERSION,
    id: crypto.randomUUID(),
    version: 1,
    guildId: settings.selected_guild_id,
    name: "Novo workflow",
    nodes: [],
    edges: [],
    createdAt: now,
    updatedAt: now,
  };
  if (savedProject) {
    try {
      workflow = parseWorkflowDocument(savedProject.definition);
    } catch {
      // Um documento legado inválido não bloqueia a criação de um novo fluxo.
    }
  }

  return (
    <StudioClient
      channels={channels ?? []}
      initialChannelId={savedProject?.channel_id ?? channels?.[0]?.channel_id ?? ""}
      initialWorkflow={workflow}
      projects={projects ?? []}
    />
  );
}
