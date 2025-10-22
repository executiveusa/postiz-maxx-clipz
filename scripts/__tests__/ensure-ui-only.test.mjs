import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(new URL('../ensure-ui-only.mjs', import.meta.url));

function initRepository() {
  const worktree = mkdtempSync(join(tmpdir(), 'ui-guard-worktree-'));
  const bareRepo = mkdtempSync(join(tmpdir(), 'ui-guard-remote-'));

  execSync('git init --bare', { cwd: bareRepo });

  execSync('git init', { cwd: worktree });
  execSync('git config user.email "ci@example.com"', { cwd: worktree });
  execSync('git config user.name "UI Guard"', { cwd: worktree });

  writeFileSync(join(worktree, 'README.md'), 'base');
  execSync('git add README.md', { cwd: worktree });
  execSync('git commit -m "chore: initial"', { cwd: worktree });

  execSync(`git remote add origin ${bareRepo}`, { cwd: worktree });
  execSync('git branch -M main', { cwd: worktree });
  execSync('git push origin main', { cwd: worktree });

  return { worktree, bareRepo };
}

test('ui guard fails when backend files are touched', () => {
  const { worktree } = initRepository();

  execSync('git checkout -b feature/ui-guard', { cwd: worktree });

  const backendFile = join(worktree, 'apps/backend/src/index.ts');
  mkdirSync(dirname(backendFile), { recursive: true });
  writeFileSync(backendFile, 'console.log("backend change");\n');

  execSync('git add apps/backend/src/index.ts', { cwd: worktree });
  execSync('git commit -m "feat: backend change"', { cwd: worktree });

  const result = spawnSync('node', [SCRIPT_PATH], {
    cwd: worktree,
    env: { ...process.env, UI_GUARD_BASE_REF: 'origin/main' },
    encoding: 'utf8',
  });

  assert.strictEqual(result.status, 1, `expected guard to fail but exit code was ${result.status}`);
  assert.match(result.stderr, /apps\/backend\/src\/index.ts/, 'stderr should list the backend file');
});
