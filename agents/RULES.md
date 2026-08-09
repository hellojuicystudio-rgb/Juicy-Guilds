# Regras de colaboração

## Fonte de verdade

- Código e documentação versionados vencem histórico de chat.
- `docs/decisoes/` vence anotações informais.
- `packages/contracts` define o formato trocado entre aplicações.

## Fronteiras

- Web nunca acessa diretamente o token do Bot.
- Bot nunca importa componentes de interface.
- Studio Engine não depende do Discord, React ou framework web.
- Adaptações do Discord ficam em `apps/bot`.
- Adaptações do editor ficam em `apps/web`.

## Segurança

- Nunca registrar segredos reais.
- Nunca executar código arbitrário definido pelo usuário.
- Todo fluxo precisa de validação antes de persistência e antes de execução.
- Toda ação sensível futura deve ter autorização por guilda e trilha de auditoria.

## Dependências externas

- Não copiar, modificar ou redistribuir uma base externa sem registrar licença, commit e arquivos reaproveitados.
- Manter avisos de copyright e licença exigidos.
- Preferir integração por pacote ou adaptação isolada a um fork permanente.
