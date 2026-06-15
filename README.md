# AIOS — Agent Intelligence Operating System

AIOS é um protocolo agnóstico de memória operacional para projetos assistidos por agentes de IA.

A ideia central é simples: todo projeto deveria ter uma memória versionada, legível por humanos e agentes, capaz de preservar contexto, decisões, pendências, riscos, validações e handoffs entre sessões.

O AIOS não é apenas uma pasta. A pasta `.ai/` é a implementação padrão do protocolo.

## O problema

Projetos modernos estão sendo trabalhados por humanos, assistentes de código, agentes de CLI, copilotos, modelos locais e ferramentas diferentes. Cada agente entra no projeto com pouco contexto e pode repetir análise, desfazer decisões antigas, ignorar riscos ou quebrar fluxos críticos.

Código mostra o que existe. Commits mostram o que mudou. Issues mostram parte do plano. Mas falta uma camada persistente para responder:

- o que este projeto é;
- por que ele existe;
- como ele funciona;
- quais decisões não devem ser revertidas sem cuidado;
- qual é o estado atual;
- o que precisa acontecer em seguida;
- como validar mudanças com segurança.

AIOS é essa camada.

## Instalação local

Clone o repositório e exponha o comando globalmente:

```bash
git clone https://github.com/alvaro-alencar/AIOS.git
cd AIOS
npm link
```

Depois, em qualquer projeto:

```bash
aios init
```

## Uso rápido

```bash
aios init       # cria .ai/ no projeto atual
aios audit      # verifica estrutura AIOS e estado Git
aios status     # mostra resumo operacional
aios handoff    # imprime .ai/HANDOFF.md
```

Depois de rodar `aios init`, peça ao agente de IA no CLI:

```txt
Leia todo o repositório, audite a estrutura real do projeto e preencha a pasta `.ai/` seguindo o protocolo AIOS. Não altere código de produção. Não registre segredos. Separe fatos observados, inferências e dúvidas.
```

O prompt completo está em `prompts/init-project-memory.md`.

## A implementação padrão

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

## Princípios

1. O repositório é a fonte da verdade.
2. A memória deve refletir o estado real do projeto.
3. Fatos, inferências e dúvidas devem ser separados.
4. Segredos nunca devem ser copiados para a memória.
5. O próximo agente deve conseguir continuar o trabalho sem perguntar "onde estou?".
6. A memória deve ser útil antes de ser bonita.
7. O protocolo deve ser agnóstico de stack, linguagem, framework e ferramenta de IA.

## Roadmap

- [x] Especificação inicial do protocolo
- [x] Template padrão `.ai/`
- [x] Prompt de inicialização manual
- [x] CLI `aios init`
- [x] CLI `aios audit`
- [x] CLI `aios status`
- [x] CLI `aios handoff`
- [ ] CLI `aios close`
- [ ] Adaptadores para Claude, Cursor, Codex, Copilot e ChatGPT
- [ ] Validador semântico de consistência da memória
- [ ] Exemplos reais por tipo de projeto

## Status

AIOS está em versão inicial. A primeira versão funcional já permite criar a memória `.ai/`, auditar estrutura básica e consultar o handoff operacional.
