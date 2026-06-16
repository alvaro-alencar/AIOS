# AIOS - Agent Intelligence Operating System

AIOS e um protocolo agnostico de memoria operacional para projetos assistidos por agentes de IA.

A ideia central e simples: todo projeto deveria ter uma memoria versionada, legivel por humanos e agentes, capaz de preservar contexto, decisoes, pendencias, riscos, validacoes e handoffs entre sessoes.

O AIOS nao e apenas uma pasta. A pasta `.ai/` e a implementacao padrao do protocolo.

## Instalacao global

Use diretamente com npx:

```bash
npx @alvaro-alencar/aios handshake
```

Ou instale globalmente:

```bash
npm install -g @alvaro-alencar/aios
aios handshake
```

## Fluxo recomendado

Para deixar um projeto pronto para agentes de IA:

```bash
cd meu-projeto
npx @alvaro-alencar/aios install all
```

Isso cria a memoria `.ai/` e arquivos de instrucao para ferramentas de IA.

Enquanto a ferramenta nao tiver suporte nativo, use:

```bash
npx @alvaro-alencar/aios handshake
```

Em uma ferramenta de IA que entenda o protocolo AIOS, o ideal e digitar apenas:

```txt
/aios
```

## Uso rapido

```bash
aios init        # cria .ai/ no projeto atual
aios bootstrap   # cria .ai/ e .ai/AIOS_AGENT_PROMPT.md
aios install all # cria .ai/ e instrucoes para agentes
aios handshake   # imprime o handshake universal /aios
aios open        # alias de handshake
aios prompt      # imprime o prompt completo para preencher a memoria
aios audit       # verifica estrutura AIOS, marcadores pendentes e estado Git
aios status      # mostra resumo operacional
aios handoff     # imprime .ai/HANDOFF.md
aios close       # encerra sessao e atualiza SESSION, HANDOFF e LOG
```

## Arquivos gerados por install all

```txt
.ai/
.ai/AIOS_AGENT_PROMPT.md
AGENTS.md
CLAUDE.md
.cursor/rules/aios.mdc
.github/copilot-instructions.md
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

- [x] Publicacao npm `@alvaro-alencar/aios@0.1.0`
- [x] Especificacao inicial do protocolo
- [x] Especificacao AIOS Handshake v1
- [x] Template padrao `.ai/`
- [x] Prompt de inicializacao manual
- [x] CLI `aios init`
- [x] CLI `aios bootstrap`
- [x] CLI `aios install all`
- [x] CLI `aios handshake` / `aios open`
- [x] CLI `aios audit`
- [x] CLI `aios status`
- [x] CLI `aios handoff`
- [x] CLI `aios close`
- [x] Testes iniciais do CLI
- [ ] Validador semantico de consistencia da memoria
- [ ] Exemplos reais por tipo de projeto

## Status

AIOS esta publicado no npm como `@alvaro-alencar/aios@0.1.0`.

A versao atual no repositorio adiciona instaladores de adaptadores para ferramentas de IA. Publique uma nova versao npm para distribuir esse recurso globalmente.
