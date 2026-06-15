# `.ai/` — Memória Operacional AIOS

Esta pasta implementa o protocolo AIOS neste projeto.

Ela existe para permitir que agentes de IA e humanos mantenham continuidade operacional entre sessões, sem depender de histórico de conversa, memória externa ou conhecimento implícito.

## Ordem de leitura obrigatória

Ao iniciar uma sessão, leia nesta ordem:

1. `HANDOFF.md`
2. `SESSION.md`
3. `CONTEXT.md`
4. `TODO.md`
5. `DECISIONS.md`
6. `VALIDATION_CHECKLIST.md`
7. `LOG.md`, se precisar de histórico detalhado

Depois rode:

```bash
git status
git log --oneline -10
```

Compare a memória com o estado real do repositório.

## Ordem de atualização ao encerrar

Ao final de uma sessão relevante, atualize nesta ordem:

1. `SESSION.md`
2. `TODO.md`
3. `DECISIONS.md`, se houver decisão nova
4. `VALIDATION_CHECKLIST.md`, se houver mudança de validação
5. `HANDOFF.md`
6. `LOG.md`

## Regras de segurança

Nunca registre:

- tokens;
- senhas;
- chaves de API;
- certificados;
- conteúdo de `.env`;
- credenciais;
- dados pessoais sensíveis;
- strings de conexão privadas.

Se encontrar segredo exposto, registre apenas o risco e o local aproximado, sem copiar o valor.

## Marcadores semânticos

Use:

- `[observado]` para fatos confirmados no repositório;
- `[inferência]` para conclusões prováveis;
- `[exige confirmação]` para dúvidas que exigem humano;
- `[risco]` para riscos técnicos, operacionais ou de segurança;
- `[decisão]` para decisões relevantes;
- `[pendência]` para ações abertas.

## Estrutura

| Arquivo | Função |
|---|---|
| `CONTEXT.md` | Contexto estável, arquitetura e mapa do projeto |
| `SESSION.md` | Estado atual da sessão e próximos passos |
| `TODO.md` | Pendências priorizadas e dívidas técnicas |
| `DECISIONS.md` | Decisões técnicas e estratégicas |
| `HANDOFF.md` | Transferência para o próximo agente |
| `LOG.md` | Histórico cronológico append-only |
| `VALIDATION_CHECKLIST.md` | Testes, comandos e fluxos críticos |
| `RELATORIOS/` | Relatórios executivos datados |

## Princípio central

O repositório é a fonte da verdade. Se a memória contradisser o código, atualize a memória ou marque a divergência.
