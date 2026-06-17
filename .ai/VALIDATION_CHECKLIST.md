# VALIDATION_CHECKLIST — AIOS

## Instalação local

```bash
git clone https://github.com/alvaro-alencar/AIOS.git
cd AIOS
npm link
```

## Checagem sintática

```bash
npm run check
```

## Smoke test

```bash
npm run smoke
aios --help
aios --version
```

## Testes automatizados

```bash
npm test
```

## Teste de inicialização (Linux/macOS)

```bash
mkdir /tmp/aios-test
cd /tmp/aios-test
git init
aios init
aios audit
aios status
aios handoff
```

## Teste de inicialização (Windows)

```powershell
$dir = "$env:TEMP\aios-test-$(Get-Random)"
New-Item -ItemType Directory -Path $dir | Out-Null
Set-Location $dir
git init
aios init
aios audit
aios status
aios handoff
```

> Cada plataforma tem seu bloco separado acima. Use o bloco correspondente ao seu SO.

## Teste de adaptadores

```bash
# Em projeto externo (fora do repo AIOS):
npx @alvaro-alencar/aios install all
# Verificar criação de: CLAUDE.md, AGENTS.md, .cursor/rules/aios.mdc, .github/copilot-instructions.md, .ai/AIOS_AGENT_PROMPT.md
```

## Checklist antes de PR/release

- [ ] `npm run check` executado sem erros.
- [ ] `npm test` executado sem falhas.
- [ ] `npm run smoke` executado.
- [ ] `aios init` testado em projeto temporário.
- [ ] `aios audit` testado em projeto com `.ai/`.
- [ ] `aios audit` testado em projeto sem `.ai/`.
- [ ] `aios install all` testado em projeto externo.
- [ ] README atualizado.
- [ ] `.ai/SESSION.md` atualizado.
- [ ] `.ai/HANDOFF.md` atualizado.
- [ ] Nenhum segredo registrado na memória.

## Riscos de regressão

- [risco] Quebrar cópia recursiva do template.
- [risco] `aios init --force` sobrescrever memória customizada.
- [risco] `aios audit` dar falsa sensação de validação completa.
- [observado] `npx` dentro do próprio repo AIOS no Windows: mitigado em 2026-06-17 — `bootstrap` detecta self-repo e avisa; `writeAgentPrompt` preserva arquivo existente sem `--force`.
