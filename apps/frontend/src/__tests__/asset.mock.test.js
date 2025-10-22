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
