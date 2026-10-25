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
const CHUNK_SIZE = 20;
const MAX_EDUCATION_ITEMS = 1200;
const MAX_ADDITIONAL_TEXTS = 200;

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  // This public browser endpoint is only intended to be called by our own site.
  // The check is a browser-origin safeguard, not a substitute for distributed rate limiting.
  const origin = req.headers?.origin;
  if (typeof origin !== 'string') {
    return res.status(403).json({ error: 'Origen de solicitud no permitido.' });
  }
  let originHost = '';
  try {
    const parsedOrigin = new URL(origin);
    if (parsedOrigin.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && parsedOrigin.protocol === 'http:')) {
      return res.status(403).json({ error: 'Origen de solicitud no permitido.' });
    }
    originHost = parsedOrigin.hostname.toLowerCase();
  } catch {
    return res.status(403).json({ error: 'Origen de solicitud no permitido.' });
  }
  const trustedOrigin = originHost === 'coach-iso.eu' ||
    originHost === 'www.coach-iso.eu' ||
    /^safenessinc-cellss-nuevo-coach(?:-[a-z0-9]+)*-safeness\.vercel\.app$/.test(originHost) ||
    (process.env.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(originHost));
  if (!trustedOrigin) {
    return res.status(403).json({ error: 'Origen de solicitud no permitido.' });
  }

  const ip = String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .split(',')[0].trim();
  const now = Date.now();
  const current = requests.get(ip);
  if (current && current.resetAt > now && current.count >= 60) {
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
  const rawLanguageCode = body?.targetLanguage;
  let targetLanguage = '';
  if (typeof rawLanguageCode === 'string' && /^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/.test(rawLanguageCode)) {
    try {
      targetLanguage = Intl.getCanonicalLocales(rawLanguageCode)[0] || '';
    } catch {
      targetLanguage = '';
    }
  }
  const validLanguageCode = Boolean(targetLanguage);
  let targetLanguageName = '';
  if (validLanguageCode) {
    try {
      targetLanguageName = languages[targetLanguage.toLowerCase()] ||
        new Intl.DisplayNames(['en'], { type: 'language' }).of(targetLanguage) || targetLanguage;
    } catch {
      targetLanguageName = targetLanguage;
    }
  }
  const batchOnly = body?.batchOnly === true;
  const baseOnly = body?.baseOnly === true;
  if (!input || typeof input !== 'object' || !validLanguageCode ||
      JSON.stringify(input).length > 250_000 ||
      typeof input.summary !== 'string' || input.summary.length > 12000 ||
      !Array.isArray(input.impactMetrics) || input.impactMetrics.length > 30 ||
      !Array.isArray(input.careerRoles) || input.careerRoles.length > 60 ||
      !Array.isArray(input.educationItems) || input.educationItems.length > MAX_EDUCATION_ITEMS ||
      !Array.isArray(input.additionalTexts) || input.additionalTexts.length > MAX_ADDITIONAL_TEXTS ||
      !input.impactMetrics.every((item) => item && typeof item.value === 'string' && typeof item.label === 'string' && typeof item.detail === 'string') ||
      !input.careerRoles.every((item) => item && typeof item.title === 'string' && typeof item.period === 'string' &&
        typeof item.company === 'string' && typeof item.location === 'string' && Array.isArray(item.responsibilities) &&
        item.responsibilities.every((text) => typeof text === 'string') &&
        (item.achievements === undefined || (Array.isArray(item.achievements) && item.achievements.every((text) => typeof text === 'string')))) ||
      !input.educationItems.every((item) => item && typeof item.title === 'string' && typeof item.period === 'string' &&
        typeof item.institution === 'string' && (item.description === undefined || typeof item.description === 'string')) ||
      !input.additionalTexts.every((text) => typeof text === 'string' && text.length <= 3000)) {
    return res.status(400).json({ error: 'Los datos de traducción no son válidos o superan el límite permitido.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'La traducción automática no está configurada en el servidor.' });
  }

  // Bound each provider request so retries cannot consume Vercel's full 60-second budget.
  const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 18_000 } });
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const generateJson = async (prompt: string, maxOutputTokens = 10000): Promise<Record<string, any>> => {
    // Keep the retry budget below Vercel's 60-second function limit.
    // Use a stable, lighter model first, then one fallback instead of serially
    // trying several aliases that can each stall under provider load.
    const attempts: Array<{ model: string; delay: number }> = [
      { model: 'gemini-3.5-flash-lite', delay: 0 },
      { model: 'gemini-3.6-flash', delay: 900 },
    ];
    let lastError: unknown;
    for (const attempt of attempts) {
      try {
        if (attempt.delay) await sleep(attempt.delay);
        const response = await ai.models.generateContent({
          model: attempt.model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { responseMimeType: 'application/json', temperature: 0.1, maxOutputTokens },
        });
        const text = response.text || '{}';
        return JSON.parse(text) as Record<string, any>;
      } catch (error) {
        lastError = error;
        const detail = error instanceof Error ? error.message : String(error);
        console.warn(`Gemini translation attempt failed (${attempt.model}):`, detail.slice(0, 300));
        // Do not waste the remaining budget retrying malformed requests or other
        // permanent failures. Only retry rate limits, overloads and network timeouts.
        const retryable = /503|UNAVAILABLE|high demand|overloaded|429|RESOURCE_EXHAUSTED|timeout|timed out|ECONNRESET|ETIMEDOUT/i.test(detail);
        if (!retryable) throw error;
      }
    }
    throw lastError instanceof Error ? lastError : new Error('El servicio de traducción no respondió después de varios intentos.');
  };

  const baseRules = [
    'You are a professional executive-CV translator. Translate all human-readable descriptive content into ' + targetLanguageName + ' (language code: ' + targetLanguage + ').',
    'Return valid JSON only. Do not return markdown, comments, or explanations.',
    'TRANSLATION ONLY. Do not rewrite, summarize, embellish, remove, add, infer, or invent information.',
    'Preserve exact array counts, order, and nested list structure.',
    'Preserve numeric values, percentages, currency values, URLs, email addresses, product and company names, locations, institution names, acronyms, standards (ISO, IRCA, IATF, JIT, VSM, KPI, 8D, RNC, etc.) and codes exactly.',
    'Localize month names and words meaning current/present in date ranges without changing dates or numeric components.',
    'If a text is already in the target language, correct it to natural professional usage without changing its meaning.',
  ].join('\n');

  try {
    // Translate the executive summary, metrics and work history separately from
    // the potentially large training inventory to keep output complete.
    // A request can translate only one inventory chunk. This keeps each serverless
    // invocation comfortably below Vercel's function timeout for large CVs.
    const base = batchOnly ? {} : await generateJson([
      baseRules,
      'Return keys: summary, impactMetrics, careerRoles.',
      'For careerRoles, translate title, period wording, responsibilities and achievements. Keep company and location unchanged.',
      'For impactMetrics, translate label and detail; keep value unchanged.',
      'INPUT JSON:',
      JSON.stringify({ summary: input.summary, impactMetrics: input.impactMetrics, careerRoles: input.careerRoles }),
    ].join('\n'), 10000);

    const batches: Array<{ educationItems: TranslationEducation[]; additionalTexts: string[] }> = [];
    const batchCount = baseOnly ? 0 : Math.max(
      Math.ceil(input.educationItems.length / CHUNK_SIZE),
      Math.ceil(input.additionalTexts.length / CHUNK_SIZE),
      1,
    );
    for (let batchIndex = 0; batchIndex < batchCount; batchIndex += 1) {
      batches.push({
        educationItems: input.educationItems.slice(batchIndex * CHUNK_SIZE, (batchIndex + 1) * CHUNK_SIZE),
        additionalTexts: input.additionalTexts.slice(batchIndex * CHUNK_SIZE, (batchIndex + 1) * CHUNK_SIZE),
      });
    }

    const translatedEducation: TranslationEducation[] = [];
    const translatedAdditionalTexts: string[] = [];
    // Keep concurrency bounded so large CVs remain reliable without flooding the model.
    for (let offset = 0; offset < batches.length; offset += 3) {
      const group = batches.slice(offset, offset + 3);
      const results = await Promise.all(group.map(async (batch) => {
        const parsed = await generateJson([
          baseRules,
          'Return JSON with keys educationItems and additionalTexts.',
          'For educationItems: translate title and description for kinds "education" and "course"; translate month names in period only when present. Keep institution unchanged.',
          'For kind "credential", preserve title exactly as the official credential name and keep institution unchanged. Keep kind unchanged.',
          'Translate each additionalTexts string and return the same count and order.',
          'INPUT JSON:',
          JSON.stringify(batch),
        ].join('\n'), 12000);
        return { parsed, batch };
      }));
      results.forEach(({ parsed, batch }) => {
        const translatedItems = Array.isArray(parsed.educationItems) ? parsed.educationItems : [];
        const translatedTexts = Array.isArray(parsed.additionalTexts) ? parsed.additionalTexts : [];
        batch.educationItems.forEach((item, index) => {
          const out = translatedItems[index] || {};
          translatedEducation.push({
            period: typeof out.period === 'string' ? out.period : '',
            title: item.kind === 'credential' ? item.title : (typeof out.title === 'string' ? out.title : ''),
            institution: item.institution,
            description: typeof out.description === 'string' ? out.description : '',
            kind: item.kind || 'education',
          });
        });
        batch.additionalTexts.forEach((_, index) => {
          translatedAdditionalTexts.push(typeof translatedTexts[index] === 'string' ? translatedTexts[index] : '');
        });
      });
    }

    const translatedMetrics = Array.isArray(base.impactMetrics) ? base.impactMetrics : [];
    const translatedRoles = Array.isArray(base.careerRoles) ? base.careerRoles : [];
    const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

    // Fail closed on malformed/partial model output. The browser also validates
    // the assembled curriculum, but the API must never report incomplete data as success.
    if (!batchOnly && (
      !hasText(base.summary) ||
      translatedMetrics.length !== input.impactMetrics.length ||
      translatedRoles.length !== input.careerRoles.length ||
      translatedMetrics.some((item, index) =>
        !hasText(item?.label) || (Boolean(input.impactMetrics[index].detail.trim()) && !hasText(item?.detail))) ||
      translatedRoles.some((role, index) => {
        const source = input.careerRoles[index];
        return !hasText(role?.title) ||
          (Boolean(source.period.trim()) && !hasText(role?.period)) ||
          !Array.isArray(role?.responsibilities) ||
          role.responsibilities.length !== source.responsibilities.length ||
          role.responsibilities.some((value: unknown, j: number) =>
            Boolean(source.responsibilities[j]?.trim()) && !hasText(value)) ||
          !Array.isArray(role?.achievements) ||
          role.achievements.length !== (source.achievements || []).length ||
          role.achievements.some((value: unknown, j: number) =>
            Boolean(source.achievements?.[j]?.trim()) && !hasText(value));
      })
    )) {
      throw new Error('La traducción de resumen, métricas o experiencia llegó incompleta.');
    }

    if (!baseOnly && (
      translatedEducation.length !== input.educationItems.length ||
      translatedEducation.some((item, index) =>
        !hasText(item.title) ||
        (Boolean(input.educationItems[index].description?.trim()) && !hasText(item.description))) ||
      translatedAdditionalTexts.length !== input.additionalTexts.length ||
      translatedAdditionalTexts.some((value) => !hasText(value))
    )) {
      throw new Error('La traducción de formación o textos complementarios llegó incompleta.');
    }
    return res.status(200).json({
      summary: typeof base.summary === 'string' ? base.summary : '',
      impactMetrics: input.impactMetrics.map((item, index) => ({
        value: String(item.value ?? ''),
        label: typeof translatedMetrics[index]?.label === 'string' ? translatedMetrics[index].label : '',
        detail: typeof translatedMetrics[index]?.detail === 'string' ? translatedMetrics[index].detail : '',
      })),
      careerRoles: input.careerRoles.map((item, index) => ({
        period: typeof translatedRoles[index]?.period === 'string' ? translatedRoles[index].period : '',
        title: typeof translatedRoles[index]?.title === 'string' ? translatedRoles[index].title : '',
        company: item.company,
        location: item.location,
        responsibilities: item.responsibilities.map((_, j) =>
          typeof translatedRoles[index]?.responsibilities?.[j] === 'string' ? translatedRoles[index].responsibilities[j] : ''),
        achievements: (item.achievements || []).map((original, j) =>
          typeof translatedRoles[index]?.achievements?.[j] === 'string' && translatedRoles[index].achievements[j].trim()
            ? translatedRoles[index].achievements[j] : original),
      })),
      educationItems: translatedEducation,
      additionalTexts: translatedAdditionalTexts,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error('Curriculum translation failed:', detail);
    const temporarilyUnavailable = /503|UNAVAILABLE|high demand|overloaded|429|RESOURCE_EXHAUSTED/i.test(detail);
    return res.status(temporarilyUnavailable ? 503 : 502).json({
      error: temporarilyUnavailable
        ? 'El servicio de traducción está temporalmente saturado incluso después de reintentar. No se generó el PDF; vuelve a intentarlo en unos segundos.'
        : 'No se pudo completar la traducción del currículo. No se ha generado el PDF.',
    });
  }
}
