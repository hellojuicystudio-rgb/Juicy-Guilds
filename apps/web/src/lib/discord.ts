export interface DiscordGuild {
  icon: string | null;
  id: string;
  name: string;
  owner: boolean;
  permissions: string;
}

const ADMINISTRATOR = 1n << 3n;
const MANAGE_GUILD = 1n << 5n;

export async function listManagedDiscordGuilds(providerToken: string) {
  const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${providerToken}` },
  });

  if (!response.ok) {
    throw new Error(`Discord respondeu ${response.status}`);
  }

  const guilds = (await response.json()) as DiscordGuild[];
  return guilds.filter((guild) => {
    const permissions = BigInt(guild.permissions);
    return (
      guild.owner ||
      (permissions & ADMINISTRATOR) === ADMINISTRATOR ||
      (permissions & MANAGE_GUILD) === MANAGE_GUILD
    );
  });
}
