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
    case 'doctor':
      doctor();
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
  const base = `Você está operando em um projeto compatível com AIOS.\n\nRegras globais:\n\n1. O repositório é a fonte da verdade.\n2. Leia a memória AIOS antes de agir: .ai/HANDOFF.md, .ai/SESSION.md, .ai/CONTEXT.md, .ai/TODO.md, .ai/DECISIONS.md e .ai/VALIDATION_CHECKLIST.md.\n3. Rode git status e git log --oneline -10 antes de qualquer conclusão operacional.\n4. Nunca registre segredos, tokens, senhas, chaves, certificados, conteúdo de .env, credenciais ou dados pessoais sensíveis.\n5. Separe claramente [observado], [inferencia], [risco], [pendencia], [decisao] e [exige confirmacao].\n6. Ao final de cada resposta, sugira os próximos comandos AIOS úteis para o usuário. O usuário não deve precisar decorar comandos.\n`;

  if (normalized === 'observe') {
    return `${header}\n\n/aios entra em OBSERVE por padrão.\n\n${base}\nModo OBSERVE:\n\n- Leia, audite, compare e resuma.\n- Não altere código de produção.\n- Não crie commits.\n- Não faça push.\n- Não implemente features.\n- Pode atualizar apenas a pasta .ai/ quando isso for necessário para corrigir a memória operacional.\n- Se encontrar problemas, registre riscos e proponha próximos passos.\n\nSaída esperada:\n\n1. Estado da memória AIOS.\n2. Estado do Git.\n3. Divergências entre memória e repositório.\n4. Riscos imediatos.\n5. Próximo passo recomendado.\n6. Próximos comandos AIOS sugeridos.\n\nPróximos comandos AIOS sugeridos:\n- aios plan\n- aios act \"descrever tarefa autorizada\"\n- aios close --summary \"resumo\" --next \"próximo passo\"`;
  }

  if (normalized === 'plan') {
    return `${header}\n\n${base}\nModo PLAN:\n\n- Transforme observações em plano de ação priorizado.\n- Não altere código de produção.\n- Não crie commits.\n- Não faça push.\n- Pode atualizar apenas .ai/ se a memória estiver incorreta ou incompleta.\n- Organize o plano em milestones verificáveis, pequenas o bastante para execução segura em ACT.\n- Classifique milestones por impacto, risco e ordem recomendada.\n- Explique o que exigiria confirmação humana antes de executar.\n\nCada milestone deve conter:\n\n1. Objetivo.\n2. Critério de sucesso.\n3. Validações/comandos sugeridos.\n4. Riscos.\n5. Rollback ou caminho de reversão.\n6. Próximo passo recomendado.\n\nSaída esperada:\n\n1. Plano recomendado em milestones verificáveis.\n2. Justificativa curta.\n3. Riscos e dependências gerais.\n4. O que pode ser feito em modo ACT.\n5. Próximos comandos AIOS sugeridos.\n\nPróximos comandos AIOS sugeridos:\n- aios act \"executar o primeiro milestone do plano\"\n- aios observe\n- aios close --summary \"plano criado\" --next \"executar milestone 1\"`;
  }

  if (normalized === 'act') {
    const task = args.slice(1).join(' ').trim();
    return `${header}\n\n${base}\nModo ACT:\n\n- Execute somente a tarefa explicitamente autorizada pelo usuário.\n- Antes de alterar código, declare o escopo pretendido.\n- Faça mudanças pequenas, rastreáveis e reversíveis.\n- Rode validações relevantes.\n- Atualize .ai/ com fatos, riscos, decisões e pendências.\n- Não faça commit nem push sem autorização explícita separada.\n\nTarefa autorizada recebida:\n\n${task || '[exige confirmacao] Nenhuma tarefa específica foi informada. Peça autorização antes de agir.'}\n\nSaída esperada:\n\n1. Escopo executado.\n2. Arquivos alterados.\n3. Validações rodadas.\n4. Riscos remanescentes.\n5. Próximos comandos AIOS sugeridos.\n\nPróximos comandos AIOS sugeridos:\n- aios observe\n- aios close --summary \"mudança executada\" --next \"validar/commitar\"`;
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

  ensureFile(sessionPath, '# SESSION - Estado Atual\n');
  ensureFile(handoffPath, '# HANDOFF - Transferência para o Próximo Agente\n');
  ensureFile(logPath, '# LOG - Histórico Cronológico\n');

  const sessionContent = `# SESSION - Estado Atual\n\n## Data/hora da última atualização\n\n[observado] ${timestamp}\n\n## Branch atual\n\n[observado] ${git.branch || '[desconhecida]'}\n\n## Estado do Git\n\n\`\`\`txt\n${git.status || 'limpo'}\n\`\`\`\n\n## Última atividade observada\n\n[observado] ${summary}\n\n## Próximos passos recomendados\n\n1. [pendencia] ${next}\n\n## Últimos commits\n\n\`\`\`txt\n${git.log || '[sem commits]'}\n\`\`\`\n`;

  const handoffContent = `# HANDOFF - Transferência para o Próximo Agente\n\n## Resumo executivo\n\n[observado] ${summary}\n\n## Estado atual\n\n[observado] Sessão encerrada em ${timestamp}.\n\n## Branch\n\n[observado] ${git.branch || '[desconhecida]'}\n\n## Estado do Git\n\n\`\`\`txt\n${git.status || 'limpo'}\n\`\`\`\n\n## Próximo passo recomendado\n\n1. [pendencia] ${next}\n\n## Primeiros minutos do próximo agente\n\n1. Ler este arquivo.\n2. Ler SESSION.md.\n3. Rodar git status.\n4. Rodar git log --oneline -10.\n5. Comparar memória e repositório antes de alterar código.\n`;

  const logEntry = `\n## ${timestamp} - Sessão encerrada via AIOS CLI\n\n### Resumo\n\n[observado] ${summary}\n\n### Branch\n\n[observado] ${git.branch || '[desconhecida]'}\n\n### Estado do Git\n\n\`\`\`txt\n${git.status || 'limpo'}\n\`\`\`\n\n### Próximo passo\n\n[pendencia] ${next}\n`;

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

function doctor() {
  const cwd = process.cwd();
  const memoryDir = path.join(cwd, '.ai');
  const git = getGitSnapshot();

  const observations = [];
  const inconsistencies = [];
  const risks = [];
  const pending = [];

  // Structural Score (0-40): -5 por arquivo ausente
  let structuralScore = 40;
  const missing = getMissingFiles(memoryDir);
  if (missing.length === 0) {
    observations.push('Estrutura .ai/ completa e compatível com AIOS v1.');
  } else {
    structuralScore = Math.max(0, 40 - missing.length * 5);
    for (const f of missing) risks.push(`Arquivo ausente: .ai/${f}`);
  }

  // Git Score (0-30)
  let gitScore = 0;
  if (!git.isRepo) {
    risks.push('Diretório não parece ser um repositório Git válido.');
  } else {
    gitScore = 30;
    const isDirty = git.status.length > 0;
    observations.push(`Branch atual: ${git.branch || '[desconhecida]'}`);
    observations.push(`Estado Git: ${isDirty ? 'dirty (mudanças não commitadas detectadas)' : 'limpo'}`);

    if (fs.existsSync(memoryDir)) {
      const sessionPath = path.join(memoryDir, 'SESSION.md');
      const handoffPath = path.join(memoryDir, 'HANDOFF.md');

      if (fs.existsSync(sessionPath)) {
        const sessionContent = fs.readFileSync(sessionPath, 'utf8');
        if (sessionContent.includes('## Últimos commits')) {
          const headShort = runGit('log --format=%h -1');
          if (headShort && !sessionContent.includes(headShort)) {
            gitScore -= 10;
            risks.push(`SESSION.md não contém o commit HEAD atual (${headShort}). Memória pode estar desatualizada.`);
          } else if (headShort) {
            observations.push(`SESSION.md contém o commit HEAD atual (${headShort}).`);
          }
        }
        if (isDirty) {
          const statusBlock = sessionContent.match(/##\s*Estado do Git[\s\S]*?```txt([\s\S]*?)```/);
          if (statusBlock && statusBlock[1].trim() === 'limpo') {
            gitScore -= 10;
            risks.push('SESSION.md registra estado como "limpo" mas o repositório tem mudanças não commitadas.');
          }
        }
      }

      if (fs.existsSync(handoffPath) && git.branch) {
        const handoffContent = fs.readFileSync(handoffPath, 'utf8');
        const branchMatch = handoffContent.match(/##\s*Branch[\s\S]*?\[observado\]\s+(\S+)/);
        if (branchMatch) {
          const recorded = branchMatch[1];
          if (recorded !== git.branch) {
            gitScore -= 5;
            risks.push(`HANDOFF.md registra branch "${recorded}" mas branch atual é "${git.branch}".`);
          } else {
            observations.push(`HANDOFF.md: branch consistente com branch atual (${git.branch}).`);
          }
        }
        if (isDirty) {
          const statusBlock = handoffContent.match(/##\s*Estado do Git[\s\S]*?```txt([\s\S]*?)```/);
          if (statusBlock && statusBlock[1].trim() === 'limpo') {
            gitScore -= 5;
            risks.push('HANDOFF.md registra estado como "limpo" mas o repositório está dirty.');
          }
        }
      }
    }
    gitScore = Math.max(0, gitScore);
  }

  // Memory Score (0-30): validação semântica da memória operacional
  let memoryScore = 30;
  if (fs.existsSync(memoryDir)) {
    memoryScore -= doctorCheckContext(memoryDir, observations, risks, inconsistencies);
    memoryScore -= doctorCheckDecisions(memoryDir, observations, inconsistencies);
    memoryScore -= doctorCheckLog(memoryDir, observations, inconsistencies);
    memoryScore -= doctorCheckChecklist(memoryDir, observations, inconsistencies, pending);
    memoryScore -= doctorCheckTodo(memoryDir, pending);
    memoryScore -= doctorCheckCrossConsistency(memoryDir, inconsistencies);
    memoryScore = Math.max(0, memoryScore);
  }

  const finalScore = structuralScore + gitScore + memoryScore;
  const classification =
    finalScore >= 90 ? 'saudável' :
    finalScore >= 70 ? 'atenção' :
    finalScore >= 50 ? 'risco' : 'crítico';

  console.log('AIOS DOCTOR');
  console.log('');

  if (observations.length > 0) {
    console.log('[observado]');
    for (const obs of observations) console.log(`- ${obs}`);
    console.log('');
  }

  if (inconsistencies.length > 0) {
    console.log('[inconsistencia]');
    for (const inc of inconsistencies) console.log(`- ${inc}`);
    console.log('');
  }

  if (risks.length > 0) {
    console.log('[risco]');
    for (const risk of risks) console.log(`- ${risk}`);
    console.log('');
  }

  if (pending.length > 0) {
    console.log('[pendencia]');
    for (const p of pending) console.log(`- ${p}`);
    console.log('');
  }

  console.log(`Structural Score: ${structuralScore}/40`);
  console.log(`Git Score:        ${gitScore}/30`);
  console.log(`Memory Score:     ${memoryScore}/30`);
  console.log(`Health Score:     ${finalScore}/100 — ${classification}`);

  printSuggestedCommands([
    'aios observe',
    'aios plan',
    'aios act "corrigir inconsistências de memória"',
    'aios close --summary "diagnóstico concluído" --next "corrigir issues detectados"'
  ]);
}

function doctorCheckContext(memoryDir, observations, risks, inconsistencies) {
  const contextPath = path.join(memoryDir, 'CONTEXT.md');
  if (!fs.existsSync(contextPath)) return 0;

  const raw = fs.readFileSync(contextPath, 'utf8');
  const meaningful = raw.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('').trim();
  if (meaningful.length === 0) {
    risks.push('CONTEXT.md está vazio ou contém apenas cabeçalhos sem conteúdo.');
    return 8;
  }

  const lines = raw.split('\n');
  let deduction = 0;

  // Placeholders não preenchidos (linha termina com [exige confirmação])
  let inCode = false;
  const placeholders = [];
  for (const line of lines) {
    if (line.trim().startsWith('```')) { inCode = !inCode; continue; }
    if (!inCode && /\[exige confirm(a|ação)\]\s*$/u.test(line)) placeholders.push(line.trim());
  }
  if (placeholders.length > 0) {
    deduction += Math.min(placeholders.length * 2, 4);
    inconsistencies.push(`CONTEXT.md tem ${placeholders.length} placeholder(s) [exige confirmação] não preenchido(s).`);
  }

  // Seções duplicadas
  const headings = lines.filter(l => /^##\s+/.test(l)).map(l => l.trim());
  const seenH = new Set();
  const dupeH = [];
  for (const h of headings) { if (seenH.has(h)) dupeH.push(h); else seenH.add(h); }
  if (dupeH.length > 0) {
    deduction += Math.min(dupeH.length * 2, 4);
    for (const h of [...new Set(dupeH)]) inconsistencies.push(`CONTEXT.md tem seção duplicada: "${h}".`);
  }

  // Termos de status conflitantes
  const conflictPairs = [
    ['ativo', 'encerrado'], ['publicado', 'não publicado'],
    ['habilitado', 'desabilitado'], ['completo', 'incompleto'],
  ];
  for (const [a, b] of conflictPairs) {
    if (new RegExp(`\\b${a}\\b`, 'iu').test(raw) && new RegExp(`\\b${b}\\b`, 'iu').test(raw)) {
      deduction += 2;
      inconsistencies.push(`CONTEXT.md menciona termos possivelmente conflitantes: "${a}" e "${b}".`);
      break;
    }
  }

  if (deduction === 0) observations.push('CONTEXT.md: sem problemas estruturais detectados.');
  return Math.min(deduction, 8);
}

function doctorCheckDecisions(memoryDir, observations, inconsistencies) {
  const decisionsPath = path.join(memoryDir, 'DECISIONS.md');
  if (!fs.existsSync(decisionsPath)) return 0;

  const content = fs.readFileSync(decisionsPath, 'utf8');
  const lines = content.split('\n');
  let deduction = 0;

  // Placeholders não preenchidos
  let inCode = false;
  const placeholders = [];
  for (const line of lines) {
    if (line.trim().startsWith('```')) { inCode = !inCode; continue; }
    if (!inCode && /\[exige confirm(a|ação)\]\s*$/u.test(line)) placeholders.push(line.trim());
  }
  if (placeholders.length > 0) {
    deduction += Math.min(placeholders.length * 2, 4);
    inconsistencies.push(`DECISIONS.md tem ${placeholders.length} placeholder(s) [exige confirmação] não preenchido(s).`);
  }

  // Decisões duplicadas (mesmo heading ##)
  const h2s = lines.filter(l => /^##\s+/.test(l)).map(l => l.trim());
  const seenD = new Set();
  const dupeD = new Set();
  for (const h of h2s) { if (seenD.has(h)) dupeD.add(h); else seenD.add(h); }
  if (dupeD.size > 0) {
    deduction += Math.min(dupeD.size * 3, 6);
    for (const h of dupeD) inconsistencies.push(`DECISIONS.md tem decisão duplicada: "${h}".`);
  }

  if (deduction === 0) observations.push('DECISIONS.md: sem duplicatas ou placeholders detectados.');
  return Math.min(deduction, 7);
}

function doctorCheckLog(memoryDir, observations, inconsistencies) {
  const logPath = path.join(memoryDir, 'LOG.md');
  if (!fs.existsSync(logPath)) return 0;

  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  let deduction = 0;

  // Extrair timestamps ISO de headings ## <timestamp>
  const timestamps = [];
  for (const line of lines) {
    const m = line.match(/^##\s+(\d{4}-\d{2}-\d{2}T[\d:.Z+\-]+)/);
    if (m) timestamps.push(m[1]);
  }

  if (timestamps.length >= 2) {
    for (let i = 1; i < timestamps.length; i++) {
      if (timestamps[i] < timestamps[i - 1]) {
        deduction += 3;
        inconsistencies.push('LOG.md tem timestamps fora de ordem cronológica.');
        break;
      }
    }
  }

  const tsSet = new Set();
  const dupTs = [];
  for (const ts of timestamps) { if (tsSet.has(ts)) dupTs.push(ts); else tsSet.add(ts); }
  if (dupTs.length > 0) {
    deduction += Math.min(dupTs.length * 2, 4);
    inconsistencies.push(`LOG.md tem ${dupTs.length} entrada(s) com timestamp duplicado.`);
  }

  // Entradas sem conteúdo (heading seguido imediatamente de outro heading)
  const sections = content.split(/^##\s+/m).slice(1);
  const emptyCount = sections.filter(s => s.split('\n').slice(1).join('\n').trim().length === 0).length;
  if (emptyCount > 0) {
    deduction += Math.min(emptyCount * 2, 4);
    inconsistencies.push(`LOG.md tem ${emptyCount} entrada(s) sem conteúdo.`);
  }

  if (deduction === 0) {
    if (timestamps.length > 0) {
      observations.push(`LOG.md: ${timestamps.length} entrada(s) ISO em ordem cronológica correta.`);
    } else {
      observations.push('LOG.md: sem entradas com timestamp ISO detectadas (log manual ou vazio).');
    }
  }
  return Math.min(deduction, 7);
}

function doctorCheckChecklist(memoryDir, observations, inconsistencies, pending) {
  const checklistPath = path.join(memoryDir, 'VALIDATION_CHECKLIST.md');
  if (!fs.existsSync(checklistPath)) return 0;

  const content = fs.readFileSync(checklistPath, 'utf8');
  const lines = content.split('\n');
  let deduction = 0;

  const placeholders = lines.filter(l =>
    /^\s*-\s*\[\s*\]/.test(l) && /\[exige confirm(a|ação)\]\s*$/u.test(l)
  );
  if (placeholders.length > 0) {
    deduction += Math.min(placeholders.length, 3);
    pending.push(`VALIDATION_CHECKLIST.md tem ${placeholders.length} item(ns) com placeholder não preenchido.`);
  }

  if (!content.includes('npm test') && !content.includes('node --test')) {
    deduction += 1;
    inconsistencies.push('VALIDATION_CHECKLIST.md não menciona npm test como etapa de validação.');
  }

  if (deduction === 0) observations.push('VALIDATION_CHECKLIST.md: sem placeholders e npm test referenciado.');
  return Math.min(deduction, 4);
}

function doctorCheckTodo(memoryDir, pending) {
  const todoPath = path.join(memoryDir, 'TODO.md');
  if (!fs.existsSync(todoPath)) return 0;

  const todoLines = fs.readFileSync(todoPath, 'utf8').split('\n');
  const emptyMarkers = todoLines.filter(line => {
    const isEmptyCheckbox = /^\s*-\s*\[\s*\]\s*$/.test(line);
    const isPlaceholderCheckbox = /^\s*-\s*\[\s*\]/.test(line) &&
      /\[exige confirm(a|ação)\]\s*$/u.test(line);
    return isEmptyCheckbox || isPlaceholderCheckbox;
  });
  if (emptyMarkers.length > 0) {
    pending.push(`TODO.md contém ${emptyMarkers.length} marcador(es) com placeholder genérico ou sem descrição.`);
    return Math.min(emptyMarkers.length, 5);
  }
  return 0;
}

function doctorCheckCrossConsistency(memoryDir, inconsistencies) {
  let deduction = 0;

  const sessionPath = path.join(memoryDir, 'SESSION.md');
  const handoffPath = path.join(memoryDir, 'HANDOFF.md');
  const logPath = path.join(memoryDir, 'LOG.md');

  // SESSION × HANDOFF: branch registrada nos dois arquivos deve coincidir
  if (fs.existsSync(sessionPath) && fs.existsSync(handoffPath)) {
    const sessionBranch = extractBranchFromMemory(fs.readFileSync(sessionPath, 'utf8'));
    const handoffBranch = extractBranchFromMemory(fs.readFileSync(handoffPath, 'utf8'));
    if (sessionBranch && handoffBranch && sessionBranch !== handoffBranch) {
      deduction += 2;
      inconsistencies.push(`Inconsistência cruzada SESSION×HANDOFF: branch "${sessionBranch}" (SESSION) ≠ "${handoffBranch}" (HANDOFF).`);
    }
  }

  // SESSION × LOG: timestamp da última atualização de SESSION deve aparecer em LOG
  if (fs.existsSync(sessionPath) && fs.existsSync(logPath)) {
    const sessionTs = extractTimestampFromSession(fs.readFileSync(sessionPath, 'utf8'));
    if (sessionTs && !fs.readFileSync(logPath, 'utf8').includes(sessionTs)) {
      deduction += 2;
      inconsistencies.push(`SESSION.md registra timestamp "${sessionTs}" ausente em LOG.md. Sessão pode não ter sido encerrada com aios close.`);
    }
  }

  return Math.min(deduction, 4);
}

function extractBranchFromMemory(content) {
  // Tenta "## Branch atual" (formato SESSION do aios close)
  const m1 = content.match(/##\s*Branch\s+atual[\s\S]*?\[observado\]\s+(\S+)/);
  if (m1 && !isMemoryTemplatePlaceholder(m1[1])) return m1[1];
  // Tenta "## Branch" (formato HANDOFF do aios close)
  const m2 = content.match(/##\s*Branch[\s\S]*?\[observado\]\s+(\S+)/);
  if (m2 && !isMemoryTemplatePlaceholder(m2[1])) return m2[1];
  return null;
}

function isMemoryTemplatePlaceholder(value) {
  return !value || /^Preencher/i.test(value) || value === '[desconhecida]';
}

function extractTimestampFromSession(content) {
  const m = content.match(/##\s*Data[\s\S]*?\[observado\]\s+(\d{4}-\d{2}-\d{2}T[\d:.Z+\-]+)/);
  return m ? m[1] : null;
}

function help() {
  console.log(`AIOS - Agent Intelligence Operating System\n\nUso:\n  aios init [--force] [--with-prompt]         Cria a memória .ai/ no projeto atual\n  aios bootstrap [--force]                    Cria .ai/ e .ai/AIOS_AGENT_PROMPT.md\n  aios install [all|codex|claude|cursor|copilot] [--force]\n                                              Instala arquivos de instrução para ferramentas de IA\n  aios observe                                Modo seguro padrão: audita e orienta sem alterar código\n  aios plan                                   Gera plano em milestones verificáveis sem executar\n  aios act \"tarefa autorizada\"              Executa somente ação explicitamente autorizada\n  aios handshake                              Imprime o handshake universal /aios em modo observe\n  aios open                                   Alias de handshake\n  aios prompt                                 Imprime o prompt para preencher a memória com uma IA\n  aios audit                                  Verifica estrutura AIOS, marcadores e estado Git\n  aios doctor                                 Diagnóstico de saúde operacional da memória AIOS\n  aios status                                 Mostra resumo operacional do projeto\n  aios handoff                                Imprime o handoff atual\n  aios close --summary \"...\" --next \"...\"   Encerra sessão e atualiza memória\n  aios --version                              Mostra versão\n  aios --help                                 Mostra ajuda\n\nFluxo recomendado:\n  npx @alvaro-alencar/aios install all\n  aios observe\n  aios plan\n  aios act \"tarefa autorizada\"\n  aios close --summary \"o que foi feito\" --next \"próximo passo\"\n\nRegra de segurança:\n  /aios entra em OBSERVE por padrão. O agente não deve alterar código, commitar ou fazer push sem autorização explícita.`);
}

function version() {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  console.log(pkg.version);
}

function getAdapterFiles() {
  const shared = `# AIOS Agent Instructions\n\nThis project uses AIOS, an operational memory protocol for AI-assisted projects.\n\n## Default behavior\n\nWhen the user types /aios, enter AIOS OBSERVE mode by default.\n\nOBSERVE means: read, audit, compare and summarize. Do not alter production code. Do not commit. Do not push. Do not implement features. You may update only .ai/ when the operational memory is missing, stale or incorrect.\n\nUse PLAN mode when the user asks for a plan. PLAN means: propose prioritized actions without executing them. Plans should be organized as verifiable milestones with objective, success criteria, suggested validations/commands, risks, rollback path, and next step.\n\nUse ACT mode only when the user explicitly authorizes a concrete task. ACT means: execute the authorized task, validate it, update .ai/, but do not commit or push unless the user explicitly authorizes that too.\n\n## Startup protocol\n\n1. Check whether .ai/ exists.\n2. If .ai/ does not exist, run: npx @alvaro-alencar/aios bootstrap\n3. If .ai/AIOS_AGENT_PROMPT.md exists, read it and execute its instructions, respecting OBSERVE/PLAN/ACT mode.\n4. Read .ai/HANDOFF.md, .ai/SESSION.md, .ai/CONTEXT.md, .ai/TODO.md, .ai/DECISIONS.md and .ai/VALIDATION_CHECKLIST.md.\n5. Run git status and git log --oneline -10.\n6. Compare the AIOS memory with the real repository state.\n7. Keep facts, inferences, risks, decisions and pending tasks clearly separated.\n8. Never write secrets, tokens, passwords, API keys, certificates, .env contents, credentials or sensitive personal data into AIOS memory.\n\n## Response footer\n\nAt the end of every operational response, suggest the next useful AIOS commands. The user should not need to memorize commands. Example:\n\nNext AIOS commands:\n- aios observe\n- aios plan\n- aios act \"describe authorized task\"\n- aios close --summary \"summary\" --next \"next step\"\n\nBefore ending a meaningful session, update the AIOS memory or run: npx @alvaro-alencar/aios close --summary \"summary\" --next \"next step\"\n`;

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
      if (line.includes('[exige confirmacao]') || line.includes('[exige confirmacao]')) {
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
