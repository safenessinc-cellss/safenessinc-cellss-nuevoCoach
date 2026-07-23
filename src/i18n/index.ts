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

// Obtener idioma del localStorage o del navegador
const getInitialLanguage = () => {
  // 1. Verificar localStorage
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang) return savedLang;
  
  // 2. Verificar navegador
  const browserLang = navigator.language.split('-')[0];
  if (['es', 'en', 'pt', 'it'].includes(browserLang)) return browserLang;
  
  // 3. Default: español
  return 'es';
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
  });

// Guardar cambios de idioma en localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;