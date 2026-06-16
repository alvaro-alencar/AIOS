# SESSION - Estado Atual do AIOS

## Data/hora da última atualização

[observado] 2026-06-16, auditoria OBSERVE feita por Codex.

## Branch atual

[observado] `main` - `git status --branch --short` mostra `## main...origin/main`.

## Estado do projeto

[observado] `package.json` local está em `@alvaro-alencar/aios@0.1.2`.

[exige confirmacao] Esta sessão não verificou se a versão `0.1.2` já está publicada no npm.

[observado] O CLI local inclui `aios observe`, `aios plan` e `aios act`, além de `aios install` com suporte a adaptadores para Claude, Codex, Cursor e Copilot.

[observado] `aios plan` foi evoluído para orientar planos em milestones verificáveis com objetivo, critério de sucesso, validações/comandos sugeridos, riscos, rollback e próximo passo.

[observado] O repositório contém: protocolo, handshake, template padrão, prompt universal, memória própria, CLI Node.js, adaptadores e testes automatizados.

## Arquivos não rastreados no git (untracked)

[observado] `git status --short` mostra atualmente apenas:

- `.claude/` - diretório local não rastreado.

[observado] `git ls-files` confirma que `.ai/AIOS_AGENT_PROMPT.md`, `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/aios.mdc` e `.github/copilot-instructions.md` já estão rastreados.

[inferencia] `.claude/settings.local.json` parece configuração local de ferramenta e precisa de decisão explícita antes de ser versionado ou ignorado.

## Comandos implementados e disponíveis

[observado] `aios init`, `aios bootstrap`, `aios install`, `aios observe`, `aios plan`, `aios act`, `aios audit`, `aios status`, `aios handoff`, `aios close`, `aios handshake`, `aios open`, `aios prompt`, `aios --help`, `aios --version`.

## Testes automatizados

[observado] `test/cli.test.js` existe e cobre: help, version, init, bootstrap, install (all e individual), observe, plan, act, adapter instructions, handshake, audit e close.

[observado] Em 2026-06-16, `npm run check`, `npm test` e `npm run smoke` foram executados com sucesso; `npm test` passou 14 testes.

## Próximos passos recomendados

1. [pendencia] Decidir se `.claude/` deve ser ignorado, versionado ou removido localmente.
2. [pendencia] Confirmar publicação npm de `@alvaro-alencar/aios@0.1.2` e criar GitHub Release correspondente.
3. [pendencia] Registrar e corrigir o bug de `npx` dentro do próprio repo no Windows.
4. [pendencia] Harmonizar TODO e checklist sobre validação Windows/`/tmp`, já que `VALIDATION_CHECKLIST.md` possui seção Windows mas ainda registra risco pendente.
5. [pendencia] Avaliar RFC futura `aios doctor` como diagnóstico de saúde AIOS.

## Riscos imediatos

- [risco] Bug: `npx @alvaro-alencar/aios bootstrap` dentro do próprio repo AIOS no Windows pode usar o pacote local (mesmo nome no package.json) e sobrescreve `.ai/AIOS_AGENT_PROMPT.md` com o prompt genérico, confundindo agentes.
- [risco] `CLAUDE.md` instalado no repo instrui agentes a rodar `npx @alvaro-alencar/aios bootstrap` - dentro do repo AIOS, isso cria um loop problemático no Windows.
- [risco] Mudanças pós-publicação (modos operacionais, adaptadores, testes) podem ainda não estar distribuídas no npm se `0.1.2` não tiver sido publicada.

## Dúvidas abertas

- [exige confirmacao] O diretório `.claude/` deve ser ignorado, versionado ou removido localmente?
- [exige confirmacao] A versão `0.1.2` já foi publicada no npm?
- [exige confirmacao] Qual será o próximo projeto real usado como teste público do AIOS?
