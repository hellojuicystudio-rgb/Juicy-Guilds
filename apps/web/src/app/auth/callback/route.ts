import { NextResponse, type NextRequest } from "next/server";

import { listManagedDiscordGuilds } from "../../../lib/discord";
import { syncGuildMemberships } from "../../../lib/guild-memberships";
import { createServerSupabaseClient } from "../../../lib/supabase/server";

export async function GET(request: NextRequest) {
  const providerError = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");
  const requestedNext = request.nextUrl.searchParams.get("next");
  const next =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/dashboard";

  if (providerError) return NextResponse.redirect(new URL("/?auth=provider-error", request.url));
  if (!code) return NextResponse.redirect(new URL("/?auth=missing-code", request.url));

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return NextResponse.redirect(new URL("/?auth=failed", request.url));

  const providerToken = data.session.provider_token;
  if (providerToken) {
    const guilds = await listManagedDiscordGuilds(providerToken);
    await syncGuildMemberships(data.user.id, guilds);
  }
  return NextResponse.redirect(new URL(next, request.url));
}
