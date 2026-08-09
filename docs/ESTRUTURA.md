# Estrutura do repositório

```text
juicy-guilds/
├── agents/                 contexto, regras, tarefas e handoffs
├── apps/
│   ├── bot/                runtime e adaptadores do Discord
│   └── web/                dashboard e adaptadores do Studio
├── dependencias/           autoria, origem, licença e plano de adoção
├── docs/
│   ├── arquitetura/        fronteiras e contratos
│   ├── decisoes/           ADRs
│   ├── produto/            escopo funcional
│   ├── roadmap/            checklist por estágio
│   ├── runbooks/           procedimentos operacionais
│   └── seguranca/          regras de segurança
├── infra/                  deploys separados e recursos compartilhados
├── packages/
│   ├── contracts/          documentos serializáveis
│   ├── db/                 cliente server-side tipado para Supabase
│   ├── design-tokens/      identidade visual compartilhada
│   └── studio-engine/      registro, validação e compilação de workflows
└── tools/                  validações do repositório
```

## Regra de localização

| Se a mudança... | Então pertence a... |
| --- | --- |
| Só existe na interface administrativa | `apps/web` |
| Só existe na integração com Discord | `apps/bot` |
| É trocada entre processos | `packages/contracts` |
| Acessa o banco em processos server-side | `packages/db` |
| Define o significado de um workflow | `packages/studio-engine` |
| Define aparência reutilizável | `packages/design-tokens` |
| Muda uma escolha arquitetural | `docs/decisoes` |
| Introduz código ou ideia externa | `dependencias` e `FONTES_OPEN_SOURCE.md` |
| Orienta colaboradores e agentes | `agents` |
