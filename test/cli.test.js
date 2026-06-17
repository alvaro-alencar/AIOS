import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const cliPath = path.resolve('bin', 'aios.js');

function run(args, cwd) {
  return execFileSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function tempProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-test-'));
  execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' });
  return dir;
}

function tempProjectWithCommit() {
  const dir = tempProject();
  execFileSync('git', ['config', 'user.email', 'test@aios.local'], { cwd: dir, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'AIOS Test'], { cwd: dir, stdio: 'ignore' });
  fs.writeFileSync(path.join(dir, '.gitkeep'), '', 'utf8');
  execFileSync('git', ['add', '.gitkeep'], { cwd: dir, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'initial'], { cwd: dir, stdio: 'ignore' });
  return dir;
}

test('help prints usage', () => {
  const output = run(['--help'], process.cwd());
  assert.match(output, /AIOS/);
  assert.match(output, /aios init/);
  assert.match(output, /aios handshake/);
  assert.match(output, /aios install/);
  assert.match(output, /aios observe/);
  assert.match(output, /aios plan/);
  assert.match(output, /aios act/);
});

test('version prints package version', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const output = run(['--version'], process.cwd()).trim();
  assert.equal(output, pkg.version);
});

test('init creates required memory files', () => {
  const dir = tempProject();
  run(['init'], dir);

  const required = [
    '.ai/README.md',
    '.ai/CONTEXT.md',
    '.ai/SESSION.md',
    '.ai/TODO.md',
    '.ai/DECISIONS.md',
    '.ai/HANDOFF.md',
    '.ai/LOG.md',
    '.ai/VALIDATION_CHECKLIST.md',
    '.ai/RELATORIOS/.gitkeep'
  ];

  for (const file of required) {
    assert.equal(fs.existsSync(path.join(dir, file)), true, `${file} should exist`);
  }
});

test('bootstrap creates agent prompt', () => {
  const dir = tempProject();
  run(['bootstrap'], dir);
  assert.equal(fs.existsSync(path.join(dir, '.ai/AIOS_AGENT_PROMPT.md')), true);
});

test('install all creates agent adapter files', () => {
  const dir = tempProject();
  run(['install', 'all'], dir);

  const expected = [
    'AGENTS.md',
    'CLAUDE.md',
    '.cursor/rules/aios.mdc',
    '.github/copilot-instructions.md',
    '.ai/AIOS_AGENT_PROMPT.md'
  ];

  for (const file of expected) {
    assert.equal(fs.existsSync(path.join(dir, file)), true, `${file} should exist`);
  }
});

test('install claude creates only claude adapter plus AIOS memory', () => {
  const dir = tempProject();
  run(['install', 'claude'], dir);

  assert.equal(fs.existsSync(path.join(dir, 'CLAUDE.md')), true);
  assert.equal(fs.existsSync(path.join(dir, 'AGENTS.md')), false);
  assert.equal(fs.existsSync(path.join(dir, '.ai/AIOS_AGENT_PROMPT.md')), true);
});

test('default command installs all adapters', () => {
  const dir = tempProject();
  run([], dir);
  assert.equal(fs.existsSync(path.join(dir, 'AGENTS.md')), true);
  assert.equal(fs.existsSync(path.join(dir, 'CLAUDE.md')), true);
});

test('observe prints safe default mode', () => {
  const output = run(['observe'], process.cwd());
  assert.match(output, /AIOS OBSERVE MODE/);
  assert.match(output, /Não altere código de produção/);
  assert.match(output, /Próximos comandos AIOS sugeridos/);
});

test('plan prints planning mode without execution', () => {
  const output = run(['plan'], process.cwd());
  assert.match(output, /AIOS PLAN MODE/);
  assert.match(output, /Não altere código de produção/);
  assert.match(output, /plano de ação priorizado/);
  assert.match(output, /milestones verificáveis/);
  assert.match(output, /Objetivo/);
  assert.match(output, /Critério de sucesso/);
  assert.match(output, /Validações\/comandos sugeridos/);
  assert.match(output, /Rollback ou caminho de reversão/);
});

test('act prints authorized task mode', () => {
  const output = run(['act', 'corrigir bug de teste'], process.cwd());
  assert.match(output, /AIOS ACT MODE/);
  assert.match(output, /corrigir bug de teste/);
  assert.match(output, /Não faça commit nem push/);
});

test('handshake prints observe mode by default', () => {
  const output = run(['handshake'], process.cwd());
  assert.match(output, /AIOS OBSERVE MODE/);
  assert.match(output, /\/aios entra em OBSERVE por padrão/);
});

test('adapter instructions enforce observe mode and command suggestions', () => {
  const dir = tempProject();
  run(['install', 'all'], dir);
  const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.match(agents, /OBSERVE mode by default/);
  assert.match(agents, /Do not alter production code/);
  assert.match(agents, /verifiable milestones/);
  assert.match(agents, /At the end of every operational response/);
  assert.match(agents, /aios plan/);
  assert.match(agents, /aios act/);
});

test('audit recognizes initialized memory', () => {
  const dir = tempProject();
  run(['init'], dir);
  const output = run(['audit'], dir);
  assert.match(output, /AIOS audit/);
  assert.match(output, /Mem.ria .ai: encontrada/);
});

test('close updates session, handoff and log', () => {
  const dir = tempProject();
  run(['init'], dir);
  run(['close', '--summary', 'Teste encerrado', '--next', 'Continuar validacao'], dir);

  const session = fs.readFileSync(path.join(dir, '.ai/SESSION.md'), 'utf8');
  const handoff = fs.readFileSync(path.join(dir, '.ai/HANDOFF.md'), 'utf8');
  const log = fs.readFileSync(path.join(dir, '.ai/LOG.md'), 'utf8');

  assert.match(session, /Teste encerrado/);
  assert.match(handoff, /Continuar validacao/);
  assert.match(log, /Sess.o encerrada via AIOS CLI/);
});

test('doctor prints AIOS DOCTOR header and health score', () => {
  const output = run(['doctor'], process.cwd());
  assert.match(output, /AIOS DOCTOR/);
  assert.match(output, /Health Score:/);
  assert.match(output, /Próximos comandos AIOS sugeridos/);
});

test('doctor on fresh init detects template placeholders in TODO', () => {
  const dir = tempProject();
  run(['init'], dir);
  const output = run(['doctor'], dir);
  assert.match(output, /AIOS DOCTOR/);
  assert.match(output, /Health Score:/);
  assert.match(output, /\[pendencia\]/);
  assert.match(output, /placeholder/);
});

test('doctor detects missing memory structure', () => {
  const dir = tempProject();
  const output = run(['doctor'], dir);
  assert.match(output, /AIOS DOCTOR/);
  assert.match(output, /\[risco\]/);
  assert.match(output, /ausente/);
  const scoreMatch = output.match(/Health Score:\s*(\d+)/);
  assert.ok(scoreMatch, 'output deve conter Health Score');
  assert.ok(parseInt(scoreMatch[1], 10) < 70, `Score deveria ser baixo sem .ai/, obtido: ${scoreMatch[1]}`);
});

test('doctor detects branch inconsistency in HANDOFF', () => {
  const dir = tempProjectWithCommit();
  run(['init'], dir);
  const handoffPath = path.join(dir, '.ai/HANDOFF.md');
  fs.writeFileSync(handoffPath, [
    '# HANDOFF',
    '',
    '## Branch',
    '',
    '[observado] branch-inexistente',
    '',
    '## Estado do Git',
    '',
    '```txt',
    'limpo',
    '```',
  ].join('\n'), 'utf8');
  const output = run(['doctor'], dir);
  assert.match(output, /\[risco\]/);
  assert.match(output, /branch-inexistente/);
});

test('doctor displays sub-scores', () => {
  const output = run(['doctor'], process.cwd());
  assert.match(output, /Structural Score:/);
  assert.match(output, /Git Score:/);
  assert.match(output, /Memory Score:/);
  assert.match(output, /Health Score:/);
});

test('doctor detects empty CONTEXT.md', () => {
  const dir = tempProject();
  run(['init'], dir);
  fs.writeFileSync(path.join(dir, '.ai/CONTEXT.md'), '', 'utf8');
  const output = run(['doctor'], dir);
  assert.match(output, /\[risco\]/);
  assert.match(output, /CONTEXT\.md/);
  assert.match(output, /vaz/);
});

test('doctor detects duplicate decisions in DECISIONS.md', () => {
  const dir = tempProject();
  run(['init'], dir);
  fs.writeFileSync(path.join(dir, '.ai/DECISIONS.md'), [
    '# DECISIONS',
    '',
    '## 2026-01-01 — Decisão A',
    '',
    '### Decisão',
    '',
    'Usar Node.js.',
    '',
    '## 2026-01-01 — Decisão A',
    '',
    '### Decisão',
    '',
    'Entrada duplicada.',
  ].join('\n'), 'utf8');
  const output = run(['doctor'], dir);
  assert.match(output, /\[inconsistencia\]/);
  assert.match(output, /duplicad/i);
});

test('doctor detects out-of-order timestamps in LOG', () => {
  const dir = tempProject();
  run(['init'], dir);
  fs.writeFileSync(path.join(dir, '.ai/LOG.md'), [
    '# LOG',
    '',
    '## 2026-06-16T10:00:00.000Z - Entrada mais recente',
    '',
    'Conteúdo da entrada mais recente.',
    '',
    '## 2026-06-15T10:00:00.000Z - Entrada mais antiga',
    '',
    'Conteúdo da entrada mais antiga (timestamp anterior).',
  ].join('\n'), 'utf8');
  const output = run(['doctor'], dir);
  assert.match(output, /\[inconsistencia\]/);
  assert.match(output, /ordem/);
});

test('doctor detects SESSION×HANDOFF branch cross-inconsistency', () => {
  const dir = tempProjectWithCommit();
  run(['init'], dir);
  fs.writeFileSync(path.join(dir, '.ai/SESSION.md'), [
    '# SESSION',
    '',
    '## Branch atual',
    '',
    '[observado] branch-sessao',
    '',
    '## Estado do Git',
    '',
    '```txt',
    'limpo',
    '```',
  ].join('\n'), 'utf8');
  fs.writeFileSync(path.join(dir, '.ai/HANDOFF.md'), [
    '# HANDOFF',
    '',
    '## Branch',
    '',
    '[observado] branch-handoff',
    '',
    '## Estado do Git',
    '',
    '```txt',
    'limpo',
    '```',
  ].join('\n'), 'utf8');
  const output = run(['doctor'], dir);
  assert.match(output, /\[inconsistencia\]/);
  assert.match(output, /SESSION.*HANDOFF|cruzad/i);
});

test('doctor detects SESSION timestamp absent from LOG', () => {
  const dir = tempProject();
  run(['init'], dir);
  const ts = '2026-01-01T00:00:00.000Z';
  fs.writeFileSync(path.join(dir, '.ai/SESSION.md'), [
    '# SESSION',
    '',
    '## Data/hora da última atualização',
    '',
    `[observado] ${ts}`,
    '',
    '## Branch atual',
    '',
    '[observado] main',
  ].join('\n'), 'utf8');
  const output = run(['doctor'], dir);
  assert.match(output, /\[inconsistencia\]/);
  assert.match(output, /timestamp|LOG/i);
});

test('doctor detects dirty repo when SESSION says limpo', () => {
  const dir = tempProject();
  run(['init'], dir);
  const sessionPath = path.join(dir, '.ai/SESSION.md');
  fs.writeFileSync(sessionPath, [
    '# SESSION - Estado Atual',
    '',
    '## Data/hora da última atualização',
    '',
    '[observado] 2026-01-01T00:00:00.000Z',
    '',
    '## Branch atual',
    '',
    '[observado] main',
    '',
    '## Estado do Git',
    '',
    '```txt',
    'limpo',
    '```',
    '',
    '## Última atividade observada',
    '',
    '[observado] Teste encerrado',
    '',
    '## Próximos passos recomendados',
    '',
    '1. [pendencia] Continuar',
    '',
    '## Últimos commits',
    '',
    '```txt',
    'abc1234 commit inicial',
    '```',
  ].join('\n'), 'utf8');
  fs.writeFileSync(path.join(dir, 'arquivo-sujo.txt'), 'conteudo', 'utf8');
  const output = run(['doctor'], dir);
  assert.match(output, /AIOS DOCTOR/);
  assert.match(output, /\[risco\]/);
  assert.match(output, /dirty/);
});
