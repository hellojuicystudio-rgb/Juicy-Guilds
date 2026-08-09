# Contexto do projeto

## Produto

**Juicy Guilds** permitirá que administradores de guildas criem automações para Discord por meio de um dashboard e de um editor visual modular.

## Arquitetura atual

- `apps/web`: experiência administrativa e Studio visual.
- `apps/bot`: conexão com Discord e execução operacional.
- `packages/studio-engine`: representação, validação e compilação de workflows.
- `packages/contracts`: fronteira serializável compartilhada.
- Deploy de Web e Bot é independente.

## Primeira linguagem do domínio

O workflow começa com oito tipos de nó:

1. Mensagem
2. Embed
3. Container
4. Botão
5. Select Menu
6. Modal
7. Condição
8. Ação

## Base visual

- Fundo: Charcoal Black `#0C0E0B`.
- Superfícies: Jet Black `#1A1A1A` e Onyx `#222526`.
- Destaque: Blue Slate `#536877`.
- Linguagem minimalista, monocromática, cantos arredondados e hierarquia inspirada em produtos Apple.

## Estado desta fundação

A arquitetura e os contratos iniciais existem. Ainda faltam a escolha final de infraestrutura, banco de dados, autenticação, estratégia de filas e importação auditada das bases externas.
