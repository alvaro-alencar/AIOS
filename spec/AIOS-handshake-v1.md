# AIOS Handshake v1

## Ideia central

O AIOS Handshake e uma instrucao curta para ativar um agente dentro de um projeto compatível com AIOS.

A forma canonica e:

```txt
/aios
```

Quando um agente receber `/aios`, ele deve sincronizar projeto, memoria e sessao.

## Comportamento esperado do agente

Ao receber `/aios`, o agente deve:

1. Verificar se existe `.ai/` no projeto atual.
2. Se nao existir, rodar `npx @alvaro-alencar/aios bootstrap`.
3. Se existir, ler `.ai/HANDOFF.md`.
4. Ler `.ai/SESSION.md`.
5. Ler `.ai/CONTEXT.md`.
6. Ler `.ai/TODO.md`.
7. Ler `.ai/DECISIONS.md`.
8. Rodar `git status`.
9. Rodar `git log --oneline -10`.
10. Comparar memoria e estado real do repositorio.
11. Se `.ai/AIOS_AGENT_PROMPT.md` existir, ler e executar as instrucoes.
12. Responder com um resumo operacional curto.

## Regra de seguranca

O agente nao deve registrar segredos na memoria AIOS.

Se encontrar token, senha, chave, certificado, conteudo de `.env`, credencial ou dado sensivel, deve registrar apenas o risco e o local aproximado, sem copiar o valor.

## Saida esperada

A resposta apos `/aios` deve informar:

- se a memoria AIOS existe;
- estado atual do Git;
- tarefa ou proximo passo recomendado;
- riscos imediatos;
- se a memoria precisou ser criada ou atualizada.

## Comando auxiliar

Enquanto ferramentas ainda nao tiverem `/aios` nativo, o CLI deve fornecer:

```bash
npx @alvaro-alencar/aios handshake
```

Esse comando imprime a instrucao completa que o humano pode colar no agente.

## Filosofia

`/aios` e o aperto de mao entre humano, projeto e agente.

Ele nao e apenas um comando. Ele diz: entre neste projeto com memoria, leia o passado, veja o presente e preserve o futuro.
