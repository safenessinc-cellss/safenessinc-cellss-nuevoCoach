import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Brain, 
  Users, 
  X, 
  ChevronRight, 
  TrendingUp, 
  AlertTriangle, 
  Sliders, 
  RotateCcw, 
  Check, 
  Play,
  Award,
  Zap,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Group,
  Workflow
} from 'lucide-react';

interface CoachingPillarsPanelProps {
  initialPillar: 'decision' | 'psicopedagogia' | 'cohesion';
  onClose: () => void;
}

export default function CoachingPillarsPanel({ initialPillar, onClose }: CoachingPillarsPanelProps) {
  const [activePillar, setActivePillar] = useState<'decision' | 'psicopedagogia' | 'cohesion'>(initialPillar);

  // Pillar 1: Decisiones Críticas States
  const [selectedCrisis, setSelectedCrisis] = useState<string>('retraso_log');
  const [crisisReversibility, setCrisisReversibility] = useState<number>(4);
  const [crisisImpact, setCrisisImpact] = useState<number>(8);
  const [userReflection, setUserReflection] = useState<string>('');
  const [savedReflections, setSavedReflections] = useState<string[]>([]);

  // Pillar 2: Psicopedagogía States
  const [teamCognitiveLoad, setTeamCognitiveLoad] = useState<number>(80);
  const [microsessionDuration, setMicrosessionDuration] = useState<number>(10);
  const [selectedProfile, setSelectedProfile] = useState<string>('operatives');
  const [learningAttemptCompleted, setLearningAttemptCompleted] = useState<boolean>(false);

  // Pillar 3: Cohesión States
  const [conflictTypology, setConflictTypology] = useState<string>('prod_qa');
  const [rivalryScore, setRivalryScore] = useState<number>(65);
  const [detachmentScore, setDetachmentScore] = useState<number>(45);
  const [ambiguityScore, setAmbiguityScore] = useState<number>(55);
  const [appliedRemedy, setAppliedRemedy] = useState<string | null>(null);

  // Crisis Scenarios definitions
  const crises = [
    {
      id: 'retraso_log',
      name: 'Un retraso crítico de materias primas frena la línea automotriz',
      defaultRev: 3,
      defaultImp: 9,
      category: 'Operativa/Proveedores'
    },
    {
      id: 'auditoria_reprobada',
      name: 'Auditoría externa detecta no-conformidad crítica en seguridad de la información',
      defaultRev: 5,
      defaultImp: 8,
      category: 'Normativa / CISA'
    },
    {
      id: 'error_diseno',
      name: 'Software alternativo de ingeniería de software falla ante la integración con el core',
      defaultRev: 7,
      defaultImp: 7,
      category: 'Técnica / Producto'
    },
    {
      id: 'fuga_talento',
      name: 'Renuncia del supervisor líder del área de extrusión a una semana de certificar',
      defaultRev: 4,
      defaultImp: 8,
      category: 'Recursos Humanos'
    }
  ];

  const currentCrisisObj = crises.find(c => c.id === selectedCrisis) || crises[0];

  // Calculations for Decisiones
  const stressScore = Math.round(((crisisImpact * 10) + (110 - crisisReversibility * 10)) / 2);
  let decisionQuadrant = '';
  let decisionRecommendation = '';
  let quadrantColor = 'text-red-400 border-red-500/30 bg-red-500/10';

  if (crisisReversibility <= 4 && crisisImpact >= 7) {
    decisionQuadrant = 'CRÍTICO / IRREVERSIBLE (Acción Directa, Contención Gestalt Obligatoria)';
    decisionRecommendation = 'No firme de inmediato. Aplique la "Cuarentena Psíquica de 2 horas" liderada por Robert Terán. Realice un triage dividiendo el desvío en columnas: lo que controlamos físicamente en planta vs temores directivos intangibles.';
    quadrantColor = 'text-red-400 border-red-500/40 bg-red-500/15';
  } else if (crisisReversibility >= 6 && crisisImpact >= 6) {
    decisionQuadrant = 'TÁCTICO REVERSIBLE (Giro Ágil e Iterativo)';
    decisionRecommendation = 'Establezca una ventana de experimentación controlada de 24 horas. Delegue la contingencia a un subcomité de calidad, aplicando criterios de "Veto Pasa/No-Pasa" para no quemar toda la energía del equipo directivo.';
    quadrantColor = 'text-amber-400 border-amber-500/40 bg-amber-500/15';
  } else if (crisisReversibility <= 5 && crisisImpact <= 5) {
    decisionQuadrant = 'TÉCNICO / EXPERIMENTAL (Acción Corta y Test A/B)';
    decisionRecommendation = 'Trátelo como un hito de aprendizaje técnico. Documente el scrap previsto bajo la norma del manual SIG, asuma la pérdida como un costo menor de experimentación y continúe sin culpar personal.';
    quadrantColor = 'text-blue-400 border-blue-500/40 bg-blue-500/15';
  } else {
    decisionQuadrant = 'OPERATIVO MENOR (Delegable y Estandarizable en Manual SGC)';
    decisionRecommendation = 'Automatice la respuesta y documéntela como una acción preventiva dentro de la Cláusula 6.1. Evite involucrar a gerentes; el supervisor en piso de planta puede gestionarlo usando los lineamientos vigentes.';
    quadrantColor = 'text-green-400 border-green-500/40 bg-green-500/15';
  }

  // Calculations for learning curve
  const learningRetention = Math.round(
    Math.max(15, Math.min(98, 95 - (teamCognitiveLoad * 0.45) + (microsessionDuration <= 15 ? (15 - microsessionDuration) * 1.5 : (microsessionDuration - 15) * -1.8)))
  );

  let learningFeedback = '';
  let learningBarColor = 'bg-green-500';
  if (teamCognitiveLoad > 75) {
    learningFeedback = '⚠️ COGNITIVE COLD BURN: Su equipo se encuentra sufriendo saturación técnica. Los operarios están en piloto automático. El 80% de lo que les enseñe hoy se olvidará en 24 horas y cometerán fallas en el llenado de bitácoras del SGC.';
    learningBarColor = 'bg-red-500';
  } else if (microsessionDuration > 25) {
    learningFeedback = '⚠️ FATIGA METODOLÓGICA: Sesiones que exceden los 25 minutos sin pausas de autorregulación provocan desconexión y aburrimiento. Divida las capacitaciones en módulos de 10-15 minutos (Psicopedagogía Robert Terán).';
    learningBarColor = 'bg-amber-500';
  } else {
    learningFeedback = '✅ RETENCIÓN ÓPTIMA: Los bloques dinámicos cortos en un ambiente libre de hostigamiento directivo aumentan el compromiso un 200%. El personal se apropia de la norma de forma didáctica.';
    learningBarColor = 'bg-green-500';
  }

  // Calculations for Team Cohesion
  const alignmentIndex = Math.round(
    Math.max(10, 100 - (rivalryScore * 0.4 + detachmentScore * 0.3 + ambiguityScore * 0.3))
  );

  let siloRiskClass = 'text-green-400';
  let siloRiskText = 'BAJO';
  if (alignmentIndex < 50) {
    siloRiskClass = 'text-red-500 text-lg font-extrabold animate-pulse';
    siloRiskText = 'EXTREMO (Silos destructivos en operaciones)';
  } else if (alignmentIndex < 75) {
    siloRiskClass = 'text-amber-400';
    siloRiskText = 'ALTO (Falta de comunicación asertiva)';
  }

  const handleApplyCrisisScenario = (id: string) => {
    setSelectedCrisis(id);
    const selected = crises.find(c => c.id === id);
    if (selected) {
      setCrisisReversibility(selected.defaultRev);
      setCrisisImpact(selected.defaultImp);
    }
  };

  const saveReflection = () => {
    if (!userReflection.trim()) return;
    setSavedReflections(prev => [userReflection, ...prev]);
    setUserReflection('');
    alert('¡Su compromiso y veredicto estratégico ha sido registrado en la bitácora de resiliencia del equipo directivo!');
  };

  return (
    <div id="coaching-deep-panel" className="mt-12 bg-black/60 border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden backdrop-blur-xl animate-fadeIn">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-red-600/5 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-blue-600/5 blur-3xl rounded-full" />

      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-black flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 animate-spin text-red-500" />
            Especialidad de Acompañamiento Corporativo
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">El Factor Humano Detrás de las Normas</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Descubra cómo el método del <strong>Ing. Economista Robert Terán</strong> combina la rigurosidad técnica de sistemas ISO con psicología organizacional avanzada y psicopedagogía.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer shrink-0"
          title="Cerrar Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tab Selectors inside Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {[
          { id: 'decision', title: '🎯 Decisiones Críticas', subtitle: 'Simulador de Triage y Riesgos de Planta' },
          { id: 'psicopedagogia', title: '🧠 Psicopedagogía Empresarial', subtitle: 'Núcleo de Carga Mental y Aprendizaje' },
          { id: 'cohesion', title: '🤝 Cohesión de Equipos', subtitle: 'Sala de Control de Silos y OKRs de Confianza' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePillar(tab.id as any)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
              activePillar === tab.id
                ? 'bg-[#100c14] border-red-500/60 text-white shadow-lg shadow-red-500/10 font-bold'
                : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
            }`}
          >
            {activePillar === tab.id && (
              <div className="absolute top-0 right-0 w-2 h-full bg-red-600" />
            )}
            <h4 className="text-sm font-black uppercase tracking-wider">{tab.title}</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-tight font-mono">{tab.subtitle}</p>
          </button>
        ))}
      </div>

      {/* RENDER ACTIVE PILLAR INTERACTIVE DASHBOARD */}
      <AnimatePresence mode="wait">
        {activePillar === 'decision' && (
          <motion.div
            key="decision-pillar"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Conceptual description & Visual generated assets */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-5 bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-blue-500/20 rounded-2xl">
                  <h4 className="text-sm font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    ¿Qué es el Triage de Decisiones Críticas?
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Ante un shock imprevisto en planta, el equipo directivo entra frecuentemente en un estado de <strong>"secuestro de amígdala"</strong> (pánico, culpabilidad o parálisis). 
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed mt-2 font-light">
                    Robert Terán introduce una metodología científica de descompresión cognitiva que clasifica las crisis en base a dos coordenadas empíricas directas: <strong>reversibilidad comercial</strong> e <strong>impacto en el negocio</strong>.
                  </p>
                </div>

                {/* Display Custom Generated Image Asset */}
                <div className="rounded-2xl border border-white/5 overflow-hidden shadow-inner group relative">
                  <img 
                    src="/src/assets/images/decisiones_criticas_1781286997596.jpg" 
                    alt="Esquema de Decisiones Críticas" 
                    className="w-full h-auto object-cover opacity-85 group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-4">
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded uppercase font-black">
                        Asset de Visualización
                      </span>
                      <p className="text-[11px] text-white font-medium mt-1">Mentalidad Asertiva ante la Incertidumbre Laboral</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Interactive Tool */}
              <div className="lg:col-span-7 bg-[#0b0a0f] border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-red-500" />
                    Simulador Maestra de Contingencias & Triage de Robert Terán
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Seleccione un escenario común de falla de planta, calibre los niveles reales de reversibilidad e impacto, y reciba el diagnóstico directivo en tiempo real:
                  </p>
                </div>

                {/* Scenario choices */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block">
                    Escenario de Conflicto en Planta:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {crises.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleApplyCrisisScenario(c.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition duration-200 ${
                          selectedCrisis === c.id
                            ? 'bg-red-500/10 border-red-500/40 text-white font-semibold'
                            : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        <span className="text-[9px] text-red-400 block uppercase font-mono mb-0.5">{c.category}</span>
                        <p className="truncate text-[11px]">{c.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Double Interactive Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Reversibilidad */}
                  <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-gray-300">Reversibilidad:</span>
                      <span className="font-bold text-amber-400 font-mono text-[13px]">{crisisReversibility} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={crisisReversibility}
                      onChange={(e) => setCrisisReversibility(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                      <span>Imposible revertir (1)</span>
                      <span>Muy fácil (10)</span>
                    </div>
                  </div>

                  {/* Impacto */}
                  <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-[#ffffff05]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-gray-300">Impacto en SGC / Finanzas:</span>
                      <span className="font-bold text-red-400 font-mono text-[13px]">{crisisImpact} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={crisisImpact}
                      onChange={(e) => setCrisisImpact(parseInt(e.target.value))}
                      className="w-full accent-red-600 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                      <span>Mínimo (1)</span>
                      <span>Severo / Fatal (10)</span>
                    </div>
                  </div>
                </div>

                {/* LIVE DIAGNOSTICS DISPLAY BOX */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Clasificación de Triage</span>
                    <span className="text-[10px] font-mono font-bold text-red-400">ESTADO INDUCIDO</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Stress Level */}
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase font-mono">Índice Estimado de Estrés Directivo:</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xl font-mono font-black text-white">{stressScore}%</span>
                        <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-350 ${
                              stressScore > 75 ? 'bg-red-500' : stressScore > 50 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${stressScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Veredicto de Zona */}
                    <div className={`p-3 rounded-xl border ${quadrantColor} flex flex-col justify-center`}>
                      <span className="text-[9px] font-mono font-bold uppercase block">Zona Estratégica:</span>
                      <span className="text-[11px] font-extrabold leading-tight">{decisionQuadrant}</span>
                    </div>
                  </div>

                  {/* Recommendation block with Robert Terán Quote alignment */}
                  <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/20 text-[11px] text-gray-300">
                    <strong className="text-red-400 uppercase font-mono tracking-wider block mb-1">
                      Directriz de Mentoría de Robert Terán:
                    </strong>
                    "{decisionRecommendation}"
                  </div>
                </div>

                {/* Socratic Reflection Input */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block">
                    Veredicto y Acción Directiva Consensuada:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userReflection}
                      onChange={(e) => setUserReflection(e.target.value)}
                      placeholder="Escriba aquí la decisión tomada, ej: 'Aplicar cuarentena y delegar rediseño de tolva'..."
                      className="flex-1 bg-black/40 border border-white/10 p-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 font-sans"
                    />
                    <button
                      onClick={saveReflection}
                      className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold px-4 py-2.5 rounded-xl uppercase text-[10px] tracking-wider transition-colors shrink-0"
                    >
                      Asentar Decisión
                    </button>
                  </div>

                  {savedReflections.length > 0 && (
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 max-h-[100px] overflow-y-auto space-y-1 text-[10px]">
                      <span className="text-gray-500 block font-mono border-b border-white/5 pb-1">Compromisos Registrados en Bitácora Humana:</span>
                      {savedReflections.map((ref, idx) => (
                        <p key={idx} className="text-green-400 leading-tight">
                          • {ref}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* INTERACTIVE FLOWCHART / MAP OF COGNITIVE DECISIONS */}
            <div className="bg-[#08070c] border border-white/5 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Workflow className="w-4 h-4 text-amber-500" />
                Mapa de Flujo Coherente: El Algoritmo Gestalt ante el Conflicto Laboral
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Visualice el itinerario empático que el facilitador Robert Terán establece para neutralizar el orgullo y centrar al comité técnico:
              </p>

              {/* Steps grid representing elegant connections */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-2 text-[11px] font-mono">
                {[
                  { step: '1. Shock / Desvío', desc: 'Identificar la perturbación en planta, deteniendo la búsqueda inmediata de culpables.', glow: 'border-red-500/20 bg-red-500/5 text-red-400' },
                  { step: '2. Filtro de Datos', desc: 'Separar los datos financieros exactos de las especulaciones provocadas por el miedo.', glow: 'border-amber-500/20 bg-amber-500/5 text-amber-400' },
                  { step: '3. Test de Retorno', desc: 'Evaluar el índice de reversibilidad técnica y el grado de impacto ético.', glow: 'border-blue-500/20 bg-blue-500/5 text-blue-400' },
                  { step: '4. Diálogo de Plantilla', desc: 'Liderar la asertividad y escuchar las objeciones del operador en piso.', glow: 'border-teal-500/20 bg-teal-500/5 text-teal-400' },
                  { step: '5. Acta Directiva 9.3', desc: 'Asentar la acción correctiva mitigadora en el manual real de calidad.', glow: 'border-green-500/20 bg-green-500/5 text-green-400' }
                ].map((s, idx) => (
                  <div key={idx} className={`p-3.5 border rounded-xl flex flex-col justify-between hover:scale-102 transition duration-300 space-y-2 ${s.glow}`}>
                    <div className="font-extrabold uppercase text-[10px] tracking-wider">{s.step}</div>
                    <p className="text-[10px] text-gray-300 font-sans leading-snug">{s.desc}</p>
                    {idx < 4 && (
                      <span className="text-gray-600 block self-end font-extrabold text-xs">➔</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PILLAR 2: PSICOPEDAGOGÍA EMPRESARIAL */}
        {activePillar === 'psicopedagogia' && (
          <motion.div
            key="psicopedagogia-pillar"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Descriptions and Custom Image Assets */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-5 bg-gradient-to-br from-amber-900/10 to-teal-900/10 border border-amber-500/20 rounded-2xl">
                  <h4 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Brain className="w-4 h-4 text-amber-400" />
                    ¿Qué es la Psicopedagogía Empresarial?
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Las normas de calidad imponen reglamentaciones densas. Sin embargo, los operarios no se comprometen leyendo memorándums de 80 páginas o manuales mecánicos aburridos. Esto genera desmotivación y no-conformidades.
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed mt-2 font-light">
                    Robert Terán aplica una <strong>pedagogía del adulto (andragogía)</strong> basada en matrices cognitivas vivas y micro-sesiones dinámicas que respetan la tolerancia mental del trabajador y disuelven los sesgos de auto-desaprobación.
                  </p>
                </div>

                {/* Display Custom Generated Image Asset */}
                <div className="rounded-2xl border border-white/5 overflow-hidden shadow-inner group relative">
                  <img 
                    src="/src/assets/images/psicopedagogia_empresarial_1781287012205.jpg" 
                    alt="Esquema de Psicopedagogía Empresarial" 
                    className="w-full h-auto object-cover opacity-85 group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-4">
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded uppercase font-black">
                        Asset de Visualización
                      </span>
                      <p className="text-[11px] text-white font-medium mt-1">Estimulación Neuro-Cognitiva Adaptativa</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Tool */}
              <div className="lg:col-span-7 bg-[#0b0a0f] border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    Diseñador y Monitor de Retención Cognitiva y Curva de Aprendizaje
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Determine el estado neuro-emocional actual de su cuadrilla técnica y module la duración de las micro-sesiones pedagógicas de planta para predecir el coeficiente de retención del SGC:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Team Profile Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block">
                      Perfil Psicosocial del Equipo:
                    </label>
                    <select
                      value={selectedProfile}
                      onChange={(e) => {
                        setSelectedProfile(e.target.value);
                        setLearningAttemptCompleted(false);
                      }}
                      className="w-full bg-[#16141a] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="operatives">Operarios de Planta (Fatigados y con mermas de atención)</option>
                      <option value="silo_specialists">Ingenieros e Hiper-especialistas (Aislados en sus departamentos)</option>
                      <option value="directors">Directivos/Gerentes (Con alto nivel de cortisol y fatiga de decisión)</option>
                      <option value="trainees">Nuevos Ingresos (Con deseo de aprender pero abrumados de inducción)</option>
                    </select>
                  </div>

                  {/* Micro-session Duration Control */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block flex justify-between">
                      <span>Duración de la Micro-Sesión:</span>
                      <span className="text-amber-400 font-bold">{microsessionDuration} minutos/día</span>
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="45"
                      value={microsessionDuration}
                      onChange={(e) => {
                        setMicrosessionDuration(parseInt(e.target.value));
                        setLearningAttemptCompleted(false);
                      }}
                      className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer mt-2"
                    />
                    <div className="flex justify-between text-[8px] text-gray-500 font-mono">
                      <span>Rápido (3 min)</span>
                      <span>Extenso (45 min)</span>
                    </div>
                  </div>
                </div>

                {/* Cognitive Load Tracker */}
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-gray-300">Carga Cognitiva Interna (Nivel de Estrés / Burnout):</span>
                    <span className="font-bold text-red-400 font-mono text-[13px]">{teamCognitiveLoad}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={teamCognitiveLoad}
                    onChange={(e) => {
                      setTeamCognitiveLoad(parseInt(e.target.value));
                      setLearningAttemptCompleted(false);
                    }}
                    className="w-full accent-red-600 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                    <span>Mente Fresca (10%)</span>
                    <span>Saturación Extrema (100%)</span>
                  </div>
                </div>

                {/* LIVE BRAIN CALCULATOR */}
                <div className="p-5 rounded-2xl bg-[#09080d] border border-white/5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[10px] font-mono text-gray-400">
                    <span>Viga de Retención Psicopedagógica</span>
                    <span>PREDICCIÓN DEL CEREBRO EN PLANTA</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Retention Rate Meter */}
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-mono">Retención a los 30 días:</p>
                        <p className="text-3xl font-mono font-black text-white mt-1">{learningRetention}%</p>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-3">
                        <div 
                          className={`h-full transition-all duration-350 ${learningBarColor}`}
                          style={{ width: `${learningRetention}%` }}
                        />
                      </div>
                    </div>

                    {/* Adaptive Solution recommendation */}
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-xs text-gray-300">
                      <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block mb-1">Ruta de Adaptación Robert Terán:</span>
                      {selectedProfile === 'operatives' && 'Recomienda: "Pisos Activos" de 8 min con maquetas de mermas reales en vez de diapositivas estáticas. Use analogías de vida cotidiana.'}
                      {selectedProfile === 'silo_specialists' && 'Recomienda: Dinámicas transversales de "Sillas Rotativas SGI" donde un programador audita un proceso manual y viceversa.'}
                      {selectedProfile === 'directors' && 'Recomienda: "Mindfulness de Calidad Mínimo" de 5 min previa a firmas para neutralizar el pánico por la fecha de entrega.'}
                      {selectedProfile === 'trainees' && 'Recomienda: Inducción gamificada con bitácoras ficticias absurdas para encontrar errores antes de operar los sistemas reales.'}
                    </div>
                  </div>

                  {/* Feedback Text Area */}
                  <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5 text-[11px] text-gray-300 leading-relaxed italic">
                    {learningFeedback}
                  </div>
                </div>

                {/* Socratic quiz trigger */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setLearningAttemptCompleted(true);
                      alert('¡Entrenamiento adaptativo recalculado! Ha diseñado un microclima de aprendizaje enfocado y de bajo estrés para su equipo.');
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-black font-semibold font-mono text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" /> Desplegar Ruta de Aprendizaje Adaptativo
                  </button>
                </div>
              </div>
            </div>

            {/* FLOWCHART OF LEARNING LOOP */}
            <div className="bg-[#08070c] border border-white/5 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-black text-gray-305 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Workflow className="w-4 h-4 text-teal-400" />
                Mapa Mental: El Bucle Neuro-Pedagógico de la Norma ISO (Andragogía Robert Terán)
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Cómo asimila el cerebro de un técnico un indicador reglamentario sin generar aburrimiento o resistencia psíquica:
              </p>

              {/* Connected Flow Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-[11px] font-mono text-gray-300">
                {[
                  { step: '1. Clima de No-Reprimenda', desc: 'El error técnico en la simulación se trata como un insumo valioso de aprendizaje, desactivando el miedo defensivo.' },
                  { step: '2. Fragmentación (Micro)', desc: 'Se segmenta el manual denso en píldoras dinámicas de 10 minutos enfocadas en un solo indicador real.' },
                  { step: '3. Anclaje Operativo', desc: 'El trabajador manipula el scrap en el piso de planta para ligar el dato abstracto con una acción física.' },
                  { step: '4. OKRs Emocionales', desc: 'Se celebra el logro del equipo sin presiones comerciales inmediatas, reforzando la identidad grupal.' }
                ].map((ph, i) => (
                  <div key={i} className="p-4 bg-[#0a0a0f] border border-white/5 rounded-xl hover:border-teal-500/10 transition-colors flex flex-col justify-between space-y-2">
                    <span className="text-[10px] font-bold text-teal-400 block border-b border-white/5 pb-1 uppercase">{ph.step}</span>
                    <p className="text-[10px] text-gray-400 font-sans leading-normal">{ph.desc}</p>
                    {i < 3 && (
                      <span className="text-gray-700 font-black block text-right mt-2">➔</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PILLAR 3: COHESIÓN DE EQUIPOS */}
        {activePillar === 'cohesion' && (
          <motion.div
            key="cohesion-pillar"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Description & Image Illustration */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-5 bg-gradient-to-br from-red-900/10 to-amber-900/10 border border-red-500/20 rounded-2xl">
                  <h4 className="text-sm font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Users className="w-4 h-4 text-red-500" />
                    ¿Qué es la Cohesión Sistémica de Equipos?
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Un sistema de gestión es tan fuerte como el eslabón más frágil de su comunicación interdepartamental. Los "silos" organizativos (guerra fría entre Producción y Aseguramiento de Calidad, rivalidades o amarguras) destruyen la trazabilidad real.
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed mt-2 font-light">
                    Robert Terán actúa como un unificador estratégico. No recurre a dinámicas superficiales de "juegos de confianza", sino que alinea OKRs interconectados, resuelve fricciones de raíz y asienta <strong>"Acuerdos Directivos de Confianza Operativa"</strong> que comprometen al personal con el éxito mutuo.
                  </p>
                </div>

                {/* Display Custom Generated Image Asset */}
                <div className="rounded-2xl border border-white/5 overflow-hidden shadow-inner group relative">
                  <img 
                    src="/src/assets/images/cohesion_equipos_1781287026738.jpg" 
                    alt="Esquema de Cohesión de Equipos" 
                    className="w-full h-auto object-cover opacity-85 group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-4">
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-red-500 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded uppercase font-black">
                        Asset de Visualización
                      </span>
                      <p className="text-[11px] text-white font-medium mt-1">Convergencia Interdepartamental del Capital Humano</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interaction panel */}
              <div className="lg:col-span-7 bg-[#0b0a0f] border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-red-500" />
                    Analizador de Fricción de Silos e Intervención de Robert Terán
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Calibre los factores que están debilitando la confianza interna de su equipo actual para recibir un diagnóstico del Coeficiente de Alineación Sistémica:
                  </p>
                </div>

                {/* Typology Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block">
                    Tipología del Conflicto Actual de la Empresa:
                  </label>
                  <select
                    value={conflictTypology}
                    onChange={(e) => {
                      setConflictTypology(e.target.value);
                      setAppliedRemedy(null);
                    }}
                    className="w-full bg-[#16141a] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="prod_qa">Producción VS SGC/Calidad (Disputas constantes por mermas y aprobaciones de scrap)</option>
                    <option value="sales_admin">Área Comercial VS Área Técnica (Fechas de entrega imposibles, promesas falsas al cliente)</option>
                    <option value="middle_m">Mandos Medios VS Alta Dirección (Falta de asertividad, temores directivos y desalineación)</option>
                    <option value="hybrid_s">Personal Remoto VS Personal Presencial (Silos informales, celos de autonomía y pérdida de OKRs)</option>
                  </select>
                </div>

                {/* 3 Range Parameters */}
                <div className="space-y-4">
                  {/* Rivalry score slider */}
                  <div className="space-y-1.5 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono text-gray-300">Rivalidad Interdepartamental / Silos:</span>
                      <span className="font-bold text-red-400 font-mono">{rivalryScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={rivalryScore}
                      onChange={(e) => {
                        setRivalryScore(parseInt(e.target.value));
                        setAppliedRemedy(null);
                      }}
                      className="w-full accent-red-600 h-1.5 bg-white/10 rounded-lg cursor-pointer mt-1"
                    />
                  </div>

                  {/* Detachment slider */}
                  <div className="space-y-1.5 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono text-gray-300">Aislamiento Operativo / Distanciamiento:</span>
                      <span className="font-bold text-amber-400 font-mono">{detachmentScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={detachmentScore}
                      onChange={(e) => {
                        setDetachmentScore(parseInt(e.target.value));
                        setAppliedRemedy(null);
                      }}
                      className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer mt-1"
                    />
                  </div>

                  {/* Ambiguity Slider */}
                  <div className="space-y-1.5 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono text-gray-300">Ambigüedad de Roles / Vacío Directivo:</span>
                      <span className="font-bold text-blue-400 font-mono">{ambiguityScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={ambiguityScore}
                      onChange={(e) => {
                        setAmbiguityScore(parseInt(e.target.value));
                        setAppliedRemedy(null);
                      }}
                      className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg cursor-pointer mt-1"
                    />
                  </div>
                </div>

                {/* CALCULATIONS READOUTS */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[10px] font-mono text-gray-400">
                    <span>Métrica de Convergencia Sistémica</span>
                    <span>SALA DE SINERGÍA ACTIVA</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sinergy Coeff */}
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <p className="text-[9px] text-gray-400 uppercase font-mono">Coeficiente de Alineación:</p>
                      <p className="text-3xl font-mono font-black text-white mt-1">{alignmentIndex}%</p>
                      <span className="text-[9px] text-gray-500 block font-mono mt-1">Meta recomendada SGC &gt; 80%</span>
                    </div>

                    {/* Silo Risk status */}
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                      <p className="text-[9px] text-gray-400 uppercase font-mono">Severidad de Silos:</p>
                      <span className={siloRiskClass}>{siloRiskText}</span>
                    </div>
                  </div>

                  {/* Remedio description based on active selection */}
                  {appliedRemedy ? (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/25 text-[11px] text-green-300 leading-relaxed font-medium">
                      <strong className="block uppercase font-mono mb-1 text-[10px] text-green-400">
                        ✓ ACUERDO LIGADO - MÉTODO ROBERT TERÁN DESPLEGADO:
                      </strong>
                      "{appliedRemedy}"
                    </div>
                  ) : (
                    <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/25 text-[11px] text-gray-300 flex justify-between items-center gap-4">
                      <span>La fricción interdepartamental está reduciendo el rendimiento un <strong>{100 - alignmentIndex}%</strong>. ¿Desea aplicar el Protocolo de Sinergía Robert Terán?</span>
                      <button
                        onClick={() => {
                          if (conflictTypology === 'prod_qa') {
                            setAppliedRemedy('Establecer el taller semanal de OKRs Compartidos de 15 minutos: El equipo de Producción asume la métrica de Cero No-Conformidades SGI, y Calidad asume la métrica de Flujo Continuo del cuello de botella, eliminando el veto punitivo tardío.');
                          } else if (conflictTypology === 'sales_admin') {
                            setAppliedRemedy('Fundar el Acuerdo Pasa/No-Pasa Integral: El equipo directivo comercial asume la obligatoriedad de auditoría de viabilidad de entrega por el Director de Operaciones previa a la firma del contrato con clientes de alta demanda.');
                          } else if (conflictTypology === 'middle_m') {
                            setAppliedRemedy('Implementar el canal de Veto Estructural Anónimo: Brindar a los líderes intermedios la facultad de detener temporalmente iniciativas de alto impacto psicoprofesional sin temor a reprimendas corporativas.');
                          } else {
                            setAppliedRemedy('Lanzar los Foros de Trazabilidad Cruzada: Parejas cruzadas interdepartamentales de supervisores exponen el flujo del otro sector una vez al mes, empatizando con el desvío operativo ajeno.');
                          }
                        }}
                        className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-[9px] px-3.5 py-1.5 rounded uppercase tracking-wider shrink-0 transition-all hover:scale-105"
                      >
                        Aplicar Sinergía
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FLOWCHART OF COHESION ROADMAP */}
            <div className="bg-[#08070c] border border-white/5 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Workflow className="w-4 h-4 text-red-500" />
                Matriz de Integración Sistémica: De Silos a Unión Constructiva
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                El mapa de transición estructural que Robert Terán impulsa para consolidar un equipo autónomo de alta velocidad:
              </p>

              {/*Connected Flow Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-2 text-[11px] font-mono text-gray-300 text-center">
                {[
                  { name: '1. Desactivación de Enconos', desc: 'Robert actúa como moderador Gestalt neutral para exponer resentimientos lógicos de planta.' },
                  { name: '2. Enlace de Indicadores', desc: 'Bincular los bonos de calidad y de producción en una sola bolsa de OKR corporativo.' },
                  { name: '3. Mesas de Diálogo Colectivo', desc: 'Taller de 15 minutos semanales para debatir mermas antes de la reunión de resultados.' },
                  { name: '4. Pruebas Cruzadas de Piso', desc: 'El supervisor de calidad opera 1 hora el equipo de extrusión para empatizar con el ruido.' },
                  { name: '5. Unión Consolidada SGC', desc: 'Madurez del sistema donde los mandos medios deciden con asertividad y orgullo de pertenencia.' }
                ].map((s, idx) => (
                  <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-xl hover:border-red-500/20 transition-all flex flex-col justify-between space-y-1.5">
                    <span className="text-[10px] font-bold text-red-400 uppercase block">{s.name}</span>
                    <p className="text-[9.5px] text-gray-400 font-sans leading-relaxed">{s.desc}</p>
                    {idx < 4 && (
                      <span className="text-red-500 font-extrabold text-xs block mt-2">➔</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Signoff from therapist/coach */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400 bg-white/[0.01] p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
          <span>
            Facilitación e Intervenciones diseñadas por <strong>Robert Terán</strong>, SGI v5.0.
          </span>
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-gray-500">
          <span>[TERAPEUTA CERTIFICADO]</span>
          <span>[INGENIERO E ECONOMISTA]</span>
        </div>
      </div>
    </div>
  );
}
