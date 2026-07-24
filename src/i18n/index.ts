import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationES from './locales/es.json';
import translationEN from './locales/en.json';
import translationPT from './locales/pt.json';
import translationIT from './locales/it.json';

const resources = {
  es: { translation: translationES },
  en: { translation: translationEN },
  pt: { translation: translationPT },
  it: { translation: translationIT },
};

// Detector de idioma manual (sin dependencias externas)
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang && ['es', 'en', 'pt', 'it'].includes(savedLang)) {
      return savedLang;
    }
  }

  if (typeof window !== 'undefined' && navigator.language) {
    const navLang = navigator.language.split('-')[0];
    if (['es', 'en', 'pt', 'it'].includes(navLang)) {
      return navLang;
    }
  }

  return 'es';
};

const saveLanguage = (lng: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  saveLanguage(lng);
});

export default i18n;
