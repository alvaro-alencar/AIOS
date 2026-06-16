# Roadmap do CLI AIOS

Este documento descreve a futura interface de linha de comando do AIOS.

## Objetivo

Automatizar a criacao, auditoria e manutencao da memoria operacional `.ai/` em projetos locais.

## Comandos implementados

- `aios init`: cria a estrutura `.ai/` no projeto atual a partir de um template.
- `aios bootstrap`: cria `.ai/` e `.ai/AIOS_AGENT_PROMPT.md`.
- `aios install`: instala adaptadores para ferramentas de IA.
- `aios observe`: orienta auditoria segura sem alterar codigo.
- `aios plan`: gera plano priorizado em milestones verificaveis, sem executar.
- `aios act`: executa apenas tarefa autorizada.
- `aios audit`: verifica estrutura AIOS, marcadores e estado Git.
- `aios handoff`: imprime o arquivo `.ai/HANDOFF.md`.
- `aios close`: encerra uma sessao e atualiza arquivos vivos.
- `aios status`: mostra resumo operacional do projeto.
- `aios handshake` / `aios open`: imprime o handshake universal em modo observe.

## RFC futura: `aios doctor`

`aios doctor` pode se tornar um comando de diagnostico de saude do AIOS.

Possiveis verificacoes:

- memoria `.ai/` e arquivos obrigatorios;
- estado Git e arquivos untracked relevantes;
- adaptadores instalados;
- versao local versus versao npm;
- RFCs abertas;
- riscos conhecidos;
- consistencia do protocolo.

## Prioridade

A prioridade e manter o CLI pequeno. Novos comandos devem nascer apenas quando reduzirem trabalho real sem transformar o AIOS em um sistema complexo.
