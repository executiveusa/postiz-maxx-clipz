import type { FirebaseOptions } from 'firebase/app';

type FirebaseEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
  NEXT_PUBLIC_FIREBASE_APP_ID?: string;
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
};

function readEnv(): FirebaseEnv {
  return {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export type FirebaseClientConfig = FirebaseOptions & {
  measurementId?: string;
};

export function getFirebaseClientConfig(): FirebaseClientConfig | null {
  const env = readEnv();
  const config: Partial<FirebaseClientConfig> = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const entries = Object.entries(config);
  const missing = entries.filter(([, value]) => !value);

  if (missing.length === entries.length) {
    return null;
  }

  const absent = missing.map(([key]) => key).join(', ');
  if (absent) {
    throw new Error(
      `Missing Firebase configuration value(s): ${absent}. Set NEXT_PUBLIC_FIREBASE_* environment variables.`
    );
  }

  return config as FirebaseClientConfig;
}

export function isFirebaseEnabled(): boolean {
  try {
    return getFirebaseClientConfig() !== null;
  } catch (error) {
    return false;
  }
}

export function getFirebaseFunctionBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_FIREBASE_FUNCTION_URL ?? null;
}
