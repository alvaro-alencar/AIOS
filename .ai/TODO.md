# TODO - AIOS

## Bugs conhecidos

- [ ] [bug][risco] **npx dentro do próprio repo AIOS no Windows**: ao rodar `npx @alvaro-alencar/aios bootstrap` de dentro do diretório do repo AIOS, o npm pode resolver para o pacote LOCAL (pois `package.json` tem o mesmo nome `@alvaro-alencar/aios`). Além disso, `.ai/AIOS_AGENT_PROMPT.md` é sobrescrito com o prompt genérico de outros projetos (`prompts/init-project-memory.md`), o que confunde agentes de IA que entram no repo. O CLAUDE.md instalado dentro do repo também instrui agentes a rodar esse comando, criando um loop problemático. **Reprodução**: Windows, dentro de `C:\Users\...\AIOS\`, rodar `npx @alvaro-alencar/aios bootstrap`.

- [ ] [bug] **Validação multiplataforma ainda precisa ser harmonizada**: `VALIDATION_CHECKLIST.md` já possui seção Windows com `$env:TEMP`, mas ainda mantém teste Linux/macOS com `/tmp/` e aviso de risco. Decidir se o checklist deve manter blocos separados ou adotar comando baseado em diretório temporário multiplataforma.

## Urgente

- [ ] [pendencia] Decidir se `.claude/` deve ser ignorado, versionado ou removido localmente.
- [ ] [pendencia] Confirmar publicação npm de `@alvaro-alencar/aios@0.1.2` e criar GitHub Release correspondente com changelog.

## Alta prioridade

- [ ] [pendencia] Registrar e corrigir o bug do `npx` dentro do próprio repo no Windows (ver Bugs acima).
- [ ] [pendencia] Harmonizar `VALIDATION_CHECKLIST.md` sobre uso de `/tmp/` e `$env:TEMP`.
- [ ] [pendencia] Melhorar `aios audit` para detectar arquivos não rastreados no git que são relevantes para a memória AIOS.
- [ ] [pendencia] Melhorar `aios audit` para detectar placeholders `[exige confirmacao]` e arquivos com conteúdo genérico/template.

## Média prioridade

- [x] [observado] Evoluído o modo PLAN para sugerir milestones verificáveis com objetivo, critério de sucesso, validações/comandos sugeridos, riscos, rollback e próximo passo.
- [ ] [pendencia] Criar exemplos reais em `examples/` (uso do AIOS em projeto externo).
- [ ] [pendencia] Criar documentação de uso no Windows (caminhos, `npx`, `npm link`).
- [ ] [pendencia] Publicar v0.1.2 após correções de bugs, se ainda não tiver sido publicada.
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
