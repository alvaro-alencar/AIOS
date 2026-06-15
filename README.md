# AIOS - Agent Intelligence Operating System

AIOS e um protocolo agnostico de memoria operacional para projetos assistidos por agentes de IA.

A ideia central e simples: todo projeto deveria ter uma memoria versionada, legivel por humanos e agentes, capaz de preservar contexto, decisoes, pendencias, riscos, validacoes e handoffs entre sessoes.

O AIOS nao e apenas uma pasta. A pasta `.ai/` e a implementacao padrao do protocolo.

## O problema

Projetos modernos estao sendo trabalhados por humanos, assistentes de codigo, agentes de CLI, copilotos, modelos locais e ferramentas diferentes. Cada agente entra no projeto com pouco contexto e pode repetir analise, desfazer decisoes antigas, ignorar riscos ou quebrar fluxos criticos.

Codigo mostra o que existe. Commits mostram o que mudou. Issues mostram parte do plano. Mas falta uma camada persistente para responder o que o projeto e, como funciona, qual e o estado atual, quais decisoes importam e como validar mudancas com seguranca.

AIOS e essa camada.

## Instalacao local

Clone o repositorio e exponha o comando globalmente:

```bash
git clone https://github.com/alvaro-alencar/AIOS.git
cd AIOS
npm link
```

Depois, em qualquer projeto:

```bash
aios init
```

## Uso rapido

```bash
aios init       # cria .ai/ no projeto atual
aios audit      # verifica estrutura AIOS, marcadores pendentes e estado Git
aios status     # mostra resumo operacional
aios handoff    # imprime .ai/HANDOFF.md
aios close      # encerra sessao e atualiza SESSION, HANDOFF e LOG
```

Exemplo de encerramento:

```bash
aios close --summary "Sessao concluida" --next "Rodar testes e abrir PR"
```

Depois de rodar `aios init`, peca ao agente de IA no CLI:

```txt
Leia todo o repositorio, audite a estrutura real do projeto e preencha a pasta `.ai/` seguindo o protocolo AIOS. Nao altere codigo de producao. Nao registre segredos. Separe fatos observados, inferencias e duvidas.
```

O prompt completo esta em `prompts/init-project-memory.md`.

## Desenvolvimento

```bash
npm run check
npm run smoke
npm test
```

## A implementacao padrao

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

## Principios

1. O repositorio e a fonte da verdade.
2. A memoria deve refletir o estado real do projeto.
3. Fatos, inferencias e duvidas devem ser separados.
4. Segredos nunca devem ser copiados para a memoria.
5. O proximo agente deve conseguir continuar o trabalho sem perguntar onde esta.
6. A memoria deve ser util antes de ser bonita.
7. O protocolo deve ser agnostico de stack, linguagem, framework e ferramenta de IA.

## Roadmap

- [x] Especificacao inicial do protocolo
- [x] Template padrao `.ai/`
- [x] Prompt de inicializacao manual
- [x] CLI `aios init`
- [x] CLI `aios audit`
- [x] CLI `aios status`
- [x] CLI `aios handoff`
- [x] CLI `aios close`
- [x] Testes iniciais do CLI
- [ ] Adaptadores para Claude, Cursor, Codex, Copilot e ChatGPT
- [ ] Validador semantico de consistencia da memoria
- [ ] Exemplos reais por tipo de projeto

## Status

AIOS esta em versao inicial. A primeira versao funcional ja permite criar a memoria `.ai/`, auditar estrutura basica, consultar o handoff operacional e encerrar sessoes atualizando a memoria viva do projeto.
