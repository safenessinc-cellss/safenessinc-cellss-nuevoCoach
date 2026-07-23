import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  FileCode, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Mail, 
  User, 
  ChevronRight,
  Layers,
  GraduationCap,
  Building,
  Maximize2
} from 'lucide-react';
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

export default function CurriculumShowcaseModal({ isOpen, onClose }: CurriculumShowcaseModalProps) {
  const [activeTab, setActiveTab] = useState<'official_certificates' | 'all_activities' | 'bio'>('official_certificates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Selected certificate for scaled modal viewer
  const [viewingCertificate, setViewingCertificate] = useState<OfficialCertificate | LearningActivity | null>(null);

  if (!isOpen) return null;

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
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Main Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-6xl bg-[#09080e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-950/40 via-amber-950/30 to-black p-6 sm:p-8 border-b border-white/10 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 shadow-lg shrink-0">
                    <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-amber-400">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Currículo & Registro Oficial de Credenciales
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {CANDIDATE_INFO.name}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                      ID Credly: <strong className="text-amber-400">{CANDIDATE_INFO.credlyId}</strong> • Transcript Pearson Credly / IBM SkillsBuild
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={CANDIDATE_INFO.credlyProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-amber-400 text-xs font-mono flex items-center gap-2 transition"
                  >
                    <span>Credly Oficial</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={onClose}
                    className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition border border-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 mt-6 border-t border-white/10 pt-4">
                <button
                  onClick={() => setActiveTab('official_certificates')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'official_certificates'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Credenciales Oficiales Credly ({OFFICIAL_CERTIFICATES.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('all_activities')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'all_activities'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Catálogo de Actividades & Cursos ({ALL_LEARNING_ACTIVITIES.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('bio')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'bio'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Resumen Profesional & Perfil</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar (Only shown for lists) */}
            {activeTab !== 'bio' && (
              <div className="p-4 px-6 bg-[#0f0e16] border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
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
            <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#06050a]">
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
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600/20 to-red-600/20 flex items-center justify-center text-amber-400 font-black text-2xl">
                          DRT
                        </div>
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
            <div className="p-4 px-6 bg-[#0d0c13] border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-400 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Transcript Oficial Pearson Credly expedido el {CANDIDATE_INFO.transcriptDate}</span>
              </div>
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2 rounded-xl transition"
              >
                Cerrar Ventana
              </button>
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
