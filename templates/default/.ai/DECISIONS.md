# DECISIONS — Registro de Decisões

> Este arquivo impede que agentes futuros desfaçam decisões importantes por ignorância.

## Formato

```md
## YYYY-MM-DD — Título da decisão

**Status:** proposta | aceita | substituída | obsoleta  
**Tipo:** arquitetura | produto | segurança | infraestrutura | processo | UX | dados

### Decisão
...

### Justificativa
...

### Alternativas consideradas
...

### Impacto
...

### Riscos
...

### Revisar quando
...
```

---

## YYYY-MM-DD — Adoção do AIOS como memória operacional

**Status:** aceita  
**Tipo:** processo

### Decisão

[decisão] Este projeto passa a usar a pasta `.ai/` como memória operacional versionada seguindo o protocolo AIOS.

### Justificativa

Permitir continuidade entre sessões de trabalho, agentes de IA e desenvolvedores humanos, reduzindo perda de contexto e risco de decisões contraditórias.

### Alternativas consideradas

- Manter apenas README e documentação tradicional.
- Usar somente issues/commits.
- Depender do histórico de conversas com agentes.

### Impacto

Agentes futuros devem ler `.ai/` antes de modificar o projeto e atualizá-la ao final de sessões relevantes.

### Riscos

[risco] A memória pode ficar desatualizada se agentes não seguirem o protocolo.

### Revisar quando

Quando o projeto mudar significativamente de arquitetura, processo ou ferramenta de IA.
