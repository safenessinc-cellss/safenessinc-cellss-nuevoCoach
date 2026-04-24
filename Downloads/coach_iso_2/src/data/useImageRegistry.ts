import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
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
      console.error("Error fetching image_registry from Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { registry, loading };
}
