# Visao do AIOS

AIOS parte de uma tese simples:

Todo projeto trabalhado por agentes de IA precisa de uma memoria operacional propria.

Git registra versoes do codigo. CI registra execucao. Issues registram intencao parcial. Documentacao registra conhecimento estavel. Mas agentes de IA precisam de uma camada adicional: contexto vivo, acionavel e versionado.

## A lacuna

Quando um agente entra em um projeto sem memoria operacional, ele tende a repetir auditorias, ignorar decisoes anteriores, perder o motivo de certas escolhas, misturar inferencia com fato e deixar o proximo agente novamente no escuro.

AIOS cria um ponto de partida comum.

## O que AIOS quer ser

AIOS quer ser para agentes de IA o que README.md, .gitignore e Dockerfile se tornaram para projetos modernos: uma convencao simples, legivel e esperada.

Nao e dependente de fornecedor. Nao exige uma ferramenta especifica. Pode ser lido por qualquer modelo, editor, CLI ou humano.

## Camadas futuras

### Protocolo

Especificacao dos arquivos, regras, marcadores e ciclo de vida.

### Template

Estrutura .ai pronta para ser copiada para qualquer projeto.

### CLI

Comandos previstos:

```bash
aios init
aios audit
aios handoff
aios close
aios status
```

### Adaptadores

Exportacao da memoria para formatos de ferramentas especificas:

```bash
aios export claude
aios export cursor
aios export copilot
aios export codex
aios export chatgpt
```

### Validacao

Verificador automatico de conformidade AIOS:

- estrutura obrigatoria presente;
- arquivos minimos preenchidos;
- divergencias com Git;
- pendencias sem contexto;
- handoff desatualizado.

## Filosofia

AIOS deve permanecer simples, legivel, versionavel, agnostico, seguro, facil de adotar e util para humanos e agentes.

A primeira vitoria nao e automacao perfeita. E criar continuidade.
