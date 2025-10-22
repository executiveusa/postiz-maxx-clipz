#!/usr/bin/env node
import { execSync } from 'node:child_process';

const BASE_REF_ENV = process.env.UI_GUARD_BASE_REF || 'origin/main';

function runGitCommand(command, options = {}) {
  return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options }).trim();
}

function tryResolveCommit(ref) {
  try {
    return runGitCommand(`git rev-parse ${ref}`);
  } catch (error) {
    return null;
  }
}

function resolveMergeBase() {
  const candidateCommands = [`git merge-base --fork-point ${BASE_REF_ENV} HEAD`, `git merge-base ${BASE_REF_ENV} HEAD`];

  for (const command of candidateCommands) {
    try {
      const resolved = runGitCommand(command);
      if (resolved) {
        if (command.includes('--fork-point')) {
          return resolved;
        }

        console.warn(`[ui-guard] Falling back to standard merge-base with ${BASE_REF_ENV}.`);
        return resolved;
      }
    } catch (error) {
      if (!command.includes('--fork-point')) {
        console.warn(
          `[ui-guard] Unable to determine merge base using "${BASE_REF_ENV}".\n` +
            `Original error: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  if (BASE_REF_ENV.startsWith('origin/')) {
    const localRef = BASE_REF_ENV.replace(/^origin\//, '');
    try {
      const localMergeBase = runGitCommand(`git merge-base ${localRef} HEAD`);
      if (localMergeBase) {
        console.warn(`[ui-guard] Falling back to local branch ${localRef}.`);
        return localMergeBase;
      }
    } catch (error) {
      // Ignore and continue to final resolution attempts
    }
  }

  const explicitRef = tryResolveCommit(BASE_REF_ENV);
  if (explicitRef) {
    return explicitRef;
  }

  if (BASE_REF_ENV.startsWith('origin/')) {
    const localRef = BASE_REF_ENV.replace(/^origin\//, '');
    const localCommit = tryResolveCommit(localRef);
    if (localCommit) {
      console.warn(`[ui-guard] Using commit from local ref ${localRef}.`);
      return localCommit;
    }
  }

  throw new Error(
    `Unable to determine merge base using ${BASE_REF_ENV}. ` +
      `Set UI_GUARD_BASE_REF to a reachable ref if this repository uses a different default branch.`,
  );
}

function collectChangedFiles(mergeBase) {
  try {
    const diffOutput = runGitCommand(`git diff --name-only ${mergeBase}...HEAD`);
    return diffOutput.split('\n').map((line) => line.trim()).filter(Boolean);
  } catch (error) {
    throw new Error(
      `Unable to collect changed files between ${mergeBase} and HEAD.\n` +
        `Original error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

const FORBIDDEN_PATTERNS = [
  /^apps\/backend\//,
  /^apps\/commands\//,
  /^apps\/cron\//,
  /^apps\/workers\//,
  /^apps\/sdk\//,
  /^libraries\/nestjs-libraries\//,
  /^libraries\/helpers\//,
];

function main() {
  const mergeBase = resolveMergeBase();
  const changedFiles = collectChangedFiles(mergeBase);

  if (changedFiles.length === 0) {
    console.log('[ui-guard] No changes detected.');
    return;
  }

  const forbiddenHits = changedFiles.filter((file) => FORBIDDEN_PATTERNS.some((pattern) => pattern.test(file)));

  if (forbiddenHits.length > 0) {
    console.error('[ui-guard] Forbidden paths detected in diff:');
    forbiddenHits.forEach((file) => console.error(`  - ${file}`));
    console.error('\nOnly UI-facing paths should be modified for this guard to pass.');
    process.exit(1);
  }

  console.log('[ui-guard] Guard passed. No forbidden paths modified.');
}

try {
  main();
} catch (error) {
  console.error(`[ui-guard] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
