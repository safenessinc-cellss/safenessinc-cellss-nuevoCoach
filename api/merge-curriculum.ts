import { GoogleGenAI } from "@google/genai";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getVerifiedAuth() {
  const serviceAccountText = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountText) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON no está configurado.");
  if (!getApps().length) {
    const serviceAccount = JSON.parse(serviceAccountText);
    initializeApp({ credential: cert(serviceAccount) });
  }
  return getAuth();
}

function cleanArray(value: unknown): any[] {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];
}

function keyOf(value: any): string {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function mergeList(base: any[], incoming: any[], keyFn: (item: any) => string): any[] {
  const result = new Map<string, any>();
  base.forEach((item) => {
    const key = keyFn(item);
    if (key) result.set(key, item);
  });
  incoming.forEach((item) => {
    const key = keyFn(item);
    if (!key) return;
    const previous = result.get(key);
    if (!previous) {
      result.set(key, item);
      return;
    }
    const merged = { ...previous, ...item };
    for (const field of ["responsibilities", "achievements", "skills"]) {
      const values = [...(Array.isArray(previous[field]) ? previous[field] : []), ...(Array.isArray(item[field]) ? item[field] : [])];
      if (values.length) merged[field] = Array.from(new Set(values.filter((value) => typeof value === "string" && value.trim())));
    }
    result.set(key, merged);
  });
  return Array.from(result.values());
}

function mergeCurriculum(current: any, suggested: any) {
  const candidateInfo = { ...(current.candidateInfo || {}), ...(suggested.candidateInfo || {}) };
  for (const [key, value] of Object.entries(current.candidateInfo || {})) {
    if (typeof candidateInfo[key] === "string" && !String(candidateInfo[key]).trim()) candidateInfo[key] = value;
  }
  const careerRoles = mergeList(cleanArray(current.careerRoles), cleanArray(suggested.careerRoles), (item) => keyOf(item.title) + "|" + keyOf(item.company));
  const educationItems = mergeList(cleanArray(current.educationItems), cleanArray(suggested.educationItems), (item) => keyOf(item.title) + "|" + keyOf(item.institution));
  const impactMetrics = mergeList(cleanArray(current.impactMetrics), cleanArray(suggested.impactMetrics), (item) => keyOf(item.label));
  const languagesList = mergeList(cleanArray(current.languagesList), cleanArray(suggested.languagesList), (item) => keyOf(item.name));
  const industrialCourses = mergeList(cleanArray(current.industrialCourses), cleanArray(suggested.industrialCourses), (item) => keyOf(item.title || item.name || item.course));
  return {
    ...current,
    ...suggested,
    candidateInfo,
    careerRoles,
    educationItems,
    impactMetrics,
    languagesList,
    industrialCourses
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido." });
  try {
    const authorization = String(req.headers?.authorization || "");
    if (!authorization.startsWith("Bearer ")) return res.status(401).json({ error: "Debes iniciar sesión para importar un currículo." });
    await getVerifiedAuth().verifyIdToken(authorization.slice(7));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "La importación inteligente aún no está configurada en el servidor." });

    const body = req.body || {};
    const dataUrl = String(body.fileDataUrl || "");
    const mimeType = String(body.mimeType || "");
    const fileName = String(body.fileName || "curriculum");
    const current = body.currentCurriculum;
    if (!current || typeof current !== "object") return res.status(400).json({ error: "Falta el currículo actual para poder fusionarlo." });
    if (!dataUrl.startsWith("data:") || dataUrl.length > 4_500_000) return res.status(413).json({ error: "El archivo supera el límite permitido de 3 MB o no es válido." });

    const match = dataUrl.match(/^data:([^;,]+);base64,([\s\S]+)$/);
    if (!match) return res.status(400).json({ error: "No se pudo leer el contenido del archivo." });
    const detectedMime = match[1] || mimeType;
    const base64 = match[2];
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain", "text/markdown"];
    if (!allowed.includes(detectedMime)) return res.status(415).json({ error: "Formato no admitido. Usa PDF, JPG, PNG, WEBP, TXT o Markdown." });

    const ai = new GoogleGenAI({ apiKey });
    const prompt = [
      "Actúa como especialista en gestión de currículos profesionales. Extrae hechos del documento adjunto y fusiónalos con el currículo maestro actual.",
      "Devuelve SOLO JSON válido con esta estructura: {curriculum:{candidateInfo,impactMetrics,careerRoles,educationItems,languagesList,industrialCourses},notes:string[],conflicts:string[]}.",
      "Reglas obligatorias: no inventes fechas, empresas, títulos, diplomas, métricas, competencias ni certificaciones. Conserva toda la información útil del currículo actual. Añade experiencia, estudios, idiomas y formación del documento antiguo si no existen en el actual. Deduplica por equivalencia semántica, no solo coincidencia exacta. Cuando dos registros sean el mismo, combina detalles sin perder responsabilidades o logros únicos. Mantén cronología y nombres coherentes. Prioriza información explícita y específica; no asumas que un documento más reciente es correcto en todos los campos. Si hay contradicciones relevantes, conserva el dato actual y describe la discrepancia en conflicts para revisión humana. No marques certificados como verificados si el documento no aporta prueba verificable. Distingue certificaciones oficiales de cursos, módulos, vídeos, planes y recursos. Mantén el idioma español salvo que los datos originales deban conservarse en otro idioma.",
      "El objeto curriculum debe contener el currículo fusionado completo y usar los mismos nombres de campos que el currículo actual. No elimines registros actuales solo porque no aparezcan en el documento antiguo.",
      "CURRÍCULO ACTUAL (JSON): " + JSON.stringify(current),
      "NOMBRE DEL ARCHIVO: " + fileName
    ].join("\n\n");

    let contents: any[];
    if (detectedMime === "text/plain" || detectedMime === "text/markdown") {
      const textContent = Buffer.from(base64, "base64").toString("utf8");
      if (textContent.length > 120_000) return res.status(413).json({ error: "El documento de texto es demasiado largo para una sola importación." });
      contents = [{ role: "user", parts: [{ text: prompt + "\n\nDOCUMENTO A FUSIONAR:\n" + textContent }] }];
    } else {
      contents = [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: detectedMime, data: base64 } }] }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { responseMimeType: "application/json" }
    });
    const outputText = response.text || "";
    let parsed: any;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      return res.status(502).json({ error: "La IA no devolvió una fusión válida. Intenta con un PDF más legible." });
    }
    if (!parsed.curriculum || typeof parsed.curriculum !== "object") return res.status(502).json({ error: "La respuesta no contiene un currículo fusionado válido." });

    const curriculum = mergeCurriculum(current, parsed.curriculum);
    return res.status(200).json({
      curriculum,
      notes: Array.isArray(parsed.notes) ? parsed.notes.filter((item: unknown) => typeof item === "string").slice(0, 20) : [],
      conflicts: Array.isArray(parsed.conflicts) ? parsed.conflicts.filter((item: unknown) => typeof item === "string").slice(0, 20) : []
    });
  } catch (error) {
    console.error("Error fusionando currículo", error);
    const message = error instanceof Error ? error.message : "Error interno.";
    if (message.includes("FIREBASE_SERVICE_ACCOUNT_JSON")) return res.status(503).json({ error: "El servicio de importación necesita configurar Firebase Admin en el servidor." });
    return res.status(500).json({ error: "No se pudo fusionar el currículo. Comprueba la configuración del servidor e inténtalo de nuevo." });
  }
}
