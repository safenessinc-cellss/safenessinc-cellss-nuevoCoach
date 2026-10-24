import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';

initializeApp();
const db = getFirestore();
const geminiApiKey = defineSecret('GEMINI_API_KEY');
const app = express();
app.use(cors({ origin: true, methods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '8mb' }));

const CHAT_SYSTEM_PROMPT = `Eres el asistente virtual de Robert Terán, ingeniero, economista y especialista en sistemas de gestión integral. Responde en el idioma del usuario, de forma profesional, clara y prudente. Ayuda con servicios de auditoría ISO, calidad, optimización de procesos, coaching y agendamiento. Para agendar, indica que la persona puede visitar /agendar. No inventes certificaciones, precios, disponibilidad ni resultados que no estén en el contexto.`;

type AuthedRequest = Request & { authUid?: string; authEmail?: string };

async function requireStaff(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Se requiere iniciar sesión.' });
      return;
    }
    const token = await getAuth().verifyIdToken(header.slice(7));
    const email = (token.email || '').toLowerCase();
    const isSuperAdmin = email === 'safeness.c.a@gmail.com';
    const userDoc = await db.collection('users').doc(token.uid).get();
    const data = userDoc.data();
    const role = data?.role;
    const active = data?.status === 'active';
    if (!isSuperAdmin && (!active || !['admin', 'editor', 'supervisor'].includes(role))) {
      res.status(403).json({ error: 'No tienes permisos para esta operación.' });
      return;
    }
    req.authUid = token.uid;
    req.authEmail = email;
    next();
  } catch (error) {
    console.warn('API authentication failed', error instanceof Error ? error.message : error);
    res.status(401).json({ error: 'La sesión no es válida o ha caducado.' });
  }
}

const chatRequests = new Map<string, { count: number; resetAt: number }>();
app.post('/chat', async (req: Request, res: Response) => {
  const ip = String(req.headers['x-forwarded-for'] || req.ip || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const record = chatRequests.get(ip);
  if (record && record.resetAt > now && record.count >= 12) {
    res.status(429).json({ error: 'Has enviado demasiadas consultas. Espera un minuto e inténtalo de nuevo.' });
    return;
  }
  chatRequests.set(ip, record && record.resetAt > now
    ? { count: record.count + 1, resetAt: record.resetAt }
    : { count: 1, resetAt: now + 60_000 });
  if (chatRequests.size > 5000) {
    for (const [key, value] of chatRequests) if (value.resetAt <= now) chatRequests.delete(key);
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  if (!message || message.length > 4000) {
    res.status(400).json({ error: 'El mensaje debe contener entre 1 y 4000 caracteres.' });
    return;
  }
  const safeHistory = history.slice(-12).flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') return [];
    const entry = item as { role?: unknown; text?: unknown };
    if ((entry.role !== 'user' && entry.role !== 'model') || typeof entry.text !== 'string') return [];
    return [{ role: entry.role, parts: [{ text: entry.text.slice(0, 4000) }] }];
  });
  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [...safeHistory, { role: 'user', parts: [{ text: message }] }],
      config: { systemInstruction: CHAT_SYSTEM_PROMPT, temperature: 0.35, maxOutputTokens: 700 },
    });
    res.json({ text: response.text || 'No pude generar una respuesta. Inténtalo de nuevo.' });
  } catch (error) {
    console.error('Gemini chat failed', error instanceof Error ? error.message : error);
    res.status(502).json({ error: 'El asistente no está disponible temporalmente. Inténtalo más tarde.' });
  }
});

const categories = ['cybersecurity', 'ai_data', 'design_thinking', 'cloud', 'project_agile', 'marketing', 'professional_skills', 'web_dev'] as const;
const categoryLabels: Record<typeof categories[number], string> = {
  cybersecurity: 'Ciberseguridad', ai_data: 'IA & Datos', design_thinking: 'Design Thinking & UX',
  cloud: 'Cloud & Computación', project_agile: 'Gestión Ágil & Proyectos', marketing: 'Marketing & Ventas',
  professional_skills: 'Soft Skills & Liderazgo', web_dev: 'Desarrollo Web',
};

app.post('/analyze-certificate', requireStaff, async (req: AuthedRequest, res: Response) => {
  const image = typeof req.body?.image === 'string' ? req.body.image : '';
  const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType : 'image/jpeg';
  if (!image || image.length > 7_000_000 || !/^image\/(jpeg|png|webp)$/.test(mimeType)) {
    res.status(400).json({ error: 'Imagen no válida. Usa JPEG, PNG o WebP de menos de 5 MB.' });
    return;
  }
  const base64 = image.includes(',') ? image.split(',')[1] : image;
  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [{ role: 'user', parts: [
        { inlineData: { data: base64, mimeType } },
        { text: 'Extrae los datos visibles de esta credencial. No inventes emisor, fechas, códigos ni enlaces. Si un campo no se ve, devuelve cadena vacía. El código generado debe llevar prefijo DRAFT- y nunca presentarse como código oficial. Devuelve solo JSON con code,title,issuer,issuedDate,category,description,badgeType,verificationUrl,confidence. category debe ser uno de: cybersecurity, ai_data, design_thinking, cloud, project_agile, marketing, professional_skills, web_dev. verificationUrl solo si está impresa o claramente visible en la imagen; de lo contrario cadena vacía. confidence es de 0 a 1.' }
      ] }],
      config: { responseMimeType: 'application/json', temperature: 0.1 },
    });
    const parsed = JSON.parse(response.text || '{}') as Record<string, unknown>;
    const category = categories.includes(parsed.category as typeof categories[number])
      ? parsed.category as typeof categories[number] : 'professional_skills';
    const code = typeof parsed.code === 'string' && parsed.code.trim()
      ? parsed.code.trim().slice(0, 80) : `DRAFT-${Date.now().toString(36).toUpperCase()}`;
    res.json({
      code: code.startsWith('DRAFT-') || /^[A-Z0-9][A-Z0-9._:-]{2,79}$/i.test(code) ? code : `DRAFT-${Date.now().toString(36).toUpperCase()}`,
      title: typeof parsed.title === 'string' ? parsed.title.slice(0, 240) : '',
      issuer: typeof parsed.issuer === 'string' ? parsed.issuer.slice(0, 160) : '',
      issuedDate: typeof parsed.issuedDate === 'string' ? parsed.issuedDate.slice(0, 80) : '',
      category, categoryLabel: categoryLabels[category],
      description: typeof parsed.description === 'string' ? parsed.description.slice(0, 3000) : '',
      badgeType: typeof parsed.badgeType === 'string' ? parsed.badgeType.slice(0, 100) : 'Credencial digital',
      verificationUrl: typeof parsed.verificationUrl === 'string' && /^https:\/\//i.test(parsed.verificationUrl) ? parsed.verificationUrl.slice(0, 1000) : '',
      confidence: Math.min(1, Math.max(0, Number(parsed.confidence) || 0)),
      verified: false,
    });
  } catch (error) {
    console.error('Certificate analysis failed', error instanceof Error ? error.message : error);
    res.status(502).json({ error: 'No se pudo analizar la imagen. Revisa que sea legible e inténtalo de nuevo.' });
  }
});

app.post('/rewrite-curriculum', requireStaff, async (req: AuthedRequest, res: Response) => {
  const input = req.body?.input;
  const instructions = typeof req.body?.instructions === 'string' ? req.body.instructions.slice(0, 2000) : '';
  if (!input || typeof input !== 'object' || JSON.stringify(input).length > 80_000) {
    res.status(400).json({ error: 'Los datos del currículo no son válidos o superan el límite.' });
    return;
  }
  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [{ role: 'user', parts: [{ text: `Eres redactor ejecutivo de CVs. Responde en el idioma de los datos. Nunca inventes empresas, fechas, métricas, títulos o certificaciones. Conserva valores, periodos, empresas y ubicaciones originales. Las sugerencias deben marcar datos que faltan, no completarlos con suposiciones. Instrucciones: ${instructions || 'Ninguna'}\nDatos del CV:\n${JSON.stringify(input)}\nDevuelve JSON con summary, impactMetrics, careerRoles, suggestions.` }] }],
      config: { responseMimeType: 'application/json', temperature: 0.25 },
    });
    const parsed = JSON.parse(response.text || '{}') as Record<string, unknown>;
    const inputRecord = input as Record<string, unknown>;
    res.json({
      summary: typeof parsed.summary === 'string' ? parsed.summary.slice(0, 5000) : String(inputRecord.summary || ''),
      impactMetrics: Array.isArray(parsed.impactMetrics) ? parsed.impactMetrics : inputRecord.impactMetrics || [],
      careerRoles: Array.isArray(parsed.careerRoles) ? parsed.careerRoles : inputRecord.careerRoles || [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 10) : [],
    });
  } catch (error) {
    console.error('Curriculum rewrite failed', error instanceof Error ? error.message : error);
    res.status(502).json({ error: 'No se pudo reescribir el currículo en este momento.' });
  }
});

app.use((_req, res) => res.status(404).json({ error: 'Endpoint no encontrado.' }));
export const api = onRequest({ region: 'us-central1', secrets: [geminiApiKey], maxInstances: 10, timeoutSeconds: 60 }, app);
