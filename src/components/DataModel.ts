export interface ProcessItem {
  id: string;
  name: string;
  type: 'estrategico' | 'operativo' | 'soporte';
  inputs: string[];
  outputs: string[];
  suppliers: string[];
  clients: string[];
  kpis: { name: string; target: string; frequency: string }[];
  subprocesses: {
    name: string;
    responsible: string;
    cycleTime: string;
    resources: string[];
    documents: { type: 'procedimiento' | 'instructivo' | 'formato'; code: string; name: string }[];
  }[];
  checklist: { id: string; question: string; isorReq: string; helpText: string }[];
}

export interface SectorData {
  id: string;
  name: string;
  description: string;
  icon: string;
  processes: ProcessItem[];
  commonNC: {
    id: string;
    title: string;
    clause: string;
    description: string;
    containment: string;
    rootCause: string;
    fiveWhys: string[];
    ishikawa: {
      personal?: string[];
      maquinaria?: string[];
      metodo?: string[];
      material?: string[];
      medicion?: string[];
      medioAmbiente?: string[];
    };
    correctiveAction: string;
    verification: string;
  }[];
  coqStats: {
    prevention: { amount: number; kpi: string; items: string[] };
    evaluation: { amount: number; kpi: string; items: string[] };
    internalFailures: { amount: number; kpi: string; items: string[] };
    externalFailures: { amount: number; kpi: string; items: string[] };
  };
}

export const SECTORS: SectorData[] = [
  {
    id: 'tech_software',
    name: 'Desarrollo de Software y Soporte TI',
    description: 'Empresa proveedora de soluciones de software a medida, aplicaciones SaaS y soporte técnico en la nube.',
    icon: 'Cpu',
    processes: [
      {
        id: 'P1',
        name: 'Planificación Estratégica y Dirección',
        type: 'estrategico',
        inputs: ['Feedback de Clientes', 'Auditorías Anteriores', 'Análisis de Mercado'],
        outputs: ['Plan Anual de Objetivos (OKR)', 'Estructura Organizacional', 'Presupuestos'],
        suppliers: ['Socios', 'Comité de Calidad', 'Consultor ISO'],
        clients: ['Toda la Organización', 'Auditores Externos'],
        kpis: [
          { name: 'Cumplimiento de Objetivos Estratégicos', target: '≥ 95%', frequency: 'Trimestral' },
          { name: 'Eficiencia de Asignación de Recursos', target: '92%', frequency: 'Semestral' }
        ],
        subprocesses: [
          {
            name: 'Revisión por la Dirección (9.3)',
            responsible: 'Gerencia General',
            cycleTime: '5 días de preparación',
            resources: ['Informes de Procesos', 'Líder del SGC', 'Sala de Reuniones/Docs'],
            documents: [
              { type: 'procedimiento', code: 'PR-DIR-01', name: 'Procedimiento de Revisión por la Dirección' },
              { type: 'formato', code: 'FO-DIR-01', name: 'Acta de Reunión de Dirección' }
            ]
          }
        ],
        checklist: [
          { id: 'C1.1', question: '¿Cómo se asegura la alta dirección de que el SGC mantenga el enfoque al cliente? (5.1.2)', isorReq: '5.1.2', helpText: 'Buscar actas de revisión, encuestas y KPIs de satisfacción.' },
          { id: 'C1.2', question: '¿Están la política y objetivos de calidad alineados con el marco estratégico de la empresa? (6.2)', isorReq: '6.2.1', helpText: 'Comprobar disponibilidad y comunicación de los objetivos a los equipos.' },
          { id: 'C1.3', question: '¿Se han definido mecanismos claros de control de cambios al SGC? (6.3)', isorReq: '6.3', helpText: 'Revisar bitácoras de cambios en arquitectura o metas.' },
          { id: 'C1.4', question: '¿La gerencia provee la infraestructura tecnológica necesaria para la operación? (7.1.3)', isorReq: '7.1.3', helpText: 'Verificar servidores, licencias de compilación, IDEs, etc.' },
          { id: 'C1.5', question: '¿Se comunican los canales oficiales para reportar vulnerabilidades o fallas? (7.4)', isorReq: '7.4', helpText: 'Boletines internos, slack oficial.' },
          { id: 'C1.6', question: '¿Cómo se evalúa periódicamente el desempeño y eficacia general del SGC? (9.1)', isorReq: '9.1.1', helpText: 'Revisar informes semestrales presentados a la junta.' },
          { id: 'C1.7', question: '¿Existe evidencia documentada de auditorías internas programadas y realizadas? (9.2)', isorReq: '9.2.2', helpText: 'Verificar el programa anual y los informes firmados.' },
          { id: 'C1.8', question: '¿Se analizan de forma sistemática los resultados de encuestas de clientes? (9.1.2)', isorReq: '9.1.2', helpText: 'Revisar NPS global e histórico.' },
          { id: 'C1.9', question: '¿El acta de revisión de dirección incluye la evaluación de riesgos del software? (9.3)', isorReq: '9.3.2.e', helpText: 'Constatar que se debatieron los riesgos de ciberseguridad.' },
          { id: 'C1.10', question: '¿Se promueve activamente la mejora continua en base a datos de auditorías? (10.3)', isorReq: '10.3', helpText: 'Revisar planes de mejora por departamento.' }
        ]
      },
      {
        id: 'P2',
        name: 'Ingeniería de Software y Desarrollo',
        type: 'operativo',
        inputs: ['Requisitos del Cliente', 'Estándares de Codificación', 'Diseño UX/UI'],
        outputs: ['Código Fuente', 'Versión Web Beta', 'Documentación de la API'],
        suppliers: ['Diseño UX', 'Gestor de Producto', 'Comité de Arquitectura'],
        clients: ['Equipo de QA', 'Usuario Final'],
        kpis: [
          { name: 'Densidad de Defectos en Producción', target: '< 0.5 NC por KLOC', frequency: 'Mensual' },
          { name: 'Cumplimiento de Plazos en Sprints', target: '≥ 90%', frequency: 'Por Sprint' },
          { name: 'Índice de Cobertura de Código (Test Unitarios)', target: '≥ 80%', frequency: 'Automático' }
        ],
        subprocesses: [
          {
            name: 'Codificación y Desarrollo de Features (8.5)',
            responsible: 'Tech Lead / Desarrolladores Scrum',
            cycleTime: 'Sprints de 2 semanas',
            resources: ['Repository Github/GitLab', 'Sistemas de CI/CD', 'Docker containers'],
            documents: [
              { type: 'procedimiento', code: 'PR-DEV-02', name: 'Procedimiento de Desarrollo Ágil SGC' },
              { type: 'instructivo', code: 'IN-DEV-01', name: 'Estándar para Revisiones de Código (Code Review)' },
              { type: 'formato', code: 'FO-DEV-03', name: 'Lista de Control de Criterios de Listo (DoD)' }
            ]
          }
        ],
        checklist: [
          { id: 'C2.1', question: '¿Cómo se determinan los requisitos detallados del cliente antes de codificar? (8.2)', isorReq: '8.2.2', helpText: 'Comprobar Backlog inicial, Historias de Usuario aprobadas.' },
          { id: 'C2.2', question: '¿Se realizan revisiones de viabilidad técnica antes del compromiso de entrega? (8.2.3)', isorReq: '8.2.3', helpText: 'Verificar firmas de contratos o actas de kick-off de proyecto.' },
          { id: 'C2.3', question: '¿Están las entradas para el diseño de la arquitectura plenamente documentadas? (8.3.3)', isorReq: '8.3.3', helpText: 'Verificar especificaciones de arquitectura, dependencias y riesgos de integración.' },
          { id: 'C2.4', question: '¿Cómo se controlan los cambios realizados durante el desarrollo de software? (8.3.6)', isorReq: '8.3.6', helpText: 'Revisar bitácoras de Git (Pull Requests con aprobación obligatoria).' },
          { id: 'C2.5', question: '¿Se definen criterios de aceptación claros para los entregables de software? (8.3.5)', isorReq: '8.3.5', helpText: 'Verificar DoD (Definition of Done) en la pizarra ágil.' },
          { id: 'C2.6', question: '¿Existe trazabilidad entre la historia de usuario original y el código final? (8.5.2)', isorReq: '8.5.2', helpText: 'Revisar etiquetado en sistemas como JIRA con el ID de la tarea integrada.' },
          { id: 'C2.7', question: '¿Cómo se asegura la preservación del código y copias de seguridad de las bases de datos? (8.5.4)', isorReq: '8.5.4', helpText: 'Verificar backups diarios automáticos y almacenamiento en nubes replicadas.' },
          { id: 'C2.8', question: '¿Se realizan revisiones sistemáticas por pares (Code Reviews) antes de fusionar código? (8.5.1)', isorReq: '8.5.1', helpText: 'Comprobar los registros en GitHub de Pull Requests mergeados.' },
          { id: 'C2.9', question: '¿Cómo se aprueba el pase a producción de nuevas versiones de software? (8.6)', isorReq: '8.6', helpText: 'Verificar informe de cierre de Sprint y conformidad firmada por el Product Owner.' },
          { id: 'C2.10', question: '¿Qué acciones se toman si se detectan bugs críticos en producción? (8.7)', isorReq: '8.7', helpText: 'Revisar el registro de Hotfixes y la comunicación al cliente.' }
        ]
      },
      {
        id: 'P3',
        name: 'Aseguramiento de la Calidad (QA) y Testing',
        type: 'operativo',
        inputs: ['Código Compilado', 'Plan de Negocios y Casos de Prueba', 'Ambiente Staging'],
        outputs: ['Reportes de Bugs', 'Certificación de Versión (QAs Approved)', 'Matriz de Pruebas Ejecutada'],
        suppliers: ['Desarrollo de Software', 'Gestión de Producto'],
        clients: ['Desarrollo', 'Usuarios para pruebas UAT (Betas)', 'Implantadores'],
        kpis: [
          { name: 'Eficacia de Pruebas de Software (Bugs detectados internos vs externos)', target: '≥ 92%', frequency: 'Por Release' },
          { name: 'Automatización de Casos Críticos de Regresión', target: '≥ 70%', frequency: 'Trimestral' }
        ],
        subprocesses: [
          {
            name: 'Ejecución de Pruebas de Regresión y Automatización (8.6)',
            responsible: 'QA Automation Engineer',
            cycleTime: '3 días antes de release',
            resources: ['Plataformas de testing (Selenium, Cypress)', 'Sistemas de integración continua'],
            documents: [
              { type: 'procedimiento', code: 'PR-QA-03', name: 'Procedimiento de Aseguramiento de Calidad' },
              { type: 'instructivo', code: 'IN-QA-02', name: 'Instructivo para el Diseño de Casos de Prueba' },
              { type: 'formato', code: 'FO-QA-05', name: 'Informe de Cobertura y Certificación de Calidad' }
            ]
          }
        ],
        checklist: [
          { id: 'C3.1', question: '¿Están documentados e implementados los planes de pruebas y criterios de release? (8.6)', isorReq: '8.6', helpText: 'Revisar matriz de test suites y criterios de no tener blockers abiertos.' },
          { id: 'C3.2', question: '¿Cómo se aíslan los entornos de desarrollo y pruebas del de producción? (8.5.1)', isorReq: '8.5.1.d', helpText: 'Confirmar configuraciones separadas de red de bases de datos.' },
          { id: 'C3.3', question: '¿Se validan las herramientas de testing automatizado de manera previa? (7.1.5)', isorReq: '7.1.5', helpText: 'Comprobar soporte técnico de herramientas Cypress/Browserstack.' },
          { id: 'C3.4', question: '¿Existe evidencia de la participación del cliente en las pruebas de aceptación (UAT)? (8.2.3)', isorReq: '8.2.3.1', helpText: 'Revisar actas de feedback y firmas en JIRA de UAT Sign-off.' },
          { id: 'C3.5', question: '¿Se controlan y clasifican rigurosamente los defectos identificados en software? (8.7)', isorReq: '8.7.1', helpText: 'Verificar en el gestor ágil que todos los bugs tienen categoría (Blocker, Major, Minor).' },
          { id: 'C3.6', question: '¿Se documenta quién autorizó la liberación definitiva después de una falla? (8.6)', isorReq: '8.6', helpText: 'Inspeccionar registros de firma digital en herramientas CI/CD.' },
          { id: 'C3.7', question: '¿Se realizan pruebas de carga y estrés para garantizar estabilidad estructural del SGC? (8.1)', isorReq: '8.1', helpText: 'Revisar planes de pruebas de rendimiento del año.' },
          { id: 'C3.8', question: '¿Se verifica que se cumplan las normativas de protección de datos sensibles en testing? (8.5.4)', isorReq: '8.5.4', helpText: 'Asegurar uso de datos anonimizados en Staging.' },
          { id: 'C3.9', question: '¿Se realiza seguimiento a los tiempos promedio de resolución de bugs críticos? (9.1)', isorReq: '9.1.3', helpText: 'Revisar métricas semanales de MTTR (Mean Time to Resolution).' },
          { id: 'C3.10', question: '¿Cómo retroalimentan las fallas de QA a la planificación del desarrollo? (10.2)', isorReq: '10.2.1', helpText: 'Revisar actas de retrospectivas de fin de Sprint.' }
        ]
      },
      {
        id: 'P4',
        name: 'Soporte de Infraestructura y Gestión de Operaciones (IT)',
        type: 'soporte',
        inputs: ['Códigos Aprobados', 'Tickets de Incidentes', 'Monitoreo de Servidores'],
        outputs: ['Ambiente en Producción Estable', 'SLA Cumplido', 'Copias de Seguridad'],
        suppliers: ['QA', 'Desarrollo', 'Proveedores de Nube (AWS, GCP)'],
        clients: ['Cliente Final', 'Soporte del Negocio'],
        kpis: [
          { name: 'Disponibilidad de Sistemas (Uptime)', target: '≥ 99.9%', frequency: 'Tiempo Real' },
          { name: 'Tiempo de Respuesta a Incidentes Prioridad 1', target: '< 15 min', frequency: 'Mensual' }
        ],
        subprocesses: [
          {
            name: 'Mantenimiento Correctivo y Preventivo Cloud (7.1)',
            responsible: 'DevOps / SysAdmin',
            cycleTime: 'Ejecución automatizada (Copias de seguridad diarias)',
            resources: ['Consolas AWS/Azure/GCP', 'Herramientas de alertas (PagerDuty / Grafana)'],
            documents: [
              { type: 'procedimiento', code: 'PR-IT-04', name: 'Procedimiento de Gestión de Infraestructura Nube' },
              { type: 'instructivo', code: 'IN-IT-03', name: 'Instructivo para la Replicación de Backups' },
              { type: 'formato', code: 'FO-IT-08', name: 'Informe de Pruebas Anuales de Recuperación de Desastres (DRP)' }
            ]
          }
        ],
        checklist: [
          { id: 'C4.1', question: '¿Cómo se gestionan las plataformas de nube para asegurar la continuidad operativa? (7.1.3)', isorReq: '7.1.3', helpText: 'Revisar tableros de disponibilidad y monitoreo continuo.' },
          { id: 'C4.2', question: '¿Están definidos formalmente los acuerdos de nivel de servicio (SLA) con clientes? (8.2.1)', isorReq: '8.2.1', helpText: 'Inspeccionar contratos y anexos de soporte.' },
          { id: 'C4.3', question: '¿Existe un plan estructurado contra desastres de servidores? (8.1)', isorReq: '8.1.3', helpText: 'Revisar el Plan de Continuidad y la simulación anual del DRP.' },
          { id: 'C4.4', question: '¿Cómo se administra el control de accesos de TI a datos y repositorios? (8.5.1)', isorReq: '8.5.1', helpText: 'Verificar doble factor de autenticación (2FA) y principio de menor privilegio.' },
          { id: 'C4.5', question: '¿Se realiza control a los proveedores externos de infraestructura (ej. AWS, Heroku)? (8.4)', isorReq: '8.4.1', helpText: 'Revisar reportes SOC2 de los proveedores o acuerdos de servicio.' },
          { id: 'C4.6', question: '¿Se auditan los logs de cambios y pases a producción realizados? (8.5.6)', isorReq: '8.5.6', helpText: 'Revisar bitácora automática del pipeline de CI/CD.' },
          { id: 'C4.7', question: '¿Se cuenta con equipos calibrados u herramientas de medición de latencia válidas? (7.1.5)', isorReq: '7.1.5', helpText: 'Comprobar software oficial de análisis de tráfico con soporte (ej. Datadog).' },
          { id: 'C4.8', question: '¿Cómo se identifican y notifican incidentes o caídas de nube de manera proactiva? (8.2.1)', isorReq: '8.2.1', helpText: 'Revisar estado de integraciones de telemetría automática y SMS.' },
          { id: 'C4.9', question: '¿Se capacita continuamente al personal de DevOps en ciberseguridad? (7.2)', isorReq: '7.2', helpText: 'Buscar constancias del curso de OWASP de este año.' },
          { id: 'C4.10', question: '¿Cómo se registran, analizan y cierran los tickets por fallas técnicas? (10.2)', isorReq: '10.2', helpText: 'Comprobar incidentes en Jira Service Desk, su análisis de causa raíz si escalaron a NC.' }
        ]
      }
    ],
    commonNC: [
      {
        id: 'NC-TECH-01',
        title: 'Liberación de código a Producción sin Pruebas QA completas',
        clause: '8.6 Liberación de productos y servicios',
        description: 'Se constató que en el despliegue del software v2.1.4, se liberaron 3 módulos críticos de facturación a producción sin haber completado la suite de pruebas automatizadas y omitiendo la firma (DoD) del área de QA, derivando en llamadas de soporte urgentes de clientes debido a errores fiscales.',
        containment: 'Se revirtió de manera urgente la versión web v2.1.4 aplicando un Rollback a la versión estable anterior v2.1.3. Se inició auditoría de base de datos para corregir los registros dañados de 12 clientes empresariales.',
        rootCause: 'El pipeline de GitHub Actions tiene configurado un botón de anulación "Bypass QA" accesible a los ingenieros de software sdr, utilizado para "agilizar" entregas urgentes sin supervisión del líder de QA. Falta de candados de gobernanza dura.',
        fiveWhys: [
          '¿Por qué falló el cálculo en el software liberado? Porque se desplegó un bug crítico en el módulo fiscal.',
          '¿Por qué pasó el bug a producción? Porque la Suite de Pruebas Automáticas de QA para facturación no se ejecutó en esa rama.',
          '¿Por qué no se ejecutó el bloque de testing? Porque el desarrollador líder utilizó el bypass técnico "Force Merge".',
          '¿Por qué usó el desarrollador el bypass "Force Merge"? Porque el Project Manager presionó por la fecha límite de entrega para cobrar el hito trimestral.',
          '¿Por qué el sistema de CI/CD permitió el Bypass técnico? Porque las políticas de protección de ramas ("Branch Protection Rules") en GitHub no estaban activas por defecto para este repositorio (Falta de estandarización en la configuración inicial del proyecto).'
        ],
        ishikawa: {
          personal: ['Préstamo de desarrolladores a proyectos sin inducción en el SGC.', 'Presión del Project Manager para facturar el hito comercial.'],
          maquinaria: ['La herramienta GitHub no bloqueaba el bypass del Tech Lead.', 'La base de datos de testeo estaba caída el día de la prueba.'],
          metodo: ['Inconsistencia en el instructivo DoD (Definition of Done) para pases de emergencia.', 'Falta de auditoría aleatoria a ramas GitHub.'],
          material: ['Framework de testing desactualizado para APIs fiscales.'],
          medicion: ['Uso exclusivo de KPIs de velocidad (Velocity) en detrimento de KPIs de calidad.'],
          medioAmbiente: ['Clima organizacional orientado al apuro y de culpa (blaming) hacia QA.']
        },
        correctiveAction: 'Configurar protección de ramas obligatoria (Branch Protection Rules) en GitHub para todos los repositorios SGC de la empresa. Esto impedirá a cualquier usuario, incluido administradores, hacer "merge" si las pruebas en Jenkins/GitHub Actions están fallando o si no tienen la aprobación obligatoria de QA (2 personas). Deshabilitar el bypass de Git.',
        verification: 'Verificar mensualmente los logs de fusión en GitHub mediante auditoría de procesos IT. El indicador de "Bypass del DoD" debe mantenerse en un estricto 0%.'
      }
    ],
    coqStats: {
      prevention: {
        amount: 8500,
        kpi: '% sobre Costos de Desarrollo (3.5%)',
        items: ['Suscripción a Plataformas de Formación (Platzi, Udemy Business)', 'Talleres mensuales de Arquitectura y Buenas Prácticas (Clean Code)', 'Mantenimiento de Servidores y Herramientas CI/CD (Github Enterprise)']
      },
      evaluation: {
        amount: 14200,
        kpi: '% sobre Costos de QA (11.2%)',
        items: ['Licencias de BrowserStack para testing multiedpositivo', 'Salario del equipo QA dedicado exclusivamente a verificar requerimientos', 'Herramienta de Monitoreo de APIs (New Relic)']
      },
      internalFailures: {
        amount: 32000,
        kpi: '% del Presupuesto de Desarrollo (15.5%)',
        items: ['Horas hombre extras consumidas en solucionar bugs de pases fallidos', 'Pérdida de productibilidad por rehacer requerimientos mal comprendidos (Re-work)', 'Servidores extras encendidos para pruebas manuales de emergencia']
      },
      externalFailures: {
        amount: 18000,
        kpi: '% sobre Ventas Totales (4.2%)',
        items: ['Notas de crédito compensatorias a clientes por fallas del SaaS', 'Soporte adicional extendido fuera de horario laboral de emergencia', 'Pérdida de membresías recurrentes de 3 clientes decepcionados (Churn)']
      }
    }
  },
  {
    id: 'manufactura',
    name: 'Manufactura de Productos Plásticos',
    description: 'Planta de extrusión, soplado e inyección de piezas plásticas de alta resistencia para el sector automotriz y de empaques.',
    icon: 'Factory',
    processes: [
      {
        id: 'P1-MFG',
        name: 'Aseguramiento y Control de Operaciones de Planta',
        type: 'estrategico',
        inputs: ['Datos de Merma', 'Plan de Producción', 'Resultados de Ensayos de Laboratorio'],
        outputs: ['Manuales de Operación', 'Procedimientos de Control', 'Límites de Tolerancia'],
        suppliers: ['Mantenimiento', 'I+D', 'Gerencia General'],
        clients: ['Línea de Producción', 'Logística'],
        kpis: [
          { name: 'OEE (Efectividad Total de Equipos)', target: '≥ 85%', frequency: 'Diario' },
          { name: 'Índice de Clientes Satisfechos', target: '96%', frequency: 'Semestral' }
        ],
        subprocesses: [
          {
            name: 'Revisión Sistemática de Parámetros (8.5)',
            responsible: 'Jefe de Planta',
            cycleTime: 'Turnos de 8 horas',
            resources: ['Planillas de arranque', 'Instrumentos de precisión (Calibres, termómetros)'],
            documents: [
              { type: 'procedimiento', code: 'PR-PROD-01', name: 'Procedimiento de Producción Plásticos SGC' },
              { type: 'formato', code: 'FO-PROD-04', name: 'Reporte Diario de Operaciones y Paros de Máquina' }
            ]
          }
        ],
        checklist: [
          { id: 'CM1.1', question: '¿Cómo evalúa la alta dirección los riesgos asociados a lesiones en operadores? (6.1)', isorReq: '6.1.1', helpText: 'Comprobar matriz de riesgos IPER de seguridad en maquinaria.' },
          { id: 'CM1.2', question: '¿Se han definido objetivos de productividad y merma por cada línea de extrusión? (6.2)', isorReq: '6.2.1', helpText: 'Ver pancartas o pizarrones de producción con metas de scrap diarias.' },
          { id: 'CM1.3', question: '¿Las competencias de los mecánicos de inyección están validadas y registradas? (7.2)', isorReq: '7.2', helpText: 'Comprobar matriz de polivalencia en planta.' },
          { id: 'CM1.4', question: '¿Existe un inventario y estado de calibración de balanzas e instrumentos de pesaje? (7.1.5)', isorReq: '7.1.5', helpText: 'Revisar etiquetas de calibración de laboratorios tercerizados (acreditados ISO/IEC 17025).' },
          { id: 'CM1.5', question: '¿Se preservan adecuadamente las fichas técnicas e instrucciones de trabajo en formato físico? (7.5)', isorReq: '7.5.3', helpText: 'Revisar portafolios impermeables al lado de cada máquina inyectora.' },
          { id: 'CM1.6', question: '¿Cómo se asegura el cumplimiento de las metas dadas en la revisión de dirección? (9.3)', isorReq: '9.3.3', helpText: 'Inspeccionar actas de seguimiento mensual con firmas del gerente.' },
          { id: 'CM1.7', question: '¿Se planifican las auditorías internas de planta considerando el riesgo de paradas? (9.2)', isorReq: '9.2.1', helpText: 'Revisar programa anual de auditorías y su justificación por frecuencia.' },
          { id: 'CM1.8', question: '¿Se procesan estadísticamente los datos de piezas rechazadas por turno? (9.1.3)', isorReq: '9.1.3', helpText: 'Imágenes o planillas de cartas de control SPC.' },
          { id: 'CM1.9', question: '¿Existe evidencia de encuestas de calidad realizadas a los clientes automotrices? (9.1.2)', isorReq: '9.1.2', helpText: 'Revisar las evaluaciones de proveedores provenientes de clientes.' },
          { id: 'CM1.10', question: '¿Las acciones correctivas de mermas pasadas fueron eficaces para evitar su recurrencia? (10.2)', isorReq: '10.2.1.b', helpText: 'Revisar bitácora de no conformidades del año anterior.' }
        ]
      },
      {
        id: 'P2-MFG',
        name: 'Inyección, Extrusión y Soplado',
        type: 'operativo',
        inputs: ['Materia Prima (Resina Plástica)', 'Masterbatch / Colorante', 'Moldes Metálicos'],
        outputs: ['Piezas Plásticas Terminadas', 'Rebaba Plástica Reutilizable', 'Muestras de Calidad'],
        suppliers: ['Logística / Almacén', 'Mantenimiento (Moldes)'],
        clients: ['Empaque', 'Almacén de Producto Terminado'],
        kpis: [
          { name: 'Tasa de Producto No Conforme (Scrap Rate)', target: '< 1.8%', frequency: 'Diaria' },
          { name: 'Ciclos de Inyección por Minuto', target: '4.5 RPM promedio', frequency: 'Por Turno' }
        ],
        subprocesses: [
          {
            name: 'Moldeo e Inyección por Presión (8.5)',
            responsible: 'Operador de Inyectora / Técnico Ajustador',
            cycleTime: '35 segundos por pieza (Ciclo promedio)',
            resources: ['Inyectora de 350 Toneladas', 'Enfriador (Chiller)', 'Tolva secadora'],
            documents: [
              { type: 'procedimiento', code: 'PR-PROD-02', name: 'Procedimiento de Cambio de Molde y Parametrización' },
              { type: 'instructivo', code: 'IN-PROD-05', name: 'Manual de Ajustes de Temperaturas según Resina' },
              { type: 'formato', code: 'FO-PROD-12', name: 'Checklist para Liberación de Primera Pieza Coherente' }
            ]
          }
        ],
        checklist: [
          { id: 'CM2.1', question: '¿Cómo se valida la calidad de la primera pieza fabricada en cada orden de producción? (8.5.1)', isorReq: '8.5.1', helpText: 'Comprobar formato FO-PROD-12 firmado por el ajustador.' },
          { id: 'CM2.2', question: '¿Cómo se identifican visualmente los lotes de resina virgen de los recuperados? (8.5.2)', isorReq: '8.5.2', helpText: 'Revisar tarjetas de colores de identificación de estado (Estatus de Lote).' },
          { id: 'CM2.3', question: '¿Se realiza el mantenimiento preventivo a las inyectoras según el plan del año? (7.1.3)', isorReq: '7.1.3', helpText: 'Verificar tarjetas amarillas y hojas de historial de lubricación de máquinas.' },
          { id: 'CM2.4', question: '¿Se controlan las condiciones térmicas de secado de la resina higroscópica? (8.5.1)', isorReq: '8.5.1.e', helpText: 'Comprobar indicador de la tolva deshumidificadora cada 2 horas.' },
          { id: 'CM2.5', question: '¿Cómo se previene el daño de la propiedad del cliente (moldes de propiedad del cliente)? (8.5.3)', isorReq: '8.5.3', helpText: 'Buscar actas de recepción y mantenimiento preventivo de moldes marcados con el logo del cliente.' },
          { id: 'CM2.6', question: '¿Qué acciones de preservación de producto se toman para evitar polución de cajas plásticas? (8.5.4)', isorReq: '8.5.4', helpText: 'Verificar flejado correcto y film estirable aplicado a los palets.' },
          { id: 'CM2.7', question: '¿Se cumplen las tolerancias dimensionales especificadas en los planos del cliente? (8.6)', isorReq: '8.6', helpText: 'Verificar planos de ingeniería y registros de medidas de laboratorio.' },
          { id: 'CM2.8', question: '¿Las mermas y scrap son controlados y pesados debidamente? (8.7)', isorReq: '8.7', helpText: 'Revisar contenedor rojo de mermas y su pesaje documentado en el sistema.' },
          { id: 'CM2.9', question: '¿Se registran las paradas imprevistas justificando causas mecánicas o térmicas? (9.1)', isorReq: '9.1.3', helpText: 'Revisar historial del OEE y mermas.' },
          { id: 'CM2.10', question: '¿Qué acciones correctivas se ejecutan frente a un lote contaminado con burbujas? (10.2)', isorReq: '10.2', helpText: 'Verificar reportes NC recientes.' }
        ]
      }
    ],
    commonNC: [
      {
        id: 'NC-MFG-01',
        title: 'Presencia de deformaciones térmicas en lote de piezas inyectadas',
        clause: '8.7 Control de las salidas no conformes',
        description: 'Durante la auditoría interna se evidenciaron 300 piezas plásticas automotrices con "rechupes" y deformación por enfriamiento deficiente embaladas en el área de producto terminado listas para despacho. El ajustador de máquina no realizó el chequeo de "primera pieza" por apuro comercial.',
        containment: 'Se segregó el lote dañado de 300 piezas colocándolo físicamente en la jaula roja de "BLOQUEADO/NO CONFORME" con su respectiva etiqueta amarilla de advertencia. Se aplicó paro inmediato a la inyectora #5.',
        rootCause: 'El sensor de temperatura de agua de enfriamiento del sistema de moldes (Chiller) estaba descalibrado, enviando agua a 28°C en vez de los 15°C reglamentarios, lo que provocó que el plástico no solidificara correctamente a tiempo en el ciclo.',
        fiveWhys: [
          '¿Por qué se deformaron las piezas? Por exceso de calor retenido en el centro de la pieza moldeada.',
          '¿Por qué retuvieron calor? Porque el tiempo de enfriamiento fue ineficiente o el agua templada ingresaba caliente.',
          '¿Por qué ingresaba agua caliente al molde? Porque el chiller no estaba bajando la temperatura a 15°C.',
          '¿Por qué el chiller no bajó la temperatura si marcaba 15°C en el panel? Porque la sonda de medición térmica del panel estaba rota y descalibrada (Marcaba un error de 13°C de desfase).',
          '¿Por qué la sonda estaba descalibrada y no se detectó antes? Porque no se incluía al chiller auxiliar en el plan rutinario de calibraciones preventivas del laboratorio SGC (Falta de alcance integral del mantenimiento operativo).'
        ],
        ishikawa: {
          personal: ['Operador sin capacitación para detectar visualmente mermas sutiles.', 'Ajustador de máquina nuevo sin certificación interna.'],
          maquinaria: ['Chiller auxiliar con mantenimiento deficiente.', 'Falta de alarma auditiva en la inyectora ante variación térmica.'],
          metodo: ['Omisión deliberada del formato de aprobación de primera pieza.', 'Procedimiento PR-PROD-02 desactualizado hace un año.'],
          material: ['Materia prima con variación de lote superior a la tolerancia.'],
          medicion: ['Uso de termómetro de pinza con pila descargada.', 'Plan de calibración sin control sobre sondas integradas.'],
          medioAmbiente: ['Temperatura ambiente de la nave industrial muy elevada en verano (40°C), afectando enfriamiento natural.']
        },
        correctiveAction: 'Modificar el plan de calibraciones preventivas de planta para incluir todas las sondas de los equipos auxiliares de inyección (chillers, secadoras). Instalar un sistema de enclavamiento físico en la inyectora que detenga automáticamente el ciclo automático si el agua de refrigeración excede los 18°C.',
        verification: 'Inspeccionar el historial de calibraciones del laboratorio y comprobar que se ha incluido el código de calibración EQ-VAL-CH-05 correspondiente al chiller.'
      }
    ],
    coqStats: {
      prevention: {
        amount: 12000,
        kpi: '% del Prespuesto de Mantenimiento (8.2%)',
        items: ['Mantenimiento Predictivo con Termografía y Ultrasonido', 'Capacitación a Técnicos Ajustadores en Optimización SMED', 'Auditoría externa de sistemas de refrigeración industrial']
      },
      evaluation: {
        amount: 8500,
        kpi: '% sobre Costos de Planta (1.5%)',
        items: ['Calibración de Calibres digitales de espesores acreditados por la EMA', 'Material de reactivos químicos para ensayos de tracción de probetas', 'Evaluación de laboratorios externos de materias primas plásticas']
      },
      internalFailures: {
        amount: 45000,
        kpi: '% de Mermas sobre Facturación (3.8%)',
        items: ['Piezas plásticas desechadas directas al molino de reproceso (Scrap)', 'Retrabajo manual de desbabe en 15.000 piezas moldeadas defectuosas', 'Costo de merma por arranque de máquina errónea y purgas de plástico quemado']
      },
      externalFailures: {
        amount: 14000,
        kpi: '% sobre Costos Totales de Producción (0.8%)',
        items: ['Retorno de un flete logístico entero por lote rechazado en automotriz', 'Penalización por retraso en entrega contratada con General Motors', 'Viajes de ingenieros de SGC para auditorías de resolución de reclamo del cliente']
      }
    }
  }
];
