# CONTEXT — AIOS

## Resumo executivo

[observado] AIOS é um protocolo agnóstico de memória operacional versionada para projetos assistidos por agentes de IA.

[observado] A implementação padrão do protocolo é uma pasta `.ai/` dentro do repositório do projeto.

## Problema resolvido

[observado] Projetos trabalhados por múltiplos agentes de IA perdem contexto entre sessões. AIOS cria uma memória persistente com contexto, decisões, pendências, riscos, validação e handoff.

## Stack técnica

[observado] Projeto Node.js ESM, sem dependências externas na versão inicial.

- Runtime: Node.js >= 18
- CLI: `bin/aios.js`
- Template: `templates/default/.ai/`
- Spec: `spec/AIOS-v1.md`
- Prompt: `prompts/init-project-memory.md`

## Arquitetura

```txt
README.md
package.json
bin/aios.js
spec/AIOS-v1.md
templates/default/.ai/
prompts/init-project-memory.md
docs/
.ai/
LICENSE
```

## Comandos

```bash
npm link
aios init
aios audit
aios status
aios handoff
npm run check
npm run smoke
```

## Fluxos críticos

- [observado] Inicializar `.ai/` em um projeto com `aios init`.
- [observado] Verificar conformidade estrutural com `aios audit`.
- [observado] Ler resumo operacional com `aios status`.
- [observado] Imprimir transferência para próximo agente com `aios handoff`.

## Padrões

- [observado] Código sem dependências externas para manter portabilidade.
- [observado] Documentação em português brasileiro.
- [observado] Memória separa fatos, inferências, riscos, decisões e pendências.

## Riscos estruturais

- [risco] O CLI ainda não possui testes automatizados reais.
- [risco] `aios audit` valida estrutura, mas ainda não faz auditoria semântica profunda.
- [risco] `aios init --force` pode sobrescrever arquivos existentes.

## Próximas expansões

- [pendência] Implementar `aios close`.
- [pendência] Criar testes automatizados.
- [pendência] Criar adaptadores para ferramentas de IA.
- [pendência] Criar validador semântico da memória.
