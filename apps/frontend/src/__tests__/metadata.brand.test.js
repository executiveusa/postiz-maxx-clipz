const fs = require('node:fs');
const path = require('node:path');

describe('MAXX CLIPZ metadata tokens', () => {
  const targets = [
    'app/(app)/auth/login/page.tsx',
    'app/(app)/auth/page.tsx',
    'app/(app)/(site)/media/page.tsx',
    'app/(app)/(site)/analytics/page.tsx',
    'app/(app)/(site)/launches/page.tsx',
  ];

  test.each(targets)('%s contains MAXX CLIPZ title copy', (relativeFile) => {
    const filePath = path.join(__dirname, '..', relativeFile);
    const source = fs.readFileSync(filePath, 'utf-8');
    expect(source.includes('MAXX CLIPZ')).toBe(true);
  });
});
