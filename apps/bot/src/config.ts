export interface BotCredential {
  label: string;
  token: string;
}

export function readBotCredentials(
  environment: Readonly<Record<string, string | undefined>>,
) {
  const credentials: BotCredential[] = [];

  for (let bot = 1; bot <= 3; bot += 1) {
    const token = environment[`DISCORD_BOT_${bot}_TOKEN`]?.trim();
    if (token) credentials.push({ label: `Bot ${bot}`, token });
  }

  const primary = environment.DISCORD_BOT_TOKEN?.trim();
  if (credentials.length === 0 && primary) {
    credentials.push({ label: "Bot principal", token: primary });
  }

  if (credentials.length === 0) throw new Error("Nenhum token Discord configurado");
  return credentials;
}
