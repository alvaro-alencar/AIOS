# TODO - AIOS

## Bugs conhecidos

- [x] [observado] ~~Bug `npx` dentro do próprio repo AIOS no Windows~~ **corrigido em 2026-06-17**: `writeAgentPrompt` agora respeita arquivo existente (não sobrescreve sem `--force`); `bootstrap` detecta self-repo via `isInsideSelfRepo()` e emite aviso guiando o usuário a usar `node bin/aios.js`. 25 testes passando.

- [ ] [bug] **Validação multiplataforma ainda precisa ser harmonizada**: `VALIDATION_CHECKLIST.md` já possui seção Windows com `$env:TEMP`, mas ainda mantém teste Linux/macOS com `/tmp/` e aviso de risco. Decidir se o checklist deve manter blocos separados ou adotar comando baseado em diretório temporário multiplataforma.

## Urgente

- [ ] [pendencia] Decidir se `.claude/` deve ser ignorado, versionado ou removido localmente.
- [x] [observado] `@alvaro-alencar/aios@0.1.3` publicada no npm — confirmado pelo usuário em 2026-06-17. Criar GitHub Release correspondente com changelog ainda pendente.

## Alta prioridade

- [x] [observado] Bug `npx` dentro do próprio repo no Windows corrigido em 2026-06-17: `writeAgentPrompt` preserva arquivo existente; `bootstrap` detecta self-repo e emite aviso claro.
- [x] [observado] `VALIDATION_CHECKLIST.md` harmonizado em 2026-06-17: blocos separados por plataforma mantidos, pendência do bug npx removida (corrigido em M3), risco npx convertido em nota de resolução.
- [ ] [pendencia] Melhorar `aios audit` para detectar arquivos não rastreados no git que são relevantes para a memória AIOS.
- [ ] [pendencia] Melhorar `aios audit` para detectar placeholders `[exige confirmacao]` e arquivos com conteúdo genérico/template.

## Média prioridade

- [x] [observado] Evoluído o modo PLAN para sugerir milestones verificáveis com objetivo, critério de sucesso, validações/comandos sugeridos, riscos, rollback e próximo passo.
- [ ] [pendencia] Criar exemplos reais em `examples/` (uso do AIOS em projeto externo).
- [ ] [pendencia] Criar documentação de uso no Windows (caminhos, `npx`, `npm link`).
- [ ] [pendencia] Criar GitHub Release para v0.1.3 com changelog.
- [ ] [pendencia] Criar issues de roadmap no GitHub para: adaptadores adicionais, validador semântico, exemplos reais.
- [ ] [pendencia] RFC futura: avaliar `aios doctor` como comando de diagnóstico de saúde AIOS.

## Baixa prioridade

- [ ] [pendencia] Criar marca visual e landing page simples.
- [ ] [pendencia] Corrigir `docs/cli-roadmap.md` - foi escrito sem acentos (inconsistente com padrão português brasileiro).
- [ ] [inferencia] Separar funções do `bin/aios.js` em módulos quando o arquivo crescer (atualmente ~438 linhas, OK por enquanto).

## Riscos técnicos

- [ ] [risco] `aios init --force` pode sobrescrever memória customizada sem backup.
- [ ] [risco] `.claude/` está não rastreado; pode conter configuração local de ferramenta e não deve ser tratado automaticamente como artefato de produto.

## Concluídos

- [x] [observado] Criada especificação AIOS v1.
- [x] [observado] Criada especificação AIOS Handshake v1.
- [x] [observado] Criado template padrão `.ai/`.
- [x] [observado] Criado prompt universal de inicialização.
- [x] [observado] Criado CLI com `init`, `audit`, `status`, `handoff`, `bootstrap`, `prompt`, `close`, `handshake`, `open` e `install`.
- [x] [observado] Criados testes automatizados (`test/cli.test.js`) cobrindo todos os comandos principais.
- [x] [observado] Criada memória `.ai/` do próprio AIOS.
- [x] [observado] Publicada v0.1.0 no npm.
- [x] [observado] Publicada v0.1.1 com instalador de adaptadores (`aios install`).
- [x] [observado] Adaptadores instalados no repo AIOS via `aios install all`.
- [x] [observado] `package.json` atualizado para v0.1.2.
- [x] [observado] Modos operacionais `aios observe`, `aios plan` e `aios act` implementados e cobertos por testes.
- [x] [observado] Adaptadores (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/aios.mdc`, `.github/copilot-instructions.md`) rastreados pelo Git.
- [x] [observado] `aios plan` passou a exigir milestones verificáveis no output/instrução.
