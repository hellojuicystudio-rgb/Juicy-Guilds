import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabaseClient } from "../../../lib/supabase/server";
import { parseStudioSubmission } from "../../../lib/studio-submission";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ errors: ["Sessão expirada"] }, { status: 401 });
  const parsed = parseStudioSubmission(await request.json().catch(() => null));
  if (!parsed.submission) return NextResponse.json({ errors: parsed.errors }, { status: 400 });
  const { channelId, workflow } = parsed.submission;
  const unsupported = workflow.nodes.filter((node) => node.kind !== "message");
  if (unsupported.length > 0) {
    return NextResponse.json({ errors: ["Nesta etapa, publique apenas workflows com nós Mensagem; os demais nós já podem ser salvos como rascunho."] }, { status: 400 });
  }

  const { data: channel } = await supabase.from("guild_channels").select("channel_id").eq("guild_id", workflow.guildId).eq("channel_id", channelId).maybeSingle();
  if (!channel) return NextResponse.json({ errors: ["Canal não autorizado"] }, { status: 403 });
  const now = new Date().toISOString();
  const { error: projectError } = await supabase.from("projects").upsert({
    id: workflow.id,
    name: workflow.name.trim(),
    owner_id: userData.user.id,
    guild_id: workflow.guildId,
    channel_id: channelId,
    definition: workflow,
    status: "published",
    published_at: now,
    updated_at: now,
  }, { onConflict: "id" });
  if (projectError) return NextResponse.json({ errors: ["Não foi possível publicar o workflow"] }, { status: 400 });

  const { error: jobError } = await supabase.from("workflow_jobs").insert({
    project_id: workflow.id,
    requester_id: userData.user.id,
    guild_id: workflow.guildId,
    channel_id: channelId,
    definition: workflow,
  });
  if (jobError) return NextResponse.json({ errors: ["Workflow salvo, mas a execução não entrou na fila"] }, { status: 400 });
  return NextResponse.json({ projectId: workflow.id });
}
