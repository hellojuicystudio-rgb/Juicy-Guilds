# ADR-0001: Monorepo com deploy separado

- Estado: Aceita
- Data: 2026-08-09

## Contexto

Web e Bot precisam compartilhar contratos e ferramentas, mas possuem riscos, cargas e ciclos operacionais diferentes.

## Decisão

Usar um monorepo com `apps/web` e `apps/bot`, preservando processos e pipelines de implantação independentes.

## Consequências

- Tipos comuns ficam em pacotes compartilhados.
- Falha ou escala do Bot não obriga novo deploy da Web.
- Mudanças de contrato precisam de compatibilidade e validação entre consumidores.
