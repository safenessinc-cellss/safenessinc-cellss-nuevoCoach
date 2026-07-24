// Este archivo reemplaza el detector si no está disponible
export default class LanguageDetectorShim {
  static type = 'languageDetector';
  
  init(services: any, options: any) {
    // No hace nada
  }
  
  detect() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('i18nextLng');
      if (saved) return saved;
      
      const navLang = navigator.language?.split('-')[0];
      if (['es', 'en', 'pt', 'it'].includes(navLang)) return navLang;
    }
    return 'es';
  }
  
  cacheUserLanguage(lng: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
  }
}