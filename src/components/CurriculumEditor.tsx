import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  Briefcase,
  Palette
} from 'lucide-react';
import { useCurriculumSettings, CurriculumSettings, DEFAULT_CURRICULUM_SETTINGS } from '../data/useCurriculumSettings';
import CurriculumShowcaseModal from './CurriculumShowcaseModal';
import LanguageSelector from './LanguageSelector';
import { analyzeCurriculumPresentation, mergeCurriculumDocument, rewriteCurriculum } from '../ai/geminiClient';
import type { CurriculumMergePreview } from '../ai/geminiClient';
import { OFFICIAL_CERTIFICATES } from '../data/robertTeranCurriculumData';

export default function CurriculumEditor() {
  const { t } = useTranslation();
  const { curriculumData, updateCurriculum, loading } = useCurriculumSettings();
  const [formData, setFormData] = useState<CurriculumSettings>(() => ({
    ...DEFAULT_CURRICULUM_SETTINGS,
    ...curriculumData,
    appearance: { ...DEFAULT_CURRICULUM_SETTINGS.appearance, ...(curriculumData.appearance || {}), backgroundColor: '#FFFFFF' }
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'metrics' | 'experience' | 'education' | 'training' | 'appearance' | 'languages'>('info');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importNotice, setImportNotice] = useState('');
  const [importPreview, setImportPreview] = useState<CurriculumMergePreview | null>(null);
  const [importFileName, setImportFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisPreview, setAnalysisPreview] = useState<import('../data/useCurriculumSettings').CurriculumPresentationAnalysis | null>(null);
  const [isImprovingSummary, setIsImprovingSummary] = useState(false);
  const [summaryAiError, setSummaryAiError] = useState('');
  const [summaryAiDraft, setSummaryAiDraft] = useState('');
  const [summaryAiInstructions, setSummaryAiInstructions] = useState('Melhore a clareza, o impacto executivo e a leitura para recrutadores. Mantenha o idioma português, os dados verificáveis e os números originais. Não invente certificações, empresas ou resultados.');

  useEffect(() => {
    if (curriculumData) {
      setFormData({
        ...DEFAULT_CURRICULUM_SETTINGS,
        ...curriculumData,
        appearance: { ...DEFAULT_CURRICULUM_SETTINGS.appearance, ...(curriculumData.appearance || {}), backgroundColor: curriculumData.appearance?.backgroundColor?.toUpperCase() === '#000000' ? '#FFFFFF' : (curriculumData.appearance?.backgroundColor || '#FFFFFF') }
      });
    }
  }, [curriculumData]);

  const handleCurriculumFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setImportError('');
    setImportNotice('');
    setImportPreview(null);
    const lowerName = file.name.toLowerCase();
    const mimeType = file.type || (lowerName.endsWith('.md') ? 'text/markdown' : lowerName.endsWith('.txt') ? 'text/plain' : '');
    const supported = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain', 'text/markdown'];
    if (!supported.includes(mimeType)) {
      setImportError('Formato no admitido. Sube un PDF, JPG, PNG, WEBP, TXT o Markdown.');
      input.value = '';
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setImportError('El archivo supera el límite de 3 MB. Reduce el tamaño y vuelve a intentarlo.');
      input.value = '';
      return;
    }

    setIsImporting(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('No se pudo leer el archivo.'));
        reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
        reader.readAsDataURL(file);
      });
      const preview = await mergeCurriculumDocument(dataUrl, mimeType, file.name, formData);
      setImportFileName(file.name);
      setImportPreview(preview);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'No se pudo analizar el documento.');
    } finally {
      setIsImporting(false);
      input.value = '';
    }
  };

  const applyCurriculumMerge = () => {
    if (!importPreview) return;
    setFormData(importPreview.curriculum);
    setImportPreview(null);
    setImportError('');
    setImportNotice(`Fusión aplicada al editor. Revisa los datos y pulsa “${t('adminModules.curriculum.save')}” para conservarlos.`);
    setSaveSuccess(false);
    setActiveTab('training');
  };

  const handleAnalyzePresentation = async () => {
    setIsAnalyzing(true);
    setAnalysisError('');
    setAnalysisPreview(null);
    try {
      const safeCurriculum = {
        candidateInfo: { name: formData.candidateInfo.name, summary: formData.candidateInfo.summary },
        impactMetrics: formData.impactMetrics,
        careerRoles: formData.careerRoles,
        educationItems: formData.educationItems,
        languagesList: formData.languagesList,
        industrialCourses: formData.industrialCourses.map((course: any) => ({
          title: String(course?.title || course?.name || course?.course || ''),
          code: String(course?.code || ''),
          issuer: String(course?.issuer || course?.institution || course?.provider || ''),
          category: String(course?.category || course?.categoryLabel || ''),
          completedDate: String(course?.completedDate || course?.date || ''),
        })).filter((course: any) => course.title),
      };
      const certificates = OFFICIAL_CERTIFICATES.map(({ title, issuer, category, categoryLabel, description, issuedDate }) => ({ title, issuer, category, categoryLabel, description, issuedDate }));
      setAnalysisPreview(await analyzeCurriculumPresentation(safeCurriculum, certificates));
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'No se pudo analizar el currículo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyPresentationAnalysis = () => {
    if (!analysisPreview) return;
    setFormData(prev => ({
      ...prev,
      candidateInfo: { ...prev.candidateInfo, summary: analysisPreview.executiveSummary || prev.candidateInfo.summary },
      professionalAnalysis: analysisPreview,
    }));
    setImportNotice('Análisis aplicado al editor. Guarda los cambios para conservar el resumen y las recomendaciones de presentación.');
    setAnalysisError('');
  };

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

  const handleImproveProfessionalSummary = async () => {
    setIsImprovingSummary(true);
    setSummaryAiError('');
    setSummaryAiDraft('');
    try {
      const result = await rewriteCurriculum({
        summary: String(formData.candidateInfo.summary || ''),
        impactMetrics: formData.impactMetrics,
        careerRoles: formData.careerRoles,
        educationItems: formData.educationItems,
        certificateTitles: OFFICIAL_CERTIFICATES.map(certificate => certificate.title),
      }, summaryAiInstructions);
      const suggestion = String(result?.summary || '').trim();
      if (!suggestion) throw new Error('A IA não devolveu uma proposta de resumo. Tente novamente.');
      setSummaryAiDraft(suggestion);
    } catch (error) {
      setSummaryAiError(error instanceof Error ? error.message : 'Não foi possível melhorar o resumo com IA.');
    } finally {
      setIsImprovingSummary(false);
    }
  };

  const applyProfessionalSummary = () => {
    if (!summaryAiDraft.trim()) return;
    setFormData(prev => ({
      ...prev,
      candidateInfo: { ...prev.candidateInfo, summary: summaryAiDraft.trim() },
    }));
    setSummaryAiDraft('');
    setSummaryAiError('');
    setImportNotice('Resumo profissional atualizado no editor. Clique em “Guardar Alterações” para publicá-lo.');
    setSaveSuccess(false);
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
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-xl text-gray-900">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-500" /> Editor y Corrección de Currículo
            </h2>
            <p className="text-gray-600 text-xs mt-1">
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
              <span>{t('adminModules.curriculum.preview')}</span>
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
                  <span>{t('adminModules.curriculum.saved')}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('adminModules.curriculum.save')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Importación y fusión asistida de currículos antiguos */}
        <section className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {t('adminModules.curriculum.merge')}
              </h3>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-gray-600">
                {t('adminModules.curriculum.mergeDesc')}
              </p>
            </div>
            <label className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/15 px-4 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/25 ${isImporting ? 'pointer-events-none opacity-60' : ''}`}>
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {isImporting ? 'Analizando documento…' : t('adminModules.curriculum.uploadOld')}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.md,application/pdf,image/jpeg,image/png,image/webp,text/plain,text/markdown"
                className="hidden"
                disabled={isImporting}
                onChange={handleCurriculumFile}
              />
            </label>
          </div>

          <p className="mt-3 text-[10px] text-gray-500">{t('adminModules.curriculum.uploadHelp')}</p>

          {importError && <p role="alert" className="mt-3 rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-300">{importError}</p>}
          {importNotice && <p role="status" className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-300">{importNotice}</p>}

          {importPreview && (
            <div className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-xs font-bold text-gray-900">Fusión preparada: {importFileName}</p>
                <p className="mt-1 text-[11px] text-gray-600">{t('adminModules.curriculum.notSaved')}</p>
              </div>
              {importPreview.notes.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">{t('adminModules.curriculum.recovered')}</p>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
                    {importPreview.notes.map((note, index) => <li key={index}>{note}</li>)}
                  </ul>
                </div>
              )}
              {importPreview.conflicts.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">{t('adminModules.curriculum.review')}</p>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
                    {importPreview.conflicts.map((conflict, index) => <li key={index}>{conflict}</li>)}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={applyCurriculumMerge} className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-extrabold text-black transition hover:bg-amber-400">{t('adminModules.curriculum.applyMerge')}</button>
                <button type="button" onClick={() => setImportPreview(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50">{t('adminModules.curriculum.discard')}</button>
              </div>
            </div>
          )}
        </section>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'info'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t('adminModules.curriculum.info')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('adminModules.curriculum.metrics')} ({formData.impactMetrics.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{t('adminModules.curriculum.experience')} ({formData.careerRoles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'education'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t('adminModules.curriculum.education')} ({formData.educationItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'training'
                ? 'bg-blue-500 text-gray-900 shadow-lg shadow-blue-500/20'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('adminModules.curriculum.training')} ({formData.industrialCourses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-blue-500 text-gray-900 shadow-lg shadow-blue-500/20'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{t('adminModules.curriculum.appearance')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('languages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'languages'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('adminModules.curriculum.languages')} ({formData.languagesList.length})</span>
          </button>
        </div>

        {/* TAB 1: DATOS PERSONALES */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{t('adminModules.curriculum.fullName')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.candidateInfo.name}
                  onChange={handleInfoChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{t('adminModules.curriculum.phone')}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.candidateInfo.phone || ''}
                  onChange={handleInfoChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{t('adminModules.curriculum.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.candidateInfo.email}
                  onChange={handleInfoChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{t('adminModules.curriculum.location')}</label>
                <input
                  type="text"
                  name="location"
                  value={formData.candidateInfo.location || ''}
                  onChange={handleInfoChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{t('adminModules.curriculum.credly')}</label>
                <input
                  type="text"
                  name="credlyProfile"
                  value={formData.candidateInfo.credlyProfile}
                  onChange={handleInfoChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{t('adminModules.curriculum.transcriptDate')}</label>
                <input
                  type="text"
                  name="transcriptDate"
                  value={formData.candidateInfo.transcriptDate}
                  onChange={handleInfoChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/5 p-4 md:p-5 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase text-sky-300 mb-1">{t('adminModules.curriculum.professionalSummary')}</label>
                  <p className="text-xs leading-relaxed text-gray-600">{t('adminModules.curriculum.summaryHelp')}</p>
                </div>
                <button
                  type="button"
                  onClick={handleImproveProfessionalSummary}
                  disabled={isImprovingSummary}
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-2.5 text-xs font-bold text-sky-200 transition hover:bg-sky-400/20 disabled:opacity-50"
                >
                  {isImprovingSummary ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isImprovingSummary ? 'Analisando com IA…' : 'Melhorar com IA'}
                </button>
              </div>
              <textarea
                name="summary"
                aria-label={t('adminModules.curriculum.professionalSummary')}
                value={formData.candidateInfo.summary}
                onChange={handleInfoChange}
                rows={6}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-900 focus:border-sky-400 focus:outline-none"
              />
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-gray-700">{t('adminModules.curriculum.aiGuidance')}</span>
                <textarea
                  value={summaryAiInstructions}
                  onChange={event => setSummaryAiInstructions(event.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-gray-200 focus:border-sky-400 focus:outline-none"
                  placeholder={t('adminModules.curriculum.aiExample')}
                />
              </label>
              {summaryAiError && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300">{summaryAiError}</p>}
              {summaryAiDraft && (
                <div className="space-y-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300"><Sparkles className="h-4 w-4" /> {t('adminModules.curriculum.aiProposal')}</div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-100">{summaryAiDraft}</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={applyProfessionalSummary} className="rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300">{t('adminModules.curriculum.applyProposal')}</button>
                    <button type="button" onClick={() => setSummaryAiDraft('')} className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-200 hover:bg-gray-50">{t('adminModules.curriculum.discard')}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MÉTRICAS DE IMPACTO */}
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">{t('adminModules.curriculum.metricsHelp')}</span>
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
                <div key={`edit-metric-${idx}`} className="bg-black/40 border border-gray-200 p-4 rounded-2xl relative space-y-3">
                  <button
                    type="button"
                    onClick={() => removeMetric(idx)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition"
                    title={t('adminModules.curriculum.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">{t('adminModules.curriculum.value')}</label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                        className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-bold font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">{t('adminModules.curriculum.label')}</label>
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                        className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">{t('adminModules.curriculum.detail')}</label>
                    <input
                      type="text"
                      value={metric.detail}
                      onChange={(e) => handleMetricChange(idx, 'detail', e.target.value)}
                      className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700"
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
              <span className="text-xs text-gray-600">{t('adminModules.curriculum.careerHelp')}</span>
              <button
                type="button"
                onClick={addRole}
                className="px-3.5 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Agregar Experiencia Laboral
              </button>
            </div>

            {formData.careerRoles.map((role, idx) => (
              <div key={`edit-role-${idx}`} className="bg-black/40 border border-gray-200 p-5 rounded-2xl space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeRole(idx)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition p-1 bg-red-500/10 rounded-lg border border-red-500/20"
                  title={t('adminModules.curriculum.deleteRole')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pr-10">
                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">{t('adminModules.curriculum.period')}</label>
                    <input
                      type="text"
                      value={role.period}
                      onChange={(e) => handleRoleChange(idx, 'period', e.target.value)}
                      className="w-full bg-black/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">{t('adminModules.curriculum.roleTitle')}</label>
                    <input
                      type="text"
                      value={role.title}
                      onChange={(e) => handleRoleChange(idx, 'title', e.target.value)}
                      className="w-full bg-black/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">{t('adminModules.curriculum.company')}</label>
                    <input
                      type="text"
                      value={role.company}
                      onChange={(e) => handleRoleChange(idx, 'company', e.target.value)}
                      className="w-full bg-black/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">{t('adminModules.curriculum.location')}</label>
                    <input
                      type="text"
                      value={role.location}
                      onChange={(e) => handleRoleChange(idx, 'location', e.target.value)}
                      className="w-full bg-black/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900"
                    />
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700">{t('adminModules.curriculum.responsibilities')}</label>
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
                          className="flex-1 bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-200"
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
              <span className="text-xs text-gray-600">{t('adminModules.curriculum.educationHelp')}</span>
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
                <div key={`edit-edu-${idx}`} className="bg-black/40 border border-gray-200 p-4 rounded-2xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition"
                    title={t('adminModules.curriculum.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">{t('adminModules.curriculum.period')}</label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) => handleEducationChange(idx, 'period', e.target.value)}
                        className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">{t('adminModules.curriculum.academicTitle')}</label>
                      <input
                        type="text"
                        value={edu.title}
                        onChange={(e) => handleEducationChange(idx, 'title', e.target.value)}
                        className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">{t('adminModules.curriculum.institution')}</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                      className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">{t('adminModules.curriculum.description')}</label>
                    <input
                      type="text"
                      value={edu.description || ''}
                      onChange={(e) => handleEducationChange(idx, 'description', e.target.value)}
                      className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: FORMACIÓN Y CURSOS IMPORTADOS */}
        {activeTab === 'training' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">{t('adminModules.curriculum.consolidated')}</h3>
                <p className="mt-1 text-xs text-gray-600">{t('adminModules.curriculum.consolidatedHelp')}</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, industrialCourses: [...prev.industrialCourses, { title: 'Nueva formación', institution: '', period: '', description: '' }] }))}
                className="shrink-0 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition"
              >
                <Plus className="inline w-4 h-4 mr-1" /> Agregar formación
              </button>
            </div>
            {formData.industrialCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-xs text-gray-600">{t('adminModules.curriculum.noTraining')}</div>
            ) : (
              <div className="space-y-3">
                {formData.industrialCourses.map((course: any, idx: number) => (
                  <div key={`training-${idx}`} className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="md:col-span-2 flex items-start justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Registro {idx + 1}</span>
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, industrialCourses: prev.industrialCourses.filter((_: any, i: number) => i !== idx) }))} className="text-red-400 hover:text-red-300" aria-label={`Eliminar formación ${idx + 1}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <label className="block text-[10px] font-bold text-gray-600">Título de la formación
                      <input value={course.title || course.name || course.course || ''} onChange={e => setFormData(prev => ({ ...prev, industrialCourses: prev.industrialCourses.map((item: any, i: number) => i === idx ? { ...item, title: e.target.value } : item) }))} className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900" />
                    </label>
                    <label className="block text-[10px] font-bold text-gray-600">Institución / emisor
                      <input value={course.institution || course.issuer || course.provider || ''} onChange={e => setFormData(prev => ({ ...prev, industrialCourses: prev.industrialCourses.map((item: any, i: number) => i === idx ? { ...item, institution: e.target.value } : item) }))} className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900" />
                    </label>
                    <label className="block text-[10px] font-bold text-gray-600">Fecha / periodo
                      <input value={course.period || course.completedDate || course.date || ''} onChange={e => setFormData(prev => ({ ...prev, industrialCourses: prev.industrialCourses.map((item: any, i: number) => i === idx ? { ...item, period: e.target.value } : item) }))} className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900" />
                    </label>
                    <label className="block text-[10px] font-bold text-gray-600">Categoría / descripción
                      <input value={course.description || course.category || ''} onChange={e => setFormData(prev => ({ ...prev, industrialCourses: prev.industrialCourses.map((item: any, i: number) => i === idx ? { ...item, description: e.target.value } : item) }))} className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900" />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* APARIENCIA DEL CURRÍCULO */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-sm font-bold text-gray-900">{t('adminModules.curriculum.design')}</h3>
              <p className="mt-1 text-xs text-gray-600">{t('adminModules.curriculum.designHelp')}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ['backgroundColor', 'Fondo del currículo', '#FFFFFF'],
                  ['sidebarColor', 'Fondo de la columna lateral', '#174EA6'],
                  ['accentColor', 'Color principal / acento', '#4285F4'],
                  ['textColor', 'Color del texto', '#1F2937'],
                ] as const).map(([field, label, fallback]) => (
                  <label key={field} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/[0.03] p-3 text-xs text-gray-700">
                    <span>{label}</span>
                    <span className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.appearance?.[field] || fallback}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          appearance: { backgroundColor: '#FFFFFF', sidebarColor: '#174EA6', accentColor: '#4285F4', textColor: '#1F2937', ...(prev.appearance || {}), [field]: e.target.value }
                        }))}
                        className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
                        style={{ colorScheme: 'light' }}
                        aria-label={label}
                      />
                      <input
                        type="text"
                        value={formData.appearance?.[field] || fallback}
                        maxLength={7}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^#[0-9A-Fa-f]{6}$/.test(value)) setFormData(prev => ({
                            ...prev,
                            appearance: { ...DEFAULT_CURRICULUM_SETTINGS.appearance, ...(prev.appearance || {}), [field]: value.toUpperCase() }
                          }));
                        }}
                        className="w-24 rounded-md border border-white/20 bg-white px-2 py-2 font-mono text-[10px] uppercase text-gray-900"
                        aria-label={`Código hexadecimal: ${label}`}
                      />
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, appearance: { backgroundColor: '#FFFFFF', sidebarColor: '#174EA6', accentColor: '#4285F4', textColor: '#1F2937' } }))} className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">{t('adminModules.curriculum.googlePreset')}</button>
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, appearance: { backgroundColor: '#F8FAFC', sidebarColor: '#0F766E', accentColor: '#14B8A6', textColor: '#0F172A' } }))} className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">{t('adminModules.curriculum.tealPreset')}</button>
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, appearance: { backgroundColor: '#FFFDF7', sidebarColor: '#172554', accentColor: '#D4A574', textColor: '#1F2937' } }))} className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">{t('adminModules.curriculum.bluePreset')}</button>
              </div>
            </div>
            <div className="rounded-2xl border border-sky-400/25 bg-sky-400/5 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900"><Sparkles className="h-4 w-4 text-sky-300" />{t('adminModules.curriculum.analysis')}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{t('adminModules.curriculum.analysisHelp')}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={handleAnalyzePresentation} disabled={isAnalyzing} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isAnalyzing ? 'Analizando todo el currículo…' : 'Analizar y mejorar con IA'}
                </button>
                {analysisPreview && <button type="button" onClick={handleApplyPresentationAnalysis} className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-400/20">{t('adminModules.curriculum.applyAnalysis')}</button>}
              </div>
              {analysisError && <p role="alert" className="mt-3 rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-300">{analysisError}</p>}
              {analysisPreview && (
                <div className="mt-4 space-y-4 rounded-xl border border-gray-200 bg-slate-950/60 p-4">
                  <div><p className="text-[10px] font-bold uppercase tracking-wide text-sky-300">{t('adminModules.curriculum.headline')}</p><p className="mt-1 text-sm font-bold text-gray-900">{analysisPreview.shortCvHeadline}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wide text-sky-300">{t('adminModules.curriculum.summary')}</p><p className="mt-1 text-xs leading-relaxed text-gray-200">{analysisPreview.executiveSummary}</p></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {analysisPreview.professionalAreas.map((area) => (
                      <div key={area.area} className="rounded-lg border border-gray-200 bg-white/[0.03] p-3">
                        <p className="text-xs font-bold text-gray-900">{area.area}</p><p className="mt-1 text-[11px] leading-relaxed text-gray-700">{area.summary}</p>
                        {area.strengths.length > 0 && <p className="mt-2 text-[10px] text-gray-600">Competencias: {area.strengths.slice(0, 4).join(' · ')}</p>}
                        {area.featuredCredentials.length > 0 && <p className="mt-1 text-[10px] text-sky-200">Credenciales: {area.featuredCredentials.slice(0, 3).join(' · ')}</p>}
                      </div>
                    ))}
                  </div>
                  {analysisPreview.recommendations.length > 0 && <div><p className="text-[10px] font-bold uppercase tracking-wide text-sky-300">{t('adminModules.curriculum.recommendations')}</p><ul className="mt-2 list-disc space-y-1 pl-5 text-[11px] text-gray-700">{analysisPreview.recommendations.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-sm font-bold text-gray-900">{t('adminModules.curriculum.languageTranslation')}</h3>
              <p className="mt-1 text-xs text-gray-600">{t('adminModules.curriculum.languageHelp')}</p>
              <div className="mt-4"><LanguageSelector variant="buttons" /></div>
            </div>
          </div>
        )}

        {/* TAB 5: IDIOMAS */}
        {activeTab === 'languages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">{t('adminModules.curriculum.languageDomain')}</span>
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
                <div key={`edit-lang-${idx}`} className="bg-black/40 border border-gray-200 p-4 rounded-2xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeLanguage(idx)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition"
                    title={t('adminModules.curriculum.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Idioma</label>
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(e) => handleLanguageChange(idx, 'name', e.target.value)}
                        className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">{t('adminModules.curriculum.level')}</label>
                      <input
                        type="text"
                        value={lang.level}
                        onChange={(e) => handleLanguageChange(idx, 'level', e.target.value)}
                        className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">{t('adminModules.curriculum.languageDetail')}</label>
                    <input
                      type="text"
                      value={lang.written}
                      onChange={(e) => handleLanguageChange(idx, 'written', e.target.value)}
                      className="w-full bg-black/60 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700"
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
