import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { Request, Response } from 'express';
import { createHttpApp } from '../functions/src/httpApp';

type ApiHandler = ReturnType<typeof createHttpApp>;
let cachedHandler: ApiHandler | undefined;

function getHandler(): ApiHandler {
  if (cachedHandler) return cachedHandler;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable');
  }

  const serviceAccount = JSON.parse(serviceAccountJson);
  const firebaseApp = getApps().find(app => app.name === 'vercel-api')
    ?? initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    }, 'vercel-api');

  cachedHandler = createHttpApp({
    auth: getAuth(firebaseApp),
    db: getFirestore(firebaseApp),
    getGeminiApiKey: () => {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error('Missing GEMINI_API_KEY environment variable');
      return key;
    },
  });
  return cachedHandler;
}

export default function handler(req: Request, res: Response) {
  try {
    return getHandler()(req, res);
  } catch (error) {
    // Log only the error message, never environment variable values or credential contents.
    console.error('Vercel API initialization failed:', error instanceof Error ? error.message : 'unknown error');
    return res.status(500).json({
      error: 'La API no está configurada correctamente. Contacta al administrador.',
    });
  }
}
