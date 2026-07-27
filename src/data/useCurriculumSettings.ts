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
  const [curriculumData, setCurriculumData] = useState<CurriculumSettings>(DEFAULT_CURRICULUM_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'curriculum'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<CurriculumSettings>;
        setCurriculumData({
          candidateInfo: data.candidateInfo || DEFAULT_CURRICULUM_SETTINGS.candidateInfo,
          impactMetrics: data.impactMetrics || DEFAULT_CURRICULUM_SETTINGS.impactMetrics,
          careerRoles: data.careerRoles || DEFAULT_CURRICULUM_SETTINGS.careerRoles,
          educationItems: data.educationItems || DEFAULT_CURRICULUM_SETTINGS.educationItems,
          languagesList: data.languagesList || DEFAULT_CURRICULUM_SETTINGS.languagesList,
          industrialCourses: data.industrialCourses || DEFAULT_CURRICULUM_SETTINGS.industrialCourses
        });
      }
      setLoading(false);
    }, (error) => {
      setLoading(false);
      console.warn("Cargando currículo en modo fallback:", error);
    });

    return () => unsub();
  }, []);

  const updateCurriculum = async (newSettings: CurriculumSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'curriculum'), newSettings);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/curriculum');
    }
  };

  return { curriculumData, updateCurriculum, loading };
}
