// Jest needs to hand CommonJS callers a primitive string so they don't fall
// back to loading the original binary asset. Keep this as a literal stub and
// let the test suite verify any interop helpers wrap it when default exports
// are required.
const stub = 'test-file-stub';

module.exports = stub;
