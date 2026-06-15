# TODO — AIOS

## Urgente

- [ ] [pendência] Testar o CLI em ambiente local com Node.js >= 18.

## Alta prioridade

- [ ] [pendência] Melhorar `aios audit` para detectar placeholders `[exige confirmação]` e arquivos vazios.
- [ ] [pendência] Planejar integração real com slash-command `/aios` em ferramentas que permitam comandos customizados.

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
- [ ] [risco] Sem execução local, testes podem precisar de ajuste fino.

## Concluídos

- [x] [observado] Criada especificação AIOS v1.
- [x] [observado] Criada especificação AIOS Handshake v1.
- [x] [observado] Criado template padrão `.ai/`.
- [x] [observado] Criado prompt universal de inicialização.
- [x] [observado] Criado CLI inicial com `init`, `audit`, `status`, `handoff`, `bootstrap`, `prompt`, `close`, `handshake` e `open`.
- [x] [observado] Criados testes automatizados iniciais para CLI.
- [x] [observado] Criada memória `.ai/` do próprio AIOS.
