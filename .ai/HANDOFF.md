# HANDOFF — AIOS

## Resumo executivo

[observado] AIOS (`@alvaro-alencar/aios`) é um protocolo agnóstico de memória operacional para projetos assistidos por agentes de IA. A implementação padrão é uma pasta `.ai/` versionada no repositório.

[observado] v0.1.1 está publicada no npm com suporte a instalação de adaptadores para Claude Code, Codex, Cursor e Copilot (`aios install`).

## Estado atual

[observado] Branch `main`, em sincronismo com `origin/main`.

[observado] Testes automatizados existem em `test/cli.test.js` e cobrem todos os comandos principais.

[observado] Cinco arquivos não rastreados no git: `.ai/AIOS_AGENT_PROMPT.md`, `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/aios.mdc`, `.github/copilot-instructions.md` — gerados por `aios install all` dentro do próprio repo.

## O que foi feito recentemente (últimos commits)

- [observado] Merge da branch `claude/aios-npm-audit-ess2ho`.
- [observado] Adicionado instalador de adaptadores (`aios install`) — v0.1.1.
- [observado] Documentados adaptadores no README.
- [observado] Criados testes para o instalador de adaptadores.
- [observado] Atualizada SESSION após publicação npm.

## Bugs registrados

1. [bug][risco] **npx dentro do próprio repo AIOS no Windows**: `npx @alvaro-alencar/aios bootstrap` executado DENTRO do diretório do repo pode usar o pacote local e sobrescreve `.ai/AIOS_AGENT_PROMPT.md` com o prompt genérico. O CLAUDE.md instalado instrui agentes a fazer exatamente isso, criando loop problemático.
2. [bug] **VALIDATION_CHECKLIST.md usa `/tmp/`** — não funciona no Windows.

## O que fazer em seguida

1. [pendência] Decidir sobre commitar CLAUDE.md, AGENTS.md, `.cursor/`, `.github/` no repo AIOS.
2. [pendência] Criar GitHub Release `v0.1.1`.
3. [pendência] Corrigir o bug de `npx` dentro do próprio repo no Windows.
4. [pendência] Corrigir `VALIDATION_CHECKLIST.md` para Windows.
5. [pendência] Publicar v0.1.2 após correções.

## Principais riscos

- [risco] Bug npx/Windows (ver acima) pode confundir agentes que entram no repo.
- [risco] Arquivos de adaptadores não commitados podem ser perdidos.
- [risco] Nenhuma Release GitHub criada ainda para v0.1.1.

## Arquivos principais

- `bin/aios.js` — CLI (~438 linhas, todos os comandos)
- `package.json` — v0.1.1
- `README.md`
- `test/cli.test.js` — testes automatizados
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

- [decisão] AIOS é protocolo agnóstico, não apenas template de documentação.
- [decisão] A pasta `.ai/` é a implementação padrão.
- [decisão] CLI sem dependências externas.
- [decisão] Node.js ESM puro.

## Dúvidas humanas

- [exige confirmação] Commitar ou não os arquivos de adaptadores no repo AIOS?
- [exige confirmação] Quando publicar v0.1.2?
- [exige confirmação] Qual será o primeiro projeto real de terceiros como teste público?

## Primeiros 15 minutos para o próximo agente

1. Ler `.ai/SESSION.md`.
2. Ler `.ai/TODO.md` — especialmente a seção de bugs.
3. Rodar `npm test` para confirmar que os testes passam.
4. Rodar `npm run smoke`.
5. Verificar quais arquivos untracked devem ser commitados.
6. Registrar resultados em `.ai/LOG.md`.
