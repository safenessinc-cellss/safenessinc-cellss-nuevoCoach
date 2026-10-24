import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import type { Auth } from 'firebase-admin/auth';
import { FieldValue, type Firestore } from 'firebase-admin/firestore';

type AuthedRequest = Request & { authUid?: string; authEmail?: string };

export interface HttpAppOptions {
  db: Firestore;
  auth: Auth;
  getGeminiApiKey: () => string;
}

export function createHttpApp({ db, auth, getGeminiApiKey }: HttpAppOptions) {
const app = express();
app.use(cors({ origin: true, methods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '4mb' }));

const CHAT_SYSTEM_PROMPT = `Eres el asistente virtual de Robert Terán, ingeniero, economista y especialista en sistemas de gestión integral. Responde en el idioma del usuario, de forma profesional, clara y prudente. Ayuda con servicios de auditoría ISO, calidad, optimización de procesos, coaching y agendamiento. Para agendar, indica que la persona puede visitar /agendar. No inventes certificaciones, precios, disponibilidad ni resultados que no estén en el contexto.`;

type AuthedRequest = Request & { authUid?: string; authEmail?: string };

async function requireStaff(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Se requiere iniciar sesión.' });
      return;
    }
    const token = await auth.verifyIdToken(header.slice(7));
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
app.post(['/chat', '/api/chat'], async (req: Request, res: Response) => {
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
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [...safeHistory, { role: 'user', parts: [{ text: message }] }],
      config: { systemInstruction: CHAT_SYSTEM_PROMPT, temperature: 0.35, maxOutputTokens: 700 },
    });
    const replyText = response.text || 'No pude generar una respuesta. Inténtalo de nuevo.';
    let category = 'Consulta General';
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('9001') || lowerMessage.includes('calidad')) category = 'ISO 9001';
    else if (lowerMessage.includes('27001') || lowerMessage.includes('seguridad')) category = 'ISO 27001';
    else if (lowerMessage.includes('14001') || lowerMessage.includes('45001') || lowerMessage.includes('sgi')) category = 'Auditorías SGI';
    else if (lowerMessage.includes('coaching') || lowerMessage.includes('liderazgo') || lowerMessage.includes('ibm')) category = 'Coaching IBM';
    else if (lowerMessage.includes('agendar') || lowerMessage.includes('cita') || lowerMessage.includes('reserva')) category = 'Agendamiento';
    else if (lowerMessage.includes('proceso') || lowerMessage.includes('lean') || lowerMessage.includes('six sigma')) category = 'Optimización Procesos';
    await db.collection('ai_activity_logs').add({
      userPrompt: message.slice(0, 4000),
      aiResponseSnippet: replyText.slice(0, 150),
      category,
      timestamp: FieldValue.serverTimestamp(),
      dateStr: new Date().toISOString().split('T')[0],
      source: 'Widget Asistente Virtual',
    }).catch(logError => console.warn('Could not persist AI activity log', logError));
    res.json({ text: replyText });
  } catch (error) {
    console.error('Gemini chat failed', error instanceof Error ? error.message : error);
    res.status(502).json({ error: 'El asistente no está disponible temporalmente. Inténtalo más tarde.' });
  }
});


app.post(['/admin-assistant', '/api/admin-assistant'], requireStaff, async (req: AuthedRequest, res: Response) => {
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
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [...safeHistory, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: `Eres el asistente interno de administración de Coach ISO. Ayudas al personal autorizado a comprender el panel, planificar tareas, analizar problemas y preparar cambios de forma profesional. El usuario autenticado es ${req.authEmail || 'personal autorizado'}. Este endpoint solo permite conversar: no afirmes que has cambiado datos, ejecutado comandos o publicado software. No solicites ni reveles contraseñas, claves API ni otros secretos. Para operaciones que cambien datos, explica que necesitarán herramientas específicas, permisos explícitos, auditoría y confirmación. Si no tienes información suficiente del sistema, dilo claramente y no inventes cifras ni estados.`,
        temperature: 0.25,
        maxOutputTokens: 900,
      },
    });
    res.json({ text: response.text || 'No pude generar una respuesta. Inténtalo de nuevo.' });
  } catch (error) {
    console.error('Admin assistant failed', error instanceof Error ? error.message : error);
    res.status(502).json({ error: 'El asistente administrativo no está disponible temporalmente.' });
  }
});

const categories = ['cybersecurity', 'ai_data', 'design_thinking', 'cloud', 'project_agile', 'marketing', 'professional_skills', 'web_dev'] as const;
const categoryLabels: Record<typeof categories[number], string> = {
  cybersecurity: 'Ciberseguridad', ai_data: 'IA & Datos', design_thinking: 'Design Thinking & UX',
  cloud: 'Cloud & Computación', project_agile: 'Gestión Ágil & Proyectos', marketing: 'Marketing & Ventas',
  professional_skills: 'Soft Skills & Liderazgo', web_dev: 'Desarrollo Web',
};

app.post(['/analyze-certificate', '/api/analyze-certificate'], requireStaff, async (req: AuthedRequest, res: Response) => {
  const image = typeof req.body?.image === 'string' ? req.body.image : '';
  const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType : 'image/jpeg';
  if (!image || image.length > 4_000_000 || !/^image\/(jpeg|png|webp)$/.test(mimeType)) {
    res.status(400).json({ error: 'Imagen no válida. Usa JPEG, PNG o WebP de tamaño reducido (máximo aproximado de 3 MB antes de codificar).' });
    return;
  }
  const base64 = image.includes(',') ? image.split(',')[1] : image;
  try {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
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


// Public translation endpoint for the public curriculum export. It does not mutate data;
// limit requests by IP because each successful call invokes the Gemini API.
const curriculumTranslationRequests = new Map<string, { count: number; resetAt: number }>();
app.post(['/translate-curriculum', '/api/translate-curriculum'], async (req: Request, res: Response) => {
  const ip = String(req.headers['x-forwarded-for'] || req.ip || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const rate = curriculumTranslationRequests.get(ip);
  if (rate && rate.resetAt > now && rate.count >= 4) {
    res.status(429).json({ error: 'Se alcanzó el límite temporal de traducciones. Espera un minuto e inténtalo de nuevo.' });
    return;
  }
  curriculumTranslationRequests.set(ip, rate && rate.resetAt > now
    ? { count: rate.count + 1, resetAt: rate.resetAt }
    : { count: 1, resetAt: now + 60_000 });
  if (curriculumTranslationRequests.size > 5000) {
    for (const [key, value] of curriculumTranslationRequests) if (value.resetAt <= now) curriculumTranslationRequests.delete(key);
  }

  const input = req.body?.input;
  const targetLanguage = req.body?.targetLanguage;
  const supportedLanguages: Record<string, string> = {
    es: 'Spanish', en: 'English', pt: 'Portuguese (Brazilian Portuguese)', it: 'Italian',
  };
  if (!input || typeof input !== 'object' || Array.isArray(input) ||
      JSON.stringify(input).length > 100_000 ||
      typeof targetLanguage !== 'string' || !(targetLanguage in supportedLanguages)) {
    res.status(400).json({ error: 'Los datos de traducción no son válidos o superan el límite permitido.' });
    return;
  }

  const summary = typeof input.summary === 'string' ? input.summary : '';
  const metrics = Array.isArray(input.impactMetrics) ? input.impactMetrics : [];
  const roles = Array.isArray(input.careerRoles) ? input.careerRoles : [];
  const education = Array.isArray(input.educationItems) ? input.educationItems : [];
  const additionalTexts = Array.isArray(input.additionalTexts) ? input.additionalTexts : [];
  if (summary.length > 8000 || metrics.length > 30 || roles.length > 50 ||
      education.length > 300 || additionalTexts.length > 100 ||
      !metrics.every((item: any) => item && typeof item === 'object') ||
      !roles.every((item: any) => item && typeof item === 'object') ||
      !education.every((item: any) => item && typeof item === 'object') ||
      !additionalTexts.every((item: unknown) => typeof item === 'string' && item.length <= 3000)) {
    res.status(400).json({ error: 'El currículo contiene campos fuera de los límites de traducción.' });
    return;
  }

  const translationInput = { summary, impactMetrics: metrics, careerRoles: roles, educationItems: education, additionalTexts };
  const prompt = [
    'You are a professional executive-CV translator. Translate all human-readable descriptive content into ' + supportedLanguages[targetLanguage] + '.',
    'Return valid JSON only, with keys: summary, impactMetrics, careerRoles, educationItems, additionalTexts.',
    'TRANSLATION ONLY. Do not rewrite, summarize, embellish, remove, add, infer, or invent information.',
    'Preserve the exact number, order, and structure of every array and nested list.',
    'Preserve all numbers, percentages, currency values, dates, periods, URLs, email addresses, product names, company names, locations, institution names, acronyms, standards (ISO, IRCA, IATF, JIT, VSM, KPI, 8D, RNC, etc.) and codes exactly.',
    'For careerRoles, translate title, responsibilities, and achievements. Keep period, company, and location unchanged.',
    'For impactMetrics, translate label and detail; keep value unchanged.',
    'For educationItems, translate title and description for kinds "education" and "course"; keep institution and period unchanged. For kind "credential", preserve the title exactly as the official credential name and keep institution and period unchanged. Keep the kind field unchanged.',
    'Translate each additionalTexts item independently and return the same number of items in the same order. If text is already in the target language, keep it natural and correct.',
    'Do not return markdown or explanations.',
    'INPUT JSON:',
    JSON.stringify(translationInput),
  ].join('\n');

  try {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', temperature: 0.1, maxOutputTokens: 12000 },
    });
    const parsed = JSON.parse(response.text || '{}') as Record<string, any>;
    const translatedMetrics = Array.isArray(parsed.impactMetrics) ? parsed.impactMetrics : [];
    const translatedRoles = Array.isArray(parsed.careerRoles) ? parsed.careerRoles : [];
    const translatedEducation = Array.isArray(parsed.educationItems) ? parsed.educationItems : [];
    const translatedAdditional = Array.isArray(parsed.additionalTexts) ? parsed.additionalTexts : [];

    res.json({
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      impactMetrics: metrics.map((item: any, index: number) => ({
        value: String(item.value ?? ''),
        label: typeof translatedMetrics[index]?.label === 'string' ? translatedMetrics[index].label : '',
        detail: typeof translatedMetrics[index]?.detail === 'string' ? translatedMetrics[index].detail : '',
      })),
      careerRoles: roles.map((item: any, index: number) => ({
        period: String(item.period ?? ''),
        title: typeof translatedRoles[index]?.title === 'string' ? translatedRoles[index].title : '',
        company: String(item.company ?? ''),
        location: String(item.location ?? ''),
        responsibilities: (Array.isArray(item.responsibilities) ? item.responsibilities : []).map((_: unknown, j: number) =>
          typeof translatedRoles[index]?.responsibilities?.[j] === 'string' ? translatedRoles[index].responsibilities[j] : ''),
        achievements: (Array.isArray(item.achievements) ? item.achievements : []).map((_: unknown, j: number) =>
          typeof translatedRoles[index]?.achievements?.[j] === 'string' ? translatedRoles[index].achievements[j] : ''),
      })),
      educationItems: education.map((item: any, index: number) => ({
        period: String(item.period ?? ''),
        title: item.kind === 'credential'
          ? String(item.title ?? '')
          : (typeof translatedEducation[index]?.title === 'string' ? translatedEducation[index].title : ''),
        institution: String(item.institution ?? ''),
        description: typeof translatedEducation[index]?.description === 'string' ? translatedEducation[index].description : '',
        kind: String(item.kind || 'education'),
      })),
      additionalTexts: additionalTexts.map((_: unknown, index: number) =>
        typeof translatedAdditional[index] === 'string' ? translatedAdditional[index] : ''),
    });
  } catch (error) {
    console.error('Curriculum translation failed', error instanceof Error ? error.message : error);
    res.status(502).json({ error: 'No se pudo completar la traducción del currículo. No se ha generado el PDF.' });
  }
});

app.post(['/rewrite-curriculum', '/api/rewrite-curriculum'], requireStaff, async (req: AuthedRequest, res: Response) => {
  const input = req.body?.input;
  const instructions = typeof req.body?.instructions === 'string' ? req.body.instructions.slice(0, 2000) : '';
  if (!input || typeof input !== 'object' || JSON.stringify(input).length > 80_000) {
    res.status(400).json({ error: 'Los datos del currículo no son válidos o superan el límite.' });
    return;
  }
  try {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
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
  return app;
}
