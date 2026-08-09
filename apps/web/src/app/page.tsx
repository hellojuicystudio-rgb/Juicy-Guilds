import Link from "next/link";

import { createServerSupabaseClient } from "../lib/supabase/server";
import { LoginButton } from "./login-button";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  return (
    <main className="shell">
      <p className="eyebrow">Juicy Guilds</p>
      <h1>Automações do Discord, desenhadas visualmente.</h1>
      <p className="lead">
        Conecte sua conta, escolha uma guilda administrada e prepare workflows
        seguros para os bots Juicy.
      </p>
      {data.user ? (
        <Link className="button" href="/dashboard">Abrir dashboard</Link>
      ) : (
        <LoginButton />
      )}
    </main>
  );
}
