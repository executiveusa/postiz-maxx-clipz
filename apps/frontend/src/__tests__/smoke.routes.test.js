const fs = require('node:fs');
const path = require('node:path');

describe('MAXX CLIPZ smoke checks', () => {
  it('sidebar layout references new CTA and profile copy', () => {
    const layoutPath = path.join(
      __dirname,
      '..',
      'components/new-layout/layout.component.tsx'
    );
    const content = fs.readFileSync(layoutPath, 'utf-8');
    expect(content.includes('New Clip')).toBe(true);
    expect(content.includes('Forked from the Postiz project')).toBe(true);
  });
});
