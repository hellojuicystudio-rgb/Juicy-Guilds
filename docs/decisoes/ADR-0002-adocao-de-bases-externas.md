# ADR-0002: Adoção auditada de bases externas

- Estado: Aceita
- Data: 2026-08-09

## Contexto

O projeto usará bases open source, mas precisa preservar autoria, licença e capacidade de atualização.

## Decisão

Toda base externa terá uma pasta em `dependencias/` com projeto, criador, repositório, licença, função, forma de integração e commit adotado. Código não será copiado antes dessa auditoria.

## Consequências

- Fica proibido copiar trechos sem atribuição.
- Modificações locais devem ser identificáveis.
- Quando possível, dependências entram por pacote ou adaptador, reduzindo forks.
