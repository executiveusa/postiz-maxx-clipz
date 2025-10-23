module.exports = {
  displayName: 'frontend',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@gitroom/frontend/(.*)$': '<rootDir>/src/$1',
    '^@gitroom/react/(.*)$': '<rootDir>/../../libraries/react-shared-libraries/src/$1',
    '^@gitroom/helpers/(.*)$': '<rootDir>/../../libraries/helpers/src/$1',
    '^@gitroom/(.*)$': '<rootDir>/../../$1',
    '^.+\\.(css|scss)$': '<rootDir>/../../jest-style-mock.js',
    '^.+\\.(svg|png|jpe?g|gif|ico|webp|avif|bmp|mp4|mp3|webm|ogg|wav|woff2?|ttf|eot|otf|pdf)$':
      '<rootDir>/../../jest-file-mock.js',
    '^canvas$': '<rootDir>/../../jest-canvas-mock.js',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
