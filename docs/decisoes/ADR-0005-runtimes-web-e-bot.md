# ADR-0005 — Runtimes Web e Bot

- **Estado:** aceito
- **Data:** 2026-08-09

## Contexto

A prova de conceito precisa autenticar administradores pelo Discord, consultar o
Supabase apenas no servidor e manter três bots conectados ao Discord Gateway.

## Decisão

- O Web usa Next.js `16.3.0`, App Router e React `19.2.8`.
- O login usa Supabase Auth com o provedor Discord e cookies gerenciados por
  `@supabase/ssr`.
- Segredos e o cliente privilegiado do banco permanecem em componentes de
  servidor; somente URL e chave publicável usam o prefixo `NEXT_PUBLIC_`.
- O Bot usa discord.js `14.27.0`, encapsulado pelo adaptador em `apps/bot`.
- Cada credencial de Bot cria um cliente Gateway independente, enquanto regras
  de fluxo continuam em `packages/studio-engine`.
- As versões ficam fixadas no manifesto e no `pnpm-lock.yaml`.

## Consequências

O Web e o Bot permanecem implantáveis separadamente e compartilham apenas
pacotes de domínio. Renovação do token OAuth do Discord, autorização persistida
por guilda, filas e execução publicada de workflows continuam etapas do MVP.
