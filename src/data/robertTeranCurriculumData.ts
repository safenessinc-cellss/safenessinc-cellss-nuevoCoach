export interface CandidateInfo {
  name: string;
  birthDate: string;
  email: string;
  phone?: string;
  location?: string;
  credlyProfile: string;
  credlyId: string;
  transcriptDate: string;
  summary: string;
}

export interface CareerRole {
  period: string;
  title: string;
  company: string;
  location: string;
  responsibilities: string[];
  achievements?: string[];
}

export interface EducationItem {
  period: string;
  title: string;
  institution: string;
  description?: string;
}

export interface OfficialCertificate {
  code: string;
  title: string;
  issuer: string;
  issuedDate: string;
  category: 'cybersecurity' | 'ai_data' | 'design_thinking' | 'cloud' | 'project_agile' | 'marketing' | 'professional_skills' | 'web_dev';
  categoryLabel: string;
  description: string;
  badgeType: string;
  verificationUrl: string;
  featured?: boolean;
}

export interface LearningActivity {
  code: string;
  title: string;
  category?: string;
}

export const CANDIDATE_INFO: CandidateInfo = {
  name: "Deuwy Robert Teran Medina",
  birthDate: "7 August 1975",
  email: "deuwyrobert@gmail.com",
  phone: "+55 (51) 98280-4970",
  location: "São Leopoldo, RS, Brasil (LATAM & Global)",
  credlyProfile: "https://www.credly.com/users/deuwy-medina",
  credlyId: "198445cf-bf48-4c32-aaee-d0e81b149fd2",
  transcriptDate: "22 July 2026",
  summary: "Ingeniero de Producción y Calidad (Universidad Simón Bolívar), Economista, Auditor Líder en Sistemas Integrados de Gestión (ISO 9001, 14001, 45001 RAC/IRCA, IATF-16949) e IBM 2025 Executive Coach con 30 años de experiencia internacional en la industria. Especialista en optimización de procesos, gestión de la calidad, mejoría continua (Lean Manufacturing, Green Belt Six Sigma, 8D, RNC) y gestión de inventarios JIT. Con trayectoria demostrada en empresas como Rototech, Tapeçaria Palacio, D'classe Papeis y General Motors, liderando proyectos con reducción comprobada del 30% en reclamos de clientes, 25% en costos de inventarios y aumento del 15% en capacidad productiva."
};

export const IMPACT_METRICS = [
  { value: "30%", label: "Reducción en reclamos de clientes", detail: "Sistema de rastreo de quejas y acciones correctivas" },
  { value: "15%", label: "Aumento en capacidad de producción", detail: "Optimización de líneas VSM, Kaizen y redistribución" },
  { value: "25%", label: "Reducción en costos de inventario", detail: "Despliegue Just-in-Time (JIT) y flujo tenso" },
  { value: "20%", label: "Reducción en índice de rechazos", detail: "Metodología 8D, RNCs y control estadístico" },
  { value: "$195k", label: "Ahorro estimado en proyectos TCC GM", detail: "Aplicación de herramientas de calidad en capacitores" }
];

export const CAREER_EXPERIENCE: CareerRole[] = [
  {
    period: "Enero de 2024 – Actualidad",
    title: "Coordinador de Calidad y Procesos",
    company: "Rototech",
    location: "São Leopoldo, RS, Brasil",
    responsibilities: [
      "Coordinar las actividades integrales de gestión de la calidad y optimización de procesos productivos.",
      "Liderar la implementación de mejoría continua en las líneas operativas aplicando Lean Manufacturing y Six Sigma.",
      "Garantizar la conformidad con las normas de calidad ISO 9001, ISO 14001, ISO 45001 y requisitos del cliente.",
      "Realizar auditorías internas y externas, identificando no conformidades (RNCs) e impulsando tratamientos 8D.",
      "Monitorear indicadores clave de desempeño (KPIs), analizando tendencias operativas para la toma de decisiones.",
      "Elaborar, estandarizar y mantener actualizada la documentación del Sistema de Gestión de la Calidad (SGC).",
      "Realizar programas de formación y capacitación técnica continua sobre procedimientos de calidad e higiene operativa."
    ]
  },
  {
    period: "2021 – 2023",
    title: "Analista y Gestor de Calidad",
    company: "Tapeçaria Palacio",
    location: "Canoas, RS, Brasil",
    responsibilities: [
      "Desarrollo e implementación de estrategias de gestión de calidad en la línea de producción.",
      "Análisis de calidad de materias primas e insumos en estrecha colaboración con ingeniería y producción.",
      "Diseño y supervisión de procedimientos de control de calidad para cada etapa productiva.",
      "Investigación sistemática de problemas e implementación de soluciones con Ishikawa y 5 Porqués.",
      "Liderazgo en la homologación, auditoría y evaluación periódica de proveedores."
    ],
    achievements: [
      "Reducción del 15% en el índice de defectos del proceso productivo gracias al flujo sistemático de control.",
      "Diseño e implementación de un sistema de rastreo de reclamos de clientes con 30% de reducción en quejas.",
      "Optimización del proceso de aprobación de proveedores, reduciendo en 25% el tiempo de homologación."
    ]
  },
  {
    period: "2019 – 2021",
    title: "Gerente de Calidad y Producción",
    company: "D'classe Papeis",
    location: "Portão, RS, Brasil",
    responsibilities: [
      "Gestión integral de producción y calidad liderando un equipo multidisciplinario de ingenieros, técnicos y supervisores.",
      "Implementación de metodologías Lean Manufacturing y Six Sigma para maximizar la eficiencia y reducir costos.",
      "Desarrollo de políticas de control de calidad garantizando la satisfacción del cliente y normas sectoriales.",
      "Liderazgo en la implantación de sistemas integrados de gestión de producción, calidad y seguridad laboral.",
      "Análisis sistemático para minimizar el tiempo de inactividad de equipos en coordinación con mantenimiento."
    ],
    achievements: [
      "Implementación de un sistema automatizado de control de calidad que mejoró la precisión y velocidad en 30%.",
      "Liderazgo en la implementación de un sistema Just-in-Time, reduciendo costos de inventario en 25%.",
      "Desarrollo de un sistema de mejora continua en producción con reducción del 20% en tasa de rechazos.",
      "Colaboración con ingeniería en mejoras de línea de producción, aumentando la capacidad productiva en 15%."
    ]
  },
  {
    period: "2005 – 2018",
    title: "Analista de Compras Senior & Gestión Comercial / Retail",
    company: "General Motors",
    location: "Brasil & LATAM",
    responsibilities: [
      "Gestión estratégica y operacional de compras de materiales e insumos críticos para la producción automotriz.",
      "Liderazgo en la adquisición de insumos negociando con proveedores para asegurar calidad y tiempos JIT.",
      "Análisis de costos y evaluación continua de proveedores para una cadena de suministro rentable.",
      "Estrategias de negociación y reducción de costos mediante metodologías Lean y Six Sigma.",
      "Colaboración multidisciplinaria en proyectos de desarrollo de nuevos productos desde diseño hasta masa."
    ],
    achievements: [
      "Optimización de la cadena de suministro reduciendo costos de adquisición en 15% mediante negociación estratégica.",
      "Programa de desarrollo de proveedores que mejoró la calidad recibida, reduciendo reclamos en 20%.",
      "Integración de nuevos proveedores internacionales, ampliando la base de suministro."
    ]
  },
  {
    period: "1999 – 2005",
    title: "Auditor Interno de Calidad & Proyectos de Proceso (Estadía)",
    company: "General Motors",
    location: "Planta Automotriz",
    responsibilities: [
      "Participación en auditorías internas y externas ISO 9001.",
      "Elaboración y gestión de PPAP (Production Part Approval Process) junto a proveedores.",
      "Tratamiento de productos no conformes (RNC) y análisis de desvíos de proceso mediante metodología 8D.",
      "Aplicación de herramientas de la calidad: Ishikawa, 5 Porqués, Brainstorming, FMEA y Control Estadístico."
    ],
    achievements: [
      "TCC Aplicación de Herramientas de la Calidad en producción de capacitores con ganancias estimadas de $195,000.00 USD.",
      "Análisis y proyectos de mejora en pruebas finales, con aumento de 7 puntos en piezas aprobadas al primer intento."
    ]
  }
];

export const ACADEMIC_EDUCATION: EducationItem[] = [
  {
    period: "1995 - 1999",
    title: "Engenharia de Produção e Qualidade",
    institution: "Universidad Simón Bolívar",
    description: "Título universitario en ingeniería enfocado en investigación operativa, gestión de la calidad, optimización de sistemas productivos y costos."
  },
  {
    period: "2000",
    title: "Certificación en Lean Manufacturing",
    institution: "Instituto de Mejora Continua, Caracas, Venezuela",
    description: "Especialización avanzada en VSM, flujo continuo, Kaizen, 5S y eliminación de desperdicios."
  },
  {
    period: "1999",
    title: "Certificación Green Belt Six Sigma",
    institution: "Instituto de Ingeniería y Tecnología, Caracas, Venezuela",
    description: "Dominio de la metodología DMAIC, análisis estadístico de variabilidad y control estadístico de procesos (SPC)."
  },
  {
    period: "1992 - 1993",
    title: "Técnico Superior en Control de Calidad",
    institution: "Instituto Germán Celis Sauné",
    description: "Formación técnica especializada en metrología, normas ISO, muestreo y técnicas de inspección industrial."
  }
];

export const LANGUAGES_LIST = [
  { name: "Español", level: "Proficiente / Nativo", written: "Escrito e Falado", percentage: 100 },
  { name: "Portugués", level: "Proficiente", written: "Escrito e Falado", percentage: 100 },
  { name: "Inglés", level: "Proficiente", written: "Escrito e Falado", percentage: 95 },
  { name: "Italiano", level: "Proficiente", written: "Escrito e Falado", percentage: 90 },
  { name: "Ruso", level: "Proficiente", written: "Escrito e Falado", percentage: 85 }
];

export const INDUSTRIAL_COURSES = [
  "Auditor Líder Gestão Integrada | ISO 9001, ISO 14001 e ISO 45001 | RAC",
  "V Programa de Especialização em Gestão por Processos Qualidade & Formação de Auditor Interno ISO 9001",
  "Curso de Interpretação da Norma ISO 9001:2015",
  "Técnico em Control de Qualidade (Normas ISO)",
  "Auditoria Interna - Conceitos Principais",
  "O Processo de Certificação de Sistemas de Gestão",
  "Lean Manufacturing Basic & Advanced",
  "IATF-16949:2016 - Formação de Auditor Interno",
  "Green Belt Six Sigma",
  "Just-in-Time (JIT)",
  "QualityGB",
  "Quality 1",
  "Kanban & Produção",
  "Equipes de trabalho & Kaizen",
  "Value Stream Mapping (VSM)",
  "Herramientas de la Calidad (Ishikawa, 5 Porquês, Brainstorming, FMEA, PPAP, 8D, RNC)"
];

export const OFFICIAL_CERTIFICATES: OfficialCertificate[] = [
  {
    code: "PLAN-FA511CDFAF48",
    title: "Cybersecurity Fundamentals",
    issuer: "IBM SkillsBuild",
    issuedDate: "21 July 2025",
    category: "cybersecurity",
    categoryLabel: "Ciberseguridad",
    description: "Demuestra una comprensión fundamental de los conceptos, objetivos y prácticas de ciberseguridad. Incluye grupos de ciberamenazas, tipos de ataques, ingeniería social, estudios de casos, estrategias generales de seguridad, criptografía y enfoques comunes que las organizaciones toman para prevenir, detectar y responder a ciberataques.",
    badgeType: "Credencial Digital de Especialista",
    verificationUrl: "https://www.credly.com/users/deuwy-medina",
    featured: true
  },
  {
    code: "PLAN-BC0FAEE8E439",
    title: "Data Fundamentals",
    issuer: "IBM SkillsBuild",
    issuedDate: "22 July 2025",
    category: "ai_data",
    categoryLabel: "IA & Datos",
    description: "Demuestra conocimientos sobre conceptos de analítica de datos, metodologías y aplicaciones de ciencia de datos, así como las herramientas y lenguajes de programación utilizados en el ecosistema de datos. Comprensión conceptual para limpiar, refinar y visualizar datos utilizando IBM Watson Studio.",
    badgeType: "Credencial Digital de Especialista",
    verificationUrl: "https://www.credly.com/users/deuwy-medina",
    featured: true
  },
  {
    code: "ILB-EKRGXPZQVNYJ29BZ",
    title: "SkillsBuild - Customer Engagement: Communication and Personality Dynamics",
    issuer: "IBM SkillsBuild",
    issuedDate: "22 July 2025",
    category: "professional_skills",
    categoryLabel: "Habilidades Profesionales",
    description: "Comprensión profunda de metodologías y mejores prácticas para generar empatía y mantener una comunicación productiva. Incluye habilidades de comunicación clara y concisa, saber cuándo y cómo decir 'no', y colaborar eficazmente con equipos multidisciplinarios.",
    badgeType: "Insignia Profesional",
    verificationUrl: "https://www.credly.com/users/deuwy-medina",
    featured: true
  },
  {
    code: "ILB-JYWWMDKWZWMR1YMN",
    title: "SkillsBuild - Customer Engagement: Problem Solving and Process Controls",
    issuer: "IBM SkillsBuild",
    issuedDate: "22 July 2025",
    category: "project_agile",
    categoryLabel: "Procesos & Resolución",
    description: "Mejores prácticas esenciales para la resolución de problemas de clientes a través de la organización, recuperación y uso de recursos de información. Incluye acuerdos de nivel de servicio (SLA), sistemas de tickets y metodología Knowledge-Centered Service (KCS).",
    badgeType: "Insignia Profesional",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-7913EE1DB030",
    title: "Artificial Intelligence Fundamentals",
    issuer: "IBM SkillsBuild",
    issuedDate: "24 July 2025",
    category: "ai_data",
    categoryLabel: "IA & Datos",
    description: "Acreditación en conceptos de inteligencia artificial como procesamiento de lenguaje natural (NLP), visión por computadora, aprendizaje automático, deep learning, chatbots, redes neuronales, ética en IA y ejecución de modelos en IBM Watson Studio.",
    badgeType: "Credencial Digital de Especialista",
    verificationUrl: "https://www.credly.com/users/deuwy-medina",
    featured: true
  },
  {
    code: "F2C2D663869E",
    title: "Enterprise Design Thinking Practitioner",
    issuer: "IBM",
    issuedDate: "24 July 2025",
    category: "design_thinking",
    categoryLabel: "Design Thinking & UX",
    description: "Dominio de la metodología Enterprise Design Thinking y su aplicación práctica para centrarse en los resultados reales del usuario y liderar la innovación ágil en las organizaciones.",
    badgeType: "Insignia Oficial IBM",
    verificationUrl: "https://www.credly.com/users/deuwy-medina",
    featured: true
  },
  {
    code: "BECFAD8E7F61",
    title: "Enterprise Design Thinking Co-Creator",
    issuer: "IBM",
    issuedDate: "25 July 2025",
    category: "design_thinking",
    categoryLabel: "Design Thinking & UX",
    description: "Acredita al portador como un colaborador activo en proyectos de Enterprise Design Thinking, guiando talleres de innovación, co-creación estratégica y facilitando la resolución de problemas complejos.",
    badgeType: "Insignia Oficial IBM",
    verificationUrl: "https://www.credly.com/users/deuwy-medina",
    featured: true
  },
  {
    code: "EDT-AI-2025",
    title: "Enterprise Design Thinking - Team Essentials for AI",
    issuer: "IBM",
    issuedDate: "25 July 2025",
    category: "design_thinking",
    categoryLabel: "Design Thinking & UX",
    description: "Dominio en el uso de conceptos y actividades de Enterprise Design Thinking para diseñar sistemas de inteligencia artificial responsables, transparentes y centrados en las personas.",
    badgeType: "Insignia Oficial IBM",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-3E2A749669E2",
    title: "Information Technology Fundamentals",
    issuer: "IBM SkillsBuild",
    issuedDate: "28 July 2025",
    category: "cloud",
    categoryLabel: "Tecnología & Sistemas",
    description: "Demuestra conocimientos sólidos en fundamentos de TI, redes informáticas, hardware, software, seguridad informática y resolución metodológica de incidencias técnicas.",
    badgeType: "Credencial Digital",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-B2DE5C927EEC",
    title: "Project Management Fundamentals",
    issuer: "IBM SkillsBuild",
    issuedDate: "28 July 2025",
    category: "project_agile",
    categoryLabel: "Gestión de Proyectos",
    description: "Acreditación en principios de gestión de proyectos, ciclo de vida del proyecto, elaboración de Project Charter, Work Breakdown Structure (WBS), planes de comunicación y gestión de riesgos.",
    badgeType: "Credencial Digital (IPMA Recognized)",
    verificationUrl: "https://www.credly.com/users/deuwy-medina",
    featured: true
  },
  {
    code: "PLAN-B5FC126AEBFB",
    title: "Explore Emerging Tech",
    issuer: "IBM SkillsBuild",
    issuedDate: "30 July 2025",
    category: "cloud",
    categoryLabel: "Tecnologías Emergentes",
    description: "Comprensión holística de las seis tecnologías emergentes clave: Inteligencia Artificial, Blockchain, Computación en la Nube, Ciberseguridad, Ciencia de Datos e Internet de las Cosas (IoT).",
    badgeType: "Credencial Digital de Especialista",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-2EC3A305F2C3",
    title: "Cloud Computing Fundamentals",
    issuer: "IBM SkillsBuild",
    issuedDate: "31 July 2025",
    category: "cloud",
    categoryLabel: "Cloud Computing",
    description: "Acreditación en modelos de despliegue en la nube (IaaS, PaaS, SaaS), virtualización, orquestación, contenedores y seguridad en la nube para arquitecturas de alto rendimiento.",
    badgeType: "Credencial Digital",
    verificationUrl: "https://www.credly.com/users/deuwy-medina",
    featured: true
  },
  {
    code: "ILB-PZXNZVNYYRRQ2188",
    title: "Explorations into Mindfulness",
    issuer: "IBM SkillsBuild",
    issuedDate: "31 July 2025",
    category: "professional_skills",
    categoryLabel: "Gestión del Estrés & Liderazgo",
    description: "Comprensión de técnicas de mindfulness y autorregulación emocional aplicadas al entorno laboral corporativo para reducir el estrés, mejorar el enfoque directivo y potenciar el liderazgo asertivo.",
    badgeType: "Insignia Profesional",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-F8CBF9ECCA49",
    title: "Agile Explorer",
    issuer: "IBM SkillsBuild",
    issuedDate: "31 July 2025",
    category: "project_agile",
    categoryLabel: "Agile & Scrum",
    description: "Comprensión fundamental de los valores, principios y prácticas Ágiles. Capacidad para iniciar conversaciones Ágiles e implementar Scrum/Kanban en operaciones y equipos de alto rendimiento.",
    badgeType: "Insignia Profesional IBM",
    verificationUrl: "https://www.credly.com/users/deuwy-medina",
    featured: true
  },
  {
    code: "PLAN-034A5530450D",
    title: "Quantum Enigmas",
    issuer: "IBM SkillsBuild",
    issuedDate: "1 August 2025",
    category: "cloud",
    categoryLabel: "Computación Cuántica",
    description: "Conocimientos en fundamentos de computación cuántica, superposición, entrelazamiento cuántico, medición y diseño de circuitos cuánticos en IBM Quantum Composer.",
    badgeType: "Credencial Digital Avanzada",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-C4FCC67D3E76",
    title: "Working in a Digital World: Professional Skills",
    issuer: "IBM SkillsBuild",
    issuedDate: "4 August 2025",
    category: "professional_skills",
    categoryLabel: "Habilidades Profesionales",
    description: "Acreditación en habilidades blandas esenciales para el entorno digital: presentaciones de alto impacto, trabajo colaborativo ágil, solución crítica de problemas y comunicación asertiva.",
    badgeType: "Credencial Digital de Especialista",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-B7F68A410C9C",
    title: "Career Management Essentials",
    issuer: "IBM SkillsBuild",
    issuedDate: "4 August 2025",
    category: "professional_skills",
    categoryLabel: "Estrategia Profesional",
    description: "Dominio de estrategias para la investigación de entornos laborales, desarrollo de marca profesional, superación de filtros ATS y aplicación de herramientas de IA para optimización de perfil.",
    badgeType: "Credencial Digital",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-BFB9EE6140A8",
    title: "Entrepreneurship Marketing Essentials",
    issuer: "IBM SkillsBuild",
    issuedDate: "5 August 2025",
    category: "marketing",
    categoryLabel: "Marketing & Ventas",
    description: "Dominio de herramientas de marketing para emprendedores: metodología Lean Startup, análisis de mercado, estrategia de promoción, matriz ZOPA y habilidades de negociación avanzada.",
    badgeType: "Credencial Digital",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-3749C72117E2",
    title: "User Experience Design Fundamentals",
    issuer: "IBM SkillsBuild",
    issuedDate: "5 August 2025",
    category: "web_dev",
    categoryLabel: "UX Design & Producto",
    description: "Acreditación en conceptos, procesos y herramientas de diseño UX: creación de wireframes, prototipado interactivo, investigación con usuarios, mapas de empatía y pruebas de usabilidad.",
    badgeType: "Credencial Digital",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  },
  {
    code: "PLAN-8749C02A78EC",
    title: "Web Development Fundamentals",
    issuer: "IBM SkillsBuild",
    issuedDate: "5 August 2025",
    category: "web_dev",
    categoryLabel: "Desarrollo Web",
    description: "Demuestra conocimientos en arquitectura e ingeniería web, lenguajes HTML5, CSS3, JavaScript interactivo, prueba de sitios web y despliegue en entornos de desarrollo.",
    badgeType: "Credencial Digital",
    verificationUrl: "https://www.credly.com/users/deuwy-medina"
  }
];

export const ALL_LEARNING_ACTIVITIES: LearningActivity[] = [
  { code: "PLAN-A8F78B791514", title: "Technicienne Supérieure Systèmes et Réseaux (TSSR) et Technicienne d’Assistance Informatique (TAI)" },
  { code: "SN-COURSE-V1:IBMDEVELOPERSKILLSNETWORK+CC0103EN+V3", title: "IBM Cloud Essentials V3" },
  { code: "SN-COURSE-V1:IBMDEVELOPERSKILLSNETWORK+CC0101EN+V1", title: "Introduction to Cloud" },
  { code: "URL-C6FD8256ED04", title: "Réalisez un audit marketing | OpenClassrooms" },
  { code: "URL-1D431273CC7C", title: "Best Practices für Wege durch die Corona-Zeit | IHK Nordwestfalen" },
  { code: "URL-0C7C4B3639CF", title: "Corona Krise als Chance | Absatzwirtschaft" },
  { code: "URL-WIZWUISOJ1W", title: "IBM SkillsBuild Reignite: The Effect of the Coronavirus Pandemic on Mental Health at Work | Institute of Directors" },
  { code: "URL-86D9D067F44B", title: "Resources for Business Owners | IBM" },
  { code: "URL-74F1EE404D73", title: "COVID-19 is hitting retailers hard | IBM Institute for Business Value" },
  { code: "URL-3DD310276921", title: "The COVID-19 cyberwar: How to protect your business | IBM Institute for Business Value" },
  { code: "URL-A898F162E34D", title: "COVID-19 and shattered supply chains | IBM Institute for Business Value" },
  { code: "URL-A0E483869479", title: "Liquidity management | The Open University" },
  { code: "URL-77319890BC52", title: "Resilience in a Box | U.S. Chamber of Commerce Foundation" },
  { code: "URL-F7D07F64305E", title: "Developing career resilience | The Open University" },
  { code: "URL-EF33E0B59B7A", title: "Making decisions | The Open University" },
  { code: "URL-XEAXL-JYBQW", title: "Returning to Work After COVID-19: Employment Planning and Managing a Changed Workforce | Rev: Ithaca Startup Works" },
  { code: "URL-0424A350BD5C", title: "Leadership challenges in turbulent times | The Open University" },
  { code: "URL-A9333B324AE2", title: "Combien dois-je investir pour créer mon entreprise ? | l’Adie" },
  { code: "URL-2550DC5D7C11", title: "Où trouver de l’aide pour mes démarches administratives ? | l’Adie" },
  { code: "URL-8E9063C275FE", title: "Quel statut choisir pour mon entreprise ? | l’Adie" },
  { code: "URL-CF37ACEAA40F", title: "Construire son business plan | OpenClassrooms" },
  { code: "PLAN-8749C02A78EC", title: "Web Development Fundamentals (Earn a credential!)" },
  { code: "MDL-266", title: "Develop an Interactive Task List Web Page" },
  { code: "PLAN-3749C72117E2", title: "User Experience Design Fundamentals (Earn a credential!)" },
  { code: "MDL-375", title: "Working Collaboratively with Teams on UX Design Projects" },
  { code: "MDL-373", title: "Conducting Usability Tests and Gathering Feedback" },
  { code: "MDL-371", title: "Wireframing and Prototyping" },
  { code: "MDL-369", title: "Building a Story-based Design" },
  { code: "MDL-367", title: "Conducting UX Research" },
  { code: "PLAN-BFB9EE6140A8", title: "Esenciales de Marketing - ¡Obtén una insignia!" },
  { code: "ILB-RKEWNNDMKKVV41E6", title: "Herramientas de ventas" },
  { code: "ILB-NKQPWDWEDJPD22B7", title: "¡Demuestra lo que sabes! (Herramientas de ventas)" },
  { code: "ILB-PZVRKKDYJVJQ49YD", title: "Manual de ventas (Herramientas de ventas)" },
  { code: "ILB-NKQPZZVRYMGR166Y", title: "Árbol genealógico de productos (Herramientas de ventas)" },
  { code: "ILB-JYKJWZDNXXKJ25EQ", title: "ZOPA y estrategia (Herramientas de ventas)" },
  { code: "ILB-PZVRKKDPDYPD2188", title: "Triple enfoque y análisis del entorno (Herramientas de ventas)" },
  { code: "ILB-RKEWNNGYZGYN40V3", title: "Guión de preguntas (Herramientas de ventas)" },
  { code: "ILB-EKVWGGENMRDV38KD", title: "Clasificación ABC de clientes (Herramientas de ventas)" },
  { code: "ILB-ZKRNMMVKNWVM368A", title: "Base de datos de clientes (Herramientas de ventas)" },
  { code: "ILB-VQMGEEZVPKMX4WN7", title: "Árbol de clientes (Herramientas de ventas)" },
  { code: "ILB-XVPKJJNWQNRV8M3B", title: "Introducción (Herramientas de ventas)" },
  { code: "ILB-DNRDJKPGXGJY304K", title: "Habilidades de ventas" },
  { code: "ILB-RKEWQNZGXQVVQYVW", title: "¡Demuestra lo que sabes! (Habilidades de ventas)" },
  { code: "ILB-QPDVRWVXJVRG22ZP", title: "Negociación (Habilidades de ventas)" },
  { code: "ILB-GYEDVQMVQZPY29Z9", title: "Fidelización del cliente (Habilidades de ventas)" },
  { code: "ILB-NKQPRMQDMJDR279G", title: "Adaptabilidad (Habilidades de ventas)" },
  { code: "ILB-WWZJVRWQZDKZ2133", title: "Comunicación eficaz (Habilidades de ventas)" },
  { code: "ILB-KXMKZYPPQXRQ19Y7", title: "Orientación al cliente (Habilidades de ventas)" },
  { code: "ILB-DNRZKWZDXDPQ314X", title: "Pensamiento estratégico (Habilidades de ventas)" },
  { code: "ILB-MKPNXKDEYJNJ1399", title: "Innovación en ventas (Habilidades de ventas)" },
  { code: "ILB-PZVRYZNVJRWD18AB", title: "Introducción (Habilidades de ventas)" },
  { code: "ILB-EKVWEKYZWXJV75KR", title: "Creación del plan de marketing" },
  { code: "ILB-WWZJPWGGVGMZ48VY", title: "¡Demuestra lo que sabes! (Creación del Plan de Marketing)" },
  { code: "ILB-ZKRNVKMJKVKX2052", title: "Análisis de marketing (Creación del Plan de Marketing)" },
  { code: "ILB-NKQPVKZMGYDR38NE", title: "Marketing y ventas (Creación del Plan de Marketing)" },
  { code: "ILB-EKVWEKGNRQXM37WN", title: "Distribución (III) (Creación del Plan de Marketing)" },
  { code: "ILB-ZKRNVKMYKXZX30MB", title: "Distribución (II) (Creación del Plan de Marketing)" },
  { code: "ILB-XVPKZVJVRQDZ48PN", title: "Distribución (I) (Creación del Plan de Marketing)" },
  { code: "ILB-PZVRDZKYNMQQ128W", title: "Plan de promoción (VI) (Creación del Plan de Marketing)" },
  { code: "ILB-DNRZDNEPDNKQ26YB", title: "Plan de promoción (IV) (Creación del Plan de Marketing)" },
  { code: "ILB-WWZJPWKNKMWV415A", title: "Plan de promoción (III) (Creación del Plan de Marketing)" },
  { code: "ILB-DNRZDNWDQNEY35Q5", title: "Plan de promoción (II) (Creación del Plan de Marketing)" },
  { code: "ILB-EKVWEKYEQJDM31K8", title: "Plan de promoción (I) (Creación del Plan de Marketing)" },
  { code: "ILB-XVPKZVJYQRQV11PR", title: "Plan de promoción (V) (Creación del Plan de Marketing)" },
  { code: "ILB-QPDVEPNDDERV17GD", title: "Introducción (Creación del Plan de Marketing)" },
  { code: "ILB-WWZPRVYEYWJV30JN", title: "Marketing: Estrategia" },
  { code: "ILB-EKVWKGJWDVJV43A4", title: "¡Demuestra lo que sabes! (Marketing: Estrategia)" },
  { code: "ILB-MKPNKGNKMQYW41XX", title: "Conclusión (Marketing: Estrategia)" },
  { code: "ILB-MKPRMXVQDXDW23YV", title: "Promoción y distribución (Marketing: Estrategia)" },
  { code: "ILB-PZVDPYWQKMWZ10KQ", title: "Precio (Marketing: Estrategia)" },
  { code: "ILB-ZKRVQGQYJKJX325P", title: "Producto (2) (Marketing: Estrategia)" },
  { code: "ILB-WWZPRVYMQZEZ1KMB", title: "Producto (1) (Marketing: Estrategia)" },
  { code: "ILB-NKQVMRDRXXPR27QE", title: "Objetivos de venta (Marketing: Estrategia)" },
  { code: "ILB-PZVDPYWWGZZZ33AV", title: "Elementos de la estrategia (Marketing: Estrategia)" },
  { code: "ILB-PZVRZGVWYWGQ45MP", title: "Introducción (Marketing: Estrategia)" },
  { code: "ILB-ZKRXWNNXJWXX8E5Q", title: "Lean Startup: Fase de investigación" },
  { code: "ILB-JYKQMJQPWMPR63KN", title: "¡Demuestra lo que sabes! (Lean Startup: Fase de Investigación)" },
  { code: "ILB-NKQGYPGJGQVD14MB", title: "Diseño y análisis del canal (Lean Startup: Fase de Investigación)" },
  { code: "ILB-QPDQYVQZNKEG11JZ", title: "Análisis del Producto Mínimo Viable (Lean Startup: Fase de Investigación)" },
  { code: "ILB-ZKRXWNXEJVEQ17RW", title: "Producto y canal (Lean Startup: Fase de Investigación)" },
  { code: "ILB-GYEGMNGXEMVX4XNQ", title: "Análisis de la solución (Lean Startup: Fase de Investigación)" },
  { code: "ILB-ZKRXWNXJJVDM139V", title: "Características de la solución (Lean Startup: Fase de Investigación)" },
  { code: "ILB-JYKQMJQEVJWR102A", title: "Análisis de problemas (Lean Startup: Fase de Investigación)" },
  { code: "ILB-DNRVGZVNWRZQ948J", title: "Análisis y control de riesgos (Lean Startup: Fase de Investigación)" },
  { code: "ILB-VQMKYGGKMVPX12AJ", title: "Introducción (Lean Startup: Fase de Investigación)" },
  { code: "ILB-JYKKQGXKQQJJ942N", title: "Marketing: Análisis" },
  { code: "ILB-WWZJQEWJKKDZ16GW", title: "¡Demuestra lo que sabes! (Marketing: Análisis)" },
  { code: "ILB-PZVDPJRPPVNQ1843", title: "La competencia (2) (Marketing: Análisis)" },
  { code: "ILB-NKQVMEVMVYNR326K", title: "La competencia (1) (Marketing: Análisis)" },
  { code: "ILB-QPDEWKXMMDRNNXBD", title: "Ciclo de vida del producto (Marketing: Análisis)" },
  { code: "ILB-KXMPGJDKYGNV25DE", title: "El mercado (Marketing: Análisis)" },
  { code: "ILB-PZVDPGJVPNVD5Q3R", title: "¿Qué necesitamos? (Marketing: Análisis)" },
  { code: "ILB-PZVVNRPJWJPD6BAV", title: "El cliente (2) (Marketing: Análisis)" },
  { code: "ILB-MKPPDNMJGKNW7DMK", title: "El cliente (1) (Marketing: Análisis)" },
  { code: "ILB-RKEEVRPKJVWV97AR", title: "¿Qué es marketing? (Marketing: Análisis)" },
  { code: "ILB-YZQMZYJZYDMW379N", title: "Introducción (Marketing: Análisis)" },
  { code: "ILB-RKEVZGMVZPZN1ARP", title: "Lean Startup: Fase preparatoria" },
  { code: "ILB-JYKQMJYYEMXR2DM2", title: "¡Demuestra lo que sabes! (Lean Startup: Fase Preparatoria)" },
  { code: "ILB-JYKQMNVYNENJ452Y", title: "Selección y corrección Canvas (Lean Startup: Fase Preparatoria)" },
  { code: "ILB-VQMKYNPQRQVV99XV", title: "Entrevistas (Lean Startup: Fase Preparatoria)" },
  { code: "ILB-ZKRXWVJEDZXX8ZDG", title: "Autocuestionario (Lean Startup: Fase Preparatoria)" },
  { code: "ILB-PZVNGDJQYKJD2Y4E", title: "Canvas de lanzamiento III (Lean Startup: Fase Preparatoria)" },
  { code: "ILB-VQMKYNVPNYNX6NDD", title: "Canvas de lanzamiento II (Lean Startup: Fase Preparatoria)" },
  { code: "ILB-MKPDJRZXEXEW42JP", title: "Canvas de lanzamiento I (Lean Startup: Fase Preparatoria)" },
  { code: "ILB-EKVXPEDDZWZV2E6A", title: "Introducción (Lean Startup: Fase Preparatoria)" },
  { code: "ILB-WWZNYDQRENGV139Y", title: "Lean Startup: Fase de lanzamiento" },
  { code: "ILB-XVPQYEWJMDQN25EZ", title: "¡Demuestra lo que sabes! (Lean Startup: Fase de Lanzamiento)" },
  { code: "ILB-PZVNWJEMNWGD15VB", title: "Motor de crecimiento (Lean Startup: Fase de Lanzamiento)" },
  { code: "ILB-ZKRXZJYPJYYX272B", title: "Desarrollo (Lean Startup: Fase de Lanzamiento)" },
  { code: "ILB-ZKRXZJYPZYKX30V8", title: "Toma de decisiones (Lean Startup: Fase de Lanzamiento)" },
  { code: "ILB-ZKRXZJYGDNEM167B", title: "Valoración interna (Lean Startup: Fase de Lanzamiento)" },
  { code: "ILB-RKEVJRMQYZNY3449", title: "Introducción (Lean Startup: Fase de Lanzamiento)" },
  { code: "URL-97AE8DF936B4", title: "11 Tips for Improving Confidence at Work | Indeed Career Guide" },
  { code: "URL-7A5D8994EB2A", title: "10 Time Management Tips to Boost Your Productivity | CareerAddict" },
  { code: "URL-580FAD5DBE2A", title: "Time Management Skills: Definition and Examples | Indeed Career Guide" },
  { code: "URL-409F2249624F", title: "The Importance of Positive Feedback and How Deliver It to Others | Indeed Career Guide" },
  { code: "URL-DCABFB2D619B", title: "How To Develop a Professional Attitude | Indeed Career Guide" },
  { code: "URL-09B38F6CEC4C", title: "A Guide to Professionalism in the Workplace | Glassdoor" },
  { code: "URL-7D0DAB3D05FA", title: "How To Use the DACI Model for Making Team Decisions (With Tips) | Indeed Career Guide" },
  { code: "URL-43481EBC5408", title: "Tips for Making a Hard Decision at Work | Indeed Career Guide" },
  { code: "URL-CTIUIN6INIQ", title: "How to make faster decisions | The Way We Work, a TED series" },
  { code: "URL-C2QB1UTTWXM", title: "How To Make Better Decisions - 12 Decision Making Tips | Brainy Dose" },
  { code: "URL-EEC97EA7D0A4", title: "The Importance of Confident Decision Making | Indeed Career Guide" },
  { code: "URL-36DD46F8BD49", title: "Decision-Making Methods for the Workplace | Indeed Career Guide" },
  { code: "URL-PPIHAM_WGBQ", title: "Decision-Making Strategies | GCFLearnFree.org" },
  { code: "URL-CA6D4BEB3EDD", title: "De la blockchain et du bitcoin par Primavera de Filippi | l'EPSAA et la mairie de Paris" },
  { code: "URL-954AE724C27D", title: "Comprendre le bitcoin et la blockchain | OpenClassrooms" },
  { code: "URL-CD69552007F7", title: "Blockchain: Sicherheit auch ohne Trust Center | openHPI" },
  { code: "URL-6FA73FB6D003", title: "Blockchain basics: Introduction to distributed ledgers | IBM Developer" },
  { code: "URL-QQCBVFP3KBW", title: "Blockchain Technology Explained | What Is Blockchain Technology? | Blockchain Training | Edureka" },
  { code: "URL-WEUJQKEFSXM", title: "What is Blockchain? | Introduction to Blockchain Technology | Blockchain Tutorial | Simplilearn" },
  { code: "URL-HYIP_VUV8J0", title: "Blockchain Expert Explains One Concept in 5 Levels of Difficulty | WIRED" },
  { code: "URL-FB887C26B96B", title: "Get started with artificial intelligence | IBM Developer" },
  { code: "URL-14F84A415945", title: "Objectif IA : initiez-vous à l'intelligence artificielle | OpenClassrooms" },
  { code: "URL-6A515FE867AE", title: "Le machine learning est-il l'avenir de l'homme ? | OpenClassrooms" },
  { code: "URL-E451CE9F9F30", title: "Die Power von KI: Was steckt wirklich hinter Künstlicher Intelligenz? | Fit4Internet and IBM" },
  { code: "URL-WNQKFPCPK1G", title: "AI And Machine Learning Full Course | Artificial Intelligence & Machine Learning Course | Simplilearn" },
  { code: "URL-1AE76ADD4550", title: "Deep Learning | IBM Cloud Education" },
  { code: "URL-F41D1D3FAA60", title: "Everyday Ethics for Artificial Intelligence" },
  { code: "URL-332C7DE56AB8", title: "Elements of AI | Finnish Government" },
  { code: "URL-8608AF032C16", title: "A beginner’s guide to artificial intelligence, machine learning, and cognitive computing | IBM Developer" },
  { code: "URL-A0_LO_GDCFW", title: "What Is Artificial Intelligence? | CrashCourse AI #1" },
  { code: "ILB-KXWDJNXRZDNV2XAQ", title: "What is agile at IBM?" },
  { code: "ILB-XVXMENRRKNPNQZDY", title: "Show what you know (What is agile at IBM?)" },
  { code: "ILB-JYWRGXDYMZWZ1YE6", title: "Agile for leaders (What is agile at IBM?)" },
  { code: "ILB-NKWJERDMEYNDMAGG", title: "Agile practices to try! (What is agile at IBM?)" },
  { code: "ILB-NKWJEERWREED2YBW", title: "IBM's agile values and principles (What is agile at IBM?)" },
  { code: "ILB-QPXNKJPNPKVG8RGM", title: "The essence (What is agile at IBM?)" },
  { code: "PLAN-B6CBEFCA2BFD", title: "Applied Data Science with Python" },
  { code: "PLAN-92E2B150F301", title: "Big Data Foundations" },
  { code: "URL-F2C2D663869E", title: "Enterprise Design Thinking Practitioner (Course and Badge) | IBM" },
  { code: "SN-COURSE-V1:COGNITIVECLASS+DV0101EN+V2", title: "Data Visualization with Python" },
  { code: "SN-COURSE-V1:COGNITIVECLASS+DA0101EN+V1", title: "Data Analysis with Python" },
  { code: "SN-COURSE-V1:COGNITIVECLASS+PY0101EN+V3", title: "Python for Data Science" },
  { code: "SN-COURSE-V1:BIGDATAUNIVERSITY+BD0211EN+V1", title: "Spark Fundamentals I" },
  { code: "SN-COURSE-V1:BIGDATAUNIVERSITY+BD0111EN+V1", title: "Hadoop 101" },
  { code: "SN-COURSE-V1:COGNITIVECLASS+BD0101EN+V2", title: "Big Data 101" },
  { code: "PLAN-7913EE1DB030", title: "Artificial Intelligence Fundamentals (Earn a credential!)" },
  { code: "MDL-317", title: "The Money Maker GANs Game" },
  { code: "MDL-298", title: "Mastering the Art of Prompting" },
  { code: "MDL-213", title: "Your Future in AI: The Job Landscape" },
  { code: "MDL-220", title: "AI Ethics" },
  { code: "MDL-277", title: "Protecting a device with Malwarebytes" },
  { code: "MDL-219", title: "Run AI Models with IBM Watson Studio" },
  { code: "MDL-212", title: "Machine Learning and Deep Learning" },
  { code: "MDL-214", title: "Natural Language Processing and Computer Vision" },
  { code: "MDL-211", title: "Introduction to Artificial Intelligence" },
  { code: "MDL-276", title: "Network scanning with Zenmap" },
  { code: "PLAN-BC0FAEE8E439", title: "Data Fundamentals (Earn a credential!)" },
  { code: "URL-EACCF7D49B72", title: "FCF - Technical Introduction to Cybersecurity" },
  { code: "PLAN-8BA559FB451B", title: "Fortinet Certified Fundamentals (FCF)" },
  { code: "URL-6D66017196DE", title: "FCF - Getting Started in Cybersecurity" },
  { code: "URL-1D6EED9E14D2", title: "FCF - Introduction to the Threat Landscape" },
  { code: "MDL-218", title: "Your Future in Data: The Job Landscape" },
  { code: "MDL-217", title: "Clean, Refine, and Visualize Data with IBM Watson Studio" },
  { code: "MDL-221", title: "Overview of Data Tools and Languages" },
  { code: "MDL-216", title: "Data Science in Our World" },
  { code: "MDL-215", title: "Introduction to Data Concepts" },
  { code: "PLAN-BD722B8C89DA", title: "Trust what you create | IBM and Adobe" },
  { code: "ALM-COURSE_3826556", title: "Adobe Firefly and Gen AI for Content Creation" },
  { code: "PLAN-FA511CDFAF48", title: "Cybersecurity Fundamentals (Earn a credential!)" },
  { code: "ALM-COURSE_3946275", title: "Tech meets beauty: IBM & L’Oréal’s partnership for sustainable cosmetics" },
  { code: "URL-CC7432BB7A8A", title: "Earn it! Accept it! Share it! | IBM SkillsBuild" },
  { code: "URL-0E39749E2965", title: "Create a Credly account" },
  { code: "ALM-COURSE_3826557", title: "Fishy AI: Generating AI images" },
  { code: "ALM-COURSE_3826558", title: "Responsible Content Creation with Generative AI" },
  { code: "ALM-COURSE_3826560", title: "An Introduction to Generative AI and Content Creation" },
  { code: "ALM-COURSE_3946036", title: "Teeing off with technology: IBM at the Masters" }
];
