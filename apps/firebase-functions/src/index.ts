import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import cors from 'cors';
import express, { Request, Response } from 'express';

admin.initializeApp();
const firestore = admin.firestore();

const api = express();
api.use(cors({ origin: true }));
api.use(express.json());

api.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

api.get('/posts', async (_req: Request, res: Response) => {
  try {
    const snapshot = await firestore
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Failed to load posts from Firestore', error);
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

api.post('/posts', async (req: Request, res: Response) => {
  try {
    const { title, content, scheduledAt } = req.body ?? {};
    if (!title || !content) {
      res.status(400).json({ error: 'Missing title or content' });
      return;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const payload = {
      title,
      content,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await firestore.collection('posts').add(payload);
    const doc = await ref.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Failed to create post in Firestore', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

api.put('/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, scheduledAt } = req.body ?? {};
    if (!title || !content) {
      res.status(400).json({ error: 'Missing title or content' });
      return;
    }

    const ref = firestore.collection('posts').doc(id);
    const exists = await ref.get();
    if (!exists.exists) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    await ref.update({
      title,
      content,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const doc = await ref.get();
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Failed to update post in Firestore', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

api.delete('/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await firestore.collection('posts').doc(id).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete post in Firestore', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export const api = functions.region('us-central1').https.onRequest(api);
