/* eslint-disable global-require */
const assets = [
  ['svg', () => require('../../public/brand/maxx-clipz-mark.svg')],
  ['png', () => require('../../public/og-image.png')],
  ['ico', () => require('../../public/favicon.ico')],
];

function interopDefault(mod) {
  if (mod && typeof mod === 'object' && 'default' in mod) {
    return mod;
  }

  return { default: mod };
}

describe('static asset mocks', () => {
  test.each(assets)('%s assets resolve to primitive stub', (_label, load) => {
    const asset = load();
    expect(typeof asset).toBe('string');
    expect(asset).toBe('test-file-stub');
  });

  test('interop helper exposes default stub', () => {
    const imported = interopDefault(require('../../public/brand/maxx-clipz-logo.svg'));
    expect(imported.default).toBe('test-file-stub');
  });
describe('jest file mock', () => {
  it('exposes the stub via ESM default import', async () => {
    const asset = await import('../../../../jest-file-mock.js');

    expect(asset.default).toBe('test-file-stub');
  });

  it('returns the stub string from require()', () => {
    const asset = require('../../../../jest-file-mock.js');

    expect(asset).toBe('test-file-stub');
  });
});
