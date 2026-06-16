# Prompt — Inicializar memória AIOS em um projeto

Use este prompt em uma IA de CLI dentro do repositório onde deseja criar a memória operacional.

```txt
Você está trabalhando neste repositório local.

Sua missão é criar uma pasta `.ai/` seguindo o protocolo AIOS — Agent Intelligence Operating System.

A função dessa pasta é servir como memória operacional versionada do projeto, permitindo que qualquer agente de IA ou desenvolvedor humano consiga assumir o trabalho no futuro lendo apenas os arquivos da `.ai/`.

Antes de criar ou preencher qualquer arquivo, faça uma auditoria real do repositório.

Execute e analise:

- `git status`
- `git log --oneline -10`
- árvore de diretórios principal
- arquivos README e documentação existente
- arquivos de configuração
- scripts de build, teste, lint, dev e deploy
- workflows de CI/CD
- dependências principais
- estrutura de módulos, rotas, serviços, componentes, camadas ou pacotes
- integrações externas
- pontos sensíveis de segurança
- indícios de TODO, FIXME, hacks ou dívidas técnicas

Importante:

Não invente informação. Diferencie sempre:

- fato observado no repositório;
- inferência técnica razoável;
- dúvida que exige confirmação humana.

Use estes marcadores quando necessário:

- `[observado]`
- `[inferência]`
- `[exige confirmação]`
- `[risco]`
- `[decisão]`
- `[pendência]`

Crie exatamente esta estrutura:

```txt
.ai/
  README.md
  CONTEXT.md
  SESSION.md
  TODO.md
  DECISIONS.md
  HANDOFF.md
  LOG.md
  VALIDATION_CHECKLIST.md
  RELATORIOS/
    .gitkeep
```

Regras obrigatórias:

1. Escreva tudo em português brasileiro.
2. Use Markdown claro, técnico e navegável.
3. Use UTF-8 sem BOM.
4. Não registre segredos.
5. Não copie tokens, senhas, chaves de API, certificados, conteúdo de `.env`, credenciais, dados pessoais de usuários ou qualquer valor sensível.
6. Se encontrar possível segredo exposto, registre apenas o tipo de risco e o local aproximado, sem copiar o valor.
7. Não faça commit automaticamente.
8. Não altere código de produção.
9. Não refatore nada.
10. Apenas crie ou atualize a memória `.ai/`.
11. A memória deve refletir o estado real do projeto neste momento.
12. O repositório é a fonte da verdade.

Conteúdo esperado:

- `README.md`: protocolo operacional da pasta `.ai/`.
- `CONTEXT.md`: contexto estável, arquitetura, stack, comandos e mapa do projeto.
- `SESSION.md`: estado atual, branch, git status, tarefa em andamento e próximos passos.
- `TODO.md`: pendências priorizadas, bugs, dívidas técnicas, riscos e concluídos.
- `DECISIONS.md`: decisões técnicas e estratégicas com justificativa e impacto.
- `HANDOFF.md`: resumo executivo acionável para o próximo agente.
- `LOG.md`: histórico cronológico append-only.
- `VALIDATION_CHECKLIST.md`: comandos, fluxos críticos e critérios de validação.
- `RELATORIOS/.gitkeep`: placeholder para relatórios executivos futuros.

Ao final, apresente:

1. arquivos criados/atualizados;
2. principais fatos observados;
3. principais inferências feitas;
4. dúvidas que exigem confirmação humana;
5. riscos encontrados;
6. próximos passos recomendados.
```
