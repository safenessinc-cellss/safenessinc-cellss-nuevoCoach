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
  // 1. Verificar localStorage
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang && ['es', 'en', 'pt', 'it'].includes(savedLang)) {
      return savedLang;
    }
  }

  // 2. Verificar navegador
  if (typeof window !== 'undefined' && navigator.language) {
    const navLang = navigator.language.split('-')[0];
    if (['es', 'en', 'pt', 'it'].includes(navLang)) {
      return navLang;
    }
  }

  // 3. Fallback a español
  return 'es';
};

// Guardar idioma en localStorage cuando cambie
const saveLanguage = (lng: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
};

// Inicializar i18n
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
      useSuspense: false, // Evita problemas de carga
    },
  });

// Escuchar cambios de idioma para guardarlos
i18n.on('languageChanged', (lng) => {
  saveLanguage(lng);
});

export default i18n;
