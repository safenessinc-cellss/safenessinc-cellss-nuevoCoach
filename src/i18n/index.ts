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

const savedLng = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
const navLang = typeof window !== 'undefined' && navigator.language ? navigator.language.split('-')[0] : 'es';
const initialLng = savedLng || (['es', 'en', 'pt', 'it'].includes(navLang) ? navLang : 'es');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

