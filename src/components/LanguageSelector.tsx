import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface LanguageSelectorProps {
  variant?: 'buttons' | 'dropdown' | 'icons';
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'buttons', 
  className = '' 
}) => {
  const { changeLanguage, isLanguage, languages, getCurrentLanguage } = useLanguage();
  const current = getCurrentLanguage();

  if (variant === 'dropdown') {
    return (
      <select 
        onChange={(e) => changeLanguage(e.target.value)}
        className={`language-selector-dropdown ${className}`}
        value={languages.find(lang => isLanguage(lang.code))?.code || 'es'}
      >
        {languages.map((lang) => (
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
        {languages.map((lang) => (
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
      {languages.map((lang) => {
        const active = current.startsWith(lang.code);
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
