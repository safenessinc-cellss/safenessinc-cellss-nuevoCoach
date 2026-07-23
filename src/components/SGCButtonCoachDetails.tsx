import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, ShieldCheck, Play, CheckCircle2, AlertTriangle, HelpCircle, 
  ArrowRight, ShieldAlert, Sparkles, User, Info, Check, CornerDownRight, Zap, Target
} from 'lucide-react';
import { COACH_AUDIT_BOARD_DATA, CoachBtnDetails } from '../data/coachAuditBoardData';

interface SGCButtonCoachDetailsProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
}

export default function SGCButtonCoachDetails({ activeTabId, onSelectTab }: SGCButtonCoachDetailsProps) {
  // Find the exact data for the active tab
  const details = COACH_AUDIT_BOARD_DATA.find(d => d.id === activeTabId);
  const [copied, setCopied] = useState<boolean>(false);
  const [currentTestStep, setCurrentTestStep] = useState<number>(1);
  const [score, setScore] = useState<number>(100);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);

  if (!details) {
    return (
      <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-3xl">
        <p className="text-gray-400">Seleccione un módulo técnico para desplegar el expediente.</p>
      </div>
    );
  }

  const handleCopyConsole = () => {
    navigator.clipboard.writeText(details.consoleASCII);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe SVG rendering based on the tab's ID
  const renderSVGDiagram1 = () => {
    switch (details.id) {
      case 'gestionycalidad':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px]">
            {/* Background grids */}
            <defs>
              <linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="hGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="vGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="aGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16a34a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="150" r="110" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="5,5" />
            
            {/* Planear */}
            <g className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-300">
              <rect x="50" y="30" width="120" height="70" rx="12" fill="url(#pGrad)" stroke="#4f46e5" strokeWidth="1.5" />
              <text x="110" y="60" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">PLANEAR (P)</text>
              <text x="110" y="78" textAnchor="middle" fill="#818cf8" fontSize="9" fontWeight="medium">Cláusulas 4, 5, 6</text>
            </g>

            {/* Hacer */}
            <g className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-300">
              <rect x="230" y="30" width="120" height="70" rx="12" fill="url(#hGrad)" stroke="#dc2626" strokeWidth="1.5" />
              <text x="290" y="60" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">HACER (H)</text>
              <text x="290" y="78" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="medium">Cláusulas 7, 8</text>
            </g>

            {/* Verificar */}
            <g className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-300">
              <rect x="230" y="190" width="120" height="70" rx="12" fill="url(#vGrad)" stroke="#2563eb" strokeWidth="1.5" />
              <text x="290" y="220" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">VERIFICAR (V)</text>
              <text x="290" y="238" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="medium">Cláusula 9</text>
            </g>

            {/* Actuar */}
            <g className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-300">
              <rect x="50" y="190" width="120" height="70" rx="12" fill="url(#aGrad)" stroke="#16a34a" strokeWidth="1.5" />
              <text x="110" y="220" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">ACTUAR (A)</text>
              <text x="110" y="238" textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="medium">Cláusula 10</text>
            </g>

            {/* Connecting arrows */}
            <path d="M 175 65 L 220 65" fill="none" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrow)" />
            <path d="M 290 105 L 290 180" fill="none" stroke="#2563eb" strokeWidth="2" />
            <path d="M 225 225 L 180 225" fill="none" stroke="#16a34a" strokeWidth="2" />
            <path d="M 110 185 L 110 110" fill="none" stroke="#4f46e5" strokeWidth="2" />
          </svg>
        );
      case 'estructuras':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px]">
            {/* CEO */}
            <rect x="140" y="20" width="120" height="50" rx="8" fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth="1.5" />
            <text x="200" y="45" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="extrabold">Alta Dirección</text>
            
            {/* Connection Lines */}
            <line x1="200" y1="70" x2="200" y2="105" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="100" y1="105" x2="300" y2="105" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="100" y1="105" x2="100" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="300" y1="105" x2="300" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

            {/* Gerente F1 */}
            <rect x="40" y="130" width="120" height="40" rx="6" fill="rgba(79,70,229,0.1)" stroke="#4f46e5" strokeWidth="1" />
            <text x="100" y="154" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Líder Funcional</text>

            {/* Gerente F2 */}
            <rect x="240" y="130" width="120" height="40" rx="6" fill="rgba(14,116,144,0.1)" stroke="#0e7490" strokeWidth="1" />
            <text x="300" y="154" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Proyecto Especial</text>

            <line x1="100" y1="170" x2="100" y2="210" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="300" y1="170" x2="300" y2="210" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3" />

            {/* Team bottom */}
            <rect x="140" y="210" width="120" height="45" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="200" y="235" textAnchor="middle" fill="#9ca3af" fontSize="9" fontWeight="bold">Especialista SGI</text>
            <path d="M 100 210 L 140 230" stroke="#4f46e5" strokeWidth="1" />
            <path d="M 300 210 L 260 230" stroke="#0e7490" strokeWidth="1" />
          </svg>
        );
      default:
        // Default generic dashboard/flow view
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px]">
            <rect x="20" y="20" width="360" height="260" rx="16" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" />
            <circle cx="200" cy="130" r="45" fill="rgba(220,38,38,0.05)" stroke="#dc2626" strokeWidth="1.5" />
            <text x="200" y="134" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="extrabold">{details.badge}</text>
            
            <rect x="50" y="210" width="90" height="40" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
            <text x="95" y="234" textAnchor="middle" fill="#9ca3af" fontSize="9">Entrada</text>
            
            <rect x="260" y="210" width="90" height="40" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
            <text x="305" y="234" textAnchor="middle" fill="#9ca3af" fontSize="9">Salida</text>

            <path d="M 140 230 L 260 230" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="4,4" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full space-y-10" id={`sgc-coach-details-${activeTabId}`}>
      
      {/* 1. SECCIÓN DEDICADA AL MATERIAL DE APOYO REGISTRADO */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-[#09090b] relative overflow-hidden" id="diagnostico-coach-seccion">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">Activo Verificado SIG</span>
            </div>
            <h3 className="text-2xl font-black text-white">{details.name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {details.normResourceDesc}
            </p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl w-full md:w-auto shrink-0 flex items-center justify-center min-w-[200px]">
            <div className="text-center">
              <span className="text-gray-500 font-mono text-[9px] block uppercase mb-1">Carga Operativa</span>
              <span className="text-xl font-extrabold text-white">98.9% OK</span>
              <span className="text-[9px] block text-green-500 mt-1">Conforme ISO/Audit</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONSOLA INTERACTIVA DEL MODULO */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600/10 text-red-500">
              <Zap className="w-4 h-4" />
            </span>
            Consola de Comando & KPIs en Vivo
          </h4>
          <button 
            onClick={handleCopyConsole}
            className="flex items-center gap-1.5 text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <FileText className="w-3.5 h-3.5" />}
            {copied ? 'Copiado al Portapapeles' : 'Copiar Reporte ASCII'}
          </button>
        </div>

        <div className="p-4 md:p-6 bg-[#040406] border border-white/5 rounded-3xl relative font-mono text-xs text-gray-300 overflow-x-auto selection:bg-red-500/30">
          <div className="absolute top-3 right-3 flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute" />
          </div>
          <pre className="whitespace-pre min-w-[600px] leading-relaxed select-all">
            {details.consoleASCII}
          </pre>
        </div>
      </div>

      {/* 3. IMAGEN GENERADA 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="glass p-6 rounded-3xl border border-white/5 bg-[#07070a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                D1: {details.visualDiag1Name}
              </h4>
              <span className="text-[9px] font-mono bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-md">DIAGRAMA TÉCNICO INTERACTIVO</span>
            </div>
            
            {/* Diagram container */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-center min-h-[300px]">
              {renderSVGDiagram1()}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/[0.01] border border-white/5 rounded-xl text-[11px] text-gray-500 leading-normal">
            <span className="font-bold text-gray-400 block mb-1">Descripción del Modelador Visual:</span>
            Mapeo formal del ciclo de vida técnico del módulo, optimizando cuellos de botella mediante micro-flujos directos.
          </div>
        </div>

        {/* MERMAID CODE VIEW */}
        <div className="glass p-6 rounded-3xl border border-white/5 bg-[#07070a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Código Fuente Mermaid.js
              </h4>
              <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-md">NATIVE MERMAID</span>
            </div>

            <div className="p-4 bg-black/60 border border-white/5 rounded-2xl min-h-[300px] font-mono text-[11px] text-emerald-400/90 overflow-auto">
              <pre className="whitespace-pre">
{`\`\`\`mermaid
${details.visualDiag1Mermaid}
\`\`\``}
              </pre>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/[0.01] border border-white/5 rounded-xl text-[11px] text-gray-500 leading-normal">
            <span className="font-bold text-gray-400 block mb-1">Activo ASCII Estructural de Soporte:</span>
            <pre className="text-[10px] text-gray-400 mt-1 whitespace-pre overflow-x-auto leading-tight p-2 bg-black rounded border border-white/5 font-mono">
              {details.visualDiag1ASCII}
            </pre>
          </div>
        </div>
      </div>

      {/* 4. DESARROLLO CONCEPTUAL COMPLETO */}
      <div className="space-y-8">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono border-b border-white/5 pb-2">
          Expediente de Intervención & Consultoría SGI Coach
        </h4>

        {/* Diagnóstico */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 p-5 bg-red-600/5 border border-red-500/10 rounded-2xl">
            <div className="flex items-center gap-2 text-red-400 mb-2 font-black text-xs uppercase tracking-wider font-mono">
              <AlertTriangle className="w-4 h-4" />
              1. El Diagnóstico del Coach
            </div>
            <p className="text-xs text-gray-300 font-bold">
              Identificación de brechas de calidad repetitivas en piso y silos organizacionales críticos:
            </p>
          </div>
          <div className="md:col-span-8 space-y-3">
            {details.diagnostico.map((d, index) => (
              <div key={`diag-${index}`} className="flex gap-3 p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-red-500/20 hover:bg-red-500/5 transition duration-300">
                <span className="w-6 h-6 rounded-lg bg-red-600/10 text-red-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">{index + 1}</span>
                <p className="text-xs text-gray-300 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bajo la mirada del Coach */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-red-950/20 to-black border border-white/5 rounded-3xl relative overflow-hidden">
          <div className="absolute left-0 bottom-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-sm uppercase tracking-wider font-mono mb-2">2. {details.name} bajo la mirada del Coach de Procesos</h5>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                "{details.coachLook}"
              </p>
            </div>
          </div>
        </div>

        {/* Matriz de Intervención */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-white/5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Target className="w-4 h-4 text-red-500" />
              3. Matriz de Intervención del Coach
            </h5>
            <span className="text-[9px] font-mono text-gray-500">RESPUESTA ASATIVA DE CALIDAD</span>
          </div>
          
          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-black/40">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[9px] font-mono">Tipo de Problema</th>
                  <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[9px] font-mono">Enfoque de Coaching</th>
                  <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[9px] font-mono">Herramienta Clave SGI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {details.matrixIntervention.map((row, idx) => (
                  <tr key={`matrix-${idx}`} className="hover:bg-red-500/5 transition">
                    <td className="p-4 font-bold text-white">{row.problemType}</td>
                    <td className="p-4 text-gray-400 leading-relaxed italic">"{row.coachingApproach}"</td>
                    <td className="p-4 text-red-400 font-mono font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      {row.keyTool}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acompañamiento checklist */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 p-5 bg-green-900/10 border border-green-500/20 rounded-2xl">
            <div className="flex items-center gap-2 text-green-400 mb-2 font-black text-xs uppercase tracking-wider font-mono">
              <CheckCircle2 className="w-4 h-4 animate-bounce" />
              4. Acompañamiento en Acción
            </div>
            <p className="text-xs text-gray-300 font-bold">
              Planificación táctica del Coach-ISO Robert Terán en planta para asegurar conformidad total:
            </p>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.acompanamiento.map((ac, idx) => (
              <div key={`acomp-${idx}`} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl hover:border-green-500/20 transition-all flex items-start gap-2.5">
                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-[11.5px] text-gray-300 leading-relaxed">{ac}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. IMAGEN GENERADA 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="glass p-6 rounded-3xl border border-white/5 bg-[#07070a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-400" />
                D2: {details.visualDiag2Name}
              </h4>
              <span className="text-[9px] font-mono bg-red-500/15 text-red-400 px-2 py-0.5 rounded-md">MAPA ESTRUCTURAL DE SOPORTE</span>
            </div>
            
            {/* Diagram container */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-center min-h-[300px]">
              <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px]">
                {/* Visual rendering of Diagram 2 placeholder/SVG */}
                <rect x="20" y="20" width="360" height="260" rx="16" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" />
                <path d="M 50 150 Q 200 40 350 150" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 50 150 Q 200 260 350 150" fill="none" stroke="#16a34a" strokeWidth="2" />
                
                <circle cx="50" cy="150" r="30" fill="rgba(79,70,229,0.2)" stroke="#4f46e5" strokeWidth="1.5" />
                <text x="50" y="154" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Entrada SGI</text>

                <circle cx="200" cy="150" r="40" fill="rgba(220,38,38,0.2)" stroke="#dc2626" strokeWidth="2" />
                <text x="200" y="154" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Procesamiento</text>

                <circle cx="350" cy="150" r="30" fill="rgba(22,163,74,0.2)" stroke="#16a34a" strokeWidth="1.5" />
                <text x="350" y="154" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Impacto / OK</text>
              </svg>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/[0.01] border border-white/5 rounded-xl text-[11px] text-gray-500 leading-normal">
            <span className="font-bold text-gray-400 block mb-1">Descripción de Estructura de Control:</span>
            Mapeo analítico del flujo de valor de la junta técnica según especificaciones asertivas del consultor Robert Terán.
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/5 bg-[#07070a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                Flujo e Interacción de Procesamientos
              </h4>
              <span className="text-[9px] font-mono bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-md">CÓDIGO DE FLUJO DE APOYO</span>
            </div>

            <div className="p-4 bg-black/60 border border-white/5 rounded-2xl min-h-[300px] font-mono text-[11px] text-orange-400/90 overflow-auto">
              <pre className="whitespace-pre">
{`\`\`\`mermaid
${details.visualDiag2Mermaid}
\`\`\``}
              </pre>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/[0.01] border border-white/5 rounded-xl text-[11px] text-gray-500 leading-normal">
            <span className="font-bold text-gray-400 block mb-1">Representación ASCII de la Interacción:</span>
            <pre className="text-[10px] text-gray-400 mt-1 whitespace-pre overflow-x-auto leading-tight p-2 bg-black rounded border border-white/5 font-mono">
              {details.visualDiag2ASCII}
            </pre>
          </div>
        </div>
      </div>

      {/* 6. COHERENCIA DE LOGICA / CONEXIONES CON OTROS BOTONES */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#07070a] space-y-6">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-white/5 pb-3">
            <Info className="w-4 h-4 text-red-500 animate-pulse" />
            Lógica de Coherencia e Interacción con el Tablero total
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            {details.coherenceText}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 p-5 bg-black rounded-2xl border border-white/5 flex flex-col justify-center min-h-[160px]">
            <span className="text-[9px] text-gray-500 font-mono uppercase block mb-2">// Flujo de Coherencia Táctica SGI</span>
            <pre className="text-xs text-red-500 font-mono whitespace-pre leading-relaxed select-all">
              {details.coherenceASCII}
            </pre>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <span className="text-[9px] text-gray-500 font-mono uppercase block">// Conexiones Directas con click interactivo</span>
            <div className="space-y-2">
              {details.connections.map((conn, idx) => (
                <div 
                  key={`conn-${conn.btnId || idx}`} 
                  onClick={() => onSelectTab(conn.btnId)}
                  className="p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:border-red-500/40 hover:bg-red-500/5 transition duration-300 flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-red-400 group-hover:text-red-500 flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      Ir al Módulo: {conn.btnName}
                    </span>
                    <p className="text-[11px] text-gray-400 leading-normal">{conn.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition duration-300 shrink-0 ml-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
