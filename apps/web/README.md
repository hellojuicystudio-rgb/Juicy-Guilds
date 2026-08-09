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
