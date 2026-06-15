# VALIDATION_CHECKLIST — Validação do Projeto

> Atualize este arquivo sempre que comandos, fluxos ou critérios de validação mudarem.

## Instalação

```bash
[exige confirmação]
```

## Desenvolvimento local

```bash
[exige confirmação]
```

## Build

```bash
[exige confirmação]
```

## Testes

```bash
[exige confirmação]
```

## Lint / typecheck

```bash
[exige confirmação]
```

## Deploy

```bash
[exige confirmação]
```

## Fluxos críticos para validação manual

- [ ] [exige confirmação] Fluxo crítico 1
- [ ] [exige confirmação] Fluxo crítico 2

## Checklist antes de abrir PR

- [ ] `git status` revisado.
- [ ] Mudanças escopo da tarefa separadas de alterações alheias.
- [ ] Testes relevantes executados ou limitação registrada.
- [ ] `.ai/SESSION.md` atualizado.
- [ ] `.ai/TODO.md` atualizado, se necessário.
- [ ] `.ai/HANDOFF.md` atualizado.
- [ ] Nenhum segredo incluído em arquivos versionados.

## Checklist antes de merge

- [ ] Build passa.
- [ ] Testes principais passam.
- [ ] Revisão humana feita quando houver alteração crítica.
- [ ] Riscos conhecidos foram registrados.

## Checklist antes de deploy

- [ ] Variáveis de ambiente conferidas sem copiar valores para `.ai/`.
- [ ] Migrações revisadas, se houver.
- [ ] Plano de rollback definido, se aplicável.
- [ ] Fluxos críticos testados.

## Checklist pós-deploy

- [ ] Logs revisados.
- [ ] Fluxos críticos verificados.
- [ ] Erros/regressões monitorados.
- [ ] `.ai/LOG.md` atualizado, se o deploy for relevante.

## Riscos de regressão

- [risco] [exige confirmação]

## Áreas que precisam de teste manual

- [exige confirmação]
