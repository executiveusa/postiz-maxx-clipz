'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getFirebaseClientConfig, getFirebaseFunctionBaseUrl } from './config';

export type FirebaseServices = {
  app: FirebaseApp | null;
  auth: ReturnType<typeof getAuth> | null;
  firestore: ReturnType<typeof getFirestore> | null;
};

let cachedServices: FirebaseServices | null = null;

function initialise(): FirebaseServices {
  if (cachedServices) {
    return cachedServices;
  }

  const config = getFirebaseClientConfig();
  if (!config) {
    cachedServices = { app: null, auth: null, firestore: null };
    return cachedServices;
  }

  const app = getApps().length ? getApp() : initializeApp(config);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS === 'true') {
    const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || '127.0.0.1';
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(firestore, host, 8080);
  }

  cachedServices = { app, auth, firestore };
  return cachedServices;
}

export function getFirebaseServices(): FirebaseServices {
  try {
    return initialise();
  } catch (error) {
    console.warn('Firebase initialisation failed', error);
    cachedServices = { app: null, auth: null, firestore: null };
    return cachedServices;
  }
}

export function getFirebaseApiBaseUrl(): string | null {
  return getFirebaseFunctionBaseUrl();
}
