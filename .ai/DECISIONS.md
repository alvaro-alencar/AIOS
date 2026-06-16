# DECISIONS — AIOS

## 2026-06-15 — AIOS como protocolo e CLI agnóstico

**Status:** aceita
**Tipo:** produto | arquitetura | processo

### Decisão

[decisão] AIOS será tratado como protocolo agnóstico de memória operacional para agentes, com implementação padrão via pasta `.ai/` e CLI Node.js.

### Justificativa

O problema central não é criar documentação por projeto, mas estabelecer um padrão reutilizável para continuidade operacional entre agentes e humanos.

### Alternativas consideradas

- Manter apenas prompts manuais por projeto.
- Copiar a pasta `.ai/` manualmente.
- Deixar o padrão preso a um projeto específico.

### Impacto

O repo AIOS passa a conter especificação, templates, prompts e automação CLI.

### Riscos

[risco] Crescer rápido demais antes de validar o uso real em projetos concretos.

### Revisar quando

Após uso em pelo menos três projetos reais de terceiros.

---

## 2026-06-15 — CLI sem dependências externas na primeira versão

**Status:** aceita
**Tipo:** arquitetura

### Decisão

[decisão] A primeira versão do CLI usa apenas módulos nativos do Node.js.

### Justificativa

Reduz fricção, riscos de instalação e complexidade inicial.

### Alternativas consideradas

- Usar Commander.js.
- Usar TypeScript desde o início.
- Criar binário em outra linguagem.

### Impacto

O CLI é simples e portátil, mas menos sofisticado. `bin/aios.js` concentra todos os comandos (~438 linhas).

### Riscos

[risco] O arquivo `bin/aios.js` pode crescer e precisar ser modularizado.

### Revisar quando

Quando surgirem mais comandos ou necessidade de parsing avançado.

---

## 2026-06-15 — Instalador de adaptadores (`aios install`)

**Status:** aceita
**Tipo:** produto | experiência do usuário

### Decisão

[decisão] O comando `aios install [all|codex|claude|cursor|copilot]` gera os arquivos de instrução de cada ferramenta de IA a partir de um conteúdo padronizado interno ao CLI.

### Justificativa

Elimina a necessidade de o usuário copiar manualmente os arquivos de instrução para cada ferramenta. Um único comando prepara o projeto para todas as ferramentas suportadas.

### Alternativas consideradas

- Disponibilizar arquivos template para download manual.
- Documentar o conteúdo e pedir ao usuário para criar.

### Impacto

A experiência do usuário melhora drasticamente. O conteúdo dos adaptadores fica codificado em `getAdapterFiles()` dentro do CLI.

### Riscos

[risco] Atualizar o conteúdo dos adaptadores exige nova versão do pacote npm.
[risco] Rodar `aios install` dentro do próprio repo AIOS gera arquivos não rastreados que podem confundir agentes.

### Revisar quando

Se o conteúdo dos adaptadores precisar de customização por projeto.
