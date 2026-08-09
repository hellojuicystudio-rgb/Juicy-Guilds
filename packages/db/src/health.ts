import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types.ts";

export interface DatabaseHealth {
  count: number;
  ok: true;
}

export async function checkDatabaseConnection(
  client: SupabaseClient<Database>,
): Promise<DatabaseHealth> {
  const { count, error } = await client
    .from("projects")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw new Error(`Falha ao consultar o Supabase: ${error.code}`);
  }

  return { count: count ?? 0, ok: true };
}
