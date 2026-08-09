# ADR-0003: Studio Engine independente

- Estado: Aceita
- Data: 2026-08-09

## Contexto

O editor visual e o executor do Bot precisam compreender o mesmo workflow sem acoplamento a React ou discord.js.

## Decisão

Manter modelo, registro, validação e compilação em `packages/studio-engine`, usando apenas contratos serializáveis.

## Consequências

- Web adapta definições para o editor.
- Bot adapta planos para ações do Discord.
- Testes do domínio podem rodar sem navegador ou conexão com Discord.
