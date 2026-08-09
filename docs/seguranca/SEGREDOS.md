# Segredos e dados sensíveis

- Tokens do Discord nunca pertencem ao cliente Web.
- `.env.example` contém somente nomes e valores fictícios.
- Produção deve usar um gerenciador de segredos.
- Logs não podem armazenar tokens, cookies de sessão ou payloads privados completos.
- IDs de guilda e usuário devem ser tratados como dados vinculáveis a pessoas.
- O Bot deve operar com o menor conjunto de intents e permissões possível.
