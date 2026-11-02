import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_SITE_LINKS, getSiteCopy, PublicSiteSettings, SiteLanguage, SitePageCopy } from './siteContent';

export function usePublicSiteSettings(language: SiteLanguage) {
  const [settings, setSettings] = useState<PublicSiteSettings>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'publicSite'),
      (snapshot) => {
        setSettings(snapshot.exists() ? snapshot.data() as PublicSiteSettings : {});
        setLoaded(true);
      },
      () => setLoaded(true),
    );
    return unsubscribe;
  }, []);

  const copy: SitePageCopy = getSiteCopy(language, settings.locales?.[language]);
  const links = { ...DEFAULT_SITE_LINKS, ...(settings.links || {}) };
  return { copy, links, loaded };
}
