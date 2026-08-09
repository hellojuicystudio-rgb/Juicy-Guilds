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

  const { data: channel } = await supabase.from("guild_channels").select("channel_id").eq("guild_id", workflow.guildId).eq("channel_id", channelId).maybeSingle();
  if (!channel) return NextResponse.json({ errors: ["Canal não autorizado"] }, { status: 403 });

  const { error } = await supabase.from("projects").upsert({
    id: workflow.id,
    name: workflow.name.trim(),
    owner_id: userData.user.id,
    guild_id: workflow.guildId,
    channel_id: channelId,
    definition: workflow,
    status: "draft",
    published_at: null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (error) return NextResponse.json({ errors: ["Não foi possível salvar o workflow"] }, { status: 400 });
  return NextResponse.json({ projectId: workflow.id });
}
