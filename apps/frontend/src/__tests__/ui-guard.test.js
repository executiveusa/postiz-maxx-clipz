const { spawnSync } = require('node:child_process');
const path = require('node:path');

describe('ui-only guard script', () => {
  const scriptPath = path.resolve(__dirname, '../../../../scripts/ensure-ui-only.mjs');

  function runGuardWith(files) {
    return spawnSync('node', [scriptPath], {
      env: {
        ...process.env,
        UI_GUARD_CHANGED_FILES: files.join('\n'),
      },
      encoding: 'utf-8',
    });
  }

  test('allows frontend-only file changes', () => {
    const result = runGuardWith(['apps/frontend/src/app/page.tsx']);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
  });

  test('rejects backend edits', () => {
    const result = runGuardWith(['apps/backend/src/main.ts']);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('UI-only guard failed');
    expect(result.stderr).toContain('apps/backend/src/main.ts');
  });
});
