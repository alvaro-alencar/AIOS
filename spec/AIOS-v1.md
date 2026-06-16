# AIOS v1 - Especificação do Protocolo

## Nome

AIOS - Agent Intelligence Operating System.

## Definição

AIOS é um protocolo de memória operacional versionada para projetos trabalhados por humanos e agentes de IA.

A implementação padrão do AIOS é uma pasta `.ai/` dentro do repositório do projeto.

## Objetivo

Permitir continuidade operacional entre sessões, agentes, ferramentas e desenvolvedores, preservando contexto técnico, decisões, pendências, riscos e critérios de validação.

## Escopo

AIOS cobre:

- contexto do projeto;
- estado atual;
- decisões técnicas e estratégicas;
- pendências;
- handoff entre agentes;
- histórico cronológico;
- checklist de validação;
- relatórios executivos futuros.

AIOS não substitui:

- Git;
- README do produto;
- documentação oficial de API;
- issue tracker;
- gestão de projeto;
- CI/CD;
- mecanismos seguros de segredo.

## Vocabulário normativo

- **Deve**: requisito obrigatório.
- **Pode**: comportamento opcional.
- **Não deve**: comportamento proibido.
- **Agente**: humano, IA de chat, IA de CLI, assistente de código ou processo automatizado que interage com o projeto.
- **Memória operacional**: conjunto de arquivos persistentes que descrevem o estado, contexto e continuidade do projeto.

## Estrutura obrigatória

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

## Marcadores semânticos

Agentes devem usar marcadores para separar natureza da informação:

- `[observado]`: fato confirmado no repositório.
- `[inferencia]`: conclusão razoável, mas não comprovada diretamente.
- `[exige confirmacao]`: ponto que precisa de humano ou fonte externa.
- `[risco]`: risco técnico, operacional, jurídico, de segurança ou produto.
- `[decisao]`: decisão relevante registrada.
- `[pendencia]`: ação ainda não concluída.

## Protocolo de abertura de sessão

Todo agente deve, antes de modificar o projeto:

1. Ler `.ai/HANDOFF.md`.
2. Ler `.ai/SESSION.md`.
3. Ler `.ai/CONTEXT.md`.
4. Ler `.ai/TODO.md`.
5. Ler `.ai/DECISIONS.md`.
6. Verificar o estado real do repositório com `git status`.
7. Verificar histórico recente com `git log --oneline -10`.
8. Comparar memória e repositório.
9. Corrigir ou sinalizar divergências.
10. Só então iniciar alterações.

## Protocolo durante sessão

Durante o trabalho, o agente deve:

- manter coerência com `CONTEXT.md`;
- evitar mudanças desnecessárias;
- registrar decisões relevantes em `DECISIONS.md`;
- atualizar pendências em `TODO.md`;
- documentar riscos;
- não copiar segredos;
- não assumir documentação antiga como verdade se o código contradizê-la;
- separar fato, inferência e dúvida.

## Modo PLAN

Quando operar em PLAN, o agente deve planejar sem executar mudanças de código, commits ou push.

O plano deve ser priorizado e organizado em milestones verificáveis. Cada milestone deve conter, no mínimo:

1. Objetivo.
2. Critério de sucesso.
3. Validações/comandos sugeridos.
4. Riscos.
5. Rollback ou caminho de reversão.
6. Próximo passo recomendado.

O objetivo é tornar o plano executável em ACT por partes pequenas, reversíveis e validáveis.

## Protocolo de encerramento de sessão

Ao finalizar trabalho relevante, o agente deve atualizar, nesta ordem:

1. `.ai/SESSION.md`
2. `.ai/TODO.md`
3. `.ai/DECISIONS.md`, se houver decisões novas
4. `.ai/VALIDATION_CHECKLIST.md`, se houver mudança de validação
5. `.ai/HANDOFF.md`
6. `.ai/LOG.md`

## Segurança

A memória AIOS não deve conter:

- tokens;
- senhas;
- chaves de API;
- certificados;
- conteúdo de `.env`;
- credenciais;
- dados pessoais sensíveis;
- segredos de deploy;
- strings de conexão privadas.

Se um segredo for encontrado no repositório, o agente deve registrar apenas:

- tipo de risco;
- local aproximado;
- recomendação de rotação/revogação;
- sem copiar o valor.

## Fonte da verdade

O repositório é a fonte primária da verdade técnica.

Se houver conflito entre:

1. código atual;
2. documentação do projeto;
3. memória AIOS;
4. conversa anterior;

prevalece o código atual, salvo confirmação humana em contrário.

## Critério de conformidade v1

Um projeto é compatível com AIOS v1 se:

- possui a estrutura obrigatória;
- contém protocolo de abertura e encerramento;
- registra contexto estável;
- registra estado atual;
- registra decisões;
- registra pendências;
- possui handoff acionável;
- possui log cronológico;
- possui checklist de validação;
- não armazena segredos.
