import {
  checkDatabaseConnection,
  createServerDatabaseClient,
} from "@juicy-guilds/db";
import { redirect } from "next/navigation";
import Link from "next/link";

import { listManagedDiscordGuilds } from "../../lib/discord";
import { createServerSupabaseClient } from "../../lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/");

  const { data: sessionData } = await supabase.auth.getSession();
  const providerToken = sessionData.session?.provider_token;
  const guilds = providerToken ? await listManagedDiscordGuilds(providerToken) : [];
  const { data: settings } = await supabase.from("user_settings").select("selected_guild_id").maybeSingle();
  const selectedGuild = guilds.find((guild) => guild.id === settings?.selected_guild_id);
  const [{ data: channels }, { data: jobs }, { data: logs }] = await Promise.all([
    selectedGuild
      ? supabase.from("guild_channels").select("channel_id,channel_name,parent_name").eq("guild_id", selectedGuild.id).order("parent_name").order("position").order("channel_name")
      : Promise.resolve({ data: [] }),
    supabase.from("workflow_jobs").select("id,status,created_at,last_error").order("created_at", { ascending: false }).limit(5),
    supabase.from("execution_logs").select("id,status,created_at,error").order("created_at", { ascending: false }).limit(5),
  ]);
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
      {selectedGuild ? <Link className="button" href="/studio">Abrir Studio visual</Link> : null}

      <section className="grid">
        {guilds.map((guild) => (
          <article className={`card ${guild.id === selectedGuild?.id ? "selected" : ""}`} key={guild.id}>
            <strong>{guild.name}</strong>
            <p>{guild.owner ? "Proprietário" : "Pode gerenciar"}</p>
            <form action="/dashboard/select" method="post">
              <input name="guildId" type="hidden" value={guild.id} />
              <button className="button compact" type="submit">
                {guild.id === selectedGuild?.id ? "Selecionada" : "Selecionar"}
              </button>
            </form>
          </article>
        ))}
        {guilds.length === 0 ? (
          <article className="card"><strong>Nenhuma guilda disponível</strong><p>Entre novamente para renovar o acesso do Discord.</p></article>
        ) : null}
      </section>

      <section className="panel">
        <p className="eyebrow">Primeiro workflow</p>
        <h2>Publicar mensagem</h2>
        {selectedGuild ? (
          <form action="/dashboard/publish" className="form" method="post">
            <input name="guildId" type="hidden" value={selectedGuild.id} />
            <label>Nome<input maxLength={80} minLength={2} name="name" required /></label>
            <label>Canal
              <select defaultValue="" name="channelId" required>
                <option disabled value="">Selecione um canal</option>
                {channels?.map((channel) => (
                  <option key={channel.channel_id} value={channel.channel_id}>
                    {channel.parent_name ? `${channel.parent_name} / ` : "# "}{channel.channel_name}
                  </option>
                ))}
              </select>
            </label>
            <label>Mensagem<textarea maxLength={2000} name="content" required rows={4} /></label>
            <button className="button" disabled={!channels?.length} type="submit">Publicar e executar em {selectedGuild.name}</button>
            {!channels?.length ? <p className="error">Nenhum canal gravável sincronizado. Reinicie o Bot e atualize a página.</p> : null}
          </form>
        ) : <p>Selecione uma guilda para criar o workflow.</p>}
      </section>

      <section className="split">
        <div className="panel">
          <p className="eyebrow">Fila</p>
          <h2>Execuções solicitadas</h2>
          {jobs?.map((job) => <p className="row" key={job.id}><span>{job.status}</span><time>{new Date(job.created_at).toLocaleString("pt-BR")}</time></p>)}
          {!jobs?.length ? <p>Nenhuma tarefa criada.</p> : null}
        </div>
        <div className="panel">
          <p className="eyebrow">Auditoria</p>
          <h2>Resultados</h2>
          {logs?.map((log) => <p className="row" key={log.id}><span>{log.status}</span><time>{new Date(log.created_at).toLocaleString("pt-BR")}</time></p>)}
          {!logs?.length ? <p>Nenhuma execução registrada.</p> : null}
        </div>
      </section>
    </main>
  );
}
