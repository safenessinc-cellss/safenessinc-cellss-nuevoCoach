import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Award, CheckCircle2, ChevronDown, Globe2, Layers3, Menu, ShieldCheck, Target, Users, Workflow, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfileSettings } from '../data/useProfileSettings';
import { CANDIDATE_PHOTO } from '../data/candidatePhoto';

type Language = 'pt' | 'en' | 'es' | 'it';
const copy: Record<Language, {
  nav: string[]; eyebrow: string; headline: string; highlight: string; intro: string;
  primary: string; secondary: string; proof: string; about: string; aboutTitle: string;
  aboutBody: string; expertise: string; expertiseTitle: string; expertiseIntro: string;
  services: { title: string; body: string }[]; approach: string; approachTitle: string;
  steps: { title: string; body: string }[]; credentials: string; credentialsTitle: string;
  credentialsBody: string; contact: string; contactTitle: string; contactBody: string;
  contactButton: string; footer: string;
}> = {
  pt: {
    nav: ['Sobre', 'Especialidades', 'Abordagem', 'Credenciais'],
    eyebrow: 'CONSULTORIA • SISTEMAS DE GESTÃO • DESENVOLVIMENTO DE EQUIPES',
    headline: 'Transforme complexidade em', highlight: 'resultados sustentáveis.',
    intro: 'Consultoria e coaching profissional para fortalecer sistemas de gestão, processos e liderança — com clareza, método e foco na execução.',
    primary: 'Conversar sobre um projeto', secondary: 'Ver currículo profissional', proof: 'Experiência declarada de mais de 30 anos em ambientes industriais e de serviços.',
    about: 'PERFIL PROFISSIONAL', aboutTitle: 'Visão sistêmica. Decisões melhores. Execução consistente.',
    aboutBody: 'Robert Terán integra experiência em engenharia, economia, auditoria e sistemas de gestão para ajudar organizações a compreender seus desafios, estruturar processos e desenvolver equipes.',
    expertise: 'ÁREAS DE ATUAÇÃO', expertiseTitle: 'Competência aplicada aos desafios reais do negócio.',
    expertiseIntro: 'Atuação orientada ao contexto da organização, aos riscos relevantes e aos resultados que precisam ser sustentados.',
    services: [
      { title: 'Sistemas de gestão e qualidade', body: 'Estruturação, implementação, auditorias internas e melhoria contínua de sistemas de gestão.' },
      { title: 'Processos e eficiência operacional', body: 'Mapeamento de processos, análise de causas, indicadores e planos de melhoria.' },
      { title: 'Riscos e conformidade', body: 'Identificação de riscos, controles, tratamento de não conformidades e preparação para auditorias.' },
      { title: 'Liderança e desenvolvimento de equipes', body: 'Coaching profissional, alinhamento de responsabilidades, comunicação e aprendizagem no trabalho.' },
    ],
    approach: 'MÉTODO DE TRABALHO', approachTitle: 'Da compreensão do cenário à melhoria mensurável.',
    steps: [
      { title: 'Diagnosticar', body: 'Entender o contexto, ouvir as pessoas e identificar processos, riscos e prioridades.' },
      { title: 'Estruturar', body: 'Definir objetivos, responsabilidades, indicadores e um plano de ação realista.' },
      { title: 'Implementar e evoluir', body: 'Acompanhar a execução, avaliar evidências e ajustar para sustentar os resultados.' },
    ],
    credentials: 'TRAJETÓRIA E CREDENCIAIS', credentialsTitle: 'Experiência e formação apresentadas com transparência.',
    credentialsBody: 'Consulte o currículo completo para conhecer a trajetória profissional, formação, cursos e credenciais, incluindo os dados de emissão e verificação disponíveis.',
    contact: 'PRÓXIMO PASSO', contactTitle: 'Qual desafio sua organização precisa resolver?',
    contactBody: 'Compartilhe o contexto e o resultado que procura. A conversa inicial ajuda a avaliar se existe uma abordagem adequada para sua necessidade.',
    contactButton: 'Agendar uma conversa', footer: 'Consultoria em sistemas de gestão, melhoria empresarial e desenvolvimento profissional.'
  },
  en: {
    nav: ['About', 'Expertise', 'Approach', 'Credentials'],
    eyebrow: 'CONSULTING • MANAGEMENT SYSTEMS • TEAM DEVELOPMENT',
    headline: 'Turn complexity into', highlight: 'sustainable results.',
    intro: 'Professional consulting and coaching to strengthen management systems, processes and leadership — with clarity, method and execution in mind.',
    primary: 'Discuss a project', secondary: 'View professional CV', proof: 'More than 30 years of stated experience across industrial and service environments.',
    about: 'PROFESSIONAL PROFILE', aboutTitle: 'Systems thinking. Better decisions. Consistent execution.',
    aboutBody: 'Robert Terán brings together experience in engineering, economics, auditing and management systems to help organisations understand challenges, structure processes and develop teams.',
    expertise: 'AREAS OF EXPERTISE', expertiseTitle: 'Practical expertise for real business challenges.',
    expertiseIntro: 'Work shaped around organisational context, relevant risks and the outcomes that need to be sustained.',
    services: [
      { title: 'Management systems and quality', body: 'Design, implementation, internal audits and continual improvement of management systems.' },
      { title: 'Processes and operational performance', body: 'Process mapping, root-cause analysis, performance indicators and improvement plans.' },
      { title: 'Risk and compliance', body: 'Risk identification, controls, nonconformity treatment and audit readiness.' },
      { title: 'Leadership and team development', body: 'Professional coaching, role alignment, communication and workplace learning.' },
    ],
    approach: 'WORKING METHOD', approachTitle: 'From understanding the situation to measurable improvement.',
    steps: [
      { title: 'Diagnose', body: 'Understand the context, listen to people and identify processes, risks and priorities.' },
      { title: 'Structure', body: 'Define objectives, responsibilities, indicators and a realistic action plan.' },
      { title: 'Implement and improve', body: 'Support execution, review evidence and adjust to sustain results.' },
    ],
    credentials: 'CAREER AND CREDENTIALS', credentialsTitle: 'Experience and education, presented transparently.',
    credentialsBody: 'Explore the full CV for professional history, education, courses and credentials, including available issue and verification details.',
    contact: 'NEXT STEP', contactTitle: 'What challenge does your organisation need to solve?',
    contactBody: 'Share the context and the outcome you are looking for. An initial conversation can help assess an appropriate approach.',
    contactButton: 'Schedule a conversation', footer: 'Management systems consulting, business improvement and professional development.'
  },
  es: {
    nav: ['Perfil', 'Especialidades', 'Método', 'Credenciales'],
    eyebrow: 'CONSULTORÍA • SISTEMAS DE GESTIÓN • DESARROLLO DE EQUIPOS',
    headline: 'Transformar la complejidad en', highlight: 'resultados sostenibles.',
    intro: 'Consultoría y coaching profesional para fortalecer sistemas de gestión, procesos y liderazgo, con claridad, método y enfoque en la ejecución.',
    primary: 'Conversar sobre un proyecto', secondary: 'Ver currículo profesional', proof: 'Más de 30 años de experiencia declarada en entornos industriales y de servicios.',
    about: 'PERFIL PROFESIONAL', aboutTitle: 'Visión sistémica. Mejores decisiones. Ejecución consistente.',
    aboutBody: 'Robert Terán integra experiencia en ingeniería, economía, auditoría y sistemas de gestión para ayudar a las organizaciones a comprender sus desafíos, estructurar procesos y desarrollar equipos.',
    expertise: 'ÁREAS DE ESPECIALIDAD', expertiseTitle: 'Conocimiento aplicado a desafíos reales del negocio.',
    expertiseIntro: 'Trabajo orientado al contexto de la organización, los riesgos relevantes y los resultados que deben sostenerse.',
    services: [
      { title: 'Sistemas de gestión y calidad', body: 'Estructuración, implementación, auditorías internas y mejora continua.' },
      { title: 'Procesos y eficiencia operativa', body: 'Mapeo de procesos, análisis de causas, indicadores y planes de mejora.' },
      { title: 'Riesgos y cumplimiento', body: 'Identificación de riesgos, controles y preparación para auditorías.' },
      { title: 'Liderazgo y desarrollo de equipos', body: 'Coaching profesional, responsabilidades, comunicación y aprendizaje.' },
    ],
    approach: 'MÉTODO DE TRABAJO', approachTitle: 'De comprender el contexto a la mejora medible.',
    steps: [
      { title: 'Diagnosticar', body: 'Comprender el contexto e identificar procesos, riesgos y prioridades.' },
      { title: 'Estructurar', body: 'Definir objetivos, responsabilidades, indicadores y un plan realista.' },
      { title: 'Implementar y mejorar', body: 'Acompañar la ejecución, revisar evidencias y ajustar.' },
    ],
    credentials: 'TRAYECTORIA Y CREDENCIALES', credentialsTitle: 'Experiencia y formación presentadas con transparencia.',
    credentialsBody: 'Consulta el currículo completo para conocer la trayectoria, formación, cursos y credenciales, con los datos de emisión y verificación disponibles.',
    contact: 'PRÓXIMO PASO', contactTitle: '¿Qué desafío necesita resolver tu organización?',
    contactBody: 'Comparte el contexto y el resultado que buscas. Una conversación inicial permite evaluar un enfoque adecuado.',
    contactButton: 'Agendar una conversación', footer: 'Consultoría en sistemas de gestión, mejora empresarial y desarrollo profesional.'
  },
  it: {
    nav: ['Profilo', 'Competenze', 'Metodo', 'Credenziali'],
    eyebrow: 'CONSULENZA • SISTEMI DI GESTIONE • SVILUPPO DEI TEAM',
    headline: 'Trasformare la complessità in', highlight: 'risultati sostenibili.',
    intro: 'Consulenza e coaching professionale per rafforzare sistemi di gestione, processi e leadership, con chiarezza, metodo e attenzione all’esecuzione.',
    primary: 'Parliamo di un progetto', secondary: 'Visualizza il CV professionale', proof: 'Oltre 30 anni di esperienza dichiarata in contesti industriali e di servizi.',
    about: 'PROFILO PROFESSIONALE', aboutTitle: 'Visione sistemica. Decisioni migliori. Esecuzione coerente.',
    aboutBody: 'Robert Terán unisce esperienza in ingegneria, economia, audit e sistemi di gestione per aiutare le organizzazioni a comprendere le sfide, strutturare i processi e sviluppare i team.',
    expertise: 'AREE DI COMPETENZA', expertiseTitle: 'Competenze applicate alle reali sfide aziendali.',
    expertiseIntro: 'Interventi definiti in base al contesto, ai rischi rilevanti e ai risultati da mantenere.',
    services: [
      { title: 'Sistemi di gestione e qualità', body: 'Progettazione, implementazione, audit interni e miglioramento continuo.' },
      { title: 'Processi e prestazioni operative', body: 'Mappatura dei processi, analisi delle cause, indicatori e piani di miglioramento.' },
      { title: 'Rischi e conformità', body: 'Identificazione dei rischi, controlli e preparazione agli audit.' },
      { title: 'Leadership e sviluppo dei team', body: 'Coaching professionale, ruoli, comunicazione e apprendimento sul lavoro.' },
    ],
    approach: 'METODO DI LAVORO', approachTitle: 'Dalla comprensione del contesto al miglioramento misurabile.',
    steps: [
      { title: 'Analizzare', body: 'Comprendere il contesto e identificare processi, rischi e priorità.' },
      { title: 'Strutturare', body: 'Definire obiettivi, responsabilità, indicatori e un piano realistico.' },
      { title: 'Attuare e migliorare', body: 'Seguire l’esecuzione, verificare le evidenze e adeguare.' },
    ],
    credentials: 'PERCORSO E CREDENZIALI', credentialsTitle: 'Esperienza e formazione presentate con trasparenza.',
    credentialsBody: 'Consulta il CV completo per conoscere il percorso professionale, la formazione e le credenziali, con i dati di rilascio e verifica disponibili.',
    contact: 'PROSSIMO PASSO', contactTitle: 'Quale sfida deve affrontare la tua organizzazione?',
    contactBody: 'Condividi il contesto e il risultato desiderato. Un primo confronto aiuta a valutare l’approccio più adatto.',
    contactButton: 'Fissa un colloquio', footer: 'Consulenza sui sistemi di gestione, miglioramento aziendale e sviluppo professionale.'
  }
};

const serviceIcons = [ShieldCheck, Workflow, Target, Users];
const stepIcons = [Globe2, Layers3, CheckCircle2];

export default function CoachIsoHomePage() {
  const { i18n } = useTranslation();
  const { profile } = useProfileSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const language = ((i18n.language || 'pt').split('-')[0]) as Language;
  const lang: Language = copy[language] ? language : 'pt';
  const t = copy[lang];
  const changeLanguage = (value: Language) => { void i18n.changeLanguage(value); setMenuOpen(false); };
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="coach-home">
      <header className="coach-home__header">
        <Link to="/" className="coach-home__brand" aria-label="Coach ISO home">
          {profile.logoUrl ? (
            <img src={profile.logoUrl} alt="Logo Coach ISO" className="max-h-12 max-w-[190px] object-contain" />
          ) : (
            <>
              <span className="coach-home__brand-mark">CI</span>
              <span><strong>COACH ISO</strong><small>QUALITY · STRATEGY · PEOPLE</small></span>
            </>
          )}
        </Link>
        <nav className={menuOpen ? 'coach-home__nav is-open' : 'coach-home__nav'} aria-label="Main navigation">
          {t.nav.map((label, index) => <a key={label} href={['#sobre','#especialidades','#abordagem','#credenciais'][index]} onClick={closeMenu}>{label}</a>)}
          <div className="coach-home__languages" aria-label="Language">
            {(['pt','en','es','it'] as Language[]).map(value => <button key={value} onClick={() => changeLanguage(value)} aria-pressed={lang === value}>{value.toUpperCase()}</button>)}
          </div>
          <Link to="/login" className="coach-home__login" onClick={closeMenu}>Portal <ArrowUpRight size={15}/></Link>
        </nav>
        <button className="coach-home__menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X/> : <Menu/>}</button>
      </header>

      <section className="coach-home__hero">
        <div className="coach-home__hero-grid" aria-hidden="true"/>
        <div className="coach-home__hero-copy">
          <div className="coach-home__eyebrow"><span/> {t.eyebrow}</div>
          <h1>{t.headline}<br/><em>{t.highlight}</em></h1>
          <p>{t.intro}</p>
          <div className="coach-home__actions">
            <Link to="/agendar" className="coach-home__button coach-home__button--primary">{t.primary}<ArrowRight size={17}/></Link>
            <Link to="/curriculo" className="coach-home__button coach-home__button--secondary">{t.secondary}<ArrowUpRight size={16}/></Link>
          </div>
          <div className="coach-home__proof"><CheckCircle2 size={17}/><span>{t.proof}</span></div>
        </div>
        <div className="coach-home__portrait-wrap">
          <div className="coach-home__portrait-frame">
            <img src={profile.photoUrl || CANDIDATE_PHOTO} alt={profile.name || 'Robert Terán'} />
          </div>
          <div className="coach-home__portrait-caption"><span>ROBERT TERÁN</span><small>{profile.coachTitle || 'Management systems & leadership'}</small></div>
          <div className="coach-home__portrait-note"><Award size={18}/><span>Engineering<br/>Management<br/>Continuous improvement</span></div>
        </div>
        <div className="coach-home__scroll-cue">SCROLL TO EXPLORE <span/></div>
      </section>

      <section id="sobre" className="coach-home__section coach-home__about">
        <div className="coach-home__section-label">{t.about}</div>
        <div className="coach-home__about-grid">
          <h2>{t.aboutTitle}</h2>
          <div><p>{t.aboutBody}</p><Link to="/curriculo" className="coach-home__text-link">{t.secondary}<ArrowUpRight size={16}/></Link></div>
        </div>
        <div className="coach-home__metrics">
          <div><strong>30+</strong><span>{lang === 'pt' ? 'anos de experiência declarada' : lang === 'en' ? 'years of stated experience' : lang === 'es' ? 'años de experiencia declarada' : 'anni di esperienza dichiarata'}</span></div>
          <div><strong>4</strong><span>{lang === 'pt' ? 'idiomas no site' : lang === 'en' ? 'website languages' : lang === 'es' ? 'idiomas en el sitio' : 'lingue del sito'}</span></div>
          <div><strong>360°</strong><span>{lang === 'pt' ? 'visão integrada do negócio' : lang === 'en' ? 'integrated business perspective' : lang === 'es' ? 'visión integrada del negocio' : 'visione aziendale integrata'}</span></div>
        </div>
      </section>

      <section id="especialidades" className="coach-home__section coach-home__expertise">
        <div className="coach-home__section-label">{t.expertise}</div>
        <div className="coach-home__section-heading"><h2>{t.expertiseTitle}</h2><p>{t.expertiseIntro}</p></div>
        <div className="coach-home__service-grid">
          {t.services.map((service, index) => { const Icon = serviceIcons[index]; return <article className="coach-home__service" key={service.title}><span className="coach-home__service-icon"><Icon size={22}/></span><small>0{index + 1}</small><h3>{service.title}</h3><p>{service.body}</p><Link to="/agendar" aria-label={service.title}><ArrowUpRight size={18}/></Link></article>; })}
        </div>
      </section>

      <section id="abordagem" className="coach-home__section coach-home__approach">
        <div className="coach-home__section-label">{t.approach}</div>
        <h2>{t.approachTitle}</h2>
        <div className="coach-home__steps">
          {t.steps.map((step, index) => { const Icon = stepIcons[index]; return <article key={step.title}><span className="coach-home__step-number">0{index + 1}</span><Icon size={24}/><h3>{step.title}</h3><p>{step.body}</p></article>; })}
        </div>
      </section>

      <section id="credenciais" className="coach-home__section coach-home__credentials">
        <div className="coach-home__credential-icon"><Award size={28}/></div>
        <div><div className="coach-home__section-label">{t.credentials}</div><h2>{t.credentialsTitle}</h2><p>{t.credentialsBody}</p><Link to="/curriculo" className="coach-home__button coach-home__button--secondary">{t.secondary}<ArrowRight size={17}/></Link></div>
      </section>

      <section className="coach-home__contact">
        <div className="coach-home__section-label">{t.contact}</div><h2>{t.contactTitle}</h2><p>{t.contactBody}</p><Link to="/agendar" className="coach-home__button coach-home__button--light">{t.contactButton}<ArrowRight size={17}/></Link>
      </section>

      <footer className="coach-home__footer"><Link to="/" className="coach-home__brand">{profile.logoUrl ? <img src={profile.logoUrl} alt="Logo Coach ISO" className="max-h-10 max-w-[170px] object-contain" /> : <><span className="coach-home__brand-mark">CI</span><span><strong>COACH ISO</strong><small>QUALITY · STRATEGY · PEOPLE</small></span></>}</Link><p>{t.footer}</p><span>© {new Date().getFullYear()} Coach ISO</span><div className="flex flex-wrap items-center gap-3 text-xs"><Link to="/privacidade">Privacidade</Link><Link to="/cookies">Cookies</Link><Link to="/termos">Termos de uso</Link><button type="button" onClick={() => window.dispatchEvent(new Event('coachiso:cookie-settings'))}>Preferências de cookies</button></div><Link to="/portal">Portal completo <ChevronDown size={14}/></Link></footer>
    </main>
  );
}
