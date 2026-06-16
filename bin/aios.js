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
const command = args[0] ?? 'help';
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
    case 'handshake':
    case 'open':
      handshake();
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
    fail(`Template nao encontrado: ${templateDir}`);
  }

  if (fs.existsSync(targetDir) && !force) {
    fail('A pasta .ai ja existe. Use `aios init --force` para sobrescrever arquivos ausentes/atualizar template com cuidado.');
  }

  copyDirectory(templateDir, targetDir, { overwrite: force });

  if (withPrompt) {
    writeAgentPrompt(cwd);
  }

  console.log('AIOS inicializado em .ai/');
  console.log('Isso criou a estrutura da memoria. Para preencher com inteligencia contextual, use uma IA no projeto.');
  console.log('Proximo passo recomendado dentro do Codex/Claude/Cursor:');
  console.log('  /aios');
}

function bootstrap() {
  const cwd = process.cwd();
  const targetDir = path.join(cwd, '.ai');
  const force = flags.has('--force');

  if (!fs.existsSync(targetDir) || force) {
    copyDirectory(templateDir, targetDir, { overwrite: force });
  }

  const promptFile = writeAgentPrompt(cwd);
  console.log('AIOS bootstrap concluido.');
  console.log('- Estrutura .ai/ pronta.');
  console.log(`- Prompt para agente criado em: ${path.relative(cwd, promptFile)}`);
  console.log('');
  console.log('Agora peça ao agente de IA:');
  console.log('/aios');
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
    console.log('Arquivos preservados porque ja existiam:');
    for (const file of skipped) console.log(`- ${file}`);
    console.log('Use --force para sobrescrever.');
  }
}

function prompt() {
  if (!fs.existsSync(initPromptPath)) {
    fail(`Prompt nao encontrado: ${initPromptPath}`);
  }

  const content = fs.readFileSync(initPromptPath, 'utf8');
  console.log(content);
}

function handshake() {
  const cwd = process.cwd();
  const memoryDir = path.join(cwd, '.ai');
  const promptFile = path.join(memoryDir, 'AIOS_AGENT_PROMPT.md');

  const instruction = `AIOS HANDSHAKE\n\nVoce recebeu o comando /aios. Execute o protocolo AIOS neste projeto.\n\n1. Verifique se existe a pasta .ai/.\n2. Se .ai/ nao existir, rode: npx @alvaro-alencar/aios bootstrap\n3. Se .ai/AIOS_AGENT_PROMPT.md existir, leia esse arquivo e execute integralmente as instrucoes.\n4. Leia, nesta ordem: .ai/HANDOFF.md, .ai/SESSION.md, .ai/CONTEXT.md, .ai/TODO.md, .ai/DECISIONS.md e .ai/VALIDATION_CHECKLIST.md.\n5. Rode: git status\n6. Rode: git log --oneline -10\n7. Compare a memoria AIOS com o estado real do repositorio.\n8. Se a memoria estiver generica, incompleta ou desatualizada, audite o repositorio e atualize a pasta .ai/.\n9. Nao registre segredos, tokens, senhas, chaves, certificados, conteudo de .env, credenciais ou dados pessoais sensiveis.\n10. Ao final, responda com um resumo operacional curto: estado da memoria, estado do Git, riscos imediatos e proximo passo recomendado.\n\nSe precisar encerrar a sessao depois, use: npx @alvaro-alencar/aios close --summary \"resumo\" --next \"proximo passo\"`;

  console.log(instruction);

  if (!fs.existsSync(memoryDir)) {
    console.log('\nNota: .ai/ ainda nao existe neste diretorio. O agente deve rodar bootstrap.');
  } else if (!fs.existsSync(promptFile)) {
    console.log('\nNota: .ai/ existe, mas AIOS_AGENT_PROMPT.md nao existe. O agente pode rodar bootstrap ou usar a memoria existente.');
  }
}

function audit() {
  const cwd = process.cwd();
  const memoryDir = path.join(cwd, '.ai');
  const missing = getMissingFiles(memoryDir);
  const placeholders = fs.existsSync(memoryDir) ? findPlaceholders(memoryDir) : [];
  const git = getGitSnapshot();

  console.log('AIOS audit');
  console.log('');
  console.log(`Diretorio: ${cwd}`);
  console.log(`Memoria .ai: ${fs.existsSync(memoryDir) ? 'encontrada' : 'nao encontrada'}`);
  console.log('');

  if (missing.length === 0) {
    console.log('Estrutura: compativel com AIOS v1');
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
  console.log('Observacao: esta auditoria verifica estrutura, marcadores pendentes e estado Git. A consistencia semantica profunda ainda depende de revisao por agente/humano.');
}

function status() {
  const cwd = process.cwd();
  const memoryDir = path.join(cwd, '.ai');
  const git = getGitSnapshot();

  console.log('AIOS status');
  console.log('');
  console.log(`Projeto: ${path.basename(cwd)}`);
  console.log(`Memoria: ${fs.existsSync(memoryDir) ? '.ai/ encontrada' : '.ai/ nao encontrada'}`);

  if (fs.existsSync(memoryDir)) {
    const handoffPath = path.join(memoryDir, 'HANDOFF.md');
    const sessionPath = path.join(memoryDir, 'SESSION.md');
    console.log(`HANDOFF: ${fs.existsSync(handoffPath) ? 'ok' : 'ausente'}`);
    console.log(`SESSION: ${fs.existsSync(sessionPath) ? 'ok' : 'ausente'}`);
  }

  console.log('');
  printGitSnapshot(git);
}

function handoff() {
  const memoryDir = path.join(process.cwd(), '.ai');
  const handoffPath = path.join(memoryDir, 'HANDOFF.md');

  if (!fs.existsSync(handoffPath)) {
    fail('Nao encontrei .ai/HANDOFF.md. Rode `aios init` primeiro.');
  }

  const content = fs.readFileSync(handoffPath, 'utf8');
  const preview = content.split('\n').slice(0, 80).join('\n');
  console.log(preview);

  if (content.split('\n').length > 80) {
    console.log('\n...');
    console.log('Handoff truncado em 80 linhas. Abra .ai/HANDOFF.md para ver tudo.');
  }
}

function closeSession() {
  const cwd = process.cwd();
  const memoryDir = path.join(cwd, '.ai');
  const summary = getFlagValue('--summary') ?? 'Sessao encerrada via AIOS CLI.';
  const next = getFlagValue('--next') ?? 'Revisar .ai/HANDOFF.md e comparar memoria com o estado real do repositorio.';

  if (!fs.existsSync(memoryDir)) {
    fail('Nao encontrei .ai/. Rode `aios init` primeiro.');
  }

  const git = getGitSnapshot();
  const timestamp = new Date().toISOString();

  const sessionPath = path.join(memoryDir, 'SESSION.md');
  const handoffPath = path.join(memoryDir, 'HANDOFF.md');
  const logPath = path.join(memoryDir, 'LOG.md');

  ensureFile(sessionPath, '# SESSION — Estado Atual\n');
  ensureFile(handoffPath, '# HANDOFF — Transferencia para o Proximo Agente\n');
  ensureFile(logPath, '# LOG — Historico Cronologico\n');

  const sessionContent = `# SESSION — Estado Atual\n\n## Data/hora da ultima atualizacao\n\n[observado] ${timestamp}\n\n## Branch atual\n\n[observado] ${git.branch || '[desconhecida]'}\n\n## Estado do Git\n\n\`\`\`txt\n${git.status || 'limpo'}\n\`\`\`\n\n## Ultima atividade observada\n\n[observado] ${summary}\n\n## Proximos passos recomendados\n\n1. [pendencia] ${next}\n\n## Ultimos commits\n\n\`\`\`txt\n${git.log || '[sem commits]'}\n\`\`\`\n`;

  const handoffContent = `# HANDOFF — Transferencia para o Proximo Agente\n\n## Resumo executivo\n\n[observado] ${summary}\n\n## Estado atual\n\n[observado] Sessao encerrada em ${timestamp}.\n\n## Branch\n\n[observado] ${git.branch || '[desconhecida]'}\n\n## Estado do Git\n\n\`\`\`txt\n${git.status || 'limpo'}\n\`\`\`\n\n## Proximo passo recomendado\n\n1. [pendencia] ${next}\n\n## Primeiros minutos do proximo agente\n\n1. Ler este arquivo.\n2. Ler SESSION.md.\n3. Rodar git status.\n4. Rodar git log --oneline -10.\n5. Comparar memoria e repositorio antes de alterar codigo.\n`;

  const logEntry = `\n## ${timestamp} — Sessao encerrada via AIOS CLI\n\n### Resumo\n\n[observado] ${summary}\n\n### Branch\n\n[observado] ${git.branch || '[desconhecida]'}\n\n### Estado do Git\n\n\`\`\`txt\n${git.status || 'limpo'}\n\`\`\`\n\n### Proximo passo\n\n[pendencia] ${next}\n`;

  fs.writeFileSync(sessionPath, sessionContent, 'utf8');
  fs.writeFileSync(handoffPath, handoffContent, 'utf8');
  fs.appendFileSync(logPath, logEntry, 'utf8');

  console.log('Sessao AIOS encerrada.');
  console.log('Arquivos atualizados:');
  console.log('- .ai/SESSION.md');
  console.log('- .ai/HANDOFF.md');
  console.log('- .ai/LOG.md');
}

function help() {
  console.log(`AIOS - Agent Intelligence Operating System\n\nUso:\n  aios init [--force] [--with-prompt]         Cria a memoria .ai/ no projeto atual\n  aios bootstrap [--force]                    Cria .ai/ e .ai/AIOS_AGENT_PROMPT.md\n  aios install [all|codex|claude|cursor|copilot] [--force]\n                                                Instala arquivos de instrucao para ferramentas de IA\n  aios handshake                              Imprime o handshake universal /aios\n  aios open                                   Alias de handshake\n  aios prompt                                 Imprime o prompt para preencher a memoria com uma IA\n  aios audit                                  Verifica estrutura AIOS, marcadores e estado Git\n  aios status                                 Mostra resumo operacional do projeto\n  aios handoff                                Imprime o handoff atual\n  aios close --summary \"...\" --next \"...\"   Encerra sessao e atualiza memoria\n  aios --version                              Mostra versao\n  aios --help                                 Mostra ajuda\n\nFluxo recomendado para deixar um projeto pronto para agentes:\n  npx @alvaro-alencar/aios install all\n\nDepois abra Codex, Claude Code, Cursor ou Copilot no projeto.\n\nAo encerrar:\n  aios close --summary \"o que foi feito\" --next \"proximo passo\"`);
}

function version() {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  console.log(pkg.version);
}

function getAdapterFiles() {
  const shared = `# AIOS Agent Instructions\n\nThis project uses AIOS, an operational memory protocol for AI-assisted projects.\n\nWhen starting work in this repository:\n\n1. Check whether .ai/ exists.\n2. If .ai/ does not exist, run: npx @alvaro-alencar/aios bootstrap\n3. If .ai/AIOS_AGENT_PROMPT.md exists, read it and execute its instructions.\n4. Read .ai/HANDOFF.md, .ai/SESSION.md, .ai/CONTEXT.md, .ai/TODO.md, .ai/DECISIONS.md and .ai/VALIDATION_CHECKLIST.md.\n5. Run git status and git log --oneline -10.\n6. Compare the AIOS memory with the real repository state.\n7. Keep facts, inferences, risks, decisions and pending tasks clearly separated.\n8. Never write secrets, tokens, passwords, API keys, certificates, .env contents, credentials or sensitive personal data into AIOS memory.\n9. Before ending a meaningful session, update the AIOS memory or run: npx @alvaro-alencar/aios close --summary \"summary\" --next \"next step\"\n\nIf the user types /aios, execute the AIOS handshake for this project.\n`;

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
    fail(`Prompt nao encontrado: ${initPromptPath}`);
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
    console.log('Git: nao parece ser um repositorio Git');
    return;
  }

  console.log(`Branch: ${git.branch || '[desconhecida]'}`);
  console.log('Status:');
  console.log(git.status || 'limpo');
  console.log('');
  console.log('Ultimos commits:');
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
