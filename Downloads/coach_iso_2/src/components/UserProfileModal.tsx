import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Linkedin, Mail, ShieldCheck, Award, Briefcase, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProfileSettings } from '../data/useProfileSettings';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function UserProfileModal({ isOpen, onClose, data }: UserProfileModalProps) {
  const { t } = useTranslation();
  const { profile } = useProfileSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh] glass-effect"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera / Banner sutil */}
            <div className="h-32 bg-gradient-to-r from-red-600/20 to-amber-500/10 border-b border-white/5 relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-all border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 pb-8 -mt-16 relative">
              {/* Avatar */}
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-4 border-[#0a0a0a] overflow-hidden shadow-2xl bg-[#151515]">
                  <img 
                    src={profile.photoUrl || undefined} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-amber-500 text-black p-1.5 rounded-full shadow-lg border-2 border-[#0a0a0a]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Información Principal */}
              <div className="mt-4">
                <h2 className="text-3xl font-black text-white tracking-tighter">{profile.name}</h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    <Award className="w-3 h-3" /> {profile.title}
                  </span>
                  <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase tracking-wider bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <ShieldCheck className="w-3 h-3" /> {profile.coachTitle}
                  </span>
                </div>
              </div>

              {/* Biografía */}
              <div className="mt-8">
                <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-3 opacity-50 flex items-center gap-2">
                   <Briefcase className="w-4 h-4" /> Perfil Profesional
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg font-light italic border-l-2 border-red-600 pl-4 bg-white/5 py-3 rounded-r-xl">
                  "{profile.quote}"
                </p>
                <p className="text-gray-400 mt-4 leading-relaxed font-light">
                  {profile.bio}
                </p>
              </div>

              {/* Grid de Stats Rápidos */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">Experiencia</span>
                  </div>
                  <p className="text-xl font-bold text-white">{profile.experienceYears} Años</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">Certificación</span>
                  </div>
                  <p className="text-xl font-bold text-white">{profile.title}</p>
                </div>
              </div>

              {/* Call to Action & Social */}
              <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex gap-4">
                  <a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-blue-400 transition-all flex items-center gap-2 text-sm font-bold">
                    <Linkedin className="w-5 h-5" /> LinkedIn
                  </a>
                  <a href={`mailto:${data.profile.email}`} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-red-500 transition-all flex items-center gap-2 text-sm font-bold">
                    <Mail className="w-5 h-5" /> Contacto
                  </a>
                </div>
                
                <button 
                  onClick={onClose}
                  className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-lg"
                >
                  Cerrar Perfil
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
