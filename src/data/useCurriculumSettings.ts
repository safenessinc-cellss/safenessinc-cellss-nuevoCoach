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
    candidateInfo: { ...DEFAULT_CURRICULUM_SETTINGS.candidateInfo, ...(parsed.candidateInfo || {}) },
    impactMetrics: Array.isArray(parsed.impactMetrics) ? parsed.impactMetrics : DEFAULT_CURRICULUM_SETTINGS.impactMetrics,
    careerRoles: sortCareerRoles(Array.isArray(parsed.careerRoles) ? parsed.careerRoles : DEFAULT_CURRICULUM_SETTINGS.careerRoles),
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
  if (parsed.professionalAnalysis !== undefined && parsed.professionalAnalysis !== null) {
    normalized.professionalAnalysis = parsed.professionalAnalysis;
  }
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
