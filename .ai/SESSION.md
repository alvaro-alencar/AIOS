# SESSION — Estado Atual do AIOS

## Data/hora da última atualização

[observado] 2026-06-16, auditoria feita por Claude Code (Sonnet 4.6).

## Branch atual

[observado] `main` — em sincronismo com `origin/main`.

## Estado do projeto

[observado] AIOS está publicado no npm como `@alvaro-alencar/aios@0.1.1`.

[observado] v0.1.1 adicionou o comando `aios install` com suporte a adaptadores para Claude, Codex, Cursor e Copilot.

[observado] O repositório contém: protocolo, handshake, template padrão, prompt universal, memória própria, CLI Node.js e testes automatizados cobrindo todos os comandos principais.

## Arquivos não rastreados no git (untracked)

[observado] Os seguintes arquivos existem no sistema de arquivos mas não estão versionados:

- `.ai/AIOS_AGENT_PROMPT.md` — prompt genérico copiado de `prompts/init-project-memory.md`
- `.cursor/rules/aios.mdc` — adaptador Cursor gerado por `aios install`
- `.github/copilot-instructions.md` — adaptador Copilot gerado por `aios install`
- `AGENTS.md` — adaptador Codex gerado por `aios install`
- `CLAUDE.md` — adaptador Claude gerado por `aios install`

[inferência] Esses arquivos foram criados ao rodar `aios install all` dentro do próprio repositório AIOS, provavelmente como validação do comando.

[risco] Nenhum deles está commitado. Se forem perdidos ou sobrescritos, a memória do repo fica incompleta.

## Comandos implementados e disponíveis

[observado] `aios init`, `aios bootstrap`, `aios install`, `aios audit`, `aios status`, `aios handoff`, `aios close`, `aios handshake`, `aios open`, `aios prompt`, `aios --help`, `aios --version`.

## Testes automatizados

[observado] `test/cli.test.js` existe e cobre: help, version, init, bootstrap, install (all e individual), handshake, audit e close.

## Próximos passos recomendados

1. [pendência] Decidir se CLAUDE.md, AGENTS.md, `.cursor/` e `.github/` devem ser commitados no repo AIOS.
2. [pendência] Criar GitHub Release `v0.1.1`.
3. [pendência] Registrar e corrigir o bug de `npx` dentro do próprio repo no Windows.
4. [pendência] Corrigir `VALIDATION_CHECKLIST.md` — usa `/tmp/` (Unix-only).
5. [pendência] Publicar `v0.1.2` após correções.

## Riscos imediatos

- [risco] Bug: `npx @alvaro-alencar/aios bootstrap` dentro do próprio repo AIOS no Windows pode usar o pacote local (mesmo nome no package.json) e sobrescreve `.ai/AIOS_AGENT_PROMPT.md` com o prompt genérico, confundindo agentes.
- [risco] `CLAUDE.md` instalado no repo instrui agentes a rodar `npx @alvaro-alencar/aios bootstrap` — dentro do repo AIOS, isso cria um loop problemático no Windows.
- [risco] Mudanças pós-publicação (adaptadores, testes) ainda não geraram uma Release no GitHub.

## Dúvidas abertas

- [exige confirmação] Commitar os arquivos não rastreados (CLAUDE.md, AGENTS.md, .cursor/, .github/) no repo AIOS?
- [exige confirmação] Quando publicar v0.1.2?
- [exige confirmação] Qual será o primeiro projeto real de terceiros usado como teste público do AIOS?
