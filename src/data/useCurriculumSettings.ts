import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  CandidateInfo,
  CareerRole,
  EducationItem,
  CANDIDATE_INFO,
  CAREER_EXPERIENCE,
  ACADEMIC_EDUCATION,
  IMPACT_METRICS,
  LANGUAGES_LIST,
  INDUSTRIAL_COURSES
} from './robertTeranCurriculumData';

export interface CurriculumPresentationAnalysis {
  executiveSummary: string;
  shortCvHeadline: string;
  shortCvFocusAreas: string[];
  professionalAreas: Array<{ area: string; summary: string; strengths: string[]; featuredCredentials: string[]; featuredCourses: string[] }>;
  recommendations: string[];
}

export interface CurriculumSettings {
  candidateInfo: CandidateInfo;
  impactMetrics: Array<{ value: string; label: string; detail: string }>;
  careerRoles: CareerRole[];
  educationItems: EducationItem[];
  languagesList: Array<{ name: string; level: string; written: string }>;
  industrialCourses: any[];
  appearance: { backgroundColor: string; sidebarColor: string; accentColor: string; textColor: string };
  professionalAnalysis?: CurriculumPresentationAnalysis;
}

export const DEFAULT_CURRICULUM_SETTINGS: CurriculumSettings = {
  candidateInfo: CANDIDATE_INFO,
  impactMetrics: IMPACT_METRICS,
  careerRoles: CAREER_EXPERIENCE,
  educationItems: ACADEMIC_EDUCATION,
  languagesList: LANGUAGES_LIST,
  industrialCourses: INDUSTRIAL_COURSES,
  appearance: { backgroundColor: '#FFFFFF', sidebarColor: '#174EA6', accentColor: '#4285F4', textColor: '#1F2937' }
};

/** Parse the first and last years from human-readable periods, including "Actualidad". */
function periodStartYear(period: unknown): number {
  const value = String(period || '');
  const years = value.match(/(?:19|20)\d{2}/g)?.map(Number) || [];
  return years.length ? Math.min(...years) : 0;
}
function periodEndYear(period: unknown): number {
  const value = String(period || '');
  if (/actualidad|presente|present|current|atualmente/i.test(value)) return 9999;
  const years = value.match(/(?:19|20)\d{2}/g)?.map(Number) || [];
  return years.length ? Math.max(...years) : periodStartYear(value);
}
function sortCareerRoles(items: CareerRole[]): CareerRole[] {
  return [...items].sort((a, b) =>
    periodEndYear(b.period) - periodEndYear(a.period) ||
    periodStartYear(b.period) - periodStartYear(a.period)
  );
}

/** Preserve saved edits while adding newly introduced default career entries to existing profiles. */
function mergeCareerRoles(savedRoles: CareerRole[] | undefined): CareerRole[] {
  const roles = new Map<string, CareerRole>();
  const keyOf = (role: CareerRole) => `${role.title.trim().toLowerCase()}|${role.company.trim().toLowerCase()}`;
  DEFAULT_CURRICULUM_SETTINGS.careerRoles.forEach((role) => roles.set(keyOf(role), role));
  (savedRoles || []).forEach((role) => roles.set(keyOf(role), role));
  return sortCareerRoles(Array.from(roles.values()));
}
function sortEducationItems(items: EducationItem[]): EducationItem[] {
  return [...items].sort((a, b) =>
    periodEndYear(b.period) - periodEndYear(a.period) ||
    periodStartYear(b.period) - periodStartYear(a.period)
  );
}
/** Remove undefined values before writing to Firestore; Firestore rejects them even in optional fields. */
function removeUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => item === undefined ? null : removeUndefined(item)) as T;
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removeUndefined(item)])
    ) as T;
  }
  return value;
}

function normalizeSettings(input: Partial<CurriculumSettings> | null | undefined): CurriculumSettings {
  const parsed = input || {};
  const appearance = { ...DEFAULT_CURRICULUM_SETTINGS.appearance, ...(parsed.appearance || {}) };
  const normalized: CurriculumSettings = {
    candidateInfo: {
      ...DEFAULT_CURRICULUM_SETTINGS.candidateInfo,
      ...(parsed.candidateInfo || {}),
      summary: parsed.candidateInfo?.summary === "Ingeniero de Producción y Calidad (Universidad Simón Bolívar), Economista, Auditor Líder en Sistemas Integrados de Gestión (ISO 9001, 14001, 45001 RAC/IRCA, IATF-16949) e IBM 2025 Executive Coach con 30 años de experiencia internacional en la industria. Especialista en optimización de procesos, gestión de la calidad, mejoría continua (Lean Manufacturing, Green Belt Six Sigma, 8D, RNC) y gestión de inventarios JIT. Con trayectoria demostrada en empresas como Rototech, Tapeçaria Palacio, D'classe Papeis y General Motors, liderando proyectos con reducción comprobada del 30% en reclamos de clientes, 25% en costos de inventarios y aumento del 15% en capacidad productiva."
        ? DEFAULT_CURRICULUM_SETTINGS.candidateInfo.summary
        : (parsed.candidateInfo?.summary || DEFAULT_CURRICULUM_SETTINGS.candidateInfo.summary)
    },
    impactMetrics: Array.isArray(parsed.impactMetrics) ? parsed.impactMetrics : DEFAULT_CURRICULUM_SETTINGS.impactMetrics,
    careerRoles: mergeCareerRoles(Array.isArray(parsed.careerRoles) ? parsed.careerRoles : undefined),
    educationItems: sortEducationItems(Array.isArray(parsed.educationItems) ? parsed.educationItems : DEFAULT_CURRICULUM_SETTINGS.educationItems),
    languagesList: Array.isArray(parsed.languagesList) ? parsed.languagesList : DEFAULT_CURRICULUM_SETTINGS.languagesList,
    industrialCourses: Array.isArray(parsed.industrialCourses) ? parsed.industrialCourses : DEFAULT_CURRICULUM_SETTINGS.industrialCourses,
    appearance: {
      ...appearance,
      backgroundColor: appearance.backgroundColor?.toUpperCase() === '#000000' ? '#FFFFFF' : (appearance.backgroundColor || '#FFFFFF'),
      sidebarColor: appearance.sidebarColor || '#174EA6',
      accentColor: appearance.accentColor || '#4285F4',
      textColor: appearance.textColor || '#1F2937'
    }
  };
  normalized.professionalAnalysis = parsed.professionalAnalysis
    ? {
        ...parsed.professionalAnalysis,
        executiveSummary: parsed.professionalAnalysis.executiveSummary || "Auditor Líder SGC IRCA (ISO 9001/14001/45001/IATF 16949) e IBM Executive Coach, con 30 años de experiencia internacional. Especialista en mejora continua, SGC y transformación organizacional, con resultados reportados de 30% menos reclamos, 25% menos costos de inventario y 15% más capacidad productiva. Complementa su perfil industrial con desarrollo de software (cinco aplicaciones en Google Play) y comportamiento humano organizacional. En 2025 obtuvo 22 credenciales oficiales y completó más de 500 actividades formativas en IA, ciberseguridad y cloud.",
        shortCvHeadline: parsed.professionalAnalysis.shortCvHeadline || "Auditor Líder SGC IRCA · IBM Executive Coach · Ingeniero y Economista · Desarrollador de Software · Especialista en Comportamiento Humano — 30 años conectando excelencia operativa, tecnología y personas.",
        shortCvFocusAreas: parsed.professionalAnalysis.shortCvFocusAreas || ["Excelencia operativa y sistemas ISO", "Transformación digital y desarrollo de software", "Comportamiento humano organizacional"],
        professionalAreas: parsed.professionalAnalysis.professionalAreas || [],
        recommendations: parsed.professionalAnalysis.recommendations || []
      }
    : {
        executiveSummary: "Auditor Líder SGC IRCA (ISO 9001/14001/45001/IATF 16949) e IBM Executive Coach, con 30 años de experiencia internacional. Especialista en mejora continua, SGC y transformación organizacional, con resultados reportados de 30% menos reclamos, 25% menos costos de inventario y 15% más capacidad productiva. Complementa su perfil industrial con desarrollo de software (cinco aplicaciones en Google Play) y comportamiento humano organizacional. En 2025 obtuvo 22 credenciales oficiales y completó más de 500 actividades formativas en IA, ciberseguridad y cloud.",
        shortCvHeadline: "Auditor Líder SGC IRCA · IBM Executive Coach · Ingeniero y Economista · Desarrollador de Software · Especialista en Comportamiento Humano — 30 años conectando excelencia operativa, tecnología y personas.",
        shortCvFocusAreas: ["Excelencia operativa y sistemas ISO", "Transformación digital y desarrollo de software", "Comportamiento humano organizacional"],
        professionalAreas: [],
        recommendations: []
      };
  return removeUndefined(normalized);
}

export function useCurriculumSettings() {
  const [curriculumData, setCurriculumData] = useState<CurriculumSettings>(() => {
    try {
      const saved = localStorage.getItem('coachiso_curriculum_settings');
      if (saved) return normalizeSettings(JSON.parse(saved));
    } catch (e) {
      console.warn('Error leyendo currículo de localStorage:', e);
    }
    return normalizeSettings(DEFAULT_CURRICULUM_SETTINGS);
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSync = (event?: Event) => {
      try {
        const detail = (event as CustomEvent<CurriculumSettings> | undefined)?.detail;
        const saved = localStorage.getItem('coachiso_curriculum_settings');
        const parsed = detail || (saved ? JSON.parse(saved) : null);
        if (parsed) setCurriculumData(normalizeSettings(parsed));
      } catch (err) {
        console.warn('Error sincronizando currículo local:', err);
      }
    };

    window.addEventListener('curriculum-updated', handleSync as EventListener);
    window.addEventListener('storage', handleSync);

    const unsub = onSnapshot(doc(db, 'settings', 'curriculum'), (snap) => {
      if (snap.exists()) {
        const merged = normalizeSettings(snap.data() as Partial<CurriculumSettings>);
        setCurriculumData(merged);
        try {
          localStorage.setItem('coachiso_curriculum_settings', JSON.stringify(merged));
        } catch (e) {
          console.warn('Error guardando currículo en localStorage:', e);
        }
      }
      setLoading(false);
    }, (error) => {
      setLoading(false);
      console.warn('Cargando currículo en modo fallback:', error);
    });

    return () => {
      window.removeEventListener('curriculum-updated', handleSync as EventListener);
      window.removeEventListener('storage', handleSync);
      unsub();
    };
  }, []);

  const updateCurriculum = async (newSettings: CurriculumSettings) => {
    const normalized = normalizeSettings(newSettings);
    setCurriculumData(normalized);
    try {
      localStorage.setItem('coachiso_curriculum_settings', JSON.stringify(normalized));
    } catch (e) {
      console.warn('Error en localStorage al actualizar currículo:', e);
    }
    window.dispatchEvent(new CustomEvent('curriculum-updated', { detail: normalized }));
    // Clean the payload defensively: optional analysis and nested editor fields may be undefined.
    await setDoc(doc(db, 'settings', 'curriculum'), removeUndefined(normalized));
  };

  return { curriculumData, updateCurriculum, loading };
}
