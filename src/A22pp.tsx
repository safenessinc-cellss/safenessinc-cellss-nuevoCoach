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

// ✅ CORREGIDO: iconMap completo con TODOS los iconos que se usan
const iconMap: Record<string, any> = {
  ShieldCheck,
  Network,
  Workflow,
  Brain,
  BarChart3,
  ShieldAlert,
  LineChart,
  Rocket,
  Award,
  ClipboardCheck,
  Map,
  FileCheck,     // ← AÑADIDO
  Activity,       // ← AÑADIDO
  CheckCircle2,   // ← AÑADIDO
  Users,          // ← AÑADIDO
  GraduationCap,  // ← AÑADIDO
  Briefcase,      // ← AÑADIDO
  Quote,          // ← AÑADIDO
  ArrowRight,     // ← AÑADIDO
  ImageIcon,      // ← AÑADIDO
  Layers,         // ← AÑADIDO
  Terminal,       // ← AÑADIDO
  Check,          // ← AÑADIDO
  AlertTriangle,  // ← AÑADIDO
  Menu,           // ← AÑADIDO
  X,              // ← AÑADIDO
  Play,           // ← AÑADIDO
  Sliders,        // ← AÑADIDO
  RotateCcw,      // ← AÑADIDO
  HelpCircle,     // ← AÑADIDO
  CheckSquare,    // ← AÑADIDO
  TrendingUp,     // ← AÑADIDO
};

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
  // ... (mantén todo tu skillDetails igual, es demasiado largo para repetirlo)
  // Asegúrate de que este objeto esté completo en tu archivo
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
  
  const [showDemoImage, setShowDemoImage] = useState(false);

  const [scrollY, setScrollY] = useState(0);
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);
  const [activeCareerIdx, setActiveCareerIdx] = useState(0);

  const [sgcSimulatorMode, setSgcSimulatorMode] = useState<'diagram' | 'interactive'>('interactive');
  const [sgcInput, setSgcInput] = useState<string>('requisitos_tecnicos');
  const [sgcComplexity, setSgcComplexity] = useState<string>('media');
  const [sgcControlMode, setSgcControlMode] = useState<string>('fmea');
  const [sgcsimulating, setSgcsimulating] = useState<boolean>(false);
  const [sgcSimResult, setSgcSimResult] = useState<any>(null);
  const [sgcLogs, setSgcLogs] = useState<string[]>([]);

  const [selectedCert, setSelectedCert] = useState<any>(null);

  const [auditChecklist, setAuditChecklist] = useState<Record<string, boolean>>({
    '4.4': true,
    '5.3': false,
    '6.1': false,
    '8.1': false,
    '9.3': false,
    '10.2': false,
  });
  const [riskProbability, setRiskProbability] = useState<number>(3);
  const [riskImpact, setRiskImpact] = useState<number>(3);
  const [coqPrev, setCoqPrev] = useState<number>(3000);
  const [coqAppr, setCoqAppr] = useState<number>(4500);
  const [coqIntFail, setCoqIntFail] = useState<number>(12000);
  const [coqExtFail, setCoqExtFail] = useState<number>(8000);
  const [leadershipStyle, setLeadershipStyle] = useState<string>('coaching');
  const [cisaBackups, setCisaBackups] = useState<boolean>(true);
  const [cisaAuditLogs, setCisaAuditLogs] = useState<boolean>(false);
  const [cisaSecControls, setCisaSecControls] = useState<boolean>(true);
  const [ciaFocusDept, setCiaFocusDept] = useState<string>('operaciones');

  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedCoachingPillar, setSelectedCoachingPillar] = useState<'decision' | 'psicopedagogia' | 'cohesion' | null>(null);

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

  // Side-effects
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
      } else {
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
    
    const randomIndex = Math.floor(Math.random() * corporateBackgrounds.length);
    setBgImage(corporateBackgrounds[randomIndex]);

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

  // ✅ CORREGIDO: Función helper para obtener el icono
  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Activity; // Fallback a Activity si no existe
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen text-gray-200 font-sans selection:bg-[#00F0FF]/30">
      
      {/* GLOBAL CORPORATE BACKGROUND */}
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
      ></div>

      {/* APP CONTENT */}
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
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 bg-white/5 rounded-lg animate-pulse"></div>
                  <div className="hidden md:flex gap-4">
                    {[1, 2, 3, 4, 5].map(i => <div key={`skel-hdr-${i}`} className="w-20 h-4 bg-white/5 rounded animate-pulse"></div>)}
                  </div>
                </div>
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

        {/* NAV */}
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

        {/* HERO SECTION */}
        <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
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

        {/* REST OF THE APP - Continúa con todo el código de las secciones... */}
        {/* 
          NOTA: El resto del código (sección ABOUT, SERVICES, PROCESS MAPPING, 
          CERTIFICATIONS, COACHING, TESTIMONIALS, FOOTER y MODALES) 
          se mantiene IGUAL que en tu versión original.
          
          SOLO DEBES REEMPLAZAR:
          1. La definición de iconMap (línea 48)
          2. La función getIcon (añadirla)
          3. La sección de expertise.areas (línea ~1050) para usar getIcon
        */}

        {/* ... resto de tu código ... */}

      </div>
    </div>
  );
}
