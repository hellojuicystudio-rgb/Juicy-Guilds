import {
  checkDatabaseConnection,
  createServerDatabaseClient,
} from "@juicy-guilds/db";
import { redirect } from "next/navigation";

import { listManagedDiscordGuilds } from "../../lib/discord";
import { createServerSupabaseClient } from "../../lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/");

  const { data: sessionData } = await supabase.auth.getSession();
  const providerToken = sessionData.session?.provider_token;
  const guilds = providerToken ? await listManagedDiscordGuilds(providerToken) : [];
  const database = createServerDatabaseClient(process.env);
  const health = await checkDatabaseConnection(database);

  return (
    <main className="shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Guildas administradas</h2>
        </div>
        <form action="/auth/signout" method="post">
          <button className="button secondary" type="submit">Sair</button>
        </form>
      </div>
      <p className="status">Supabase conectado · {health.count} projetos</p>
      <section className="grid">
        {guilds.map((guild) => (
          <article className="card" key={guild.id}>
            <strong>{guild.name}</strong>
            <p>{guild.owner ? "Proprietário" : "Pode gerenciar"}</p>
          </article>
        ))}
        {guilds.length === 0 ? (
          <article className="card"><strong>Nenhuma guilda disponível</strong><p>Entre novamente para renovar o acesso do Discord.</p></article>
        ) : null}
      </section>
    </main>
  );
}
