import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { imageRegistry as staticRegistry, ISOImageMetadata } from './imageRegistry';

export function useImageRegistry() {
  const [registry, setRegistry] = useState<Record<string, ISOImageMetadata>>(staticRegistry);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'image_registry'), (snapshot) => {
      const dbImages: Record<string, ISOImageMetadata> = {};
      snapshot.forEach((doc) => {
        dbImages[doc.id] = { id: doc.id, ...doc.data() } as ISOImageMetadata;
      });
      
      setRegistry({ ...staticRegistry, ...dbImages });
      setLoading(false);
    }, (error) => {
      setLoading(false);
      console.warn(
        "👋 [Aviso de Configuración] Registro de imágenes cargado en modo local/fallback (Falta configurar o desplegar las reglas de Firestore).\n" +
        "Para corregir las lecturas de base de datos en producción, copia las reglas contenidas en '/firestore.rules' y pégalas en la pestaña 'Rules' de tu Firebase Console.",
        error
      );
    });

    return () => unsubscribe();
  }, []);

  return { registry, loading };
}

