import type { ExecutionPlan } from "@juicy-guilds/studio-engine";

export interface DiscordExecutionContext {
  guildId: string;
  channelId?: string;
  actorId?: string;
}

export interface DiscordRuntime {
  execute(plan: ExecutionPlan, context: DiscordExecutionContext): Promise<void>;
}

// A implementação concreta com discord.js será criada após a prova de conceito.
export class PendingDiscordRuntime implements DiscordRuntime {
  async execute(): Promise<void> {
    throw new Error("Discord runtime ainda não implementado");
  }
}
