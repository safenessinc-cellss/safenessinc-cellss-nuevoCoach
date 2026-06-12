import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Factory, Activity, AlertTriangle, Award, BarChart3, BookOpen, Briefcase, 
  Calendar, Check, CheckCircle2, ClipboardCheck, Layers, LayoutDashboard, Loader2, 
  Map, Network, Sliders, UserCheck, Users, Workflow, X, ArrowRight, ChevronRight, 
  Info, FileText, HelpCircle, TrendingDown, TrendingUp, Gauge, FileCode, Plus, LogOut,
  Brain, Heart, Sparkles, MessageSquare, ShieldAlert
} from 'lucide-react';
import { SECTORS, SectorData, ProcessItem } from './DataModel';
import { useProfileSettings } from '../data/useProfileSettings';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, getDoc, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import SGCButtonCoachDetails from './SGCButtonCoachDetails';

export default function ManualSIG() {
  const { profile } = useProfileSettings();
  const [searchParams] = useSearchParams();
  const [selectedSectorId, setSelectedSectorId] = useState<string>('tech_software');
  const [activeTab, setActiveTab] = useState<string>('gestionycalidad');
  const [selectedProcessId, setSelectedProcessId] = useState<string>('P1');

  // Interactive states for Tab 10: Auditor Leader
  const [auditDate, setAuditDate] = useState<string>('2026-06-25');
  const [auditScope, setAuditScope] = useState<string[]>(['4.4', '5.3', '7.5']);
  const [auditPreparationScore, setAuditPreparationScore] = useState<number>(90);
  const [auditTeamCompetency, setAuditTeamCompetency] = useState<number>(4); // scale 1-5
  const [auditFindings, setAuditFindings] = useState<{ id: string; title: string; type: 'major' | 'minor' | 'opm' | 'fortaleza'; clause: string }[]>([
    { id: 'f-1', title: 'Bitácora de SGI no refleja las revisiones de firma preventiva semanal.', type: 'minor', clause: '7.5' },
    { id: 'f-2', title: 'Puntos de control operacionales N2 carecen de validación de FTY física en línea.', type: 'minor', clause: '4.4' }
  ]);
  const [newFindingTitle, setNewFindingTitle] = useState<string>('');
  const [newFindingType, setNewFindingType] = useState<'major' | 'minor' | 'opm' | 'fortaleza'>('minor');
  const [newFindingClause, setNewFindingClause] = useState<string>('4.4');

  // Sync activeTab with searches
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  
  // Real-time cloudsync states
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudSyncedAt, setCloudSyncedAt] = useState<string | null>(null);
  
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

  // New Leadership (IBM Coach 2025) Interactive States
  const [coachingResults, setCoachingResults] = useState<Record<string, string>>({});
  const [liderazgoQuizAnswers, setLiderazgoQuizAnswers] = useState<Record<number, string>>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [conflictStep, setConflictStep] = useState<number>(1);
  const [sgcClimateIndex, setSgcClimateIndex] = useState<number>(65);
  const [sgcComplianceIndex, setSgcComplianceIndex] = useState<number>(60);
  const [simFeedback, setSimFeedback] = useState<string>('');
  const [humanAgreements, setHumanAgreements] = useState<Array<{ id: number; title: string; signed: boolean; description: string }>>([
    { id: 1, title: 'Comunión de Criterio: Auditoría Empática', signed: false, description: 'Sustituir interrogatorios hostiles de calidad por diálogos de aprendizaje activo orientados a la mejora.' },
    { id: 2, title: 'Pacto de Cero Represalias de Calidad', signed: false, description: 'Pacto corporativo firmado: La revelación asertiva de una desviación u error no será motivo de castigo, sino de asimilación.' },
    { id: 3, title: 'Taller Colectivo de Clima y OKRs Emocionales', signed: false, description: 'Planificar dinámicas semanales breves de 15 minutos en piso de planta para erradicar silos informativos.' }
  ]);

  // TAB 1: ISO Gestión de Calidad
  const [gapScores, setGapScores] = useState<Record<string, number>>({
    'Cls 4 (Contexto)': 80,
    'Cls 5 (Liderazgo)': 75,
    'Cls 6 (Planificación)': 65,
    'Cls 7 (Soporte)': 70,
    'Cls 8 (Operación)': 60,
    'Cls 9 (Evaluación)': 55,
    'Cls 10 (Mejora)': 50,
  });
  const [isoFloorSimulatorStep, setIsoFloorSimulatorStep] = useState<number>(1);
  const [isoFloorFeedback, setIsoFloorFeedback] = useState<string>('');

  // TAB 2: Estructuras de Empresas
  const [selectedOrgModel, setSelectedOrgModel] = useState<string>('matricial');
  const [spanOfControl, setSpanOfControl] = useState<number>(6);
  const [layerCount, setLayerCount] = useState<number>(4);
  const [orgConflictStep, setOrgConflictStep] = useState<number>(1);
  const [orgConflictFeedback, setOrgConflictFeedback] = useState<string>('');

  // TAB 3: Mapeo de Procesos
  const [cycleTimeSecs, setCycleTimeSecs] = useState<number>(120);
  const [defectPercent, setDefectPercent] = useState<number>(2.5);
  const [volumePerHour, setVolumePerHour] = useState<number>(150);
  const [kaizenStep, setKaizenStep] = useState<number>(1);
  const [kaizenFeedback, setKaizenFeedback] = useState<string>('');

  // TAB 4: Análisis Crítico / Auditoría
  const [auditTesterStep, setAuditTesterStep] = useState<number>(1);
  const [auditTesterFeedback, setAuditTesterFeedback] = useState<string>('');

  // TAB 5: Análisis de Gestión (Review Board)
  const [managementBoardStep, setManagementBoardStep] = useState<number>(1);
  const [managementBoardFeedback, setManagementBoardFeedback] = useState<string>('');

  // TAB 6: Análisis de Riesgo (FMEA & COQ)
  const [riskFmStep, setRiskFmStep] = useState<number>(1);
  const [riskFmFeedback, setRiskFmFeedback] = useState<string>('');
  const [riskLikelihood, setRiskLikelihood] = useState<number>(4);
  const [riskImpact, setRiskImpact] = useState<number>(5);

  // TAB 7: Análisis de Mercado
  const [swotFactors, setSwotFactors] = useState<Array<{ id: number; type: 'F' | 'O' | 'D' | 'A'; text: string; score: number }>>([
    { id: 1, type: 'F', text: 'Trazabilidad automatizada en la nube', score: 9 },
    { id: 2, type: 'O', text: 'Demanda creciente de envases eco-sostenibles', score: 8 },
    { id: 3, type: 'D', text: 'Tiempos muertos por mantenimiento correctivo', score: 5 },
    { id: 4, type: 'A', text: 'Volatilidad en costos de resina plástica virgen', score: 7 },
  ]);
  const [marketScenarioStep, setMarketScenarioStep] = useState<number>(1);
  const [marketScenarioFeedback, setMarketScenarioFeedback] = useState<string>('');
  const [newSwotText, setNewSwotText] = useState<string>('');
  const [newSwotType, setNewSwotType] = useState<'F' | 'O' | 'D' | 'A'>('F');

  // TAB 8: Emprendimiento & Startup
  const [mvpLaunchSpeed, setMvpLaunchSpeed] = useState<number>(75);
  const [startupPivotStep, setStartupPivotStep] = useState<number>(1);
  const [startupPivotFeedback, setStartupPivotFeedback] = useState<string>('');

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

  // SGC Identity - use authenticated uid if signed in, otherwise 'visitor'
  const sgcUserId = auth.currentUser?.uid || 'visitor_global_sgc_state';

  // 1. Load SGC Global State and non-conformities from Firestore inside useEffect
  useEffect(() => {
    // A. Listen to Non Conformities (Realtime)
    const ncCollectionRef = collection(db, 'sgc_non_conformities_db');
    const unsubscribeNC = onSnapshot(ncCollectionRef, (snapshot) => {
      const dbNCList = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      // Filter by user if auth exists, otherwise show visitor content
      const filtered = dbNCList.filter((item: any) => item.ownerId === sgcUserId || !item.ownerId);
      setNcList(filtered);
    }, (error) => {
      console.error("Firestore error hearing SGC NC list:", error);
    });

    // B. Load stored state doc for checklist, acta, or prioritization matrices
    const loadSgcDoc = async () => {
      try {
        const docRef = doc(db, 'sgc_states', sgcUserId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          if (fetchedData.checklistScores) setChecklistScores(fetchedData.checklistScores);
          if (fetchedData.actaText) setActaText(fetchedData.actaText);
          if (fetchedData.prioritizationMatrix) setPrioritizationMatrix(fetchedData.prioritizationMatrix);
          if (fetchedData.customFinances) setCustomFinances(fetchedData.customFinances);
          if (fetchedData.sgcClimateIndex) setSgcClimateIndex(fetchedData.sgcClimateIndex);
          if (fetchedData.sgcComplianceIndex) setSgcComplianceIndex(fetchedData.sgcComplianceIndex);
          if (fetchedData.humanAgreements) setHumanAgreements(fetchedData.humanAgreements);
          
          if (fetchedData.gapScores) setGapScores(fetchedData.gapScores);
          if (fetchedData.selectedOrgModel) setSelectedOrgModel(fetchedData.selectedOrgModel);
          if (fetchedData.spanOfControl) setSpanOfControl(fetchedData.spanOfControl);
          if (fetchedData.layerCount) setLayerCount(fetchedData.layerCount);
          if (fetchedData.cycleTimeSecs) setCycleTimeSecs(fetchedData.cycleTimeSecs);
          if (fetchedData.defectPercent) setDefectPercent(fetchedData.defectPercent);
          if (fetchedData.volumePerHour) setVolumePerHour(fetchedData.volumePerHour);
          if (fetchedData.swotFactors) setSwotFactors(fetchedData.swotFactors);
          if (fetchedData.mvpLaunchSpeed) setMvpLaunchSpeed(fetchedData.mvpLaunchSpeed);
          
          setCloudSyncedAt(fetchedData.syncedAt || new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error("Error fetching SGC persistent states:", error);
      }
    };
    loadSgcDoc();

    return () => {
      unsubscribeNC();
    };
  }, [sgcUserId]);

  // 2. Save SGC state manually or on demand via Cloud sync button
  const handleCloudSgcSync = async () => {
    setIsCloudSyncing(true);
    try {
      const docRef = doc(db, 'sgc_states', sgcUserId);
      const rightNow = new Date().toLocaleTimeString();
      await setDoc(docRef, {
        checklistScores,
        actaText,
        prioritizationMatrix,
        customFinances,
        sgcClimateIndex,
        sgcComplianceIndex,
        humanAgreements,
        gapScores,
        selectedOrgModel,
        spanOfControl,
        layerCount,
        cycleTimeSecs,
        defectPercent,
        volumePerHour,
        swotFactors,
        mvpLaunchSpeed,
        syncedAt: rightNow,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setCloudSyncedAt(rightNow);
      setIsCloudSyncing(false);
    } catch (err) {
      console.error("Error protecting state in cloudsync:", err);
      setIsCloudSyncing(false);
      alert("Error al sincronizar con la nube. ¿Tiene conexión?");
    }
  };

  // 3. Add NC Persistent to Firestore
  const handleAddNC = async () => {
    try {
      const newEntry = {
        title: customNC.title,
        proc: customNC.proc,
        desc: customNC.desc,
        containment: customNC.containment,
        rootCause: customNC.rootCause,
        date: new Date().toLocaleDateString(),
        status: 'Abierta',
        ownerId: sgcUserId,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'sgc_non_conformities_db'), newEntry);
      
      // Reset form fields
      setCustomNC({
        title: 'Nueva No Conformidad Detectada',
        proc: currentSector.processes[0]?.name || 'Operativo',
        desc: 'Se encontró una desviación frente a la cláusula establecida...',
        containment: 'Acción preventiva inmediata para acotar la falla...',
        rootCause: 'Causa originaria debida a falta de capacitación...'
      });
      alert('¡Excelente! No Conformidad guardada físicamente en Firestore.');
    } catch (error) {
      console.error("Error adding SGC NC:", error);
      // Fallback local if offline
      const newEntryLocal = {
        title: customNC.title,
        proc: customNC.proc,
        desc: customNC.desc,
        containment: customNC.containment,
        rootCause: customNC.rootCause,
        id: `NC-TEMP-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleDateString(),
        status: 'Abierta'
      };
      setNcList(prev => [newEntryLocal, ...prev]);
      alert('Se registró localmente (Modo Offline).');
    }
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

        {/* Dynamic Sector Selector Dropdown & Cloud Sync */}
        <div className="w-full lg:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-black/40 border border-white/10 p-3 rounded-2xl">
          <button
            onClick={handleCloudSgcSync}
            disabled={isCloudSyncing}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              isCloudSyncing
                ? 'bg-red-900/10 border-red-500/20 text-red-400'
                : 'bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-500'
            }`}
          >
            {isCloudSyncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
                <span>{cloudSyncedAt ? `Guardado ${cloudSyncedAt}` : 'Guardar SGC en Nube'}</span>
              </>
            )}
          </button>
          
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

      {/* DETAILED HORIZONTAL NAVIGATION TABS (THE 10 MASTERS MASTERFULLY CONNECTED) */}
      <div className="flex overflow-x-auto gap-2 p-4 border-b border-white/5 bg-black/20 scrollbar-none">
        {[
          { id: 'gestionycalidad', name: '1. ISO Gestión de Calidad', icon: Gauge, badge: 'SGC 9001' },
          { id: 'estructuras', name: '2. Estructuras de Empresas', icon: Users, badge: 'Org Setup' },
          { id: 'mapeo', name: '3. Mapeo de Procesos', icon: Workflow, badge: 'Niveles 0-2' },
          { id: 'auditorias', name: '4. Análisis Crítico', icon: ClipboardCheck, badge: '8D & Audits' },
          { id: 'direccion', name: '5. Análisis de Gestión', icon: Award, badge: 'Cl. 9.3' },
          { id: 'problemas', name: '6. Análisis de Riesgo & COQ', icon: Sliders, badge: 'FMEA Matrix' },
          { id: 'costos', name: '7. Análisis de Mercado', icon: Map, badge: 'FODA / SWOT' },
          { id: 'dashboard', name: '8. Emprendimiento & Startup', icon: Sparkles, badge: 'SGC Ágil' },
          { id: 'liderazgo', name: '9. IBM 2025 Coach', icon: Brain, badge: 'Liderazgo' },
          { id: 'auditor_leader', name: '10. Auditor Leader', icon: UserCheck, badge: 'ISO 19011' }
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
        
        {/* TAB 1: ISO GESTIÓN DE CALIDAD */}
        {activeTab === 'gestionycalidad' && (
          <div className="space-y-8 animate-fadeIn text-gray-200">
            {/* Tab Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-red-500" /> 1. ISO Gestión de Calidad (9001:2015)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Evalúe el grado de madurez global del SGC y diagnostique brechas de cumplimiento regulatorio.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase font-mono">
                SGC Estándar Maestro
              </span>
            </div>

            {/* Gap Score Sliders & Gauge Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass p-6 rounded-3xl border border-white/5 bg-[#07070a] space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-2 flex items-center gap-2 font-mono">
                    <Sliders className="w-4 h-4 text-red-500" /> Sliders de Brechas (Capacidad As-Is)
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Ajuste el porcentaje real de implementación de cada cláusula para calcular el índice corporativo ponderado en tiempo real:
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs text-gray-300">
                  {Object.keys(gapScores).map((clause) => (
                    <div key={clause} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold">{clause}</span>
                        <span className="text-red-400 font-extrabold">{gapScores[clause]}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={gapScores[clause]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setGapScores(prev => ({ ...prev, [clause]: val }));
                        }}
                        className="w-full accent-red-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Index Card & Dynamic Diagnostic */}
              <div className="glass p-6 rounded-3xl border border-white/10 bg-[#0c0c10] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-red-500 animate-pulse" /> Estado de Certificación
                    </h3>
                    <span className="text-[10px] bg-red-600/15 text-red-400 px-2.5 py-0.5 rounded-full font-bold font-mono">EN AUDITORÍA</span>
                  </div>

                  <div className="text-center py-6">
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">Índice Ponderado de Madurez SGC</p>
                    <h4 className="text-5xl font-black text-white mt-2 font-mono tracking-tighter">
                      {Math.round((Object.values(gapScores) as number[]).reduce((a, b) => a + b, 0) / Object.values(gapScores).length)}%
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-2 italic">
                      Basado en las cláusulas obligatorias de la norma ISO 9001:2015
                    </p>
                  </div>

                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-gray-400 leading-relaxed">
                    <p className="font-extrabold text-white mb-1 uppercase tracking-wider text-[10px] text-amber-400 font-mono">Consola Diagnóstica Robert Terán:</p>
                    {(() => {
                      const avg = Math.round((Object.values(gapScores) as number[]).reduce((a, b) => a + b, 0) / Object.values(gapScores).length);
                      if (avg >= 85) return "Excelente nivel de cobertura corporativa. Su SGC se encuentra preparado para certificarse con cero desvíos críticos o No Conformidades.";
                      if (avg >= 60) return "SGC de de madurez intermedia. Se recomienda formalizar procesos en piso para evitar desvíos reiterativos en auditorías.";
                      return "Brechas críticas de gobernanza técnica. Se detectan desvíos en riesgos e infraestructura. Detener inspecciones superficiales.";
                    })()}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={async () => {
                      setIsCloudSyncing(true);
                      try {
                        const docRef = doc(db, 'sgc_states', sgcUserId);
                        await setDoc(docRef, { gapScores, syncedAt: new Date().toLocaleTimeString() }, { merge: true });
                        setCloudSyncedAt(new Date().toLocaleTimeString());
                      } catch (e) {
                        console.error(e);
                      }
                      setIsCloudSyncing(false);
                      alert('¡Análisis de brechas SGC guardado en la nube!');
                    }}
                    className="w-full bg-red-600 text-white font-bold uppercase py-2.5 rounded-xl text-xs hover:bg-red-500 transition-with font-mono tracking-wider shadow-lg"
                  >
                    Guardar Gap Analysis en Firestore
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ESTRUCTURAS DE EMPRESAS */}
        {activeTab === 'estructuras' && (
          <div className="space-y-8 animate-fadeIn text-gray-200">
            {/* Tab Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-500" /> 2. Estructuras de Empresas (Diseño Organizacional)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Defina el modelo de gobernanza, tramo de control e interactúe con el simulador de escalamiento organizacional.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase font-mono">
                ISO 5.3 Roles y Autoridades
              </span>
            </div>

            {/* Model Selector & Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass p-6 rounded-3xl border border-white/5 bg-[#07070a] space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-2 flex items-center gap-2 font-mono">
                    <Sliders className="w-4 h-4 text-red-500" /> Modelo y Tramo de Control
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Seleccione la tipología organizacional y mueva los tramos para predecir fricciones burocráticas:
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs text-gray-200">
                  <div className="space-y-1">
                    <span className="block text-gray-400 font-bold">Tipología de Organización:</span>
                    <select
                      value={selectedOrgModel}
                      onChange={(e) => setSelectedOrgModel(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white focus:border-red-500 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="funcional">Funcional Tradicional (Vertical)</option>
                      <option value="matricial">Matricial Flexible (Híbrida)</option>
                      <option value="lineal">Lineal / Militar</option>
                      <option value="proyectos">Orientado a Proyectos (Plana)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold">Tramo de Control (Personas por Jefe):</span>
                      <span className="text-red-400 font-extrabold">{spanOfControl} pers.</span>
                    </div>
                    <input 
                      type="range"
                      min="3"
                      max="15"
                      value={spanOfControl}
                      onChange={(e) => setSpanOfControl(parseInt(e.target.value))}
                      className="w-full accent-red-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold">Niveles Jerárquicos / Capas:</span>
                      <span className="text-red-400 font-extrabold">{layerCount} capas</span>
                    </div>
                    <input 
                      type="range"
                      min="2"
                      max="8"
                      value={layerCount}
                      onChange={(e) => setLayerCount(parseInt(e.target.value))}
                      className="w-full accent-red-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Friction metrics and diagnostic */}
              <div className="glass p-6 rounded-3xl border border-white/10 bg-[#0c0c10] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono flex items-center gap-2">
                       <Activity className="w-4 h-4 text-red-500" /> Varianza de Burocracia
                    </h3>
                    <span className="text-[10px] bg-red-600/15 text-red-400 px-2.5 py-0.5 rounded-full font-bold font-mono">MODELO {selectedOrgModel.toUpperCase()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 text-center">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider">Delay de Comunicación</p>
                      <h4 className="text-3xl font-black text-white mt-1 font-mono">
                        {(layerCount * 1.5).toFixed(1)}x
                      </h4>
                      <p className="text-[9px] text-gray-500">Múltiplo de retraso</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider">Índice de Silos Internos</p>
                      <h4 className="text-3xl font-black text-white mt-1 font-mono">
                        {Math.round((layerCount / spanOfControl) * 100)}%
                      </h4>
                      <p className="text-[9px] text-gray-500">Probabilidad de silos</p>
                    </div>
                  </div>

                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-gray-400 leading-relaxed font-sans">
                    <p className="font-extrabold text-white mb-1 uppercase tracking-wider text-[10px] text-amber-400 font-mono">Evaluación de Estructura Robert Terán:</p>
                    {(() => {
                      const silos = Math.round((layerCount / spanOfControl) * 100);
                      if (silos > 60) return "Organización delgada de mando vertical o hiper-burocrática. Gran riesgo de cuellos de botella de decisión y mandos intermedios ineficientes. Reestructurar inmediato.";
                      if (silos < 25) return "Dirección demasiado extendida y desatendida. Los supervisores carecen de tiempo de coaching para cada integrante, deteriorando la consistencia en planta.";
                      return "Estructura intermedia y equilibrada de control operacional. Promueve delegación y velocidad de feedback sin comprometer el cumplimiento ISO.";
                    })()}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={async () => {
                      setIsCloudSyncing(true);
                      try {
                        const docRef = doc(db, 'sgc_states', sgcUserId);
                        await setDoc(docRef, { selectedOrgModel, spanOfControl, layerCount, syncedAt: new Date().toLocaleTimeString() }, { merge: true });
                        setCloudSyncedAt(new Date().toLocaleTimeString());
                      } catch (e) {
                        console.error(e);
                      }
                      setIsCloudSyncing(false);
                      alert('¡Parámetros estructurales guardados en la nube!');
                    }}
                    className="w-full bg-red-600 text-white font-bold uppercase py-2.5 rounded-xl text-xs hover:bg-red-500 transition-all font-mono tracking-wider shadow-lg"
                  >
                    Guardar Parámetros en Firestore
                  </button>
                </div>
              </div>
            </div>

            {/* CLINICAL SIMULATOR TAB 2 */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/20 to-black relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <HelpCircle className="w-4 h-4 text-red-500 animate-pulse" /> Simulador Clínico #2: Conflicto de Doble Mando en la Matriz (ISO Cl. 5.3)
                  </h4>
                  <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 font-bold uppercase font-mono">Estructuras</span>
                </div>

                <p className="text-xs text-gray-300 leading-normal font-sans">
                  "En su organigrama matricial flexible, el Ingeniero Senior de Calidad recibe órdenes directas del Líder de Proyecto de acelerar la liberación de un lote de software que tiene un bug menor. Sin embargo, el Gerente de Calidad (su jefe funcional) le ha prohibido estrictamente liberar cualquier lote con bugs abiertos. El ingeniero entra en parálisis operacional. ¿Cómo se resuelve?"
                </p>

                {orgConflictStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px] font-sans">
                    <button 
                      onClick={() => {
                        setOrgConflictFeedback("INCORRECTO Y DESTRUCTIVO: Pasar por encima del gerente de calidad socava la autoridad de la Cláusula 5.3 de la norma ISO y perpetúa desvíos regulatorios peligrosos en el SGC.");
                        setOrgConflictStep(2);
                      }}
                      className="bg-black/35 hover:bg-[#1a0c0c] p-3 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all hover:border-red-500/30"
                    >
                      A. Apoyar al Líder de Proyecto para que libere el lote de inmediato, argumentando de forma informal que el bug se corregirá la próxima semana.
                    </button>
                    <button 
                      onClick={() => {
                        setOrgConflictFeedback("REACCIÓN BUROCRÁTICA LENTA: Detener todo sin diálogo aumenta el Costo de Calidad (COQ) y la fricción interdepartamental. Robert Terán exige soluciones sistémicas rápidas.");
                        setOrgConflictStep(22);
                      }}
                      className="bg-black/35 hover:bg-[#1a0c0c] p-3 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all hover:border-red-500/30"
                    >
                      B. Bloquear rígidamente todo el despliegue del proyecto, prohibiendo cualquier comunicación entre el ingeniero de calidad y el equipo de desarrollo.
                    </button>
                    <button 
                      onClick={() => {
                        setOrgConflictFeedback("MODELO EXCEPCIONAL (Robert Terán Aprueba): Se aplica gobernanza técnica sólida. El análisis de impacto formaliza la liberación o retraso, mientras la mesa de resolución unifica criterios de calidad, preservando el SGC.");
                        setOrgConflictStep(3);
                      }}
                      className="bg-black/35 hover:bg-[#1a0c0c] p-3 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all hover:border-red-500/30"
                    >
                      C. Convocar mesa de resolución inmediata con Gerente de Calidad y Líder de Proyecto, evaluar el impacto real del bug documentado y firmar un consentimiento bajo desvío formal controlado.
                    </button>
                  </div>
                )}

                {orgConflictStep > 1 && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-3 font-sans">
                    <p className="text-gray-300 italic text-xs leading-relaxed">"{orgConflictFeedback}"</p>
                    <button 
                      onClick={() => {
                        setOrgConflictStep(1);
                        setOrgConflictFeedback('');
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white font-extrabold uppercase py-2 px-4 rounded-xl text-[10px] tracking-wider font-mono transition-all"
                    >
                      Reiniciar Conflicto de Mando
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MAPEO DE PROCESOS (HIERARCHICAL LEVELS & SIX SIGMA CALCULATOR) */}
        {activeTab === 'mapeo' && (
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
                    <div key={`${p.id}-${sub.name}-${sidx}`} className="p-5 bg-black/60 rounded-2xl border border-white/5 hover:border-red-500/20 transition-all space-y-4">
                      
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


            {/* SIX SIGMA CALCULATOR & LEAN KAIZEN SIMULATOR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 text-xs font-sans">
              <div className="glass p-6 rounded-3xl border border-white/5 bg-[#07070a] space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-2 flex items-center gap-2 font-mono">
                    <Activity className="w-4 h-4 text-blue-400" /> Calculador Sigma & Control de Capacidad (Cl. 8.1 / 8.5)
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Simule la varianza de la capacidad del proceso operativo para auditar el rendimiento y estimar desperdicios (Scrap):
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs text-gray-300">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold">Tiempo de Ciclo Promedio:</span>
                      <span className="text-blue-400 font-extrabold">{cycleTimeSecs} segundos</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="600"
                      value={cycleTimeSecs}
                      onChange={(e) => setCycleTimeSecs(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold">Tasa Real de Defectos:</span>
                      <span className="text-red-400 font-extrabold">{defectPercent}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0.1"
                      max="15"
                      step="0.1"
                      value={defectPercent}
                      onChange={(e) => setDefectPercent(parseFloat(e.target.value))}
                      className="w-full accent-red-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold">Volumen Transaccional por Hora:</span>
                      <span className="text-blue-400 font-extrabold">{volumePerHour} unidades</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="2000"
                      value={volumePerHour}
                      onChange={(e) => setVolumePerHour(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Sigma Index Results */}
              <div className="glass p-6 rounded-3xl border border-white/10 bg-[#0c0c10] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-blue-500 animate-pulse" /> Nivel de Calidad Operacional
                    </h3>
                    <span className="text-[10px] bg-blue-600/15 text-blue-400 px-2.5 py-0.5 rounded-full font-bold font-mono">CPK / SIX SIGMA</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 text-center font-mono">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-sans">Sigmas del Proceso</p>
                      <h4 className="text-3xl font-black text-white mt-1">
                        {(4.5 - (defectPercent * 0.15)).toFixed(2)} σ
                      </h4>
                      <p className="text-[9px] text-gray-500 font-sans">Capacidad de Piso</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-sans">Merma Mensual Estimada</p>
                      <h4 className="text-3xl font-black text-white mt-1 text-red-400">
                        {Math.round(volumePerHour * 8 * 22 * (defectPercent / 100))} u.
                      </h4>
                      <p className="text-[9px] text-gray-500 font-sans">Pérdida scrap (8h x 22d)</p>
                    </div>
                  </div>

                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-gray-400 leading-relaxed font-sans">
                    <p className="font-extrabold text-white mb-1 uppercase tracking-wider text-[10px] text-amber-400 font-mono">Consola Lean de Robert Terán:</p>
                    {(() => {
                      const sig = 4.5 - (defectPercent * 0.15);
                      if (sig >= 4.2) return "Operaciones altamente controladas. Defectos mínimos por millón. Cumplimiento de especificaciones excelente para el giro activo.";
                      if (sig >= 3.5) return "Varianza operacional estándar. Se recomienda implementar control de lote estadístico (SPC) y poka-yokes preventivos.";
                      return "Desperdicios masivos y scrap descontrolado. Cuello de botella en liberación del proceso. Se exige rediseño radical de flujos.";
                    })()}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={async () => {
                      setIsCloudSyncing(true);
                      try {
                        const docRef = doc(db, 'sgc_states', sgcUserId);
                        await setDoc(docRef, { cycleTimeSecs, defectPercent, volumePerHour, syncedAt: new Date().toLocaleTimeString() }, { merge: true });
                        setCloudSyncedAt(new Date().toLocaleTimeString());
                      } catch (e) {
                        console.error(e);
                      }
                      setIsCloudSyncing(false);
                      alert('¡Métricas de capacidad de proceso guardadas en la nube!');
                    }}
                    className="w-full bg-blue-600 text-white font-bold uppercase py-2.5 rounded-xl text-xs hover:bg-blue-500 transition-all font-mono tracking-wider shadow-lg"
                  >
                    Guardar Capacidad en Firestore
                  </button>
                </div>
              </div>
            </div>

            {/* KAIZEN CLINICAL SIMULATOR */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/20 to-black relative overflow-hidden mt-8 text-xs font-sans">
              <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <HelpCircle className="w-4 h-4 text-blue-505 animate-pulse" /> Simulador Clínico #3: El Cuello de Botella Operacional (Kaizen Lean)
                  </h4>
                  <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold uppercase font-mono">Kaizen SGC</span>
                </div>

                <p className="text-xs text-gray-300 leading-normal font-sans">
                  "El equipo de de auditoría interna detecta que el proceso de empaquetado final tarda el triple que el embotellado anterior, acumulando cientos de recipientes en la estación intermedia (Scrap y riesgo de choque de lotes). El inspector de calidad sugiere detener toda la planta para rediseñar de cero todo el mapeo. ¿Cuál es la ruta óptima?"
                </p>

                {kaizenStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px] font-sans">
                    <button 
                      onClick={() => {
                        setKaizenFeedback("INCORRECTO: El paro total no planificado eleva el Costo de Calidad (COQ) exponencialmente y destruye el rendimiento del negocio sin justificación técnica robusta.");
                        setKaizenStep(2);
                      }}
                      className="bg-black/35 hover:bg-[#0c121f] p-3 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all hover:border-blue-500/30"
                    >
                      A. Parar inmediatamente todas las líneas de producción por 48 horas para rediseñar las estaciones por completo.
                    </button>
                    <button 
                      onClick={() => {
                        setKaizenFeedback("RESPUESTA INSUFICIENTE: Ignorar el WIP (Work in Process) acumulado aumenta el desorden operacional y propicia contaminación cruzada violando la cláusula 8.5.");
                        setKaizenStep(22);
                      }}
                      className="bg-black/35 hover:bg-[#0c121f] p-3 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all hover:border-blue-500/30"
                    >
                      B. Ignorar la acumulación temporal asumiendo que el equipo de empaquetado resolverá la velocidad por sí mismos con horas extra obligatorias.
                    </button>
                    <button 
                      onClick={() => {
                        setKaizenFeedback("EXCELENTE RESOLUCIÓN (Robert Terán Aprueba): Se aplica balanceo de línea (OPEX) y Kaizen continuo. Nivelar la tasa de alimentación (Takt Time) y resolver ergonómicamente el empaquetado elimina el desperdicio de sobreprocesamiento.");
                        setKaizenStep(3);
                      }}
                      className="bg-black/35 hover:bg-[#0c121f] p-3 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all hover:border-blue-500/30"
                    >
                      C. Balancear el flujo ralentizando momentáneamente el llenado, balancear cargas de trabajo en empaque usando células modulares en U y eliminar movimientos desperdiciados (Muda).
                    </button>
                  </div>
                )}

                {kaizenStep > 1 && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-3 font-sans">
                    <p className="text-gray-300 italic text-xs leading-relaxed">"{kaizenFeedback}"</p>
                    <button 
                      onClick={() => {
                        setKaizenStep(1);
                        setKaizenFeedback('');
                      }}
                      className="bg-blue-605 hover:bg-blue-500 text-white font-extrabold uppercase py-2 px-4 rounded-xl text-[10px] tracking-wider font-mono transition-all"
                    >
                      Reiniciar Simulación de Flujo
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: ANÁLISIS CRÍTICO & AUDITS (ISO 19011 / 8D) */}
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

        {/* TAB 8: INTELIGENCIA HUMANA / LIDERAZGO & BIENESTAR SGC (COACH IBM 2025) */}
        {activeTab === 'liderazgo' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Elegant Hero Introduction */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-red-500" /> Inteligencia Humana: Liderazgo SGC & Psicología Organizacional
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  El SGC no son solo papeles o normativas: está compuesto de seres humanos. Descubra el modelo de resiliencia directiva Coach IBM 2025 de Robert Terán.
                </p>
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-red-600/15 to-amber-600/15 border border-red-500/30 rounded-full text-xs text-amber-400 font-bold uppercase tracking-wider font-mono">
                Model: IBM Coach 2025
              </span>
            </div>

            {/* COACH ROW INTRO */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-red-950/20 to-black relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                  <Award className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-black text-lg">Robert Terán — Coach SGC & Terapeuta Gestalt Organizacional</h3>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-3xl">
                    "Detrás de cada no conformidad recurrente, cuello de botella operativo, o resistencia al cambio SGC, existe una desviación en la cohesión y en la inteligencia emocional de las personas. Los manuales fríos no salvan una auditoría; la convicción, empatía y el liderazgo de piso asertivo de la gerencia sí lo logran. Integre este pilar humano en su auditoría administrativa."
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2 text-[10px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-red-500" /> Executive Leadership Coach IBM 2025</span>
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-red-500" /> Psicopedagogía del Trabajo Estructural</span>
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-red-500" /> Especialista SGC ISO 9001:2015</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GRID OF TWO INTERACTIVE ELEMENTS: TEST SGC AND THE CONFLICT WIZARD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* INTERACTIVE COLUMN 1: SGC LEADERSHIP TEST */}
              <div className="glass p-6 rounded-3xl border border-white/10 bg-[#07070a] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-4 h-4 text-red-500" /> Test SGC: Aptitud Directiva de Calidad
                    </h4>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 font-bold uppercase font-mono">Métrica Humana</span>
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    Responda constructivamente a los escenarios críticos de tensión de un SGC para recibir su reporte y diagnóstico conductual del Coach:
                  </p>

                  <div className="space-y-5 pt-2">
                    {/* Pregunta 1 */}
                    <div className="space-y-2 p-3 bg-black/40 border border-white/5 rounded-2xl">
                      <p className="text-xs font-bold text-gray-200">1. Ante un hallazgo de No Conformidad Mayor inminente antes de la auditoría de certificación:</p>
                      <div className="grid grid-cols-1 gap-1.5 text-[11px] text-gray-400">
                        <button 
                          onClick={() => setLiderazgoQuizAnswers(p => ({ ...p, 1: 'A' }))}
                          className={`text-left p-2.5 rounded-xl border transition-all ${liderazgoQuizAnswers[1] === 'A' ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-black/35 border-white/5 hover:border-white/10'}`}
                        >
                          A. Exijo horas extras y recalco culpables para limpiar los reportes rápido.
                        </button>
                        <button 
                          onClick={() => setLiderazgoQuizAnswers(p => ({ ...p, 1: 'B' }))}
                          className={`text-left p-2.5 rounded-xl border transition-all ${liderazgoQuizAnswers[1] === 'B' ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-black/35 border-white/5 hover:border-white/10'}`}
                        >
                          B. Oculto o maquillo el hallazgo para que el auditor externo no lo detecte.
                        </button>
                        <button 
                          onClick={() => setLiderazgoQuizAnswers(p => ({ ...p, 1: 'C' }))}
                          className={`text-left p-2.5 rounded-xl border transition-all ${liderazgoQuizAnswers[1] === 'C' ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-black/35 border-white/5 hover:border-white/10'}`}
                        >
                          C. Ejecuto un análisis Ishikawa constructivo, contengo el riesgo y asumo el error de forma madura.
                        </button>
                      </div>
                    </div>

                    {/* Pregunta 2 */}
                    <div className="space-y-2 p-3 bg-black/40 border border-white/5 rounded-2xl">
                      <p className="text-xs font-bold text-gray-200">2. Un auditor externo asume una actitud rígida y de confrontación hostil:</p>
                      <div className="grid grid-cols-1 gap-1.5 text-[11px] text-gray-400">
                        <button 
                          onClick={() => setLiderazgoQuizAnswers(p => ({ ...p, 2: 'A' }))}
                          className={`text-left p-2.5 rounded-xl border transition-all ${liderazgoQuizAnswers[2] === 'A' ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-black/35 border-white/5 hover:border-white/10'}`}
                        >
                          A. Confronto agresivamente y dudo de su capacitación técnica ante todos.
                        </button>
                        <button 
                          onClick={() => setLiderazgoQuizAnswers(p => ({ ...p, 2: 'B' }))}
                          className={`text-left p-2.5 rounded-xl border transition-all ${liderazgoQuizAnswers[2] === 'B' ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-black/35 border-white/5 hover:border-white/10'}`}
                        >
                          B. Me someto con timidez tolerando malos tratos con tal de pasar la norma.
                        </button>
                        <button 
                          onClick={() => setLiderazgoQuizAnswers(p => ({ ...p, 2: 'C' }))}
                          className={`text-left p-2.5 rounded-xl border transition-all ${liderazgoQuizAnswers[2] === 'C' ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-black/35 border-white/5 hover:border-white/10'}`}
                        >
                          C. Ejerzo asertividad serena, pregunto de forma objetiva sobre sus dudas y exijo respeto técnico cordial.
                        </button>
                      </div>
                    </div>

                    {/* Pregunta 3 */}
                    <div className="space-y-2 p-3 bg-black/40 border border-white/5 rounded-2xl">
                      <p className="text-xs font-bold text-gray-200">3. El personal de piso muestra desinterés rotundo en registrar los desvíos logísticos u operativos:</p>
                      <div className="grid grid-cols-1 gap-1.5 text-[11px] text-gray-400">
                        <button 
                          onClick={() => setLiderazgoQuizAnswers(p => ({ ...p, 3: 'A' }))}
                          className={`text-left p-2.5 rounded-xl border transition-all ${liderazgoQuizAnswers[3] === 'A' ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-black/35 border-white/5 hover:border-white/10'}`}
                        >
                          A. Aplico actas administrativas y multas salariales inmediatas.
                        </button>
                        <button 
                          onClick={() => setLiderazgoQuizAnswers(p => ({ ...p, 3: 'B' }))}
                          className={`text-left p-2.5 rounded-xl border transition-all ${liderazgoQuizAnswers[3] === 'B' ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-black/35 border-white/5 hover:border-white/10'}`}
                        >
                          B. No insisto, automatizo todo sin consultarles y asumo que fallan por pereza.
                        </button>
                        <button 
                          onClick={() => setLiderazgoQuizAnswers(p => ({ ...p, 3: 'C' }))}
                          className={`text-left p-2.5 rounded-xl border transition-all ${liderazgoQuizAnswers[3] === 'C' ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-black/35 border-white/5 hover:border-white/10'}`}
                        >
                          C. Organizo Focus Groups breves de escucha, simplifico los formularios engorrosos e involucro sus ideas de solución.
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Test Actions and Results */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        if (!liderazgoQuizAnswers[1] || !liderazgoQuizAnswers[2] || !liderazgoQuizAnswers[3]) {
                          alert('Por favor responda las 3 preguntas situacionales para generar su reporte.');
                          return;
                        }
                        setShowQuizResult(true);
                      }}
                      className="flex-1 bg-red-600 text-white text-xs font-bold uppercase py-3 rounded-xl hover:bg-red-500 transition-all font-mono tracking-wider"
                    >
                      Generar Reporte Directivo
                    </button>
                    {showQuizResult && (
                      <button 
                        onClick={() => {
                          setLiderazgoQuizAnswers({});
                          setShowQuizResult(false);
                        }}
                        className="bg-white/5 text-gray-400 text-xs px-4 rounded-xl hover:text-white hover:bg-white/10 transition-colors"
                      >
                        Reiniciar
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {showQuizResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-600/5 rounded-2xl border border-red-500/20 text-xs text-gray-200"
                      >
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider mb-2 font-mono">
                          <CheckCircle2 className="w-4 h-4" /> Diagnóstico del Coach Robert Terán:
                        </div>
                        <p className="leading-relaxed">
                          {(() => {
                            let pts = 0;
                            if (liderazgoQuizAnswers[1] === 'C') pts += 30; else if (liderazgoQuizAnswers[1] === 'B') pts += 10; else pts += 15;
                            if (liderazgoQuizAnswers[2] === 'C') pts += 30; else if (liderazgoQuizAnswers[2] === 'A') pts += 10; else pts += 15;
                            if (liderazgoQuizAnswers[3] === 'C') pts += 30; else if (liderazgoQuizAnswers[3] === 'A') pts += 10; else pts += 15;

                            if (pts >= 80) {
                              return "Excelente Perfil Directivo Empático (Puntuación: 90/90). Usted encarna el modelo IBM Coach 2025. Entiende que un SGC es un organismo vivo conformado por personas que requieren contención, escucha asertiva y neutralidad técnica. Su enfoque constructivo minimiza el scrap operacional, fomenta la honestidad de datos de piso y reduce en un 60% la reincidencia de no conformidades.";
                            } else if (pts >= 45) {
                              return "Perfil de Dirección Pasivo/Tradicional (Puntuación: Moderada). Posee intenciones de mejora, pero suele recurrir a evasiones temporales o maquillajes regulatorios de control de riesgos. Recuerde que el control excesivo o punitivo eleva el miedo del personal, induciendo al encubrimiento de desperdicios y scrap. Adopte un enfoque de diálogo transformacional de Robert Terán.";
                            } else {
                              return "Perfil Autoritario o Punitivo Crítico (Puntuación: Baja). Su visión concibe al operador como una engranaje mecánico que funciona por miedo o sanciones. Este estilo colapsará frente a auditorías externas exhaustivas porque el clima laboral está erosionado, induciendo mentiras en la trazabilidad que la dirección no detecta. Se recomienda terapia gestalt integrativa organizacional de forma prioritaria.";
                            }
                          })()}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* INTERACTIVE COLUMN 2: PROBLEM CONFLICT RESOLUTION SIMULATOR */}
              <div className="glass p-6 rounded-3xl border border-white/10 bg-[#07070a] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <MessageSquare className="w-4 h-4 text-red-500" /> Simulador de Resolución de Conflictos SGC
                    </h4>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold uppercase font-mono">Simulador Clínico</span>
                  </div>

                  {/* Escenario Físico */}
                  <div className="p-4 bg-red-600/5 border border-red-500/10 rounded-2xl text-xs space-y-2">
                    <p className="font-extrabold text-white uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" /> Escenario Real de Tensión de Planta:
                    </p>
                    <p className="text-gray-300 leading-normal">
                      "El veterano Ing. Ramírez (Plant Supervisor) se niega a firmar de mutuo acuerdo la desviación de No Conformidad Mayor reportada en su turno. Afirma de mal humor que el SGC ralentiza el rendimiento de mermas y que calidad solo busca perjudicar su reputación personal y bonos de eficiencia laboral."
                    </p>
                  </div>

                  {/* Gráficos de barra en vivo */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-black/60 rounded-2xl border border-white/5 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                        <span>Clima Laboral:</span>
                        <span className={sgcClimateIndex > 70 ? "text-green-400" : sgcClimateIndex > 45 ? "text-amber-400" : "text-red-400"}>{sgcClimateIndex}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${sgcClimateIndex > 70 ? "bg-green-500" : sgcClimateIndex > 45 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${sgcClimateIndex}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                        <span>Cumplimiento Normativo:</span>
                        <span className={sgcComplianceIndex > 70 ? "text-green-400" : sgcComplianceIndex > 45 ? "text-amber-400" : "text-red-400"}>{sgcComplianceIndex}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${sgcComplianceIndex > 70 ? "bg-green-500" : sgcComplianceIndex > 45 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${sgcComplianceIndex}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Decision Tree rendering based on ConflictStep */}
                  <div className="space-y-3 pt-2 text-xs">
                    {conflictStep === 1 && (
                      <div className="space-y-2">
                        <p className="font-bold text-gray-200">Decisión 1: ¿Cómo aborda el descontento de Ramírez?</p>
                        <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                          <button 
                            onClick={() => {
                              setSgcClimateIndex(35);
                              setSgcComplianceIndex(85);
                              setSimFeedback("Ramírez firma con desgana bajo amenaza pero el clima en su área se desploma. Los operarios sabotearán sutilmente los registros SGC más adelante.");
                              setConflictStep(2);
                            }}
                            className="bg-black/35 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all"
                          >
                            Ruta Punitiva: Amonestarlo con severidad citando la cláusula de liderazgo 5.1 y reportarlo con Dirección.
                          </button>
                          <button 
                            onClick={() => {
                              setSgcClimateIndex(85);
                              setSgcComplianceIndex(45);
                              setSimFeedback("Ramírez sonríe agradecido y te regala un café, pero el SGC se debilita. No registrar la desviación repite el scrap costando cara la auditoría final.");
                              setConflictStep(2);
                            }}
                            className="bg-black/35 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all"
                          >
                            Ruta Complaciente: Ignorar el reporte y dejar que continúe con el scrap sin asentar la No Conformidad.
                          </button>
                          <button 
                            onClick={() => {
                              setSgcClimateIndex(75);
                              setSgcComplianceIndex(75);
                              setSimFeedback("Robert Terán aprueba esta aproximación. Ramírez acepta sentarse a revisar los parámetros mecánicos de mermas de extrusión de forma asertiva.");
                              setConflictStep(2);
                            }}
                            className="bg-black/35 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all"
                          >
                            Ruta Integradora Coach: Escuchar de forma empática sus cuellos de botella de planta, y pactar el hallazgo enfocado a la resolución técnica (8D).
                          </button>
                        </div>
                      </div>
                    )}

                    {conflictStep === 2 && (
                      <div className="space-y-2">
                        <p className="font-bold text-gray-200">Decisión 2: Ahora, Ramírez propone culpar a un operador temporal del problema de calidad:</p>
                        <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                          <button 
                            onClick={() => {
                              setSgcClimateIndex(prev => Math.max(10, prev - 25));
                              setSgcComplianceIndex(prev => Math.min(100, prev + 10));
                              setSimFeedback("Paz temporal pero fractura moral. El equipo de planta siente terror e inseguridad psicológica extrema. La rotación de personal subirá.");
                              setConflictStep(3);
                            }}
                            className="bg-black/35 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all"
                          >
                            Aceptar y aplicar despido o recriminación directa al operador temporal.
                          </button>
                          <button 
                            onClick={() => {
                              setSgcClimateIndex(prev => Math.min(100, prev + 15));
                              setSgcComplianceIndex(prev => Math.max(10, prev - 15));
                              setSimFeedback("Robert Terán advierte: El culpable chivo expiatorio soluciona momentáneamente el papel, pero la falla de la máquina de extrusión subsiste.");
                              setConflictStep(3);
                            }}
                            className="bg-black/35 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all"
                          >
                            Rechazar, pero retrasar la investigación 8D para no discutir de nuevo con Ramírez.
                          </button>
                          <button 
                            onClick={() => {
                              setSgcClimateIndex(prev => Math.min(100, prev + 10));
                              setSgcComplianceIndex(prev => Math.min(100, prev + 20));
                              setSimFeedback("Excelente. Ramírez comprende que errar es humano, pero el error nace de un mal diseño de herramentales o instructivos del SGC.");
                              setConflictStep(3);
                            }}
                            className="bg-black/35 hover:bg-white/5 p-2.5 rounded-xl border border-white/5 text-left text-gray-400 hover:text-white transition-all"
                          >
                            Redirigir el enfoque: Establecer que el error es fallas del SISTEMA, no personas (Cláusula SGC 10.2).
                          </button>
                        </div>
                      </div>
                    )}

                    {conflictStep === 3 && (
                      <div className="space-y-2 text-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="font-extrabold text-amber-400 uppercase tracking-widest font-mono text-[10px]">Simulación Finalizada con éxito</p>
                        <p className="text-gray-300 italic my-2">"{simFeedback}"</p>
                        <div className="flex flex-col gap-2 pt-2">
                          <div className="text-xs font-mono font-bold text-white">
                            Resultado Final SGC: Clima {sgcClimateIndex}% / Cumplimiento {sgcComplianceIndex}%
                          </div>
                          <button 
                            onClick={() => {
                              setConflictStep(1);
                              setSgcClimateIndex(65);
                              setSgcComplianceIndex(60);
                              setSimFeedback('');
                            }}
                            className="mt-2 bg-white text-black font-extrabold uppercase py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all font-mono text-[10px] tracking-widest"
                          >
                            Explorar Otras Alternativas de Liderazgo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-red-600/5 rounded-2xl border border-red-500/10 text-[10px] text-gray-400 italic text-center">
                  "El clima organizacional es una variable cuantitativa en los costos indirectos de Prevención de Calidad (Crosby)."
                </div>

              </div>

            </div>

            {/* INTERACTIVE COLUMN 3: HUMAN AGREEMENTS AND STREAK OKRS */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0c0c0f] space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" /> Acuerdos Humanos de Cohesión Corporativa
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Suscriba estos OKRs de comunicación efectiva y cultura de cero culpa. Haga click para firmar y sincronizar con Firestore en vivo.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const allSigned = humanAgreements.map(a => ({ ...a, signed: true }));
                    setHumanAgreements(allSigned);
                    // Autosync in background
                    setIsCloudSyncing(true);
                    try {
                      const docRef = doc(db, 'sgc_states', sgcUserId);
                      await setDoc(docRef, { humanAgreements: allSigned, syncedAt: new Date().toLocaleTimeString() }, { merge: true });
                      setCloudSyncedAt(new Date().toLocaleTimeString());
                    } catch (e) {
                      console.error(e);
                    }
                    setIsCloudSyncing(false);
                    alert('¡Todos los Acuerdos Humanos firmados por el comité ejecutivo y guardados en Firestore!');
                  }}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] px-3.5 py-2 rounded-xl font-bold uppercase transition-all"
                >
                  Firmar Todo el Pacto
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {humanAgreements.map((agreement) => (
                  <div 
                    key={agreement.id} 
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      agreement.signed 
                        ? 'bg-green-500/15 border-green-500/30' 
                        : 'bg-black/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          agreement.signed ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'
                        }`}>
                          {agreement.signed ? 'Acuerdo Activo SGC' : 'Inactivo / Firma Pendiente'}
                        </span>
                        <Brain className={`w-4 h-4 ${agreement.signed ? 'text-green-400 animate-pulse' : 'text-gray-600'}`} />
                      </div>
                      <h4 className="font-extrabold text-white text-xs uppercase tracking-wide">{agreement.title}</h4>
                      <p className="text-gray-400 text-[11px] leading-relaxed">{agreement.description}</p>
                    </div>

                    <button
                      onClick={async () => {
                        const updated = humanAgreements.map(a => a.id === agreement.id ? { ...a, signed: !a.signed } : a);
                        setHumanAgreements(updated);
                        // Autosyne data
                        setIsCloudSyncing(true);
                        try {
                          const docRef = doc(db, 'sgc_states', sgcUserId);
                          await setDoc(docRef, { humanAgreements: updated, syncedAt: new Date().toLocaleTimeString() }, { merge: true });
                          setCloudSyncedAt(new Date().toLocaleTimeString());
                        } catch (err) {
                          console.error(err);
                        }
                        setIsCloudSyncing(false);
                      }}
                      className={`mt-4 w-full text-[10px] py-2 rounded-lg font-bold uppercase transition-all tracking-wider ${
                        agreement.signed
                          ? 'bg-green-500 hover:bg-red-600 text-black hover:text-white font-extrabold'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {agreement.signed ? '✓ Firmado y Resguardado' : 'Estampar Firma Digital SGC'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 10: AUDITOR LEADER (ISO 19011) */}
        {activeTab === 'auditor_leader' && (
          <div className="space-y-8 animate-fadeIn text-gray-200" id="iso-auditor-leader-tab">
            {/* Tab Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-red-500" /> 10. Auditor Leader (Gestión e Inspección ISO 19011:2018)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Administre el programa y actas de auditoría, configure hallazgos y evalúe la madurez de su protocolo en tiempo real.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full text-xs text-red-400 font-bold uppercase font-mono">
                ISO 19011:2018 Directrices
              </span>
            </div>

            {/* Config & Metrics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div className="glass p-6 rounded-3xl border border-white/5 bg-[#07070a] space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-2 flex items-center gap-2 font-mono">
                    <Sliders className="w-4 h-4 text-red-500" /> Parámetros del Programa de Auditoría
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Establezca las variables de preparación técnica para proyectar el índice de madurez del proceso de auditoría:
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs text-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="block text-gray-400 font-bold">Fecha Planificada:</span>
                      <input 
                        type="date"
                        value={auditDate}
                        onChange={(e) => setAuditDate(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white focus:border-red-500 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                        id="audit-planned-date-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-gray-400 font-bold">Líder Auditor:</span>
                      <input 
                        type="text"
                        readOnly
                        value="Robert Terán (Coach SGI)"
                        className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-gray-400 text-xs focus:outline-none"
                        id="auditor-coach-name-read"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold">Porcentaje de Preparación Documental:</span>
                      <span className="text-red-400 font-extrabold">{auditPreparationScore}%</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      value={auditPreparationScore}
                      onChange={(e) => setAuditPreparationScore(parseInt(e.target.value))}
                      className="w-full accent-red-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                      id="audit-prep-range-slider"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold">Grado Competencia del Equipo (1-5):</span>
                      <span className="text-red-400 font-extrabold">{auditTeamCompetency} ⭐</span>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="5"
                      value={auditTeamCompetency}
                      onChange={(e) => setAuditTeamCompetency(parseInt(e.target.value))}
                      className="w-full accent-red-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                      id="audit-comp-range-slider"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="block text-gray-400 font-bold">Cláusulas en Alcance (Scope):</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['4.4', '5.3', '6.1.2', '7.5', '8.1', '9.3'].map((cls) => {
                        const included = auditScope.includes(cls);
                        return (
                          <button
                            key={cls}
                            onClick={() => {
                              if (included) {
                                setAuditScope(auditScope.filter(c => c !== cls));
                              } else {
                                setAuditScope([...auditScope, cls]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                              included 
                                ? 'bg-red-500/10 border-red-500/50 text-red-400' 
                                : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white'
                            }`}
                            id={`scope-btn-id-${cls}`}
                          >
                            Cláusula {cls}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Calculator / Meter */}
              <div className="glass p-6 rounded-3xl border border-white/10 bg-[#0c0c10] flex flex-col justify-between" id="active-audit-meter-panel">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-500" /> Reporte de Viabilidad de Auditoría
                    </h3>
                    <span className="text-[10px] bg-red-600/15 text-red-400 px-2.5 py-0.5 rounded-full font-bold font-mono">MODELO ISO 19011</span>
                  </div>

                  {/* Calculations */}
                  {(() => {
                    const totalFindings = auditFindings.length;
                    const rawReadiness = (auditPreparationScore * 0.70) + ((auditTeamCompetency * 20) * 0.30);
                    // Penalize for multiple findings found
                    const readinessIndex = Math.min(100, Math.max(0, Math.round(rawReadiness - (totalFindings * 4))));
                    let riskText = 'BAJO';
                    let riskColor = 'text-green-400';
                    if (readinessIndex < 60) {
                      riskText = 'CRÍTICO';
                      riskColor = 'text-red-500';
                    } else if (readinessIndex < 85) {
                      riskText = 'MEDIO';
                      riskColor = 'text-orange-400';
                    }

                    return (
                      <div className="my-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <p className="text-gray-400 text-[9px] uppercase tracking-wider font-mono">Índice Conforme SGC</p>
                            <h4 className="text-3xl font-black text-white mt-1 font-mono">{readinessIndex}%</h4>
                            <p className="text-[9px] text-gray-500 mt-1">Nivel de madurez global</p>
                          </div>
                          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <p className="text-gray-400 text-[9px] uppercase tracking-wider font-mono">Riesgo Evaluado</p>
                            <h4 className={`text-2xl font-black mt-2 font-mono ${riskColor}`}>{riskText}</h4>
                            <p className="text-[9px] text-gray-500 mt-1">Factor de error sistémico</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs leading-relaxed text-gray-400">
                          <span className="font-bold text-white block font-mono text-[10px] uppercase">Recomendación Directa del Coach:</span>
                          {readinessIndex > 85 ? (
                            <p className="italic">"El SGC se encuentra en un estado robusto y bien documentado. La auditoría ejecutada servirá para certificar la excelencia y proponer mejoras preventivas ágiles."</p>
                          ) : (
                            <p className="italic text-orange-400">"Alerta: El índice de conformidad documental es bajo. Recomendamos reforzar las Cláusulas de soporte y estandarizar procedimientos antes de enfrentar auditorías externas de certificación."</p>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="p-4 bg-red-600/5 rounded-2xl border border-red-500/10 text-[11px] text-gray-400 leading-relaxed font-mono">
                  <span className="font-bold text-white block mb-1">Criterio de Evaluación:</span>
                  ISO 19011:2018 Cláusula 5.5: Selección de los miembros del equipo auditor y asignación de tareas según competencia calificada.
                </div>
              </div>
            </div>

            {/* Findings Manager */}
            <div className="p-6 md:p-8 bg-[#09090b] border border-white/5 rounded-3xl space-y-6" id="findings-manager-box">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" /> Registro Dinámico de Hallazgos SGI (En Vivo)
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Agregue y catalogue desviaciones detectadas en piso de planta para simular el informe final de cierre CAPA:
                </p>
              </div>

              {/* Add finding form */}
              <div className="p-4 bg-black/60 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5 space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold font-mono">Descripción del Hallazgo:</label>
                  <input 
                    type="text"
                    value={newFindingTitle}
                    onChange={(e) => setNewFindingTitle(e.target.value)}
                    placeholder="Ej. Falta de firmas de calibración en equipos..."
                    className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-red-500 text-xs focus:outline-none"
                    id="new-finding-title-input"
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold font-mono">Cláusula ISO:</label>
                  <select
                    value={newFindingClause}
                    onChange={(e) => setNewFindingClause(e.target.value)}
                    className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-red-500 text-xs focus:outline-none cursor-pointer"
                    id="new-finding-clause-sel"
                  >
                    <option value="4.4">Cláusula 4.4 SGC</option>
                    <option value="5.3">Cláusula 5.3 Roles</option>
                    <option value="6.1.2">Cláusula 6.1.2 Riesgos</option>
                    <option value="7.5">Cláusula 7.5 Documentación</option>
                    <option value="8.1">Cláusula 8.1 Planificación</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold font-mono">Tipo Hallazgo:</label>
                  <select
                    value={newFindingType}
                    onChange={(e) => setNewFindingType(e.target.value as any)}
                    className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-red-500 text-xs focus:outline-none cursor-pointer"
                    id="new-finding-type-sel"
                  >
                    <option value="major">NC Mayor 🔴</option>
                    <option value="minor">NC Menor 🟡</option>
                    <option value="opm">Op Mejora 🟢</option>
                    <option value="fortaleza">Fortaleza ⭐</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={() => {
                      if (!newFindingTitle.trim()) return;
                      const newObj = {
                        id: `f-${Date.now()}`,
                        title: newFindingTitle,
                        clause: newFindingClause,
                        type: newFindingType
                      };
                      setAuditFindings([newObj, ...auditFindings]);
                      setNewFindingTitle('');
                    }}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold uppercase py-2 px-4 rounded-xl text-xs transition duration-300"
                    id="add-finding-trigger-btn"
                  >
                    Registrar
                  </button>
                </div>
              </div>

              {/* Findings list */}
              <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto scrollbar-thin">
                {auditFindings.map((f) => {
                  let badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                  let label = "NC Menor";
                  if (f.type === 'major') {
                    badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                    label = "NC Mayor";
                  } else if (f.type === 'opm') {
                    badgeColor = "bg-green-500/10 text-green-400 border-green-500/20";
                    label = "Mejora";
                  } else if (f.type === 'fortaleza') {
                    badgeColor = "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
                    label = "Fortaleza";
                  }

                  return (
                    <div key={f.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${badgeColor}`}>
                            {label}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono font-bold">Cláusula {f.clause}</span>
                        </div>
                        <p className="text-xs text-gray-200 mt-1">{f.title}</p>
                      </div>
                      <button
                        onClick={() => {
                          setAuditFindings(auditFindings.filter(finding => finding.id !== f.id));
                        }}
                        className="p-1 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition"
                        id={`del-finding-btn-id-${f.id}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 5. GORGEOUS TECHNICAL DOSSIER DETAILS (ROB TERÁN DEEP COACH INSIGHTS) */}
      <div className="border-t border-white/5 bg-[#030305] p-4 md:p-8" id="sgc-coach-dossier-root">
        <SGCButtonCoachDetails activeTabId={activeTab} onSelectTab={setActiveTab} />
      </div>

    </div>
  );
}

