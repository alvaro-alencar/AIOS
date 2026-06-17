# CONTEXT — AIOS

## Resumo executivo

[observado] AIOS é um protocolo agnóstico de memória operacional versionada para projetos assistidos por agentes de IA.

[observado] A implementação padrão do protocolo é uma pasta `.ai/` dentro do repositório do projeto.

[observado] Versão atual no repositório: `@alvaro-alencar/aios@0.1.3` (`package.json`).

[observado] `@alvaro-alencar/aios@0.1.3` confirmada como publicada no npm pelo usuário em 2026-06-17.

## Problema resolvido

[observado] Projetos trabalhados por múltiplos agentes de IA perdem contexto entre sessões. AIOS cria uma memória persistente com contexto, decisões, pendências, riscos, validação e handoff.

## Stack técnica

[observado] Projeto Node.js ESM, sem dependências externas.

- Runtime: Node.js >= 18
- CLI: `bin/aios.js`
- Template: `templates/default/.ai/`
- Spec: `spec/AIOS-v1.md`, `spec/AIOS-handshake-v1.md`
- Prompt: `prompts/init-project-memory.md`
- Testes: `test/cli.test.js` (Node.js native test runner)
- Docs: `docs/vision.md`, `docs/cli-roadmap.md`

## Arquitetura do repositório

```txt
README.md
package.json
LICENSE
bin/aios.js              — CLI principal (todos os comandos)
spec/AIOS-v1.md          — especificação do protocolo
spec/AIOS-handshake-v1.md
templates/default/.ai/   — template copiado pelo aios init/bootstrap
prompts/init-project-memory.md  — prompt universal de inicialização
docs/vision.md
docs/cli-roadmap.md
test/cli.test.js         — testes automatizados (Node.js native test)
.ai/                     — memória operacional do próprio AIOS
```

## Comandos disponíveis no CLI

```bash
aios init [--force] [--with-prompt]        # Cria .ai/ no projeto atual
aios bootstrap [--force]                   # Cria .ai/ + AIOS_AGENT_PROMPT.md
aios install [all|codex|claude|cursor|copilot] [--force]  # Instala adaptadores
aios observe                               # Modo seguro: audita e orienta sem alterar código
aios plan                                  # Gera plano priorizado em milestones verificáveis, sem executar
aios act "..."                             # Executa apenas tarefa autorizada
aios handshake                             # Imprime handshake universal /aios
aios open                                  # Alias de handshake
aios prompt                                # Imprime o prompt de inicialização
aios audit                                 # Verifica estrutura, marcadores e Git
aios status                                # Mostra resumo operacional
aios handoff                               # Imprime HANDOFF.md (até 80 linhas)
aios close --summary "..." --next "..."    # Encerra sessão e atualiza memória
aios --version
aios --help
```

## Comandos de desenvolvimento

```bash
npm run check    # node --check bin/aios.js (lint sintático)
npm run smoke    # --help e --version
npm test         # node --test (executa test/cli.test.js)
npm link         # instala localmente para testes manuais
```

## Adaptadores suportados (`aios install`)

[observado] O comando `aios install` cria arquivos de instrução para ferramentas de IA:

| Adaptador | Arquivo criado                        |
|-----------|--------------------------------------|
| `codex`   | `AGENTS.md`                          |
| `claude`  | `CLAUDE.md`                          |
| `cursor`  | `.cursor/rules/aios.mdc`             |
| `copilot` | `.github/copilot-instructions.md`    |
| `all`     | todos os quatro acima                |

[observado] `aios install` também cria `.ai/` (se ausente) e `.ai/AIOS_AGENT_PROMPT.md`.

## Fluxo recomendado (projetos externos)

```bash
npx @alvaro-alencar/aios install all
# Depois abrir Codex / Claude Code / Cursor / Copilot no projeto
# Ao encerrar sessão:
aios close --summary "o que foi feito" --next "próximo passo"
```

## Padrões

- [observado] Código sem dependências externas para manter portabilidade.
- [observado] Documentação em português brasileiro.
- [observado] Memória separa fatos, inferências, riscos, decisões e pendências.
- [observado] ESM puro (type: "module" no package.json).

## Riscos estruturais

- [risco] `aios audit` valida estrutura e marcadores, mas não faz auditoria semântica profunda.
- [risco] `aios init --force` pode sobrescrever conteúdo relevante.
- [risco] `npx @alvaro-alencar/aios` dentro do próprio repo AIOS no Windows: pode resolver para o pacote local pelo nome idêntico no package.json (ver TODO.md — bug registrado).
- [risco] `VALIDATION_CHECKLIST.md` usa `/tmp/` (Unix-only) — não funciona no Windows sem ajuste.

## Próximas expansões

- [pendência] Corrigir bug de `npx` dentro do próprio repo no Windows.
- [pendência] Corrigir VALIDATION_CHECKLIST.md para Windows.
- [pendência] Criar exemplos reais em `examples/`.
- [pendência] Criar validador semântico da memória.
- [pendência] Melhorar `aios audit` para detectar arquivos gerados mas não commitados.
