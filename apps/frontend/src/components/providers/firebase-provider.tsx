'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  getFirebaseServices,
  type FirebaseServices,
} from '@gitroom/frontend/lib/firebase/client';

export type FirebaseContextValue = {
  auth: FirebaseServices['auth'] | null;
  firestore: FirebaseServices['firestore'] | null;
  ready: boolean;
};

const FirebaseContext = createContext<FirebaseContextValue>({
  auth: null,
  firestore: null,
  ready: false,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<FirebaseContextValue>({
    auth: null,
    firestore: null,
    ready: false,
  });

  useEffect(() => {
    const services = getFirebaseServices();
    setValue({
      auth: services.auth,
      firestore: services.firestore,
      ready: true,
    });
  }, []);

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
