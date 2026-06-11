import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esTranslations from './locales/es.json';
import enTranslations from './locales/en.json';
import ptTranslations from './locales/pt.json';
import itTranslations from './locales/it.json';

const resources = {
  es: { translation: esTranslations },
  en: { translation: enTranslations },
  pt: { translation: ptTranslations },
  it: { translation: itTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // idioma por defecto
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // react ya hace safe escaping
    },
  });

export default i18n;
