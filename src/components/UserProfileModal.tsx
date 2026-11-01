import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Linkedin, Mail, Calendar, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProfileSettings } from '../data/useProfileSettings';
import CurriculumShowcaseModal from './CurriculumShowcaseModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const profileCopy = {
  es: {
    eyebrow: 'TRAYECTORIA PROFESIONAL',
    heading: 'Experiencia industrial. Mejora que se sostiene.',
    biography: 'Ingeniero y economista con más de 30 años de experiencia en calidad, operaciones y sistemas de gestión. Su trayectoria incluye General Motors, Aister SL, Aproinca Group y Rototech, con responsabilidades en calidad, procesos, producción y cadena de suministro. En SAFENESS.INC desarrolla aplicaciones web y móviles y herramientas digitales para la gestión de calidad.',
    experience: 'Experiencia',
    years: 'años',
    focus: 'Especialidad',
    focusValue: 'Calidad · procesos · sistemas ISO',
    credentials: 'Currículo y credenciales',
    credentialsText: 'Experiencia, formación y credenciales verificables en un solo lugar.',
    viewCredentials: 'Ver currículo y credenciales',
    linkedin: 'Perfil de LinkedIn',
    email: 'Contactar por correo',
    close: 'Cerrar perfil',
  },
  en: {
    eyebrow: 'PROFESSIONAL BACKGROUND',
    heading: 'Industrial experience. Improvement that lasts.',
    biography: 'An engineer and economist with more than 30 years of experience in quality, operations, and management systems. His career includes General Motors, Aister SL, Aproinca Group, and Rototech, with responsibilities across quality, processes, production, and supply chain. At SAFENESS.INC, he develops web and mobile applications and digital tools for quality management.',
    experience: 'Experience',
    years: 'years',
    focus: 'Focus',
    focusValue: 'Quality · processes · ISO systems',
    credentials: 'CV and credentials',
    credentialsText: 'Experience, education, and verifiable credentials in one place.',
    viewCredentials: 'View CV and credentials',
    linkedin: 'LinkedIn profile',
    email: 'Contact by email',
    close: 'Close profile',
  },
  pt: {
    eyebrow: 'TRAJETÓRIA PROFISSIONAL',
    heading: 'Experiência industrial. Melhoria duradoura.',
    biography: 'Engenheiro e economista com mais de 30 anos de experiência em qualidade, operações e sistemas de gestão. Sua trajetória inclui General Motors, Aister SL, Aproinca Group e Rototech, com responsabilidades em qualidade, processos, produção e cadeia de suprimentos. Na SAFENESS.INC, desenvolve aplicações web e móveis e ferramentas digitais para a gestão da qualidade.',
    experience: 'Experiência',
    years: 'anos',
    focus: 'Especialidade',
    focusValue: 'Qualidade · processos · sistemas ISO',
    credentials: 'Currículo e credenciais',
    credentialsText: 'Experiência, formação e credenciais verificáveis em um só lugar.',
    viewCredentials: 'Ver currículo e credenciais',
    linkedin: 'Perfil no LinkedIn',
    email: 'Entrar em contato por e-mail',
    close: 'Fechar perfil',
  },
  it: {
    eyebrow: 'PERCORSO PROFESSIONALE',
    heading: 'Esperienza industriale. Miglioramento duraturo.',
    biography: 'Ingegnere ed economista con oltre 30 anni di esperienza nella qualità, nelle operations e nei sistemi di gestione. Il suo percorso comprende General Motors, Aister SL, Aproinca Group e Rototech, con responsabilità in qualità, processi, produzione e catena di fornitura. In SAFENESS.INC sviluppa applicazioni web e mobile e strumenti digitali per la gestione della qualità.',
    experience: 'Esperienza',
    years: 'anni',
    focus: 'Specializzazione',
    focusValue: 'Qualità · processi · sistemi ISO',
    credentials: 'CV e credenziali',
    credentialsText: 'Esperienza, formazione e credenziali verificabili in un unico spazio.',
    viewCredentials: 'Vedi CV e credenziali',
    linkedin: 'Profilo LinkedIn',
    email: 'Contatta via e-mail',
    close: 'Chiudi profilo',
  },
} as const;

function UserProfileModal({ isOpen, onClose, data }: UserProfileModalProps) {
  const { i18n } = useTranslation();
  const { profile } = useProfileSettings();
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const language = (i18n.resolvedLanguage || i18n.language || 'es').split('-')[0] as keyof typeof profileCopy;
  const copy = profileCopy[language] || profileCopy.es;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[1.75rem] border border-slate-200 bg-white text-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-28 sm:h-36 border-b border-slate-200 bg-gradient-to-r from-slate-100 via-white to-amber-50">
              {profile.logoUrl && (
                <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                  <img src={profile.logoUrl} alt="Coach ISO" className="h-full w-full object-contain" />
                </div>
              )}
              <button
                onClick={onClose}
                aria-label={copy.close}
                className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 sm:right-5 sm:top-5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative -mt-12 px-5 pb-6 sm:-mt-14 sm:px-8 sm:pb-8">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md sm:h-28 sm:w-28">
                <img
                  src={profile.photoUrl || undefined}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{profile.name}</h2>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-teal-700/15 bg-teal-700/[0.06] px-3 py-1.5 text-xs font-semibold text-teal-800">
                  <Briefcase className="h-3.5 w-3.5" />
                  {profile.title}
                </span>
              </div>

              <section className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.eyebrow}</p>
                <h3 className="mt-2 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">{copy.heading}</h3>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">{copy.biography}</p>
              </section>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="h-4 w-4 text-teal-700" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{copy.experience}</span>
                  </div>
                  <p className="mt-2 text-lg font-bold text-slate-900">{profile.experienceYears} {copy.years}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <GraduationCap className="h-4 w-4 text-amber-700" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{copy.focus}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-5 text-slate-900">{copy.focusValue}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-teal-800/15 bg-gradient-to-r from-teal-50 to-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <h4 className="font-semibold text-slate-900">{copy.credentials}</h4>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{copy.credentialsText}</p>
                </div>
                <button
                  onClick={() => setIsCurriculumOpen(true)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-900"
                >
                  {copy.viewCredentials}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" /> {copy.linkedin}
                  </a>
                  <a href={`mailto:${data.profile.email}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    <Mail className="h-4 w-4 text-slate-500" /> {copy.email}
                  </a>
                </div>
                <button onClick={onClose} className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:w-auto">
                  {copy.close}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <CurriculumShowcaseModal
        isOpen={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
      />
    </AnimatePresence>
  );
}

export default React.memo(UserProfileModal);
