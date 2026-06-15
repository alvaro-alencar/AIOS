# HANDOFF — AIOS

## Resumo executivo

[observado] AIOS é um protocolo agnóstico de memória operacional para projetos assistidos por agentes de IA. A implementação padrão é uma pasta `.ai/` versionada no repositório.

[observado] O projeto já possui README, especificação v1, template padrão, prompt universal e CLI inicial em Node.js.

## Estado atual

[observado] Primeira versão funcional criada no branch `main`.

## O que foi feito recentemente

- [observado] Criado `package.json` com binário `aios`.
- [observado] Criado `bin/aios.js` com comandos `init`, `audit`, `status` e `handoff`.
- [observado] Atualizado README com instalação e uso.
- [observado] Criada memória `.ai/` do próprio AIOS.

## O que fazer em seguida

1. [pendência] Clonar localmente e rodar `npm run check`.
2. [pendência] Rodar `npm run smoke`.
3. [pendência] Rodar `npm link`.
4. [pendência] Testar `aios init` em um projeto real.
5. [pendência] Ajustar bugs encontrados.
6. [pendência] Implementar `aios close`.

## Principais riscos

- [risco] Código ainda não foi executado localmente nesta sessão.
- [risco] Permissão executável do arquivo `bin/aios.js` pode precisar de ajuste local.
- [risco] Não há testes automatizados ainda.

## Arquivos principais

- `bin/aios.js`
- `package.json`
- `README.md`
- `spec/AIOS-v1.md`
- `templates/default/.ai/`
- `prompts/init-project-memory.md`

## Comandos úteis

```bash
npm run check
npm run smoke
npm link
aios --help
aios init
aios audit
aios status
aios handoff
```

## Decisões que não devem ser revertidas sem cuidado

- [decisão] AIOS é protocolo agnóstico, não apenas template de documentação.
- [decisão] A pasta `.ai/` é a implementação padrão.
- [decisão] CLI inicial sem dependências externas.

## Dúvidas humanas

- [exige confirmação] Publicar ou não no npm.
- [exige confirmação] Nome definitivo do pacote npm.
- [exige confirmação] Prioridade entre `aios close`, testes e adaptadores.

## Primeiros 15 minutos recomendados para o próximo agente

1. Ler `.ai/SESSION.md`.
2. Ler `bin/aios.js`.
3. Rodar `npm run check` localmente.
4. Rodar `npm run smoke`.
5. Testar `aios init` em diretório temporário.
6. Registrar resultados em `.ai/LOG.md`.
