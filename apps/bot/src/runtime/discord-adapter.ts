import type { ExecutionPlan } from "@juicy-guilds/studio-engine";
import type { Client } from "discord.js";

export interface DiscordExecutionContext {
  actorId?: string;
  channelId?: string;
  guildId: string;
}

export interface DiscordRuntime {
  execute(plan: ExecutionPlan, context: DiscordExecutionContext): Promise<void>;
}

export class DiscordJsRuntime implements DiscordRuntime {
  constructor(private readonly client: Client) {}

  async execute(plan: ExecutionPlan, context: DiscordExecutionContext) {
    if (!context.channelId) throw new Error("Canal obrigatório para execução");

    const channel = await this.client.channels.fetch(context.channelId);
    if (!channel?.isSendable()) throw new Error("Canal não permite mensagens");

    for (const step of plan.steps) {
      if (step.kind !== "message") continue;
      const content = step.config.content;
      if (typeof content !== "string" || content.trim().length === 0) {
        throw new Error(`Mensagem inválida no nó ${step.nodeId}`);
      }

      await channel.send({
        allowedMentions: { parse: [] },
        content,
      });
    }
  }
}
