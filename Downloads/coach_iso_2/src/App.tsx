import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Users, Globe, Linkedin, Mail, Award, Network, Workflow, FileCheck, Activity, CheckCircle2, Menu, X, Brain, BarChart3, ShieldAlert, LineChart, Rocket, ClipboardCheck, Briefcase, Map, Quote, ArrowRight, Image as ImageIcon } from 'lucide-react';
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

  useEffect(() => {
    // Selección aleatoria del fondo corporativo al cargar
    const randomIndex = Math.floor(Math.random() * corporateBackgrounds.length);
    setBgImage(corporateBackgrounds[randomIndex]);

    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
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
    <div className="relative overflow-x-hidden min-h-screen text-gray-200 font-sans selection:bg-red-500/30">
      
      {/* GLOBAL CORPORATE BACKGROUND */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${bgImage})`, opacity: bgImage ? 1 : 0 }}
      />
      {/* OVERLAY SEMITRANSPARENTE PARA LEGIBILIDAD (Backdrop blur + Oscurecimiento) */}
      <div className="fixed inset-0 z-0 bg-[#050505]/85 backdrop-blur-[4px]"></div>

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
        {/* Luces de fondo */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
              {t('hero.badge')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none mb-8">
              {t('hero.title')} <br /> <span className="text-white/40">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
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

                {/* Badges Grid */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {data.about.badges.map((badge, idx) => {
                    const Icon = iconMap[badge.icon] || CheckCircle2;
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-5 py-2.5 text-sm text-gray-300 hover:bg-red-600/10 hover:border-red-500/50 transition-all cursor-default">
                        <Icon className="w-4 h-4 text-red-500" />
                        <span>{badge.label}</span>
                      </div>
                    )
                  })}
                </div>

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

      {/* TRAYECTORIA PROFESIONAL (Moving career blocks here as a dedicated sub-section if needed, or keeping it separate) */}
      <section className="py-20 bg-black/60 relative z-10 border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.about.career.map((block, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-red-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center mb-6 group-hover:bg-red-600/20 transition-colors">
                  <Briefcase className="text-red-500 w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{block.area}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">{block.description}</p>
                <div className="flex flex-wrap gap-2">
                  {block.roles.slice(0, 2).map((role, i) => (
                    <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/5 px-2 py-1 rounded-md border border-red-500/10">
                      {role}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 relative z-10 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
              {t('services.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">{t('services.title')}</h2>
          </div>

          {/* BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
            
            {/* Card 1: ISO Expert */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => setSelectedService(data.services[0])}
              className="md:col-span-2 md:row-span-2 glass rounded-3xl p-8 bento-card flex flex-col justify-end relative overflow-hidden group cursor-pointer"
            >
              <ShieldCheck className="absolute top-8 right-8 w-16 h-16 text-red-600/20 group-hover:scale-110 group-hover:text-red-500/40 group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] transition-all duration-500" />
              <h3 className="text-2xl font-bold mb-2 group-hover:text-red-400 transition-colors">{t('services.auditorTitle')}</h3>
              <p className="text-gray-400 text-sm max-w-md">{t('services.auditorDesc')}</p>
              <div className="mt-4 text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {t('services.details')} <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>

            {/* Card 2: Coaching */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => setSelectedService(data.services[1])}
              className="md:col-span-2 glass rounded-3xl p-8 bento-card flex items-center gap-6 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-red-600/20 transition-colors">
                <Users className="text-red-500 w-8 h-8 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold group-hover:text-red-400 transition-colors">{t('services.coachTitle')}</h3>
                <p className="text-gray-400 text-sm italic">{t('services.coachDesc')}</p>
              </div>
              <div className="hidden md:block text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Card 3: Core Value */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-1 glass rounded-3xl p-6 bento-card flex flex-col items-center justify-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-colors">
                <Award className="w-6 h-6 text-amber-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-300" />
              </div>
              <p className="font-bold text-white">Estándar ISO</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Calidad Total</p>
            </motion.div>

            {/* Card 4: Metrics */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-1 glass rounded-3xl p-6 bento-card flex flex-col items-center justify-center text-center group"
            >
              <span className="text-4xl font-black text-white group-hover:scale-110 group-hover:text-red-500 transition-all duration-300">{data.metrics.yearsExperience}</span>
              <span className="text-[10px] uppercase tracking-tighter text-gray-500 font-bold mt-1">{data.metrics.label}</span>
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

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 relative z-10 bg-black/60 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
              {t('testimonials.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">{t('testimonials.title')}</h2>
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
                className="glass p-8 rounded-3xl border border-white/5 hover:border-red-500/30 transition-colors flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <Quote className="w-8 h-8 text-red-500/50 mb-6 group-hover:text-red-500 transition-colors" />
                  <p className="text-gray-300 leading-relaxed font-light italic mb-8 group-hover:text-white transition-colors">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`} 
                      alt={testimonial.name} 
                      loading="lazy" 
                      decoding="async"
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10"
                    />
                    <div>
                      <h4 className="text-white font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-red-400">{testimonial.title}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    {t('testimonials.viewCase')} <ArrowRight className="w-3 h-3" />
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
            <p className="text-sm text-gray-500 font-mono tracking-tighter">coach-iso.eu // {data.profile.name}</p>
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
