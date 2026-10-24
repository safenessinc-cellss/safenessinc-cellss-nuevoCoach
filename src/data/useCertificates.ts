import { useCallback, useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { ExtractedCertificate } from '../ai/geminiClient';

export type SavedCertificate = ExtractedCertificate & {
  id: string;
  createdAt?: unknown;
  createdBy?: string;
};

export function useCertificates() {
  const [certificates, setCertificates] = useState<SavedCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snapshot => {
      setCertificates(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as SavedCertificate)));
      setLoading(false);
      setError(null);
    }, err => {
      console.error('No se pudieron cargar los certificados', err);
      setError('No se pudieron cargar las credenciales. Comprueba los permisos de tu cuenta.');
      setLoading(false);
    });
  }, []);

  const addCertificate = useCallback(async (certificate: ExtractedCertificate) => {
    const existing = certificates.find(item => item.code.toLowerCase() === certificate.code.toLowerCase());
    if (existing) throw new Error('Ya existe una credencial con ese código.');
    await addDoc(collection(db, 'certificates'), {
      ...certificate,
      verified: false,
      createdAt: serverTimestamp(),
    });
  }, [certificates]);

  return { certificates, loading, error, addCertificate };
}
