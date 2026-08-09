export type DatabaseEnvironment = Readonly<
  Record<string, string | undefined>
>;

export interface ServerDatabaseConfig {
  secretKey: string;
  url: string;
}

export function readServerDatabaseConfig(
  environment: DatabaseEnvironment,
): ServerDatabaseConfig {
  const url = environment.SUPABASE_URL?.trim();
  const secretKey = environment.SUPABASE_SECRET_KEY?.trim();

  if (!url) throw new Error("SUPABASE_URL não configurada");
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY não configurada");

  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== "https:") {
    throw new Error("SUPABASE_URL precisa usar HTTPS");
  }

  if (!secretKey.startsWith("sb_secret_")) {
    throw new Error("SUPABASE_SECRET_KEY não possui o formato esperado");
  }

  return { secretKey, url: parsedUrl.origin };
}
