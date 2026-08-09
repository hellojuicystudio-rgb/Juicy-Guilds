import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabaseClient } from "../../../lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.redirect(new URL("/", request.url), 303);

  const form = await request.formData();
  const guildId = form.get("guildId");
  if (typeof guildId !== "string" || !/^\d{16,22}$/.test(guildId)) {
    return NextResponse.redirect(new URL("/dashboard?error=invalid-guild", request.url), 303);
  }

  const { error } = await supabase.from("user_settings").upsert({
    auth_user_id: data.user.id,
    selected_guild_id: guildId,
    updated_at: new Date().toISOString(),
  });

  const suffix = error ? "?error=guild-not-authorized" : "?selected=1";
  return NextResponse.redirect(new URL(`/dashboard${suffix}`, request.url), 303);
}
