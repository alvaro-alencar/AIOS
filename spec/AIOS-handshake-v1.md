# AIOS Handshake v1

## Ideia central

O AIOS Handshake é uma instrução curta para ativar um agente dentro de um projeto compatível com AIOS.

A forma canônica é:

```txt
/aios
```

Quando um agente receber `/aios`, ele deve sincronizar projeto, memória e sessão.

## Comportamento esperado do agente

Ao receber `/aios`, o agente deve:

1. Verificar se existe `.ai/` no projeto atual.
2. Se não existir, rodar `npx @alvaro-alencar/aios bootstrap`.
3. Se existir, ler `.ai/HANDOFF.md`.
4. Ler `.ai/SESSION.md`.
5. Ler `.ai/CONTEXT.md`.
6. Ler `.ai/TODO.md`.
7. Ler `.ai/DECISIONS.md`.
8. Rodar `git status`.
9. Rodar `git log --oneline -10`.
10. Comparar memória e estado real do repositório.
11. Se `.ai/AIOS_AGENT_PROMPT.md` existir, ler e executar as instruções.
12. Responder com um resumo operacional curto.

## Regra de segurança

O agente não deve registrar segredos na memória AIOS.

Se encontrar token, senha, chave, certificado, conteúdo de `.env`, credencial ou dado sensível, deve registrar apenas o risco e o local aproximado, sem copiar o valor.

## Saída esperada

A resposta após `/aios` deve informar:

- se a memória AIOS existe;
- estado atual do Git;
- tarefa ou próximo passo recomendado;
- riscos imediatos;
- se a memória precisou ser criada ou atualizada.

## Comando auxiliar

Enquanto ferramentas ainda não tiverem `/aios` nativo, o CLI deve fornecer:

```bash
npx @alvaro-alencar/aios handshake
```

Esse comando imprime a instrução completa que o humano pode colar no agente.

## Filosofia

`/aios` é o aperto de mão entre humano, projeto e agente.

Ele não é apenas um comando. Ele diz: entre neste projeto com memória, leia o passado, veja o presente e preserve o futuro.
