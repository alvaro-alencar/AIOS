# HANDOFF - AIOS

## Resumo executivo

[observado] AIOS (`@alvaro-alencar/aios`) é um protocolo agnóstico de memória operacional para projetos assistidos por agentes de IA. A implementação padrão é uma pasta `.ai/` versionada no repositório.

[observado] O repositório local está em `@alvaro-alencar/aios@0.1.2` no `package.json`, com suporte a modos operacionais `observe`, `plan` e `act`, além de instalação de adaptadores para Claude Code, Codex, Cursor e Copilot (`aios install`).

[observado] `aios plan` agora orienta planos em milestones verificáveis com objetivo, critério de sucesso, validações/comandos sugeridos, riscos, rollback e próximo passo.

[exige confirmacao] Não foi verificado nesta sessão se `0.1.2` já está publicada no npm.

## Estado atual

[observado] Branch `main`; `git status --branch --short` mostra `## main...origin/main`.

[observado] `git status --short` mostra apenas `.claude/` como não rastreado.

[observado] `.ai/AIOS_AGENT_PROMPT.md`, `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/aios.mdc` e `.github/copilot-instructions.md` estão rastreados pelo Git.

[observado] Testes automatizados existem em `test/cli.test.js` e cobrem todos os comandos principais, incluindo `observe`, `plan` e `act`.

[observado] `npm run check`, `npm test` e `npm run smoke` passaram em 2026-06-16; `npm test` passou 14 testes.

## O que foi feito recentemente (últimos commits)

- [observado] `f7231df chore(aios): sync agent prompt with observe mode`.
- [observado] `8fedbaf docs: align init prompt with operational modes`.
- [observado] `528f637 várias correções no aios`.
- [observado] `a8e898b ajusta aios`.
- [observado] `0873613 docs: update Cursor adapter for operational modes`.
- [observado] `ff13e26 chore: bump version to 0.1.2`.
- [observado] Commits anteriores atualizaram adaptadores para Copilot, Claude e Codex.

## Bugs registrados

1. [bug][risco] **npx dentro do próprio repo AIOS no Windows**: `npx @alvaro-alencar/aios bootstrap` executado DENTRO do diretório do repo pode usar o pacote local e sobrescreve `.ai/AIOS_AGENT_PROMPT.md` com o prompt genérico. O CLAUDE.md instalado instrui agentes a fazer exatamente isso, criando loop problemático.
2. [bug] **VALIDATION_CHECKLIST.md usa `/tmp/`** - o checklist já possui seção Windows com `$env:TEMP`, mas TODO ainda registra a necessidade de harmonizar validação multiplataforma.

## O que fazer em seguida

1. [pendencia] Decidir o destino de `.claude/` não rastreado.
2. [pendencia] Confirmar publicação npm de `@alvaro-alencar/aios@0.1.2` e criar GitHub Release correspondente.
3. [pendencia] Corrigir o bug de `npx` dentro do próprio repo no Windows.
4. [pendencia] Harmonizar TODO e checklist sobre validação Windows/`/tmp`.
5. [pendencia] Avaliar RFC futura `aios doctor` como comando de diagnóstico de saúde AIOS.

## Principais riscos

- [risco] Bug npx/Windows pode confundir agentes que entram no repo.
- [risco] `.claude/` não rastreado pode representar configuração local que não deve ser publicada; exige decisão humana.
- [risco] A versão local `0.1.2` pode não estar publicada no npm, apesar de estar no `package.json`.

## Arquivos principais

- `bin/aios.js` - CLI principal.
- `package.json` - versão local `0.1.2`.
- `README.md`
- `test/cli.test.js` - testes automatizados.
- `spec/AIOS-v1.md`, `spec/AIOS-handshake-v1.md`
- `templates/default/.ai/`
- `prompts/init-project-memory.md`

## Comandos úteis

```bash
npm run check   # sintaxe
npm test        # testes automatizados
npm run smoke   # --help e --version
npm link        # instala localmente para testes manuais
aios --help
```

## Decisões que não devem ser revertidas sem cuidado

- [decisao] AIOS é protocolo agnóstico, não apenas template de documentação.
- [decisao] A pasta `.ai/` é a implementação padrão.
- [decisao] CLI sem dependências externas.
- [decisao] Node.js ESM puro.
- [decisao] `/aios` entra em OBSERVE por padrão; PLAN e ACT separam planejamento e execução.
- [decisao] PLAN deve gerar milestones verificáveis, sem executar mudanças.

## Dúvidas humanas

- [exige confirmacao] O que fazer com `.claude/`?
- [exige confirmacao] `0.1.2` já foi publicada no npm?
- [exige confirmacao] Qual será o próximo projeto real de terceiros como teste público?

## Primeiros 15 minutos para o próximo agente

1. Ler `.ai/SESSION.md`.
2. Ler `.ai/TODO.md` - especialmente a seção de bugs.
3. Rodar `git status --branch --short`.
4. Rodar `git log --oneline -10`.
5. Rodar `npm test` e `npm run smoke`.
6. Decidir com humano o destino de `.claude/` antes de versionar ou remover.
7. Registrar resultados em `.ai/LOG.md`.
