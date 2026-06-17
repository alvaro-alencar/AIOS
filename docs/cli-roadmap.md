# Roadmap do CLI AIOS

Este documento descreve a interface de linha de comando do AIOS: comandos entregues, decisões de produto e orientação de prioridade.

## Objetivo

Automatizar a criação, auditoria e manutenção da memória operacional `.ai/` em projetos locais, com o menor número possível de comandos de alto valor.

## Comandos implementados

- `aios init`: cria a estrutura `.ai/` no projeto atual a partir de um template.
- `aios bootstrap`: cria `.ai/` e `.ai/AIOS_AGENT_PROMPT.md`.
- `aios install`: instala adaptadores para ferramentas de IA (Claude, Codex, Cursor, Copilot).
- `aios observe`: orienta auditoria segura sem alterar código.
- `aios plan`: gera plano priorizado em milestones verificáveis, sem executar.
- `aios act`: executa apenas tarefa autorizada.
- `aios audit`: verifica estrutura AIOS, marcadores e estado Git.
- `aios doctor`: diagnóstico de saúde operacional com Structural Score, Git Score e Memory Score — inclui Semantic Memory Validator v1.
- `aios prompt`: imprime o prompt de inicialização universal para preenchimento manual da memória.
- `aios handoff`: imprime o arquivo `.ai/HANDOFF.md`.
- `aios close`: encerra uma sessão e atualiza SESSION, HANDOFF e LOG.
- `aios status`: mostra resumo operacional do projeto.
- `aios handshake` / `aios open`: imprime o handshake universal em modo observe.

## Entregues em 2026-06

- **`aios doctor`** — diagnóstico determinístico de saúde operacional (sem LLM, sem APIs externas). Health Score 0-100 com classificações: saudável, atenção, risco, crítico.
- **Semantic Memory Validator v1** — 6 funções de validação semântica integradas ao `aios doctor`: CONTEXT.md vazio, placeholders em DECISIONS.md, timestamps fora de ordem em LOG.md, itens pendentes em VALIDATION_CHECKLIST.md, e consistência cruzada SESSION×HANDOFF.

## Prioridade

A prioridade é manter o CLI pequeno. Novos comandos devem nascer apenas quando reduzirem trabalho real sem transformar o AIOS em um sistema complexo.

Um bom critério: se o comando resolve um problema que aparece repetidamente em projetos reais, vale. Se resolve um problema hipotético, espera.
