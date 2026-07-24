import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, Users, Globe, Linkedin, Mail, Award, Network, Workflow, 
  FileCheck, Activity, CheckCircle2, Menu, X, Brain, BarChart3, 
  ShieldAlert, LineChart, Rocket, ClipboardCheck, Briefcase, Map, 
  Quote, ArrowRight, Image as ImageIcon, Layers, Play, Sliders, 
  RotateCcw, Terminal, Check, HelpCircle, CheckSquare, TrendingUp, 
  AlertTriangle, GraduationCap 
} from 'lucide-react';
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

// ✅ iconMap COMPLETO
const iconMap: Record<string, any> = {
  ShieldCheck, Network, Workflow, Brain, BarChart3, ShieldAlert, LineChart, 
  Rocket, Award, ClipboardCheck, Map, FileCheck, Activity, CheckCircle2,
  Users, GraduationCap, Briefcase, Quote, ArrowRight, ImageIcon, Layers,
  Terminal, Check, AlertTriangle, Menu, X, Play, Sliders, RotateCcw,
  HelpCircle, CheckSquare, TrendingUp,
};

const getIcon = (iconName: string) => iconMap[iconName] || Activity;

const allData = {
  es: dataES,
  en: dataEN,
  pt: dataPT,
  it: dataIT
};

const corporateBackgrounds = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1416949929422-a1d9c2014dcf?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1920'
];

const skillDetails: Record<string, { rating: string; info: Record<string, string>; systemLog: string }> = {
  "ISO Gestión de Calidad": {
    rating: "98% Calidad",
    info: {
      es: "Configuración, estructuración y auditoría líder de sistemas bajo el marco ISO 9001.",
      en: "Configuration, structuring, and leading system audits under ISO 9001.",
      pt: "Configuração, estruturação e auditoria líder de sistemas sob o padrão ISO 9001.",
      it: "Configurazione, strutturazione e conduzione di audit di sistema sotto lo standard ISO 9001."
    },
    systemLog: "SYS_ISO_ACTIVE // 0_NON_CONFORMITIES"
  },
  "Estructuras de Empresas": {
    rating: "95% Estructura",
    info: {
      es: "Reorganización de organigramas corporativos y jerarquías ágiles.",
      en: "Reorganization of corporate organigrams and agile hierarchies.",
      pt: "Reorganização de organogramas corporativos e hierarquias ágeis.",
      it: "Riorganizzazione degli organigrammi aziendali e delle gerarchie agili."
    },
    systemLog: "ROLES_SYNCED // HR_INDEX: 1.0"
  },
  "Mapeo de Procesos": {
    rating: "97% BPMN Diagram",
    info: {
      es: "Levantamientos de flujos operativos As-Is y diseño de estados futuros To-Be.",
      en: "As-Is operational workflows gathering and design of future To-Be state.",
      pt: "Mapeamento de fluxos operacionais As-Is e design de estados futuros To-Be.",
      it: "Rilevamento dei flussi operativi As-Is e progettazione dello stato futuro To-Be."
    },
    systemLog: "MAPPING_OK // FLOW_STABLE"
  },
  "Análisis Crítico": {
    rating: "100% Diagnóstico",
    info: {
      es: "Diagnósticos rigurosos basados en datos reales.",
      en: "Rigorous diagnostics based on real data.",
      pt: "Diagnósticos rigorosos com base em dados reais.",
      it: "Diagnostica rigorosa basata su dati reali."
    },
    systemLog: "CRITICAL_PATH_LOADED // NO_LAG"
  },
  "Análisis de Gestión": {
    rating: "94% KPI Analytics",
    info: {
      es: "Construcción de cuadros de mando integrados con métricas de desempeño claves.",
      en: "Construction of dashboards integrated with key performance indicators.",
      pt: "Construção de painéis integrados com indicadores de desempenho.",
      it: "Costruzione di quadri di comando integrati con indicatori chiave di prestazione."
    },
    systemLog: "DASHBOARD_LIVE // SYNC_99_8"
  },
  "Análisis de Riesgo": {
    rating: "96% Mitigación",
    info: {
      es: "Análisis proactivo de vulnerabilidades mediante matrices de riesgo AMFE.",
      en: "Proactive vulnerability analysis through FMEA risk matrices.",
      pt: "Análise proativa de vulnerabilidades por meio de matrizes de risco FMEA.",
      it: "Analisi proattiva delle vulnerabilità tramite matrici di rischio FMEA."
    },
    systemLog: "MITIGATION_STATE_OK // SAFETY_MAX"
  },
  "Análisis de Mercado": {
    rating: "92% Retail SR",
    info: {
      es: "Estudio profundo de tendencias de consumo masivo.",
      en: "In-depth study of mass consumer trends.",
      pt: "Estudo aprofundado das tendências de consumo de massa.",
      it: "Studio approfondito delle tendenze dei consumi di massa."
    },
    systemLog: "RETAIL_INDEX_LOADED // SR_EXEC"
  },
  "Emprendimiento & Startup": {
    rating: "93% Growth",
    info: {
      es: "Formación financiera y de negocio para la escala rápida de nuevas startups.",
      en: "Financial and business training for rapid scaling of startups.",
      pt: "Treinamento financeiro e de negócios para escala rápida de startups.",
      it: "Formazione finanziaria e aziendale per la scalata rapida di startup."
    },
    systemLog: "STARTUP_OK // SCALE_READY"
  },
  "IBM 2025 Coach": {
    rating: "100% Coach IBM",
    info: {
      es: "Metodología avanzada de potenciamiento humano y coaching ejecutivo directo.",
      en: "Advanced methodology for human empowerment and direct executive coaching.",
      pt: "Metodologia avançada para o empoderamento humano e coaching executivo direto.",
      it: "Metodologia avanzata per il potenziamento umano e coaching esecutivo diretto."
    },
    systemLog: "COACHING_ENGINE_ONLINE // LIFE_SYNC"
  },
  "Auditor Leader": {
    rating: "99% IRCA Leader",
    info: {
      es: "Registro y facultad internacional acreditada IRCA para dirección de auditorías.",
      en: "IRCA international registration and authority to direct audits.",
      pt: "Registro internacional IRCA e autoridade para dirigir auditorias.",
      it: "Registrazione internazionale IRCA e autorità per dirigere audit."
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

// ✅ DATOS POR DEFECTO (fallback completo)
const DEFAULT_DATA = {
  profile: { 
    name: 'Robert Terán', 
    coachTitle: 'Ingeniero, Economista y Especialista en Sistemas de Gestión Integral',
    bio: 'Especialista en Sistemas de Gestión ISO con más de 30 años de experiencia.',
    quote: 'Integro la precisión técnica de la ingeniería con el análisis económico estratégico.',
    experienceYears: '30',
    linkedin: 'https://www.linkedin.com/in/robertteran/',
    email: 'robert@coach-iso.eu'
  },
  about: { 
    badge: 'Perfil Profesional', 
    badges: [
      { label: 'ISO Gestión de Calidad', icon: 'ShieldCheck' },
      { label: 'Estructuras de Empresas', icon: 'Network' },
      { label: 'Mapeo de Procesos', icon: 'Workflow' },
      { label: 'Análisis Crítico', icon: 'Brain' },
      { label: 'Análisis de Gestión', icon: 'BarChart3' },
      { label: 'Análisis de Riesgo', icon: 'ShieldAlert' },
      { label: 'Análisis de Mercado', icon: 'LineChart' },
      { label: 'Emprendimiento & Startup', icon: 'Rocket' },
      { label: 'IBM 2025 Coach', icon: 'Award' },
      { label: 'Auditor Leader', icon: 'ClipboardCheck' }
    ],
    career: [
      {
        area: 'Auditoría & Calidad',
        description: 'Coordinador de Calidad y Procesos en Rototech, liderando la implementación de mejoría continua.',
        roles: ['Auditor Líder IRCA', 'Coordinador de Calidad', 'Gestor de Procesos']
      },
      {
        area: 'Gestión Estratégica',
        description: 'Gerente de Calidad y Producción en D\'classe Papeis, implementando sistemas automatizados.',
        roles: ['Gerente de Calidad', 'Gestor de Producción', 'Líder de Equipos']
      },
      {
        area: 'Cadena de Suministro',
        description: 'Analista de Compras Senior en General Motors, gestionando la adquisición de insumos críticos.',
        roles: ['Analista de Compras', 'Gestión de Proveedores', 'Negociación Estratégica']
      }
    ]
  },
  expertise: { 
    areas: [
      {
        title: 'Sistemas de Gestión ISO',
        icon: 'ShieldCheck',
        items: ['Auditoría Líder ISO 9001, 14001, 45001, 27001, 22000, 42001', 'Implementación y certificación de Sistemas de Gestión Integral']
      },
      {
        title: 'Optimización de Procesos',
        icon: 'Workflow',
        items: ['Lean Manufacturing y Six Sigma (Green Belt)', 'Mapeo de procesos BPMN y diagramas de flujo']
      },
      {
        title: 'Coaching Estratégico',
        icon: 'Brain',
        items: ['IBM 2025 Executive Coach', 'Desarrollo de liderazgo y equipos de alto rendimiento']
      },
      {
        title: 'Análisis Financiero',
        icon: 'BarChart3',
        items: ['Evaluación de Costo de Calidad (COQ)', 'Análisis de rentabilidad y optimización de inventarios']
      }
    ]
  },
  certifications: [
    { title: 'Auditor Líder ISO', subtitle: 'IRCA Certified', description: 'Sistemas de Gestión (9001, 14001, 27001, 45001, 22000, 42001)' },
    { title: 'IBM 2025 Coach', subtitle: 'Executive Coach', description: 'Liderazgo y Transformación de equipos digitales' },
    { title: 'CIA - Certified Internal Auditor', subtitle: 'IIA Certified', description: 'Auditoría interna global, otorgada por el IIA' },
    { title: 'CISA - Certified Information Systems Auditor', subtitle: 'ISACA Certified', description: 'Control y seguridad de sistemas de información' },
    { title: 'CPA - Certified Public Accountant', subtitle: 'Financial Expert', description: 'Evaluación integral del área financiera' },
    { title: 'CRMA - Certification in Risk Management Assurance', subtitle: 'Risk Management', description: 'Mitigación y aseguramiento ante riesgos' }
  ],
  testimonials: [
    { name: 'Carlos Mendoza', title: 'CEO, Empresa Líder en Manufactura', quote: 'Robert Terán transformó nuestra cultura de calidad.' },
    { name: 'Ana Silva', title: 'Directora de Operaciones, Multinacional', quote: 'La metodología de Robert para optimizar procesos es excepcional.' },
    { name: 'Roberto Gómez', title: 'Gerente de Calidad, Sector Automotriz', quote: 'Su experiencia en auditoría líder ISO ha sido fundamental.' }
  ],
  metrics: { yearsExperience: '30+', label: 'Años de Experiencia' },
  services: { 
    badge: 'Mis Servicios', 
    title: 'Suite Integral de Gestión',
    auditorTitle: 'Sistemas de Gestión Integral',
    auditorDesc: 'Ingeniería, economía y optimización',
    coachTitle: 'Optimización de Procesos',
    coachDesc: 'Eficiencia, rentabilidad y estructura',
    consultingTitle: 'Consultoría Estratégica',
    consultingDesc: 'Análisis, diagnóstico y transformación organizacional'
  }
};

// ✅ Función para obtener arrays de forma segura
const safeArray = (value: any): any[] => {
  return Array.isArray(value) ? value : [];
};

export default function App() {
  const { t, i18n } = useTranslation();
  
  // ✅ OBTENER DATOS CON FALLBACK
  const currentLang = i18n.language as keyof typeof allData;
  const rawData = allData[currentLang];
  const data = rawData && typeof rawData === 'object' ? rawData : DEFAULT_DATA;

  const { profile, loading: profileLoading } = useProfileSettings();

  const [bgImage, setBgImage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedCoachingPillar, setSelectedCoachingPillar] = useState<'decision' | 'psicopedagogia' | 'cohesion' | null>(null);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  const [scrollY, setScrollY] = useState(0);
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);
  const [activeCareerIdx, setActiveCareerIdx] = useState(0);

  // SGC Simulator
  const [sgcSimulatorMode, setSgcSimulatorMode] = useState<'diagram' | 'interactive'>('interactive');
  const [sgcInput, setSgcInput] = useState<string>('requisitos_tecnicos');
  const [sgcComplexity, setSgcComplexity] = useState<string>('media');
  const [sgcControlMode, setSgcControlMode] = useState<string>('fmea');
  const [sgcsimulating, setSgcsimulating] = useState<boolean>(false);
  const [sgcSimResult, setSgcSimResult] = useState<any>(null);
  const [sgcLogs, setSgcLogs] = useState<string[]>([]);

  // Audit Checklist
  const [auditChecklist, setAuditChecklist] = useState<Record<string, boolean>>({
    '4.4': true,
    '5.3': false,
    '6.1': false,
    '8.1': false,
    '9.3': false,
    '10.2': false,
  });

  // Estados para modales interactivos
  const [riskProbability, setRiskProbability] = useState<number>(3);
  const [riskImpact, setRiskImpact] = useState<number>(3);
  const [coqPrev, setCoqPrev] = useState<number>(3000);
  const [coqExtFail, setCoqExtFail] = useState<number>(8000);
  const [leadershipStyle, setLeadershipStyle] = useState<string>('coaching');
  const [cisaBackups, setCisaBackups] = useState<boolean>(true);
  const [cisaAuditLogs, setCisaAuditLogs] = useState<boolean>(false);
  const [cisaSecControls, setCisaSecControls] = useState<boolean>(true);
  const [ciaFocusDept, setCiaFocusDept] = useState<string>('operaciones');

  // Specialties interactive states
  const [angerLevel, setAngerLevel] = useState<number>(5);
  const [breathStage, setBreathStage] = useState<'Inhala' | 'Retén' | 'Exhala' | 'Pausa'>('Pausa');
  const [laborAfinidad, setLaborAfinidad] = useState<number>(50);
  const [laborBlandas, setLaborBlandas] = useState<number>(50);
  const [laborMejora, setLaborMejora] = useState<number>(50);
  const [impulseActive, setImpulseActive] = useState<boolean>(false);
  const [impulseSuccess, setImpulseSuccess] = useState<boolean>(false);
  const [impulseTime, setImpulseTime] = useState<number>(5);
  const [copingScenario, setCopingScenario] = useState<string>('hallazgo');
  const [emotionalQuadrant, setEmotionalQuadrant] = useState<string | null>(null);
  const [lifeCareer, setLifeCareer] = useState<number>(60);
  const [lifeHealth, setLifeHealth] = useState<number>(50);
  const [lifeRel, setLifeRel] = useState<number>(40);
  const [lifeGrowth, setLifeGrowth] = useState<number>(70);
  const [relationConflict, setRelationConflict] = useState<string>('prod_cal');
  const [relationStyleChosen, setRelationStyleChosen] = useState<string | null>(null);
  const [sportSkill, setSportSkill] = useState<number>(50);
  const [sportChallenge, setSportChallenge] = useState<number>(50);
  const [stressQ1, setStressQ1] = useState<boolean>(false);
  const [stressQ2, setStressQ2] = useState<boolean>(false);
  const [stressQ3, setStressQ3] = useState<boolean>(false);
  const [stressQ4, setStressQ4] = useState<boolean>(false);
  const [hrRole, setHrRole] = useState<string>('auditor');
  const [hrLevel, setHrLevel] = useState<number>(2);

  // ✅ OBTENER DATOS DE FORMA SEGURA
  const badges = safeArray(data?.about?.badges);
  const career = safeArray(data?.about?.career);
  const expertiseAreas = safeArray(data?.expertise?.areas);
  const certifications = safeArray(data?.certifications);
  const testimonials = safeArray(data?.testimonials);
  const activeBadge = badges.length > 0 ? badges[activeSkillIdx] || badges[0] : null;

  // Efectos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const randomIndex = Math.floor(Math.random() * corporateBackgrounds.length);
    setBgImage(corporateBackgrounds[randomIndex]);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  // Impulse timer
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

  // Breathing timer
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

  // SGC Simulation
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
        feedback = "MODELO DE EXCELENCIA (Robert Terán Aprueba): El engranaje de la Cláusula 4.4 funciona de manera alineada.";
        logs.push("📈 [PHVA - PLAN] Estructura de riesgos cargada según ISO 31000.");
        logs.push("👷 [PHVA - DO] Ejecución controlada en puesto de trabajo.");
        logs.push("📊 [PHVA - CHECK] Métricas de mermas e indicadores en rango óptimo.");
        logs.push("🏁 [PHVA - ACT] Estándar preventivo consolidado.");
      } else if (sgcControlMode === '100%_control') {
        conformance = sgcComplexity === 'baja' ? 100 : (sgcComplexity === 'media' ? 99.3 : 98.2);
        coqSaving = sgcComplexity === 'baja' ? 15000 : (sgcComplexity === 'media' ? 9000 : 3000);
        title = "Control Operativo Exhaustivo (Cuello de Botella)";
        feedback = "CONTROL EXHAUSTIVO PERO COSTOSO: Monitorear el 100% de las piezas en piso asegura que no salgan productos defectuosos.";
        logs.push("⚡ [PHVA - DO] Filtro técnico activo. Inspección absoluta.");
        logs.push("⚠️ [PHVA - CHECK] Costos de evaluación exceden límites de madurez.");
      } else {
        conformance = sgcComplexity === 'baja' ? 91.5 : (sgcComplexity === 'media' ? 82.3 : 69.8);
        coqSaving = -18000;
        title = "Rendimiento Reactivo Vulnerable";
        feedback = "RIESGO DE NO-CONFORMIDAD CRÍTICO: Realizar muestreos esporádicos en sistemas con complejidad media-alta es altamente peligroso.";
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

  const closeMenu = () => setIsMenuOpen(false);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    closeMenu();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ✅ PANTALLA DE CARGA
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03050C]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-sm">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // ✅ Si no hay datos, mostrar error
  if (badges.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03050C]">
        <div className="text-center max-w-md px-4">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl text-white font-bold mb-2">Error al cargar los datos</h2>
          <p className="text-gray-400 text-sm">
            No se pudieron cargar los datos de la aplicación. Por favor, recarga la página.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-hidden min-h-screen text-gray-200 font-sans selection:bg-[#00F0FF]/30">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${bgImage})`, opacity: bgImage ? 1 : 0 }}
      />
      <div 
        className="fixed inset-0 z-0 bg-[#03050C] transition-all duration-300 pointer-events-none"
        style={{
          backdropFilter: `blur(${Math.max(1, 14 - (scrollY / 35))}px)`,
          backgroundColor: `rgba(3, 5, 12, ${Math.max(0.42, 0.88 - (scrollY / 1000))})`
        }}
      />

      <div className="relative z-10 flex flex-col">
        {/* NAV */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] max-w-4xl">
          <div className="glass rounded-full px-4 md:px-6 py-3 flex justify-between items-center border border-white/10">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsProfileModalOpen(true)}>
              <div className="w-9 h-9 rounded-full border-2 border-red-600 overflow-hidden bg-white/5 group-hover:scale-110 transition-transform">
                <img 
                  src={profile?.photoUrl || undefined} 
                  alt={profile?.name || 'Robert Terán'}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold tracking-tighter hidden sm:block uppercase">
                {profile?.name || 'Robert Terán'}
              </span>
            </div>
            
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

            <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
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
                  className="text-left text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition text-gray-300 hover:text-white hover:bg-white/5"
                >
                  {t('nav.perfil')}
                </button>
                <button 
                  onClick={() => { setIsCurriculumModalOpen(true); closeMenu(); }} 
                  className="text-left text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition text-amber-400 hover:bg-amber-500/10 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Currículo & Certificados</span>
                </button>
                <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition text-gray-300 hover:text-white hover:bg-white/5">{t('nav.servicios')}</a>
                <a href="#procesos" onClick={(e) => handleNavClick(e, 'procesos')} className="text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition text-gray-300 hover:text-white hover:bg-white/5">{t('nav.procesos')}</a>
                <a href="#certifications" onClick={(e) => handleNavClick(e, 'certifications')} className="text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition text-gray-300 hover:text-white hover:bg-white/5">{t('nav.certificaciones')}</a>
                
                <div className="flex gap-2 justify-center py-3 border-t border-white/10 mt-2">
                  <button onClick={() => { changeLanguage('es'); closeMenu(); }} className={`px-3 py-1 rounded-md text-sm font-semibold transition ${i18n.language === 'es' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>ES</button>
                  <button onClick={() => { changeLanguage('en'); closeMenu(); }} className={`px-3 py-1 rounded-md text-sm font-semibold transition ${i18n.language === 'en' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>EN</button>
                  <button onClick={() => { changeLanguage('pt'); closeMenu(); }} className={`px-3 py-1 rounded-md text-sm font-semibold transition ${i18n.language === 'pt' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>PT</button>
                  <button onClick={() => { changeLanguage('it'); closeMenu(); }} className={`px-3 py-1 rounded-md text-sm font-semibold transition ${i18n.language === 'it' ? 'bg-red-600 text-white' : 'hover:text-white'}`}>IT</button>
                </div>

                <div className="h-px w-full bg-white/10 my-2" />
                <Link to="/normas" onClick={closeMenu} className="text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition text-blue-400 hover:bg-white/5">Visualizador ISO</Link>
                <Link to="/agendar" onClick={closeMenu} className="bg-red-600 text-white px-4 py-4 rounded-xl hover:bg-red-700 transition text-center font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  {t('footer.agendar')}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* HERO SECTION */}
        <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00F0FF]/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#FF007A]/10 blur-[130px] rounded-full pointer-events-none" />

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

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 relative z-10 bg-black/40 backdrop-blur-md border-t border-white/5">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 relative group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 relative">
                    <img 
                      src={profile?.photoUrl || undefined} 
                      alt={profile?.name || 'Robert Terán'}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-2xl border border-white/10 backdrop-blur-md">
                      <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-1">{profile?.coachTitle || data?.profile?.coachTitle}</p>
                      <p className="text-white font-bold text-lg">{profile?.name || data?.profile?.name}</p>
                    </div>
                  </div>

                  <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-red-600/30 rounded-tl-3xl -z-10" />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-red-600/30 rounded-br-3xl -z-10" />
                </motion.div>
              </div>

              <div className="lg:col-span-7 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
                    {t('about.badge') || data?.about?.badge}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                    Más de <span className="text-red-600">{profile?.experienceYears || data?.profile?.experienceYears || '30'} años</span> de Excelencia
                  </h2>
                  <div className="w-20 h-1 bg-red-600 mb-8" />
                  
                  <p className="text-gray-300 text-lg font-light leading-relaxed mb-8">
                    {profile?.bio || data?.profile?.bio}
                  </p>
                  
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 relative overflow-hidden group">
                    <Quote className="absolute -top-2 -right-2 w-24 h-24 text-white/5 group-hover:text-red-500/10 transition-colors" />
                    <p className="text-gray-400 italic text-lg relative z-10 leading-relaxed">
                      "{profile?.quote || data?.profile?.quote}"
                    </p>
                  </div>

                  <h4 className="text-xs uppercase tracking-widest font-mono text-[#00F0FF] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-ping" />
                    <span>[CONSOLE DE STATUS DE SISTEMAS // ROBERT_TERAN.EXE]</span>
                  </h4>

                  {/* BADGES */}
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    {badges.map((badge: any, idx: number) => {
                      const Icon = getIcon(badge.icon);
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

                  {/* ACTIVE BADGE DETAIL */}
                  {activeBadge && (() => {
                    const detail = skillDetails[activeBadge.label] || { 
                      rating: "95% Óptimo", 
                      info: { es: "Excelente capacidad analítica y resolución sistémica." },
                      systemLog: "GENERIC_PERFORMANCE_LOADER // 2026_INDEX" 
                    };
                    const currentLang = i18n.language || "es";
                    const resolvedInfo = detail.info?.[currentLang] || detail.info?.["es"] || Object.values(detail.info || {})[0];
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
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/25 to-transparent" />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3 mb-3 border-white/5">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isFuchsiaSkill ? 'bg-[#FF007A]' : 'bg-[#00F0FF]'}`} />
                            <span className="text-white font-bold text-sm tracking-tight">{activeBadge.label}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            isFuchsiaSkill ? 'bg-[#FF007A]/15 text-[#FF007A]' : 'bg-[#00F0FF]/15 text-[#00F0FF]'
                          }`}>
                            {detail.rating}
                          </span>
                        </div>

                        <p className="text-gray-300 font-sans text-sm leading-relaxed mb-4">
                          {resolvedInfo || 'Información no disponible'}
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

        {/* CAREER SECTION */}
        <section className="py-24 bg-[#050814]/45 relative z-10 border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
          
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
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                <span>PULSO_OPERATIVO: ACTIVO</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-6 space-y-4">
                {career.map((block: any, idx: number) => {
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
                      {isActive && (
                        <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${
                          isFuchsia ? 'via-[#FF007A]' : 'via-[#00F0FF]'
                        } to-transparent opacity-85`} />
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
                        {safeArray(block?.roles).map((role: string, i: number) => (
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
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-30 pointer-events-none" />

                    <div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-8">
                        <div className="flex items-center gap-2.5 font-mono">
                          <span className={`w-2 h-2 rounded-full ${activeCareerIdx === 0 ? 'bg-[#FF007A]' : 'bg-[#00F0FF]'} animate-pulse`} />
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

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {activeCareerIdx === 0 ? (
                          <>
                            <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Eficiencia Comercial</p>
                              <p className="text-3xl font-black text-[#FF007A] font-mono leading-none">98.6%</p>
                              <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                                <div className="bg-[#FF007A] h-full" style={{ width: '98.6%' }} />
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
                                <div className="bg-[#FF007A] h-full" style={{ width: '94.2%' }} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-[#090D1A]/50 border border-white/[0.03] p-5 rounded-2xl text-left">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Cumplimiento ISO 9001</p>
                              <p className="text-3xl font-black text-[#00F0FF] font-mono leading-none">100%</p>
                              <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                                <div className="bg-[#00F0FF] h-full" style={{ width: '100%' }} />
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
                                <div className="bg-[#00F0FF] h-full" style={{ width: '10%' }} />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

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
                {t('services.badge') || data?.services?.badge}
              </span>
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-none">
                {t('services.title') || data?.services?.title} <br />
                <span className="text-gray-500 font-light text-2xl md:text-3xl">Líneas de Operación Estratégica</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
              {/* Card 1: ISO Expert */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-2 md:row-span-2 glass rounded-3xl p-8 bento-card futuristic-card flex flex-col justify-end relative overflow-hidden group cursor-pointer border-[#FF007A]/15 hover:border-[#FF007A] bg-[#090D1A]/50 hover:bg-[#FF007A]/5 shadow-[0_0_30px_rgba(255,0,122,0.03)]"
              >
                <Link to="/normas?tab=auditorias" className="absolute inset-0 z-10" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FF007A]/10 to-transparent pointer-events-none rounded-full blur-3xl" />
                
                <ShieldCheck className="absolute top-8 right-8 w-16 h-16 text-[#FF007A]/20 group-hover:scale-110 group-hover:text-[#FF007A]/40 group-hover:drop-shadow-[0_0_15px_rgba(255,0,122,0.8)] transition-all duration-500" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF007A] mb-2 uppercase block">CLÁUSULA 9.2 // AUDITORÍA DE TERCERA PARTE</span>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#FF007A] transition-colors">{t('services.auditorTitle') || data?.services?.auditorTitle}</h3>
                <p className="text-gray-400 text-sm max-w-md leading-relaxed">{t('services.auditorDesc') || data?.services?.auditorDesc}</p>
                
                <div className="mt-5 text-xs font-mono font-bold text-[#FF007A] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 uppercase">
                  <span>[ABRIR_MÓDULO_DETALLES]</span> 
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>

              {/* Card 2: Coaching */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-2 glass rounded-3xl p-8 bento-card futuristic-card flex items-center gap-6 group cursor-pointer border-[#00F0FF]/15 hover:border-[#00F0FF] bg-[#090D1A]/50 hover:bg-[#00F0FF]/5 shadow-[0_0_30px_rgba(0,240,255,0.03)] relative"
              >
                <Link to="/normas?tab=liderazgo" className="absolute inset-0 z-10" />
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F0FF]/10 to-transparent pointer-events-none rounded-full blur-2xl" />
                
                <div className="w-16 h-16 bg-[#00F0FF]/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00F0FF]/25 border border-[#00F0FF]/20 transition-colors">
                  <Users className="text-[#00F0FF] w-8 h-8 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all duration-300" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-[#00F0FF]/80 uppercase block mb-1">PROGRAMA INTEGRAL IBM</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#00F0FF] transition-colors">{t('services.coachTitle') || data?.services?.coachTitle}</h3>
                  <p className="text-gray-400 text-sm italic">{t('services.coachDesc') || data?.services?.coachDesc}</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs font-mono font-bold text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>[VER_INFO]</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>

              {/* Card 3: Core Value */}
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

              {/* Card 4: Metrics */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:col-span-1 glass rounded-3xl p-6 bento-card futuristic-card flex flex-col items-center justify-center text-center group border-[#FF007A]/10 hover:border-[#FF007A]/40 bg-[#090D1A]/40 relative cursor-pointer"
              >
                <Link to="/normas?tab=dashboard" className="absolute inset-0 z-10" />
                <span className="text-4xl font-extrabold text-white group-hover:scale-110 group-hover:text-[#FF007A] transition-all duration-300 font-mono tracking-tighter">
                  {data?.metrics?.yearsExperience || '30+'}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#FF007A] font-mono font-bold mt-1">
                  {data?.metrics?.label || 'Años de Experiencia'}
                </span>
                
                <div className="mt-3 text-[9px] font-mono text-[#FF007A] opacity-0 group-hover:opacity-100 transition-opacity uppercase z-20">
                  [VER COBERTURA]
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROCESS MAPPING SECTION */}
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
                    <div className="absolute inset-0 bg-red-600/5 pointer-events-none" />
                    
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

                    <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-black/40">
                      <ISOImage id="mapa-procesos-9001" />
                      
                      <div className="absolute top-4 right-4 animate-pulse">
                        <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest shadow-lg">
                          Visualización Activa
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed italic">"Identifica claramente los requisitos de los clientes como entradas fundamentales."</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed italic">"Establece los puntos de control para mitigar riesgos operativos."</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
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
                    <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <h4 className="text-white font-bold tracking-tight text-lg">Consola de Simulación Operativa (PHVA)</h4>
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-mono">Calibrador Dinámico de la Cláusula 4.4 // SGC Interactivo</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 font-mono text-[10px] text-red-400">
                        SYS_STATUS: SIMULADOR_READY
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-5 space-y-6">
                        <div className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest border-b border-white/5 pb-2">
                          [1] Configuración de Parámetros
                        </div>

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

                        <button 
                          onClick={runSgcSimulation}
                          disabled={sgcsimulating}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition duration-300"
                        >
                          <RotateCcw className={`w-4 h-4 ${sgcsimulating ? 'animate-spin' : ''}`} />
                          {sgcsimulating ? 'Calibrando Matriz...' : 'Ejecutar Ciclo SGC'}
                        </button>
                      </div>

                      <div className="lg:col-span-7 space-y-6">
                        <div className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest border-b border-white/5 pb-2">
                          [2] Consola de Evaluación & Resultados
                        </div>

                        {sgcSimResult ? (
                          <div className="space-y-4">
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
                                  />
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
                                  )}
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

                            <div className="bg-black/90 rounded-2xl border border-white/10 p-4 font-mono text-[9px] leading-relaxed space-y-1 text-gray-400 relative">
                              <div className="absolute top-2 right-3 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
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
              {expertiseAreas.map((area: any, idx: number) => {
                const IconComponent = getIcon(area.icon);

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
                      {safeArray(area?.items).map((item: string, i: number) => (
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
              {certifications.map((cert: any, idx: number) => (
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
              {testimonials.map((testimonial: any, idx: number) => (
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

        {/* FOOTER */}
        <footer id="contact" className="py-12 border-t border-white/5 mt-20">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-left flex items-center gap-4 flex-wrap">
              {profile?.logoUrl && (
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 p-0.5 bg-white/5 flex items-center justify-center">
                  <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              )}
              <p className="text-sm text-gray-500 font-mono tracking-tighter">coach-iso.eu // {profile?.name || data?.profile?.name}</p>
              <span className="text-gray-700">|</span>
              <Link to="/admin" className="text-xs text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest font-bold">Admin CRM</Link>
              <span className="text-gray-700">|</span>
              <Link to="/normas" className="text-xs text-gray-500 hover:text-blue-500 transition-colors uppercase tracking-widest font-bold">Visualizador ISO</Link>
            </div>
            <div className="flex gap-4">
              <a href={data?.profile?.linkedin || '#'} className="p-4 glass rounded-full hover:bg-white hover:text-black transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={`mailto:${data?.profile?.email || ''}`} className="p-4 glass rounded-full hover:bg-red-600 hover:text-white transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>

        {/* MODALS */}
        <UserProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          data={data}
        />

        <CurriculumShowcaseModal
          isOpen={isCurriculumModalOpen}
          onClose={() => setIsCurriculumModalOpen(false)}
        />

        <ChatWidget />
        
        {/* WhatsApp Button */}
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