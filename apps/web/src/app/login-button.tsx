"use client";

import { useState } from "react";

import { createBrowserSupabaseClient } from "../lib/supabase/client";

export function LoginButton() {
  const [error, setError] = useState<string>();

  async function signIn() {
    setError(undefined);
    const supabase = createBrowserSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "identify guilds",
      },
      provider: "discord",
    });

    if (authError) setError("Não foi possível iniciar o login com Discord.");
  }

  return (
    <>
      <button className="button" onClick={signIn} type="button">
        Entrar com Discord
      </button>
      {error ? <p className="error">{error}</p> : null}
    </>
  );
}
