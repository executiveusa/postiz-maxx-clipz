import { getFirebaseApiBaseUrl } from './client';

function assertFirebaseEndpoint(): string {
  const baseUrl = getFirebaseApiBaseUrl();
  if (!baseUrl) {
    throw new Error(
      'Firebase function URL is not configured. Set NEXT_PUBLIC_FIREBASE_FUNCTION_URL.'
    );
  }
  return baseUrl.replace(/\/$/, '');
}

export type FirebasePostPayload = {
  title: string;
  content: string;
  scheduledAt?: string | null;
};

export async function fetchPosts() {
  const baseUrl = assertFirebaseEndpoint();
  const response = await fetch(`${baseUrl}/posts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts from Firebase');
  }

  return response.json();
}

export async function createPost(payload: FirebasePostPayload) {
  const baseUrl = assertFirebaseEndpoint();
  const response = await fetch(`${baseUrl}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create Firebase post');
  }

  return response.json();
}
