# `.ai/` — Memória Operacional AIOS

Esta pasta é a própria memória operacional do projeto AIOS.

Ela deve ser lida por agentes antes de qualquer alteração relevante no repositório.

## Ordem de leitura

1. `HANDOFF.md`
2. `SESSION.md`
3. `CONTEXT.md`
4. `TODO.md`
5. `DECISIONS.md`
6. `VALIDATION_CHECKLIST.md`
7. `LOG.md`

## Ordem de atualização ao encerrar

1. `SESSION.md`
2. `TODO.md`
3. `DECISIONS.md`, se houver decisão nova
4. `VALIDATION_CHECKLIST.md`, se houver mudança de validação
5. `HANDOFF.md`
6. `LOG.md`

## Segurança

Não registrar segredos, tokens, senhas, chaves, certificados, credenciais, conteúdo de `.env` ou dados pessoais sensíveis.

## Marcadores

- `[observado]` fato confirmado no repositório.
- `[inferência]` conclusão provável.
- `[exige confirmação]` dúvida para humano.
- `[risco]` risco técnico, operacional ou de segurança.
- `[decisão]` decisão relevante.
- `[pendência]` ação aberta.
