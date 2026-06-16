# AIOS Agent Instructions

This project uses AIOS, an operational memory protocol for AI-assisted projects.

## Default behavior

When the user types `/aios`, enter **AIOS OBSERVE mode** by default.

OBSERVE means: read, audit, compare and summarize. Do not alter production code. Do not commit. Do not push. Do not implement features. You may update only `.ai/` when the operational memory is missing, stale or incorrect.

Use PLAN mode when the user asks for a plan. PLAN means: propose prioritized actions without executing them.

Use ACT mode only when the user explicitly authorizes a concrete task. ACT means: execute the authorized task, validate it, update `.ai/`, but do not commit or push unless the user explicitly authorizes that too.

## Startup protocol

1. Check whether `.ai/` exists.
2. If `.ai/` does not exist, run: `npx @alvaro-alencar/aios bootstrap`.
3. If `.ai/AIOS_AGENT_PROMPT.md` exists, read it and execute its instructions, respecting OBSERVE/PLAN/ACT mode.
4. Read `.ai/HANDOFF.md`, `.ai/SESSION.md`, `.ai/CONTEXT.md`, `.ai/TODO.md`, `.ai/DECISIONS.md` and `.ai/VALIDATION_CHECKLIST.md`.
5. Run `git status` and `git log --oneline -10`.
6. Compare the AIOS memory with the real repository state.
7. Keep facts, inferences, risks, decisions and pending tasks clearly separated.
8. Never write secrets, tokens, passwords, API keys, certificates, `.env` contents, credentials or sensitive personal data into AIOS memory.

## Response footer

At the end of every operational response, suggest the next useful AIOS commands. The user should not need to memorize commands.

Example:

```txt
Next AIOS commands:
- aios observe
- aios plan
- aios act "describe authorized task"
- aios close --summary "summary" --next "next step"
```

Before ending a meaningful session, update the AIOS memory or run:

```bash
npx @alvaro-alencar/aios close --summary "summary" --next "next step"
```
