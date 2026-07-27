import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2pdf from 'html2pdf.js';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  BookOpen, 
  Sparkles, 
  User, 
  Layers,
  GraduationCap,
  Building,
  Maximize2,
  Download,
  Printer,
  FileText
} from 'lucide-react';
import { useProfileSettings } from '../data/useProfileSettings';
import { useCurriculumSettings } from '../data/useCurriculumSettings';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { 
  CANDIDATE_INFO, 
  OFFICIAL_CERTIFICATES, 
  ALL_LEARNING_ACTIVITIES, 
  OfficialCertificate, 
  LearningActivity,
  CAREER_EXPERIENCE,
  ACADEMIC_EDUCATION,
  IMPACT_METRICS,
  LANGUAGES_LIST,
  INDUSTRIAL_COURSES
} from '../data/robertTeranCurriculumData';
import ScaledCertificateModal from './ScaledCertificateModal';

interface CurriculumShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CurriculumShowcaseModal({ isOpen, onClose }: CurriculumShowcaseModalProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'cv_template' | 'official_certificates' | 'all_activities' | 'bio'>('official_certificates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  
  const { profile } = useProfileSettings();
  const { curriculumData } = useCurriculumSettings();
  const profilePhotoUrl = profile.photoUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";

  // Selected certificate for scaled modal viewer
  const [viewingCertificate, setViewingCertificate] = useState<OfficialCertificate | LearningActivity | null>(null);

  const currentLang = (i18n.language || 'es').toLowerCase();

  // Localized candidate info with fallback to Firestore/localStorage curriculum settings
  const candidateInfo = curriculumData.candidateInfo || CANDIDATE_INFO;
  const candidateName = candidateInfo.name || CANDIDATE_INFO.name;
  const candidateEmail = candidateInfo.email || CANDIDATE_INFO.email;
  const candidatePhone = candidateInfo.phone || CANDIDATE_INFO.phone;
  const candidateLocation = candidateInfo.location || CANDIDATE_INFO.location;
  const cvSummary = candidateInfo.summary || CANDIDATE_INFO.summary;
  const transcriptDate = candidateInfo.transcriptDate || CANDIDATE_INFO.transcriptDate;
  const credlyProfile = candidateInfo.credlyProfile || CANDIDATE_INFO.credlyProfile;
  const credlyId = candidateInfo.credlyId || CANDIDATE_INFO.credlyId;
  const birthDate = candidateInfo.birthDate || CANDIDATE_INFO.birthDate;
  const summaryTitle = t('curriculum.summary_title', 'Resumen Profesional');
  const transcriptText = t('curriculum.transcript', 'Transcript Oficial expedido el') + ' ' + transcriptDate;

  // Career, education, languages, impact metrics, accreditations prioritized from curriculumData
  const rawCareer = t('curriculum.career.roles', { returnObjects: true });
  const careerRoles = (curriculumData.careerRoles && curriculumData.careerRoles.length > 0)
    ? curriculumData.careerRoles
    : (Array.isArray(rawCareer) && rawCareer.length > 0 && currentLang !== 'es' ? rawCareer : CAREER_EXPERIENCE);

  const rawEducation = t('curriculum.education.items', { returnObjects: true });
  const educationItems = (curriculumData.educationItems && curriculumData.educationItems.length > 0)
    ? curriculumData.educationItems
    : (Array.isArray(rawEducation) && rawEducation.length > 0 && currentLang !== 'es' ? rawEducation : ACADEMIC_EDUCATION);

  const rawLanguages = t('curriculum.languages.items', { returnObjects: true });
  const languagesList = (curriculumData.languagesList && curriculumData.languagesList.length > 0)
    ? curriculumData.languagesList
    : (Array.isArray(rawLanguages) && rawLanguages.length > 0 && currentLang !== 'es' ? rawLanguages : LANGUAGES_LIST);

  const rawImpactMetrics = t('curriculum.impact_metrics', { returnObjects: true });
  const impactMetrics = (curriculumData.impactMetrics && curriculumData.impactMetrics.length > 0)
    ? curriculumData.impactMetrics
    : (Array.isArray(rawImpactMetrics) && rawImpactMetrics.length > 0 && currentLang !== 'es' ? rawImpactMetrics : IMPACT_METRICS);

  const rawAccreditations = t('curriculum.industrial_courses', { returnObjects: true });
  const accreditationsList = (curriculumData.industrialCourses && curriculumData.industrialCourses.length > 0)
    ? curriculumData.industrialCourses
    : (Array.isArray(rawAccreditations) && rawAccreditations.length > 0 && currentLang !== 'es' ? rawAccreditations : INDUSTRIAL_COURSES);

  if (!isOpen) return null;

  // Export to PDF function using html2pdf.js directly on rendered DOM node
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Ensure cv_template tab is selected so #curriculum-cv-document is rendered
      if (activeTab !== 'cv_template') {
        setActiveTab('cv_template');
        await new Promise((res) => setTimeout(res, 350));
      }

      const element = document.getElementById('curriculum-cv-document');
      if (!element) {
        throw new Error("Elemento de CV no encontrado en el DOM");
      }

      const langCode = (i18n.language || 'es').toUpperCase();

      const opt = {
        margin: [5, 5, 5, 5],
        filename: `Curriculum_Robert_Teran_${langCode}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          allowTaint: true, 
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt as any).from(element).save();
    } catch (err) {
      console.warn("Error al exportar PDF con html2pdf, recurriendo a impresión de sistema:", err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Categories list
  const categories = [
    { id: 'all', label: 'Todas las Credenciales' },
    { id: 'cybersecurity', label: 'Ciberseguridad' },
    { id: 'ai_data', label: 'IA & Ciencia de Datos' },
    { id: 'design_thinking', label: 'Design Thinking & UX' },
    { id: 'cloud', label: 'Cloud & Computación' },
    { id: 'project_agile', label: 'Gestión Ágil & Proyectos' },
    { id: 'marketing', label: 'Marketing & Ventas' },
    { id: 'professional_skills', label: 'Soft Skills & Liderazgo' },
    { id: 'web_dev', label: 'Desarrollo Web' }
  ];

  // Filtered Official Certificates
  const filteredOfficial = OFFICIAL_CERTIFICATES.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cert.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered All Activities
  const filteredActivities = ALL_LEARNING_ACTIVITIES.filter(act => {
    return act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           act.code.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md print:hidden"
          />

          {/* Main Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-6xl bg-[#09080e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:bg-white print:border-none print:shadow-none print:rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-950/40 via-amber-950/30 to-black p-4 sm:p-6 border-b border-white/10 relative overflow-hidden shrink-0 print:hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 shadow-lg shrink-0">
                    <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-amber-400">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {t('curriculum.title', 'Currículo Ejecutivo & Portal de Credenciales')}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {candidateName}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                      {t('curriculum.subtitle', 'Coach Ejecutivo • Auditor Líder SGC IRCA • Ingeniero Economista')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Language Selector */}
                  <LanguageSelector variant="buttons" className="shrink-0" />

                  {/* Export PDF Button */}
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                    <span>{isExporting ? 'Generando PDF...' : t('curriculum.export', 'Exportar a PDF')}</span>
                  </button>

                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white rounded-xl text-xs font-mono flex items-center gap-2 transition cursor-pointer"
                    title={t('curriculum.print', 'Imprimir')}
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">{t('curriculum.print', 'Imprimir')}</span>
                  </button>

                  <a
                    href={credlyProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-amber-400 text-xs font-mono flex items-center gap-2 transition"
                  >
                    <span>Credly</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={onClose}
                    className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition border border-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 mt-4 border-t border-white/10 pt-3">
                <button
                  onClick={() => setActiveTab('official_certificates')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'official_certificates'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>{t('curriculum.tabs.credentials', 'Certificados & Credenciales')} ({OFFICIAL_CERTIFICATES.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('all_activities')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'all_activities'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{t('curriculum.tabs.activities', 'Actividades & Cursos')} ({ALL_LEARNING_ACTIVITIES.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('cv_template')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'cv_template'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{t('curriculum.tabs.cv', 'Currículo Ejecutivo (Plantilla Oficial)')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('bio')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'bio'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{t('curriculum.tabs.profile', 'Perfil & Estadísticas')}</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar (Only shown for lists) */}
            {(activeTab === 'official_certificates' || activeTab === 'all_activities') && (
              <div className="p-4 px-6 bg-[#0f0e16] border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0 print:hidden">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por código (ID) o título..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Categories Filter (Only for official tab) */}
                {activeTab === 'official_certificates' && (
                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    <Filter className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-500 font-mono"
                    >
                      {categories.map((c, idx) => (
                        <option key={`curr-cat-${c.id || idx}-${idx}`} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Scrollable Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#06050a] print:bg-white print:p-0">
              
              {/* TAB 0: EXECUTIVE CV TEMPLATE MATCHING THE DESIGN IN THE IMAGE */}
              {activeTab === 'cv_template' && (
                <div className="flex flex-col items-center">
                  
                  {/* Floating Actions Bar with Language Switcher */}
                  <div className="w-full max-w-[820px] mb-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-gray-400 bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10 print:hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>{t('curriculum.translate_label', 'Idioma del Currículo:')}</span>
                      </span>
                      <LanguageSelector variant="buttons" className="shrink-0" />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isExporting ? 'Generando...' : t('curriculum.export', 'Exportar PDF')}</span>
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('curriculum.print', 'Imprimir')}</span>
                      </button>
                    </div>
                  </div>

                  {/* A4 Executive Resume Canvas */}
                  <div
                    id="curriculum-cv-document"
                    className="w-full max-w-[820px] bg-white text-gray-900 shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[1050px] relative font-sans text-xs border border-gray-200 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none"
                  >
                    {/* LEFT SIDEBAR COLUMN - DARK CHARCOAL */}
                    <div className="w-full md:w-[290px] bg-[#1a1d20] text-gray-200 p-6 flex flex-col justify-between relative shrink-0">
                      
                      {/* Top-Left Geometric Amber Vector SVG Cutout */}
                      <svg className="absolute top-0 left-0 w-24 h-24 pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon points="0,0 100,0 0,100" fill="#f59e0b" />
                      </svg>

                      <div className="relative z-10 space-y-6">
                        
                        {/* Coach Profile Photo Container in Arched Oval Frame */}
                        <div className="flex flex-col items-center pt-2">
                          <div className="relative">
                            <div className="w-36 h-44 rounded-t-[72px] rounded-b-2xl overflow-hidden border-4 border-amber-500 bg-black shadow-2xl flex items-center justify-center">
                              <img
                                src={profilePhotoUrl}
                                alt={candidateName}
                                className="w-full h-full object-cover object-top"
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";
                                }}
                              />
                            </div>
                            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[9.5px] font-black uppercase px-3 py-0.5 rounded-full shadow-lg font-mono whitespace-nowrap">
                              Coach Terán
                            </span>
                          </div>
                        </div>

                        {/* CONTACT ME / CONTACTO */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-1.5">
                            <span className="p-1 rounded-full bg-amber-500 text-black shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </span>
                            <h3 className="font-extrabold uppercase text-xs tracking-wider text-white">
                              {t('curriculum.contact.title', 'Contacto')}
                            </h3>
                          </div>

                          <div className="relative pl-4 space-y-3 border-l-2 border-amber-500 ml-2 text-[11px]">
                            {/* Phone */}
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="text-gray-400 text-[9.5px] uppercase font-mono block font-bold">{t('curriculum.contact.phone', 'Teléfono / WhatsApp')}</span>
                              <span className="font-semibold text-white block">{candidatePhone}</span>
                            </div>

                            {/* Email & Web */}
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="text-gray-400 text-[9.5px] uppercase font-mono block font-bold">{t('curriculum.contact.email', 'Email / Credly')}</span>
                              <a href={`mailto:${candidateEmail}`} className="font-medium text-amber-400 hover:underline block break-all text-[10.5px]">
                                {candidateEmail}
                              </a>
                              <span className="text-gray-300 text-[9.5px] block break-all">credly.com/users/deuwy-medina</span>
                            </div>

                            {/* Location */}
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="text-gray-400 text-[9.5px] uppercase font-mono block font-bold">{t('curriculum.contact.location', 'Ubicación')}</span>
                              <span className="font-medium text-white block">{candidateLocation}</span>
                            </div>
                          </div>
                        </div>

                        {/* IDIOMAS */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-1.5">
                            <span className="p-1 rounded-full bg-amber-500 text-black shrink-0">
                              <BookOpen className="w-3.5 h-3.5" />
                            </span>
                            <h3 className="font-extrabold uppercase text-xs tracking-wider text-white">
                              {t('curriculum.languages.title', 'Idiomas')}
                            </h3>
                          </div>

                          <div className="relative pl-4 space-y-2 border-l-2 border-amber-500 ml-2 text-[10.5px]">
                            {(Array.isArray(languagesList) ? languagesList : []).map((lang: any, idx: number) => (
                              <div key={`lang-${idx}`} className="relative space-y-0.5">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                                <div className="flex justify-between items-center text-white font-bold">
                                  <span>{lang.name}</span>
                                  <span className="text-[9px] text-amber-400 font-mono">{lang.level}</span>
                                </div>
                                <span className="text-gray-400 text-[9px] block">{lang.written}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* EDUCACIÓN Y FORMACIÓN */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-1.5">
                            <span className="p-1 rounded-full bg-amber-500 text-black shrink-0">
                              <GraduationCap className="w-3.5 h-3.5" />
                            </span>
                            <h3 className="font-extrabold uppercase text-xs tracking-wider text-white">
                              {t('curriculum.education.title', 'Formación Académica')}
                            </h3>
                          </div>

                          <div className="relative pl-4 space-y-3 border-l-2 border-amber-500 ml-2 text-[11px]">
                            {(Array.isArray(educationItems) ? educationItems : []).map((edu: any, idx: number) => (
                              <div key={`edu-${idx}`} className="relative space-y-0.5">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                                <span className="font-bold text-white uppercase block leading-tight">{edu.title}</span>
                                <span className="text-amber-400 text-[10px] font-semibold block">{edu.institution} ({edu.period})</span>
                                {edu.description && <span className="text-gray-400 text-[9px] block leading-tight">{edu.description}</span>}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      <div className="pt-6 text-[9px] font-mono text-gray-500 border-t border-white/5 relative z-10">
                        <span>{transcriptText}</span>
                      </div>
                    </div>

                    {/* RIGHT MAIN COLUMN - WHITE BACKGROUND */}
                    <div className="flex-1 bg-white text-gray-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                      
                      <div className="space-y-6">
                        
                        {/* Header Banner - Grey Box with Bold Name & Amber Accent */}
                        <div className="bg-gray-100 p-5 rounded-r-2xl border-l-8 border-amber-500 shadow-sm">
                          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900 leading-tight">
                            DEUWY ROBERT <span className="text-amber-500">TERÁN MEDINA</span>
                          </h1>
                          <p className="text-[10.5px] font-black uppercase text-gray-600 tracking-wider mt-1.5">
                            {t('curriculum.subtitle', 'INGENIERO DE PRODUCCIÓN Y CALIDAD • ECONOMISTA • AUDITOR LÍDER SIG ISO • IBM 2025 COACH')}
                          </p>
                        </div>

                        {/* SOBRE MÍ / ABOUT ME */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-extrabold text-[10px] shrink-0">
                              <User className="w-3 h-3" />
                            </span>
                            <h2 className="font-extrabold uppercase tracking-wider text-xs text-gray-900">
                              {summaryTitle}
                            </h2>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-xs pl-7 text-justify font-normal">
                            {cvSummary}
                          </p>
                        </div>

                        {/* IMPACTO Y RESULTADOS QUANTITATIVOS */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-extrabold text-[10px] shrink-0">
                              <Sparkles className="w-3 h-3" />
                            </span>
                            <h2 className="font-extrabold uppercase tracking-wider text-xs text-gray-900">
                              {t('curriculum.impact_title', 'Impacto y Resultados Operativos Comprobados')}
                            </h2>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pl-7">
                            {(Array.isArray(impactMetrics) ? impactMetrics : []).map((metric: any, idx: number) => (
                              <div key={`metric-${idx}`} className="bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl">
                                <span className="text-lg font-black text-amber-700 font-mono block leading-none">{metric.value}</span>
                                <span className="text-[10px] font-extrabold text-gray-900 block leading-tight mt-1">{metric.label}</span>
                                <span className="text-[8.5px] text-gray-500 block mt-0.5">{metric.detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* EXPERIENCIA LABORAL / JOB EXPERIENCE */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-extrabold text-[10px] shrink-0">
                              <Building className="w-3 h-3" />
                            </span>
                            <h2 className="font-extrabold uppercase tracking-wider text-xs text-gray-900">
                              {t('curriculum.career.title', 'Experiencia Profesional')}
                            </h2>
                          </div>

                          <div className="relative pl-7 space-y-4 border-l-2 border-amber-500 ml-2.5">
                            {(Array.isArray(careerRoles) ? careerRoles : []).map((role: any, idx: number) => (
                              <div key={`career-role-${idx}`} className="relative space-y-1">
                                <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow" />
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                  <h3 className="font-extrabold uppercase text-xs text-gray-900">
                                    {role.title}
                                  </h3>
                                  <span className="text-[9.5px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                                    {role.period}
                                  </span>
                                </div>
                                <p className="text-[10.5px] font-bold text-amber-600 italic">
                                  {role.company} | {role.location}
                                </p>
                                <ul className="list-disc list-inside text-[10.5px] text-gray-600 space-y-0.5 pt-0.5">
                                  {(role.responsibilities || []).slice(0, 4).map((resp: string, rIdx: number) => (
                                    <li key={`resp-${idx}-${rIdx}`} className="leading-tight">{resp}</li>
                                  ))}
                                </ul>
                                {role.achievements && role.achievements.length > 0 && (
                                  <div className="mt-1.5 p-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] text-gray-700">
                                    <span className="font-bold text-amber-700 block mb-0.5">{t('curriculum.achievements_label', '★ Logros Notables:')}</span>
                                    <ul className="list-square list-inside space-y-0.5">
                                      {(role.achievements || []).map((ach: string, aIdx: number) => (
                                        <li key={`ach-${idx}-${aIdx}`} className="text-[9.5px]">{ach}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CURSOS Y CERTIFICACIONES DESTACADAS */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-extrabold text-[10px] shrink-0">
                              <Award className="w-3 h-3" />
                            </span>
                            <h2 className="font-extrabold uppercase tracking-wider text-xs text-gray-900">
                              {t('curriculum.accreditations_title', 'Acreditaciones & Certificaciones de Calidad')}
                            </h2>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pl-7">
                            {(Array.isArray(accreditationsList) ? accreditationsList : []).map((course, idx) => (
                              <span key={`ind-course-${idx}`} className="text-[9.5px] font-mono font-medium px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-800 rounded-md">
                                ✓ {course}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Bottom Right Geometric Amber Vector SVG Cutout */}
                      <svg className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon points="100,100 0,100 100,0" fill="#f59e0b" />
                      </svg>

                    </div>

                  </div>
                </div>
              )}

              {/* TAB 1: OFFICIAL CERTIFICATES GRID */}
              {activeTab === 'official_certificates' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-xs font-mono text-gray-400">
                      Mostrando <strong className="text-white">{filteredOfficial.length}</strong> credenciales acreditadas. Haga clic en cualquiera para abrir su <span className="text-amber-400 font-bold">modelo de certificado a escala</span>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(Array.isArray(filteredOfficial) ? filteredOfficial : []).map((cert, idx) => (
                      <div
                        key={`official-cert-${cert.code || idx}-${idx}`}
                        onClick={() => setViewingCertificate(cert)}
                        className="bg-[#100e17] border border-white/5 hover:border-amber-500/50 rounded-2xl p-5 hover:bg-[#151220] transition duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-lg"
                      >
                        {cert.featured && (
                          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
                        )}

                        <div>
                          {/* Code & Issuer */}
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <span className="text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-lg uppercase">
                              {cert.code}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                              {cert.issuedDate}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-2">
                            {cert.title}
                          </h4>

                          {/* Description */}
                          <p className="text-xs text-gray-400 line-clamp-3 font-light leading-relaxed mb-4">
                            {cert.description}
                          </p>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                          <span className="text-gray-500 flex items-center gap-1">
                            <Building className="w-3 h-3 text-amber-500" /> {cert.issuer}
                          </span>
                          <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-1">
                            <span>Ver Modelo Escala</span>
                            <Maximize2 className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredOfficial.length === 0 && (
                    <div className="text-center py-16 bg-white/[0.01] rounded-2xl border border-white/5">
                      <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-xs font-mono">No se encontraron credenciales que coincidan con la búsqueda.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ALL LEARNING ACTIVITIES CATALOG */}
              {activeTab === 'all_activities' && (
                <div>
                  <div className="mb-4">
                    <p className="text-xs font-mono text-gray-400">
                      Catálogo completo de <strong className="text-white">{filteredActivities.length}</strong> actividades formativas, unidades, cursos y módulos acreditados por código oficial.
                    </p>
                  </div>

                  <div className="bg-[#0e0c15] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-black/60 border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-amber-400">
                            <th className="p-3.5 pl-6">Código / ID</th>
                            <th className="p-3.5">Título de la Actividad Formativa</th>
                            <th className="p-3.5 text-right pr-6">Certificado Escala</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs font-mono">
                          {(Array.isArray(filteredActivities) ? filteredActivities : []).map((act, idx) => (
                            <tr
                              key={`official-act-${act.code || idx}-${idx}`}
                              onClick={() => setViewingCertificate(act)}
                              className="hover:bg-amber-500/10 transition cursor-pointer group"
                            >
                              <td className="p-3.5 pl-6 text-amber-400 font-bold whitespace-nowrap">
                                {act.code}
                              </td>
                              <td className="p-3.5 text-gray-200 group-hover:text-white transition">
                                {act.title}
                              </td>
                              <td className="p-3.5 text-right pr-6 whitespace-nowrap">
                                <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-amber-500 text-gray-400 group-hover:text-black transition inline-flex items-center gap-1 text-[10px] font-bold">
                                  <Award className="w-3.5 h-3.5" />
                                  <span>Abrir</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {filteredActivities.length === 0 && (
                    <div className="text-center py-16 bg-white/[0.01] rounded-2xl border border-white/5">
                      <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-xs font-mono">No se encontraron actividades formativas para esa búsqueda.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CANDIDATE BIO & PROFILE */}
              {activeTab === 'bio' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="bg-[#100e17] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
                      <div className="w-28 h-28 rounded-full border-2 border-amber-500/40 p-1 bg-black shrink-0 overflow-hidden shadow-xl">
                        <img
                          src={profilePhotoUrl}
                          alt={candidateName}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";
                          }}
                        />
                      </div>

                      <div className="space-y-2 text-center sm:text-left">
                        <h3 className="text-2xl font-extrabold text-white">
                          {candidateName}
                        </h3>
                        <p className="text-xs text-amber-400 font-mono font-bold">
                          Ingeniero Economista • Auditor Líder SGC IRCA • Coach Estratégico
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start text-[11px] font-mono text-gray-400">
                          <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">F.N.: {birthDate}</span>
                          <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">Email: {candidateEmail}</span>
                          <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">Pearson Credly ID: {credlyId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Resumen Ejecutivo
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {cvSummary}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                        <span className="text-2xl font-mono font-black text-amber-400 block">20+</span>
                        <span className="text-[10px] text-gray-400 uppercase font-mono">Credenciales Oficiales</span>
                      </div>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                        <span className="text-2xl font-mono font-black text-red-500 block">200+</span>
                        <span className="text-[10px] text-gray-400 uppercase font-mono">Cursos Acreditados</span>
                      </div>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                        <span className="text-2xl font-mono font-black text-blue-400 block">ISO 9001</span>
                        <span className="text-[10px] text-gray-400 uppercase font-mono">Auditor Líder IRCA</span>
                      </div>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                        <span className="text-2xl font-mono font-black text-green-400 block">IBM 2025</span>
                        <span className="text-[10px] text-gray-400 uppercase font-mono">Certified Coach</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 px-6 bg-[#0d0c13] border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-400 shrink-0 print:hidden">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Transcript Oficial Pearson Credly expedido el {transcriptDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-5 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Exportando...' : 'Descargar CV (PDF)'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Scaled Certificate Model Viewer */}
      {viewingCertificate && (
        <ScaledCertificateModal
          isOpen={!!viewingCertificate}
          onClose={() => setViewingCertificate(null)}
          certificate={viewingCertificate}
        />
      )}
    </>
  );
}
