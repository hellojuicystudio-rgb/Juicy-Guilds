import assert from "node:assert/strict";
import test from "node:test";

import { readServerDatabaseConfig } from "../src/config.ts";

test("aceita uma configuração server-side válida", () => {
  const secretKey = "sb" + "_secret_example";

  assert.deepEqual(
    readServerDatabaseConfig({
      SUPABASE_SECRET_KEY: secretKey,
      SUPABASE_URL: "https://example.supabase.co/path",
    }),
    {
      secretKey,
      url: "https://example.supabase.co",
    },
  );
});

test("rejeita chave publishable no cliente privilegiado", () => {
  assert.throws(
    () =>
      readServerDatabaseConfig({
        SUPABASE_SECRET_KEY: "sb_publishable_example",
        SUPABASE_URL: "https://example.supabase.co",
      }),
    /formato esperado/,
  );
});
