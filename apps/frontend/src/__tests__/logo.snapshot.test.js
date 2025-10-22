const fs = require('node:fs');
const path = require('node:path');

describe('Logo source snapshot', () => {
  it('captures the MAXX CLIPZ mark', () => {
    const filePath = path.join(__dirname, '..', 'components/new-layout/logo.tsx');
    const source = fs.readFileSync(filePath, 'utf-8');
    expect(source).toMatchSnapshot();
  });
});
