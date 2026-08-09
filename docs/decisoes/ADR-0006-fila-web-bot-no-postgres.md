# ADR-0006 — Fila Web → Bot no Postgres

- **Estado:** aceita
- **Data:** 2026-08-09

## Contexto

Web e Bot têm deploys independentes. O Web não pode acessar tokens de Bot, e a
execução precisa ser durável, autorizada por guilda e auditável.

## Decisão

- O Web publica uma definição validada em `projects` e cria um item em
  `workflow_jobs`.
- O Bot usa a chave server-side para reivindicar jobs `pending`, valida e compila
  novamente a definição e executa pelo adaptador discord.js.
- A transição condicional de estado impede que o mesmo job seja reivindicado
  duas vezes no fluxo normal.
- Cada resultado gera uma linha imutável em `execution_logs`.
- Usuários autenticados só leem seus próprios jobs e logs; o Bot é o único ator
  que altera estados de execução.

## Consequências

A prova de conceito não requer um serviço de filas separado. Antes de escala
horizontal, o claim deve evoluir para uma função transacional com `FOR UPDATE
SKIP LOCKED` ou para Supabase Queues/PGMQ, além de retry, timeout e idempotência.
