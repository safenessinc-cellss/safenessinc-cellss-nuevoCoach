import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Factory, Activity, AlertTriangle, Award, BarChart3, BookOpen, Briefcase, 
  Calendar, Check, CheckCircle2, ClipboardCheck, Layers, LayoutDashboard, Loader2, 
  Map, Network, Sliders, UserCheck, Users, Workflow, X, ArrowRight, ChevronRight, 
  Info, FileText, HelpCircle, TrendingDown, TrendingUp, Gauge, FileCode, Plus, LogOut
} from 'lucide-react';
import { SECTORS, SectorData, ProcessItem } from './DataModel';
import { useProfileSettings } from '../data/useProfileSettings';

export default function ManualSIG() {
  const { profile } = useProfileSettings();
  const [selectedSectorId, setSelectedSectorId] = useState<string>('tech_software');
  const [activeTab, setActiveTab] = useState<string>('procesos');
  const [selectedProcessId, setSelectedProcessId] = useState<string>('P1');
  
  // States read from active sector
  const currentSector = SECTORS.find(s => s.id === selectedSectorId) || SECTORS[0];

  // Set default process on sector change
  useEffect(() => {
    if (currentSector.processes.length > 0) {
      setSelectedProcessId(currentSector.processes[0].id);
    }
  }, [selectedSectorId]);

  // Checklist compliance checking state
  const [checklistScores, setChecklistScores] = useState<Record<string, 'C' | 'NC_MIN' | 'NC_MAJ' | 'OPM'>>({});
  
  // Management review (9.3) active draft tool states
  const [actaText, setActaText] = useState({
    asistentes: 'Robert Terán (Consultor Líder SGC), Dirección General, Jefe de SGC, Representantes Operativos',
    conclusiones: 'Se evidencia un SGC maduro pero con brechas de automatización en control de cambios de ingeniería. Se aprueba presupuesto adicional para la implementación de candados de gobernanza e integración continua.',
    accionesMejora: '1. Configuración de Branch Protection Rules en GitHub.\n2. Inclusión de sondas auxiliares en el plan de calibraciones.\n3. Implementación del tablero modular SGC en Power BI.'
  });
  const [prioritizationMatrix, setPrioritizationMatrix] = useState<Record<string, 'critica' | 'alta' | 'media' | 'baja'>>({
    'Seguridad de la información / Control de merma automotriz': 'critica',
    'Auditorías internas recurrentes': 'alta',
    'Actualización de manuales viejos': 'media',
    'Estudio de ruidos de planta': 'baja'
  });

  // Problem Solving (10.2) 8D Wizard States
  const [current8DStep, setCurrent8DStep] = useState<number>(1);
  const activeNC = currentSector.commonNC[0];

  // COQ Calculator State (PAF Model)
  const [customFinances, setCustomFinances] = useState({
    revenue: 500000,
    preventionCost: 15000,
    evaluationCost: 20000,
    internalFailureCost: 45000,
    externalFailureCost: 25000
  });

  // Calculate COQ totals
  const totalCOQ = customFinances.preventionCost + customFinances.evaluationCost + customFinances.internalFailureCost + customFinances.externalFailureCost;
  const cogq = customFinances.preventionCost + customFinances.evaluationCost; // Cost of Good Quality
  const copq = customFinances.internalFailureCost + customFinances.externalFailureCost; // Cost of Poor Quality
  const coqPercentageOverSales = (totalCOQ / customFinances.revenue) * 100;
  const copqPercentage = (copq / totalCOQ) * 100;

  // Form inputs for manual NC creation demo
  const [customNC, setCustomNC] = useState({
    title: 'Nueva No Conformidad Detectada',
    proc: currentSector.processes[0]?.name || 'Operativo',
    desc: 'Se encontró una desviación frente a la cláusula establecida...',
    containment: 'Acción preventiva inmediata para acotar la falla...',
    rootCause: 'Causa originaria debida a falta de capacitación...'
  });
  const [ncList, setNcList] = useState<any[]>([]);

  const handleAddNC = () => {
    const newEntry = {
      ...customNC,
      id: `NC-CUST-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString(),
      status: 'Abierta'
    };
    setNcList([...ncList, newEntry]);
    alert('¡No Conformidad registrada de forma interactiva en la bitácora del SGC!');
    // Reset
    setCustomNC({
      title: 'Nueva No Conformidad Detectada',
      proc: currentSector.processes[0]?.name || 'Operativo',
      desc: 'Se encontró una desviación frente a la cláusula establecida...',
      containment: 'Acción preventiva inmediata para acotar la falla...',
      rootCause: 'Causa originaria debida a falta de capacitación...'
    });
  };

  const currentProcess = currentSector.processes.find(p => p.id === selectedProcessId) || currentSector.processes[0];

  // Audit checklist calculation
  const totalChecked = currentProcess ? currentProcess.checklist.filter(q => checklistScores[q.id] !== undefined).length : 0;
  const totalCompliant = currentProcess ? currentProcess.checklist.filter(q => checklistScores[q.id] === 'C' || checklistScores[q.id] === 'OPM').length : 0;
  const complianceRate = totalChecked > 0 ? Math.round((totalCompliant / totalChecked) * 100) : 100;

  return (
    <div className="w-full bg-[#050505] text-gray-200 font-sans p-1 md:p-4 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      
      {/* SECTOR & PROFILE SELECTOR HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent rounded-t-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider">
              Consultor Senior Coach-ISO SGC
            </span>
            <span className="text-xs text-gray-400 font-mono">SYS_VER // ISO_9001:2015</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Network className="w-8 h-8 text-red-500 animate-pulse" /> Manual Interactivo & Sistema Integrado
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl">
            Vincule metodologías de mapeo ágil, auditorías periódicas, actas criticas de dirección 9.3 y análisis financiero COQ en una consola maestra en la nube.
          </p>
        </div>

        {/* Dynamic Sector Selector Dropdown */}
        <div className="w-full lg:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-black/40 border border-white/10 p-3 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest pl-2">
            <Briefcase className="w-4 h-4 text-red-500" /> Giro Activo:
          </div>
          <select 
            value={selectedSectorId}
            onChange={(e) => setSelectedSectorId(e.target.value)}
            className="bg-[#0f0f12] text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 font-bold transition-all cursor-pointer"
          >
            <option value="tech_software">Software & Servicios de Apoyo de TI</option>
            <option value="manufactura">Planta de Manufactura Plástica / Extrusión</option>
          </select>
        </div>
      </div>

      {/* QUICK SYSTEM METRICS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-white/5 bg-white/[0.01]">
        <div className="glass p-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="p-2 bg-red-600/10 rounded-xl border border-red-500/20">
            <Gauge className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Cumplimiento SGC</p>
            <p className="text-lg font-black text-white">{complianceRate}%</p>
          </div>
        </div>
        <div className="glass p-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Costo Calidad (COQ)</p>
            <p className="text-lg font-black text-white">${totalCOQ.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass p-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">No Conformidades</p>
            <p className="text-lg font-black text-white">{currentSector.commonNC.length + ncList.length} Activas</p>
          </div>
        </div>
        <div className="glass p-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-xl border border-green-500/20">
            <UserCheck className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Auditor Líder</p>
            <p className="text-xs font-bold text-gray-200 truncate max-w-[120px]">{profile.name || 'Robert Terán'}</p>
          </div>
        </div>
      </div>

      {/* DETAILED HORIZONTAL NAVIGATION TABS (THE 7 REQUISITES CONNECTED) */}
      <div className="flex overflow-x-auto gap-2 p-4 border-b border-white/5 bg-black/20 scrollbar-none">
        {[
          { id: 'procesos', name: '1. Mapa Procesos (4.4)', icon: Workflow, badge: 'ISO 4.4' },
          { id: 'mapeo-avanzado', name: '2. Mapeo Niveles (0-2)', icon: Layers, badge: 'SGC Macro' },
          { id: 'auditorias', name: '3. Auditorías e Inspección', icon: ClipboardCheck, badge: 'ISO 19011' },
          { id: 'direccion', name: '4. Análisis por Dirección', icon: Award, badge: 'Cl. 9.3' },
          { id: 'problemas', name: '5. No Conformidades & 8D', icon: AlertTriangle, badge: 'Cl. 10.2' },
          { id: 'costos', name: '6. Costos de Calidad (COQ)', icon: Sliders, badge: 'PAF Model' },
          { id: 'dashboard', name: '7. Tablero Integrado SGC', icon: LayoutDashboard, badge: 'Sinergia SGC' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-all border ${
                isActive 
                  ? 'bg-red-600 border-red-500 text-white shadow-xl shadow-red-500/20' 
                  : 'bg-[#0e0e12] border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.name}</span>
              <span className={`text-[8px] px-2 py-0.5 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-gray-400'}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE TAB MAIN CONTENT AREA */}
      <div className="p-4 md:p-8">
        
        {/* TAB 1: INTERACTIVE PROCESS MAP */}
        {activeTab === 'procesos' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-red-500" /> Mapa de Interacción de Procesos (Auditor SGC Cláusula 4.4)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Mapee la secuencia e interacción de procesos, clasificándolos en Estratégicos, Operativos y de Soporte.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase">
                Requisito ISO 4.4.1
              </span>
            </div>

            {/* PROCESS INTERACTION DIAGRAM - VISUAL NETWORK MAP (BUILT SECURELY WITH SVG FOR PERFECT LOAD EXPERIENCE) */}
            <div className="p-6 bg-[#09090c] border border-white/5 rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-[10px] text-gray-400 font-mono uppercase">
                Diagrama Sistémico de Relaciones As-Is Activa
              </div>
              
              {/* FLOW DIAGRAM ILLUSTRATION */}
              <div className="w-full flex justify-center py-6">
                <svg viewBox="0 0 800 320" className="w-full max-w-4xl text-white font-sans text-xs">
                  {/* Defs for gorgeous patterns */}
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
                    </marker>
                    <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
                    </marker>
                    <linearGradient id="strat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#300d0d" />
                      <stop offset="100%" stopColor="#1a0404" />
                    </linearGradient>
                    <linearGradient id="op-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>
                    <linearGradient id="sop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  {/* Left Frame: ENTRADAS / CLIENTE */}
                  <rect x="15" y="40" width="110" height="240" rx="15" fill="#090909" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="30" y="80" fill="#ef4444" fontWeight="bold">REQUISITOS</text>
                  <text x="30" y="98" fill="#ef4444" fontWeight="bold">DEL CLIENTE</text>
                  <text x="25" y="140" fill="#6b7280" fontSize="10">Entradas del SGC:</text>
                  <text x="25" y="160" fill="#9ca3af" fontSize="9">• Contratos / Demanda</text>
                  <text x="25" y="175" fill="#9ca3af" fontSize="9">• Enfoque comercial</text>
                  <text x="25" y="190" fill="#9ca3af" fontSize="9">• Expectativas</text>

                  {/* Flow links */}
                  <path d="M 125 160 Q 250 160 300 160" fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow)" />

                  {/* Top Layer: PROCESOS ESTRATEGICOS */}
                  <rect x="250" y="20" width="300" height="60" rx="15" fill="url(#strat-grad)" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="400" y="45" fill="#fff" fontWeight="black" textAnchor="middle">PROCESOS ESTRATÉGICOS</text>
                  <text x="400" y="62" fill="#ef4444" fontSize="10" textAnchor="middle">Planificación, SGC, Dirección General</text>

                  {/* Middle Layer: PROCESOS OPERATIVOS (THE DRIVER OF COQ AND VALUE) */}
                  <rect x="220" y="110" width="360" height="100" rx="15" fill="url(#op-grad)" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="400" y="140" fill="#fff" fontWeight="black" textAnchor="middle" fontSize="13">CADENA OPERATIVA DE VALOR</text>
                  
                  {/* Internal boxes within Operational chain */}
                  <rect x="240" y="160" width="100" height="30" rx="5" fill="#000" fillOpacity="0.4" />
                  <text x="290" y="178" fill="#fff" textAnchor="middle" fontSize="9">Ingeniería / Planta</text>

                  <rect x="350" y="160" width="100" height="30" rx="5" fill="#000" fillOpacity="0.4" />
                  <text x="400" y="178" fill="#fff" textAnchor="middle" fontSize="9">Producción / Dev</text>

                  <rect x="460" y="160" width="100" height="30" rx="5" fill="#000" fillOpacity="0.4" />
                  <text x="510" y="178" fill="#fff" textAnchor="middle" fontSize="9">Testing / Empaque</text>

                  {/* Bottom Layer: PROCESOS DE SOPORTE */}
                  <rect x="250" y="240" width="300" height="60" rx="15" fill="url(#sop-grad)" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="400" y="265" fill="#fff" fontWeight="black" textAnchor="middle">PROCESOS DE SOPORTE</text>
                  <text x="400" y="282" fill="#3b82f6" fontSize="10" textAnchor="middle">Infraestructura TI, Compras, Recursos Humanos</text>

                  {/* Bi-directional support links */}
                  <path d="M 400 80 L 400 110" fill="none" stroke="#ef4444" strokeWidth="1" markerEnd="url(#arrow)" />
                  <path d="M 400 240 L 400 210" fill="none" stroke="#3b82f6" strokeWidth="1" markerEnd="url(#arrow-blue)" />

                  {/* Right Frame: SALIDAS / CLIENTE */}
                  <rect x="675" y="40" width="110" height="240" rx="15" fill="#090909" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="690" y="80" fill="#22c55e" fontWeight="bold">SATISFACCIÓN</text>
                  <text x="690" y="98" fill="#22c55e" fontWeight="bold">DEL CLIENTE</text>
                  <text x="685" y="140" fill="#6b7280" fontSize="10">Salidas del SGC:</text>
                  <text x="685" y="160" fill="#9ca3af" fontSize="9">• Código/Pieza OK</text>
                  <text x="685" y="175" fill="#9ca3af" fontSize="9">• Menor Scrap/Bug</text>
                  <text x="685" y="190" fill="#9ca3af" fontSize="9">• Garantía de Auditoría</text>

                  {/* Final Flow link */}
                  <path d="M 580 160 Q 620 160 670 160" fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow)" />
                </svg>
              </div>
            </div>

            {/* INTERACTIVE PROCESS EXPLORER LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Process Selector side list */}
              <div className="space-y-3 lg:col-span-1">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2 text-gray-400">
                  Selecciona un Proceso para Auditar
                </h3>
                <div className="space-y-2">
                  {currentSector.processes.map((proc) => (
                    <button
                      key={proc.id}
                      onClick={() => setSelectedProcessId(proc.id)}
                      className={`w-full text-left p-4 rounded-2xl flex flex-col items-start gap-1 transition-all border ${
                        selectedProcessId === proc.id
                          ? 'bg-red-600/10 border-red-500/50 text-white shadow-lg'
                          : 'bg-black/30 border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          proc.type === 'estrategico' ? 'bg-amber-500/20 text-amber-400' :
                          proc.type === 'operativo' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {proc.type}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">{proc.id}</span>
                      </div>
                      <span className="text-sm font-black mt-2 leading-tight">{proc.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic process details card (Outputs / Inputs / KPIs) */}
              <div className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0c0c0e]">
                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6">
                  <div>
                    <span className="text-xs text-red-500 font-bold uppercase tracking-widest font-mono">Ficha Técnica Operativa</span>
                    <h3 className="text-xl font-black text-white mt-1">{currentProcess.name}</h3>
                  </div>
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4 text-red-500" /> Proveedores e Entradas
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-xs"><strong className="text-gray-300">Proveedores:</strong> {currentProcess.suppliers.join(', ')}</li>
                      <li className="text-xs"><strong className="text-gray-300">Inputs Críticos:</strong> {currentProcess.inputs.join(', ')}</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4 text-green-500" /> Salidas e Clientes
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-xs"><strong className="text-gray-300">Clientes Directos:</strong> {currentProcess.clients.join(', ')}</li>
                      <li className="text-xs"><strong className="text-gray-300">Outputs de Valor:</strong> {currentProcess.outputs.join(', ')}</li>
                    </ul>
                  </div>
                </div>

                {/* KPI controls requested */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" /> Puntos de Control y Métricas de Rendimiento (Métricas / KPIs)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/5 text-gray-500">
                          <th className="py-2">Métrica Clave / KPI</th>
                          <th className="py-2">Meta Esperada</th>
                          <th className="py-2">Frecuencia de Toma</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentProcess.kpis.map((k, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01]">
                            <td className="py-3 font-bold text-white">{k.name}</td>
                            <td className="py-3 text-red-400 font-bold">{k.target}</td>
                            <td className="py-3 text-gray-400 font-mono">{k.frequency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DETAILED PROCESS MAPPING (LEVELS 0, 1, 2) */}
        {activeTab === 'mapeo-avanzado' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" /> Mapeo de Procesos y Subprocesos (Estructura Jerárquica)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Evolución estructural del mapeo: Nivel 0 (Estratégico), Nivel 1 (Procesos Clave) y Nivel 2 (Subprocesos Críticos).
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400 font-bold uppercase">
                ISO 4.4.1 (a, b)
              </span>
            </div>

            {/* INTEGRATED LEVEL VIEWER */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Level 0 and Level 1 */}
              <div className="xl:col-span-1 space-y-6">
                
                {/* Level 0 Box */}
                <div className="glass p-5 rounded-3xl border border-white/5 bg-gradient-to-b from-blue-900/10 to-transparent">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Nivel 0: Mapa Estratégico
                  </div>
                  <h4 className="text-white font-black text-sm mb-2 uppercase">Cadena de Demanda Total</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Alineamiento global desde la necesidad inicial expresada por el prospecto, modelado y validado en planta/software, con entrega certificada y retroalimentación de post-auditoría.
                  </p>
                </div>

                {/* Level 1 Box */}
                <div className="glass p-5 rounded-3xl border border-white/5 bg-[#0a0a0c]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Nivel 1: Procesos Clave ({currentSector.processes.length})
                  </div>
                  <div className="space-y-2">
                    {currentSector.processes.map((proc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl text-xs">
                        <span className="font-bold text-white max-w-[170px] truncate">{proc.name}</span>
                        <span className="text-gray-500 font-mono tracking-tighter">N1_{proc.id}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Level 2 Sub-processes details requested */}
              <div className="xl:col-span-2 glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0e0e12]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-400 mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Nivel 2: Subprocesos Críticos (Responsables, Tiempos, Recursos e Documentos)
                </div>

                <div className="space-y-6">
                  {currentSector.processes.flatMap(p => p.subprocesses.map((sub, sidx) => (
                    <div key={sidx} className="p-5 bg-black/60 rounded-2xl border border-white/5 hover:border-red-500/20 transition-all space-y-4">
                      
                      {/* Subprocess header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
                        <div>
                          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Asociado a: {p.name}</p>
                          <h4 className="text-base font-black text-white mt-0.5">{sub.name}</h4>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-green-600/10 border border-green-500/20 rounded-full text-green-400 font-bold">
                          Subproceso Crítico N2
                        </span>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
                          <p className="text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-1">Responsable Cargo</p>
                          <p className="text-white font-bold">{sub.responsible}</p>
                        </div>
                        <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5 font-mono">
                          <p className="text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-1">Tiempo de Ciclo</p>
                          <p className="text-red-400 font-bold">{sub.cycleTime}</p>
                        </div>
                        <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
                          <p className="text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-1">Recursos Necesarios</p>
                          <p className="text-gray-300 text-xs lines-clamp-2">{sub.resources.join(', ')}</p>
                        </div>
                      </div>

                      {/* Associated ISO Documents */}
                      <div className="space-y-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Documentación SGC Relacionada (Procedimientos, Instructivos, Formatos)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {sub.documents.map((doc, docIdx) => (
                            <div key={docIdx} className="p-2.5 bg-[#060608] border border-white/5 rounded-xl flex items-center gap-2">
                              <FileCode className={`w-4 h-4 shrink-0 ${
                                doc.type === 'procedimiento' ? 'text-blue-400' :
                                doc.type === 'instructivo' ? 'text-amber-400' : 'text-red-400'
                              }`} />
                              <div className="overflow-hidden">
                                <p className="text-[10px] font-mono text-gray-400 truncate tracking-tight">{doc.code}</p>
                                <p className="text-[11px] font-bold text-white whitespace-nowrap truncate">{doc.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 3: AUDITS & INSPECTION (ISO 19011) */}
        {activeTab === 'auditorias' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-red-500" /> Planificación de Auditorías Internas e Inspecciones (ISO 19011)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Programa anual, competencia del auditor líder y lista de verificación dinámica por proceso con cálculo de conformidad en tiempo real.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase">
                Requisito ISO 9.2 / ISO 19011
              </span>
            </div>

            {/* AUDITOR COMPETENCE & ANUAL CALENDAR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-1 space-y-6">
                
                {/* Qualification card */}
                <div className="glass p-5 rounded-3xl border border-white/5 bg-[#09090c]">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-green-400" /> Perfil Competente del Auditor
                  </h4>
                  <ul className="space-y-3 text-xs text-gray-400">
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span><strong>Independencia:</strong> Libre de conflicto de interés en el área a auditar.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span><strong>Formación:</strong> Certificación certificada bajo norma ISO 19011 e ISO 9001.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span><strong>Experiencia técnica:</strong> Entendimiento completo del giro (software/manufactura).</span>
                    </li>
                  </ul>
                </div>

                {/* Annual Schedule */}
                <div className="glass p-5 rounded-3xl border border-white/5 bg-[#09090c] space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" /> Programa Anual de Auditorías SGC
                  </h4>
                  
                  {[
                    { month: 'Marzo', status: 'Realizada', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                    { month: 'Junio', status: 'En Proceso', color: 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' },
                    { month: 'Noviembre', status: 'Planificada', color: 'bg-white/5 text-gray-400 border-white/5' }
                  ].map((aud, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded-xl text-xs">
                      <span className="font-bold text-white">{aud.month}: Auditoría Interna General SGC</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${aud.color}`}>{aud.status}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* INTERACTIVE CHECKLIST OF 10 QUESTIONS PER PROCESS */}
              <div className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0e0e12]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-6">
                  <div>
                    <span className="text-xs text-red-500 font-bold uppercase tracking-widest font-mono">Simulador de Auditoría</span>
                    <h3 className="text-lg font-black text-white mt-1">Lista de Verificación Dinámica ({currentProcess.checklist.length} Preguntas)</h3>
                    <p className="text-xs text-gray-400 mt-1">Audite "{currentProcess.name}" marcando las conformidades o hallazgos:</p>
                  </div>
                  <div className="bg-black/50 p-3 rounded-2xl border border-white/5 text-right shrink-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Cumplimiento del Proceso</p>
                    <p className="text-lg font-black text-green-400">{complianceRate}%</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar">
                  {currentProcess.checklist.map((q) => {
                    const activeScore = checklistScores[q.id];
                    return (
                      <div key={q.id} className="p-4 bg-black/40 rounded-xl border border-white/5 hover:bg-black/60 transition-colors space-y-3">
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-[10px] font-mono text-red-500 bg-red-600/10 border border-red-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold">
                            Requisito {q.isorReq}
                          </span>
                          <span className="text-[9px] font-mono text-gray-500">{q.id}</span>
                        </div>
                        <p className="text-xs font-bold text-white leading-relaxed">{q.question}</p>
                        <p className="text-[11px] text-gray-400 italic">💡 Guía para el auditor: {q.helpText}</p>

                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                          {[
                            { value: 'C', label: 'Conforme (C)', color: 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' },
                            { value: 'NC_MIN', label: 'No Conf. Menor', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' },
                            { value: 'NC_MAJ', label: 'No Conf. Mayor', color: 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' },
                            { value: 'OPM', label: 'Op. de Mejora', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' }
                          ].map((opt) => {
                            const isSelected = activeScore === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => setChecklistScores(prev => ({ ...prev, [q.id]: opt.value as any }))}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                  isSelected 
                                    ? 'bg-white text-black border-white shadow-md font-extrabold' 
                                    : opt.color
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-4 bg-red-500/5 rounded-2xl border border-red-500/10 text-xs text-gray-400 italic text-center">
                  "Conforme a la norma ISO 9001:2015 cláusula 9.2, los resultados deben documentarse y reportarse a las gerencias responsables inmediatamente."
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 4: MANAGEMENT REVIEW (9.3) */}
        {activeTab === 'direccion' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-500" /> Análisis Crítico por la Dirección (Cláusula 9.3 SGC)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Estructuración sistemática de insumos obligatorios del SGC y priorización táctica de planes de mejora frente a riesgos críticos.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase">
                Requisito ISO 9.3
              </span>
            </div>

            {/* PRIORITIZATION MATRIX - CLICKABLE AND EDITABLE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-1 space-y-6">
                <div className="glass p-5 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-red-500" /> Matriz de Priorización de Riesgos
                  </h3>
                  <p className="text-xs text-gray-400">
                    Haga click para cambiar de prioridad los temas de calidad del comité:
                  </p>

                  <div className="space-y-2">
                    {Object.entries(prioritizationMatrix).map(([task, state]) => (
                      <div key={task} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-200 truncate max-w-[170px]">{task}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                            state === 'critica' ? 'bg-red-500/20 text-red-400' :
                            state === 'alta' ? 'bg-amber-500/20 text-amber-400' :
                            state === 'media' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {state}
                          </span>
                        </div>
                        
                        <div className="flex gap-1">
                          {['critica', 'alta', 'media', 'baja'].map((st) => (
                            <button
                              key={st}
                              onClick={() => setPrioritizationMatrix(prev => ({ ...prev, [task]: st as any }))}
                              className={`text-[8px] font-bold uppercase flex-1 py-1 rounded transition-colors ${
                                state === st ? 'bg-white text-black font-extrabold' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }`}
                            >
                              {st.slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* EDITABLE COMPLIANT MINUTES OF THE MEETING (ACTA DE REUNIÓN DE DIRECCIÓN) */}
              <div className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0c0c0e]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-6 border-b border-white/5 pb-3">
                  <FileText className="w-4 h-4" /> Plantilla Editable: Acta de Revisión de la Gerencia
                </div>

                <div className="space-y-6">
                  
                  {/* Informational checklist header */}
                  <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 space-y-2">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">Insumos Obligatorios Revisados en este Documento:</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                      <div>✓ Resultados de auditorías internas</div>
                      <div>✓ Desempeño de procesos y mermas</div>
                      <div>✓ Monitoreo de quejas y satisfacción</div>
                      <div>✓ Eficacia de acciones ante riesgos</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Cargo de Asistentes</label>
                      <input 
                        type="text" 
                        value={actaText.asistentes}
                        onChange={(e) => setActaText(prev => ({ ...prev, asistentes: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                        placeholder="ej. Cargos directivos"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Salidas / Decisiones Financieras Aprobadas (9.3.3)</label>
                      <textarea 
                        value={actaText.conclusiones}
                        onChange={(e) => setActaText(prev => ({ ...prev, conclusiones: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 h-24 resize-none"
                        placeholder="Introduzca decisiones de asignación de recursos"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Planes de Acción Correctiva y Seguimiento de Eficacia</label>
                    <textarea 
                      value={actaText.accionesMejora}
                      onChange={(e) => setActaText(prev => ({ ...prev, accionesMejora: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 h-24 font-mono text-[11px]"
                      placeholder="Listado de acciones concretas de mejora continua"
                    />
                  </div>

                  <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/5 text-xs">
                    <span className="text-gray-400">Firmado electrónicamente por auditor y dirección</span>
                    <button 
                      onClick={() => alert('¡Acta de Revisión de SGC Generada y Guardada en la Base de Datos con éxito!')}
                      className="bg-white text-black font-black px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all text-[11px] uppercase tracking-wider"
                    >
                      Exportar Acta SGC
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: PROBLEM SOLVING & 8D WIZARD (10.2) */}
        {activeTab === 'problemas' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" /> Resolución de Problemas e No Conformidades (8D Wizard & Ishikawa)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Tratamiento de fallas graves en base a metodologías estructuradas de causa raíz bajo la guía ISO 10.2.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase">
                Requisito ISO 10.2
              </span>
            </div>

            {/* FLOW REQUISITE CHART (FLOW: IDENTIFICATION -> CONTAINMENT -> ROOT CAUSE -> CORRECTIVE ACTION -> VERIFICATION -> CLOSURE) */}
            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-center">
              <span className="text-[10px] text-gray-500 font-mono uppercase block mb-3">Flujo Canónico Tratamiento No Conformidades (SGC Cl. 10.2)</span>
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 overflow-x-auto py-2">
                {[
                  { step: 'Identificación', desc: 'Detección desvío SGC' },
                  { step: 'Contención', desc: 'Aislamiento inmediato' },
                  { step: 'Análisis Causa', desc: '5 Porqués / Ishikawa' },
                  { step: 'Acción Correctiva', desc: 'Evitar recurrencia' },
                  { step: 'Medición Eficacia', desc: 'Control e Historial' },
                  { step: 'Cierre Definitivo', desc: 'SGC Actualizado' }
                ].map((f, idx) => (
                  <React.Fragment key={idx}>
                    <div className="bg-[#0b0b0e] border border-white/5 p-3 rounded-xl min-w-[110px] flex-1">
                      <p className="text-red-500 font-bold text-[10px]">Paso {idx+1}</p>
                      <p className="font-extrabold text-white text-[11px] mt-0.5">{f.step}</p>
                      <p className="text-[9px] text-gray-500 mt-1 lines-clamp-1">{f.desc}</p>
                    </div>
                    {idx < 5 && <ArrowRight className="w-4 h-4 text-gray-600 hidden md:block shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 8D SOLVER WIZARD & ISHIKAWA BLOCK */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 8D Wizard Selector Panel */}
              <div className="lg:col-span-1 space-y-4">
                <div className="glass p-5 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Asistente 8D (Metodología de Cierre)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Interactúe con los 8 pasos reglamentarios pre-analizados sobre el caso real de tu giro:
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { step: 1, label: 'D1: Equipo' },
                      { step: 2, label: 'D2: Problema' },
                      { step: 3, label: 'D3: Contención' },
                      { step: 4, label: 'D4: Causa Raíz' },
                      { step: 5, label: 'D5: Acción Permanente' },
                      { step: 6, label: 'D6: Verificación' },
                      { step: 7, label: 'D7: Acción Prev.' },
                      { step: 8, label: 'D8: Cierre' }
                    ].map((s) => (
                      <button
                        key={s.step}
                        onClick={() => setCurrent8DStep(s.step)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          current8DStep === s.step 
                            ? 'bg-red-600 border-red-500 text-white font-black' 
                            : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="text-[9px] font-mono opacity-80">Paso {s.step}</span>
                        <span className="font-bold text-[11px] mt-1 pr-1 truncate">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 8D Wizards Inner Step details */}
              <div className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0e0e12] space-y-6">
                
                {/* Dynamic Title */}
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <span className="text-xs text-red-500 font-bold uppercase tracking-widest font-mono">Caso Real de Desviación</span>
                    <h3 className="text-lg font-black text-white mt-1 truncate max-w-[400px]">Caso: {activeNC.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-gray-500 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                    Cláusula {activeNC.clause.split(' ')[0]}
                  </span>
                </div>

                {/* DStep rendering logic */}
                {current8DStep === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono font-bold">D1</span>
                      Formación de un Equipo Disciplinado SGC
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Se constituyó el comité de control de desviaciones técnicas y de planta para abordar la no conformidad detectada.
                    </p>
                    <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2 text-xs">
                      <p className="font-extrabold text-white">Miembros del Comité Calificado:</p>
                      <p className="text-gray-400">• Representante de Dirección / Consultor Líder ({profile.name || 'Robert Terán'})</p>
                      <p className="text-gray-400">• Coordinador de Procesos Críticos</p>
                      <p className="text-gray-400">• Operador en Línea / Ingeniero Tech de Guardia</p>
                    </div>
                  </div>
                )}

                {current8DStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono font-bold">D2</span>
                      Definición Detallada del Problema
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Descripción pormenorizada del incidente, acotando el alcance comercial y los riesgos de afectación al cliente.
                    </p>
                    <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-xl space-y-2">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Desviación Evidenciada:</p>
                      <p className="text-xs text-gray-300 leading-normal">{activeNC.description}</p>
                    </div>
                  </div>
                )}

                {current8DStep === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono font-bold">D3</span>
                      Acción Provisional de Contención (Mitigación)
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Bloqueo y acotamiento del riesgo físico inmediato para salvaguardar el almacén del cliente mientras se analiza la raíz.
                    </p>
                    <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-1.5 text-xs">
                      <p className="font-bold text-white uppercase tracking-wider text-[10px] text-amber-400">Contención Ejecutada:</p>
                      <p className="text-gray-300 leading-relaxed">{activeNC.containment}</p>
                    </div>
                  </div>
                )}

                {current8DStep === 4 && (
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono font-bold">D4</span>
                      Análisis de Causa Raíz (5 Porqués e Ishikawa)
                    </h4>
                    <p className="text-xs text-gray-300">
                      Investigación inductiva aplicando las metodologías más estrictas del SGC:
                    </p>

                    {/* Interactive 5 Whys */}
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Perforación de Causalidad (5 Whys Directos):</p>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {activeNC.fiveWhys.map((why, widx) => (
                          <div key={widx} className="p-2.5 bg-[#09090c] border border-white/5 rounded-xl flex items-start gap-2">
                            <span className="text-red-500 font-black">W{widx+1}:</span>
                            <span className="text-gray-300">{why}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* INTERACTIVE ISHIKAWA (FISHBONE DIAGRAM) VIEW */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tablero de Causa-Efecto (Diagrama de Ishikawa - 6Ms):</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(activeNC.ishikawa).map(([cat, list]) => (
                          <div key={cat} className="p-3 bg-black/40 border border-white/5 rounded-xl text-left">
                            <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest border-b border-white/5 pb-1 mb-2">
                              {cat === 'personal' ? '🧑‍💼 Personal' :
                               cat === 'maquinaria' ? '⚙️ Maquinaria' :
                               cat === 'metodo' ? '📋 Método' :
                               cat === 'material' ? '📦 Material' :
                               cat === 'medicion' ? '📏 Medición' : '🌍 Medio Amb.'}
                            </h5>
                            <ul className="space-y-1 text-[10px] text-gray-400 leading-tight">
                              {(list as string[]).map((val, vIdx) => (
                                <li key={vIdx}>• {val}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {current8DStep === 5 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono font-bold">D5</span>
                      Definición de Acción Correctiva Permanente (SGC Cl. 10.2)
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Diseño de la contramedida sistémica integral para anular la causa raíz e impedir la posible recurrencia operativa.
                    </p>
                    <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl space-y-1.5 text-xs">
                      <p className="font-bold text-green-400 uppercase tracking-wider text-[10px]">Acción Correctiva Elegida:</p>
                      <p className="text-gray-200 leading-relaxed font-bold">{activeNC.correctiveAction}</p>
                    </div>
                  </div>
                )}

                {current8DStep === 6 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono font-bold">D6</span>
                      Verificación de Eficacia (Auditoría de Cierre)
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Evaluación periódica que constata que la acción ya fue implementada y que ha resuelto el desvío sin generar mermas colaterales.
                    </p>
                    <p className="text-xs font-mono text-gray-400 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                      {activeNC.verification}
                    </p>
                  </div>
                )}

                {current8DStep === 7 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono font-bold">D7</span>
                      Acciones Preventivas Generadas
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Actualización de los marcos de riesgos corporativos (AMFE) y el software de capacitación para evitar casos similares en otras divisiones operacionales del consorcio.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <p className="font-bold text-white text-[9px] uppercase tracking-wider text-blue-400">Análisis de Riesgo FMEA</p>
                        <p className="text-gray-400 mt-1">Multiplicador de riesgo corregido de 125 a 15 de criticidad.</p>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <p className="font-bold text-white text-[9px] uppercase tracking-wider text-blue-400">Garantía Procedimental</p>
                        <p className="text-gray-400 mt-1">Procedimientos e instructivos de control ajustados formalmente.</p>
                      </div>
                    </div>
                  </div>
                )}

                {current8DStep === 8 && (
                  <div className="space-y-4 text-center py-6">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                    <h4 className="text-lg font-black text-white">D8: Felicitaciones y Reconocimiento al Equipo</h4>
                    <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                      El comité declara cerrado este reporte 8D de forma definitiva. Se registra un tiempo promedio de cierre histórico de 12 días bajo la tutoría técnica.
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* INTERACTIVE FORM: NC REPORT WRITER DEMONSTRATING REAL IMPLEMENTATION FOR AUDITORS */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0c0c0e]">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                <Plus className="w-4 h-4 text-red-500" /> Registro Interactivo de No Conformidad Propia (SGC Editable)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px]">Título de Desviación</label>
                    <input 
                      type="text" 
                      value={customNC.title}
                      onChange={(e) => setCustomNC(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px]">Proceso Afectado</label>
                    <select 
                      value={customNC.proc}
                      onChange={(e) => setCustomNC(prev => ({ ...prev, proc: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    >
                      {currentSector.processes.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px]">Descripción Detallada (Hallazgo de Auditoría)</label>
                    <textarea 
                      value={customNC.desc}
                      onChange={(e) => setCustomNC(prev => ({ ...prev, desc: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 h-20 resize-none animate-none"
                    />
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px]">Plan de Contención Inmediato</label>
                    <textarea 
                      value={customNC.containment}
                      onChange={(e) => setCustomNC(prev => ({ ...prev, containment: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 h-20 resize-none animate-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px]">Análisis de Causa Raíz Detectada</label>
                    <textarea 
                      value={customNC.rootCause}
                      onChange={(e) => setCustomNC(prev => ({ ...prev, rootCause: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 h-20 resize-none animate-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleAddNC}
                  className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-2xl transition shadow-xl shadow-red-500/10 text-xs uppercase tracking-wider"
                >
                  Registrar No Conformidad
                </button>
              </div>

              {/* Saved NC List render */}
              {ncList.length > 0 && (
                <div className="mt-8 border-t border-white/5 pt-6 space-y-4">
                  <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Bitácora de Desviaciones Propias (Generadas Dinámicamente):</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ncList.map((nc) => (
                      <div key={nc.id} className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/20 text-xs relative overflow-hidden">
                        <div className="absolute top-2 right-2 bg-orange-600/20 border border-orange-500/30 text-orange-400 px-2.5 py-0.5 rounded text-[8px] font-bold uppercase">
                          {nc.status}
                        </div>
                        <p className="font-extrabold text-white text-sm">{nc.title}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">ID: {nc.id} // Proceso: {nc.proc}</p>
                        <p className="text-gray-400 mt-2 leading-relaxed">{nc.desc}</p>
                        <p className="text-gray-400 mt-1 italic"><strong className="text-amber-400">Contención:</strong> {nc.containment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 6: COST OF QUALITY (COQ) PAF MODEL */}
        {activeTab === 'costos' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-red-500" /> Estructura de Costos de Calidad (COQ - Calculador Táctico)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Clasificación en categorías PAF (Prevención, Evaluación, Fallas Internas, Fallas Externas) y su retorno táctico SGC.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase">
                Análisis Económico PAF
              </span>
            </div>

            {/* DYNAMIC COQ CALCULATOR BLOCK WITH LIVE CUSTOM BAR GRAPHICS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Financial Sliders controls */}
              <div className="lg:col-span-1 glass p-6 rounded-3xl border border-white/5 bg-[#09090c] space-y-6">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-red-400" /> Simulador de Costos
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-gray-400">Ventas Anuales ($)</span>
                      <span className="text-white font-mono">${customFinances.revenue.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" min="100000" max="2000000" step="50000"
                      value={customFinances.revenue}
                      onChange={(e) => setCustomFinances(p => ({ ...p, revenue: parseInt(e.target.value) }))}
                      className="w-full accent-red-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-green-400 font-extrabold">Prevención (Plan, Formación)</span>
                      <span className="text-white font-mono">${customFinances.preventionCost.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" min="1000" max="80000" step="1000"
                      value={customFinances.preventionCost}
                      onChange={(e) => setCustomFinances(p => ({ ...p, preventionCost: parseInt(e.target.value) }))}
                      className="w-full accent-green-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-blue-400 font-extrabold">Evaluación (Auditorías, Lab)</span>
                      <span className="text-white font-mono">${customFinances.evaluationCost.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" min="1000" max="80000" step="1000"
                      value={customFinances.evaluationCost}
                      onChange={(e) => setCustomFinances(p => ({ ...p, evaluationCost: parseInt(e.target.value) }))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-amber-400 font-extrabold">Fallas Internas (Scrap/Re-work)</span>
                      <span className="text-white font-mono">${customFinances.internalFailureCost.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" min="5000" max="200000" step="2000"
                      value={customFinances.internalFailureCost}
                      onChange={(e) => setCustomFinances(p => ({ ...p, internalFailureCost: parseInt(e.target.value) }))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-red-400 font-extrabold">Fallas Externas (Devoluciones)</span>
                      <span className="text-white font-mono">${customFinances.externalFailureCost.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" min="1000" max="200000" step="2000"
                      value={customFinances.externalFailureCost}
                      onChange={(e) => setCustomFinances(p => ({ ...p, externalFailureCost: parseInt(e.target.value) }))}
                      className="w-full accent-red-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-red-600/5 rounded-2xl border border-red-500/10 text-[10px] text-gray-400 leading-normal">
                  💡 <strong>Ley de Crosby:</strong> El incremento planificado del 10% en gastos de Prevención/Evaluación suele reducir más del 40% del Costo de Fallas de Calidad totales en un lapso de 6 meses de madurez.
                </div>
              </div>

              {/* Visual graph and analysis report requested */}
              <div className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0e0e12] space-y-6">
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div>
                    <span className="text-xs text-red-500 font-bold uppercase tracking-widest font-mono">Reporte de Eficiencia de Costos de Calidad</span>
                    <h3 className="text-lg font-black text-white mt-0.5">Categorización Económica PAF SGC</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">COQ Total de la Empresa</p>
                    <p className="text-xl font-mono font-black text-white">${totalCOQ.toLocaleString()}</p>
                    <p className="text-[10px] text-red-400 font-bold">{coqPercentageOverSales.toFixed(1)}% de las ventas</p>
                  </div>
                </div>

                {/* GRAPH REPRESENTATIONS (GOOD COQ vs POOR COQ BARS) */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-300">Balance Económico de Calidad:</p>
                  
                  {/* Good Quality (Prevention + Evaluation) block */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-gray-400 font-bold">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Costos Asegurados (Prevención + Evaluación)</span>
                      <span className="text-white font-mono">${cogq.toLocaleString()} ({((cogq / totalCOQ) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-3.5 bg-black/50 rounded-full overflow-hidden border border-white/5 flex">
                      <div className="h-full bg-green-500" style={{ width: `${(customFinances.preventionCost / totalCOQ) * 100}%` }} title="Prevención" />
                      <div className="h-full bg-blue-500" style={{ width: `${(customFinances.evaluationCost / totalCOQ) * 100}%` }} title="Evaluación" />
                    </div>
                  </div>

                  {/* Poor Quality (Internal + External Failures) block */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-gray-400 font-bold">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> Costo de Fallas Operativas (Poor Quality COPQ)</span>
                      <span className="text-white font-mono">${copq.toLocaleString()} ({copqPercentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-3.5 bg-black/50 rounded-full overflow-hidden border border-white/5 flex">
                      <div className="h-full bg-amber-500" style={{ width: `${(customFinances.internalFailureCost / totalCOQ) * 100}%` }} title="Fallas Internas" />
                      <div className="h-full bg-red-500" style={{ width: `${(customFinances.externalFailureCost / totalCOQ) * 100}%` }} title="Fallas Externas" />
                    </div>
                  </div>
                </div>

                {/* Integration link explanation */}
                <div className="p-4 bg-[#0a0a0c] border border-white/5 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-400" /> Relación con Hallazgos de Auditoría SGC
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Si el costo de <strong>Fallas Internas</strong> es elevado, el mapa operativo de valor posee desviaciones. Solucionar reclamos mediante las herramientas de 8D vistas en la solapa anterior disminuirá las multas, reprocesos y fletes por devoluciones de forma drástica, redistribuyendo estos fondos hacia los costos de <strong>Prevención</strong> (Auditorías preventivas o capacitación polivalente).
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 7: INTEGRATION AND MAESTRO SGC DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-red-500" /> Tablero de Control Maestro y Sinergia Sistémica
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Sinergia de los procesos en tiempo real: auditorías que alimentan el análisis de dirección reduciendo fallas del negocio.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase">
                Consola SIG 100% de Control
              </span>
            </div>

            {/* THREE PANELS REQUIRED: DESEMPEÑO DE PROCESOS, ESTADO AUDITORÍAS/NC, EVOLUCIÓN COSTOS PAF */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* PANEL A: DESEMPEÑO DE PROCESOS */}
              <div className="glass p-5 rounded-3xl border border-white/10 bg-[#0c0c0f] space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" /> A. Desempeño de Procesos
                  </h4>
                  <span className="text-[10px] text-green-400 uppercase font-mono">En Línea</span>
                </div>

                <div className="space-y-3 text-xs">
                  {currentSector.processes.map((proc, index) => (
                    <div key={index} className="space-y-1 p-2 bg-black/40 border border-white/5 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white truncate max-w-[170px]">{proc.name}</span>
                        <span className="text-green-400 font-bold font-mono">94%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '94%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PANEL B: ESTADO DE AUDITORÍAS Y NO CONFORMIDADES */}
              <div className="glass p-5 rounded-3xl border border-white/10 bg-[#0c0c0f] space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-amber-500" /> B. Auditorías e Inspecciones
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono">MTTR: 12 días</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-white font-extrabold text-xs">Auditorías SGC Realizadas</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Avance del programa anual</p>
                    </div>
                    <span className="text-sm font-black text-green-400">2 de 3</span>
                  </div>

                  <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-white font-extrabold text-xs">No Conformidades Internas</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Acotadas en tablero 8D</p>
                    </div>
                    <span className="text-sm font-black text-red-500">{currentSector.commonNC.length + ncList.length}</span>
                  </div>
                </div>
              </div>

              {/* PANEL C: EVOLUCIÓN DEL COQ */}
              <div className="glass p-5 rounded-3xl border border-white/10 bg-[#0c0c0f] space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" /> C. Distribución COQ
                  </h4>
                  <span className="text-[10px] text-blue-400 font-mono">Target: &lt; 5% Ventas</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prevención / Evaluación</span>
                    <span className="text-green-400 font-mono font-bold">${cogq.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Costo de Fallas (Fuga de Dinero):</span>
                    <span className="text-red-400 font-mono font-bold">${copq.toLocaleString()}</span>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[10px] text-gray-500 leading-normal">
                    La sinergia del consorcio asegura el retorno económico del sistema SGC de manera fluida y medible en los cierres de balances.
                  </div>
                </div>
              </div>

            </div>

            {/* SYSTEEM CONNECTIONS & DIGITAL AUTOMATION TOOLS SUGGESTIONS */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0e0e12] space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-red-500" /> Herramientas de Automatización Digital e Software SGC
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed">
                Para consolidar esta estructura de control SGC con tableros interactivos automatizados, Coach-ISO recomienda las siguientes tecnologías empresariales:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <p className="font-extrabold text-white text-sm">Qualio / Greenlight</p>
                  <p className="text-gray-500 mt-1 uppercase text-[9px] font-mono">Software SGC ERP</p>
                  <p className="text-gray-400 mt-2 text-[11px] leading-normal">Gestión estructurada de control de cambios, firmas electrónicas válidas por la FDA y auditorías internas.</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <p className="font-extrabold text-white text-sm">Power BI / Datadog</p>
                  <p className="text-gray-500 mt-1 uppercase text-[9px] font-mono">Tableros e KPIs</p>
                  <p className="text-gray-400 mt-2 text-[11px] leading-normal">Conexión de bases de datos operacionales en tiempo real con cartas SPC y control de mermas o bugs.</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <p className="font-extrabold text-white text-sm">Jira / Trello / ClickUp</p>
                  <p className="text-gray-500 mt-1 uppercase text-[9px] font-mono">Control de No Conformidades</p>
                  <p className="text-gray-400 mt-2 text-[11px] leading-normal">Seguimiento de tableros Kanban interactivos para cada una de las 8 disciplinas (8D) y acciones correctivas.</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <p className="font-extrabold text-white text-sm">Excel Avanzado / VBA</p>
                  <p className="text-gray-500 mt-1 uppercase text-[9px] font-mono">Operatividad Base</p>
                  <p className="text-gray-400 mt-2 text-[11px] leading-normal">Calculadores dinámicos locales y registros de personal con macros para pequeñas empresas en fase inicial.</p>
                </div>
              </div>

              {/* 3 MONTH IMPLEMENTATION ROADMAP REQUESTED */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <p className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-500" /> Plan de Implementación Expreso en 3 Meses (Para Auditor Administrativo)
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-[#09090c] border border-blue-500/10 rounded-2xl relative overflow-hidden">
                    <span className="absolute top-2 right-2 text-blue-400 font-mono text-[10px] font-bold">Mes 1</span>
                    <h5 className="font-black text-white text-xs mb-1 uppercase">Alineación de Procesos</h5>
                    <p className="text-gray-400 leading-normal text-[11px] mt-2">Mapear procesos Nivel 0, 1 y 2, redactar y publicar instructivos al puesto de trabajo y calibrar puntos de control de piezas o pases.</p>
                  </div>

                  <div className="p-4 bg-[#09090c] border border-amber-500/10 rounded-2xl relative overflow-hidden">
                    <span className="absolute top-2 right-2 text-amber-400 font-mono text-[10px] font-bold">Mes 2</span>
                    <h5 className="font-black text-white text-xs mb-1 uppercase">Gobernanza de Desviaciones</h5>
                    <p className="text-gray-400 leading-normal text-[11px] mt-2">Capacitar auditores internos en ISO 19011. Implementar bitácora de no conformidades con flujo 8D y Ishikawa para erradicar fallas.</p>
                  </div>

                  <div className="p-4 bg-[#09090c] border border-green-500/10 rounded-2xl relative overflow-hidden">
                    <span className="absolute top-2 right-2 text-green-400 font-mono text-[10px] font-bold">Mes 3</span>
                    <h5 className="font-black text-white text-xs mb-1 uppercase">Control Financiero e Integración</h5>
                    <p className="text-gray-400 leading-normal text-[11px] mt-2">Habilitar el acta sistemática de dirección, vincular los costos PAF directos con ventas, y automatizar dashboards con Power BI.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
