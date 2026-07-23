import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Globe, 
  QrCode, 
  Maximize2, 
  Minimize2,
  ZoomIn,
  ZoomOut,
  BadgeCheck,
  Building2,
  Calendar,
  FileCode
} from 'lucide-react';
import { CANDIDATE_INFO, OfficialCertificate, LearningActivity } from '../data/robertTeranCurriculumData';

interface ScaledCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: OfficialCertificate | LearningActivity | null;
}

export default function ScaledCertificateModal({ isOpen, onClose, certificate }: ScaledCertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState<number>(1);
  const [theme, setTheme] = useState<'luxury_dark' | 'official_light'>('luxury_dark');

  if (!isOpen || !certificate) return null;

  // Determine metadata
  const isOfficial = 'issuer' in certificate;
  const officialCert = isOfficial ? (certificate as OfficialCertificate) : null;

  const code = certificate.code;
  const title = certificate.title;
  const issuer = officialCert ? officialCert.issuer : 'IBM SkillsBuild / Credly Accredited';
  const issuedDate = officialCert ? officialCert.issuedDate : '2025 - 2026';
  const description = officialCert ? officialCert.description : 'Actividad formativa acreditada en la matriz de competencias de Robert Terán Medina.';
  const categoryLabel = officialCert ? officialCert.categoryLabel : 'Capacitación Especializada';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[700] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-5xl bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Control Bar */}
          <div className="bg-[#121118] border-b border-white/10 px-6 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
                  Modelo de Certificado a Escala
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {title}
                </h3>
              </div>
            </div>

            {/* Action Bar Controls */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Theme Toggle */}
              <div className="flex bg-black/40 border border-white/10 p-1 rounded-xl text-xs font-mono">
                <button
                  onClick={() => setTheme('luxury_dark')}
                  className={`px-2.5 py-1 rounded-lg transition ${theme === 'luxury_dark' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Obsidian Gold
                </button>
                <button
                  onClick={() => setTheme('official_light')}
                  className={`px-2.5 py-1 rounded-lg transition ${theme === 'official_light' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Oficial Claro
                </button>
              </div>

              {/* Zoom Scale Controls */}
              <div className="hidden sm:flex items-center bg-black/40 border border-white/10 px-2 py-1 rounded-xl gap-1 text-xs text-gray-300 font-mono">
                <button 
                  onClick={() => setScale(prev => Math.max(0.75, prev - 0.15))}
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                  title="Reducir escala"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1 text-[11px] font-bold">{Math.round(scale * 100)}%</span>
                <button 
                  onClick={() => setScale(prev => Math.min(1.3, prev + 0.15))}
                  className="p-1 hover:text-white hover:bg-white/10 rounded"
                  title="Aumentar escala"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Copy Code */}
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition"
                title="Copiar Código de Certificado"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden md:inline">{code}</span>
              </button>

              {/* Print */}
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition"
                title="Imprimir / Exportar PDF"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition border border-red-500/30"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Main Certificate Canvas Viewport */}
          <div className="p-4 sm:p-8 overflow-y-auto flex-1 flex justify-center items-center bg-[#050508] relative">
            
            {/* The Scaled Digital Certificate Document */}
            <div 
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
              className={`w-full max-w-3xl transition-transform duration-300 rounded-2xl border-4 relative overflow-hidden shadow-2xl p-6 sm:p-12 ${
                theme === 'luxury_dark'
                  ? 'bg-gradient-to-br from-[#0e0c14] via-[#12101a] to-[#08070d] border-amber-500/40 text-white'
                  : 'bg-amber-50/95 border-amber-800/40 text-slate-900 shadow-amber-900/20'
              }`}
            >
              {/* Outer Decorative Filigree Border */}
              <div className={`absolute inset-2 border-2 pointer-events-none rounded-xl ${
                theme === 'luxury_dark' ? 'border-amber-500/20' : 'border-amber-800/20'
              }`} />
              <div className={`absolute inset-3 border pointer-events-none rounded-lg ${
                theme === 'luxury_dark' ? 'border-amber-500/10' : 'border-amber-800/10'
              }`} />

              {/* Corner Watermarks */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/40" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/40" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/40" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/40" />

              {/* Certificate Header Branding */}
              <div className="flex justify-between items-start border-b pb-6 mb-8 gap-4 border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    theme === 'luxury_dark' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-amber-900/10 text-amber-900 border border-amber-800/30'
                  }`}>
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold text-amber-500 block">
                      Pearson Credly • Official Transcript
                    </span>
                    <h4 className="text-lg font-black tracking-wider uppercase">
                      {issuer}
                    </h4>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase border block mb-1 ${
                    theme === 'luxury_dark' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-amber-800/10 text-amber-900 border-amber-800/30'
                  }`}>
                    Acreditado Oficial
                  </span>
                  <span className="text-[10px] text-gray-400 block">
                    ID: {code}
                  </span>
                </div>
              </div>

              {/* Certificate Main Title */}
              <div className="text-center space-y-4 my-8">
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-amber-500 font-bold">
                  Certificado Oficial de Acreditación Digital
                </p>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight uppercase font-serif">
                  {title}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
              </div>

              {/* Recipient Section */}
              <div className="text-center my-8 space-y-2">
                <p className={`text-xs uppercase font-mono tracking-widest ${theme === 'luxury_dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Otorgado solemnemente a:
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight underline decoration-amber-500/40 decoration-2 underline-offset-8">
                  {CANDIDATE_INFO.name}
                </h2>
                <p className={`text-[11px] font-mono ${theme === 'luxury_dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Credly ID: <strong className="text-amber-500">{CANDIDATE_INFO.credlyId}</strong> • F.N. {CANDIDATE_INFO.birthDate}
                </p>
              </div>

              {/* Description Body */}
              <div className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed my-6 font-light ${
                theme === 'luxury_dark'
                  ? 'bg-black/40 border-amber-500/20 text-gray-300'
                  : 'bg-amber-100/60 border-amber-800/20 text-slate-800'
              }`}>
                <p className="italic">
                  "{description}"
                </p>
                <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-wrap justify-between items-center text-[10px] font-mono text-amber-500 font-bold">
                  <span>Categoría: {categoryLabel}</span>
                  <span>Código de Verificación: {code}</span>
                </div>
              </div>

              {/* Bottom Signatures & Seal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-amber-500/20 items-end mt-8">
                {/* Date */}
                <div className="text-left space-y-1">
                  <span className={`text-[10px] uppercase font-mono block ${theme === 'luxury_dark' ? 'text-gray-500' : 'text-slate-500'}`}>
                    Fecha de Emisión
                  </span>
                  <p className="text-xs font-bold font-mono text-amber-500">
                    {issuedDate}
                  </p>
                </div>

                {/* Official Stamp Badge */}
                <div className="text-center flex flex-col items-center justify-center">
                  <div className={`w-20 h-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-1 relative shadow-inner ${
                    theme === 'luxury_dark' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-amber-800 bg-amber-800/10 text-amber-900'
                  }`}>
                    <BadgeCheck className="w-8 h-8 animate-pulse" />
                    <span className="text-[7px] font-mono uppercase font-black tracking-tighter mt-0.5">VERIFIED</span>
                    <span className="text-[6px] font-mono">CREDLY IBM</span>
                  </div>
                </div>

                {/* Verification QR / Link */}
                <div className="text-right space-y-1">
                  <span className={`text-[10px] uppercase font-mono block ${theme === 'luxury_dark' ? 'text-gray-500' : 'text-slate-500'}`}>
                    Verificación Credly
                  </span>
                  <a
                    href={CANDIDATE_INFO.credlyProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:underline font-mono"
                  >
                    <span>credly.com/users</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Watermark Transcript footer */}
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-gray-500">
                <span>Pearson Credly Official Transcript • Issued for Deuwy Robert Teran Medina</span>
                <span>UUID: {CANDIDATE_INFO.credlyId}</span>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="bg-[#121118] border-t border-white/10 p-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Acreditación verificable en la red oficial de Credly / IBM SkillsBuild</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={CANDIDATE_INFO.credlyProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono px-5 py-2 rounded-xl flex items-center gap-2 transition uppercase text-[11px] tracking-wider"
              >
                <span>Verificar Perfil en Credly</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
