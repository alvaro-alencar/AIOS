#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templateDir = path.join(rootDir, 'templates', 'default', '.ai');

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

  if (!fs.existsSync(templateDir)) {
    fail(`Template nao encontrado: ${templateDir}`);
  }

  if (fs.existsSync(targetDir) && !force) {
    fail('A pasta .ai ja existe. Use `aios init --force` para sobrescrever arquivos ausentes/atualizar template com cuidado.');
  }

  copyDirectory(templateDir, targetDir, { overwrite: force });

  console.log('AIOS inicializado em .ai/');
  console.log('Proximo passo: peca a um agente para auditar o repositorio e preencher os arquivos com fatos reais.');
  console.log('Sugestao: leia prompts/init-project-memory.md no repo AIOS.');
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
  console.log(`AIOS - Agent Intelligence Operating System\n\nUso:\n  aios init [--force]                         Cria a memoria .ai/ no projeto atual\n  aios audit                                  Verifica estrutura AIOS, marcadores e estado Git\n  aios status                                 Mostra resumo operacional do projeto\n  aios handoff                                Imprime o handoff atual\n  aios close --summary \"...\" --next \"...\"   Encerra sessao e atualiza memoria\n  aios --version                              Mostra versao\n  aios --help                                 Mostra ajuda\n\nFluxo recomendado:\n  1. Entre no repositorio do projeto\n  2. Rode: aios init\n  3. Peca a um agente para auditar e preencher a memoria\n  4. Antes de cada sessao, leia .ai/HANDOFF.md e .ai/SESSION.md\n  5. Ao encerrar, rode: aios close --summary \"o que foi feito\" --next \"proximo passo\"`);
}

function version() {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  console.log(pkg.version);
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
