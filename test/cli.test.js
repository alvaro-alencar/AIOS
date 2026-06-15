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

test('handshake prints universal agent instruction', () => {
  const output = run(['handshake'], process.cwd());
  assert.match(output, /AIOS HANDSHAKE/);
  assert.match(output, /\/aios/);
  assert.match(output, /npx @alvaro-alencar\/aios bootstrap/);
});

test('audit recognizes initialized memory', () => {
  const dir = tempProject();
  run(['init'], dir);
  const output = run(['audit'], dir);
  assert.match(output, /AIOS audit/);
  assert.match(output, /Memoria .ai: encontrada/);
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
  assert.match(log, /Sessao encerrada via AIOS CLI/);
});
