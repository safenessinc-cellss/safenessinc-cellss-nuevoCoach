import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export interface ProfileSettings {
  name: string;
  title: string;
  coachTitle: string;
  photoUrl: string;
  bio: string;
  quote: string;
  experienceYears: number;
  logoUrl?: string;
}

const DEFAULT_PROFILE: ProfileSettings = {
  name: "Robert Terán",
  title: "Ingeniero, Economista y Especialista en Sistemas de Gestión Integral",
  coachTitle: "Optimización de Procesos",
  photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256",
  bio: "Ingeniero y Economista con más de 30 años de experiencia como Especialista en Sistemas de Gestión Integral, Auditoría y Optimización de Procesos. Su enfoque integra los sistemas de gestión integral corporativa con el análisis estratégico financiero y del capital humano, orientando sus metodologías a resultados de alto impacto y de excelencia operativa.",
  quote: "Optimización y estructuración de procesos. Sincronización del equipo humano con el rendimiento económico.",
  experienceYears: 30,
  logoUrl: "https://images.unsplash.com/photo-1614607242094-b1b22e11a141?auto=format&fit=crop&q=80&w=256&h=256"
};

export function useProfileSettings() {
  const [profile, setProfile] = useState<ProfileSettings>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'profile'), (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as ProfileSettings);
      }
      setLoading(false);
    }, (error) => {
      setLoading(false);
      console.warn(
        "👋 [Aviso de Configuración] Perfil de Firebase cargado en modo local/fallback (Falta configurar o desplegar las reglas de Firestore).\n" +
        "Para corregir las lecturas de base de datos en producción, copia las reglas contenidas en '/firestore.rules' y pégalas en la pestaña 'Rules' de tu Firebase Console.",
        error
      );
    });

    return () => unsub();
  }, []);

  const updateProfile = async (newProfile: ProfileSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'profile'), newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/profile');
    }
  };

  return { profile, updateProfile, loading };
}

