# AIOS Handshake v1

## Ideia central

O AIOS Handshake é uma instrução curta para ativar um agente dentro de um projeto compatível com AIOS.

A forma canônica é:

```txt
/aios
```

Quando um agente receber `/aios`, ele deve sincronizar projeto, memória e sessão.

Por segurança, `/aios` entra em **OBSERVE** por padrão.

## Modos operacionais

### OBSERVE

Modo padrão do handshake.

O agente deve ler, auditar, comparar e resumir. Não deve alterar código de produção, criar commits, fazer push ou implementar features.

O agente pode atualizar apenas a pasta `.ai/` quando isso for necessário para corrigir memória ausente, genérica, incompleta ou desatualizada.

### PLAN

Modo de planejamento.

O agente deve transformar a observação em plano priorizado, sem executar mudanças de código.

O plano deve ser organizado em milestones verificáveis. Cada milestone deve conter, no mínimo:

1. Objetivo.
2. Critério de sucesso.
3. Validações/comandos sugeridos.
4. Riscos.
5. Rollback ou caminho de reversão.
6. Próximo passo recomendado.

### ACT

Modo de ação.

O agente só deve executar uma tarefa concreta explicitamente autorizada pelo usuário.

Mesmo em ACT, commit e push exigem autorização separada.

## Comportamento esperado do agente

Ao receber `/aios`, o agente deve:

1. Entrar em modo OBSERVE.
2. Verificar se existe `.ai/` no projeto atual.
3. Se não existir, rodar `npx @alvaro-alencar/aios bootstrap`.
4. Se existir, ler `.ai/HANDOFF.md`.
5. Ler `.ai/SESSION.md`.
6. Ler `.ai/CONTEXT.md`.
7. Ler `.ai/TODO.md`.
8. Ler `.ai/DECISIONS.md`.
9. Rodar `git status`.
10. Rodar `git log --oneline -10`.
11. Comparar memória e estado real do repositório.
12. Se `.ai/AIOS_AGENT_PROMPT.md` existir, ler e executar as instruções respeitando o modo OBSERVE.
13. Responder com um resumo operacional curto.

## Regra de segurança

O agente não deve registrar segredos na memória AIOS.

Se encontrar token, senha, chave, certificado, conteúdo de `.env`, credencial ou dado sensível, deve registrar apenas o risco e o local aproximado, sem copiar o valor.

## Saída esperada

A resposta após `/aios` deve informar:

- se a memória AIOS existe;
- estado atual do Git;
- tarefa ou próximo passo recomendado;
- riscos imediatos;
- se a memória precisou ser criada ou atualizada;
- próximos comandos AIOS sugeridos.

## Rodapé operacional obrigatório

Ao final de toda resposta operacional, o agente deve sugerir próximos comandos AIOS úteis.

O usuário não deve precisar decorar a CLI.

Exemplo:

```txt
Próximos comandos AIOS sugeridos:
- aios observe
- aios plan
- aios act "descrever tarefa autorizada"
- aios close --summary "resumo" --next "próximo passo"
```

## Comando auxiliar

Enquanto ferramentas ainda não tiverem `/aios` nativo, o CLI deve fornecer:

```bash
npx @alvaro-alencar/aios handshake
```

Esse comando imprime a instrução completa que o humano pode colar no agente.

## Filosofia

`/aios` é o aperto de mão entre humano, projeto e agente.

Ele não é apenas um comando. Ele diz: entre neste projeto com memória, leia o passado, veja o presente e preserve o futuro.

Mas ele não deve transformar o agente em executor automático. Primeiro observa. Depois planeja. Só então age, se houver autorização humana explícita.
