import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Users, Globe, Linkedin, Mail, Award, Network, Workflow, FileCheck, Activity, CheckCircle2, Menu, X, Brain, BarChart3, ShieldAlert, LineChart, Rocket, ClipboardCheck, Briefcase, Map, Quote, ArrowRight, Image as ImageIcon, Layers } from 'lucide-react';
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
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-20 h-4 bg-white/5 rounded animate-pulse"></div>)}
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
                  {data.about.badges.map((badge, idx) => {
                    const Icon = iconMap[badge.icon] || CheckCircle2;
                    const isActive = activeSkillIdx === idx;
                    const isFuchsiaSkill = ["Estructuras de Empresas", "IBM 2025 Coach", "Coach Estratégico"].includes(badge.label);
                    
                    return (
                      <button 
                        key={idx} 
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
                      key={activeSkillIdx}
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

                      {isFuchsiaSkill && (
                        <div className="mb-4">
                          <Link 
                            to="/normas?tab=liderazgo" 
                            className="inline-flex items-center gap-2 text-xs text-[#FF007A] hover:text-white bg-[#FF007A]/10 border border-[#FF007A]/30 rounded-xl px-4 py-2 hover:bg-[#FF007A]/20 transition duration-300 font-bold font-sans"
                          >
                            <span>[Visualizar Programa e Normas Interactivas]</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}

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
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
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
              {data.about.career.map((block, idx) => {
                const isActive = activeCareerIdx === idx;
                const isFuchsia = idx === 0;
                
                return (
                  <div 
                    key={idx}
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
                      {block.roles.map((role, i) => (
                        <span 
                          key={i} 
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
                  key={activeCareerIdx}
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
              onClick={() => setSelectedService(data.services[0])}
              className="md:col-span-2 md:row-span-2 glass rounded-3xl p-8 bento-card futuristic-card flex flex-col justify-end relative overflow-hidden group cursor-pointer border-[#FF007A]/15 hover:border-[#FF007A] bg-[#090D1A]/50 hover:bg-[#FF007A]/5 shadow-[0_0_30px_rgba(255,0,122,0.03)]"
            >
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
              className="md:col-span-1 glass rounded-3xl p-6 bento-card futuristic-card flex flex-col items-center justify-center text-center group border-[#00F0FF]/10 hover:border-[#00F0FF]/40 bg-[#090D1A]/40"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 border border-amber-500/10 transition-colors">
                <Award className="w-6 h-6 text-amber-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-300" />
              </div>
              <p className="font-bold text-white tracking-tight">Estándar ISO</p>
              <p className="text-[10px] text-[#00F0FF] mt-1 font-mono uppercase tracking-widest">CALIDAD COMPLETA</p>
            </motion.div>

            {/* Card 4: Metrics (Col: 1, dynamic) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-1 glass rounded-3xl p-6 bento-card futuristic-card flex flex-col items-center justify-center text-center group border-[#FF007A]/10 hover:border-[#FF007A]/40 bg-[#090D1A]/40"
            >
              <span className="text-4xl font-extrabold text-white group-hover:scale-110 group-hover:text-[#FF007A] transition-all duration-300 font-mono tracking-tighter">
                {data.metrics.yearsExperience}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold mt-1">
                {data.metrics.label}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROCESS MAPPING & STRUCTURING SECTION */}
      <section id="procesos" className="py-24 relative z-10 bg-black/60 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
              Ingeniería Organizacional
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Mapa de Interacción de Procesos (SGC)</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light leading-relaxed mb-12">
              Representación visual de la interacción de los procesos del Sistema de Gestión de Calidad, incluyendo entradas, salidas y puntos de control operativos.
            </p>
            
            {/* Main Interactive Map Viewer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto mb-20"
            >
              <div className="glass rounded-[2.5rem] p-4 md:p-8 border border-white/10 relative group overflow-hidden">
                <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Header of the Diagram */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
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
                     <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Entradas</span>
                     <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Salidas</span>
                     <span className="px-3 py-1 rounded-lg bg-red-600/20 border border-red-500/30 text-[10px] font-bold text-red-500 uppercase tracking-tighter">Control</span>
                  </div>
                </div>

                {/* The Image (Editable since it uses ISOImage which pulls from Firestore image_registry) */}
                <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-black/40">
                  <ISOImage id="mapa-procesos-9001" />
                  
                  {/* Floating Action Hint */}
                  <div className="absolute top-4 right-4 animate-pulse">
                    <div className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">
                      Visualización Activa
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.expertise.areas.map((area, idx) => {
              const IconComponent = 
                area.icon === 'Network' ? Network :
                area.icon === 'Workflow' ? Workflow :
                area.icon === 'FileCheck' ? FileCheck : Activity;

              return (
                <motion.div 
                  key={idx}
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
                    {area.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-400">
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
            {data.certifications.map((cert, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-red-500/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={`https://picsum.photos/seed/iso${idx}/100/100`} 
                      alt={`${cert.title} badge`} 
                      loading="lazy" 
                      decoding="async"
                      className="w-12 h-12 rounded-xl object-cover opacity-50 group-hover:opacity-100 transition-opacity border border-white/10"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">{cert.title}</h3>
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1 block">{cert.subtitle}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-amber-500/10 transition-colors">
                    <Award className="text-gray-400 group-hover:text-amber-500 transition-colors w-5 h-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{cert.description}</p>
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
            <div className="bg-white/[0.02] hover:bg-white/[0.05] p-8 rounded-3xl border border-white/5 backdrop-blur-md transition group">
              <span className="text-3xl mb-4 block">🎯</span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Decisiones Críticas</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Mapeo de riesgos + coaching bajo presión para que líderes y equipos actúen con claridad en momentos de alta incertidumbre laboral.</p>
            </div>
            <div className="bg-white/[0.02] hover:bg-white/[0.05] p-8 rounded-3xl border border-white/5 backdrop-blur-md transition group">
              <span className="text-3xl mb-4 block">🧠</span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Psicopedagogía Empresarial</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Aprendizaje adaptativo, gestión del estrés y comunicación asertiva. Transformo de manera didáctica la forma en que tu equipo aprende y colabora.</p>
            </div>
            <div className="bg-white/[0.02] hover:bg-white/[0.05] p-8 rounded-3xl border border-white/5 backdrop-blur-md transition group">
              <span className="text-3xl mb-4 block">🤝</span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">Cohesión de Equipos</h3>
              <p className="text-gray-400 text-sm leading-relaxed">De grupos disfuncionales a equipos de alto rendimiento. Alineación de OKRs estratégicos, resolución asertiva de conflictos y confianza operativa.</p>
            </div>
          </div>

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
              🎓 Robert Terán es <strong>Ingeniero e Economista</strong> y cuenta con un <strong>Máster en Psicopedagogía</strong>, un <strong>Máster en Seguridad, Salud y Bienestar Laboral</strong> y un <strong>Posgrado en Inteligencia Emocional para las Organizaciones</strong>, lo que refuerza su visión integral y orientada a resultados excelentes.
            </div>
          </div>

          {/* ETIQUETAS DE ACCIÓN EN EL DASHBOARD / MARBETES */}
          <div className="text-center mb-8">
            <h4 className="text-sm uppercase tracking-widest text-[#777] font-mono mb-4">Económicas y Especializadades de Acompañamiento Integral</h4>
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
              {[
                "Gestión de la ira", "Orientación laboral", "Impulsividad", 
                "Habilidades de afrontamiento", "Problemas emocionales", "Life Coaching", 
                "Problemas relacionales", "Rendimiento deportivo", "Estrés", "Recursos humanos"
              ].map((specialty, idx) => (
                <span 
                  key={idx} 
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#111] hover:bg-[#191919] text-gray-300 border border-white/5 transition duration-200 cursor-default"
                >
                  ✨ {specialty}
                </span>
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
            {data.testimonials.map((testimonial, idx) => (
              <motion.div 
                key={idx}
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

        <UserProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          data={data}
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
