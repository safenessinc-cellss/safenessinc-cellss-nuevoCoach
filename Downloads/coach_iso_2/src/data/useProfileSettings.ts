import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface ProfileSettings {
  name: string;
  title: string;
  coachTitle: string;
  photoUrl: string;
  bio: string;
  quote: string;
  experienceYears: number;
}

const DEFAULT_PROFILE: ProfileSettings = {
  name: "Robert Teran",
  title: "Auditor Líder",
  coachTitle: "IBM 2025 Coach",
  photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256",
  bio: "Especialista en Sistemas de Gestión ISO con más de 30 años de experiencia.",
  quote: "Robert Teran es un Especialista en Sistemas de Gestión ISO con más de 30 años de experiencia en auditoría y consultoría estratégica. Experto en optimización de procesos y transformación digital aplicada a normativas internacionales.",
  experienceYears: 30
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
      console.error("Error fetching profile settings:", error);
      // Fallback to default gracefully if permissions or network fail
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateProfile = async (newProfile: ProfileSettings) => {
    await setDoc(doc(db, 'settings', 'profile'), newProfile);
  };

  return { profile, updateProfile, loading };
}
