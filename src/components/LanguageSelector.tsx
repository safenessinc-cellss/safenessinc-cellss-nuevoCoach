import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  variant?: 'buttons' | 'dropdown' | 'icons';
  className?: string;
}

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'buttons', 
  className = '' 
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'es';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const isLanguage = (lng: string) => currentLanguage.startsWith(lng);

  if (variant === 'dropdown') {
    return (
      <select 
        onChange={(e) => changeLanguage(e.target.value)}
        className={`language-selector-dropdown ${className}`}
        value={LANGUAGES.find(lang => isLanguage(lang.code))?.code || 'es'}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    );
  }

  if (variant === 'icons') {
    return (
      <div className={`language-selector-icons ${className}`}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`lang-icon ${isLanguage(lang.code) ? 'active' : ''}`}
            title={lang.label}
            type="button"
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`language-selector-buttons ${className}`}>
      {LANGUAGES.map((lang) => {
        const active = currentLanguage.startsWith(lang.code);
        return (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`lang-btn ${active ? 'active' : ''}`}
            type="button"
          >
            <span className="mr-1">{lang.flag}</span>
            <span>{lang.code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSelector;
