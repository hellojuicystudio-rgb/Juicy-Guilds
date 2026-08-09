# Central de agentes

Esta pasta elimina a dependência do histórico de conversa. Qualquer humano, IDE, CLI ou agente deve conseguir descobrir o estado atual do projeto somente por estes arquivos e pela documentação versionada.

| Arquivo | Uso |
| --- | --- |
| `CONTEXT.md` | Visão curta do produto e da arquitetura atual |
| `RULES.md` | Regras que não podem ser quebradas |
| `TASKS.md` | Fila de trabalho e critérios de aceite |
| `OWNERSHIP.md` | Reserva temporária de áreas em trabalho |
| `DECISIONS.md` | Índice rápido das decisões relevantes |
| `HANDOFF.md` | Estado deixado pelo último colaborador |
| `templates/` | Modelos para tarefa, ADR e handoff |

Não crie um segundo sistema de acompanhamento fora desta pasta sem registrar a integração aqui.
