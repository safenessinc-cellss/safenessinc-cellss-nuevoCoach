import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Save, 
  Plus, 
  Trash2, 
  Building, 
  GraduationCap, 
  Sparkles, 
  User, 
  BookOpen, 
  Award, 
  Loader2, 
  Eye, 
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { useCurriculumSettings, CurriculumSettings, DEFAULT_CURRICULUM_SETTINGS } from '../data/useCurriculumSettings';
import CurriculumShowcaseModal from './CurriculumShowcaseModal';

export default function CurriculumEditor() {
  const { curriculumData, updateCurriculum, loading } = useCurriculumSettings();
  const [formData, setFormData] = useState<CurriculumSettings>(curriculumData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'metrics' | 'experience' | 'education' | 'languages'>('info');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (curriculumData) {
      setFormData(curriculumData);
    }
  }, [curriculumData]);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      candidateInfo: {
        ...prev.candidateInfo,
        [name]: value
      }
    }));
  };

  // --- Metrics Handlers ---
  const handleMetricChange = (index: number, field: string, value: string) => {
    const updated = [...formData.impactMetrics];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, impactMetrics: updated }));
  };

  const addMetric = () => {
    setFormData(prev => ({
      ...prev,
      impactMetrics: [
        ...prev.impactMetrics,
        { value: "10%", label: "Nueva Métrica", detail: "Descripción detallada del resultado" }
      ]
    }));
  };

  const removeMetric = (index: number) => {
    setFormData(prev => ({
      ...prev,
      impactMetrics: prev.impactMetrics.filter((_, i) => i !== index)
    }));
  };

  // --- Career Role Handlers ---
  const handleRoleChange = (index: number, field: string, value: any) => {
    const updated = [...formData.careerRoles];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, careerRoles: updated }));
  };

  const handleResponsibilityChange = (roleIndex: number, respIndex: number, value: string) => {
    const updatedRoles = [...formData.careerRoles];
    const resps = [...(updatedRoles[roleIndex].responsibilities || [])];
    resps[respIndex] = value;
    updatedRoles[roleIndex].responsibilities = resps;
    setFormData(prev => ({ ...prev, careerRoles: updatedRoles }));
  };

  const addResponsibility = (roleIndex: number) => {
    const updatedRoles = [...formData.careerRoles];
    const resps = [...(updatedRoles[roleIndex].responsibilities || []), ""];
    updatedRoles[roleIndex].responsibilities = resps;
    setFormData(prev => ({ ...prev, careerRoles: updatedRoles }));
  };

  const removeResponsibility = (roleIndex: number, respIndex: number) => {
    const updatedRoles = [...formData.careerRoles];
    updatedRoles[roleIndex].responsibilities = updatedRoles[roleIndex].responsibilities.filter((_, i) => i !== respIndex);
    setFormData(prev => ({ ...prev, careerRoles: updatedRoles }));
  };

  const addRole = () => {
    setFormData(prev => ({
      ...prev,
      careerRoles: [
        {
          period: "2025 - Actualidad",
          title: "Nuevo Cargo / Posición",
          company: "Nombre de Empresa",
          location: "Ciudad, País",
          responsibilities: ["Liderar proyectos de optimización de procesos y calidad ISO."],
          achievements: ["Aumento de eficiencia en planta."]
        },
        ...prev.careerRoles
      ]
    }));
  };

  const removeRole = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerRoles: prev.careerRoles.filter((_, i) => i !== index)
    }));
  };

  // --- Education Handlers ---
  const handleEducationChange = (index: number, field: string, value: string) => {
    const updated = [...formData.educationItems];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, educationItems: updated }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationItems: [
        ...prev.educationItems,
        {
          period: "2020 - 2024",
          title: "Nuevo Título / Especialización",
          institution: "Universidad / Universidad Simón Bolívar",
          description: "Mención de honor o detalle académico"
        }
      ]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educationItems: prev.educationItems.filter((_, i) => i !== index)
    }));
  };

  // --- Languages Handlers ---
  const handleLanguageChange = (index: number, field: string, value: string) => {
    const updated = [...formData.languagesList];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, languagesList: updated }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languagesList: [
        ...prev.languagesList,
        { name: "Nuevo Idioma", level: "Avanzado / C1", written: "Escritura fluida y técnica" }
      ]
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languagesList: prev.languagesList.filter((_, i) => i !== index)
    }));
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateCurriculum(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error guardando currículo:", err);
      alert("Error al actualizar el currículo. Por favor intente nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-500" /> Editor y Corrección de Currículo
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Modifica la información ejecutiva, trayectoria, métricas y formación que se muestra en el currículo oficial y exportación PDF.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Vista Previa del CV</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center gap-2 transition shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-950" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'info'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Datos Personales & Resumen</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Métricas de Impacto ({formData.impactMetrics.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Experiencia Laboral ({formData.careerRoles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'education'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Educación ({formData.educationItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('languages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'languages'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Idiomas ({formData.languagesList.length})</span>
          </button>
        </div>

        {/* TAB 1: DATOS PERSONALES */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.candidateInfo.name}
                  onChange={handleInfoChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.candidateInfo.phone || ''}
                  onChange={handleInfoChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.candidateInfo.email}
                  onChange={handleInfoChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ubicación</label>
                <input
                  type="text"
                  name="location"
                  value={formData.candidateInfo.location || ''}
                  onChange={handleInfoChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Enlace Perfil Credly</label>
                <input
                  type="text"
                  name="credlyProfile"
                  value={formData.candidateInfo.credlyProfile}
                  onChange={handleInfoChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Fecha de Expedición Transcript</label>
                <input
                  type="text"
                  name="transcriptDate"
                  value={formData.candidateInfo.transcriptDate}
                  onChange={handleInfoChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Resumen Profesional (CV Summary)</label>
              <textarea
                name="summary"
                value={formData.candidateInfo.summary}
                onChange={handleInfoChange}
                rows={5}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 2: MÉTRICAS DE IMPACTO */}
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Tarjetas de métricas numéricas desplegadas en el encabezado.</span>
              <button
                type="button"
                onClick={addMetric}
                className="px-3 py-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Métrica
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.impactMetrics.map((metric, idx) => (
                <div key={`edit-metric-${idx}`} className="bg-black/40 border border-white/10 p-4 rounded-2xl relative space-y-3">
                  <button
                    type="button"
                    onClick={() => removeMetric(idx)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Valor (%)</label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-bold font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Título / Etiqueta</label>
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detalle Operativo</label>
                    <input
                      type="text"
                      value={metric.detail}
                      onChange={(e) => handleMetricChange(idx, 'detail', e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EXPERIENCIA LABORAL */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Cronología de cargos, empresas y logros operativos.</span>
              <button
                type="button"
                onClick={addRole}
                className="px-3.5 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Agregar Experiencia Laboral
              </button>
            </div>

            {formData.careerRoles.map((role, idx) => (
              <div key={`edit-role-${idx}`} className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeRole(idx)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition p-1 bg-red-500/10 rounded-lg border border-red-500/20"
                  title="Eliminar Cargo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pr-10">
                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">Periodo</label>
                    <input
                      type="text"
                      value={role.period}
                      onChange={(e) => handleRoleChange(idx, 'period', e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">Título del Cargo</label>
                    <input
                      type="text"
                      value={role.title}
                      onChange={(e) => handleRoleChange(idx, 'title', e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">Empresa</label>
                    <input
                      type="text"
                      value={role.company}
                      onChange={(e) => handleRoleChange(idx, 'company', e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">Ubicación</label>
                    <input
                      type="text"
                      value={role.location}
                      onChange={(e) => handleRoleChange(idx, 'location', e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-300">Responsabilidades Principales</label>
                    <button
                      type="button"
                      onClick={() => addResponsibility(idx)}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3 h-3" /> Añadir Punto
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(role.responsibilities || []).map((resp, rIdx) => (
                      <div key={`edit-resp-${idx}-${rIdx}`} className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => handleResponsibilityChange(idx, rIdx, e.target.value)}
                          className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeResponsibility(idx, rIdx)}
                          className="text-gray-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: EDUCACIÓN */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Títulos universitarios y certificaciones de formación académica.</span>
              <button
                type="button"
                onClick={addEducation}
                className="px-3.5 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Agregar Educación
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.educationItems.map((edu, idx) => (
                <div key={`edit-edu-${idx}`} className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Periodo</label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) => handleEducationChange(idx, 'period', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Título Académico</label>
                      <input
                        type="text"
                        value={edu.title}
                        onChange={(e) => handleEducationChange(idx, 'title', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Institución / Universidad</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Descripción / Mención</label>
                    <input
                      type="text"
                      value={edu.description || ''}
                      onChange={(e) => handleEducationChange(idx, 'description', e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: IDIOMAS */}
        {activeTab === 'languages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Dominio de lenguas e idiomas técnicos.</span>
              <button
                type="button"
                onClick={addLanguage}
                className="px-3.5 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Agregar Idioma
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.languagesList.map((lang, idx) => (
                <div key={`edit-lang-${idx}`} className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeLanguage(idx)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Idioma</label>
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(e) => handleLanguageChange(idx, 'name', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nivel</label>
                      <input
                        type="text"
                        value={lang.level}
                        onChange={(e) => handleLanguageChange(idx, 'level', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detalle de Dominio</label>
                    <input
                      type="text"
                      value={lang.written}
                      onChange={(e) => handleLanguageChange(idx, 'written', e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal de Vista Previa */}
      <CurriculumShowcaseModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
