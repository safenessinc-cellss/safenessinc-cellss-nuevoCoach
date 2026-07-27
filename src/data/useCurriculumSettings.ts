import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
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

export interface CurriculumSettings {
  candidateInfo: CandidateInfo;
  impactMetrics: Array<{ value: string; label: string; detail: string }>;
  careerRoles: CareerRole[];
  educationItems: EducationItem[];
  languagesList: Array<{ name: string; level: string; written: string }>;
  industrialCourses: any[];
}

export const DEFAULT_CURRICULUM_SETTINGS: CurriculumSettings = {
  candidateInfo: CANDIDATE_INFO,
  impactMetrics: IMPACT_METRICS,
  careerRoles: CAREER_EXPERIENCE,
  educationItems: ACADEMIC_EDUCATION,
  languagesList: LANGUAGES_LIST,
  industrialCourses: INDUSTRIAL_COURSES
};

export function useCurriculumSettings() {
  const [curriculumData, setCurriculumData] = useState<CurriculumSettings>(() => {
    try {
      const saved = localStorage.getItem('coachiso_curriculum_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          candidateInfo: { ...DEFAULT_CURRICULUM_SETTINGS.candidateInfo, ...parsed.candidateInfo },
          impactMetrics: parsed.impactMetrics || DEFAULT_CURRICULUM_SETTINGS.impactMetrics,
          careerRoles: parsed.careerRoles || DEFAULT_CURRICULUM_SETTINGS.careerRoles,
          educationItems: parsed.educationItems || DEFAULT_CURRICULUM_SETTINGS.educationItems,
          languagesList: parsed.languagesList || DEFAULT_CURRICULUM_SETTINGS.languagesList,
          industrialCourses: parsed.industrialCourses || DEFAULT_CURRICULUM_SETTINGS.industrialCourses
        };
      }
    } catch (e) {
      console.warn("Error leyendo currículo de localStorage:", e);
    }
    return DEFAULT_CURRICULUM_SETTINGS;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'curriculum'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<CurriculumSettings>;
        const merged: CurriculumSettings = {
          candidateInfo: { ...DEFAULT_CURRICULUM_SETTINGS.candidateInfo, ...(data.candidateInfo || {}) },
          impactMetrics: data.impactMetrics || DEFAULT_CURRICULUM_SETTINGS.impactMetrics,
          careerRoles: data.careerRoles || DEFAULT_CURRICULUM_SETTINGS.careerRoles,
          educationItems: data.educationItems || DEFAULT_CURRICULUM_SETTINGS.educationItems,
          languagesList: data.languagesList || DEFAULT_CURRICULUM_SETTINGS.languagesList,
          industrialCourses: data.industrialCourses || DEFAULT_CURRICULUM_SETTINGS.industrialCourses
        };
        setCurriculumData(merged);
        try {
          localStorage.setItem('coachiso_curriculum_settings', JSON.stringify(merged));
        } catch (e) {
          console.warn("Error guardando currículo en localStorage:", e);
        }
      }
      setLoading(false);
    }, (error) => {
      setLoading(false);
      console.warn("Cargando currículo en modo fallback:", error);
    });

    return () => unsub();
  }, []);

  const updateCurriculum = async (newSettings: CurriculumSettings) => {
    // Immediate local update and storage
    setCurriculumData(newSettings);
    try {
      localStorage.setItem('coachiso_curriculum_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn("Error en localStorage al actualizar currículo:", e);
    }

    try {
      await setDoc(doc(db, 'settings', 'curriculum'), newSettings);
    } catch (error) {
      console.warn("Error al sincronizar con Firestore, cambios retenidos localmente:", error);
      // We do not throw so admin save button finishes successfully locally
    }
  };

  return { curriculumData, updateCurriculum, loading };
}
