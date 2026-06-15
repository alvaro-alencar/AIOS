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

## Teste de inicialização

```bash
mkdir /tmp/aios-test
cd /tmp/aios-test
git init
aios init
aios audit
aios status
aios handoff
```

## Checklist antes de PR/release

- [ ] `npm run check` executado.
- [ ] `npm run smoke` executado.
- [ ] `aios init` testado em projeto temporário.
- [ ] `aios audit` testado em projeto com `.ai/`.
- [ ] `aios audit` testado em projeto sem `.ai/`.
- [ ] README atualizado.
- [ ] `.ai/SESSION.md` atualizado.
- [ ] `.ai/HANDOFF.md` atualizado.
- [ ] Nenhum segredo registrado.

## Riscos de regressão

- [risco] Quebrar cópia recursiva do template.
- [risco] `aios init --force` sobrescrever memória customizada.
- [risco] `aios audit` dar falsa sensação de validação completa.
