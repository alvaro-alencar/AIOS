#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templateDir = path.join(rootDir, 'templates', 'default', '.ai');
const initPromptPath = path.join(rootDir, 'prompts', 'init-project-memory.md');

const REQUIRED_FILES = [
  'README.md',
  'CONTEXT.md',
  'SESSION.md',
  'TODO.md',
  'DECISIONS.md',
  'HANDOFF.md',
  'LOG.md',
  'VALIDATION_CHECKLIST.md',
  path.join('RELATORIOS', '.gitkeep')
];

const args = process.argv.slice(2);
const command = args[0] ?? 'install';
const flags = new Set(args.slice(1));

function main() {
  switch (command) {
    case 'init':
      init();
      break;
    case 'install':
      installAdapters();
      break;
    case 'audit':
      audit();
      break;
    case 'status':
      status();
      break;
    case 'handoff':
      handoff();
      break;
    case 'close':
      closeSession();
      break;
    case 'prompt':
      prompt();
      break;
    case 'bootstrap':
      bootstrap();
      break;
    case 'observe':
      operationalMode('observe');
      break;
    case 'plan':
      operationalMode('plan');
      break;
    case 'act':
      operationalMode('act');
      break;
    case 'handshake':
    case 'open':
      handshake('observe');
      break;
    case 'help':
    case '--help':
    case '-h':
      help();
      break;
    case '--version':
    case '-v':
      version();
      break;
    default:
      fail(`Comando desconhecido: ${command}\n\nUse: aios --help`);
  }
}

function init() {
  const cwd = process.cwd();
  const targetDir = path.join(cwd, '.ai');
  const force = flags.has('--force');
  const withPrompt = flags.has('--with-prompt');

  if (!fs.existsSync(templateDir)) {
    fail(`Template não encontrado: ${templateDir}`);
  }

  if (fs.existsSync(targetDir) && !force) {
    fail('A pasta .ai já existe. Use `aios init --force` para sobrescrever arquivos ausentes/atualizar template com cuidado.');
  }

  copyDirectory(templateDir, targetDir, { overwrite: force });

  if (withPrompt) {
    writeAgentPrompt(cwd);
  }

  console.log('AIOS inicializado em .ai/');
  console.log('Isso criou a estrutura da memória. Para preencher com inteligência contextual, use uma IA no projeto.');
  printSuggestedCommands(['aios observe', 'aios plan', 'aios close --summary "sessão inicializada" --next "preencher memória"']);
}

function bootstrap() {
  const cwd = process.cwd();
  const targetDir = path.join(cwd, '.ai');
  const force = flags.has('--force');

  if (!fs.existsSync(targetDir) || force) {
    copyDirectory(templateDir, targetDir, { overwrite: force });
  }

  const promptFile = writeAgentPrompt(cwd);
  console.log('AIOS bootstrap concluído.');
  console.log('- Estrutura .ai/ pronta.');
  console.log(`- Prompt para agente criado em: ${path.relative(cwd, promptFile)}`);
  printSuggestedCommands(['/aios', 'aios observe', 'aios plan']);
}

function installAdapters() {
  const cwd = process.cwd();
  const force = flags.has('--force');
  const rawTarget = args[1] && !args[1].startsWith('--') ? args[1] : 'all';
  const target = rawTarget.toLowerCase();

  const validTargets = ['all', 'codex', 'claude', 'cursor', 'copilot'];
  if (!validTargets.includes(target)) {
    fail(`Adaptador desconhecido: ${rawTarget}\nUse: aios install all|codex|claude|cursor|copilot`);
  }

  if (!fs.existsSync(path.join(cwd, '.ai'))) {
    copyDirectory(templateDir, path.join(cwd, '.ai'), { overwrite: false });
  }
  writeAgentPrompt(cwd);

  const adapters = getAdapterFiles();
  const selected = target === 'all'
    ? Object.entries(adapters)
    : Object.entries(adapters).filter(([name]) => name === target);

  const written = [];
  const skipped = [];

  for (const [, files] of selected) {
    for (const file of files) {
      const absolutePath = path.join(cwd, file.path);
      if (fs.existsSync(absolutePath) && !force) {
        skipped.push(file.path);
        continue;
      }
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      fs.writeFileSync(absolutePath, file.content, 'utf8');
      written.push(file.path);
    }
  }

  console.log('AIOS adapters instalados.');
  if (written.length > 0) {
    console.log('Arquivos criados/atualizados:');
    for (const file of written) console.log(`- ${file}`);
  }
  if (skipped.length > 0) {
    console.log('Arquivos preservados porque já existiam:');
    for (const file of skipped) console.log(`- ${file}`);
    console.log('Use --force para sobrescrever.');
  }
  printSuggestedCommands(['aios observe', 'aios plan', 'aios act "tarefa autorizada"', 'aios close --summary "..." --next "..."']);
}

function prompt() {
  if (!fs.existsSync(initPromptPath)) {
    fail(`Prompt não encontrado: ${initPromptPath}`);
  }

  const content = fs.readFileSync(initPromptPath, 'utf8');
  console.log(content);
}

function operationalMode(mode) {
  console.log(getOperationalInstruction(mode));
}

function handshake(mode = 'observe') {
  const cwd = process.cwd();
  const memoryDir = path.join(cwd, '.ai');
  const promptFile = path.join(memoryDir, 'AIOS_AGENT_PROMPT.md');

  console.log(getOperationalInstruction(mode));

  if (!fs.existsSync(memoryDir)) {
    console.log('\nNota: .ai/ ainda não existe neste diretório. O agente deve rodar bootstrap antes de observar.');
  } else if (!fs.existsSync(promptFile)) {
    console.log('\nNota: .ai/ existe, mas AIOS_AGENT_PROMPT.md não existe. O agente pode usar a memória existente ou rodar bootstrap com cuidado.');
  }
}

function getOperationalInstruction(mode) {
  const normalized = mode.toLowerCase();
  const header = `AIOS ${normalized.toUpperCase()} MODE`;
  const base = `Você está operando em um projeto compatível com AIOS.\n\nRegras globais:\n\n1. O repositório é a fonte da verdade.\n2. Leia a memória AIOS antes de agir: .ai/HANDOFF.md, .ai/SESSION.md, .ai/CONTEXT.md, .ai/TODO.md, .ai/DECISIONS.md e .ai/VALIDATION_CHECKLIST.md.\n3. Rode git status e git log --oneline -10 antes de qualquer conclusão operacional.\n4. Nunca registre segredos, tokens, senhas, chaves, certificados, conteúdo de .env, credenciais ou dados pessoais sensíveis.\n5. Separe claramente [observado], [inferência], [risco], [pendência], [decisão] e [exige confirmação].\n6. Ao final de cada resposta, sugira os próximos comandos AIOS úteis para o usuário. O usuário não deve precisar decorar comandos.\n`;

  if (normalized === 'observe') {
    return `${header}\n\n/aios entra em OBSERVE por padrão.\n\n${base}\nModo OBSERVE:\n\n- Leia, audite, compare e resuma.\n- Não altere código de produção.\n- Não crie commits.\n- Não faça push.\n- Não implemente features.\n- Pode atualizar apenas a pasta .ai/ quando isso for necessário para corrigir a memória operacional.\n- Se encontrar problemas, registre riscos e proponha próximos passos.\n\nSaída esperada:\n\n1. Estado da memória AIOS.\n2. Estado do Git.\n3. Divergências entre memória e repositório.\n4. Riscos imediatos.\n5. Próximo passo recomendado.\n6. Próximos comandos AIOS sugeridos.\n\nPróximos comandos AIOS sugeridos:\n- aios plan\n- aios act \"descrever tarefa autorizada\"\n- aios close --summary \"resumo\" --next \"próximo passo\"`;
  }

  if (normalized === 'plan') {
    return `${header}\n\n${base}\nModo PLAN:\n\n- Transforme observações em plano de ação priorizado.\n- Não altere código de produção.\n- Não crie commits.\n- Não faça push.\n- Pode atualizar apenas .ai/ se a memória estiver incorreta ou incompleta.\n- Classifique ações por impacto, risco e ordem recomendada.\n- Explique o que exigiria confirmação humana antes de executar.\n\nSaída esperada:\n\n1. Plano recomendado.\n2. Justificativa curta.\n3. Riscos e dependências.\n4. O que pode ser feito em modo ACT.\n5. Próximos comandos AIOS sugeridos.\n\nPróximos comandos AIOS sugeridos:\n- aios act \"executar o primeiro item do plano\"\n- aios observe\n- aios close --summary \"plano criado\" --next \"executar item 1\"`;
  }

  if (normalized === 'act') {
    const task = args.slice(1).join(' ').trim();
    return `${header}\n\n${base}\nModo ACT:\n\n- Execute somente a tarefa explicitamente autorizada pelo usuário.\n- Antes de alterar código, declare o escopo pretendido.\n- Faça mudanças pequenas, rastreáveis e reversíveis.\n- Rode validações relevantes.\n- Atualize .ai/ com fatos, riscos, decisões e pendências.\n- Não faça commit nem push sem autorização explícita separada.\n\nTarefa autorizada recebida:\n\n${task || '[exige confirmação] Nenhuma tarefa específica foi informada. Peça autorização antes de agir.'}\n\nSaída esperada:\n\n1. Escopo executado.\n2. Arquivos alterados.\n3. Validações rodadas.\n4. Riscos remanescentes.\n5. Próximos comandos AIOS sugeridos.\n\nPróximos comandos AIOS sugeridos:\n- aios observe\n- aios close --summary \"mudança executada\" --next \"validar/commitar\"`;
  }

  fail(`Modo desconhecido: ${mode}`);
}

function audit() {
  const cwd = process.cwd();
  const memoryDir = path.join(cwd, '.ai');
  const missing = getMissingFiles(memoryDir);
  const placeholders = fs.existsSync(memoryDir) ? findPlaceholders(memoryDir) : [];
  const git = getGitSnapshot();

  console.log('AIOS audit');
  console.log('');
  console.log(`Diretório: ${cwd}`);
  console.log(`Memória .ai: ${fs.existsSync(memoryDir) ? 'encontrada' : 'não encontrada'}`);
  console.log('');

  if (missing.length === 0) {
    console.log('Estrutura: compatível com AIOS v1');
  } else {
    console.log('Estrutura: incompleta');
    for (const file of missing) console.log(`- ausente: .ai/${file}`);
  }

  if (placeholders.length > 0) {
    console.log('');
    console.log('Marcadores que ainda exigem preenchimento:');
    for (const item of placeholders.slice(0, 20)) console.log(`- ${item}`);
    if (placeholders.length > 20) console.log(`- ... mais ${placeholders.length - 20}`);
  }

  console.log('');
  printGitSnapshot(git);
  console.log('');
  console.log('Observação: esta auditoria verifica estrutura, marcadores pendentes e estado Git. A consistência semântica profunda ainda depende de revisão por agente/humano.');
  printSuggestedCommands(['aios observe', 'aios plan', 'aios close --summary "auditoria feita" --next "decidir próximo passo"']);
}

function status() {
  const cwd = process.cwd();
  const memoryDir = path.join(cwd, '.ai');
  const git = getGitSnapshot();

  console.log('AIOS status');
  console.log('');
  console.log(`Projeto: ${path.basename(cwd)}`);
  console.log(`Memória: ${fs.existsSync(memoryDir) ? '.ai/ encontrada' : '.ai/ não encontrada'}`);

  if (fs.existsSync(memoryDir)) {
    const handoffPath = path.join(memoryDir, 'HANDOFF.md');
    const sessionPath = path.join(memoryDir, 'SESSION.md');
    console.log(`HANDOFF: ${fs.existsSync(handoffPath) ? 'ok' : 'ausente'}`);
    console.log(`SESSION: ${fs.existsSync(sessionPath) ? 'ok' : 'ausente'}`);
  }

  console.log('');
  printGitSnapshot(git);
  printSuggestedCommands(['aios observe', 'aios handoff', 'aios close --summary "status revisado" --next "..."']);
}

function handoff() {
  const memoryDir = path.join(process.cwd(), '.ai');
  const handoffPath = path.join(memoryDir, 'HANDOFF.md');

  if (!fs.existsSync(handoffPath)) {
    fail('Não encontrei .ai/HANDOFF.md. Rode `aios init` primeiro.');
  }

  const content = fs.readFileSync(handoffPath, 'utf8');
  const preview = content.split('\n').slice(0, 80).join('\n');
  console.log(preview);

  if (content.split('\n').length > 80) {
    console.log('\n...');
    console.log('Handoff truncado em 80 linhas. Abra .ai/HANDOFF.md para ver tudo.');
  }
  printSuggestedCommands(['aios observe', 'aios plan', 'aios close --summary "handoff revisado" --next "..."']);
}

function closeSession() {
  const cwd = process.cwd();
  const memoryDir = path.join(cwd, '.ai');
  const summary = getFlagValue('--summary') ?? 'Sessão encerrada via AIOS CLI.';
  const next = getFlagValue('--next') ?? 'Revisar .ai/HANDOFF.md e comparar memória com o estado real do repositório.';

  if (!fs.existsSync(memoryDir)) {
    fail('Não encontrei .ai/. Rode `aios init` primeiro.');
  }

  const git = getGitSnapshot();
  const timestamp = new Date().toISOString();

  const sessionPath = path.join(memoryDir, 'SESSION.md');
  const handoffPath = path.join(memoryDir, 'HANDOFF.md');
  const logPath = path.join(memoryDir, 'LOG.md');

  ensureFile(sessionPath, '# SESSION — Estado Atual\n');
  ensureFile(handoffPath, '# HANDOFF — Transferência para o Próximo Agente\n');
  ensureFile(logPath, '# LOG — Histórico Cronológico\n');

  const sessionContent = `# SESSION — Estado Atual\n\n## Data/hora da última atualização\n\n[observado] ${timestamp}\n\n## Branch atual\n\n[observado] ${git.branch || '[desconhecida]'}\n\n## Estado do Git\n\n\`\`\`txt\n${git.status || 'limpo'}\n\`\`\`\n\n## Última atividade observada\n\n[observado] ${summary}\n\n## Próximos passos recomendados\n\n1. [pendência] ${next}\n\n## Últimos commits\n\n\`\`\`txt\n${git.log || '[sem commits]'}\n\`\`\`\n`;

  const handoffContent = `# HANDOFF — Transferência para o Próximo Agente\n\n## Resumo executivo\n\n[observado] ${summary}\n\n## Estado atual\n\n[observado] Sessão encerrada em ${timestamp}.\n\n## Branch\n\n[observado] ${git.branch || '[desconhecida]'}\n\n## Estado do Git\n\n\`\`\`txt\n${git.status || 'limpo'}\n\`\`\`\n\n## Próximo passo recomendado\n\n1. [pendência] ${next}\n\n## Primeiros minutos do próximo agente\n\n1. Ler este arquivo.\n2. Ler SESSION.md.\n3. Rodar git status.\n4. Rodar git log --oneline -10.\n5. Comparar memória e repositório antes de alterar código.\n`;

  const logEntry = `\n## ${timestamp} — Sessão encerrada via AIOS CLI\n\n### Resumo\n\n[observado] ${summary}\n\n### Branch\n\n[observado] ${git.branch || '[desconhecida]'}\n\n### Estado do Git\n\n\`\`\`txt\n${git.status || 'limpo'}\n\`\`\`\n\n### Próximo passo\n\n[pendência] ${next}\n`;

  fs.writeFileSync(sessionPath, sessionContent, 'utf8');
  fs.writeFileSync(handoffPath, handoffContent, 'utf8');
  fs.appendFileSync(logPath, logEntry, 'utf8');

  console.log('Sessão AIOS encerrada.');
  console.log('Arquivos atualizados:');
  console.log('- .ai/SESSION.md');
  console.log('- .ai/HANDOFF.md');
  console.log('- .ai/LOG.md');
  printSuggestedCommands(['aios observe', 'aios handoff']);
}

function help() {
  console.log(`AIOS - Agent Intelligence Operating System\n\nUso:\n  aios init [--force] [--with-prompt]         Cria a memória .ai/ no projeto atual\n  aios bootstrap [--force]                    Cria .ai/ e .ai/AIOS_AGENT_PROMPT.md\n  aios install [all|codex|claude|cursor|copilot] [--force]\n                                              Instala arquivos de instrução para ferramentas de IA\n  aios observe                                Modo seguro padrão: audita e orienta sem alterar código\n  aios plan                                   Gera plano priorizado sem executar\n  aios act \"tarefa autorizada\"              Executa somente ação explicitamente autorizada\n  aios handshake                              Imprime o handshake universal /aios em modo observe\n  aios open                                   Alias de handshake\n  aios prompt                                 Imprime o prompt para preencher a memória com uma IA\n  aios audit                                  Verifica estrutura AIOS, marcadores e estado Git\n  aios status                                 Mostra resumo operacional do projeto\n  aios handoff                                Imprime o handoff atual\n  aios close --summary \"...\" --next \"...\"   Encerra sessão e atualiza memória\n  aios --version                              Mostra versão\n  aios --help                                 Mostra ajuda\n\nFluxo recomendado:\n  npx @alvaro-alencar/aios install all\n  aios observe\n  aios plan\n  aios act \"tarefa autorizada\"\n  aios close --summary \"o que foi feito\" --next \"próximo passo\"\n\nRegra de segurança:\n  /aios entra em OBSERVE por padrão. O agente não deve alterar código, commitar ou fazer push sem autorização explícita.`);
}

function version() {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  console.log(pkg.version);
}

function getAdapterFiles() {
  const shared = `# AIOS Agent Instructions\n\nThis project uses AIOS, an operational memory protocol for AI-assisted projects.\n\n## Default behavior\n\nWhen the user types /aios, enter AIOS OBSERVE mode by default.\n\nOBSERVE means: read, audit, compare and summarize. Do not alter production code. Do not commit. Do not push. Do not implement features. You may update only .ai/ when the operational memory is missing, stale or incorrect.\n\nUse PLAN mode when the user asks for a plan. PLAN means: propose prioritized actions without executing them.\n\nUse ACT mode only when the user explicitly authorizes a concrete task. ACT means: execute the authorized task, validate it, update .ai/, but do not commit or push unless the user explicitly authorizes that too.\n\n## Startup protocol\n\n1. Check whether .ai/ exists.\n2. If .ai/ does not exist, run: npx @alvaro-alencar/aios bootstrap\n3. If .ai/AIOS_AGENT_PROMPT.md exists, read it and execute its instructions, respecting OBSERVE/PLAN/ACT mode.\n4. Read .ai/HANDOFF.md, .ai/SESSION.md, .ai/CONTEXT.md, .ai/TODO.md, .ai/DECISIONS.md and .ai/VALIDATION_CHECKLIST.md.\n5. Run git status and git log --oneline -10.\n6. Compare the AIOS memory with the real repository state.\n7. Keep facts, inferences, risks, decisions and pending tasks clearly separated.\n8. Never write secrets, tokens, passwords, API keys, certificates, .env contents, credentials or sensitive personal data into AIOS memory.\n\n## Response footer\n\nAt the end of every operational response, suggest the next useful AIOS commands. The user should not need to memorize commands. Example:\n\nNext AIOS commands:\n- aios observe\n- aios plan\n- aios act \"describe authorized task\"\n- aios close --summary \"summary\" --next \"next step\"\n\nBefore ending a meaningful session, update the AIOS memory or run: npx @alvaro-alencar/aios close --summary \"summary\" --next \"next step\"\n`;

  return {
    codex: [
      { path: 'AGENTS.md', content: shared }
    ],
    claude: [
      { path: 'CLAUDE.md', content: shared }
    ],
    cursor: [
      { path: path.join('.cursor', 'rules', 'aios.mdc'), content: `---\nalwaysApply: true\n---\n\n${shared}` }
    ],
    copilot: [
      { path: path.join('.github', 'copilot-instructions.md'), content: shared }
    ]
  };
}

function printSuggestedCommands(commands) {
  console.log('');
  console.log('Próximos comandos AIOS sugeridos:');
  for (const command of commands) console.log(`- ${command}`);
}

function copyDirectory(source, target, options = {}) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath, options);
      continue;
    }

    if (fs.existsSync(targetPath) && !options.overwrite) {
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

function writeAgentPrompt(cwd) {
  if (!fs.existsSync(initPromptPath)) {
    fail(`Prompt não encontrado: ${initPromptPath}`);
  }
  const memoryDir = path.join(cwd, '.ai');
  fs.mkdirSync(memoryDir, { recursive: true });
  const promptFile = path.join(memoryDir, 'AIOS_AGENT_PROMPT.md');
  fs.copyFileSync(initPromptPath, promptFile);
  return promptFile;
}

function getMissingFiles(memoryDir) {
  if (!fs.existsSync(memoryDir)) return REQUIRED_FILES;
  return REQUIRED_FILES.filter((file) => !fs.existsSync(path.join(memoryDir, file)));
}

function findPlaceholders(memoryDir) {
  const results = [];
  for (const file of REQUIRED_FILES) {
    if (!file.endsWith('.md')) continue;
    const filePath = path.join(memoryDir, file);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (line.includes('[exige confirmação]') || line.includes('[exige confirmacao]')) {
        results.push(`.ai/${file}:${index + 1}`);
      }
    });
  }
  return results;
}

function getGitSnapshot() {
  return {
    isRepo: runGit('rev-parse --is-inside-work-tree') === 'true',
    branch: runGit('branch --show-current'),
    status: runGit('status --short'),
    log: runGit('log --oneline -10')
  };
}

function printGitSnapshot(git) {
  if (!git.isRepo) {
    console.log('Git: não parece ser um repositório Git');
    return;
  }

  console.log(`Branch: ${git.branch || '[desconhecida]'}`);
  console.log('Status:');
  console.log(git.status || 'limpo');
  console.log('');
  console.log('Últimos commits:');
  console.log(git.log || '[sem commits]');
}

function runGit(command) {
  try {
    return execSync(`git ${command}`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
}

function getFlagValue(name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) return null;
  return value;
}

function ensureFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, fallback, 'utf8');
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main();
