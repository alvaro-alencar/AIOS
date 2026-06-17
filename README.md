# AIOS - Agent Intelligence Operating System

AIOS é um protocolo agnóstico de memória operacional para projetos assistidos por agentes de IA.

A ideia central é simples: todo projeto deveria ter uma memória versionada, legível por humanos e agentes, capaz de preservar contexto, decisões, pendências, riscos, validações e handoffs entre sessões.

O AIOS não é apenas uma pasta. A pasta `.ai/` é a implementação padrão do protocolo.

## O problema que o AIOS resolve

Você abre uma IA no projeto. Ela não sabe o que aconteceu antes.

Você explica o contexto. Ela entende metade.

Você troca de IA. Começa tudo de novo.

A IA mexe onde não devia, esquece uma decisão antiga, sugere refatoração fora de hora ou tenta fazer commit sem autorização.

O AIOS cria uma memória operacional dentro do repositório para que qualquer agente consiga entrar, observar o estado real do projeto, planejar com segurança e executar apenas o que foi autorizado.

Em linguagem simples:

```txt
Git guarda o código.
AIOS guarda o contexto operacional.
```

## O que você verá funcionando em 5 minutos

Depois de instalar o AIOS em um projeto, você pode abrir uma IA de código e pedir:

```txt
aios observe
```

A IA deve:

- ler a memória `.ai/`;
- rodar `git status` e `git log`;
- comparar memória e repositório real;
- apontar riscos e pendências;
- sugerir próximos comandos;
- não alterar código;
- não commitar;
- não fazer push.

Depois você pode pedir:

```txt
aios plan
```

A IA deve gerar um plano em milestones verificáveis, cada uma com objetivo, critério de sucesso, validações, riscos, rollback e próximo passo.

Quando quiser autorizar uma ação específica:

```txt
aios act "corrigir o menor problema detectado no plano"
```

A IA deve executar apenas esse escopo.

## Primeiros 10 minutos

Este é o caminho mais rápido para sentir o "uau".

### 1. Entre em qualquer projeto com Git

```bash
cd meu-projeto
```

Confirme que o repositório está saudável:

```bash
git status
```

Se houver mudanças pendentes, tudo bem. O AIOS pode ajudar a observar, mas não instale às cegas em um repositório com trabalho importante sem antes entender o estado atual.

### 2. Instale o AIOS no projeto

```bash
npx @alvaro-alencar/aios@latest install all
```

Isso cria ou completa a memória `.ai/` e instala instruções para agentes:

```txt
.ai/
.ai/AIOS_AGENT_PROMPT.md
AGENTS.md
CLAUDE.md
.cursor/rules/aios.mdc
.github/copilot-instructions.md
```

O comando preserva arquivos existentes quando possível. Use `--force` apenas quando quiser regenerar instruções conscientemente.

### 3. Audite a instalação

```bash
npx @alvaro-alencar/aios@latest audit
```

Você verá se a estrutura `.ai/` está compatível e quais marcadores ainda precisam de preenchimento.

### 4. Abra sua IA de código no projeto

Pode ser Claude Code, Codex, Cursor, Copilot Chat, Gemini CLI ou outra ferramenta que leia arquivos do repositório.

Envie apenas:

```txt
aios observe
```

Não explique o projeto. Esse é o teste.

Se tudo estiver funcionando, o agente deve descobrir o estado do projeto sozinho lendo o repositório e a memória `.ai/`.

### 5. Peça um plano

```txt
aios plan
```

O agente deve responder com milestones verificáveis.

Um bom plano deve parecer com isto:

```txt
Milestone 1: Sincronizar memória operacional
Objetivo: atualizar .ai/ com o HEAD atual.
Critério de sucesso: git status limpo e .ai/ consistente com git log.
Validações: git status, git log --oneline -10, aios audit.
Riscos: registrar informação não verificada.
Rollback: git restore .ai/.
Próximo passo: validar ambiente real.
```

### 6. Autorize uma ação pequena

```txt
aios act "executar o primeiro milestone do plano"
```

O agente deve agir com escopo limitado, validar o que fez e parar antes de commit ou push.

### 7. Feche a sessão

Quando terminar uma sessão relevante:

```bash
npx @alvaro-alencar/aios@latest close --summary "o que foi feito" --next "próximo passo"
```

Isso atualiza `SESSION.md`, `HANDOFF.md` e `LOG.md`.

## Instalação

Use diretamente com npx, sem instalação global:

```bash
npx @alvaro-alencar/aios@latest install all
```

Ou instale globalmente:

```bash
npm install -g @alvaro-alencar/aios
aios install all
```

## Fluxo recomendado

Para deixar um projeto pronto para agentes de IA:

```bash
cd meu-projeto
npx @alvaro-alencar/aios@latest install all
npx @alvaro-alencar/aios@latest audit
```

Depois abra Codex, Claude Code, Cursor, Gemini CLI ou Copilot no projeto. O agente encontrará as instruções e executará o protocolo AIOS.

Em ferramentas com suporte nativo ao comando, você pode digitar:

```txt
aios observe
```

ou, se a ferramenta tiver slash command configurado:

```txt
/aios
```

Por segurança, o fluxo AIOS entra em **OBSERVE** por padrão: o agente lê, audita, compara e resume, mas não altera código, não commita e não faz push.

Sem suporte nativo, use o handshake:

```bash
npx @alvaro-alencar/aios@latest handshake
```

Copie a saída para o agente.

## Modos operacionais

AIOS separa observação, planejamento e execução para evitar que agentes virem workaholics sem autorização humana.

### OBSERVE

```bash
aios observe
```

Modo seguro padrão. O agente deve ler a memória, comparar com o repositório, identificar riscos e sugerir próximos passos.

Ele não deve alterar código de produção, commitar ou fazer push.

### PLAN

```bash
aios plan
```

Modo de planejamento. O agente deve transformar a observação em plano priorizado, sem executar.

O plano deve ser organizado em milestones verificáveis, cada uma com:

1. objetivo;
2. critério de sucesso;
3. validações ou comandos sugeridos;
4. riscos;
5. rollback ou caminho de reversão;
6. próximo passo recomendado.

### ACT

```bash
aios act "tarefa autorizada"
```

Modo de ação. O agente só deve executar a tarefa explicitamente autorizada.

Mesmo em ACT, commit e push exigem autorização separada.

### CLOSE

```bash
aios close --summary "sessão concluída" --next "próximo passo"
```

Fecha a sessão e atualiza a memória operacional.

## Rodapé operacional

As instruções geradas pelo AIOS orientam o agente a terminar respostas operacionais sugerindo próximos comandos AIOS. O usuário não precisa decorar a CLI.

Exemplo:

```txt
Próximos comandos AIOS sugeridos:
- aios observe
- aios plan
- aios act "corrigir primeiro item do plano"
- aios close --summary "resumo" --next "próximo passo"
```

## Uso rápido

```bash
aios init        # cria .ai/ no projeto atual
aios bootstrap   # cria .ai/ e .ai/AIOS_AGENT_PROMPT.md
aios install all # cria .ai/ e instruções para agentes
aios observe     # modo seguro: audita e orienta sem alterar código
aios plan        # cria plano em milestones verificáveis, sem executar
aios act "..."   # executa apenas tarefa autorizada
aios handshake   # imprime o handshake universal em modo observe
aios open        # alias de handshake
aios prompt      # imprime o prompt completo para preencher a memória
aios audit       # verifica estrutura AIOS, marcadores pendentes e estado Git
aios doctor      # diagnóstico de saúde operacional da memória AIOS
aios status      # mostra resumo operacional
aios handoff     # imprime .ai/HANDOFF.md
aios close       # encerra sessão e atualiza SESSION, HANDOFF e LOG
```

## Arquivos gerados por `install all`

```txt
.ai/
.ai/AIOS_AGENT_PROMPT.md
AGENTS.md                          ← agentes compatíveis com instruções AGENTS.md
CLAUDE.md                          ← Claude Code
.cursor/rules/aios.mdc             ← Cursor
.github/copilot-instructions.md    ← GitHub Copilot
```

## Exemplo de conversa com uma IA

Você:

```txt
aios observe
```

IA:

```txt
[observado] Memória .ai/ encontrada.
[observado] Branch main sincronizada com origin/main.
[risco] SESSION.md não registra os dois últimos commits.
[pendencia] Atualizar memória operacional antes de nova feature.

Próximos comandos AIOS sugeridos:
- aios plan
- aios act "sincronizar memória AIOS com HEAD atual"
```

Você:

```txt
aios plan
```

IA:

```txt
Milestone 1: Sincronizar memória
Objetivo: alinhar .ai/ com o estado real do Git.
Critério de sucesso: SESSION e HANDOFF refletem o HEAD atual.
Validações: git status, git log --oneline -10, aios audit.
Riscos: registrar inferências como fatos.
Rollback: git restore .ai/.
Próximo passo: validar testes do projeto.
```

Você:

```txt
aios act "executar milestone 1"
```

IA:

```txt
[observado] Alterei apenas .ai/SESSION.md, .ai/HANDOFF.md e .ai/LOG.md.
[observado] Nenhum código de produção foi alterado.
[observado] Não fiz commit nem push.
```

## Para quais ferramentas funciona?

AIOS é agnóstico. Ele funciona melhor com agentes que conseguem ler arquivos e rodar comandos no repositório.

Testado em fluxo real com:

- Claude Code;
- OpenAI Codex CLI;
- Gemini CLI;
- Cursor;
- GitHub Copilot instructions.

A regra é simples: se a ferramenta consegue ler o repositório, ela consegue seguir o protocolo.

## Quando usar

Use AIOS quando:

- você trabalha com mais de uma IA no mesmo projeto;
- você alterna entre sessões e perde contexto;
- você precisa que agentes respeitem limites antes de agir;
- você quer handoff claro entre humano e IA;
- você quer registrar decisões, riscos, pendências e validações no próprio repositório.

Evite usar como substituto de Git, testes, issues ou documentação real. AIOS complementa essas camadas.

## O problema, em termos técnicos

Projetos modernos são trabalhados por humanos, assistentes de código, agentes de CLI, copilotos, modelos locais e ferramentas diferentes. Cada agente entra no projeto com pouco contexto e pode repetir análise, desfazer decisões antigas, ignorar riscos ou quebrar fluxos críticos.

Código mostra o que existe. Commits mostram o que mudou. Issues mostram parte do plano. Mas falta uma camada persistente para responder o que o projeto é, como funciona, qual é o estado atual, quais decisões importam e como validar mudanças com segurança.

AIOS é essa camada.

## Princípios

1. O repositório é a fonte da verdade.
2. A memória deve refletir o estado real do projeto.
3. Fatos, inferências e dúvidas devem ser separados.
4. Segredos nunca devem ser copiados para a memória.
5. O próximo agente deve conseguir continuar o trabalho sem perguntar onde está.
6. A memória deve ser útil antes de ser bonita.
7. O protocolo deve ser agnóstico de stack, linguagem, framework e ferramenta de IA.
8. Observar vem antes de planejar; planejar vem antes de agir.
9. Execução exige autorização explícita.

## Roadmap

### Entregues

- [x] Publicação npm `@alvaro-alencar/aios`
- [x] Especificação inicial do protocolo
- [x] Especificação AIOS Handshake v1
- [x] Template padrão `.ai/`
- [x] Prompt de inicialização manual
- [x] CLI `aios init`
- [x] CLI `aios bootstrap`
- [x] CLI `aios install all` (Codex, Claude, Cursor, Copilot)
- [x] CLI `aios observe`
- [x] CLI `aios plan` com milestones verificáveis
- [x] CLI `aios act`
- [x] CLI `aios handshake` / `aios open`
- [x] CLI `aios audit`
- [x] CLI `aios status`
- [x] CLI `aios handoff`
- [x] CLI `aios close`
- [x] Testes automatizados do CLI
- [x] CLI `aios doctor` — diagnóstico com Structural Score, Git Score e Memory Score
- [x] Semantic Memory Validator v1 — CONTEXT, DECISIONS, LOG, CHECKLIST e consistência cruzada

### Pendentes

- [ ] Estudos de caso reais por tipo de projeto — ver [`examples/README.md`](examples/README.md) (ga-core, marketplace Dr. Saulo, tutoria)

### Divulgação (opcional, sem prazo)

- [ ] Tutorial em vídeo ou GIF curto

## Status

AIOS está publicado no npm como `@alvaro-alencar/aios`.

A versão atual é `0.1.3`, com todos os modos operacionais (OBSERVE, PLAN, ACT, CLOSE), `aios doctor` com Semantic Memory Validator, e cobertura de testes automatizados.
