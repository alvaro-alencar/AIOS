# Roadmap do CLI AIOS

Este documento descreve a futura interface de linha de comando do AIOS.

## Objetivo

Automatizar a criacao, auditoria e manutencao da memoria operacional `.ai/` em projetos locais.

## Comandos previstos

- `aios init`: cria a estrutura `.ai/` no projeto atual a partir de um template.
- `aios audit`: compara a memoria AIOS com o estado real do repositorio.
- `aios handoff`: gera ou atualiza o arquivo `.ai/HANDOFF.md`.
- `aios close`: encerra uma sessao e atualiza arquivos vivos.
- `aios status`: mostra resumo operacional do projeto.

## Prioridade

A primeira versao deve estabilizar protocolo e templates. Depois disso, o CLI pode nascer pequeno e crescer por comandos.
