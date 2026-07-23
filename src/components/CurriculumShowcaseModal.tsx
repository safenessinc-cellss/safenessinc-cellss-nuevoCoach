import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { 
  CANDIDATE_INFO, 
  OFFICIAL_CERTIFICATES, 
  ALL_LEARNING_ACTIVITIES, 
  OfficialCertificate, 
  LearningActivity 
} from '../data/robertTeranCurriculumData';
import ScaledCertificateModal from './ScaledCertificateModal';

interface CurriculumShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to dynamically load html2pdf from CDN without Rollup module import issues
const getHtml2PdfLib = async () => {
  if (typeof window === 'undefined') return null;
  if ((window as any).html2pdf) {
    return (window as any).html2pdf;
  }
  return new Promise<any>((resolve) => {
    const existingScript = document.getElementById('html2pdf-cdn-script');
    if (existingScript) {
      if ((window as any).html2pdf) {
        resolve((window as any).html2pdf);
      } else {
        existingScript.addEventListener('load', () => resolve((window as any).html2pdf));
      }
      return;
    }
    const script = document.createElement('script');
    script.id = 'html2pdf-cdn-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve((window as any).html2pdf);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
};

export default function CurriculumShowcaseModal({ isOpen, onClose }: CurriculumShowcaseModalProps) {
  const [activeTab, setActiveTab] = useState<'cv_template' | 'official_certificates' | 'all_activities' | 'bio'>('cv_template');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  
  const { profile } = useProfileSettings();
  const profilePhotoUrl = profile.photoUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";

  // Selected certificate for scaled modal viewer
  const [viewingCertificate, setViewingCertificate] = useState<OfficialCertificate | LearningActivity | null>(null);

  if (!isOpen) return null;

  // Export to PDF function using dynamically loaded html2pdf.js
  const handleExportPDF = async () => {
    const element = document.getElementById('curriculum-cv-document');
    if (!element) return;
    
    setIsExporting(true);
    try {
      const html2pdfLib = await getHtml2PdfLib();
      if (html2pdfLib) {
        const opt = {
          margin: 0,
          filename: `Curriculum_Robert_Teran.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };
        await html2pdfLib().set(opt).from(element).save();
      } else {
        window.print();
      }
    } catch (err) {
      console.error("Error al exportar PDF con html2pdf, recurriendo a vista de impresión:", err);
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
                      <Sparkles className="w-3.5 h-3.5" /> Currículo Ejecutivo & Portal de Credenciales
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {CANDIDATE_INFO.name}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                      Coach Ejecutivo • Auditor Líder SGC IRCA • Ingeniero Economista
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Export PDF Button */}
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                    <span>{isExporting ? 'Generando PDF...' : 'Exportar a PDF'}</span>
                  </button>

                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white rounded-xl text-xs font-mono flex items-center gap-2 transition cursor-pointer"
                    title="Imprimir o guardar PDF nativo del navegador"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Imprimir</span>
                  </button>

                  <a
                    href={CANDIDATE_INFO.credlyProfile}
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
                  onClick={() => setActiveTab('cv_template')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'cv_template'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Currículo Ejecutivo (Plantilla Oficial)</span>
                </button>

                <button
                  onClick={() => setActiveTab('official_certificates')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'official_certificates'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Credenciales Credly ({OFFICIAL_CERTIFICATES.length})</span>
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
                  <span>Actividades & Cursos ({ALL_LEARNING_ACTIVITIES.length})</span>
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
                  <span>Perfil & Estadísticas</span>
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
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
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
                  
                  {/* Floating Actions Bar */}
                  <div className="w-full max-w-[820px] mb-4 flex justify-between items-center text-xs font-mono text-gray-400 bg-white/5 p-3 rounded-2xl border border-white/10 print:hidden">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Vista previa de impresión oficial (Formato A4 Ejecutivo)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Exportar PDF</span>
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span>Imprimir</span>
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
                      
                      {/* Top-Left Geometric Amber Triangle Cutout */}
                      <div className="absolute top-0 left-0 w-0 h-0 border-t-[95px] border-t-amber-500 border-r-[95px] border-r-transparent pointer-events-none z-0" />

                      <div className="relative z-10 space-y-6">
                        
                        {/* Coach Profile Photo Container in Arched Oval Frame */}
                        <div className="flex flex-col items-center pt-2">
                          <div className="relative">
                            <div className="w-36 h-44 rounded-t-[72px] rounded-b-2xl overflow-hidden border-4 border-amber-500 bg-black shadow-2xl flex items-center justify-center">
                              <img
                                src={profilePhotoUrl}
                                alt={CANDIDATE_INFO.name}
                                className="w-full h-full object-cover object-top"
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
                              Contacto
                            </h3>
                          </div>

                          <div className="relative pl-4 space-y-3 border-l-2 border-amber-500 ml-2 text-[11px]">
                            {/* Phone */}
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="text-gray-400 text-[9.5px] uppercase font-mono block font-bold">Teléfono / WhatsApp</span>
                              <span className="font-semibold text-white block">+51 984 45C F48</span>
                              <span className="text-gray-300 text-[10px] block">+51 970 533 393</span>
                            </div>

                            {/* Email & Web */}
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="text-gray-400 text-[9.5px] uppercase font-mono block font-bold">Email / Credly</span>
                              <a href={`mailto:${CANDIDATE_INFO.email}`} className="font-medium text-amber-400 hover:underline block break-all text-[10.5px]">
                                {CANDIDATE_INFO.email}
                              </a>
                              <span className="text-gray-300 text-[9.5px] block break-all">credly.com/users/deuwy-medina</span>
                            </div>

                            {/* Location */}
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="text-gray-400 text-[9.5px] uppercase font-mono block font-bold">Ubicación</span>
                              <span className="font-medium text-white block">Lima, Perú</span>
                              <span className="text-gray-300 text-[9.5px] block">Cobertura LATAM & Global</span>
                            </div>
                          </div>
                        </div>

                        {/* REFERENCIAS / CREDENCIALES CLAVE */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-1.5">
                            <span className="p-1 rounded-full bg-amber-500 text-black shrink-0">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </span>
                            <h3 className="font-extrabold uppercase text-xs tracking-wider text-white">
                              Referencias
                            </h3>
                          </div>

                          <div className="relative pl-4 space-y-3 border-l-2 border-amber-500 ml-2 text-[11px]">
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="font-bold text-amber-400 block">IBM SkillsBuild & Credly</span>
                              <span className="text-gray-300 text-[9.5px] block font-mono">ID: {CANDIDATE_INFO.credlyId}</span>
                              <span className="text-gray-400 text-[9px] block">20+ Insignias Digitales Acreditadas</span>
                            </div>

                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="font-bold text-amber-400 block">Auditor Líder SGC IRCA</span>
                              <span className="text-gray-300 text-[9.5px] block">ISO 9001, 14001, 45001, 27001</span>
                            </div>
                          </div>
                        </div>

                        {/* EDUCACIÓN */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-1.5">
                            <span className="p-1 rounded-full bg-amber-500 text-black shrink-0">
                              <GraduationCap className="w-3.5 h-3.5" />
                            </span>
                            <h3 className="font-extrabold uppercase text-xs tracking-wider text-white">
                              Educación
                            </h3>
                          </div>

                          <div className="relative pl-4 space-y-3 border-l-2 border-amber-500 ml-2 text-[11px]">
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="font-bold text-white uppercase block">Grado Universitario</span>
                              <span className="text-amber-400 text-[10.5px] font-semibold block">Ingeniero Economista</span>
                              <span className="text-gray-400 text-[9px] block">Especialización en Finanzas y Costos</span>
                            </div>

                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#1a1d20]" />
                              <span className="font-bold text-white uppercase block">Certificaciones de Posgrado</span>
                              <span className="text-amber-400 text-[10.5px] font-semibold block">Coach Estratégico & Psicopedagogía</span>
                              <span className="text-gray-400 text-[9px] block">Sistemas Integrados de Gestión ISO</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="pt-6 text-[9px] font-mono text-gray-500 border-t border-white/5 relative z-10">
                        <span>Transcript Oficial expedido el {CANDIDATE_INFO.transcriptDate}</span>
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
                          <p className="text-[11px] font-black uppercase text-gray-600 tracking-wider mt-1.5">
                            COACH EJECUTIVO • INGENIERO ECONOMISTA • AUDITOR LÍDER SIG ISO
                          </p>
                        </div>

                        {/* SOBRE MÍ / ABOUT ME */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-extrabold text-[10px] shrink-0">
                              <User className="w-3 h-3" />
                            </span>
                            <h2 className="font-extrabold uppercase tracking-wider text-xs text-gray-900">
                              Sobre Mí
                            </h2>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-xs pl-7 text-justify font-normal">
                            {CANDIDATE_INFO.summary}
                          </p>
                        </div>

                        {/* EXPERIENCIA LABORAL / JOB EXPERIENCE */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-extrabold text-[10px] shrink-0">
                              <Building className="w-3 h-3" />
                            </span>
                            <h2 className="font-extrabold uppercase tracking-wider text-xs text-gray-900">
                              Experiencia Laboral
                            </h2>
                          </div>

                          <div className="relative pl-7 space-y-4 border-l-2 border-amber-500 ml-2.5">
                            
                            {/* Role 1 */}
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow" />
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                <h3 className="font-extrabold uppercase text-xs text-gray-900">
                                  DIRECTOR DE CONSULTORÍA & COACH EJECUTIVO SIG
                                </h3>
                                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  2020 - Presente
                                </span>
                              </div>
                              <p className="text-[10.5px] font-bold text-amber-600 italic">
                                SGC Coach / Firma de Consultoría ISO
                              </p>
                              <p className="text-[11px] text-gray-600 leading-relaxed pt-0.5">
                                Dirección e implementación de Sistemas Integrados de Gestión (ISO 9001, 14001, 45001, 27001, 42001). Acompañamiento directivo mediante Coaching Estratégico y Psicopedagogía Organizacional para alinear el liderazgo directivo con la rentabilidad y la excelencia operativa.
                              </p>
                            </div>

                            {/* Role 2 */}
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow" />
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                <h3 className="font-extrabold uppercase text-xs text-gray-900">
                                  AUDITOR LÍDER SIG & CONSULTOR SÉNIOR ISO
                                </h3>
                                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  2015 - 2020
                                </span>
                              </div>
                              <p className="text-[10.5px] font-bold text-amber-600 italic">
                                Certificadoras Internacionales & Sector Industrial
                              </p>
                              <p className="text-[11px] text-gray-600 leading-relaxed pt-0.5">
                                Ejecución de auditorías de tercera parte acreditadas IRCA, identificación de brechas normativas, matrices de gestión de riesgos ISO 31000 / FMEA y facilitación de tableros de control con OKRs operacionales en sectores industriales y servicios.
                              </p>
                            </div>

                            {/* Role 3 */}
                            <div className="relative space-y-0.5">
                              <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow" />
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                <h3 className="font-extrabold uppercase text-xs text-gray-900">
                                  INGENIERO ECONOMISTA & ANALISTA DE CONTROL OPERATIVO
                                </h3>
                                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  2010 - 2015
                                </span>
                              </div>
                              <p className="text-[10.5px] font-bold text-amber-600 italic">
                                Sector Corporativo & Financiero
                              </p>
                              <p className="text-[11px] text-gray-600 leading-relaxed pt-0.5">
                                Modelado financiero de costes de calidad, análisis de viabilidad económica de proyectos, optimización de flujos de valor (Value Stream Mapping) y auditorías internas de cumplimiento organizativo.
                              </p>
                            </div>

                          </div>
                        </div>

                        {/* SKILLS / HABILIDADES & COMPETENCIAS */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-extrabold text-[10px] shrink-0">
                              <Award className="w-3 h-3" />
                            </span>
                            <h2 className="font-extrabold uppercase tracking-wider text-xs text-gray-900">
                              Habilidades & Competencias
                            </h2>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                            
                            {/* Skill 1 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-gray-800">
                                <span>Sistemas Integrados ISO (9001, 14001, 45001)</span>
                                <span className="text-amber-600">98%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: '98%' }} />
                              </div>
                            </div>

                            {/* Skill 2 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-gray-800">
                                <span>Coaching Estratégico & Liderazgo</span>
                                <span className="text-amber-600">95%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: '95%' }} />
                              </div>
                            </div>

                            {/* Skill 3 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-gray-800">
                                <span>Auditoría Líder IRCA & Control Interno</span>
                                <span className="text-amber-600">96%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: '96%' }} />
                              </div>
                            </div>

                            {/* Skill 4 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-gray-800">
                                <span>Ciberseguridad & ISO 27001 (IBM)</span>
                                <span className="text-amber-600">90%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: '90%' }} />
                              </div>
                            </div>

                            {/* Skill 5 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-gray-800">
                                <span>Inteligencia Artificial (IBM Watson)</span>
                                <span className="text-amber-600">88%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }} />
                              </div>
                            </div>

                            {/* Skill 6 */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-gray-800">
                                <span>Design Thinking & Metodologías Ágiles</span>
                                <span className="text-amber-600">92%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: '92%' }} />
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>

                      {/* Bottom Right Geometric Amber Accent Cutout */}
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[95px] border-b-amber-500 border-l-[95px] border-l-transparent pointer-events-none z-0" />

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
                    {filteredOfficial.map((cert, idx) => (
                      <div
                        key={`${cert.code}-${idx}`}
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
                          {filteredActivities.map((act, idx) => (
                            <tr
                              key={`${act.code}-${idx}`}
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
                          alt={CANDIDATE_INFO.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";
                          }}
                        />
                      </div>

                      <div className="space-y-2 text-center sm:text-left">
                        <h3 className="text-2xl font-extrabold text-white">
                          {CANDIDATE_INFO.name}
                        </h3>
                        <p className="text-xs text-amber-400 font-mono font-bold">
                          Ingeniero Economista • Auditor Líder SGC IRCA • Coach Estratégico
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start text-[11px] font-mono text-gray-400">
                          <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">F.N.: {CANDIDATE_INFO.birthDate}</span>
                          <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">Email: {CANDIDATE_INFO.email}</span>
                          <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">Pearson Credly ID: {CANDIDATE_INFO.credlyId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Resumen Ejecutivo
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {CANDIDATE_INFO.summary}
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
                <span>Transcript Oficial Pearson Credly expedido el {CANDIDATE_INFO.transcriptDate}</span>
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
