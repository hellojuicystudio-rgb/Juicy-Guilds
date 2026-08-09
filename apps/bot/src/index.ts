import {
  checkDatabaseConnection,
  createServerDatabaseClient,
} from "@juicy-guilds/db";
import { Client, Events, GatewayIntentBits } from "discord.js";

import { readBotCredentials } from "./config.js";

const credentials = readBotCredentials(process.env);
const database = createServerDatabaseClient(process.env);
const health = await checkDatabaseConnection(database);

console.log(`Supabase conectado: ${health.count} projeto(s).`);

const clients = credentials.map(({ label, token }) => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  const ready = new Promise<void>((resolve) => {
    client.once(Events.ClientReady, (readyClient) => {
      console.log(`${label} conectado: ${readyClient.guilds.cache.size} guilda(s).`);
      resolve();
    });
  });
  return { client, label, ready, token };
});

await Promise.all(clients.map(({ client, token }) => client.login(token)));
await Promise.all(clients.map(({ ready }) => ready));

if (process.env.BOT_SMOKE_TEST === "true") {
  for (const { client } of clients) client.destroy();
  console.log(`Smoke test concluído: ${clients.length} bot(s).`);
}

function shutdown() {
  for (const { client } of clients) client.destroy();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
