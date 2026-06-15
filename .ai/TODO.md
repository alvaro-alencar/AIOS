# TODO — AIOS

## Urgente

- [ ] [pendência] Testar o CLI em ambiente local com Node.js >= 18.

## Alta prioridade

- [ ] [pendência] Implementar `aios close` para encerrar sessão e atualizar memória.
- [ ] [pendência] Criar testes automatizados para `init`, `audit`, `status` e `handoff`.
- [ ] [pendência] Melhorar `aios audit` para detectar placeholders `[exige confirmação]` e arquivos vazios.

## Média prioridade

- [ ] [pendência] Criar adaptadores para Claude, Cursor, Copilot, Codex e ChatGPT.
- [ ] [pendência] Criar exemplos reais em `examples/`.
- [ ] [pendência] Criar documentação de publicação npm.

## Baixa prioridade

- [ ] [pendência] Criar marca visual e landing page simples.

## Bugs conhecidos

- [ ] [risco] Ainda não houve execução local do CLI após criação via connector.

## Dívidas técnicas

- [ ] [inferência] Separar funções do CLI em módulos quando o arquivo crescer.

## Riscos técnicos

- [ ] [risco] `aios init --force` pode sobrescrever conteúdo relevante.
- [ ] [risco] Sem testes, regressões no CLI podem passar despercebidas.

## Concluídos

- [x] [observado] Criada especificação AIOS v1.
- [x] [observado] Criado template padrão `.ai/`.
- [x] [observado] Criado prompt universal de inicialização.
- [x] [observado] Criado CLI inicial com `init`, `audit`, `status` e `handoff`.
- [x] [observado] Criada memória `.ai/` do próprio AIOS.
