#!/usr/bin/env node
import { execSync } from 'node:child_process';

const forbidden = [
  /^apps\/(?:[^/]*backend[^/]*|[^/]*workers[^/]*|[^/]*cron[^/]*|[^/]*commands[^/]*|[^/]*extension[^/]*)\//i,
  /^packages\/(?:[^/]*server[^/]*)\//i,
  /^scripts\/deploy\//,
  /^docker-compose\.yml$/,
  /^Dockerfile(?:\..*)?$/,
  /^railway\.json$/,
  /^Procfile$/,
  /^\.github\//,
  /^\.env/i,
  /^k8s\//,
];

const DEFAULT_BASE_REF = process.env.UI_GUARD_BASE_REF || 'origin/main';

function runGit(command) {
  try {
    return execSync(command, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

function resolveBaseRef() {
  const refs = Array.from(
    new Set(
      [DEFAULT_BASE_REF, 'origin/main', 'main', 'master'].filter(Boolean)
    )
  );

  for (const ref of refs) {
    const candidates = [
      `git merge-base --fork-point ${ref} HEAD`,
      `git merge-base ${ref} HEAD`,
      `git rev-parse ${ref}`,
    ];

    for (const command of candidates) {
      const [result] = runGit(command);
      if (result) {
        return result;
      }
    }
  }

  return '';
}

function getChangedFilesFromGit() {
  const files = new Set();

  const staged = runGit('git diff --cached --name-only');
  for (const file of staged) {
    files.add(file);
  }

  const baseCommit = resolveBaseRef();
  const hasMergeBase = Boolean(baseCommit);
  if (baseCommit) {
    for (const file of runGit(`git diff --name-only ${baseCommit}...HEAD`)) {
      files.add(file);
    }
  }

  const workingTree = runGit('git diff --name-only');
  for (const file of workingTree) {
    files.add(file);
  }

  const untracked = runGit('git ls-files --others --exclude-standard');
  for (const file of untracked) {
    files.add(file);
  }

  return {
    files: Array.from(files),
    hasStagedChanges: staged.length > 0,
    hasMergeBase,
  };
}

function parseOverride() {
  const override = process.env.UI_GUARD_CHANGED_FILES;
  if (!override) {
    return null;
  }

  return override
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const overrideFiles = parseOverride();
const gitChanges = getChangedFilesFromGit();

if (
  process.env.CI === 'true' &&
  !overrideFiles &&
  !gitChanges.hasStagedChanges &&
  !gitChanges.hasMergeBase
) {
  process.exit(0);
}

const changedFiles = overrideFiles ?? gitChanges.files;

const violations = changedFiles.filter((file) =>
  forbidden.some((pattern) => pattern.test(file))
);

if (violations.length) {
  console.error(
    '\nUI-only guard failed. The following files are outside the allowed scope:\n'
  );
  for (const file of violations) {
    console.error(` - ${file}`);
  }
  console.error('\nRevert or move these changes to comply with the MAXX CLIPZ UI-only rebrand.');
  process.exit(1);
}
