import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types.js";
import {
  readServerDatabaseConfig,
  type DatabaseEnvironment,
} from "./config.js";

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
