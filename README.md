# AIOS - Agent Intelligence Operating System

AIOS é um protocolo agnóstico de memória operacional para projetos assistidos por agentes de IA.

A ideia central é simples: todo projeto deveria ter uma memória versionada, legível por humanos e agentes, capaz de preservar contexto, decisões, pendências, riscos, validações e handoffs entre sessões.

O AIOS não é apenas uma pasta. A pasta `.ai/` é a implementação padrão do protocolo.

## Instalação

Use diretamente com npx (sem instalação):

```bash
npx @alvaro-alencar/aios install all
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
npx @alvaro-alencar/aios install all
```

Isso cria a memória `.ai/` e os arquivos de instrução para as principais ferramentas de IA.

Depois abra Codex, Claude Code, Cursor ou Copilot no projeto. O agente encontrará as instruções e executará o protocolo AIOS.

Em ferramentas com suporte nativo ao comando, basta digitar:

```txt
/aios
```

Por segurança, `/aios` entra em **OBSERVE** por padrão: o agente lê, audita, compara e resume, mas não altera código, não commita e não faz push.

Sem suporte nativo, use:

```bash
npx @alvaro-alencar/aios handshake
```

## Modos operacionais

AIOS separa observação, planejamento e execução para evitar que agentes virem workaholics sem autorização humana.

```bash
aios observe
```

Modo seguro padrão. O agente deve ler a memória, comparar com o repositório, identificar riscos e sugerir próximos passos. Não deve alterar código de produção, commitar ou fazer push.

```bash
aios plan
```

Modo de planejamento. O agente deve transformar a observação em plano priorizado, sem executar.

```bash
aios act "tarefa autorizada"
```

Modo de ação. O agente só deve executar a tarefa explicitamente autorizada. Mesmo em ACT, commit e push exigem autorização separada.

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
aios install all # cria .ai/ e instruções para agentes (Codex, Claude, Cursor, Copilot)
aios observe     # modo seguro: audita e orienta sem alterar código
aios plan        # cria plano priorizado sem executar
aios act "..."   # executa apenas tarefa autorizada
aios handshake   # imprime o handshake universal /aios em modo observe
aios open        # alias de handshake
aios prompt      # imprime o prompt completo para preencher a memória
aios audit       # verifica estrutura AIOS, marcadores pendentes e estado Git
aios status      # mostra resumo operacional
aios handoff     # imprime .ai/HANDOFF.md
aios close       # encerra sessão e atualiza SESSION, HANDOFF e LOG
```

Exemplo de encerramento:

```bash
aios close --summary "Sessão concluída" --next "Rodar testes e abrir PR"
```

## Arquivos gerados por `install all`

```txt
.ai/
.ai/AIOS_AGENT_PROMPT.md
AGENTS.md                          ← Codex (OpenAI)
CLAUDE.md                          ← Claude Code (Anthropic)
.cursor/rules/aios.mdc             ← Cursor
.github/copilot-instructions.md    ← GitHub Copilot
```

## O problema

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

- [x] Publicação npm `@alvaro-alencar/aios@0.1.0`
- [x] Especificação inicial do protocolo
- [x] Especificação AIOS Handshake v1
- [x] Template padrão `.ai/`
- [x] Prompt de inicialização manual
- [x] CLI `aios init`
- [x] CLI `aios bootstrap`
- [x] CLI `aios install all` (Codex, Claude, Cursor, Copilot)
- [x] CLI `aios observe`
- [x] CLI `aios plan`
- [x] CLI `aios act`
- [x] CLI `aios handshake` / `aios open`
- [x] CLI `aios audit`
- [x] CLI `aios status`
- [x] CLI `aios handoff`
- [x] CLI `aios close`
- [x] Testes iniciais do CLI
- [ ] Validador semântico de consistência da memória
- [ ] Exemplos reais por tipo de projeto

## Status

AIOS está publicado no npm como `@alvaro-alencar/aios`.

A versão atual no repositório adiciona modos operacionais para controlar o comportamento do agente: OBSERVE, PLAN e ACT. Publique uma nova versão npm para distribuir globalmente.
