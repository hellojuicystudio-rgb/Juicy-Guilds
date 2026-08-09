import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types.ts";
import {
  readServerDatabaseConfig,
  type DatabaseEnvironment,
} from "./config.ts";

export function createServerDatabaseClient(environment: DatabaseEnvironment) {
  const { secretKey, url } = readServerDatabaseConfig(environment);

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
