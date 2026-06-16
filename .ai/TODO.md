# TODO — AIOS

## Bugs conhecidos

- [ ] [bug][risco] **npx dentro do próprio repo AIOS no Windows**: ao rodar `npx @alvaro-alencar/aios bootstrap` de dentro do diretório do repo AIOS, o npm pode resolver para o pacote LOCAL (pois `package.json` tem o mesmo nome `@alvaro-alencar/aios`). Além disso, `.ai/AIOS_AGENT_PROMPT.md` é sobrescrito com o prompt genérico de outros projetos (`prompts/init-project-memory.md`), o que confunde agentes de IA que entram no repo. O CLAUDE.md instalado dentro do repo também instrui agentes a rodar esse comando, criando um loop problemático. **Reprodução**: Windows, dentro de `C:\Users\...\AIOS\`, rodar `npx @alvaro-alencar/aios bootstrap`.

- [ ] [bug] **VALIDATION_CHECKLIST.md usa `/tmp/`** (path Unix-only). No Windows não existe `/tmp/`. Agentes e desenvolvedores Windows não conseguem seguir o checklist como está. Corrigir para `%TEMP%` ou `os.tmpdir()`.

## Urgente

- [ ] [pendência] Decidir se CLAUDE.md, AGENTS.md, `.cursor/` e `.github/` (gerados por `aios install all`) devem ser commitados no repo AIOS ou continuarem não rastreados.
- [ ] [pendência] Criar GitHub Release `v0.1.1` com changelog.

## Alta prioridade

- [ ] [pendência] Registrar e corrigir o bug do `npx` dentro do próprio repo no Windows (ver Bugs acima).
- [ ] [pendência] Corrigir `VALIDATION_CHECKLIST.md` — substituir `/tmp/aios-test` por equivalente multiplataforma.
- [ ] [pendência] Melhorar `aios audit` para detectar arquivos não rastreados no git que são relevantes para a memória AIOS.
- [ ] [pendência] Melhorar `aios audit` para detectar placeholders `[exige confirmação]` e arquivos com conteúdo genérico/template.

## Média prioridade

- [ ] [pendência] Criar exemplos reais em `examples/` (uso do AIOS em projeto externo).
- [ ] [pendência] Criar documentação de uso no Windows (caminhos, `npx`, `npm link`).
- [ ] [pendência] Publicar v0.1.2 após correções de bugs.
- [ ] [pendência] Criar issues de roadmap no GitHub para: adaptadores adicionais, validador semântico, exemplos reais.

## Baixa prioridade

- [ ] [pendência] Criar marca visual e landing page simples.
- [ ] [pendência] Corrigir `docs/cli-roadmap.md` — foi escrito sem acentos (inconsistente com padrão português brasileiro).
- [ ] [inferência] Separar funções do `bin/aios.js` em módulos quando o arquivo crescer (atualmente ~438 linhas, OK por enquanto).

## Riscos técnicos

- [ ] [risco] `aios init --force` pode sobrescrever memória customizada sem backup.
- [ ] [risco] Adaptadores gerados dentro do repo AIOS (CLAUDE.md etc.) não estão no `.files` do package.json, portanto não são publicados no npm — correto, mas pode confundir.

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
