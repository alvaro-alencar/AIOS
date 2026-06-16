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
