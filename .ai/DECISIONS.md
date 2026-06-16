# DECISIONS - AIOS

## 2026-06-15 - AIOS como protocolo e CLI agnóstico

**Status:** aceita
**Tipo:** produto | arquitetura | processo

### Decisão

[decisao] AIOS será tratado como protocolo agnóstico de memória operacional para agentes, com implementação padrão via pasta `.ai/` e CLI Node.js.

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

## 2026-06-15 - CLI sem dependências externas na primeira versão

**Status:** aceita
**Tipo:** arquitetura

### Decisão

[decisao] A primeira versão do CLI usa apenas módulos nativos do Node.js.

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

## 2026-06-15 - Instalador de adaptadores (`aios install`)

**Status:** aceita
**Tipo:** produto | experiência do usuário

### Decisão

[decisao] O comando `aios install [all|codex|claude|cursor|copilot]` gera os arquivos de instrução de cada ferramenta de IA a partir de um conteúdo padronizado interno ao CLI.

### Justificativa

Elimina a necessidade de o usuário copiar manualmente os arquivos de instrução para cada ferramenta. Um único comando prepara o projeto para todas as ferramentas suportadas.

### Alternativas consideradas

- Disponibilizar arquivos template para download manual.
- Documentar o conteúdo e pedir ao usuário para criar.

### Impacto

A experiência do usuário melhora drasticamente. O conteúdo dos adaptadores fica codificado em `getAdapterFiles()` dentro do CLI.

### Riscos

[risco] Atualizar o conteúdo dos adaptadores exige nova versão do pacote npm.
[risco] Rodar `aios install` dentro do próprio repo AIOS pode gerar ou alterar arquivos de adaptadores e confundir agentes se o estado Git não for checado antes; no estado observado em 2026-06-16, os adaptadores principais já estavam rastreados e apenas `.claude/` aparecia como não rastreado.

### Revisar quando

Se o conteúdo dos adaptadores precisar de customização por projeto.

---

## 2026-06-16 - PLAN com milestones verificáveis

**Status:** aceita
**Tipo:** produto | processo | segurança operacional

### Decisão

[decisao] O modo PLAN deve organizar planos em milestones verificáveis, sem executar mudanças.

Cada milestone deve conter objetivo, critério de sucesso, validações/comandos sugeridos, riscos, rollback ou caminho de reversão e próximo passo recomendado.

### Justificativa

Planos em milestones pequenos reduzem ambiguidade para agentes em ACT, melhoram validação incremental e deixam reversão mais explícita.

### Alternativas consideradas

- Manter PLAN como lista priorizada genérica.
- Criar sistema formal de planning com schema próprio.
- Implementar novo comando para planejamento.

### Impacto

[observado] A mudança é textual e compatível com o CLI atual: atualiza instrução do `aios plan`, docs, specs, prompts e testes sem adicionar complexidade de parser.

### Riscos

[risco] O CLI orienta o formato, mas ainda não valida semanticamente se um agente gerou milestones completos.

### Revisar quando

Quando existir `aios doctor` ou validador semântico capaz de diagnosticar qualidade da memória e dos planos.
