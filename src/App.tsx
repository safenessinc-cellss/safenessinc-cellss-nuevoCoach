import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Users, Globe, Linkedin, Mail, Award, Network, Workflow, FileCheck, Activity, CheckCircle2, Menu, X, Brain, BarChart3, ShieldAlert, LineChart, Rocket, ClipboardCheck, Briefcase, Map, Quote, ArrowRight, Image as ImageIcon, Layers, Play, Sliders, RotateCcw, Terminal, Check, HelpCircle, CheckSquare, TrendingUp, AlertTriangle, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import dataES from './data/es.json';
import dataEN from './data/en.json';
import dataPT from './data/pt.json';
import dataIT from './data/it.json';
import ChatWidget from './components/ChatWidget';
import ISOImage from './components/ISOImage';
import UserProfileModal from './components/UserProfileModal';
import { useProfileSettings } from './data/useProfileSettings';
import CoachingPillarsPanel from './components/CoachingPillarsPanel';
import CurriculumShowcaseModal from './components/CurriculumShowcaseModal';

const iconMap: Record<string, any> = {
  ShieldCheck, Network, Workflow, Brain, BarChart3, ShieldAlert, LineChart, Rocket, Award, ClipboardCheck, Map
};

const allData = {
  es: dataES,
  en: dataEN,
  pt: dataPT,
  it: dataIT
};

const corporateBackgrounds = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920', // Modern Office
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1920', // Team Meeting
  'https://images.unsplash.com/photo-1416949929422-a1d9c2014dcf?auto=format&fit=crop&q=80&w=1920', // Abstract Connections / Architecture
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1920' // Business Planning
];

const skillDetails: Record<string, { rating: string; info: Record<string, string>; systemLog: string }> = {
  "ISO Gestión de Calidad": {
    rating: "98% Calidad",
    info: {
      es: "Configuración, estructuración y auditoría líder de sistemas bajo el marco ISO 9001. Enfoque en control de desvíos, auditorías internas integrales y mejora continua de la cadena operacional.",
      en: "Configuration, structuring, and leading system audits under ISO 9001. Focus on variance control, comprehensive internal audits, and continuous improvement.",
      pt: "Configuração, estruturação e auditoria líder de sistemas sob o padrão ISO 9001. Foco no controle de desvios, auditorias internas completas e melhoria contínua.",
      it: "Configurazione, strutturazione e conduzione di audit di sistema sotto lo standard ISO 9001. Focus sul controllo delle varianze, audit interni completi e miglioramento continuo."
    },
    systemLog: "SYS_ISO_ACTIVE // 0_NON_CONFORMITIES"
  },
  "Estructuras de Empresas": {
    rating: "95% Estructura",
    info: {
      es: "Reorganización de organigramas corporativos y jerarquías ágiles. Mapeo profundo de perfiles profesionales para maximizar el índice de rendimiento grupal.",
      en: "Reorganization of corporate organigrams and agile hierarchies. In-depth profiling of professional roles to maximize group performance index.",
      pt: "Reorganização de organogramas corporativos e hierarquias ágeis. Mapeamento profundo de perfis profissionais para maximizar o índice de desempenho do grupo.",
      it: "Riorganizzazione degli organigrammi aziendali e delle gerarchie agili. Profilazione approfondita dei ruoli professionali per massimizzare l'indice del rendimento operativo."
    },
    systemLog: "ROLES_SYNCED // HR_INDEX: 1.0"
  },
  "Mapeo de Procesos": {
    rating: "97% BPMN Diagram",
    info: {
      es: "Levantamientos de flujos operativos As-Is y diseño de estados futuros To-Be. Metodología de modelado con estándar formal BPMN para documentar el ADN corporativo.",
      en: "As-Is operational workflows gathering and design of future To-Be state. Modeling methodology with formal BPMN standard to document corporate DNA.",
      pt: "Mapeamento de fluxos operacionais As-Is e design de estados futuros To-Be. Metodologia de modelagem com padrão formal BPMN para documentar o DNA corporativo.",
      it: "Rilevamento dei flussi operativi As-Is e progettazione dello stato futuro To-Be. Metodologia di modellazione con standard BPMN formale per documentare il DNA aziendale."
    },
    systemLog: "MAPPING_OK // FLOW_STABLE"
  },
  "Análisis Crítico": {
    rating: "100% Diagnóstico",
    info: {
      es: "Diagnósticos rigurosos basados en datos reales. Capacidad de discernimiento estratégico bajo presión para identificar cuellos de botella con precisión quirúrgica.",
      en: "Rigorous diagnostics based on real data. Strategic discernment capacity under pressure to identify bottleneck indicators with surgical precision.",
      pt: "Diagnósticos rigorosos com base em dados reais. Capacidade de discernimento estratégico sob pressão para identificar gargalos operacionais com precisão cirúrgica.",
      it: "Diagnostica rigorosa basata su dati reali. Capacità di discernimento strategico sotto pressione per identificare colli di bottiglia operativi con precisione chirurgica."
    },
    systemLog: "CRITICAL_PATH_LOADED // NO_LAG"
  },
  "Análisis de Gestión": {
    rating: "94% KPI Analytics",
    info: {
      es: "Construcción de cuadros de mando integrados con métricas de desempeño claves (KPIs) y alineación con objetivos estratégicos corporativos (OKRs).",
      en: "Construction of dashboards integrated with key performance indicators (KPIs) and aligned with corporate strategic objectives (OKRs).",
      pt: "Construção de painéis integrados com indicadores de desempenho (KPIs) e alinhados com objetivos estratégicos corporativos (OKRs).",
      it: "Costruzione di quadri di comando integrati con indicatori chiave di prestazione (KPI) e allineati con gli obiettivi strategici aziendali (OKR)."
    },
    systemLog: "DASHBOARD_LIVE // SYNC_99_8"
  },
  "Análisis de Riesgo": {
    rating: "96% Mitigación",
    info: {
      es: "Análisis proactivo de vulnerabilidades mediante matrices de riesgo AMFE. Cumplimiento robusto con la sección 6.1 (Acciones para abordar riesgos y oportunidades).",
      en: "Proactive vulnerability analysis through FMEA risk matrices. Robust compliance with section 6.1 (Actions to address risks and opportunities).",
      pt: "Análise proativa de vulnerabilidades por meio de matrizes de risco FMEA. Conformidade robusta com a cláusula 6.1 (Ações para abordar riscos e oportunidades).",
      it: "Analisi proattiva delle vulnerabilità tramite matrici di rischio FMEA. Robustezza conforme alla sezione 6.1 (Azioni per affrontare rischi e opportunità)."
    },
    systemLog: "MITIGATION_STATE_OK // SAFETY_MAX"
  },
  "Análisis de Mercado": {
    rating: "92% Retail SR",
    info: {
      es: "Estudio profundo de tendencias de consumo masivo, modelos de comercialización en retail internacional, comportamiento de competidores y elasticidad comercial.",
      en: "In-depth study of mass consumer trends, international retail commercialization models, competitor behavior, and pricing elasticity.",
      pt: "Estudo aprofundado das tendências de consumo de massa, modelos de comercialização no varejo internacional, comportamento dos concorrentes e elasticidade.",
      it: "Studio approfondito delle tendenze dei consumi di massa, modelli di commercializzazione nel retail internazionale, comportamento dei concorrenti ed elasticità energetica."
    },
    systemLog: "RETAIL_INDEX_LOADED // SR_EXEC"
  },
  "Emprendimiento & Startup": {
    rating: "93% Growth",
    info: {
      es: "Formación financiera y de negocio para la escala rápida de nuevas startups o spin-offs corporativas. Enfoque metodológico Lean Startup y rentabilidad directa.",
      en: "Financial and business training for rapid scaling of startups or corporate spin-offs. Lean Startup methodological approach and direct profitability.",
      pt: "Treinamento financeiro e de negócios para escala rápida de startups ou spin-offs corporativas. Abordagem metodológica Lean Startup e lucratividade direta.",
      it: "Formazione finanziaria e aziendale per la scalata rapida di startup o spin-off aziendali. Approccio metodologico Lean Startup e redditività diretta."
    },
    systemLog: "STARTUP_OK // SCALE_READY"
  },
  "IBM 2025 Coach": {
    rating: "100% Coach IBM",
    info: {
      es: "Metodología avanzada de potenciamiento humano, coaching ejecutivo directo e inteligencia emocional organizacional certificada por el programa líder con IBM.",
      en: "Advanced methodology for human empowerment, direct executive coaching, and organizational emotional intelligence certified by the leading program with IBM.",
      pt: "Metodologia avançada para o empoderamento humano, coaching executivo direto e inteligência emocional organizacional certificada pelo programa líder com a IBM.",
      it: "Metodologia avanzata per il potenziamento umano, coaching esecutivo diretto e intelligenza emotiva aziendale certificata dal programma leader con IBM."
    },
    systemLog: "COACHING_ENGINE_ONLINE // LIFE_SYNC"
  },
  "Auditor Leader": {
    rating: "99% IRCA Leader",
    info: {
      es: "Registro y facultad internacional acreditada IRCA para la dirección de auditorías multicriterio de tercera parte en corporaciones globales.",
      en: "IRCA international registration and authority to direct multi-criteria third-party audits in global corporations.",
      pt: "Registro internacional IRCA e autoridade para dirigir auditorias multicritério de terceira parte em corporações globais.",
      it: "Registrazione internazionale IRCA e autorità per dirigere audit di terza parte multi-criterio in società globali."
    },
    systemLog: "IRCA_VERIFIED // LEAD_TOKEN: SUCCESS"
  }
};

const badgeToTabMap: Record<string, string> = {
  "ISO Gestión de Calidad": "gestionycalidad",
  "Estructuras de Empresas": "estructuras",
  "Mapeo de Procesos": "mapeo",
  "Análisis Crítico": "auditorias",
  "Análisis de Gestión": "direccion",
  "Análisis de Riesgo": "problemas",
  "Análisis de Mercado": "costos",
  "Emprendimiento & Startup": "dashboard",
  "IBM 2025 Coach": "liderazgo",
  "Auditor Leader": "auditorias"
};

const clientPhotos: Record<string, string> = {
  "Carlos Mendoza": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256",
  "Ana Silva": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
  "Roberto Gómez": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256"
};

export default function App() {
  const { t, i18n } = useTranslation();
  const data = allData[i18n.language as keyof typeof allData] || dataES;
  const { profile, loading: profileLoading } = useProfileSettings();

  const [bgImage, setBgImage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isCertificationsModalOpen, setIsCertificationsModalOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<any>(null);
  const [selectedIllustration, setSelectedIllustration] = useState<{ title: string; image: string; description: string; items: string[] } | null>(null);
  
  // Estado para demostrar la renderización dinámica
  const [showDemoImage, setShowDemoImage] = useState(false);

  // Futuristic State extensions
  const [scrollY, setScrollY] = useState(0);
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);
  const [activeCareerIdx, setActiveCareerIdx] = useState(0);

  // Interactive SGC Simulator (Clause 4.4)
  const [sgcSimulatorMode, setSgcSimulatorMode] = useState<'diagram' | 'interactive'>('interactive');
  const [sgcInput, setSgcInput] = useState<string>('requisitos_tecnicos');
  const [sgcComplexity, setSgcComplexity] = useState<string>('media');
  const [sgcControlMode, setSgcControlMode] = useState<string>('fmea');
  const [sgcsimulating, setSgcsimulating] = useState<boolean>(false);
  const [sgcSimResult, setSgcSimResult] = useState<any>(null);
  const [sgcLogs, setSgcLogs] = useState<string[]>([]);

  // Advanced Interactive Certification Modal State
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // Audit Checklist (Auditor Líder)
  const [auditChecklist, setAuditChecklist] = useState<Record<string, boolean>>({
    '4.4': true,
    '5.3': false,
    '6.1': false,
    '8.1': false,
    '9.3': false,
    '10.2': false,
  });
  // Risk assessment variables (CRMA)
  const [riskProbability, setRiskProbability] = useState<number>(3);
  const [riskImpact, setRiskImpact] = useState<number>(3);
  // Cost of Quality (CPA)
  const [coqPrev, setCoqPrev] = useState<number>(3000);
  const [coqAppr, setCoqAppr] = useState<number>(4500);
  const [coqIntFail, setCoqIntFail] = useState<number>(12000);
  const [coqExtFail, setCoqExtFail] = useState<number>(8000);
  // Leadership dynamic (IBM Coach)
  const [leadershipStyle, setLeadershipStyle] = useState<string>('coaching');
  // Security levels (CISA)
  const [cisaBackups, setCisaBackups] = useState<boolean>(true);
  const [cisaAuditLogs, setCisaAuditLogs] = useState<boolean>(false);
  const [cisaSecControls, setCisaSecControls] = useState<boolean>(true);
  // Audit focus (CIA)
  const [ciaFocusDept, setCiaFocusDept] = useState<string>('operaciones');

  // Interactive Specialties Modal State
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // New States for "Más Allá de la Certificación" Coaching & Psicopedagogía Pillars
  const [selectedCoachingPillar, setSelectedCoachingPillar] = useState<'decision' | 'psicopedagogia' | 'cohesion' | null>(null);

  // States inside specialty interactive widgets
  const [angerLevel, setAngerLevel] = useState<number>(5);
  const [breathStage, setBreathStage] = useState<'Inhala' | 'Retén' | 'Exhala' | 'Pausa'>('Pausa');

  // Orientación laboral states
  const [laborAfinidad, setLaborAfinidad] = useState<number>(50);
  const [laborBlandas, setLaborBlandas] = useState<number>(50);
  const [laborMejora, setLaborMejora] = useState<number>(50);

  // Impulsividad states
  const [impulseActive, setImpulseActive] = useState<boolean>(false);
  const [impulseSuccess, setImpulseSuccess] = useState<boolean>(false);
  const [impulseTime, setImpulseTime] = useState<number>(5);

  // Afrontamiento states
  const [copingScenario, setCopingScenario] = useState<string>('hallazgo');

  // Problemas emocionales states
  const [emotionalQuadrant, setEmotionalQuadrant] = useState<string | null>(null);

  // Life coaching states
  const [lifeCareer, setLifeCareer] = useState<number>(60);
  const [lifeHealth, setLifeHealth] = useState<number>(50);
  const [lifeRel, setLifeRel] = useState<number>(40);
  const [lifeGrowth, setLifeGrowth] = useState<number>(70);

  // Problemas relacionales states
  const [relationConflict, setRelationConflict] = useState<string>('prod_cal');
  const [relationStyleChosen, setRelationStyleChosen] = useState<string | null>(null);

  // Rendimiento deportivo states
  const [sportSkill, setSportSkill] = useState<number>(50);
  const [sportChallenge, setSportChallenge] = useState<number>(50);

  // Estrés states
  const [stressQ1, setStressQ1] = useState<boolean>(false);
  const [stressQ2, setStressQ2] = useState<boolean>(false);
  const [stressQ3, setStressQ3] = useState<boolean>(false);
  const [stressQ4, setStressQ4] = useState<boolean>(false);

  // Recursos humanos states
  const [hrRole, setHrRole] = useState<string>('auditor');
  const [hrLevel, setHrLevel] = useState<number>(2);

  // Side-effect to scale down impulse timer countdown
  useEffect(() => {
    let timer: any;
    if (impulseActive && impulseTime > 0) {
      timer = setTimeout(() => {
        setImpulseTime(prev => prev - 1);
      }, 1000);
    } else if (impulseActive && impulseTime === 0) {
      setImpulseSuccess(true);
      setImpulseActive(false);
    }
    return () => clearTimeout(timer);
  }, [impulseActive, impulseTime]);

  // Guided visual breathing stage loop for "Gestión de la ira"
  useEffect(() => {
    let timer: any;
    if (selectedSpecialty === 'Gestión de la ira') {
      timer = setInterval(() => {
        setBreathStage(prev => {
          if (prev === 'Pausa') return 'Inhala';
          if (prev === 'Inhala') return 'Retén';
          if (prev === 'Retén') return 'Exhala';
          return 'Pausa';
        });
      }, 4000);
    } else {
      setBreathStage('Pausa');
    }
    return () => clearInterval(timer);
  }, [selectedSpecialty]);

  const runSgcSimulation = () => {
    setSgcsimulating(true);
    setSgcLogs([]);
    const logs: string[] = [];

    logs.push("📂 [SYS] ACCEDIENDO PROTOCOLO CLÁUSULA 4.4 // SGC ACTIVADO");
    
    let inputLabel = "";
    if (sgcInput === 'requisitos_tecnicos') inputLabel = "Especificaciones Técnicas / Planos";
    else if (sgcInput === 'parametros_legales') inputLabel = "Normativas de Bienestar / Regulaciones Legales";
    else inputLabel = "SLAs Críticos de Clientes de Alta Exigencia";

    logs.push(`📥 [INPUT ENTRADA] Cargando requisitos: "${inputLabel}"`);
    logs.push(`⚙️ [COMPLEJIDAD] Definiendo complejidad del sistema: [${sgcComplexity.toUpperCase()}]`);

    let ctrlLabel = "";
    if (sgcControlMode === 'muestreo') ctrlLabel = "Muestreo Táctico Simple";
    else if (sgcControlMode === 'fmea') ctrlLabel = "Calibración con Matriz de Riesgo FMEA Activa";
    else ctrlLabel = "Inspección 100% al Puesto de Trabajo";

    logs.push(`🔍 [CONTROL] Aplicando estrategia: "${ctrlLabel}"`);

    setTimeout(() => {
      let conformance = 0;
      let coqSaving = 0;
      let title = "";
      let feedback = "";
      let status = "COMPLIANT";

      if (sgcControlMode === 'fmea') {
        conformance = sgcComplexity === 'baja' ? 99.8 : (sgcComplexity === 'media' ? 98.6 : 97.4);
        coqSaving = sgcComplexity === 'baja' ? 45000 : (sgcComplexity === 'media' ? 32000 : 18000);
        title = "Gobernanza Predictiva SGC (ISO 9001:2015)";
        feedback = "MODELO DE EXCELENCIA (Robert Terán Aprueba): El engranaje de la Cláusula 4.4 funciona de manera alineada. Al calibrar la Matriz de Riesgo FMEA, se previenen los reprocesos redundantes y se mitigan desvíos críticos de forma oportuna. Reducción inmediata de fallas y mermas en piso.";
        logs.push("📈 [PHVA - PLAN] Estructura de riesgos cargada según ISO 31000.");
        logs.push("👷 [PHVA - DO] Ejecución controlada en puesto de trabajo.");
        logs.push("📊 [PHVA - CHECK] Métricas de mermas e indicadores en rango óptimo.");
        logs.push("🏁 [PHVA - ACT] Estándar preventivo consolidado.");
      } else if (sgcControlMode === '100%_control') {
        conformance = sgcComplexity === 'baja' ? 100 : (sgcComplexity === 'media' ? 99.3 : 98.2);
        coqSaving = sgcComplexity === 'baja' ? 15000 : (sgcComplexity === 'media' ? 9000 : 3000);
        title = "Control Operativo Exhaustivo (Cuello de Botella)";
        feedback = "CONTROL EXHAUSTIVO PERO COSTOSO: Monitorear el 100% de las piezas en piso asegura que no salgan productos defectuosos al cliente, pero genera un costo de evaluación (Appraisal Cost) sumamente elevado que estresa la línea. El método Robert Terán recomienda control FMEA para liberar tiempo del personal.";
        logs.push("⚡ [PHVA - DO] Filtro técnico activo. Inspección absoluta.");
        logs.push("⚠️ [PHVA - CHECK] Costos de evaluación exceden límites de madurez.");
      } else { // muestreo
        conformance = sgcComplexity === 'baja' ? 91.5 : (sgcComplexity === 'media' ? 82.3 : 69.8);
        coqSaving = -18000;
        title = "Rendimiento Reactivo Vulnerable";
        feedback = "RIESGO DE NO-CONFORMIDAD CRÍTICO: Realizar muestreos esporádicos en sistemas con complejidad media-alta es altamente peligroso. Robert Terán advierte que la falta de rigor en la Cláusula 4.4 disparará el scrap, fletes de devolución, y generará hallazgos mayores de auditoría.";
        status = "CRITICAL_ALERT";
        logs.push("❌ [ALERTA] Desviación sustancial detectada durante el muestreo.");
        logs.push("❌ [NON-CONFORMITY] Cláusula 4.4.1 de ISO 9001 no satisfecha.");
      }

      logs.push(`✅ [OUTPUT] Tasa de Calidad: ${conformance}%`);
      logs.push(`💰 [FINANZAS] Retorno sobre Costo de Calidad (COQ): $${coqSaving >= 0 ? `+${coqSaving} USD` : `${coqSaving} USD`}`);
      logs.push("💻 [SYS] REGISTROS Y LOGS DE AUDITORÍA CONSOLIDADOS CON ÉXITO.");
      
      setSgcSimResult({
        conformance,
        coqSaving,
        title,
        feedback,
        status
      });
      setSgcLogs(logs);
      setSgcsimulating(false);
    }, 1000);
  };

  useEffect(() => {
    runSgcSimulation();
  }, [sgcInput, sgcComplexity, sgcControlMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Selección aleatoria del fondo corporativo al cargar
    const randomIndex = Math.floor(Math.random() * corporateBackgrounds.length);
    setBgImage(corporateBackgrounds[randomIndex]);

    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    closeMenu();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen text-gray-200 font-sans selection:bg-[#00F0FF]/30">
      
      {/* GLOBAL CORPORATE BACKGROUND */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${bgImage})`, opacity: bgImage ? 1 : 0 }}
      />
      {/* OVERLAY SEMITRANSPARENTE PARA LEGIBILIDAD (Backdrop blur + Oscurecimiento dinámico por scroll) */}
      <div 
        className="fixed inset-0 z-0 bg-[#03050C] transition-all duration-300 pointer-events-none"
        style={{
          backdropFilter: `blur(${Math.max(1, 14 - (scrollY / 35))}px)`,
          backgroundColor: `rgba(3, 5, 12, ${Math.max(0.42, 0.88 - (scrollY / 1000))})`
        }}
      ></div>

      {/* APP CONTENT - z-10 ensures it sits above the background */}
      <div className="relative z-10 flex flex-col">
        {/* SKELETON LOADER OVERLAY */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-8"
            >
            <div className="w-full max-w-4xl space-y-8">
              {/* Header Skeleton */}
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-white/5 rounded-lg animate-pulse"></div>
                <div className="hidden md:flex gap-4">
                  {[1, 2, 3, 4, 5].map(i => <div key={`skel-hdr-${i}`} className="w-20 h-4 bg-white/5 rounded animate-pulse"></div>)}
                </div>
              </div>
              {/* Hero Skeleton */}
              <div className="flex flex-col items-center text-center space-y-6 pt-20">
                <div className="w-32 h-6 bg-white/5 rounded-full animate-pulse"></div>
                <div className="w-3/4 h-16 md:h-24 bg-white/5 rounded-2xl animate-pulse"></div>
                <div className="w-1/2 h-6 bg-white/5 rounded animate-pulse"></div>
                <div className="flex gap-4 pt-8">
                  <div className="w-40 h-12 bg-white/5 rounded-full animate-pulse"></div>
                  <div className="w-40 h-12 bg-white/5 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAV ULTRA-MINIMALISTA */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] max-w-4xl">
        <div className="glass rounded-full px-4 md:px-6 py-3 flex justify-between items-center border border-white/10">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsProfileModalOpen(true)}>
            <div className="w-9 h-9 rounded-full border-2 border-red-600 overflow-hidden bg-white/5 group-hover:scale-110 transition-transform">
               <img 
                 src={profile.photoUrl || undefined} 
                 alt={profile.name}
                 className="w-full h-full object-cover"
               />
            </div>
            <span className="font-semibold tracking-tighter hidden sm:block uppercase">
              {profile.name}
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 text-xs font-medium uppercase tracking-widest text-gray-400 items-center">
            <button onClick={() => setIsProfileModalOpen(true)} className={`transition ${isProfileModalOpen ? 'text-red-500' : 'hover:text-red-500'}`}>{t('nav.perfil')}</button>
            <button onClick={() => setIsCurriculumModalOpen(true)} className="text-amber-400 font-bold hover:text-amber-300 transition flex items-center gap-1">
              <GraduationCap className="w-4 h-4" /> Currículo & Certificados
            </button>
            <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className={`transition ${activeSection === 'services' ? 'text-red-500' : 'hover:text-red-500'}`}>{t('nav.servicios')}</a>
            <a href="#procesos" onClick={(e) => handleNavClick(e, 'procesos')} className={`transition ${activeSection === 'procesos' ? 'text-red-500' : 'hover:text-red-500'}`}>{t('nav.procesos')}</a>
            <a href="#certifications" onClick={(e) => handleNavClick(e, 'certifications')} className={`transition ${activeSection === 'certifications' ? 'text-red-500' : 'hover:text-red-500'}`}>{t('nav.certificaciones')}</a>
            
            <div className="flex gap-1 text-sm font-semibold ml-2 border-l border-white/20 pl-4">
              <button onClick={() => changeLanguage('es')} className={`px-2 py-1 rounded-md transition ${i18n.language === 'es' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>ES</button>
              <button onClick={() => changeLanguage('en')} className={`px-2 py-1 rounded-md transition ${i18n.language === 'en' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>EN</button>
              <button onClick={() => changeLanguage('pt')} className={`px-2 py-1 rounded-md transition ${i18n.language === 'pt' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>PT</button>
              <button onClick={() => changeLanguage('it')} className={`px-2 py-1 rounded-md transition ${i18n.language === 'it' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>IT</button>
            </div>

            <Link to="/agendar" className="bg-white text-black px-4 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition text-center ml-2">
              {t('nav.contacto')}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 w-full mt-4 glass rounded-3xl border border-white/10 p-4 flex flex-col gap-2 shadow-2xl md:hidden overflow-hidden"
            >
              <button 
                onClick={() => { setIsProfileModalOpen(true); closeMenu(); }} 
                className={`text-left text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition ${isProfileModalOpen ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                {t('nav.perfil')}
              </button>
              <button 
                onClick={() => { setIsCurriculumModalOpen(true); closeMenu(); }} 
                className="text-left text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition text-amber-400 hover:bg-amber-500/10 flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Currículo & Certificados Escala</span>
              </button>
              <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className={`text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition ${activeSection === 'services' ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>{t('nav.servicios')}</a>
              <a href="#procesos" onClick={(e) => handleNavClick(e, 'procesos')} className={`text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition ${activeSection === 'procesos' ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>{t('nav.procesos')}</a>
              <a href="#certifications" onClick={(e) => handleNavClick(e, 'certifications')} className={`text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition ${activeSection === 'certifications' ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>{t('nav.certificaciones')}</a>
              
              <div className="flex gap-2 justify-center py-3 border-t border-white/10 mt-2">
                <button onClick={() => { changeLanguage('es'); closeMenu(); }} className={`px-3 py-1 rounded-md text-sm font-semibold transition ${i18n.language === 'es' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>ES</button>
                <button onClick={() => { changeLanguage('en'); closeMenu(); }} className={`px-3 py-1 rounded-md text-sm font-semibold transition ${i18n.language === 'en' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>EN</button>
                <button onClick={() => { changeLanguage('pt'); closeMenu(); }} className={`px-3 py-1 rounded-md text-sm font-semibold transition ${i18n.language === 'pt' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>PT</button>
                <button onClick={() => { changeLanguage('it'); closeMenu(); }} className={`px-3 py-1 rounded-md text-sm font-semibold transition ${i18n.language === 'it' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>IT</button>
              </div>

              <div className="h-px w-full bg-white/10 my-2"></div>
              <Link to="/normas" onClick={closeMenu} className="text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition text-blue-400 hover:bg-white/5">Visualizador ISO</Link>
              <Link to="/agendar" onClick={closeMenu} className="bg-red-600 text-white px-4 py-4 rounded-xl hover:bg-red-700 transition text-center font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                {t('footer.agendar')}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION: IMPACTO VISUAL */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
        {/* Luces de fondo holográficas */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00F0FF]/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#FF007A]/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div 
          className="container mx-auto max-w-6xl relative z-10 transition-all duration-100 ease-out"
          style={{
            opacity: Math.max(0, 1 - scrollY / 480),
            transform: `translateY(${scrollY * 0.18}px)`,
            willChange: 'transform, opacity'
          }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono font-bold mb-6 tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              {t('hero.badge')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-none mb-8 text-white">
              {t('hero.title')} <br /> 
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#FF007A] bg-clip-text text-transparent font-extrabold pb-2">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-sans font-light leading-relaxed">
              {t('hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* PERFIL Y TRAYECTORIA */}
      <section id="about" className="py-24 relative z-10 bg-black/40 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Profile Image - Left Side (Column Span 5) */}
            <div className="lg:col-span-5 relative group">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 relative">
                  <img 
                    src={profile.photoUrl || undefined} 
                    alt={profile.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Floating Badge on Image */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-2xl border border-white/10 backdrop-blur-md">
                    <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-1">{profile.coachTitle}</p>
                    <p className="text-white font-bold text-lg">{profile.name}</p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-red-600/30 rounded-tl-3xl -z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-red-600/30 rounded-br-3xl -z-10"></div>
              </motion.div>
            </div>

            {/* Bio & Info - Right Side (Column Span 7) */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
                  {t('about.badge')}
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                  Más de <span className="text-red-600">{profile.experienceYears} años</span> de Excelencia
                </h2>
                <div className="w-20 h-1 bg-red-600 mb-8"></div>
                
                <p className="text-gray-300 text-lg font-light leading-relaxed mb-8">
                  {profile.bio}
                </p>
                
                {/* Specific Highlight */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 relative overflow-hidden group">
                  <Quote className="absolute -top-2 -right-2 w-24 h-24 text-white/5 group-hover:text-red-500/10 transition-colors" />
                  <p className="text-gray-400 italic text-lg relative z-10 leading-relaxed">
                    "{profile.quote}"
                  </p>
                </div>

                {/* Painel de Comando Digital de Habilidades (Status Console) */}
                <h4 className="text-xs uppercase tracking-widest font-mono text-[#00F0FF] mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-ping"></span>
                  <span>[CONSOLE DE STATUS DE SISTEMAS // ROBERT_TERAN.EXE]</span>
                </h4>

                {/* Badges Grid */}
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {(data?.about?.badges || []).map((badge, idx) => {
                    const Icon = iconMap[badge.icon] || CheckCircle2;
                    const isActive = activeSkillIdx === idx;
                    const isFuchsiaSkill = ["Estructuras de Empresas", "IBM 2025 Coach", "Coach Estratégico"].includes(badge.label);
                    
                    return (
                      <button 
                        key={`badge-${badge.label || idx}-${idx}`} 
                        onClick={() => setActiveSkillIdx(idx)}
                        onMouseEnter={() => setActiveSkillIdx(idx)}
                        className={`flex items-center gap-2.5 border rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 transform cursor-pointer ${
                          isActive 
                            ? isFuchsiaSkill
                              ? 'border-[#FF007A] bg-[#FF007A]/15 text-white scale-105 shadow-[0_0_15px_rgba(255,0,122,0.35)]'
                              : 'border-[#00F0FF] bg-[#00F0FF]/15 text-white scale-105 shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                            : 'bg-[#090D1A]/55 border-[#00F0FF]/10 text-gray-400 hover:border-[#00F0FF]/30 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? (isFuchsiaSkill ? 'text-[#FF007A]' : 'text-[#00F0FF]') : 'text-gray-400'}`} />
                        <span>{badge.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Active Skill Dynamic Console */}
                {(() => {
                  const activeBadge = data.about.badges[activeSkillIdx];
                  if (!activeBadge) return null;
                  const detail = skillDetails[activeBadge.label] || { 
                    rating: "95% Óptimo", 
                    info: { es: "Excelente capacidad analítica y resolución sistémica." },
                    systemLog: "GENERIC_PERFORMANCE_LOADER // 2026_INDEX" 
                  };
                  const currentLang = i18n.language || "es";
                  const resolvedInfo = detail.info[currentLang] || detail.info["es"] || Object.values(detail.info)[0];
                  const isFuchsiaSkill = ["Estructuras de Empresas", "IBM 2025 Coach", "Coach Estratégico"].includes(activeBadge.label);

                  return (
                    <motion.div 
                      key={`active-skill-${activeSkillIdx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`font-mono text-xs p-6 rounded-2xl border bg-[#050814]/80 backdrop-blur-md relative overflow-hidden mb-10 ${
                        isFuchsiaSkill ? 'border-[#FF007A]/25' : 'border-[#00F0FF]/25'
                      }`}
                    >
                      {/* Scanline decoration inside console */}
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/25 to-transparent"></div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3 mb-3 border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isFuchsiaSkill ? 'bg-[#FF007A]' : 'bg-[#00F0FF]'}`}></span>
                          <span className="text-white font-bold text-sm tracking-tight">{activeBadge.label}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          isFuchsiaSkill ? 'bg-[#FF007A]/15 text-[#FF007A]' : 'bg-[#00F0FF]/15 text-[#00F0FF]'
                        }`}>
                          {detail.rating}
                        </span>
                      </div>

                      <p className="text-gray-300 font-sans text-sm leading-relaxed mb-4">
                        {resolvedInfo}
                      </p>

                      <div className="mb-4">
                        <Link 
                          to={`/normas?tab=${badgeToTabMap[activeBadge.label] || 'gestionycalidad'}`} 
                          className={`inline-flex items-center gap-2 text-xs border rounded-xl px-4 py-2 transition duration-300 font-bold font-sans ${
                            isFuchsiaSkill 
                              ? 'text-[#FF007A] hover:text-white bg-[#FF007A]/10 border-[#FF007A]/30 hover:bg-[#FF007A]/20' 
                              : 'text-[#00F0FF] hover:text-white bg-[#00F0FF]/10 border-[#00F0FF]/30 hover:bg-[#00F0FF]/25'
                          }`}
                        >
                          <span>[Visualizar Programa e Normas Interactivas // {activeBadge.label.toUpperCase()}]</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-[#64748B] pt-1">
                        <span>SYSTEM STATUS: COMPLIANT</span>
                        <span className="animate-pulse">{detail.systemLog}</span>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Call to Action or Signature */}
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={`cli-avatar-${i}`} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
                        <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="Client" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Confiado por líderes globales en manufactura y servicios.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAYECTORIA PROFESIONAL CON PULSO DE OPERACIONES */}
      <section className="py-24 bg-[#050814]/45 relative z-10 border-t border-white/5 overflow-hidden">
        {/* Grid holográfica interactiva */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#FF007A]/30 bg-[#FF007A]/10 text-[#FF007A] text-xs font-mono font-bold mb-4 tracking-[0.2em] uppercase">
                {t('about.career_badge') || 'HISTORIAL INTEGRAL'}
              </span>
              <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
                Trayectoria Profesional <br />
                <span className="text-gray-400 text-xl md:text-3xl font-light">Sincronización de Impacto Corporativo</span>
              </h2>
            </div>
            
            <div className="font-mono text-xs text-[#00F0FF] bg-[#00F0FF]/5 border border-[#00F0FF]/15 px-4 py-2.5 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
              <span>PULSO_OPERATIVO: ACTIVO</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Eras Timeline Selector */}
            <div className="lg:col-span-6 space-y-4">
              {(data?.about?.career || []).map((block, idx) => {
                const isActive = activeCareerIdx === idx;
                const isFuchsia = idx === 0;
                
                return (
                  <div 
                    key={`career-block-${block.area || idx}-${idx}`}
                    onClick={() => setActiveCareerIdx(idx)}
                    onMouseEnter={() => setActiveCareerIdx(idx)}
                    className={`futuristic-card p-8 rounded-3xl cursor-pointer transition-all duration-300 relative ${
                      isActive 
                        ? isFuchsia 
                          ? 'border-[#FF007A]/35 shadow-[0_0_20px_rgba(255,0,122,0.1)] bg-[#090D1A]/75' 
                          : 'border-[#00F0FF]/35 shadow-[0_0_20px_rgba(0,240,255,0.1)] bg-[#090D1A]/75'
                        : 'bg-[#090D1A]/40 border-white/5 opacity-70 hover:opacity-100 hover:border-white/10'
                    }`}
                  >
                    {/* Active Scan line effect */}
                    {isActive && (
                      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${
                        isFuchsia ? 'via-[#FF007A]' : 'via-[#00F0FF]'
                      } to-transparent opacity-85`}></div>
                    )}

                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isActive 
                            ? isFuchsia ? 'bg-[#FF007A]/15 text-[#FF007A]' : 'bg-[#00F0FF]/15 text-[#00F0FF]'
                            : 'bg-white/5 text-gray-400'
                        }`}>
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{block.area}</h3>
                      </div>
                      
                      <span className={`font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-md border ${
                        isActive
                          ? isFuchsia ? 'border-[#FF007A]/20 text-[#FF007A] bg-[#FF007A]/5' : 'border-[#00F0FF]/20 text-[#00F0FF] bg-[#00F0FF]/5'
                          : 'border-white/5 text-gray-500 bg-white/[0.02]'
                      }`}>
                        {idx === 0 ? '// EXECUTIVE_SR' : '// ENG_PROCESS'}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {block.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(block?.roles || []).map((role, i) => (
                        <span 
                          key={`career-role-${block.area || 'area'}-${i}-${role}`} 
                          className={`text-[10px] font-mono font-semibold tracking-wider px-3 py-1.5 rounded-lg border ${
                            isActive
                              ? isFuchsia
                                ? 'text-[#FF007A]/90 bg-[#FF007A]/5 border-[#FF007A]/15'
                                : 'text-[#00F0FF]/90 bg-[#00F0FF]/5 border-[#00F0FF]/15'
                              : 'text-gray-400 bg-white/[0.02] border-white/5'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dashboard monitor display */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`active-career-${activeCareerIdx}`}
                  initial={{ opacity: 0, scale: 0.98, x: 15 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`glass p-8 rounded-3xl border h-full flex flex-col justify-between relative overflow-hidden ${
                    activeCareerIdx === 0 
                      ? 'border-[#FF007A]/20 shadow-[inset_0_0_15px_rgba(255,0,122,0.03)] focus-within:border-[#FF007A]/40' 
                      : 'border-[#00F0FF]/20 shadow-[inset_0_0_15px_rgba(0,240,255,0.03)] focus-within:border-[#00F0FF]/40'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-30 pointer-events-none"></div>

                  <div>
                    {/* Monitor core settings */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-8">
                      <div className="flex items-center gap-2.5 font-mono">
                        <span className={`w-2 h-2 rounded-full ${activeCareerIdx === 0 ? 'bg-[#FF007A]' : 'bg-[#00F0FF]'} animate-pulse`}></span>
                        <span className="text-xs text-white uppercase tracking-widest font-black">
                          {activeCareerIdx === 0 ? 'COCKPIT_MURAL_RETAIL' : 'SGC_MONITOR_FLOW'}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-[#64748B] uppercase select-none">
                        ADDR: {activeCareerIdx === 0 ? '0x7F4E98D' : '0x3A2B9C4'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-8 tracking-tight font-display text-left">
                      {activeCareerIdx === 0 
                        ? 'Auditoría Canal & Resultados Corporativos' 
                        : 'Métricas de Excelencia Operacional Bajo PHVA'}
                    </h3>

                    {/* Numerical indices */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {activeCareerIdx === 0 ? (
                        <>
                          <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Eficiencia Comercial</p>
                            <p className="text-3xl font-black text-[#FF007A] font-mono leading-none">98.6%</p>
                            <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                              <div className="bg-[#FF007A] h-full" style={{ width: '98.6%' }}></div>
                            </div>
                          </div>
                          
                          <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-1">Capacitación Líderes</p>
                            <p className="text-3xl font-black text-white font-mono leading-none">+500</p>
                            <span className="text-[9px] text-gray-500 font-mono mt-1 block">EQUIPOS ALINEADOS</span>
                          </div>

                          <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Impacto de Canales</p>
                            <p className="text-3xl font-black text-white font-mono leading-none">45+</p>
                            <span className="text-[9px] text-gray-500 font-mono mt-1 block">ZONAS DE RETAIL</span>
                          </div>

                          <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Retención / Fidelización</p>
                            <p className="text-3xl font-black text-[#FF007A] font-mono leading-none">94.2%</p>
                            <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                              <div className="bg-[#FF007A] h-full" style={{ width: '94.2%' }}></div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Cumplimiento ISO 9001</p>
                            <p className="text-3xl font-black text-[#00F0FF] font-mono leading-none">100%</p>
                            <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                              <div className="bg-[#00F0FF] h-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                          
                          <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Reducción Cuellos Botella</p>
                            <p className="text-3xl font-black text-white font-mono leading-none">-24%</p>
                            <span className="text-[9px] text-gray-500 font-mono mt-1 block">AHORRO DE TIEMPO</span>
                          </div>

                          <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Auditorías Dirigidas</p>
                            <p className="text-3xl font-black text-[#00F0FF] font-mono leading-none">+200</p>
                            <span className="text-[9px] text-gray-500 font-mono mt-1 block">CERTIFICACIONES SGC</span>
                          </div>

                          <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Desperdicio Mínimo</p>
                            <p className="text-3xl font-black text-white font-mono leading-none">0.2%</p>
                            <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                              <div className="bg-[#00F0FF] h-full" style={{ width: '10%' }}></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Feed terminal feedback */}
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-[11px] text-emerald-400 flex flex-col gap-1.5 mt-auto text-left">
                    <div className="flex gap-2">
                      <span className="text-gray-600">// SYSTEM FEED:</span>
                      <span className="animate-pulse text-gray-300">INTEGRITY_INDEX STABLE [OK]</span>
                    </div>
                    <div className="text-gray-400">
                      &gt; {activeCareerIdx === 0 
                        ? 'Aligning retail teams with global commercial strategy' 
                        : 'Mapping operational checkpoints clause 4.4... 100% compliant'}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 relative z-10 bg-[#03050C] border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono font-bold mb-6 tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              {t('services.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-none">
              {t('services.title')} <br />
              <span className="text-gray-500 font-light text-2xl md:text-3xl">Líneas de Operación Estratégica</span>
            </h2>
          </div>

          {/* BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
            
            {/* Card 1: ISO Expert (Col: 2, Row: 2) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 md:row-span-2 glass rounded-3xl p-8 bento-card futuristic-card flex flex-col justify-end relative overflow-hidden group cursor-pointer border-[#FF007A]/15 hover:border-[#FF007A] bg-[#090D1A]/50 hover:bg-[#FF007A]/5 shadow-[0_0_30px_rgba(255,0,122,0.03)]"
            >
              <Link to="/normas?tab=auditorias" className="absolute inset-0 z-10" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FF007A]/10 to-transparent pointer-events-none rounded-full blur-3xl"></div>
              
              <ShieldCheck className="absolute top-8 right-8 w-16 h-16 text-[#FF007A]/20 group-hover:scale-110 group-hover:text-[#FF007A]/40 group-hover:drop-shadow-[0_0_15px_rgba(255,0,122,0.8)] transition-all duration-500" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF007A] mb-2 uppercase block">CLÁUSULA 9.2 // AUDITORÍA DE TERCERA PARTE</span>
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#FF007A] transition-colors">{t('services.auditorTitle')}</h3>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">{t('services.auditorDesc')}</p>
              
              <div className="mt-5 text-xs font-mono font-bold text-[#FF007A] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 uppercase">
                <span>[ABRIR_MÓDULO_DETALLES]</span> 
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Card 2: Coaching (Col: 2) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2 glass rounded-3xl p-8 bento-card futuristic-card flex items-center gap-6 group cursor-pointer border-[#00F0FF]/15 hover:border-[#00F0FF] bg-[#090D1A]/50 hover:bg-[#00F0FF]/5 shadow-[0_0_30px_rgba(0,240,255,0.03)] relative"
            >
              <Link to="/normas?tab=liderazgo" className="absolute inset-0 z-10" />
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F0FF]/10 to-transparent pointer-events-none rounded-full blur-2xl"></div>
              
              <div className="w-16 h-16 bg-[#00F0FF]/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00F0FF]/25 border border-[#00F0FF]/20 transition-colors">
                <Users className="text-[#00F0FF] w-8 h-8 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all duration-300" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#00F0FF]/80 uppercase block mb-1">PROGRAMA INTEGRAL IBM</span>
                <h3 className="text-xl font-bold text-white group-hover:text-[#00F0FF] transition-colors">{t('services.coachTitle')}</h3>
                <p className="text-gray-400 text-sm italic">{t('services.coachDesc')}</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs font-mono font-bold text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>[VER_INFO]</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Card 3: Core Value (Col: 1, dynamic) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-1 glass rounded-3xl p-6 bento-card futuristic-card flex flex-col items-center justify-center text-center group border-[#00F0FF]/10 hover:border-[#00F0FF]/40 bg-[#090D1A]/40 relative cursor-pointer"
            >
              <Link to="/normas?tab=gestionycalidad" className="absolute inset-0 z-10" />
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 border border-amber-500/10 transition-colors">
                <Award className="w-6 h-6 text-amber-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-300" />
              </div>
              <p className="font-bold text-white tracking-tight">Estándar ISO</p>
              <p className="text-[10px] text-[#00F0FF] mt-1 font-mono uppercase tracking-widest">CALIDAD COMPLETA</p>
              
              <div className="mt-2 text-[9px] font-mono text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity uppercase z-20">
                [VER REGLAMENTOS]
              </div>
            </motion.div>

            {/* Card 4: Metrics (Col: 1, dynamic) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-1 glass rounded-3xl p-6 bento-card futuristic-card flex flex-col items-center justify-center text-center group border-[#FF007A]/10 hover:border-[#FF007A]/40 bg-[#090D1A]/40 relative cursor-pointer"
            >
              <Link to="/normas?tab=dashboard" className="absolute inset-0 z-10" />
              <span className="text-4xl font-extrabold text-white group-hover:scale-110 group-hover:text-[#FF007A] transition-all duration-300 font-mono tracking-tighter">
                {data.metrics.yearsExperience}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#FF007A] font-mono font-bold mt-1">
                {data.metrics.label}
              </span>
              
              <div className="mt-3 text-[9px] font-mono text-[#FF007A] opacity-0 group-hover:opacity-100 transition-opacity uppercase z-20">
                [VER COBERTURA]
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROCESS MAPPING & STRUCTURING SECTION */}
      <section id="procesos" className="py-24 relative z-10 bg-black/60 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
              Ingeniería Organizacional
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Mapa de Interacción de Procesos (SGC)</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light leading-relaxed mb-4">
              Representación visual de la interacción de los procesos del Sistema de Gestión de Calidad, incluyendo entradas, salidas y puntos de control operativos.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button 
              onClick={() => setSgcSimulatorMode('diagram')} 
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-300 border ${
                sgcSimulatorMode === 'diagram' 
                  ? 'bg-red-600/20 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.25)]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              [DIAGRAMA ESTÁTICO (CLÁUSULA 4.4)]
            </button>
            <button 
              onClick={() => setSgcSimulatorMode('interactive')} 
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-300 border ${
                sgcSimulatorMode === 'interactive' 
                  ? 'bg-red-600/20 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.25)]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              [SIMULADOR INTERACTIVO PHVA]
            </button>
          </div>
          
          {/* Main Map / Interactive Simulator Container */}
          <AnimatePresence mode="wait">
            {sgcSimulatorMode === 'diagram' ? (
              <motion.div 
                key="sgc-diagram-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto mb-20"
              >
                <div className="glass rounded-[2.5rem] p-4 md:p-8 border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-600/5 pointer-events-none"></div>
                  
                  {/* Header of the Diagram */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center">
                        <Workflow className="text-red-500 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold tracking-tight">Visor de Arquitectura ISO 9001</h4>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Cláusula 4.4 - Sistema de Gestión</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                       <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Entradas</span>
                       <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-green-400 uppercase tracking-tighter">Salidas</span>
                       <span className="px-3 py-1 rounded-lg bg-red-600/20 border border-red-500/30 text-[10px] font-bold text-red-500 uppercase tracking-tighter">Control</span>
                    </div>
                  </div>

                  {/* The Image (Editable since it uses ISOImage which pulls from Firestore image_registry) */}
                  <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-black/40">
                    <ISOImage id="mapa-procesos-9001" />
                    
                    {/* Floating Action Hint */}
                    <div className="absolute top-4 right-4 animate-pulse">
                      <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest shadow-lg">
                        Visualización Activa
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed italic">"Identifica claramente los requisitos de los clientes como entradas fundamentales."</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed italic">"Establece los puntos de control para mitigar riesgos operativos."</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed italic">"Mide la satisfacción del cliente como salida del ciclo PHVA."</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="sgc-interactive-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto mb-20"
              >
                <div className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#090D1A] to-[#04060d]">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>
                  
                  {/* Title Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        <h4 className="text-white font-bold tracking-tight text-lg">Consola de Simulación Operativa (PHVA)</h4>
                      </div>
                      <p className="text-gray-400 text-xs uppercase tracking-widest font-mono">Calibrador Dinámico de la Cláusula 4.4 // SGC Interactivo</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 font-mono text-[10px] text-red-400">
                      SYS_STATUS: SIMULADOR_READY
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Params */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest border-b border-white/5 pb-2">
                        [1] Configuración de Parámetros
                      </div>

                      {/* Inputs */}
                      <div className="space-y-2">
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider">Entrada de Requisitos:</label>
                        <select 
                          value={sgcInput}
                          onChange={(e) => setSgcInput(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                        >
                          <option value="requisitos_tecnicos">Planos e Ingeniería de Manufactura</option>
                          <option value="parametros_legales">Controles Legales, de Bienestar o Inocuidad</option>
                          <option value="sla_exigente">Alta Exigencia Comercial (SLAs Estrictos)</option>
                        </select>
                      </div>

                      {/* Complexity */}
                      <div className="space-y-2">
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider">Complejidad y Mermas de Entrada:</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['baja', 'media', 'alta'].map((level, lIdx) => (
                            <button
                              key={`sgc-complexity-${level}-${lIdx}`}
                              onClick={() => setSgcComplexity(level)}
                              className={`py-2 rounded-xl text-xs font-mono font-bold uppercase border transition-all ${
                                sgcComplexity === level 
                                  ? 'bg-red-600/20 border-red-500 text-white shadow-md' 
                                  : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/25'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Control Mode */}
                      <div className="space-y-4">
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider">Metodología de Control (Hacer):</label>
                        <div className="space-y-2">
                          {[
                            { id: 'muestreo', title: 'Muestreo Táctico Tradicional', desc: 'Control básico por lotes al final, propenso a scrap.' },
                            { id: 'fmea', title: 'Modelo Preventivo FMEA (Robert Terán)', desc: 'Gobernanza bajo enfoque de riesgos ISO 31000.' },
                            { id: '100%_control', title: 'Inspección Absoluta 100%', desc: 'Cero defectos salientes pero costo operativo crítico.' }
                          ].map((ctrl, idx) => (
                            <div 
                              key={`ctrl-${ctrl.id}-${idx}`}
                              onClick={() => setSgcControlMode(ctrl.id)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                sgcControlMode === ctrl.id 
                                  ? 'bg-[#1a0e14] border-red-500/50 shadow-md' 
                                  : 'bg-black/30 border-white/5 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                  sgcControlMode === ctrl.id ? 'border-red-500' : 'border-gray-500'
                                }`}>
                                  {sgcControlMode === ctrl.id && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                </div>
                                <span className={`text-xs font-bold ${sgcControlMode === ctrl.id ? 'text-white' : 'text-gray-400'}`}>
                                  {ctrl.title}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-500 ml-5 mt-1">{ctrl.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Manual trigger button (Even though it updates in real time, manual reload feels great) */}
                      <button 
                        onClick={runSgcSimulation}
                        disabled={sgcsimulating}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition duration-300"
                      >
                        <RotateCcw className={`w-4 h-4 ${sgcsimulating ? 'animate-spin' : ''}`} />
                        {sgcsimulating ? 'Calibrando Matriz...' : 'Ejecutar Ciclo SGC'}
                      </button>
                    </div>

                    {/* Right Panel: Active Output Console */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest border-b border-white/5 pb-2">
                        [2] Consola de Evaluación & Resultados
                      </div>

                      {sgcSimResult ? (
                        <div className="space-y-4">
                          {/* Top metrics bar */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                              <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Tasa de Conformidad</span>
                              <div className="flex items-baseline gap-1">
                                <span className={`text-3xl font-black font-mono ${
                                  sgcSimResult.conformance >= 97 
                                    ? 'text-green-400' 
                                    : sgcSimResult.conformance >= 85 
                                      ? 'text-amber-400' 
                                      : 'text-red-500'
                                }`}>
                                  {sgcSimResult.conformance}%
                                </span>
                                <span className="text-xs text-gray-400">Objetivo: 98%</span>
                              </div>
                              <div className="w-full bg-white/5 h-1.5 rounded-full mt-2.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    sgcSimResult.conformance >= 97 
                                      ? 'bg-green-400' 
                                      : sgcSimResult.conformance >= 85 
                                        ? 'bg-amber-400' 
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${sgcSimResult.conformance}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="bg-black/60 p-4 rounded-2xl border border-white/5">
                              <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Retorno Económico SGC</span>
                              <div className="flex items-baseline gap-1">
                                <span className={`text-2xl font-black font-mono ${
                                  sgcSimResult.coqSaving >= 0 ? 'text-green-400' : 'text-red-500'
                                }`}>
                                  {sgcSimResult.coqSaving >= 0 ? `+$${sgcSimResult.coqSaving}` : `-$${Math.abs(sgcSimResult.coqSaving)}`}
                                </span>
                                <span className="text-[9px] text-gray-400">USD/año (COQ)</span>
                              </div>
                              <span className="text-[9px] text-gray-500 block mt-3 uppercase font-mono tracking-tighter">
                                {sgcSimResult.coqSaving >= 0 ? '✓ Optimización de scrap' : '⚠ Incremento de mermas'}
                              </span>
                            </div>
                          </div>

                          {/* Approval / Alert State Indicator */}
                          <div className={`p-4 rounded-2xl border ${
                            sgcSimResult.status === 'COMPLIANT' 
                              ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                              : 'bg-red-500/5 border-red-500/20 text-red-400'
                          }`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                sgcSimResult.status === 'COMPLIANT' ? 'bg-green-500/10' : 'bg-red-500/10'
                              }`}>
                                {sgcSimResult.status === 'COMPLIANT' ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                )
                                }
                              </div>
                              <div>
                                <h5 className="font-bold text-xs uppercase tracking-wider mb-1 text-white">
                                  {sgcSimResult.title}
                                </h5>
                                <p className="text-xs text-gray-400 leading-relaxed font-light">
                                  {sgcSimResult.feedback}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Terminal Logs */}
                          <div className="bg-black/90 rounded-2xl border border-white/10 p-4 font-mono text-[9px] leading-relaxed space-y-1 text-gray-400 relative">
                            <div className="absolute top-2 right-3 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              <span className="text-[8px] text-gray-600 font-bold tracking-widest uppercase">LIVE SGC FEED</span>
                            </div>
                            <div className="text-gray-500 mb-2 border-b border-white/5 pb-1 flex items-center gap-1.5">
                              <Terminal className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span>SGC REGISTERED SEQUENCE LOGS:</span>
                            </div>
                            
                            <div className="max-h-24 overflow-y-auto space-y-1 select-none">
                              {sgcLogs.map((log, lidx) => (
                                <div key={`sgc-log-${lidx}-${log}`} className="flex items-start gap-1">
                                  <span className="text-red-500/40 shrink-0">&gt;</span>
                                  <span>{log}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                          <Activity className="w-8 h-8 text-white/20 animate-pulse mb-2" />
                          <p className="text-xs font-mono lowercase">Iniciando simulación del sistema...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data?.expertise?.areas || []).map((area, idx) => {
              const IconComponent = 
                area.icon === 'Network' ? Network :
                area.icon === 'Workflow' ? Workflow :
                area.icon === 'FileCheck' ? FileCheck : Activity;

              return (
                <motion.div 
                  key={`exp-area-${area.title || idx}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass p-8 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-600/10 flex items-center justify-center shrink-0 group-hover:bg-amber-600/20 transition-colors">
                      <IconComponent className="text-amber-500 w-6 h-6 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{area.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {(area?.items || []).map((item, i) => (
                      <li key={`exp-item-${area.title || 'area'}-${i}`} className="flex items-start gap-3 text-gray-400">
                        <CheckCircle2 className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS SECTION */}
      <section id="certifications" className="py-24 relative z-10 bg-black/40 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
              {t('certifications.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">{t('certifications.title')}</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light leading-relaxed">
              {t('certifications.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.certifications || []).map((cert, idx) => (
              <motion.div 
                key={`cert-card-${cert.title || idx}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onClick={() => setSelectedCert(cert)}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-red-500/30 transition-all duration-300 group cursor-pointer hover:bg-white/[0.02] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center font-mono font-black border border-white/10 text-red-500 group-hover:text-white group-hover:bg-red-600 transition-all text-sm">
                        {cert.title.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">{cert.title}</h3>
                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1 block">{cert.subtitle}</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-amber-500/10 transition-colors">
                      <Award className="text-gray-400 group-hover:text-amber-500 transition-colors w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">{cert.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500 group-hover:text-red-400">
                  <span>[ABRIR SIMULADOR DE NORMA]</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: MÁS ALLÁ DE LA NORMA */}
      <section className="py-24 relative z-10 bg-gradient-to-b from-black/80 to-[#070913] border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
              Más Allá de la Certificación: Coaching Estratégico & Psicopedagogía
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">El Factor Humano Detrás de las Normas</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light leading-relaxed">
              No basta con tener procesos estandarizados. Necesitas equipos cohesionados que tomen decisiones críticas con agilidad e inteligencia emocional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <button
              onClick={() => setSelectedCoachingPillar(prev => prev === 'decision' ? null : 'decision')}
              className={`p-8 rounded-3xl border backdrop-blur-md transition-all duration-300 text-left relative focus:outline-none cursor-pointer group ${
                selectedCoachingPillar === 'decision'
                  ? 'bg-blue-950/20 border-blue-500 shadow-xl shadow-blue-500/10'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-3xl mb-4 block">🎯</span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Decisiones Críticas</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Mapeo de riesgos + coaching bajo presión para que líderes y equipos actúen con claridad en momentos de alta incertidumbre laboral.
              </p>
              <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-400 mt-auto flex items-center gap-1">
                <span>[ {selectedCoachingPillar === 'decision' ? 'CERRAR SIMULADOR' : 'ABRIR SIMULADOR Y DIAGRAMA'} ]</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setSelectedCoachingPillar(prev => prev === 'psicopedagogia' ? null : 'psicopedagogia')}
              className={`p-8 rounded-3xl border backdrop-blur-md transition-all duration-300 text-left relative focus:outline-none cursor-pointer group ${
                selectedCoachingPillar === 'psicopedagogia'
                  ? 'bg-amber-950/20 border-amber-500 shadow-xl shadow-amber-500/10'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-3xl mb-4 block">🧠</span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Psicopedagogía Empresarial</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Aprendizaje adaptativo, gestión del estrés y comunicación asertiva. Transformo de manera didáctica la forma en que tu equipo aprende y colabora.
              </p>
              <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-400 mt-auto flex items-center gap-1">
                <span>[ {selectedCoachingPillar === 'psicopedagogia' ? 'CERRAR SIMULADOR' : 'ABRIR SIMULADOR Y DIAGRAMA'} ]</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setSelectedCoachingPillar(prev => prev === 'cohesion' ? null : 'cohesion')}
              className={`p-8 rounded-3xl border backdrop-blur-md transition-all duration-300 text-left relative focus:outline-none cursor-pointer group ${
                selectedCoachingPillar === 'cohesion'
                  ? 'bg-red-950/20 border-red-500 shadow-xl shadow-red-500/10'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-3xl mb-4 block">🤝</span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">Cohesión de Equipos</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                De grupos disfuncionales a equipos de alto rendimiento. Alineación de OKRs estratégicos, resolución asertiva de conflictos y confianza operativa.
              </p>
              <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-red-500 mt-auto flex items-center gap-1">
                <span>[ {selectedCoachingPillar === 'cohesion' ? 'CERRAR SIMULADOR' : 'ABRIR SIMULADOR Y DIAGRAMA'} ]</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* DYNAMIC EXPANSION FOR COACHING PILLARS */}
          <AnimatePresence mode="wait">
            {selectedCoachingPillar && (
              <motion.div
                key={`coaching-pillar-panel-${selectedCoachingPillar}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mb-16 overflow-hidden"
              >
                <CoachingPillarsPanel 
                  initialPillar={selectedCoachingPillar} 
                  onClose={() => setSelectedCoachingPillar(null)} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ÁREAS DE ESPECIALIZACIÓN INTEGRADAS */}
          <div className="glass rounded-3xl border border-white/10 p-8 md:p-12 mb-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-3xl rounded-full"></div>
            
            <h3 className="text-2xl font-bold text-white mb-8 tracking-tight flex items-center gap-2">
              <Layers className="text-blue-500 w-6 h-6" />
              Áreas de Especialización Integradas (El Método Robert Terán)
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Dimensión Técnica */}
              <div className="space-y-4 bg-blue-950/20 p-6 rounded-2xl border border-blue-500/10">
                <h4 className="text-lg font-bold text-blue-400 flex items-center gap-2 border-b border-blue-500/20 pb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Dimensión Técnica (Ingeniería de Procesos)
                </h4>
                <ul className="space-y-3">
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold mr-1">•</span>
                    <span><strong>Auditoría Líder ISO:</strong> Certificación internacional multicriterio (9001, 14001, 27001, 45001, 22000, 42001).</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold mr-1">•</span>
                    <span><strong>Mapeo de Procesos:</strong> Diagramación avanzada con flujos lógicos bajo el estándar BPMN.</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold mr-1">•</span>
                    <span><strong>Análisis Crítico:</strong> Diagnóstico riguroso y toma de decisiones basada en datos cualitativos y cuantitativos.</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold mr-1">•</span>
                    <span><strong>Optimización Lean & Six Sigma:</strong> Reducción de desperdicios operativos y aseguramiento del valor del servicio.</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold mr-1">•</span>
                    <span><strong>Gestión de Riesgos Corporativos:</strong> Aseguramiento sistémico de la continuidad de negocio y planes de mitigación.</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold mr-1">•</span>
                    <span><strong>Implementación de OKRs y KPIs:</strong> Establecimiento de objetivos y controles con rendimiento medible.</span>
                  </li>
                </ul>
              </div>

              {/* Dimensión Human */}
              <div className="space-y-4 bg-teal-950/20 p-6 rounded-2xl border border-teal-500/10">
                <h4 className="text-lg font-bold text-teal-400 flex items-center gap-2 border-b border-teal-500/20 pb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  Dimensión Humana (Coaching & Psicopedagogía)
                </h4>
                <ul className="space-y-3">
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-teal-400 font-bold mr-1">•</span>
                    <span><strong>Coach Estratégico:</strong> Potenciación de las habilidades blandas de líderes y de mandos medios.</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-teal-400 font-bold mr-1">•</span>
                    <span><strong>Liderazgo y Cohesión de Equipos:</strong> Alineación activa para motivar de forma asertiva al capital humano.</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-teal-400 font-bold mr-1">•</span>
                    <span><strong>Decisiones Críticas bajo Presión:</strong> Manejo estratégico de la incertidumbre comercial y personal.</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-teal-400 font-bold mr-1">•</span>
                    <span><strong>Psicopedagogía y Gestión del Aprendizaje:</strong> Formación didáctica orientada al crecimiento mutuo.</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-teal-400 font-bold mr-1">•</span>
                    <span><strong>Gestión del Estrés y Resiliencia:</strong> Mitigar asertivamente el burnout diario corporativo.</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-teal-400 font-bold mr-1">•</span>
                    <span><strong>Establecimiento de Objetivos:</strong> Lograr metas eficaces enfocándose en el equilibrio de vida integral.</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Formación Adicional Sub-panel */}
            <div className="mt-8 pt-6 border-t border-white/5 bg-white/[0.01] p-4 rounded-xl text-xs text-gray-400 leading-relaxed text-center">
              🎓 Robert Terán es <strong>Ingeniero e Economista</strong> con estudios y especializaciones en <strong>Psicopedagogía</strong>, <strong>Bienestar Laboral</strong> e <strong>Inteligencia Emocional Organizacional</strong>, lo que refuerza su visión integral orientada a resultados de excelencia.
            </div>
          </div>

          {/* ETIQUETAS DE ACCIÓN EN EL DASHBOARD / MARBETES */}
          <div className="text-center mb-8">
            <h4 className="text-sm uppercase tracking-widest text-red-500/90 font-mono mb-4">Económicas y Especialidades de Acompañamiento Integral</h4>
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
              {[
                "Gestión de la ira", "Orientación laboral", "Impulsividad", 
                "Habilidades de afrontamiento", "Problemas emocionales", "Life Coaching", 
                "Problemas relacionales", "Rendimiento deportivo", "Estrés", "Recursos humanos"
              ].map((specialty, idx) => (
                <button 
                  key={`spec-btn-${specialty}-${idx}`} 
                  onClick={() => {
                    // Reset custom states before opening
                    if (specialty === 'Impulsividad') {
                      setImpulseActive(false);
                      setImpulseSuccess(false);
                      setImpulseTime(5);
                    }
                    setSelectedSpecialty(specialty);
                  }}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#121212] hover:bg-red-950/20 text-gray-300 hover:text-white border border-white/5 hover:border-red-500/35 transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-1.5 focus:outline-none"
                >
                  <span className="text-red-500 text-xs">✨</span> {specialty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 relative z-10 bg-black/60 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono font-bold mb-6 tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              {t('testimonials.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mb-6">
              {t('testimonials.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data?.testimonials || []).map((testimonial, idx) => (
              <motion.div 
                key={`testim-card-${testimonial.name || idx}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedTestimonial(testimonial)}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-[#00F0FF]/30 hover:bg-[#00F0FF]/5 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#00F0FF]/30 mb-6 group-hover:text-[#00F0FF] transition-colors" />
                  <p className="text-gray-300 leading-relaxed font-light italic mb-8 group-hover:text-white transition-colors text-left font-sans">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4">
                    <img 
                      src={clientPhotos[testimonial.name] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`} 
                      alt={testimonial.name} 
                      loading="lazy" 
                      decoding="async"
                      className="w-12 h-12 rounded-full object-cover bg-white/5 border border-white/10"
                    />
                    <div className="text-left">
                      <h4 className="text-white font-bold">{testimonial.name}</h4>
                      <p className="text-xs text-[#00F0FF]/80 font-mono">{testimonial.title}</p>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 uppercase">
                    <span>{t('testimonials.viewCase')}</span> <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER / CONTACTO */}
      <footer id="contact" className="py-12 border-t border-white/5 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left flex items-center gap-4 flex-wrap">
            {profile.logoUrl && (
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 p-0.5 bg-white/5 flex items-center justify-center">
                <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <p className="text-sm text-gray-500 font-mono tracking-tighter">coach-iso.eu // {profile.name || data.profile.name}</p>
            <span className="text-gray-700">|</span>
            <Link to="/admin" className="text-xs text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest font-bold">Admin CRM</Link>
            <span className="text-gray-700">|</span>
            <Link to="/normas" className="text-xs text-gray-500 hover:text-blue-500 transition-colors uppercase tracking-widest font-bold">Visualizador ISO</Link>
          </div>
          <div className="flex gap-4">
            <a href={data.profile.linkedin} className="p-4 glass rounded-full hover:bg-white hover:text-black transition">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={`mailto:${data.profile.email}`} className="p-4 glass rounded-full hover:bg-red-600 hover:text-white transition">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
      {/* MODALS */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl ${['iso', 'coaching'].includes(selectedService.id) ? 'max-w-5xl' : 'max-w-2xl'} w-full max-h-[90vh] flex flex-col md:flex-row`}
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-50 bg-black/50 p-2 rounded-full backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              
              {['iso', 'coaching'].includes(selectedService.id) ? (
                <>
                  {/* Left Side: Robert Teran Image */}
                  <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                    <img 
                      src={profile.photoUrl || undefined} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <p className="text-red-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">{profile.coachTitle}</p>
                      <h4 className="text-white font-black text-xl tracking-tighter">{profile.name}</h4>
                    </div>
                  </div>

                  {/* Right Side: Service Details */}
                  <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center shrink-0">
                        {selectedService.id === 'iso' ? (
                          <ShieldCheck className="text-red-500 w-8 h-8" />
                        ) : (
                          <Users className="text-red-500 w-8 h-8" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-3xl font-extrabold text-white tracking-tight">{selectedService.title}</h3>
                        <p className="text-red-400 font-bold text-sm uppercase tracking-widest mt-1">
                          {selectedService.id === 'iso' ? 'Gestión de Excelencia' : 'Liderazgo Corporativo'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="prose prose-invert max-w-none space-y-6">
                      <p className="text-white text-xl font-bold leading-snug">
                        {selectedService.description}
                      </p>
                      <p className="text-gray-400 leading-relaxed text-lg">
                        {selectedService.detailedDescription}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-red-500 text-xs font-bold uppercase mb-1">
                            {selectedService.id === 'iso' ? 'Impacto' : 'Estrategia'}
                          </p>
                          <p className="text-white text-sm">
                            {selectedService.id === 'iso' 
                              ? 'Optimización de procesos bajo estándares globales.' 
                              : 'Desarrollo de habilidades directivas de alto nivel.'}
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-red-500 text-xs font-bold uppercase mb-1">
                            {selectedService.id === 'iso' ? 'Resultados' : 'Crecimiento'}
                          </p>
                          <p className="text-white text-sm">
                            {selectedService.id === 'iso' 
                              ? 'Certificaciones garantizadas sin no conformidades.' 
                              : 'Equipos alineados y alto rendimiento sostenido.'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <p className="text-xs text-gray-500 italic max-w-[200px]">
                        {selectedService.id === 'iso' 
                          ? '"La calidad no es un acto, es un hábito."' 
                          : '"El liderazgo es el arte de hacer que otros quieran hacer lo que tú necesitas que se haga."'}
                      </p>
                      <Link 
                        to="/agendar" 
                        onClick={() => setSelectedService(null)}
                        className="w-full sm:w-auto bg-red-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-600/20 text-center"
                      >
                        {selectedService.id === 'iso' ? 'Agendar Consultoría' : 'Agendar Sesión'}
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 w-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center shrink-0">
                      <ImageIcon className="text-red-500 w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white tracking-tight">{selectedService.title}</h3>
                      <p className="text-red-400 font-medium mt-1">{selectedService.description}</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {selectedService.detailedDescription}
                    </p>
                  </div>
                  
                  <div className="mt-10 flex justify-end">
                    <Link 
                      to="/agendar" 
                      onClick={() => setSelectedService(null)}
                      className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition"
                    >
                      {t('footer.agendar')}
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTestimonial.name}`} 
                  alt={selectedTestimonial.name} 
                  className="w-16 h-16 rounded-full bg-white/5 border border-white/10"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedTestimonial.name}</h3>
                  <p className="text-red-400 font-medium">{selectedTestimonial.title}</p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-white/5" />
                <p className="text-gray-300 italic text-lg leading-relaxed relative z-10">
                  "{selectedTestimonial.quote}"
                </p>
              </div>

              {selectedTestimonial.caseStudy && (
                <div>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500" />
                    Caso de Éxito
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    {selectedTestimonial.caseStudy}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0c10] border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] overflow-y-auto relative shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-red-600/10 to-transparent">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center font-mono font-black text-red-500 border border-red-500/30 text-base shrink-0">
                    {selectedCert.title.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs text-red-500 font-mono font-bold tracking-widest uppercase block mb-1">
                      [ACREDITACIÓN E INTERACCIÓN SGC EN TIEMPO REAL]
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{selectedCert.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{selectedCert.subtitle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto">
                {/* Left side: Bio & Norm contextual description */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-1">
                      [INFO GENERAL DE AVAL]
                    </span>
                    <p className="text-gray-300 text-sm leading-relaxed font-light">
                      {selectedCert.description}
                    </p>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <span className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-wider block">
                        COHERENCIA METODOLÓGICA
                      </span>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Este aval faculta a Robert Terán para actuar con rigor técnico e institucional ante comités de auditoría y juntas directivas de alta exigencia operacional.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                      CAMPOS DE ACCIÓN CRÍTICOS
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.title.includes("ISO") && ["9001:2015", "14001:2015", "45001:2018", "27001", "42001 (IA)"].map((n, idx) => (
                        <span key={`iso-${n}-${idx}`} className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-mono font-semibold text-red-400">{n}</span>
                      ))}
                      {selectedCert.title.includes("Coach") && ["IBM Executive", "Agilidad", "Feedback 360", "Psicopedagogía"].map((n, idx) => (
                        <span key={`coach-${n}-${idx}`} className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-semibold text-amber-400">{n}</span>
                      ))}
                      {(selectedCert.title === "CIA" || /\bCIA\b/.test(selectedCert.title)) && ["IIA Framework", "Control Interno", "Muestreo Táctico"].map((n, idx) => (
                        <span key={`cia-${n}-${idx}`} className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-semibold text-blue-400">{n}</span>
                      ))}
                      {selectedCert.title.includes("CISA") && ["Seguridad de Datos", "ISO 27001", "COBIT Controls"].map((n, idx) => (
                        <span key={`cisa-${n}-${idx}`} className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono font-semibold text-purple-400">{n}</span>
                      ))}
                      {selectedCert.title.includes("CPA") && ["Costo de Calidad", "Evaluación Financiera", "Scrap Ledger"].map((n, idx) => (
                        <span key={`cpa-${n}-${idx}`} className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-semibold text-emerald-400">{n}</span>
                      ))}
                      {selectedCert.title.includes("CRMA") && ["ISO 31000", "Matriz FMEA", "Mitigación de Riesgo"].map((n, idx) => (
                        <span key={`crma-${n}-${idx}`} className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono font-semibold text-rose-400">{n}</span>
                      ))}
                      {selectedCert.title.includes("Psicopedagogía") && ["David Kolb", "Equipos Cohesionados", "Curva de Aprendizaje"].map((n, idx) => (
                        <span key={`psico-${n}-${idx}`} className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-[10px] font-mono font-semibold text-teal-400">{n}</span>
                      ))}
                      {selectedCert.title.includes("Estratégico") && ["Decisiones Críticas", "Triage de Crisis", "Mapas Mentales"].map((n, idx) => (
                        <span key={`estrat-${n}-${idx}`} className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-semibold text-cyan-400">{n}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: Interactive Widget */}
                <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/[0.03] blur-2xl rounded-full"></div>

                  <div className="space-y-6">
                    {/* WIDGET 1: Auditor Líder ISO */}
                    {selectedCert.title.includes("ISO") && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[CONSOLA DE AUDITORÍA INTERNA]</span>
                          <span className="text-[10px] font-mono text-gray-500">ISO 9001 / 14001 / 45001</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Selecciona las cláusulas de control que deseas diagnosticar en la auditoría del SGC de la empresa:
                        </p>
                        
                        <div className="space-y-2 mt-4">
                          {[
                            { key: '4.4', label: 'Cláusula 4.4: Enfoque de procesos y SGC (Entradas/Salidas/Controles)' },
                            { key: '5.3', label: 'Cláusula 5.3: Roles, responsabilidades y autoridades asignadas' },
                            { key: '6.1', label: 'Cláusula 6.1: Acciones para abordar riesgos y oportunidades (FMEA)' },
                            { key: '8.1', label: 'Cláusula 8.1: Planificación y control operacional en piso' },
                            { key: '9.3', label: 'Cláusula 9.3: Revisión del SGC por la Dirección' },
                            { key: '10.2', label: 'Cláusula 10.2: No Conformidad y tratamiento activo del Scrap' },
                          ].map((item, idx) => (
                            <div 
                              key={`chk-${item.key}-${idx}`}
                              onClick={() => setAuditChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                auditChecklist[item.key] 
                                  ? 'bg-red-500/5 border-red-500/30 text-white' 
                                  : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/15'
                              }`}
                            >
                              <span className="text-xs font-medium">{item.label}</span>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                auditChecklist[item.key] ? 'bg-red-600 border-red-500 text-white' : 'border-gray-600'
                              }`}>
                                {auditChecklist[item.key] && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Audit Outcome math */}
                        {(() => {
                          const checkedCount = Object.values(auditChecklist).filter(Boolean).length;
                          const score = Math.round((checkedCount / 6) * 100);
                          let diagnosis = "";
                          if (score === 100) {
                            diagnosis = "EXCELENCIA OPERACIONAL: Listo para la auditoría de cara a entes certificadores internacionales (Bureau Veritas, SGS, TÜV). Cero desviados crónicos.";
                          } else if (score >= 66) {
                            diagnosis = "MADUREZ MODERADA: Excelente nivel preventivo, pero existen brechas operativas en lazo cerrado de mejora continua. No conforme menor posible.";
                          } else {
                            diagnosis = "RIESGO DE PARÁLISIS OPERATIVA: Breves graves de gobernanza. Robert Terán sugiere implementar control activo inmediato de la Cláusula 4.4.";
                          }

                          return (
                            <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono font-bold text-gray-500 block uppercase">Nivel de Madurez Operativa</span>
                                <span className={`text-base font-mono font-black ${score >= 80 ? 'text-green-400' : 'text-amber-500'}`}>{score}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-600 h-full transition-all duration-500" style={{ width: `${score}%` }}></div>
                              </div>
                              <p className="text-[11px] text-gray-400 leading-relaxed italic mt-2 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                                "{diagnosis}"
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* WIDGET 2: IBM 2025 Coach */}
                    {selectedCert.title.includes("IBM") && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">[IBM 2025 LIDERAZGO AGIL]</span>
                          <span className="text-[10px] font-mono text-gray-500">Mentoring corporativo hibrido</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Define el estilo de liderazgo activo y el nivel de resiliencia de tu equipo para obtener el plan de motivación ejecutiva de Robert Terán:
                        </p>

                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <label className="text-xs text-gray-300 font-bold block uppercase tracking-wider">Estilo de Liderazgo:</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: 'directive', label: 'Directivo / Tradicional' },
                                { id: 'coaching', label: 'Coaching Activo / SGC Persona' },
                                { id: 'democratic', label: 'Democrático / Consenso' },
                                { id: 'laissez', label: 'Laissez-faire / Descentralizado' },
                              ].map((style, idx) => (
                                <button
                                  key={`style-${style.id}-${idx}`}
                                  onClick={() => setLeadershipStyle(style.id)}
                                  className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all ${
                                    leadershipStyle === style.id 
                                      ? 'bg-amber-500/10 border-amber-500 text-white' 
                                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/15'
                                  }`}
                                >
                                  {style.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Diagnóstico de Coaching Ejecutivo</span>
                              <span className="text-[10px] font-mono text-gray-500">GESTALT + AGILIDAD</span>
                            </div>
                            
                            {leadershipStyle === 'coaching' ? (
                              <p className="text-xs text-gray-300 leading-relaxed font-light">
                                🌟 <strong>El Modelo Ideal:</strong> Robert Terán afirma que el Coaching Activo empodera a los dueños de procesos, logrando una adopción del 95% de las normas ISO. El equipo asume la calidad como un hábito y no como una carga obligada.
                              </p>
                            ) : leadershipStyle === 'directive' ? (
                              <p className="text-xs text-gray-300 leading-relaxed font-light">
                                ⚠️ <strong>Riesgo de Burnout Elevado:</strong> La dirección autoritaria genera "conformidad de papel" pero no un compromiso real. Los auditados esconderán las no-conformidades críticas para evitar represalias corporativas.
                              </p>
                            ) : leadershipStyle === 'democratic' ? (
                              <p className="text-xs text-gray-300 leading-relaxed font-light">
                                📊 <strong>Consenso Productivo pero Lento:</strong> Excelente para la Cláusula 5.3, pero propenso a retrasos operacionales crónicos en momentos de crisis comercial extrema. Requiere mentor estratégico de balance.
                              </p>
                            ) : (
                              <p className="text-xs text-gray-300 leading-relaxed font-light">
                                ⚠️ <strong>Caos SGC Inminente:</strong> Dejar las cosas al azar sin control ni engranaje robusto de la Cláusula 4.4 fragmentará la cultura corporativa y disparará las mermas productivas.
                              </p>
                            )}

                            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] italic text-gray-400">
                              "No lideramos sistemas, lideramos a los seres humanos que sostienen esos sistemas." — IBM Coach Robert Terán
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WIDGET 3: CIA */}
                    {selectedCert.title === 'CIA' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest">[AUDITORÍA INTERNA CERTIFICADA CIA]</span>
                          <span className="text-[10px] font-mono text-gray-500">Institute of Internal Auditors</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Configura la sección y el departamento objetivo para planificar el muestreo táctico de control interno según normas globales:
                        </p>

                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <label className="text-xs text-gray-300 font-bold block uppercase tracking-wider">Departamento de Auditoría:</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {[
                                { id: 'operaciones', label: 'Operaciones' },
                                { id: 'finanzas', label: 'Finanzas' },
                                { id: 'ventas', label: 'Ventas' },
                                { id: 'abastecimiento', label: 'Abastecimiento' },
                              ].map((dept, idx) => (
                                <button
                                  key={`dept-${dept.id}-${idx}`}
                                  onClick={() => setCiaFocusDept(dept.id)}
                                  className={`py-2 px-1 rounded-xl text-xs font-mono uppercase text-center border transition-all ${
                                    ciaFocusDept === dept.id 
                                      ? 'bg-blue-500/10 border-blue-500 text-white' 
                                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/15'
                                  }`}
                                >
                                  {dept.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-blue-400 font-bold uppercase">Matriz de Evidencia de Auditoría CIA</span>
                              <span className="text-gray-500">DEPARTAMENTO: {ciaFocusDept.toUpperCase()}</span>
                            </div>

                            <p className="text-xs text-gray-300 leading-relaxed">
                              {ciaFocusDept === 'operaciones' && '🔍 Foco Técnico: Muestreo de conformidad en piso de manufactura, mantenimiento preventivo de maquinaria crítica y validación activa de Cláusula 4.4 de ISO 9001.'}
                              {ciaFocusDept === 'finanzas' && '💵 Foco Financiero: Auditoría de flujos de caja, conciliaciones fiscales y costo real de evaluación contra mermas por scrap.'}
                              {ciaFocusDept === 'ventas' && '📈 Foco Comercial: Cumplimiento de contratos de servicio (SLAs), tiempos de entrega de preventa, y reclamos de clientes.'}
                              {ciaFocusDept === 'abastecimiento' && '📦 Foco Proveedores: Verificación de cotizaciones comparativas, selección de proveedores críticos e inspección de materias primas.'}
                            </p>

                            <div className="p-3 bg-blue-950/20 border border-blue-500/10 rounded-xl text-xs text-gray-400">
                              <strong>Propuesta CIA Robert Terán:</strong> Aplicar muestreo táctico aleatorio doble bajo el estándar de calidad militar (MIL-STD-105E) para asegurar que el 99% de las desviaciones de control interno sean capturadas a tiempo.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WIDGET 4: CISA */}
                    {selectedCert.title === 'CISA' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-purple-500 uppercase tracking-widest">[CONSOLA DE CONTROL DE SISTEMAS CISA]</span>
                          <span className="text-[10px] font-mono text-gray-500">Digital Trust & ISO 27001</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          La transformación digital exige auditoría robusta de seguridad informática. Calibra los activos tecnológicos de control interno:
                        </p>

                        <div className="space-y-3 mt-4">
                          <div 
                            onClick={() => setCisaBackups(!cisaBackups)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              cisaBackups ? 'bg-purple-500/5 border-purple-500/30 text-white' : 'bg-white/[0.01] border-white/5 text-gray-400'
                            }`}
                          >
                            <span className="text-xs font-medium">Copias de Seguridad (Backups) automatizadas local y nube</span>
                            <div className={`w-10 h-5 rounded-full p-0.5 transition-all flex items-center ${cisaBackups ? 'bg-purple-600 justify-end' : 'bg-gray-800 justify-start'}`}>
                              <div className="w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>

                          <div 
                            onClick={() => setCisaAuditLogs(!cisaAuditLogs)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              cisaAuditLogs ? 'bg-purple-500/5 border-purple-500/30 text-white' : 'bg-white/[0.01] border-white/5 text-gray-400'
                            }`}
                          >
                            <span className="text-xs font-medium">Registros de Auditoría informática (Audit Logs) inmutables</span>
                            <div className={`w-10 h-5 rounded-full p-0.5 transition-all flex items-center ${cisaAuditLogs ? 'bg-purple-600 justify-end' : 'bg-gray-800 justify-start'}`}>
                              <div className="w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>

                          <div 
                            onClick={() => setCisaSecControls(!cisaSecControls)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              cisaSecControls ? 'bg-purple-500/5 border-purple-500/30 text-white' : 'bg-white/[0.01] border-white/5 text-gray-400'
                            }`}
                          >
                            <span className="text-xs font-medium">Seguridad Perimetral activa (WAF, Firewall e IPS)</span>
                            <div className={`w-10 h-5 rounded-full p-0.5 transition-all flex items-center ${cisaSecControls ? 'bg-purple-600 justify-end' : 'bg-gray-800 justify-start'}`}>
                              <div className="w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>

                          {/* Calculate security rating */}
                          {(() => {
                            const checkedCount = [cisaBackups, cisaAuditLogs, cisaSecControls].filter(Boolean).length;
                            const score = Math.round((checkedCount / 3) * 100);
                            return (
                              <div className="mt-4 pt-4 border-t border-white/5 bg-white/[0.01] p-4 rounded-xl space-y-2">
                                <div className="flex justify-between items-center text-xs font-mono">
                                  <span>INTEGRIDAD Y SEGURIDAD TI</span>
                                  <span className={`font-bold ${score === 100 ? 'text-green-400' : 'text-amber-400'}`}>{score}%</span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                                  {score === 100 
                                    ? "🔒 SISTEMA SEGURO: Cumple controles ISO 27001. Bajo riesgo de hackeo o interrupción de base de datos."
                                    : "⚠️ SISTEMA EXPUESTO: Falta de inmutabilidad de logs o backups correctos expone la base de datos a secuestro (Ransomware). Robert Terán sugiere parchear."}
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* WIDGET 5: CPA */}
                    {selectedCert.title === 'CPA' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest">[CPA BALANCED COQ LEDGER]</span>
                          <span className="text-[10px] font-mono text-gray-500">Costo de Calidad (Financial SGC)</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          La economía empresarial demuestra que prevenir fallas es 10 veces más barato que corregirlas ante el cliente. Modifica los presupuestos financieros:
                        </p>

                        <div className="space-y-4 mt-4 text-xs">
                          {/* Prevención */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-gray-300">
                              <span className="font-bold">Gastos de Prevención: (Definición e Ingeniería)</span>
                              <span className="font-mono text-emerald-400 font-bold">${coqPrev} USD</span>
                            </div>
                            <input 
                              type="range" 
                              min="1000" 
                              max="10000" 
                              step="500"
                              value={coqPrev} 
                              onChange={(e) => setCoqPrev(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                          </div>

                          {/* Fallas Externas */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-gray-300">
                              <span className="font-bold">Fallas de Calidad (Reclamos y Devoluciones):</span>
                              <span className="font-mono text-amber-500 font-bold">${coqExtFail} USD</span>
                            </div>
                            <input 
                              type="range" 
                              min="2000" 
                              max="20000" 
                              step="500"
                              value={coqExtFail} 
                              onChange={(e) => setCoqExtFail(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                          </div>

                          {/* Total and Balance */}
                          {(() => {
                            const totalCoq = coqPrev + coqExtFail + 4000; // appraisal and internal are fixed defaults
                            const preventionPercent = Math.round((coqPrev / totalCoq) * 100);
                            return (
                              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2 mt-4 text-xs">
                                <div className="flex justify-between text-[11px] font-mono uppercase text-gray-400">
                                  <span>Total Costo de Calidad (COQ)</span>
                                  <span className="font-black text-white">${totalCoq} USD</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-mono text-gray-500">
                                  <span>Presupuesto Preventivo Activo</span>
                                  <span>{preventionPercent}% del COQ</span>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${preventionPercent}%` }}></div>
                                </div>

                                <p className="text-[11px] text-gray-400 leading-relaxed font-light mt-2 italic">
                                  {preventionPercent >= 35 
                                    ? "✓ BALANCED FINANCES: Inversión preventiva inteligente. Reduce automáticamente el scrap operativo, minimizando cuellos de botella."
                                    : "⚠️ ALTO GASTO OPERACIONAL EN FALLAS: Pocos recursos en prevención obligan a gastar de más atendiendo reclamos e insatisfacción de clientes."}
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* WIDGET 6: CRMA */}
                    {selectedCert.title === 'CRMA' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[CRMA RIESGOS INTEGRALES - ISO 31000]</span>
                          <span className="text-[10px] font-mono text-gray-500">Risk Management Assurance</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          La toma de decisiones basada en el riesgo es la columna vertebral de la norma. Manipula la probabilidad y el impacto para graficar en tiempo real:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] text-gray-300 font-bold block uppercase font-mono">Probabilidad (1-5):</label>
                              <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((val) => (
                                  <button
                                    key={`risk-prob-${val}`}
                                    onClick={() => setRiskProbability(val)}
                                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold border transition-all ${
                                      riskProbability === val 
                                        ? 'bg-red-600 text-white border-red-500' 
                                        : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/15'
                                    }`}
                                  >
                                    {val}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-gray-300 font-bold block uppercase font-mono">Impacto (1-5):</label>
                              <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((val) => (
                                  <button
                                    key={`risk-impact-${val}`}
                                    onClick={() => setRiskImpact(val)}
                                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold border transition-all ${
                                      riskImpact === val 
                                        ? 'bg-red-600 text-white border-red-500' 
                                        : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/15'
                                    }`}
                                  >
                                    {val}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* HeatMatrix render */}
                          <div className="flex flex-col justify-center items-center p-3 rounded-2xl bg-black/60 border border-white/5">
                            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Cálculo de Exposición (Riesgo)</span>
                            <div className="flex items-baseline gap-1">
                              <span className={`text-4xl font-black font-mono ${
                                riskProbability * riskImpact >= 15 ? 'text-red-500' : riskProbability * riskImpact >= 8 ? 'text-amber-500' : 'text-green-400'
                              }`}>
                                {riskProbability * riskImpact}
                              </span>
                              <span className="text-xs text-gray-500 font-mono">/ 25</span>
                            </div>
                            
                            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase mt-2 ${
                              riskProbability * riskImpact >= 15 
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                                : riskProbability * riskImpact >= 8 
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                  : 'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}>
                              NIVEL: {riskProbability * riskImpact >= 15 ? 'CRÍTICO' : riskProbability * riskImpact >= 8 ? 'MODERADO' : 'ACEPTABLE'}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] text-xs text-gray-300 leading-relaxed font-light mt-4">
                          <strong>Prescripción ISO 31000 por Robert Terán:</strong> {
                            riskProbability * riskImpact >= 15 
                              ? "🚨 PARADA DE PLANTA / CORRECCIÓN URGENTE: El engranaje operacional está en riesgo inminente. Obligatorio recalibrar preventivos Cláusula 4.4 y documentar matriz FMEA en las próximas 24 horas."
                              : riskProbability * riskImpact >= 8 
                                ? "⚠️ CONTROLES PERIÓDICOS: Monitoreo táctico trimestral. Capacitación acelerada del personal con enfoque en bienestar psicopedagógico."
                                : "✓ ASUMIR RIESGO: Situación controlada de baja incidencia. Mantener el PHVA girando sin detener la línea comercial."
                          }
                        </div>
                      </div>
                    )}

                    {/* WIDGET 7: Psicopedagogía Empresarial */}
                    {selectedCert.title.includes("Psicopedagogía") && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">[SISTEMA PSICOPEDAGÓGICO DE APRENDIZAJE]</span>
                          <span className="text-[10px] font-mono text-gray-500">Gestalt y Bienestar Laboral</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          La adopción real de un sistema ISO no se decreta, se aprende. Robert Terán utiliza técnicas adaptativas para acelerar la madurez de los equipos:
                        </p>

                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                          <div className="flex justify-between text-[11px] font-mono text-teal-400 font-bold uppercase">
                            <span>Metodología de Aprendizaje Corporativo</span>
                            <span>Estilo Activo</span>
                          </div>
                          
                          <p className="text-xs text-gray-300 leading-relaxed font-light">
                            🧠 <strong>Fusión Técnico-Humana:</strong> Combinamos la severidad técnica de la auditoría ISO con técnicas psicopedagógicas de autoeficacia. Esto rompe la barrera del miedo a ser auditado, convirtiendo el control en un ejercicio didáctico colectivo de engranaje y mejora continua.
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                            <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                              <span className="text-teal-400 font-bold block mb-1">Inteligencia Emocional</span>
                              Disminuye el estrés ante auditorías en un 70%.
                            </div>
                            <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                              <span className="text-teal-400 font-bold block mb-1">Bienestar Laboral</span>
                              Fomenta el sentido de pertenencia y compromiso.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WIDGET 8: Coach Estratégico */}
                    {selectedCert.title.includes("Estratégico") && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">[CONSOLA DE DECISIONES CRÍTICAS]</span>
                          <span className="text-[10px] font-mono text-gray-500">Crisis & Estrategia Corporativa</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Toma de decisiones de alto impacto en momentos de crisis comercial o regulatoria, fusionando el análisis de riesgos con la madurez mental del líder:
                        </p>

                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                          <p className="text-xs text-gray-300 leading-relaxed font-light">
                            🤝 <strong>Mapeo de Presiones Ejecutivas:</strong> Robert Terán actúa como catalizador para juntas directivas bajo fuego o auditorías regulatorias adversas. A través de un enfoque basado en datos de procesos (CPA/CRMA) y claridad mental, se trazan planes de contingencia asertivos para proteger la continuidad de negocio.
                          </p>

                          <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl text-xs text-cyan-400 text-center">
                            <strong>Indicador Clave:</strong> 30 años estructurando engranajes de alta presión, liberando cuellos de botella que paralizan la continuidad corporativa.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[10px] font-mono text-gray-500 italic block text-center sm:text-left">
                      "La calidad es el engranaje perfecto entre personas motivadas y procesos estables."
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedCert(null);
                        const contactBtn = document.getElementById("agendar");
                        if (contactBtn) contactBtn.scrollIntoView({ behavior: 'smooth' });
                        else window.location.href = '#agendar';
                      }}
                      className="w-full sm:w-auto bg-red-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 transition"
                    >
                      Aplicar Metodología
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedSpecialty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedSpecialty(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0c10] border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] overflow-y-auto relative shadow-2xl flex flex-col pt-0"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-red-600/10 to-transparent">
                <div className="flex items-start gap-4 text-left">
                  <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center font-mono font-black text-red-500 border border-red-500/30 text-base shrink-0">
                    {selectedSpecialty.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs text-red-500 font-mono font-bold tracking-widest uppercase block mb-1">
                      [ESPECIALIDAD DE ACOMPAÑAMIENTO INTEGRAL SGC]
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{selectedSpecialty}</h3>
                    <p className="text-gray-400 text-sm mt-1">Sincronización Humano-Proceso con Robert Terán</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSpecialty(null)}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto text-left">
                
                {/* Left side: Context and Slogan */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-1">
                      [FILOSOFÍA METODOLÓGICA]
                    </span>
                    
                    {/* Slogans & Descriptions */}
                    <p className="text-red-400 font-serif italic text-base leading-relaxed">
                      {selectedSpecialty === "Gestión de la ira" && '"La ira enturbia la visión de los procesos; el análisis y el autoconocimiento la aclaran."'}
                      {selectedSpecialty === "Orientación laboral" && '"Un profesional frustrado produce desviaciones crónicas; un líder alineado es infalible."'}
                      {selectedSpecialty === "Impulsividad" && '"La pausa de 5 segundos que detiene el desperdicio operacional y protege tu SGC."'}
                      {selectedSpecialty === "Habilidades de afrontamiento" && '"No son los hechos los que nos estresan, sino el juicio que hacemos de ellos ante una auditoría."'}
                      {selectedSpecialty === "Problemas emocionales" && '"Un ambiente emocional desbalanceado genera mermas de atención inaceptables."'}
                      {selectedSpecialty === "Life Coaching" && '"La productividad laboral comienza con un estilo de vida saludable y equilibrado."'}
                      {selectedSpecialty === "Problemas relacionales" && '"Donde hay fricción humana hay pérdida de energía e ineficiencia en el piso."'}
                      {selectedSpecialty === "Rendimiento deportivo" && '"El cerebro de un atleta de élite opera con los mismos patrones que un director ante una crisis."'}
                      {selectedSpecialty === "Estrés" && '"El burnout cronificado anula la audacia gerencial y degrada la trazabilidad."'}
                      {selectedSpecialty === "Recursos humanos" && '"Las máquinas tienen manual de operación; las personas necesitan rutas de competencia."'}
                    </p>

                    <p className="text-gray-300 text-sm leading-relaxed font-light">
                      {selectedSpecialty === "Gestión de la ira" && "Robert Terán asiste a directores y auditores en piso en la autorregulación psicopedagógica y la respiración de caja controlada. Esto disminuye la impulsividad durante revisiones por la dirección y previene decisiones reactivas."}
                      {selectedSpecialty === "Orientación laboral" && "Un sistema ISO 9001 (Cláusula 7.2) es ineficiente si el operador no desea estar en su puesto. Robert Terán utiliza mapeo de talentos y encuestas de afinidad para reubicar constructivamente al personal."}
                      {selectedSpecialty === "Impulsividad" && "La urgencia de un atasco en manufactura frecuentemente genera reacciones emocionales ciegas que dañan maquinaria o vulneran el SGC. Robert Terán estructura un proceso mental reflexivo antes de decidir."}
                      {selectedSpecialty === "Habilidades de afrontamiento" && "Las visitas de entes auditores externos (Bureau Veritas, TÜV, SGS) pueden generar pánico. Sincronizamos las técnicas cognitivas con cada requisito de control para transformar el estrés en rigor metodológico."}
                      {selectedSpecialty === "Problemas emocionales" && "Robert Terán integra metodologías de contención Gestalt con rigor operacional para brindar espacios de escucha activa, equilibrando las demandas del hogar con las metas del SGC empresarial."}
                      {selectedSpecialty === "Life Coaching" && "El éxito financiero y corporativo flaquea si las dimensiones del bienestar humano están fragmentadas. Diagnosticamos la rueda existencial para potenciar un liderazgo firme, íntegro y libre de sesgos."}
                      {selectedSpecialty === "Problemas relacionales" && "Los silos organizacionales son cuellos de botella de naturaleza egoica. Robert actúa como un mediador neutral estratégico para unificar criterios técnicos, acelerando la maduración operacional."}
                      {selectedSpecialty === "Rendimiento deportivo" && "Bajo el enfoque de la psicología de alto rendimiento, entrenamos a gerentes y directores para mantener claridad mental en la toma de decisiones, visualizando contingencias críticas como desafíos lúdicos."}
                      {selectedSpecialty === "Estrés" && "El estrés elevado deteriora la trazabilidad de datos y causa accidentes o scrap de producto. Diseñamos planes rápidos de reducción de cortisol que devuelven el foco y salvan la calidad operacional."}
                      {selectedSpecialty === "Recursos humanos" && "Cumplimos con la Cláusula 7.2 asegurando que el personal no solo ostente diplomas vacíos, sino que cuenten con matrices vivas que enlacen su pasión técnica real con los engranajes corporativos."}
                    </p>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <span className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-wider block">
                        COHERENCIA DE ENGRANAJE
                      </span>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        "No certifico procesos sin antes certificar personas." Robert Terán unifica la psicología organizacional con auditoría ISO para un engranaje empresarial perfecto. Se eliminan las mermas invisibles causadas por la desmotivación humana.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side: Interactive Widget */}
                <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/[0.03] blur-2xl rounded-full"></div>

                  <div className="space-y-6">
                    {/* WIDGET 1: Gestión de la ira */}
                    {selectedSpecialty === "Gestión de la ira" && (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[CONSOLA DE BIORRETROALIMENTACIÓN]</span>
                          <span className="text-[10px] font-mono text-gray-500">Manejo de Reacción de Ira</span>
                        </div>
                        
                        {/* Interactive Anger Level Slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-300 font-semibold">Tensión/Irritabilidad Actual:</span>
                            <span className={`font-mono font-bold px-2 py-0.5 rounded ${angerLevel >= 8 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : angerLevel >= 5 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-green-500/20 text-green-400'}`}>
                              {angerLevel} / 10
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={angerLevel}
                            onChange={(e) => setAngerLevel(Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600"
                          />
                        </div>

                        {/* Robert advice based on tension */}
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                          <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider block">CONSEJO PSICOPEDAGÓGICO</span>
                          <p className="text-xs text-gray-300 leading-relaxed font-light">
                            {angerLevel >= 8 ? (
                              "🚨 ZONA ROJA EXTREMA: Detenga de inmediato toda discusión. Su amígdala ha secuestrado su corteza prefrontal, aumentando la probabilidad de emitir una No Conformidad injustificada o desmotivar al equipo operativo. Realice 3 ciclos de la respiración de caja mostrada abajo ahora mismo."
                            ) : angerLevel >= 5 ? (
                              "⚠️ ESTADO DE ALERTA: Siente impaciencia ante explicaciones del operario o retrasos. Respire hondo, recuerde que el SGC busca fallas en el SISTEMA, no en los culpables. Redirija el foco haciendo preguntas metodológicas basadas en la Cláusula 4.4."
                            ) : (
                              "✓ ESTADO ÓPTIMO: Claridad y paciencia asertiva. Su nivel de escucha activa está maximizado, ideal para auditar adecuadamente y educar mientras evalúa."
                            )}
                          </p>
                        </div>

                        {/* Breathing Box Animator */}
                        <div className="pt-4 border-t border-white/5 flex flex-col items-center justify-center space-y-4">
                          <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold tracking-widest">RESPIRACIÓN DE CAJA COOPERATIVA</span>
                          
                          {/* Animated Box Circle */}
                          <div className="relative flex items-center justify-center">
                            <motion.div 
                              animate={{ 
                                scale: breathStage === 'Inhala' ? 1.4 : breathStage === 'Exhala' ? 0.9 : 1.25,
                                borderColor: breathStage === 'Inhala' ? 'rgba(239, 68, 68, 0.6)' : breathStage === 'Retén' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(16, 185, 129, 0.6)'
                              }}
                              transition={{ duration: 3.8, ease: "easeInOut" }}
                              className="w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center bg-black/60 relative z-10 border-red-500"
                            >
                              <span className="text-xs font-mono font-bold text-gray-450 text-[10px]">FASE</span>
                              <span className={`text-sm font-black font-mono tracking-tight ${breathStage === 'Inhala' ? 'text-red-500' : breathStage === 'Retén' ? 'text-amber-500' : 'text-emerald-400'}`}>
                                {breathStage}
                              </span>
                              <span className="text-[9px] text-gray-500 mt-1 font-mono">Cíclico Autónomo</span>
                            </motion.div>
                            
                            {/* Decorative glowing background pulses */}
                            <div className="absolute inset-0 w-32 h-32 rounded-full bg-red-600/5 filter blur-xl animate-pulse"></div>
                          </div>
                          
                          <p className="text-[11px] text-gray-400 text-center max-w-sm italic">
                            "La respiración rítmica oxigena el neocórtex, disolviendo el cortisol que provoca gritos o regaños innecesarios."
                          </p>
                        </div>
                      </div>
                    )}

                    {/* WIDGET 2: Orientación laboral */}
                    {selectedSpecialty === "Orientación laboral" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[ANALIZADOR DE COMPATIBILIDAD DE ROLES (ISO 7.2)]</span>
                          <span className="text-[10px] font-mono text-gray-500">Mapeo de Aptitud</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Ajusta las aptitudes del candidato para mapear en tiempo real su puesto ideal en la arquitectura corporativa:
                        </p>

                        <div className="space-y-3 mt-4">
                          {/* Slide 1 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-300">Afinidad Técnica (Procesos, Planos, Métricas):</span>
                              <span className="font-mono text-white text-[11px] font-bold">{laborAfinidad}%</span>
                            </div>
                            <input 
                              type="range" min="10" max="100" value={laborAfinidad}
                              onChange={(e) => setLaborAfinidad(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                          </div>

                          {/* Slide 2 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-300">Habilidades Blandas (Mediación, Inteligencia Social):</span>
                              <span className="font-mono text-white text-[11px] font-bold">{laborBlandas}%</span>
                            </div>
                            <input 
                              type="range" min="10" max="100" value={laborBlandas}
                              onChange={(e) => setLaborBlandas(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                          </div>

                          {/* Slide 3 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-300">Foco en Detalle / Calidad (Control, Auditoría):</span>
                              <span className="font-mono text-white text-[11px] font-bold">{laborMejora}%</span>
                            </div>
                            <input 
                              type="range" min="10" max="100" value={laborMejora}
                              onChange={(e) => setLaborMejora(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Calculated matches */}
                        {(() => {
                          const auditorMatch = Math.round((laborAfinidad * 0.3 + laborMejora * 0.5 + laborBlandas * 0.2));
                          const coachMatch = Math.round((laborBlandas * 0.6 + laborMejora * 0.1 + laborAfinidad * 0.3));
                          const engineerMatch = Math.round((laborAfinidad * 0.6 + laborMejora * 0.3 + laborBlandas * 0.1));

                          let bestRole = "Especialista Operacional";
                          let bestScore = auditorMatch;
                          if (coachMatch > bestScore) { bestRole = "Facilitador de Equipos / Coach HR"; bestScore = coachMatch; }
                          if (engineerMatch > bestScore) { bestRole = "Ingeniero de Procesos / Diseñador SGC"; bestScore = engineerMatch; }
                          if (auditorMatch >= bestScore) { bestRole = "Auditor Líder de Sistemas de Calidad"; bestScore = auditorMatch; }

                          return (
                            <div className="mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3 text-xs">
                              <span className="text-[10px] font-mono text-red-400 block uppercase font-bold">Diagnóstico de Reubicación de Personal</span>
                              <div className="space-y-2">
                                <div>
                                  <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                                    <span>Auditor SGC (Cláusula 9.2)</span>
                                    <span>{auditorMatch}% de Compatibilidad</span>
                                  </div>
                                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-red-600 h-full transition-all" style={{ width: `${auditorMatch}%` }}></div>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                                    <span>Líder de Talento / Coach Ejecutivo</span>
                                    <span>{coachMatch}% de Compatibilidad</span>
                                  </div>
                                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full transition-all" style={{ width: `${coachMatch}%` }}></div>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                                    <span>Ingeniero de Procesos y Diseño Técnico</span>
                                    <span>{engineerMatch}% de Compatibilidad</span>
                                  </div>
                                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${engineerMatch}%` }}></div>
                                  </div>
                                </div>
                              </div>

                              <p className="text-[11px] text-gray-400 italic mt-2 border-t border-white/5 pt-2">
                                💡 <strong>Recomendación Robert Terán:</strong> El perfil encaja de forma excelente como <strong>{bestRole} ({bestScore}%)</strong>. Su reubicación preventiva reducirá las fallas y elevará su motivación un 45%.
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* WIDGET 3: Impulsividad */}
                    {selectedSpecialty === "Impulsividad" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[SIMULADOR DE RESPUESTA REFLEXIVA]</span>
                          <span className="text-[10px] font-mono text-gray-500">Mecanismo de Retraso de 5s</span>
                        </div>
                        
                        <p className="text-xs text-gray-400 leading-relaxed font-light">
                          Cuando ocurre un desastre de producción, el impulso nos empuja a culpar o gritar de inmediato. Prueba el entrenamiento de Robert Terán para aplazar las respuestas emocionales ciegas:
                        </p>

                        {!impulseActive && !impulseSuccess && (
                          <div className="space-y-4 mt-4">
                            <div className="p-4 bg-red-950/20 border border-red-500/10 rounded-2xl space-y-2 text-xs">
                              <span className="font-mono text-red-500 font-bold block">🚨 ALERTA CRÍTICA DE PRODUCCIÓN:</span>
                              <p className="text-gray-300">
                                Un cliente VIP reporta que el lote recibido tiene ralladuras. El Gerente Comercial exige enojado saber quién es el culpable del embalado inmediatamente para despedirlo.
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  alert("❌ REACCIÓN INCORRECTA: Responder con enojo incrementó la hostilidad interdepartamental. La base de datos demuestra que echar culpas no solucionó el raspado técnico, y desmotivó fuertemente a los embaladores.");
                                }}
                                className="flex-1 py-3 px-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-white text-xs font-bold transition whitespace-normal text-center cursor-pointer"
                              >
                                Reaccionar al Instante (Buscar Culpables)
                              </button>
                              <button
                                onClick={() => {
                                  setImpulseActive(true);
                                  setImpulseTime(5);
                                }}
                                className="flex-1 py-3 px-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-white text-xs font-bold transition whitespace-normal text-center cursor-pointer"
                              >
                                Aplicar la Pausa de 5 Segundos (Método Robert Terán)
                              </button>
                            </div>
                          </div>
                        )}

                        {impulseActive && (
                          <div className="py-8 flex flex-col items-center justify-center space-y-4 bg-black/50 rounded-2xl border border-white/5 mt-4">
                            <span className="w-12 h-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin flex items-center justify-center font-mono font-black text-white text-sm">
                              {impulseTime}
                            </span>
                            <div className="text-center space-y-1 px-4">
                              <span className="text-xs text-red-400 font-mono block uppercase">DESACELERANDO IMPULSO OPERACIONAL</span>
                              <p className="text-xs text-gray-300 italic">
                                {impulseTime === 5 && "Reflexiona: ¿Qué gano señalando un chivo expiatorio?"}
                                {impulseTime === 4 && "Pregúntate: ¿Qué falló en el proceso o en el manual SOP del embalaje?"}
                                {impulseTime === 3 && "Sintetiza de forma científica: ¿Cuáles fueron los parámetros mecánicos?"}
                                {impulseTime === 2 && "Estructura la reunión técnica de análisis de causa raíz FMEA."}
                                {impulseTime === 1 && "Respira, asume el control racional de la junta."}
                              </p>
                            </div>
                          </div>
                        )}

                        {impulseSuccess && (
                          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-3 mt-4 text-xs">
                            <h5 className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase font-mono">
                              ✓ Éxito: Enfoque Ejecutivo Resiliente
                            </h5>
                            <p className="text-gray-300 leading-relaxed font-light font-sans">
                              Su nivel de impulsividad cayó a cero. Robert Terán aprueba esta aproximación. En lugar de generar conflicto con personal asustado que ocultaría la falla, respondes de forma asertiva al Gerente Comercial:
                            </p>
                            <div className="bg-black/50 p-3 rounded-lg font-mono text-[11px] text-emerald-300 border border-emerald-500/10">
                              "Estimado, tomamos nota del reporte. Ya detuvimos preventivamente el despacho y asignamos al equipo de SGC a auditar los engranajes mecánicos del embalaje mediante diagrama de Ishikawa. En 2 horas tendremos la causa y la solución correctiva asegurada."
                            </div>
                            <button
                              onClick={() => {
                                setImpulseSuccess(false);
                                setImpulseTime(5);
                              }}
                              className="text-xs text-gray-400 hover:text-white underline block pt-1"
                            >
                              Repetir Simulación
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* WIDGET 4: Habilidades de afrontamiento */}
                    {selectedSpecialty === "Habilidades de afrontamiento" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[REENCUADRE COGNITIVO EN AUDITORÍA]</span>
                          <span className="text-[10px] font-mono text-gray-500">Afrontamiento Activo</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Selecciona una situación crítica de auditoría que desees reencuadrar con asertividad y técnica psicopedagógica:
                        </p>

                        <div className="space-y-2 mt-4">
                          {[
                            { key: 'hallazgo', label: '1. El auditor de SGS detecta una No Conformidad Mayor.' },
                            { key: 'ceocritic', label: '2. El CEO cuestiona severamente el retorno de inversión del SGC.' },
                            { key: 'perdidatraz', label: '3. Pérdida accidental de registros de lote de materia prima.' }
                          ].map((item, idx) => (
                            <button
                              key={`coping-${item.key}-${idx}`}
                              onClick={() => setCopingScenario(item.key)}
                              className={`w-full p-2.5 rounded-lg text-left text-xs border transition-all ${
                                copingScenario === item.key 
                                  ? 'bg-red-500/10 border-red-500/40 text-white font-semibold' 
                                  : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/10'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>

                        {/* Scenario Content Rendering */}
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3 mt-4 text-xs font-sans">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-lg space-y-1">
                              <span className="text-[10px] font-mono text-red-400 block uppercase font-bold">Respuesta Catastrofista (Pánico)</span>
                              <p className="text-gray-455 text-[11px] leading-relaxed text-gray-400 italic">
                                {copingScenario === 'hallazgo' && '"Esto es un desastre total, vamos a perder el contrato internacional y nos van a despedir de inmediato."'}
                                {copingScenario === 'ceocritic' && '"El jefe tiene razón, la burocracia de las normas ISO es inerte y solo sirve para perder dinero."'}
                                {copingScenario === 'perdidatraz' && '"Ocultaremos la falta de fecha, maquillaremos los registros para que no haya que parar de producir." (Delito operacional)'}
                              </p>
                            </div>

                            <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-lg space-y-1">
                              <span className="text-[10px] font-mono text-emerald-400 block uppercase font-bold">Gobernanza Robert Terán</span>
                              <p className="text-gray-200 text-[11px] leading-relaxed">
                                {copingScenario === 'hallazgo' && '"Un hallazgo es una oportunidad de blindar el proceso. Asumimos la brecha, aplicamos CAPA en lazo cerrado y eliminamos la debilidad sistémica."'}
                                {copingScenario === 'ceocritic' && '"Presentaremos el Costo de No Calidad (Scrap y reclamos) mitigado por el SGC. El orden del proceso ahorra $50k USD anuales operacionales."'}
                                {copingScenario === 'perdidatraz' && '"Detener el lote sospechoso de inmediato, reevaluar mediante muestreo estadístico y rediseñar el control para que no dependa de un formato de papel."'}
                              </p>
                            </div>
                          </div>

                          <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5 font-mono text-[10px] text-gray-400">
                            <strong>Indicador Metodológico:</strong> Detener el catastrofismo preserva el 100% de la autoconfianza directiva, mitigando los errores inducidos por estrés.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WIDGET 5: Problemas emocionales */}
                    {selectedSpecialty === "Problemas emocionales" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[PLAN DE ALINEACIÓN EMOCIONAL GESTALT]</span>
                          <span className="text-[10px] font-mono text-gray-500">Soporte Humano Directivo</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Selecciona tu cuadrante del estado emocional actual para trazar la contención psicopedagógica recomendada de Robert Terán:
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-4 text-sans">
                          {[
                            { id: 'sobrecarga', label: 'Sobrecarga / Agobio', color: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400 font-semibold' },
                            { id: 'apatia', label: 'Apatía / Sin Motivación', color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-400 font-semibold' },
                            { id: 'incertidumbre', label: 'Incertidumbre / Ansiedad', color: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400 font-semibold' },
                            { id: 'calma', label: 'Enfoque / Calma Productiva', color: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-green-400 font-semibold' }
                          ].map((quad, idx) => (
                            <button
                              key={`quad-${quad.id}-${idx}`}
                              onClick={() => setEmotionalQuadrant(quad.id)}
                              className={`py-3 px-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                                emotionalQuadrant === quad.id 
                                  ? 'ring-2 ring-red-500 scale-102 ' + quad.color 
                                  : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/10'
                              }`}
                            >
                              {quad.label}
                            </button>
                          ))}
                        </div>

                        {emotionalQuadrant && (
                          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3 mt-4 text-xs">
                            <span className="text-[10px] font-mono text-red-400 block uppercase font-bold">PRESCRIPCIÓN HUMANISTA GESTALT DE ROBERT TERÁN</span>
                            
                            <p className="text-gray-305 text-gray-300 leading-relaxed font-light font-sans">
                              {emotionalQuadrant === 'sobrecarga' && "📌 Libere espacio cognitivo. Su salud mental es prioritaria para la calidad del engranaje. Delegue auditorías menores en colaboradores capacitados y fije bloques de descompresión física de 15 minutos en el exterior de la planta."}
                              {emotionalQuadrant === 'apatia' && "📌 Falta de propósito en la rutina operacional. Es oportuno rediseñar su organigrama (Cláusula 5.3) para incorporar desafíos desafiantes, rotando funciones de control o iniciando un proyecto de innovación / inteligencia artificial."}
                              {emotionalQuadrant === 'incertidumbre' && "📌 El miedo al cambio o a auditorías venideras paraliza los procesos. Robert Terán sugiere documentar planes preventivos formales (Cláusula 6.1). Al estructurar de forma científica la contingencia en papel, la ansiedad mental disminuye un 60%."}
                              {emotionalQuadrant === 'calma' && "📌 Estado de madurez óptimo. Aproveche este engranaje de paz para realizar el mapeo To-Be de procesos críticos y contagiar mediante coaching dialógico el entusiasmo y el orgullo al capital operativo."}
                            </p>

                            <div className="font-mono text-[10px] text-gray-500 italic pt-1 border-t border-white/5">
                              "En Gestalt, la energía sigue al foco. Si solo enfocamos fallas burocráticas, crearemos frustración. Si enfocamos la capacidad humana, crearemos excelencia."
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* WIDGET 6: Life Coaching */}
                    {selectedSpecialty === "Life Coaching" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[EVALUACIÓN DE RUEDA DE LA EXCELENCIA EXISTENCIAL]</span>
                          <span className="text-[10px] font-mono text-gray-500">Equilibrio Vital de Vida</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Ajusta tu porcentaje de satisfacción actual para diagnosticar el balance de tu rueda existencial:
                        </p>

                        <div className="space-y-3 mt-4 text-xs">
                          {/* Slide 1 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-gray-300 font-medium">
                              <span>Satis. Profesional / Laboral:</span>
                              <span className="font-mono font-bold text-red-400">{lifeCareer}%</span>
                            </div>
                            <input 
                              type="range" min="10" max="100" step="5" value={lifeCareer}
                              onChange={(e) => setLifeCareer(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                          </div>

                          {/* Slide 2 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-gray-300 font-medium">
                              <span>Energía Vital, Deporte & Salud:</span>
                              <span className="font-mono font-bold text-amber-400">{lifeHealth}%</span>
                            </div>
                            <input 
                              type="range" min="10" max="100" step="5" value={lifeHealth}
                              onChange={(e) => setLifeHealth(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                          </div>

                          {/* Slide 3 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-gray-300 font-medium">
                              <span>Armonía Relacional / Familia:</span>
                              <span className="font-mono font-bold text-emerald-400">{lifeRel}%</span>
                            </div>
                            <input 
                              type="range" min="10" max="100" step="5" value={lifeRel}
                              onChange={(e) => setLifeRel(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                          </div>

                          {/* Slide 4 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-gray-300 font-medium">
                              <span>Crecimiento Interior, Zen & Calma:</span>
                              <span className="font-mono font-bold text-indigo-400">{lifeGrowth}%</span>
                            </div>
                            <input 
                              type="range" min="10" max="100" step="5" value={lifeGrowth}
                              onChange={(e) => setLifeGrowth(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>
                        </div>

                        {/* Calculations */}
                        {(() => {
                          const totalSatisfac = Math.round((lifeCareer + lifeHealth + lifeRel + lifeGrowth) / 4);
                          const lowestScore = Math.min(lifeCareer, lifeHealth, lifeRel, lifeGrowth);
                          let priorityArea = "Profesional";
                          if (lowestScore === lifeHealth) priorityArea = "Deporte & Salud";
                          if (lowestScore === lifeRel) priorityArea = "Relaciones Familiares";
                          if (lowestScore === lifeGrowth) priorityArea = "Crecimiento de Consciencia";

                          return (
                            <div className="mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2 text-xs">
                              <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase">
                                <span>Índice de Alineación Integral (Wellness)</span>
                                <span className={`font-black ${totalSatisfac >= 70 ? 'text-green-400' : 'text-amber-500'}`}>{totalSatisfac}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${totalSatisfac}%` }}></div>
                              </div>

                              <p className="text-[11px] text-gray-300 leading-relaxed font-light italic mt-2 font-sans">
                                🌟 <strong>Diagnóstico Life Coaching:</strong> Tu rueda tiene un balance del {totalSatisfac}%. Sin embargo, existe una desviación crítica en <strong>"{priorityArea}" ({lowestScore}%)</strong>. Robert Terán advierte: "Si no alimentas esta dimensión, tu liderazgo ejecutivo se resentirá, causando decisiones cansadas o mal genio en piso dudosamente justificable."
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* WIDGET 7: Problemas relacionales */}
                    {selectedSpecialty === "Problemas relacionales" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[MEDIADOR DE CONFLICTOS INTERDEPARTAMENTALES]</span>
                          <span className="text-[10px] font-mono text-gray-500">Gestión de Silos y Egos</span>
                        </div>
                        <p className="text-xs text-gray-400 font-light">
                          Selecciona una de las batallas departamentales crónicas para simular la resolución mediante diálogo facilitado de Robert Terán:
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-sans">
                          <button
                            onClick={() => { setRelationConflict('prod_cal'); setRelationStyleChosen(null); }}
                            className={`p-2 rounded-lg text-left border cursor-pointer ${relationConflict === 'prod_cal' ? 'bg-red-500/15 border-red-500/30 text-white font-bold' : 'bg-white/[0.01] border-white/5 text-gray-400'}`}
                          >
                            ⚔️ Producción vs Control Calidad
                          </button>
                          <button
                            onClick={() => { setRelationConflict('dir_op'); setRelationStyleChosen(null); }}
                            className={`p-2 rounded-lg text-left border cursor-pointer ${relationConflict === 'dir_op' ? 'bg-red-500/15 border-red-500/30 text-white font-bold' : 'bg-white/[0.01] border-white/5 text-gray-400'}`}
                          >
                            ⚔️ Jefes Ejecutivos vs Sindicato/Operarios
                          </button>
                        </div>

                        <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2 mt-2 text-xs">
                          <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold">DESCRIPCIÓN DEL ENREDO CORPORATIVO</span>
                          <p className="text-gray-300 leading-relaxed font-light font-sans">
                            {relationConflict === 'prod_cal' ? (
                              "Producción exige cumplir con la meta de volumen semanal para cobrar sus bonos. Calidad quiere detener de forma cautelar la línea debido a ligeros ruidos mecánicos en la sopladora antes de estropear el lote."
                            ) : (
                              "La dirección exige un incremento inmediato de 15% del OEE y digitalización del SGC. Los operadores, cansados, sienten que se les exige papeleo burocrático extra sin compensación o ergonomía apropiada."
                            )}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-bold text-red-400 block uppercase">Elige el Estilo de Gobernanza a Aplicar:</span>
                          <div className="grid grid-cols-3 gap-2">
                            {['Agresivo (Imposición)', 'Evitativo (Maquillaje)', 'Asertivo (Método Robert Terán)'].map((style, idx) => {
                              const types = ['agressive', 'evasive', 'assertive'];
                              return (
                                <button
                                  key={`rel-style-btn-${types[idx]}`}
                                  onClick={() => setRelationStyleChosen(types[idx])}
                                  className={`py-2 px-1 rounded bg-white/[0.01] border text-[11px] font-medium transition-all cursor-pointer ${
                                    relationStyleChosen === types[idx] 
                                      ? 'bg-red-500/10 border-red-500 text-white font-bold' 
                                      : 'border-white/5 text-gray-400 hover:border-white/10'
                                  }`}
                                >
                                  {style}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {relationStyleChosen && (
                          <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-xl text-xs space-y-1.5 animate-fadeIn">
                            <span className="text-[10px] font-mono text-red-400 block uppercase font-bold">CONSECUENCIA EN EL SISTEMA DE CALIDAD SGC</span>
                            <p className="text-gray-300 leading-relaxed font-light font-sans">
                              {relationStyleChosen === 'agressive' && "⚠️ El choque eleva la hostilidad. Si se impone Producción, se despacha material no conforme y el cliente VIP detiene el contrato. Si se impone Calidad de forma punitiva, los de Producción esconderán los próximos fallos para no ser castigados."}
                              {relationStyleChosen === 'evasive' && "⚠️ Situación maquillada. Se firman las actas en paz falsa, pero el ruido operacional se mantiene arruinando el engranaje profundo de la sopladora. El lote se despachará tarde de todos modos."}
                              {relationStyleChosen === 'assertive' && "🌟 EXCEPCIONALMENTE CORRECTO: Robert Terán logra mediación asertiva basada en datos. Se detiene la sopladora durante 30 minutos programados (sin impactar gravemente la meta) realizando un mantenimiento rápido preventivo. El personal de piso se siente escuchado y agradecido, reduciendo el scrap un 90%."}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* WIDGET 8: Rendimiento deportivo */}
                    {selectedSpecialty === "Rendimiento deportivo" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[SIMULADOR DE MIHALY CSIKSZENTMIHALYI (PEAK PERFORMANCE)]</span>
                          <span className="text-[10px] font-mono text-gray-500">Flow State de Robert Terán</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Manipula la correspondencia de tus habilidades técnicas contra la severidad del desafío empresarial/deportivo para graficar tu estado mental:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-4 text-xs">
                            <div className="space-y-1">
                              <div className="flex justify-between text-gray-300">
                                <span className="font-bold">Habilidad Autopercibida (Skills):</span>
                                <span className="font-mono text-red-400 font-bold">{sportSkill}%</span>
                              </div>
                              <input 
                                type="range" min="10" max="100" value={sportSkill}
                                onChange={(e) => setSportSkill(Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-gray-300">
                                <span className="font-bold">Complejidad del Reto (Challenge):</span>
                                <span className="font-mono text-amber-500 font-bold">{sportChallenge}%</span>
                              </div>
                              <input 
                                type="range" min="10" max="100" value={sportChallenge}
                                onChange={(e) => setSportChallenge(Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                              />
                            </div>
                          </div>

                          {/* Graphical flow zone outcome */}
                          {(() => {
                            const diff = sportChallenge - sportSkill;
                            let flowStatus = "ESTADO DE FLUJO (FLOW)";
                            let statusColor = "text-green-400 bg-green-500/10 border-green-500/20";
                            let descriptionAdvice = "Impresionante: Tus habilidades coinciden perfectamente con las exigencias del reto directivo/deportivo. Sientes que el tiempo se desvanece y ejecutas con impecabilidad quirúrgica. Robert Terán aprueba mantener esta aceleración.";

                            if (diff > 25) {
                              flowStatus = "ANSIEDAD / PÁNICO OPERATIVO";
                              statusColor = "text-red-500 bg-red-500/10 border-red-500/20";
                              descriptionAdvice = "¡Cuidado! El desafío supera tus herramientas. Sientes parálisis y miedo a la equivocación. Robert recomienda capacitación acelerada (Cláusula 7.2) de forma prioritaria en herramientas Lean o FMEA para equilibrar la balanza.";
                            } else if (diff < -25) {
                              flowStatus = "ABURRIMIENTO / ABATIMIENTO";
                              statusColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
                              descriptionAdvice = "Tus capacidades son enormes, pero el enproceso es rutinario e inerte. Te sientes desmotivado. Es momento de proponer metas ambiciosas como autoría cruzada o aplicar la Inteligencia Artificial ISO 42001.";
                            } else if (sportChallenge < 30 && sportSkill < 30) {
                              flowStatus = "APATÍA COMPLETA";
                              statusColor = "text-gray-400 bg-gray-500/10 border-gray-500/20";
                              descriptionAdvice = "Estancamiento absoluto. Existe un riesgo severo de perder personal clave e incumplir auditorías básicas de mantenimiento. Se requiere diagnóstico urgente de coaching de Gestalt.";
                            }

                            return (
                              <div className="flex flex-col justify-center items-center p-4 rounded-2xl bg-black/50 border border-white/5 text-center">
                                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">CÁLCULO DE SINTONÍA COGNITIVA</span>
                                <span className={`text-[11px] font-black font-mono px-3 py-1 rounded uppercase border ${statusColor}`}>
                                  {flowStatus}
                                </span>
                                <p className="text-[11px] text-gray-300 leading-relaxed font-light mt-3 max-w-xs block font-sans">
                                  {descriptionAdvice}
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* WIDGET 9: Estrés */}
                    {selectedSpecialty === "Estrés" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[MEDIDOR DE SOBREESFUERZO EXTRALIBERAL]</span>
                          <span className="text-[10px] font-mono text-gray-500">Triage de Cortisol</span>
                        </div>
                        <p className="text-xs text-gray-400 font-light">
                          Responde honestamente a las siguientes 4 interrogantes de autodiagnóstico relativas a tu salud diaria:
                        </p>

                        <div className="space-y-2 mt-4 text-xs font-sans">
                          {[
                            { state: stressQ1, setter: setStressQ1, text: "1. ¿Te sientes fatigado mentalmente incluso después de dormir el fin de semana?" },
                            { state: stressQ2, setter: setStressQ2, text: "2. ¿Ha aumentado tu impaciencia o irritabilidad con operadores de piso y proveedores?" },
                            { state: stressQ3, setter: setStressQ3, text: "3. ¿Sufre con frecuencia dolores musculares, tensión cervical o cefaleas?" },
                            { state: stressQ4, setter: setStressQ4, text: "4. ¿Sientes que la formalización excesiva del papeleo SGC te supera cognitivamente?" }
                          ].map((item, idx) => (
                            <div 
                              key={`stress-q-${idx}`}
                              onClick={() => item.setter(!item.state)}
                              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                item.state 
                                  ? 'bg-red-500/5 border-red-500/30 text-white' 
                                  : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/10'
                              }`}
                            >
                              <span className="text-xs font-light">{item.text}</span>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                                item.state ? 'bg-red-600 border-red-500 text-white' : 'border-gray-600'
                              }`}>
                                {item.state && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          ))}
                        </div>

                        {(() => {
                          const checkedCount = [stressQ1, stressQ2, stressQ3, stressQ4].filter(Boolean).length;
                          const ratio = Math.round((checkedCount / 4) * 100);
                          return (
                            <div className="mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2 text-xs">
                              <div className="flex justify-between items-center text-[10px] font-mono uppercase text-gray-400">
                                <span>Índice de Burnout Operacional</span>
                                <span className={`font-black ${ratio >= 75 ? 'text-red-500 animate-pulse' : ratio >= 50 ? 'text-amber-500' : 'text-green-400'}`}>{ratio}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-600 h-full transition-all" style={{ width: `${ratio}%` }}></div>
                              </div>
                              
                              <p className="text-[11px] text-gray-300 leading-relaxed font-light mt-2 italic border-t border-white/5 pt-2 font-sans">
                                {ratio >= 75 ? (
                                  "🚨 PELIGRO DE BURNOUT CLÍNICO: Tu cortisol está arruinando tu concentración y atención. Es sumamente riesgoso liderar auditorías directas en este estado. Robert Terán te prescribe delegar tareas rutinarias y comprometerse con un acompañamiento de terapia psicopedagógica urgente."
                                ) : ratio >= 50 ? (
                                  "⚠️ ESTRÉS EN LÍNEA CRÍTICA: La fatiga está mermando tu disfrute. Estás cerca de la irritabilidad crónica. Robert aconseja implementar 'El Retraso de 5 Segundos' e integrar micro-pausas saludables cada 2 horas de forma obligada."
                                ) : (
                                  "✓ ESTRÉS CONTROLADO: Tu resistencia mental es óptima. Mantén ritmos estables, equilibra tus prioridades familiares y sigue disfrutando del rigor metodológico del SGC."
                                )}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* WIDGET 10: Recursos humanos */}
                    {selectedSpecialty === "Recursos humanos" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">[VALIDADOR DE CAPACIDADES ISO 9001:2015 CLÁUSULA 7.2]</span>
                          <span className="text-[10px] font-mono text-gray-500">Gobernanza de Competencia SGC</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Selecciona el rol organizativo y define su nivel de experiencia para calcular el cumplimiento de entrenamiento requerido por auditores internacionales:
                        </p>

                        <div className="space-y-4 mt-4 text-xs">
                          <div className="space-y-2">
                            <label className="text-gray-300 font-bold uppercase tracking-wider block">Rol Evaluado en Planta:</label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: 'auditor', label: 'Auditor de Calidad' },
                                { id: 'supervisor', label: 'Supervisor de Turno' },
                                { id: 'operator', label: 'Operador de Prensa/Extrusión' }
                              ].map((role, idx) => (
                                <button
                                  key={`hrrole-${role.id}-${idx}`}
                                  onClick={() => setHrRole(role.id)}
                                  className={`py-2 px-1 rounded-lg border text-left font-mono tracking-tight text-[10px] uppercase transition-all cursor-pointer ${
                                    hrRole === role.id 
                                      ? 'bg-red-500/15 border-red-500 text-white font-bold' 
                                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/10'
                                  }`}
                                >
                                  {role.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-gray-300">
                              <span>Nivel de Desempeño Evaluado (1 a 5):</span>
                              <span className="font-mono text-red-400 font-bold">Nivel {hrLevel}</span>
                            </div>
                            <input 
                              type="range" min="1" max="5" step="1" value={hrLevel}
                              onChange={(e) => setHrLevel(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                          </div>
                        </div>

                        {/* Analysis response representation */}
                        {(() => {
                          let compliance = 100;
                          let advice = "";
                          let plans: string[] = [];

                          if (hrRole === 'auditor') {
                            compliance = hrLevel * 20;
                            advice = "El auditor del SGC requiere dominio de ISO 9001 e ISO 19011. Un nivel inferior a 4 puede inducir omisiones de no-conformidades mayores.";
                            plans = ["Curso de ISO 19011 Directrices de Auditoría", "Taller Práctico de Hallazgos y Enfoque de Procesos", "Coaching de Feedback Asertivo 360", "Módulo de Psicopedagogía para Auditorías Amables"];
                          } else if (hrRole === 'supervisor') {
                            compliance = hrLevel * 18 + 10;
                            advice = "El supervisor es el guardián de la Cláusula 8.1. Requiere liderazgo asertivo para no presionar operarios de forma hostil.";
                            plans = ["Introducción a Cláusulas del SGC Operacional", "Curso Rápido de 5S & Kaizen de Planta", "Taller de Manejo del Estrés & Biorregulación", "Ingeniería de Costos de Calidad de Piso"];
                          } else {
                            compliance = hrLevel * 15 + 25;
                            advice = "El operador requiere saber de forma unívoca su contribución SGC. Un nivel inferior a 3 causa fallas físicas y scrap descontrolado.";
                            plans = ["Mapeo SOP Visual de Instrucciones de Trabajo", "Módulo de Ergonomía y Atención Concentrada", "Entrenamiento Práctico ante Alertas Mecánicas", "Psicopedagogía Aplicada de Seguridad Industrial"];
                          }

                          return (
                            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3 mt-4 text-xs font-sans">
                              <div className="flex justify-between items-center font-mono">
                                <span className="text-red-400 font-bold block uppercase">Conformidad de Competencia ISO / HR</span>
                                <span className={`font-black ${compliance >= 80 ? 'text-green-400' : 'text-amber-500'}`}>{compliance}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-600 h-full transition-all" style={{ width: `${compliance}%` }}></div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold text-left">Plan de Capacitación Táctico (Robert Terán):</span>
                                <div className="flex flex-wrap gap-1.5 mt-1.5 text-left">
                                  {plans.map((p, i) => (
                                    <span key={`plan-${i}-${p}`} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-mono font-semibold text-red-500">
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <p className="text-[11px] text-gray-400 italic leading-relaxed pt-2 border-t border-white/5 text-left">
                                💡 <strong>Avisos de Auditor Internacional:</strong> {advice} El entrenamiento propuesto elevará la certidumbre técnica a un 98%.
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[10px] font-mono text-gray-500 italic block text-center sm:text-left">
                      "Un proceso SGC es tan fuerte como el eslabón humano más desatendido de su cadena."
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedSpecialty(null);
                        const contactBtn = document.getElementById("agendar");
                        if (contactBtn) contactBtn.scrollIntoView({ behavior: 'smooth' });
                        else window.location.href = '#agendar';
                      }}
                      className="w-full sm:w-auto bg-red-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 transition cursor-pointer"
                    >
                      Solicitar Acompañamiento
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <UserProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          data={data}
        />

        <CurriculumShowcaseModal
          isOpen={isCurriculumModalOpen}
          onClose={() => setIsCurriculumModalOpen(false)}
        />
      </AnimatePresence>
      <ChatWidget />
      
      {/* Botón flotante de WhatsApp */}
      <a 
        href={`https://wa.me/584143431185?text=${encodeURIComponent("Hola Robert, vengo de tu portafolio web. Me gustaría obtener más información sobre tus servicios.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 p-4 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#20bd5a] hover:scale-110 transition-all z-50 flex items-center justify-center group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-6 h-6">
          <path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.88L2 22l5.24-1.12c1.42.75 3.03 1.15 4.75 1.15 5.52 0 10-4.48 10-10S17.51 2 11.99 2zm-.01 18.25c-1.48 0-2.88-.38-4.1-1.05l-.3-.17-3.05.65.81-2.97-.19-.31T3.75 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25zm4.4-6.03c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.47-.4-.41-.54-.42l-.46-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.09 3.62 2.4 1.04 2.4 1.04 2.84 0 0-.16 1.1-1.34 1.25-1.81.15-.47.15-.87.11-.95-.04-.08-.2-.12-.44-.24z"/>
        </svg>
        <span className="absolute left-16 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
          Chat directo
        </span>
      </a>
      </div>
    </div>
  );
}
