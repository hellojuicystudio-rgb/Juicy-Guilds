# Contratos entre componentes

## Regra principal

Web e Bot não compartilham banco por conveniência nem importam implementação um do outro. Eles compartilham contratos serializáveis e versionados.

## WorkflowDocument

- `id`: identidade estável.
- `version`: versão do formato.
- `guildId`: escopo da guilda.
- `name`: nome exibido.
- `nodes`: nós registrados.
- `edges`: conexões direcionadas.
- `createdAt` e `updatedAt`: datas ISO 8601.

## Compatibilidade

- Alteração aditiva: mantém a versão quando consumidores antigos podem ignorar o campo.
- Alteração incompatível: incrementa `version` e exige migração explícita.
- Um nó desconhecido nunca é executado; a publicação falha com erro estruturado.
