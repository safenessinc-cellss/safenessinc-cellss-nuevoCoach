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
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">{t('curriculum.profile.title')}</h2>
        <h3 className="text-red-500 font-semibold mb-6">{t('curriculum.profile.subtitle')}</h3>
        <p className="text-gray-300 mb-8">{t('curriculum.profile.description')}</p>

        <div className="border-t border-white/10 pt-6">
          <h4 className="text-white font-semibold mb-4">{t('curriculum.experience.title')}</h4>
          {t('curriculum.experience.items', { returnObjects: true }).map((item: any, index: number) => (
            <div key={index} className="mb-4 pb-4 border-b border-white/5 last:border-0">
              <div className="flex justify-between text-sm text-gray-400">
                <span className="text-red-400">{item.period}</span>
                <span>{item.company}</span>
              </div>
              <h5 className="text-white font-medium">{item.role}</h5>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition">
          {t('curriculum.download')}
        </button>
      </div>
    </div>
  );
}
