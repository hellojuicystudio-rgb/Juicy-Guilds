# Juicy Guilds

Plataforma modular para criar, configurar e executar automações para guildas do Discord.

Este repositório começa como um monorepo, mas mantém **Web** e **Bot** desacoplados para que possam ser desenvolvidos, implantados e escalados separadamente. O contrato entre os dois lados vive em pacotes compartilhados e o fluxo visual é tratado pelo **Studio Engine**.

## Mapa rápido

| Caminho | Responsabilidade |
| --- | --- |
| `apps/web` | Dashboard, autenticação, editor visual e administração |
| `apps/bot` | Gateway do Discord, comandos, eventos e execução dos fluxos |
| `packages/studio-engine` | Modelo, validação e compilação dos fluxos visuais |
| `packages/contracts` | Contratos compartilhados entre Web, Bot e serviços futuros |
| `packages/design-tokens` | Cores, tipografia, espaçamento e identidade visual |
| `agents` | Contexto, regras, tarefas e handoffs para IDEs, CLIs e agentes |
| `dependencias` | Registro e plano de adoção das bases open source |
| `docs` | Arquitetura, produto, decisões, segurança, roadmap e runbooks |
| `infra` | Contratos de implantação independente de Web e Bot |
| `tools` | Validações e automações internas do repositório |

## Decisões já consolidadas

- Stack-base: **Next Generation + Workflow Builder + discord.js**.
- Web e Bot terão ciclos de deploy separados.
- O Studio Engine é um pacote de domínio, não um componente preso à interface.
- Os primeiros tipos de nó são: Mensagem, Embed, Container, Botão, Select Menu, Modal, Condição e Ação.
- Código externo só entra depois de licença, versão e origem serem registradas.
- Todo agente começa pelo mesmo conjunto de documentos e deixa um handoff verificável.

## Começando

1. Leia [`AGENTS.md`](AGENTS.md), mesmo quando o trabalho for manual.
2. Leia [`docs/produto/ESCOPO.md`](docs/produto/ESCOPO.md) e [`docs/arquitetura/VISAO_GERAL.md`](docs/arquitetura/VISAO_GERAL.md).
3. Escolha uma tarefa em [`agents/TASKS.md`](agents/TASKS.md).
4. Registre decisões estruturais em `docs/decisoes/`.
5. Antes do handoff, execute `pnpm validate:structure` ou `node tools/validate-structure.mjs`.

> Esta entrega é a fundação arquitetural. Dependências ainda não foram instaladas e nenhuma base externa foi copiada para dentro do núcleo.
