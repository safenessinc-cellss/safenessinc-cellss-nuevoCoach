export type SiteLanguage = 'es' | 'en' | 'pt' | 'it';

export interface ServiceCardCopy {
  title: string;
  description: string;
}

export interface SitePageCopy {
  brand: { name: string; descriptor: string };
  nav: { expertise: string; iso: string; biotypes: string; digital: string; experience: string; publication: string; contact: string };
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
  iso: { eyebrow: string; title: string; description: string; cards: ServiceCardCopy[]; transitionNote: string; action: string };
  biotypes: { eyebrow: string; title: string; description: string; cards: ServiceCardCopy[]; note: string; action: string };
  experience: { eyebrow: string; title: string; description: string; openCv: string; yearsValue: string; yearsLabel: string; resultsLabel: string; resultsDisclaimer: string };
  digital: { eyebrow: string; title: string; description: string; linkLabel: string; stepsLabel: string; steps: ServiceCardCopy[] };
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
    nav: { expertise: 'Servicios', iso: 'Sistemas ISO', biotypes: 'Biotipos', digital: 'Desarrollo digital', experience: 'Trayectoria', publication: 'Publicaciones', contact: 'Contacto' },
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
    iso: {
      eyebrow: 'SISTEMAS DE GESTIÓN · MEJORA CONTINUA',
      title: 'Normas ISO conectadas con la operación',
      description: 'Diseñamos sistemas prácticos que ordenan procesos, responsabilidades e indicadores y ayudan a sostener el desempeño. Acompañamiento para ISO 9001, ISO 14001, ISO 45001 e IATF 16949.',
      cards: [
        { title: 'ISO 9001:2026 · Calidad', description: 'Diagnóstico de brechas, procesos, liderazgo, auditoría interna y transición desde ISO 9001:2015.' },
        { title: 'ISO 14001:2026 · Medio ambiente', description: 'Sistema ambiental conectado con aspectos, obligaciones, controles operacionales y objetivos de desempeño.' },
        { title: 'ISO 45001:2018 · Seguridad y salud', description: 'Gestión de peligros, riesgos, participación de trabajadores, controles y mejora del desempeño de SST.' },
        { title: 'IATF 16949 · Automoción', description: 'Procesos de calidad del sector automotriz, prevención, trazabilidad y herramientas de mejora alineadas con el cliente.' },
      ],
      transitionNote: 'El acompañamiento prepara y mejora el sistema; la certificación la decide un organismo certificador independiente.',
      action: 'Conversemos sobre tu sistema',
    },
    biotypes: {
      eyebrow: 'COACHING · COMUNICACIÓN · EQUIPOS',
      title: 'Comprender estilos para colaborar mejor',
      description: 'Una conversación práctica sobre preferencias de comunicación, decisión y respuesta al cambio. Los biotipos sirven como punto de reflexión, no como etiquetas fijas.',
      cards: [
        { title: 'Orientación a la acción', description: 'Suele priorizar decisiones, ritmo y objetivos claros. En equipo, ayuda acordar espacio para escuchar alternativas y revisar impactos.' },
        { title: 'Orientación relacional', description: 'Suele aportar energía, intercambio de ideas y conexión. Ayuda concretar acuerdos, responsables y próximos pasos.' },
        { title: 'Orientación analítica', description: 'Suele buscar datos, estructura y consistencia. Ayuda equilibrar el análisis con decisiones oportunas.' },
        { title: 'Orientación estable', description: 'Suele valorar continuidad, colaboración y previsibilidad. Ayuda anticipar cambios y abrir espacio para nuevas propuestas.' },
      ],
      note: 'Marco orientativo de coaching y comunicación. No es diagnóstico clínico, no determina capacidades y no clasifica a nadie por su apariencia física.',
      action: 'Explorar una sesión para tu equipo',
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
      stepsLabel: 'De la necesidad al producto en uso',
      steps: [
        { title: '1 · Descubrimiento', description: 'Entender usuarios, procesos, objetivos, restricciones y criterios de éxito antes de elegir una solución.' },
        { title: '2 · Diseño y arquitectura', description: 'Definir flujos, experiencia, datos, integraciones, seguridad y una primera versión verificable.' },
        { title: '3 · Desarrollo iterativo', description: 'Construir por entregas, revisar con las personas usuarias y validar funcionalidad, accesibilidad y calidad.' },
        { title: '4 · Lanzamiento y mejora', description: 'Preparar publicación, documentación, seguimiento e iteraciones basadas en uso y resultados.' },
      ],
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
    nav: { expertise: 'Services', iso: 'ISO systems', biotypes: 'Biotypes', digital: 'Digital development', experience: 'Experience', publication: 'Publications', contact: 'Contact' },
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
    iso: {
      eyebrow: 'MANAGEMENT SYSTEMS · CONTINUAL IMPROVEMENT',
      title: 'ISO standards connected to operations',
      description: 'Practical systems that clarify processes, responsibilities, and measures and help sustain performance. Support for ISO 9001, ISO 14001, ISO 45001, and IATF 16949.',
      cards: [
        { title: 'ISO 9001:2026 · Quality', description: 'Gap assessment, processes, leadership, internal audits, and transition from ISO 9001:2015.' },
        { title: 'ISO 14001:2026 · Environment', description: 'Environmental management connected to aspects, obligations, operational controls, and performance objectives.' },
        { title: 'ISO 45001:2018 · Occupational health and safety', description: 'Hazard and risk management, worker participation, controls, and OH&S performance improvement.' },
        { title: 'IATF 16949 · Automotive', description: 'Automotive quality processes, prevention, traceability, and customer-aligned improvement tools.' },
      ],
      transitionNote: 'Consulting supports and improves the system; certification decisions belong to an independent certification body.',
      action: 'Discuss your management system',
    },
    biotypes: {
      eyebrow: 'COACHING · COMMUNICATION · TEAMS',
      title: 'Understand interaction styles to work better together',
      description: 'A practical conversation about preferences in communication, decision-making, and change. Biotypes are a reflection prompt, not fixed labels.',
      cards: [
        { title: 'Action-oriented', description: 'Often prioritizes decisions, pace, and clear goals. Teams can make room to hear alternatives and review impact.' },
        { title: 'Relationship-oriented', description: 'Often brings energy, idea sharing, and connection. Clear agreements, owners, and next steps help turn ideas into action.' },
        { title: 'Analytical', description: 'Often looks for evidence, structure, and consistency. A useful balance is analysis with timely decisions.' },
        { title: 'Steady and collaborative', description: 'Often values continuity, cooperation, and predictability. Early notice of change and space for proposals can help.' },
      ],
      note: 'An orienting framework for coaching and communication. It is not a clinical assessment, does not determine ability, and does not classify people by appearance.',
      action: 'Explore a team session',
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
      stepsLabel: 'From need to product in use',
      steps: [
        { title: '1 · Discovery', description: 'Understand users, processes, goals, constraints, and success measures before selecting a solution.' },
        { title: '2 · Design and architecture', description: 'Define flows, experience, data, integrations, security, and a verifiable first release.' },
        { title: '3 · Iterative development', description: 'Build in increments, review with users, and validate function, accessibility, and quality.' },
        { title: '4 · Launch and improve', description: 'Prepare release, documentation, monitoring, and further improvements based on use and results.' },
      ],
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
    nav: { expertise: 'Serviços', iso: 'Sistemas ISO', biotypes: 'Biotipos', digital: 'Desenvolvimento digital', experience: 'Experiência', publication: 'Publicações', contact: 'Contato' },
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
    iso: {
      eyebrow: 'SISTEMAS DE GESTÃO · MELHORIA CONTÍNUA',
      title: 'Normas ISO conectadas à operação',
      description: 'Sistemas práticos que organizam processos, responsabilidades e indicadores para sustentar o desempenho. Apoio para ISO 9001, ISO 14001, ISO 45001 e IATF 16949.',
      cards: [
        { title: 'ISO 9001:2026 · Qualidade', description: 'Diagnóstico de lacunas, processos, liderança, auditoria interna e transição da ISO 9001:2015.' },
        { title: 'ISO 14001:2026 · Meio ambiente', description: 'Gestão ambiental ligada a aspectos, obrigações, controles operacionais e objetivos de desempenho.' },
        { title: 'ISO 45001:2018 · Saúde e segurança', description: 'Gestão de perigos e riscos, participação dos trabalhadores, controles e melhoria de SST.' },
        { title: 'IATF 16949 · Automotivo', description: 'Processos de qualidade automotiva, prevenção, rastreabilidade e ferramentas de melhoria alinhadas ao cliente.' },
      ],
      transitionNote: 'A consultoria apoia e melhora o sistema; a certificação é decidida por um organismo certificador independente.',
      action: 'Converse sobre seu sistema de gestão',
    },
    biotypes: {
      eyebrow: 'COACHING · COMUNICAÇÃO · EQUIPES',
      title: 'Compreender estilos para colaborar melhor',
      description: 'Uma conversa prática sobre preferências de comunicação, decisão e resposta à mudança. Os biotipos são um ponto de reflexão, não rótulos fixos.',
      cards: [
        { title: 'Orientação para ação', description: 'Costuma priorizar decisões, ritmo e objetivos claros. No time, vale criar espaço para ouvir alternativas e avaliar impactos.' },
        { title: 'Orientação relacional', description: 'Costuma trazer energia, troca de ideias e conexão. Acordos, responsáveis e próximos passos ajudam a concretizar as ideias.' },
        { title: 'Orientação analítica', description: 'Costuma buscar dados, estrutura e consistência. É útil equilibrar análise com decisões oportunas.' },
        { title: 'Orientação estável', description: 'Costuma valorizar continuidade, colaboração e previsibilidade. Antecipar mudanças e abrir espaço para propostas pode ajudar.' },
      ],
      note: 'Referencial orientativo de coaching e comunicação. Não é diagnóstico clínico, não determina capacidades e não classifica pessoas pela aparência.',
      action: 'Explorar uma sessão para sua equipe',
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
      stepsLabel: 'Da necessidade ao produto em uso',
      steps: [
        { title: '1 · Descoberta', description: 'Entender usuários, processos, objetivos, restrições e critérios de sucesso antes de escolher a solução.' },
        { title: '2 · Design e arquitetura', description: 'Definir fluxos, experiência, dados, integrações, segurança e uma primeira versão verificável.' },
        { title: '3 · Desenvolvimento iterativo', description: 'Construir por etapas, revisar com usuários e validar funcionalidade, acessibilidade e qualidade.' },
        { title: '4 · Lançamento e melhoria', description: 'Preparar publicação, documentação, acompanhamento e iterações baseadas no uso e nos resultados.' },
      ],
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
    nav: { expertise: 'Servizi', iso: 'Sistemi ISO', biotypes: 'Biotipi', digital: 'Sviluppo digitale', experience: 'Esperienza', publication: 'Pubblicazioni', contact: 'Contatti' },
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
    iso: {
      eyebrow: 'SISTEMI DI GESTIONE · MIGLIORAMENTO CONTINUO',
      title: 'Norme ISO collegate alle attività operative',
      description: 'Sistemi pratici che chiariscono processi, responsabilità e indicatori per sostenere i risultati. Supporto per ISO 9001, ISO 14001, ISO 45001 e IATF 16949.',
      cards: [
        { title: 'ISO 9001:2026 · Qualità', description: 'Analisi delle lacune, processi, leadership, audit interni e transizione da ISO 9001:2015.' },
        { title: 'ISO 14001:2026 · Ambiente', description: 'Gestione ambientale collegata ad aspetti, obblighi, controlli operativi e obiettivi di performance.' },
        { title: 'ISO 45001:2018 · Salute e sicurezza', description: 'Gestione di pericoli e rischi, partecipazione dei lavoratori, controlli e miglioramento SSL.' },
        { title: 'IATF 16949 · Automotive', description: 'Processi di qualità automotive, prevenzione, tracciabilità e strumenti di miglioramento allineati al cliente.' },
      ],
      transitionNote: 'La consulenza supporta e migliora il sistema; la certificazione è decisa da un organismo indipendente.',
      action: 'Parliamo del tuo sistema di gestione',
    },
    biotypes: {
      eyebrow: 'COACHING · COMUNICAZIONE · TEAM',
      title: 'Comprendere gli stili per collaborare meglio',
      description: 'Una conversazione pratica sulle preferenze di comunicazione, decisione e risposta al cambiamento. I biotipi sono uno spunto di riflessione, non etichette fisse.',
      cards: [
        { title: 'Orientamento all’azione', description: 'Tende a dare priorità a decisioni, ritmo e obiettivi chiari. Nel team è utile ascoltare alternative e valutarne l’impatto.' },
        { title: 'Orientamento relazionale', description: 'Tende a portare energia, scambio di idee e connessione. Accordi, responsabili e prossimi passi aiutano a concretizzare.' },
        { title: 'Orientamento analitico', description: 'Tende a cercare dati, struttura e coerenza. È utile bilanciare l’analisi con decisioni tempestive.' },
        { title: 'Orientamento stabile', description: 'Tende a valorizzare continuità, collaborazione e prevedibilità. Anticipare i cambiamenti e ascoltare nuove proposte può aiutare.' },
      ],
      note: 'Schema orientativo per coaching e comunicazione. Non è una diagnosi clinica, non determina capacità e non classifica le persone dall’aspetto.',
      action: 'Esplora una sessione per il tuo team',
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
      stepsLabel: 'Dal bisogno al prodotto in uso',
      steps: [
        { title: '1 · Scoperta', description: 'Comprendere utenti, processi, obiettivi, vincoli e criteri di successo prima di scegliere una soluzione.' },
        { title: '2 · Design e architettura', description: 'Definire flussi, esperienza, dati, integrazioni, sicurezza e una prima versione verificabile.' },
        { title: '3 · Sviluppo iterativo', description: 'Costruire per incrementi, rivedere con gli utenti e validare funzionalità, accessibilità e qualità.' },
        { title: '4 · Rilascio e miglioramento', description: 'Preparare pubblicazione, documentazione, monitoraggio e iterazioni basate sull’uso e sui risultati.' },
      ],
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
