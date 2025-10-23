require('ts-node/register');

const { getFirebaseClientConfig } = require('@gitroom/frontend/lib/firebase/config');

describe('firebase client config', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns null when no env values are present', () => {
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('NEXT_PUBLIC_FIREBASE_')) {
        delete process.env[key];
      }
    });

    expect(getFirebaseClientConfig()).toBeNull();
  });

  it('returns config when all env values are present', () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '1234567890';
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:1234567890:web:abcdef';
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 'G-ABC1234';

    expect(getFirebaseClientConfig()).toMatchObject({
      apiKey: 'test-api-key',
      authDomain: 'test.firebaseapp.com',
      projectId: 'test-project',
      storageBucket: 'test.appspot.com',
      messagingSenderId: '1234567890',
      appId: '1:1234567890:web:abcdef',
      measurementId: 'G-ABC1234',
    });
  });

  it('throws when partially configured', () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test';

    expect(() => getFirebaseClientConfig()).toThrow(
      /Missing Firebase configuration value/,
    );
  });
});
