import { GoogleGenAI } from '@google/genai';

type TranslationMetric = { value: string; label: string; detail: string };
type TranslationRole = {
  period: string;
  title: string;
  company: string;
  location: string;
  responsibilities: string[];
  achievements?: string[];
};
type TranslationEducation = {
  period: string;
  title: string;
  institution: string;
  description?: string;
  kind?: 'education' | 'course' | 'credential';
};
type TranslationInput = {
  summary: string;
  impactMetrics: TranslationMetric[];
  careerRoles: TranslationRole[];
  educationItems: TranslationEducation[];
  additionalTexts: string[];
};

const requests = new Map<string, { count: number; resetAt: number }>();
const languages: Record<string, string> = {
  es: 'Spanish', en: 'English', pt: 'Portuguese (Brazilian Portuguese)', it: 'Italian',
};

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const ip = String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .split(',')[0].trim();
  const now = Date.now();
  const current = requests.get(ip);
  if (current && current.resetAt > now && current.count >= 4) {
    return res.status(429).json({ error: 'Se alcanzó el límite temporal de traducciones. Espera un minuto e inténtalo de nuevo.' });
  }
  requests.set(ip, current && current.resetAt > now
    ? { count: current.count + 1, resetAt: current.resetAt }
    : { count: 1, resetAt: now + 60_000 });
  if (requests.size > 5000) {
    for (const [key, value] of requests) if (value.resetAt <= now) requests.delete(key);
  }

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return null; } })() : req.body;
  const input = body?.input as TranslationInput | undefined;
  const targetLanguage = body?.targetLanguage;
  if (!input || typeof input !== 'object' || !languages[targetLanguage] ||
      JSON.stringify(input).length > 100_000 ||
      typeof input.summary !== 'string' ||
      !Array.isArray(input.impactMetrics) || input.impactMetrics.length > 30 ||
      !Array.isArray(input.careerRoles) || input.careerRoles.length > 50 ||
      !Array.isArray(input.educationItems) || input.educationItems.length > 300 ||
      !Array.isArray(input.additionalTexts) || input.additionalTexts.length > 100 ||
      !input.additionalTexts.every((text) => typeof text === 'string' && text.length <= 3000)) {
    return res.status(400).json({ error: 'Los datos de traducción no son válidos o superan el límite permitido.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'La traducción automática no está configurada en el servidor.' });
  }

  const prompt = [
    'You are a professional executive-CV translator. Translate all human-readable descriptive content into ' + languages[targetLanguage] + '.',
    'Return valid JSON only, with keys: summary, impactMetrics, careerRoles, educationItems, additionalTexts.',
    'TRANSLATION ONLY. Do not rewrite, summarize, embellish, remove, add, infer, or invent information.',
    'Preserve the exact number, order, and structure of every array and nested list.',
    'Preserve all numeric values, percentages, currency values, URLs, email addresses, product names, company names, locations, institution names, acronyms, standards (ISO, IRCA, IATF, JIT, VSM, KPI, 8D, RNC, etc.) and codes exactly. Localize month names and words meaning current/present in date ranges without changing the dates or their numeric components.',
    'For careerRoles, translate title, period wording, responsibilities, and achievements. Keep company and location unchanged.',
    'For impactMetrics, translate label and detail; keep value unchanged.',
    'For educationItems, translate title and description for kinds "education" and "course"; localize month names in period only when present, without changing the date. Keep institution unchanged. For kind "credential", preserve the title exactly as the official credential name and keep institution unchanged. Keep the kind field unchanged.',
    'Translate each additionalTexts item independently and return the same number of items in the same order. If text is already in the target language, keep it natural and correct.',
    'Do not return markdown or explanations.',
    'INPUT JSON:',
    JSON.stringify(input),
  ].join('\n');

  try {
    const ai = new GoogleGenAI({ apiKey });
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

    return res.status(200).json({
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      impactMetrics: input.impactMetrics.map((item, index) => ({
        value: String(item.value ?? ''),
        label: typeof translatedMetrics[index]?.label === 'string' ? translatedMetrics[index].label : '',
        detail: typeof translatedMetrics[index]?.detail === 'string' ? translatedMetrics[index].detail : '',
      })),
      careerRoles: input.careerRoles.map((item, index) => ({
        period: typeof translatedRoles[index]?.period === 'string' ? translatedRoles[index].period : '',
        title: typeof translatedRoles[index]?.title === 'string' ? translatedRoles[index].title : '',
        company: String(item.company ?? ''),
        location: String(item.location ?? ''),
        responsibilities: (Array.isArray(item.responsibilities) ? item.responsibilities : []).map((_: unknown, j: number) =>
          typeof translatedRoles[index]?.responsibilities?.[j] === 'string' ? translatedRoles[index].responsibilities[j] : ''),
        achievements: (Array.isArray(item.achievements) ? item.achievements : []).map((_: unknown, j: number) =>
          typeof translatedRoles[index]?.achievements?.[j] === 'string' ? translatedRoles[index].achievements[j] : ''),
      })),
      educationItems: input.educationItems.map((item, index) => ({
        period: typeof translatedEducation[index]?.period === 'string' ? translatedEducation[index].period : '',
        title: item.kind === 'credential'
          ? String(item.title ?? '')
          : (typeof translatedEducation[index]?.title === 'string' ? translatedEducation[index].title : ''),
        institution: String(item.institution ?? ''),
        description: typeof translatedEducation[index]?.description === 'string' ? translatedEducation[index].description : '',
        kind: String(item.kind || 'education'),
      })),
      additionalTexts: input.additionalTexts.map((_: string, index: number) =>
        typeof translatedAdditional[index] === 'string' ? translatedAdditional[index] : ''),
    });
  } catch (error) {
    console.error('Curriculum translation failed:', error instanceof Error ? error.message : error);
    return res.status(502).json({ error: 'No se pudo completar la traducción del currículo. No se ha generado el PDF.' });
  }
}
