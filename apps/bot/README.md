# Bot

Runtime operacional conectado ao Discord.

## Responsabilidades

- conexão com Gateway e REST API;
- comandos, interações e eventos;
- carregamento de workflows publicados;
- execução de planos validados;
- rate limits, retry, idempotência, logs e métricas.

## Não pertence aqui

- páginas do dashboard;
- componentes React;
- edição do workflow;
- implementação duplicada dos contratos compartilhados.

## Execução

- `pnpm start:bot`: conecta todos os tokens `DISCORD_BOT_<n>_TOKEN` ao Gateway.
- `pnpm check:bot`: conecta os bots, valida o Supabase e encerra após o smoke test.
- O runtime concreto executa passos `message` já compilados pelo Studio Engine.
