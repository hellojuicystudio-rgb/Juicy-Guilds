# Web

Dashboard administrativo e Studio visual.

## Responsabilidades

- autenticação e seleção de guilda;
- autoria e preview de workflows;
- versionamento e publicação;
- administração, logs e auditoria;
- adaptação das definições do Studio Engine para o editor visual.

## Não pertence aqui

- token do Bot;
- conexão direta com Discord Gateway;
- semântica central de validação e execução do grafo.

## Execução

- `pnpm dev:web`: inicia o dashboard Next.js usando o `.env` da raiz.
- Login Discord usa Supabase Auth com PKCE e cookies server-side.
- `/dashboard` valida o usuário, lista guildas administradas e consulta o banco.
- O callback sincroniza guildas administráveis; a seleção fica persistida por usuário.
- O formulário inicial publica um workflow `message` e o coloca na fila do Bot.
- O canal é escolhido em um dropdown com apenas canais sincronizados em que ao
  menos um Bot possui permissão de visualização e envio.
- `/studio` oferece paleta dos oito nós, canvas React Flow, conexões, painel de
  propriedades e ações de salvar/carregar/publicar.
- Todos os nós podem ser persistidos como rascunho; a publicação operacional
  permanece limitada a `Mensagem` até os demais adaptadores Discord existirem.
