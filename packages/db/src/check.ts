import {
  checkDatabaseConnection,
  createServerDatabaseClient,
} from "./index.ts";

const client = createServerDatabaseClient(process.env);
const health = await checkDatabaseConnection(client);

console.log(`Supabase conectado: ${health.count} projeto(s) acessível(is).`);
