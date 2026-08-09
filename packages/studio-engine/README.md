# Studio Engine

Núcleo independente para registrar tipos de nó, validar workflows e gerar planos de execução.

## Biblioteca atual

- oito tipos de nó com configuração tipada, defaults e campos editáveis;
- schema de documento versionado;
- parser e serializador sem dependência de UI;
- validação de configuração, IDs, arestas e ciclos;
- compilação em ordem topológica para o runtime.

## Regra de dependência

Este pacote pode depender de `@juicy-guilds/contracts`, mas não de React, Next.js, discord.js ou persistência.
