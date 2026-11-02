export type SiteLanguage = 'es' | 'en' | 'pt' | 'it';

export interface ServiceCardCopy {
  title: string;
  description: string;
}

export interface SitePageCopy {
  brand: { name: string; descriptor: string };
  nav: { expertise: string; experience: string; publication: string; contact: string };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    specialty: string;
    primaryAction: string;
    secondaryAction: string;
  };
  expertise: { eyebrow: string; title: string; description: string; cards: ServiceCardCopy[] };
  experience: { eyebrow: string; title: string; description: string; openCv: string; yearsValue: string; yearsLabel: string; resultsLabel: string; resultsDisclaimer: string };
  digital: { eyebrow: string; title: string; description: string; linkLabel: string };
  publication: { eyebrow: string; title: string; description: string; openBook: string };
  contact: { eyebrow: string; title: string; description: string; emailLabel: string; linkedinLabel: string; whatsappLabel: string };
  footer: { tagline: string; privacy: string };
}

export interface PublicSiteSettings {
  locales?: Partial<Record<SiteLanguage, Partial<SitePageCopy>>>;
  links?: { email?: string; linkedin?: string; whatsapp?: string };
  updatedAt?: unknown;
}

export const SITE_LANGUAGES: Array<{ code: SiteLanguage; label: string }> = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
];

export const DEFAULT_SITE_LINKS = {
  email: 'robert@coach-iso.eu',
  linkedin: 'https://www.linkedin.com/in/robertteran/',
  whatsapp: 'https://wa.me/584143431185',
};

export const DEFAULT_SITE_COPY: Record<SiteLanguage, SitePageCopy> = {
  es: {
    brand: { name: 'COACH ISO', descriptor: 'CONSULTORÍA' },
    nav: { expertise: 'Servicios', experience: 'Trayectoria', publication: 'Publicaciones', contact: 'Contacto' },
    hero: {
      eyebrow: 'CONSULTORÍA · SISTEMAS DE GESTIÓN · EXCELENCIA OPERACIONAL',
      title: 'Convertimos la complejidad operativa',
      highlight: 'en mejoras que perduran.',
      description: 'Ingeniería, sistemas de gestión y desarrollo digital para que las organizaciones trabajen con más claridad, control y confianza.',
      specialty: 'Sistemas ISO · Operaciones · Soluciones digitales',
      primaryAction: 'Conocer servicios', secondaryAction: 'Ver currículo profesional',
    },
    expertise: {
      eyebrow: 'CÓMO PODEMOS AYUDAR', title: 'Capacidades para avanzar con confianza',
      description: 'Acompañamiento práctico, conectado con la operación real y los objetivos del negocio.',
      cards: [
        { title: 'Sistemas de gestión y auditoría', description: 'Diseño, implementación y mejora de sistemas ISO; preparación para auditorías, gestión de riesgos y acciones correctivas.' },
        { title: 'Excelencia operacional', description: 'Análisis de procesos, causa raíz y mejora continua para reducir desperdicios, variabilidad y costos evitables.' },
        { title: 'Transformación digital', description: 'Aplicaciones, herramientas internas y paneles de gestión que apoyan la digitalización y el control de procesos.' },
        { title: 'Desarrollo organizacional', description: 'Coaching ejecutivo, aprendizaje y liderazgo de equipos para facilitar cambios y sostener nuevas formas de trabajo.' },
      ],
    },
    experience: {
      eyebrow: 'EXPERIENCIA APLICADA', title: 'Experiencia industrial con visión integrada',
      description: 'Trayectoria en calidad, producción, procesos, cadena de suministro y desarrollo de soluciones digitales.',
      openCv: 'Ver experiencia y credenciales',
      yearsValue: '30+', yearsLabel: 'años de experiencia',
      resultsLabel: 'RESULTADOS REPORTADOS EN PROYECTOS',
      resultsDisclaimer: 'Cifras declaradas en el currículo; dependen del contexto de cada proyecto.',
    },
    digital: {
      eyebrow: 'SAFENESS.INC · DESARROLLO DIGITAL', title: 'Tecnología pensada para resolver trabajo real',
      description: 'Desarrollo de aplicaciones web y móviles, herramientas internas y paneles de gestión que conectan los procesos con la información necesaria para decidir.',
      linkLabel: 'Explorar el currículo digital',
    },
    publication: {
      eyebrow: 'IDEAS Y RECURSOS', title: 'Publicaciones profesionales',
      description: 'Libros y materiales sobre gestión, calidad y mejora continua, disponibles desde el catálogo profesional.',
      openBook: 'Abrir publicación',
    },
    contact: {
      eyebrow: 'CONVERSEMOS', title: '¿Qué desafío necesita resolver tu organización?',
      description: 'Cuéntame el contexto y definiremos un siguiente paso concreto para fortalecer la calidad, los procesos o el desarrollo del equipo.',
      emailLabel: 'Enviar un correo', linkedinLabel: 'LinkedIn', whatsappLabel: 'Hablar por WhatsApp',
    },
    footer: { tagline: 'Sistemas claros. Mejora duradera.', privacy: 'Consultoría independiente en gestión, operaciones y soluciones digitales.' },
  },
  en: {
    brand: { name: 'COACH ISO', descriptor: 'CONSULTING' },
    nav: { expertise: 'Services', experience: 'Experience', publication: 'Publications', contact: 'Contact' },
    hero: {
      eyebrow: 'CONSULTING · MANAGEMENT SYSTEMS · OPERATIONAL EXCELLENCE',
      title: 'We turn operational complexity', highlight: 'into lasting improvement.',
      description: 'Engineering, management systems, and digital development to help organizations work with greater clarity, control, and confidence.',
      specialty: 'ISO systems · Operations · Digital solutions',
      primaryAction: 'Explore services', secondaryAction: 'View professional CV',
    },
    expertise: {
      eyebrow: 'HOW WE CAN HELP', title: 'Capabilities to move forward with confidence',
      description: 'Practical support connected to day-to-day operations and business goals.',
      cards: [
        { title: 'Management systems and auditing', description: 'Design, implementation, and improvement of ISO systems; audit readiness, risk management, and corrective action.' },
        { title: 'Operational excellence', description: 'Process analysis, root-cause work, and continuous improvement to reduce waste, variation, and avoidable costs.' },
        { title: 'Digital transformation', description: 'Applications, internal tools, and management dashboards that support process digitization and control.' },
        { title: 'Organizational development', description: 'Executive coaching, learning, and team leadership to support change and sustain new ways of working.' },
      ],
    },
    experience: {
      eyebrow: 'EXPERIENCE IN PRACTICE', title: 'Industrial experience with an integrated view',
      description: 'Experience across quality, production, processes, supply chain, and digital solution development.',
      openCv: 'View experience and credentials',
      yearsValue: '30+', yearsLabel: 'years of experience',
      resultsLabel: 'REPORTED PROJECT OUTCOMES',
      resultsDisclaimer: 'Results are reported in the source CV and depend on each project context.',
    },
    digital: {
      eyebrow: 'SAFENESS.INC · DIGITAL DEVELOPMENT', title: 'Technology built to solve real work',
      description: 'Web and mobile applications, internal tools, and management dashboards that connect processes with the information teams need to make decisions.',
      linkLabel: 'Explore the digital CV',
    },
    publication: {
      eyebrow: 'IDEAS AND RESOURCES', title: 'Professional publications',
      description: 'Books and materials on management, quality, and continuous improvement, available through the professional catalog.',
      openBook: 'Open publication',
    },
    contact: {
      eyebrow: 'LET’S TALK', title: 'What challenge does your organization need to solve?',
      description: 'Share the context and we can define a concrete next step to strengthen quality, processes, or team development.',
      emailLabel: 'Send an email', linkedinLabel: 'LinkedIn', whatsappLabel: 'Message on WhatsApp',
    },
    footer: { tagline: 'Clear systems. Lasting improvement.', privacy: 'Independent consulting in management, operations, and digital solutions.' },
  },
  pt: {
    brand: { name: 'COACH ISO', descriptor: 'CONSULTORIA' },
    nav: { expertise: 'Serviços', experience: 'Experiência', publication: 'Publicações', contact: 'Contato' },
    hero: {
      eyebrow: 'CONSULTORIA · SISTEMAS DE GESTÃO · EXCELÊNCIA OPERACIONAL',
      title: 'Transformamos a complexidade operacional', highlight: 'em melhorias duradouras.',
      description: 'Engenharia, sistemas de gestão e desenvolvimento digital para ajudar organizações a trabalhar com mais clareza, controle e confiança.',
      specialty: 'Sistemas ISO · Operações · Soluções digitais',
      primaryAction: 'Conhecer serviços', secondaryAction: 'Ver currículo profissional',
    },
    expertise: {
      eyebrow: 'COMO PODEMOS AJUDAR', title: 'Competências para avançar com confiança',
      description: 'Acompanhamento prático, conectado à operação real e aos objetivos do negócio.',
      cards: [
        { title: 'Sistemas de gestão e auditoria', description: 'Projeto, implementação e melhoria de sistemas ISO; preparação para auditorias, gestão de riscos e ações corretivas.' },
        { title: 'Excelência operacional', description: 'Análise de processos, causa raiz e melhoria contínua para reduzir desperdícios, variação e custos evitáveis.' },
        { title: 'Transformação digital', description: 'Aplicações, ferramentas internas e painéis de gestão que apoiam a digitalização e o controle dos processos.' },
        { title: 'Desenvolvimento organizacional', description: 'Coaching executivo, aprendizagem e liderança de equipes para apoiar mudanças e manter novas formas de trabalho.' },
      ],
    },
    experience: {
      eyebrow: 'EXPERIÊNCIA APLICADA', title: 'Experiência industrial com visão integrada',
      description: 'Atuação em qualidade, produção, processos, cadeia de suprimentos e desenvolvimento de soluções digitais.',
      openCv: 'Ver experiência e credenciais',
      yearsValue: '30+', yearsLabel: 'anos de experiência',
      resultsLabel: 'RESULTADOS REPORTADOS',
      resultsDisclaimer: 'Resultados informados no currículo de origem; dependem do contexto de cada projeto.',
    },
    digital: {
      eyebrow: 'SAFENESS.INC · DESENVOLVIMENTO DIGITAL', title: 'Tecnologia para resolver o trabalho real',
      description: 'Desenvolvimento de aplicações web e móveis, ferramentas internas e painéis de gestão que conectam processos às informações necessárias para decidir.',
      linkLabel: 'Explorar o currículo digital',
    },
    publication: {
      eyebrow: 'IDEIAS E RECURSOS', title: 'Publicações profissionais',
      description: 'Livros e materiais sobre gestão, qualidade e melhoria contínua disponíveis no catálogo profissional.',
      openBook: 'Abrir publicação',
    },
    contact: {
      eyebrow: 'VAMOS CONVERSAR', title: 'Qual desafio sua organização precisa resolver?',
      description: 'Conte o contexto e definiremos um próximo passo concreto para fortalecer a qualidade, os processos ou o desenvolvimento da equipe.',
      emailLabel: 'Enviar um e-mail', linkedinLabel: 'LinkedIn', whatsappLabel: 'Falar pelo WhatsApp',
    },
    footer: { tagline: 'Sistemas claros. Melhoria duradoura.', privacy: 'Consultoria independente em gestão, operações e soluções digitais.' },
  },
  it: {
    brand: { name: 'COACH ISO', descriptor: 'CONSULENZA' },
    nav: { expertise: 'Servizi', experience: 'Esperienza', publication: 'Pubblicazioni', contact: 'Contatti' },
    hero: {
      eyebrow: 'CONSULENZA · SISTEMI DI GESTIONE · ECCELLENZA OPERATIVA',
      title: 'Trasformiamo la complessità operativa', highlight: 'in miglioramenti duraturi.',
      description: 'Ingegneria, sistemi di gestione e sviluppo digitale per aiutare le organizzazioni a lavorare con maggiore chiarezza, controllo e fiducia.',
      specialty: 'Sistemi ISO · Operations · Soluzioni digitali',
      primaryAction: 'Scopri i servizi', secondaryAction: 'Vedi il CV professionale',
    },
    expertise: {
      eyebrow: 'COME POSSIAMO AIUTARE', title: 'Competenze per progredire con fiducia',
      description: 'Supporto pratico, collegato alle attività quotidiane e agli obiettivi aziendali.',
      cards: [
        { title: 'Sistemi di gestione e audit', description: 'Progettazione, implementazione e miglioramento dei sistemi ISO; preparazione agli audit, gestione dei rischi e azioni correttive.' },
        { title: 'Eccellenza operativa', description: 'Analisi dei processi, cause radice e miglioramento continuo per ridurre sprechi, variabilità e costi evitabili.' },
        { title: 'Trasformazione digitale', description: 'Applicazioni, strumenti interni e dashboard gestionali che supportano la digitalizzazione e il controllo dei processi.' },
        { title: 'Sviluppo organizzativo', description: 'Executive coaching, apprendimento e leadership dei team per facilitare il cambiamento e sostenere nuovi modi di lavorare.' },
      ],
    },
    experience: {
      eyebrow: 'ESPERIENZA APPLICATA', title: 'Esperienza industriale con visione integrata',
      description: 'Esperienza in qualità, produzione, processi, catena di fornitura e sviluppo di soluzioni digitali.',
      openCv: 'Vedi esperienza e credenziali',
      yearsValue: '30+', yearsLabel: 'anni di esperienza',
      resultsLabel: 'RISULTATI RIPORTATI',
      resultsDisclaimer: 'Risultati riportati nel CV di origine e legati al contesto di ogni progetto.',
    },
    digital: {
      eyebrow: 'SAFENESS.INC · SVILUPPO DIGITALE', title: 'Tecnologia progettata per il lavoro reale',
      description: 'Applicazioni web e mobile, strumenti interni e dashboard gestionali che collegano i processi alle informazioni necessarie per decidere.',
      linkLabel: 'Esplora il CV digitale',
    },
    publication: {
      eyebrow: 'IDEE E RISORSE', title: 'Pubblicazioni professionali',
      description: 'Libri e materiali su gestione, qualità e miglioramento continuo, disponibili nel catalogo professionale.',
      openBook: 'Apri la pubblicazione',
    },
    contact: {
      eyebrow: 'PARLIAMONE', title: 'Quale sfida deve affrontare la tua organizzazione?',
      description: 'Condividi il contesto e definiremo un prossimo passo concreto per rafforzare qualità, processi o sviluppo del team.',
      emailLabel: 'Invia un’e-mail', linkedinLabel: 'LinkedIn', whatsappLabel: 'Scrivi su WhatsApp',
    },
    footer: { tagline: 'Sistemi chiari. Miglioramento duraturo.', privacy: 'Consulenza indipendente in gestione, operations e soluzioni digitali.' },
  },
};

function mergeValue(defaultValue: unknown, savedValue: unknown): unknown {
  if (typeof defaultValue === 'string') {
    return typeof savedValue === 'string' ? savedValue.slice(0, 4000) : defaultValue;
  }
  if (Array.isArray(defaultValue)) {
    if (!Array.isArray(savedValue)) return defaultValue;
    const template = defaultValue[0];
    return template === undefined ? [] : savedValue.slice(0, 8).map((item) => mergeValue(template, item));
  }
  if (defaultValue && typeof defaultValue === 'object') {
    const savedObject = savedValue && typeof savedValue === 'object' && !Array.isArray(savedValue)
      ? savedValue as Record<string, unknown>
      : {};
    return Object.fromEntries(Object.entries(defaultValue as Record<string, unknown>)
      .map(([key, value]) => [key, mergeValue(value, savedObject[key])]));
  }
  return savedValue ?? defaultValue;
}

export function getSiteCopy(language: SiteLanguage, saved?: unknown): SitePageCopy {
  const defaults = DEFAULT_SITE_COPY[language] || DEFAULT_SITE_COPY.es;
  return mergeValue(defaults, saved) as SitePageCopy;
}
