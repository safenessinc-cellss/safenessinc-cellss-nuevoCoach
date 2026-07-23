import React from 'react';
import { useTranslation } from 'react-i18next';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

export default function UserProfileModal({ isOpen, onClose, data }: UserProfileModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Perfil */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{t('curriculum.profile.title')}</h2>
          <h3 className="text-red-500 font-semibold text-lg">{t('curriculum.profile.subtitle')}</h3>
          <p className="text-gray-300 mt-4 leading-relaxed">{t('curriculum.profile.description')}</p>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/10 my-6"></div>

        {/* Experiencia */}
        <div className="mb-6">
          <h4 className="text-white font-bold text-lg mb-4">{t('curriculum.experience.title')}</h4>
          {t('curriculum.experience.items', { returnObjects: true }).map((item: any, index: number) => (
            <div key={index} className="mb-4 pb-4 border-b border-white/5 last:border-0">
              <div className="flex justify-between items-start mb-1">
                <h5 className="text-white font-medium">{item.role}</h5>
                <span className="text-sm text-gray-400">{item.period}</span>
              </div>
              <p className="text-red-400 text-sm font-medium">{item.company}</p>
              <p className="text-gray-400 text-sm mt-1">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Logros */}
        <div className="mb-6">
          <h4 className="text-white font-bold text-lg mb-3">Logros Destacados</h4>
          <ul className="space-y-2">
            {t('curriculum.experience.achievements', { returnObjects: true }).map((achievement: string, index: number) => (
              <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-red-500">•</span>
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{t('curriculum.metrics.efficiency_value')}</div>
            <div className="text-xs text-gray-400">{t('curriculum.metrics.efficiency')}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{t('curriculum.metrics.trained_value')}</div>
            <div className="text-xs text-gray-400">{t('curriculum.metrics.trained')}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{t('curriculum.metrics.impact_value')}</div>
            <div className="text-xs text-gray-400">{t('curriculum.metrics.impact')}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{t('curriculum.metrics.retention_value')}</div>
            <div className="text-xs text-gray-400">{t('curriculum.metrics.retention')}</div>
          </div>
        </div>

        {/* Botón de descarga */}
        <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition shadow-lg shadow-red-500/20">
          {t('curriculum.download')}
        </button>
      </div>
    </div>
  );
}
