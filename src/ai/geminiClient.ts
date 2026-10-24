// ============================================================
// Cliente Gemini para el dashboard
// Requiere VITE_GEMINI_API_KEY en .env.local
// ============================================================
import { GoogleGenAI } from '@google/genai';

const API_KEY: string | undefined =
  (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  (import.meta as any).env?.GEMINI_API_KEY;  // fallback por compatibilidad

const MODEL = 'gemini-flash-latest';

function getClient(): GoogleGenAI {
  if (!API_KEY) {
    throw new Error(
      'Falta VITE_GEMINI_API_KEY en .env.local. ' +
      'Créala desde https://aistudio.google.com/apikey y reinicia npm run dev.'
    );
  }
  return new GoogleGenAI({ apiKey: API_KEY });
}

export type CertificateCategory =
  | 'cybersecurity' | 'ai_data' | 'design_thinking' | 'cloud'
  | 'project_agile' | 'marketing' | 'professional_skills' | 'web_dev';

export interface ExtractedCertificate {
  code: string;
  title: string;
  issuer: string;
  issuedDate: string;
  category: CertificateCategory;
  categoryLabel: string;
  description: string;
  badgeType: string;
  verificationUrl: string;
  confidence: number;
}

const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  cybersecurity: 'Ciberseguridad',
  ai_data: 'IA & Datos',
  design_thinking: 'Design Thinking & UX',
  cloud: 'Cloud & Computación',
  project_agile: 'Gestión Ágil & Proyectos',
  marketing: 'Marketing & Ventas',
  professional_skills: 'Soft Skills & Liderazgo',
  web_dev: 'Desarrollo Web',
};

function parseJson(text: string): any {
  const clean = text.trim().replace(/^```json\s*/, '').replace(/```$/, '').trim();
  try { return JSON.parse(clean); }
  catch { throw new Error('Respuesta IA inválida: ' + clean.slice(0, 200)); }
}

export async function analyzeCertificateImage(
  base64DataUrl: string,
  mimeType: string = 'image/jpeg'
): Promise<ExtractedCertificate> {
  const ai = getClient();
  const base64 = base64DataUrl.includes(',') ? base64DataUrl.split(',')[1] : base64DataUrl;

  const prompt = `Eres experto en certificaciones profesionales. Analiza esta imagen y extrae sus datos con MÁXIMA precisión.

REGLAS:
1. Si no ves un código, genera "PLAN-" + 12 hex chars aleatorios.
2. "category" debe ser EXACTAMENTE uno de: cybersecurity, ai_data, design_thinking, cloud, project_agile, marketing, professional_skills, web_dev.
3. "description": 60-200 palabras describiendo lo que acredita. Si es ISO, menciona norma y año.
4. "badgeType": "Credencial Digital", "Certificado de Auditor Líder", "Diploma", "Constancia", o "Badge".
5. "verificationUrl": si hay URL en la imagen, extráela. Si no, "https://www.credly.com/users/deuwy-medina".
6. "issuedDate": "DD Month YYYY" (ej: "21 July 2025"), o "" si no es visible.
7. "confidence": 0-1, qué tan seguro estás (1.0 = todos los campos legibles).

Devuelve SOLO el JSON, sin markdown:
{"code":"PLAN-XXXXXXXXXXXX","title":"...","issuer":"...","issuedDate":"...","category":"...","categoryLabel":"...","description":"...","badgeType":"...","verificationUrl":"https://...","confidence":0.95}`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{
      role: 'user',
      parts: [
        { inlineData: { data: base64, mimeType } },
        { text: prompt },
      ],
    }],
    config: { responseMimeType: 'application/json', temperature: 0.2 },
  });

  const parsed = parseJson(response.text || '{}');
  const cat: CertificateCategory = (Object.keys(CATEGORY_LABELS) as CertificateCategory[]).includes(parsed.category)
    ? parsed.category
    : 'professional_skills';

  return {
    code: String(parsed.code || `PLAN-${Math.random().toString(16).slice(2, 14).toUpperCase()}`),
    title: String(parsed.title || 'Certificado sin título'),
    issuer: String(parsed.issuer || 'Emisor desconocido'),
    issuedDate: String(parsed.issuedDate || ''),
    category: cat,
    categoryLabel: CATEGORY_LABELS[cat],
    description: String(parsed.description || ''),
    badgeType: String(parsed.badgeType || 'Credencial Digital'),
    verificationUrl: String(parsed.verificationUrl || 'https://www.credly.com/users/deuwy-medina'),
    confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0.5)),
  };
}

// ============================================================
// Reescritura del CV
// ============================================================
export interface CurriculumRewriteInput {
  summary: string;
  impactMetrics: Array<{ value: string; label: string; detail: string }>;
  careerRoles: Array<{
    period: string; title: string; company: string; location: string;
    responsibilities: string[]; achievements?: string[];
  }>;
  educationItems: Array<{ period: string; title: string; institution: string; description?: string }>;
  certificateTitles: string[];
}

export interface CurriculumRewriteOutput {
  summary: string;
  impactMetrics: Array<{ value: string; label: string; detail: string }>;
  careerRoles: CurriculumRewriteInput['careerRoles'];
  suggestions: string[];
}

export async function rewriteCurriculum(
  input: CurriculumRewriteInput,
  userInstructions: string = ''
): Promise<CurriculumRewriteOutput> {
  const ai = getClient();

  const prompt = `Eres redactor ejecutivo senior especializado en CVs de consultores ISO, calidad y coaching.

INSTRUCCIONES DEL USUARIO: ${userInstructions || 'Ninguna'}

REGLAS ESTRICTAS:
1. NO inventes empresas, fechas ni números. Solo reformula lo que existe.
2. "summary": párrafo de 80-120 palabras, tercera persona, incluye logros cuantitativos y menciona 2-3 certificaciones clave.
3. Cada "responsibility" empieza con verbo infinitivo y es más concreta que la original.
4. Cada "achievement" cuantifica si es posible. Máx 4 por rol.
5. NO cambies "period", "company", "location" ni "value" de impactMetrics.
6. "suggestions": 3-5 acciones concretas para mejorar el CV (ej: "Añadir certificado X al resumen", "Cuantificar logro Y con %").

CV ACTUAL:
${JSON.stringify(input, null, 2)}

Devuelve SOLO el JSON:
{"summary":"...","impactMetrics":[{"value":"30%","label":"...","detail":"..."}],"careerRoles":[{"period":"...","title":"...","company":"...","location":"...","responsibilities":["..."],"achievements":["..."]}],"suggestions":["...","..."]}`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { responseMimeType: 'application/json', temperature: 0.4 },
  });

  const parsed = parseJson(response.text || '{}');
  return {
    summary: String(parsed.summary || input.summary),
    impactMetrics: Array.isArray(parsed.impactMetrics) ? parsed.impactMetrics : input.impactMetrics,
    careerRoles: Array.isArray(parsed.careerRoles) ? parsed.careerRoles : input.careerRoles,
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
  };
}
