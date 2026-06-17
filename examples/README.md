# AIOS — Estudos de Caso

Esta pasta documenta projetos reais que usam AIOS.

## O que você encontrará aqui

Cada estudo de caso é um registro de como o protocolo AIOS foi aplicado em um contexto real, incluindo:

- tipo e contexto do projeto;
- link para o repositório (quando público);
- o que observar na `.ai/` daquele projeto;
- o que funcionou bem, o que exigiu ajuste no template.

Esses registros são mais valiosos que exemplos artificiais porque revelam fricção real, decisões que o template padrão não previu e padrões que surgem em tipos diferentes de projeto.

---

## AIOS (self-dogfooding)

**Repositório:** `github.com/alvaro-alencar/aios` (público)

**Tipo:** ferramenta CLI Node.js com protocolo e especificação

**O que observar na `.ai/`:**

- `CONTEXT.md` — descreve a stack (Node.js ESM, sem dependências externas) e a arquitetura de um CLI de comando único (`bin/aios.js`).
- `DECISIONS.md` — registra as decisões de produto e arquitetura: protocolo agnóstico, CLI sem deps, instalador de adaptadores, milestones verificáveis no PLAN.
- `LOG.md` — mostra como as sessões com diferentes agentes (Codex, Claude Code) foram documentadas em entradas cronológicas.
- `HANDOFF.md` — exemplifica um handoff com bugs conhecidos, pendências priorizadas e próximo passo recomendado.
- `VALIDATION_CHECKLIST.md` — lista de pré-lançamento com seção específica para Windows.

**O que foi difícil:**

- O CLI é o próprio instalador do protocolo — instalar AIOS dentro do repo AIOS no Windows cria um loop de resolução de pacote via `npx`. Bug documentado, sem solução ainda.
- SESSION.md fica desatualizado rapidamente quando sessões são conduzidas por agentes diferentes sem usar `aios close`. A consistência cruzada SESSION×HANDOFF detectada pelo `aios doctor` revelou esse padrão.

**O que funcionou bem:**

- O próprio repo serve como demonstração viva do protocolo. Novos agentes entram, leem `.ai/` e conseguem continuar sem perguntar onde estão.
- `aios doctor` como self-check: o repo AIOS avalia sua própria saúde e pontua 100/100.

---

## ga-core

**Repositório:** privado (a confirmar)

**Tipo:** [exige confirmação] — primeiro projeto real externo onde o protocolo foi validado

**O que foi observado:**

- [observado] Protocolo AIOS instalado e validado em fluxo real (conforme LOG.md do repo AIOS, 2026-06-16).
- [observado] O fluxo `install → handshake → auditoria → memória` funcionou sem fricção reportada.

**Pendente:** confirmar se o repo pode ser referenciado publicamente e detalhar estudo de caso.

---

## marketplace Dr. Saulo

**Tipo:** [exige confirmação] — marketplace vertical (área da saúde, a confirmar)

**Pendente:** instalar AIOS, conduzir pelo menos uma sessão OBSERVE e registrar o que foi necessário ajustar no template padrão para o contexto de um marketplace.

---

## tutoria

**Tipo:** [exige confirmação] — plataforma ou produto de tutoria (a confirmar)

**Pendente:** instalar AIOS, conduzir pelo menos uma sessão OBSERVE e registrar o que foi necessário ajustar no template padrão para esse contexto.

---

## Como contribuir com um estudo de caso

Se você usa AIOS em um projeto real e quer documentar a experiência:

1. Instale AIOS no projeto: `npx @alvaro-alencar/aios@latest install all`.
2. Conduza pelo menos uma sessão real com `aios observe` → `aios plan` → `aios act` → `aios close`.
3. Documente aqui o que funcionou, o que exigiu ajuste e o que ficou faltando no protocolo.

Estudos de caso reais são a melhor forma de evoluir a especificação AIOS.
