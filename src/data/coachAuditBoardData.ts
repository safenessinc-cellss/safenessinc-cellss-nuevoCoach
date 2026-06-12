export interface CoachBtnDetails {
  id: string;
  num: number;
  name: string;
  badge: string;
  normResourceDesc: string;
  consoleASCII: string;
  visualDiag1Name: string;
  visualDiag1Mermaid: string;
  visualDiag1ASCII: string;
  diagnostico: string[];
  coachLook: string;
  matrixIntervention: {
    problemType: string;
    coachingApproach: string;
    keyTool: string;
  }[];
  acompanamiento: string[];
  visualDiag2Name: string;
  visualDiag2Mermaid: string;
  visualDiag2ASCII: string;
  coherenceText: string;
  coherenceASCII: string;
  connections: {
    btnId: string;
    btnName: string;
    description: string;
  }[];
}

export const COACH_AUDIT_BOARD_DATA: CoachBtnDetails[] = [
  {
    id: "gestionycalidad",
    num: 1,
    name: "ISO Gestión de Calidad (SGC 9001)",
    badge: "SGC 9001",
    normResourceDesc: "Activo verificado de madurez corporativa bajo ISO 9001:2015 cláusulas 4.4, 5.1 y 6.1. Diseñado para centralizar y diagnosticar el estado del Sistema de Gestión de Calidad.",
    consoleASCII: `========================================================================
 CONSOLA DE AUDITORÍA SGC - SISTEMA DE GESTIÓN DE CALIDAD ISO 9001:2015
========================================================================
 [STATUS: ACTIVO] 🟢 | [MODO: AUDITORÍA EN VIVO] SGI v4.4
------------------------------------------------------------------------
 INDICADORES CLAVE (KPIs):
  • GAP INDEX GLOBAL      : [████████████░░░░░░] 70% | Meta: 95% [DESVIADO 🟡]
  • EFECTIVIDAD OKR CALID : [████████████████░░] 82% | Estado: ESTABLE 🟢
  • PROCESOS CLAVE CERTIF : [ 9/12 ]               75% | Obj:  100% [EN COLA]
------------------------------------------------------------------------
 ALERTAS CRÍTICAS SGC:
  ⚠️ CLÁUSULA 8.2: Desviación leve en control de especificaciones iniciales.
  ⚠️ CLÁUSULA 9.3: Reunión de Revisión por la Dirección con vigencia > 11 meses.
========================================================================`,
    visualDiag1Name: "Ciclo PHVA (Planificar-Hacer-Verificar-Actuar)",
    visualDiag1Mermaid: `graph TD
    P[Planear <br/> Cls. 4, 5, 6] --> H[Hacer <br/> Cls. 7, 8]
    H --> V[Verificar <br/> Cls. 9]
    V --> A[Actuar <br/> Cls. 10]
    A --> P
    style P fill:#4F46E5,stroke:#fff,stroke-width:2px,color:#fff
    style H fill:#DC2626,stroke:#fff,stroke-width:2px,color:#fff
    style V fill:#2563EB,stroke:#fff,stroke-width:2px,color:#fff
    style A fill:#16A34A,stroke:#fff,stroke-width:2px,color:#fff`,
    visualDiag1ASCII: `       ┌─────────────────────────┐
       │      P - PLANEAR        │ <--- Cláusulas 4, 5, 6 SGC
       │  (FODA, Riesgos, OKRs)  │
       └────────────┬────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │       H - HACER         │ <--- Cláusulas 7, 8 Operaciones
       │ (SOPs, Producción, OC)  │
       └────────────┬────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │     V - VERIFICAR       │ <--- Cláusula 9 Evaluación
       │ (Inspección, Auditoría) │
       └────────────┬────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │       A - ACTUAR        │ <--- Cláusula 10 Mejora
       │   (CAPAs, Plan 8D)      │
       └────────────┬────────────┘
                    │
                    └─(Ciclo recíproco de Mejora Continua)─┘`,
    diagnostico: [
      "Brecha en el alineamiento estratégico SGC: Generalmente, la alta dirección aprueba la política de calidad pero no participa activamente, dejándola aislada en la pared y sin tracción operacional real.",
      "Desconexión entre el análisis de riesgos clínicos (ISO 31000) y los procesos operacionales de primera línea en piso, provocando que los riesgos se queden en plantillas XLS muertas.",
      "Deficiente trazabilidad del ciclo de vida de los cambios que impactan la calidad del servicio técnico entregado, lo que genera fallas repetitivas por no aplicar control en la fase de 'Planear'."
    ],
    coachLook: "El Coach concibe el SGC como el esqueleto vivo de la organización, no como un tomo de papel para exhibir a los auditores de certificación. La consultoría se enfoca en despertar el 'por qué' de cada control corporativo, transformando la burocracia documental en herramientas asertivas y ágiles que eliminen los costos de no-calidad y empoderen a los colaboradores.",
    matrixIntervention: [
      {
        problemType: "Falta de compromiso de los líderes de área con los KPIs del SGC",
        coachingApproach: "Taller Gestalt sobre la responsabilidad sobre la entrega técnica y cómo impacta en el clima organizacional",
        keyTool: "Matriz RACI de Procesos y Sesiones 1-on-1 de Calidad Empática"
      },
      {
        problemType: "Cultura de ocultamiento ante desviaciones operativas en la línea",
        coachingApproach: "Políticas de psicología de cero-culpa y redefinición asertiva del error laboral",
        keyTool: "Buzón Ágil de Reporte de Cuasi-Fallas y CAPA colaborativo"
      }
    ],
    acompanamiento: [
      "Diagnosticar la madurez actual del SGC analizando las cláusulas 4, 5 y 6.",
      "Co-diseñar la política de calidad integrando las expectativas reales de los colaboradores en talleres dinámicos.",
      "Desplegar un plan trimestral de sensibilización a través del juego de 'Buscadores de Brechas' para eliminar el miedo a las auditorías.",
      "Vincular de forma nativa los objetivos operativos (OKRs) con el mapa interactivo de procesos de la empresa."
    ],
    visualDiag2Name: "Mapa de Interacción de Procesos Integrales (SIG)",
    visualDiag2Mermaid: `graph LR
    E[Entradas: Requisitos Ley / Clientes] --> ES[P. Estratégicos: Dirección, SGI]
    ES --> OP[P. Operacionales: Ingeniería -> Compras -> Ops -> QC -> CAPA]
    SP[P. Soporte: TI, Infraestructura, RH] --> OP
    OP --> S[Salidas: Satisfacción, Rentabilidad]
    style E fill:#0284C7,stroke:#fff,color:#fff
    style ES fill:#D97706,stroke:#fff,color:#fff
    style OP fill:#DC2626,stroke:#fff,color:#fff
    style SP fill:#7C3AED,stroke:#fff,color:#fff
    style S fill:#059669,stroke:#fff,color:#fff`,
    visualDiag2ASCII: `   [ ENTRADAS ] ─────────────────►  ┌─────────────────────────┐
  - Requisitos de Clientes          │  PROCESOS ESTRATÉGICOS  │  Politica de Calidad,
  - Requisitos Legales Vivos        │ (Liderazgo & Contexto)  │  Asignacion de Fondos
                                    └────────────┬────────────┘
                                                 │
                                                 ▼
   [ SOPORTE / APOYO ] ──────────►  ┌─────────────────────────┐  ◄─── CADENA DE VALOR
  - Talento Humano (RH)             │  PROCESOS OPERATIVOS    │  Manufactura del Producto
  - TI, Infraestructura             │  (Diseño -> Despacho)   │  Efectividad Técnica (OEE)
                                    └────────────┬────────────┘
                                                 │
                                                 ▼
   [ SALIDAS SGI ] ◄─────────────────────────────┘
  - Clientes Satisfechos / NPS Alto
  - Retorno Financiero Mejorado`,
    coherenceText: "El SGC (Módulo 1) provee la sombrilla de gobernanza bajo la cual operan los demás módulos. Es la entrada técnica oficial de la empresa. Al definir las responsabilidades organizacionales, alimenta la Estructura de la Empresa (Módulo 2); al delimitar los flujos de la cadena de valor, nutre el Mapeo de Procesos (Módulo 3); y ante cualquier quiebre, se apoya en el Análisis Crítico (Módulo 4) para su recuperación integradora.",
    coherenceASCII: `[MÓDULO 1: SGC 9001]
       │
       ├─► [MÓDULO 2: Organizacional] ── (Roles de Proceso SGC)
       ├─► [MÓDULO 3: Mapeo de Procesos] ── (Estandarización de SOPs)
       └─► [MÓDULO 4: Análisis Crítico] ── (Mitigación de No Conformidades)`,
    connections: [
      { btnId: "estructuras", btnName: "Estructuras de Empresas", description: "Provee la estructura jerárquica y de liderazgo necesaria para definir los dueños de proceso solicitados en la Cláusula 5.3 de ISO 9001." },
      { btnId: "mapeo", btnName: "Mapeo de Procesos", description: "Detalla visualmente la cadena de valor que compone la Cláusula 4.4 de ISO 9001, desde requisitos hasta satisfacción." },
      { btnId: "auditorias", btnName: "Análisis Crítico", description: "Implementa las herramientas correctoras exigidas por la Cláusula 10.2 ante quiebres de calidad o auditorías de certificación." }
    ]
  },
  {
    id: "estructuras",
    num: 2,
    name: "Estructuras de Empresas (Org Setup)",
    badge: "Org Setup",
    normResourceDesc: "Activo de arquitectura de gobernanza corporativa, evaluado bajo la Cláusula 5.3 (Roles, responsabilidades y autoridades operativas).",
    consoleASCII: `========================================================================
 CONSOLA DE ARQUITECTURA ORGANIZACIONAL & TRAMO DE CONTROL
========================================================================
 [GOBERNANZA: EVALUADA] | [ESTILO ACTIVO: MATRICIAL FLEXIBLE] SGI v4.1
------------------------------------------------------------------------
 PARÁMETROS DEL SISTEMA:
  • TRAMO DE CONTROL     : 8 Pers. por Jefe | Capacidad Operativa: ESTABLE 🟢
  • CAPAS JERÁRQUICAS    : 4 Niveles        | Distancia de flujo: ACEP 🟡
  • COEFICIENTE DE SILO  : [████████░░░░░░░░] 50% | Estado: MODERADO 🟡
------------------------------------------------------------------------
 MÉTRICAS BUROCRÁTICAS:
  - Delay de Comunicación: 6.0x (Retraso sistémico acumulado)
  - Desalineación Org   : 33.3% (Fricción estimada entre áreas de soporte)
========================================================================`,
    visualDiag1Name: "Comparativa de Modelos de Estructura Organizativa",
    visualDiag1Mermaid: `graph TD
    classDef main fill:#1E293B,stroke:#fff,color:#fff
    subgraph Jerarquico[1. Jerárquico Vertical]
        A1[CEO] --> B1[Gerente]
        B1 --> C1[Supervisor]
    end
    subgraph Matricial[2. Matricial Flexible]
        A2[Líder Proy] <--> B2[Líder Funcional]
        B2 <--> C2[Especialista]
    end
    subgraph Project[3. Orientado a Proyectos]
        A3[Sponsor] --> B3[Célula Scrum]
        B3 --> C3[Squads Autómatas]
    end
    style A1 fill:#4F46E5,stroke:#fff,color:#fff`,
    visualDiag1ASCII: `  1. JERÁRQUICO (Vertical)      2. MATRICIAL (Flexible)      3. PROYECTOS / ÁGIL
         [ CEO ]                      [ CEO ]                   [ Célula de Valor ]
            │                         ┌──┴──┐                    ┌──────┴──────┐
       [ Gerente ]               [ Func ] [ Proyect ]       [ Squad 1 ]   [ Squad 2 ]
            │                         └──┬──┘               (Autónomos, libres de silo)
      [ Supervisor ]            [ Especialista SIG ]`,
    diagnostico: [
      "Efecto Silo Organizacional: Cada departamento opera como una isla aislada con objetivos locales competitivos, bloqueando el flujo natural de la cadena de valor.",
      "Cuellos de Botella por Micro-management: Tramo de control sumamente estrecho donde la toma de decisiones descansa exclusivamente en un director hiper-saturado.",
      "Desalineación entre descripciones de puesto teóricas y la realidad táctica de piso, generando roles superpuestos y 'fuga' de responsabilidades críticas de calidad."
    ],
    coachLook: "El Coach enfoca el diseño estructural para favorecer la fluidez, no la rigidez de los organigramas. Un exceso de niveles jerárquicos asesina la velocidad operativa y fomenta el ocultamiento de errores por miedo. Se promueve la transformación hacia modelos matriciales o ágiles planos con tramos de control eficientes y canales asertivos de comunicación directa.",
    matrixIntervention: [
      {
        problemType: "Fricción constante entre Operaciones y el área de Calidad",
        coachingApproach: "Taller relacional de alineamiento de objetivos compartidos y asimilación de la auditoría preventiva",
        keyTool: "Matriz RACI compartida de liberación conforme"
      },
      {
        problemType: "Decisiones lentas por pirámide hiper-jerárquica pesada",
        coachingApproach: "Delegación asertiva basada en umbrales de riesgo controlados",
        keyTool: "Políticas de delegación autónoma por Cláusula 5.3"
      }
    ],
    acompanamiento: [
      "Analizar el organigrama actual evaluando el coeficiente relacional de silos.",
      "Entrevistar de forma constructiva a los líderes de proceso para redefinir el tramo de control real.",
      "Facilitar mesas de negociación para establecer acuerdos de colaboración directa inter-operativa.",
      "Estandarizar descriptores de perfil y tramos de control en el SGC para asegurar soporte permanente."
    ],
    visualDiag2Name: "Análisis del Efecto Cuello de Botella vs. Efecto Silo",
    visualDiag2Mermaid: `graph LR
    subgraph Silo[Efecto Silo: Áreas Bloqueadas]
        I[Ingeniería] -.-|Barrera| C[Compras]
        C -.-|Barrera| O[Ops]
    end
    subgraph Bottleneck[Efecto Cuello de Botella: Director Saturado]
        O1[Op 1] --> D[Director SIG]
        O2[Op 2] --> D
        O3[Op 3] --> D
        D -->|Saturación/Delay| R[Liberación Proy]
    end
    style C fill:#DC2626,color:#fff
    style D fill:#DC2626,color:#fff`,
    visualDiag2ASCII: `  EFECTO SILO (Paredes de Comunicación)     EFECTO CUELLO DE BOTELLA (Micro-management)
    ┌───────────┐     ┌───────────┐                [Operador 1] ───┐
    │  ÁREA A   │ ░░░ │  ÁREA B   │                [Operador 2] ───┼─► [ DIRECTOR ] ─X (Lento)
    │ "No es mi │ ░░░ │ "No es mi │                [Operador 3] ───┘   (Aprobación Única)
    │ problema" │     │ problema" │
    └───────────┘     └───────────┘`,
    coherenceText: "La Estructura Organizativa (Módulo 2) establece el marco de gobernanza y organigramas bajo los cuales se gestionará la cadena de valor. El Mapeo de Procesos (Módulo 3) requiere de estos descriptores jerárquicos para asignar dueños responsables (RACI). A su vez, una estructura definida mitiga el micro-management evaluado en la Revisión por la Dirección (Módulo 5) y el Liderazgo Coach (Módulo 9).",
    coherenceASCII: `[MÓDULO 2: Organizacional]
       │
       ├─► [MÓDULO 3: Mapeo de Procesos] ── (Asigna dueños RACI)
       ├─► [MÓDULO 5: Rev. Dirección] ───── (Evaluación de Liderazgo)
       └─► [MÓDULO 9: Coach IBM 2025] ───── (Desarrollo de Competencia Directiva)`,
    connections: [
      { btnId: "mapeo", btnName: "Mapeo de Procesos", description: "Provee los insumos de perfiles para consolidar los dueños de proceso técnicos del flujo operacional." },
      { btnId: "direccion", btnName: "Análisis de Gestión", description: "Facilita la retroalimentación de la estructura durante laCláusula 9.3 para reajustar recursos humanos y técnicos." },
      { btnId: "liderazgo", btnName: "IBM 2025 Coach", description: "Asegura la deconstrucción de estructuras rígidas mediante la asimilación del liderazgo preventivo Gestalt de Robert Terán." }
    ]
  },
  {
    id: "mapeo",
    num: 3,
    name: "Mapeo de Procesos (Niveles 0-2)",
    badge: "Niveles 0-2",
    normResourceDesc: "Manual técnico de estandarización táctico, evaluado bajo la Cláusula 4.4 (Sistema de gestión de calidad y sus procesos) de ISO 9001:2015.",
    consoleASCII: `========================================================================
 CONSOLA DEL MOTOR DE PROCESAMIENTO / MAPEO DE PROCESOS (N0-N1-N2)
========================================================================
 [MODO: ARQUITECTO ACTIVO] | [SOPs EN VIGENCIA] SGI v4.4
------------------------------------------------------------------------
 MÉTRICAS DEL SISTEMA DE MEDICIÓN (SIX SIGMA INTEGRADO):
  • DEFECTOS DETECTADOS  : 15 Defectos     | Millón Oportunidades: 120,000 DP
  • RENDIMIENTO DE PRIMERA: 88.0% (FTY)     | Criterio: EXCELENTE 🟢
  • NIVEL SIGMA DETECTADO: 2.7 Sigma       | Capacidad de Proceso: REPROBADO 🔴
------------------------------------------------------------------------
 JERARQUÍA DOCUMENTAL ACTIVA:
  - Nivel 0: Macroproceso SGI (Cadena de Valor Integral)
  - Nivel 1: Procesos Tácticos (Soporte, Compras, Ops, QC)
  - Nivel 2: Procedimientos Detallados (Instrucciones Técnicas / SOPs)
========================================================================`,
    visualDiag1Name: "Diagrama BPMN Simplificado - Flujo de Proceso Operativo",
    visualDiag1Mermaid: `graph TD
    classDef start border:2px,fill:#111;
    Start([1. Cliente Emite RFQ]) --> P_Planea[2. Estudiar ToR y Requisitos]
    P_Planea --> Dec1{¿Cumple Viabilidad?}
    Dec1 -- No --> End[Rechazar / Iterar]
    Dec1 -- Sí --> H_Compras[3. Generar Planos & Presupuesto]
    H_Compras --> V_Inspeccion[4. Realizar Inspección QC]
    V_Inspeccion --> Final([5. Servicio Autorizado para Entrega])
    style Start fill:#4F46E5,color:#fff
    style Dec1 fill:#D97706,color:#fff
    style Final fill:#16A34A,color:#fff`,
    visualDiag1ASCII: `  [INICIO CLIENTE] ──► (Estudiar Requerimientos) ──► ¿Es Viable?
                                                            │
                                                   ┌────────┴────────┐
                                                No │              Sí │
                                                   ▼                 ▼
                                            [Rechazar Proy]   (Diseño Técnico planos)
                                                                     │
                                                                     ▼
                                                              [Inspección QC]
                                                                     │
                                                                     ▼
                                                              [ENTREGA FINAL]`,
    diagnostico: [
      "Ausencia de estandarización a nivel 2 (Instrucciones Técnicas Autogestionables), obligando a los operadores a memorizar flujos complejos y propiciando fallas constantes.",
      "Desconexión semántica entre el Mapeo de Procesos formal de la ISO y el día a día operativo en planta, volviendo inútil el manual SIG.",
      "Incapacidad diagnóstica para calcular variabilidad u cuellos de botella mediante Six Sigma, dejando las decisiones operativas basadas en 'presentimientos' temporales."
    ],
    coachLook: "El Coach busca liberar el proceso de todo desperdicio innecesario (Lean) y variabilidad excesiva (Six Sigma). Mapear no es dibujar cajitas de colores en una pantalla; es desentrañar el flujo de valor para que cada miembro entienda qué recibe, qué transforma de forma asertiva y qué entrega, eliminando fricciones, silos y demoras.",
    matrixIntervention: [
      {
        problemType: "Operadores desobedecen las hojas de ruta técnica en línea",
        coachingApproach: "Taller co-creativo de rediseño de SOPs con los propios operadores en vez de imponerlos de oficina",
        keyTool: "SOPs Visuales de Alto Impacto con código de colores"
      },
      {
        problemType: "Desviaciones reiteradas por herramental descalibrado",
        coachingApproach: "Sensibilización preventiva sobre el costo de no-calidad",
        keyTool: "Formatos de liberación pre-operativa autogestionables"
      }
    ],
    acompanamiento: [
      "Mapear la cadena de valor actual de punta a punta, detectando muda (desperdicio) en piso de planta.",
      "Capacitar al personal técnico en el cálculo del rendimiento de primera pasada (FTY) y nivel de Sigma real.",
      "Facilitar la documentación visual de instrucciones técnica (SOPs) interactivas al pie de máquina.",
      "Integrar el panel ágil de control visual para monitoreo permanente de KPIs de proceso SGI."
    ],
    visualDiag2Name: "Mapa de Calor de Cuellos de Botella (Flujo Operativo)",
    visualDiag2Mermaid: `graph LR
    I[Ingeniería - OK 🟢] --> C[Compras- OK 🟢]
    C -->|Acumulación de Lotes| O[Operaciones - SATURADO 🔴]
    O --> QC[Inspección QC - ESPERA 🟡]
    QC --> ME[Mejora - OK 🟢]
    style O fill:#DC2626,color:#fff
    style QC fill:#D97706,color:#fff`,
    visualDiag2ASCII: `  [Ingeniería] ───────► [Compras] ───────► (OPERACIONES) ───────► [Inspección QC]
     FTY: 98%            FTY: 96%           FTY: 60%            FTY: 99%
     (Paso Ágil 🟢)     (Paso Ágil 🟢)      (CUELLO REPRO 🔴)   (En Espera 🟡)`,
    coherenceText: "El Mapeo de Procesos (Módulo 3) define la fábrica de valor real. Provee la base para identificar fallas críticas procesadas en el Análisis Crítico 8D (Módulo 4), define el origen de los KPIs analizados en la Reunión de Dirección (Módulo 5) y alimenta el análisis cuantitativo de la Matriz de Riesgo y FMEA (Módulo 6). Por tanto, es el corazón técnico del SGI.",
    coherenceASCII: `[MÓDULO 3: Mapeo de Procesos]
       │
       ├─► [MÓDULO 4: Análisis Crítico] ── (Detecta y mapea fallas repetitivas)
       ├─► [MÓDULO 5: Rev. Dirección] ───── (Exporta métricas de efectividad FTY)
       └─► [MÓDULO 6: Matriz FMEA] ──────── (Establece causas y modos de falla)`,
    connections: [
      { btnId: "auditorias", btnName: "Análisis Crítico", description: "Provee los flujos de desviación sobre los cuales se aplicarán metodologías 8D ante quiebres de calidad." },
      { btnId: "direccion", btnName: "Análisis de Gestión", description: "Suministra las tasas FTY y Sigma corporativos recopilados para el balance scorecard de la dirección general." },
      { btnId: "problemas", btnName: "Análisis de Riesgo & COQ", description: "Define los pasos exactos donde se implementarán los análisis de riesgo por probabilidad e impacto." }
    ]
  },
  {
    id: "auditorias",
    num: 4,
    name: "Análisis Crítico (8D & Audits)",
    badge: "8D & Audits",
    normResourceDesc: "Consola de análisis de fallas relacionales, evaluado bajo la Cláusula 10.2 (No conformidad y acción correctiva) e ISO 19011.",
    consoleASCII: `========================================================================
 CONSOLA DE AUDITORÍA CRÍTICA & HALLAZGOS DE INSPECCIÓN (ISO 19011)
========================================================================
 [SISTEMA DE CALIDAD: BAJO AUDITORÍA] | [SECTOR: TECH] SGI v4.4
------------------------------------------------------------------------
 RESUMEN DE HALLAZGOS SGI:
  • NO CONFORMIDAD MAYOR (MAJ) : 1 Detectada  [BLOQUEANTE 🔴]
  • NO CONFORMIDAD MENOR (MIN) : 3 Detectadas [EN MITIGACIÓN 🟡]
  • OPORTUNIDADES MEJORA (OPM)  : 4 Reportadas [CULTIVADAS 🟢]
------------------------------------------------------------------------
 DETALLE DEL HALLAZGO CRÍTICO SELECCIONADO:
  - Cláusula: ISO 9001 8.5.1 (Control de la Producción y Provisión Servicio)
  - Hallazgo: Falta de firmas de calibración en la bitácora de mantenimiento.
========================================================================`,
    visualDiag1Name: "Diagrama de Ishikawa (Causa-Efecto 6M)",
    visualDiag1Mermaid: `graph LR
    subgraph Ishikawa [Diagrama Espina de Pescado]
        ManoObra([Mano de Obra]) --> EspinaLong[Falla de Calibración / Desviación de Medidas]
        Maquinaria([Mantenimiento]) --> EspinaLong
        Metodo([Métodos SOP]) --> EspinaLong
        Medic((EFECTO: Producto Defectuoso))
        EspinaLong --> Medic
    end
    style Medic fill:#DC2626,stroke:#fff,color:#fff`,
    visualDiag1ASCII: `                   DIAGRAMA DE ISHIKAWA (6M) SGI
  Mano de Obra       Maquinaria        Método
       │                 │                │
 ──────┼─────────────────┼────────────────┼────────────► ( EFECTO / FALLA )
       │                 │                │             Bitácora sin firma SGC
  Materiales        Medición         Medio Amb.`,
    diagnostico: [
      "Práctica reactiva ineficaz: Las no conformidades de auditoría interna se mitigan cerrándose formalmente con acciones superficiales para calmar al auditor técnico, dejando la causa raíz intacta.",
      "La incomprensión relacional causa-efecto genera reprocesos en cascada por no categorizar el problema de fondo bajo las 6M correspondientes.",
      "Falta de cultura asertiva en el análisis de hallazgos, induciendo a que las personas culpen al azar o a la suerte antes de responsabilizarse estructuralmente de las fallas."
    ],
    coachLook: "El Coach asume la no conformidad como un tesoro operativo organizacional. No se busca culpable, se busca la vulnerabilidad sistémica que propició el error humano. La sesión de coaching transforma el análisis del error en un aula de aprendizaje sistémico, utilizando el 8D como protocolo de asimilación y blindaje del SGI.",
    matrixIntervention: [
      {
        problemType: "Cierre apurado e ineficaz de Planes de Acción Preventivos",
        coachingApproach: "Indagación reflexiva sobre las soluciones del pasado y modelado de causa profunda",
        keyTool: "Técnica de los 5 Porqués estructurados y validados por el equipo"
      },
      {
        problemType: "Rotación constante de personal por estrés ante auditorías",
        coachingApproach: "Re-encuadre de la auditoría transformándola en un acto de apoyo terapéutico y de soporte mutuo",
        keyTool: "Acuerdo de Cero Represalias de Calidad en Planta"
      }
    ],
    acompanamiento: [
      "Modelar sesiones de análisis de fallas utilizando el enfoque de Ishikawa 6M.",
      "Facilitar la conformación de grupos interdisciplinarios autogestionados de contingencia rápida.",
      "Guiar de forma asertiva el desarrollo del árbol de causas raíz para no detenerse en el operador de primera línea.",
      "Estandarizar el registro interactivo de acciones correctivas (CAPA) articulado con Firestore organizacional."
    ],
    visualDiag2Name: "Árbol Dinámico de Causas Raíz (Los 5 Porqués)",
    visualDiag2Mermaid: `graph TD
    P1[Problema: Desviación de Tolerancia] --> Y1{1. ¿Por qué?}
    Y1 -->|Porque la máquina descalibró| Y2{2. ¿Por qué?}
    Y2 -->|Porque el sensor falló| Y3{3. ¿Por qué?}
    Y3 -->|Porque expiró vida útil| Y4{4. ¿Por qué?}
    Y4 -->|Porque no se alertó en bitácora| Y5{5. ¿Por qué - RAÍZ: Falta control SGC de preventivos}
    style Y5 fill:#DC2626,color:#fff`,
    visualDiag2ASCII: `  [ PROBLEMA: Fallas técnicas recurrentes en línea ]
         │
         ▼  (¿Por qué?)
  [ 2. Herramental Descalibrado ]
         │
         ▼  (¿Por qué?)
  [ 3. Sin mantenimiento preventivo a tiempo ]
         │
         ▼  (¿Por qué?)
  [ 4. Bitácora de SGI sin recordatorio digital ] ◄── Causa Raíz Sistémica`,
    coherenceText: "El Análisis Crítico (Módulo 4) actúa como el hospital del SGI. Al clasificar y mitigar los defectos, activa reformas en los dueños de proceso correspondientes (Estructuras, Módulo 2), actualiza de manera reactiva el Mapeo de Procesos (Módulo 3) y consolida la agenda crítica que debe presentarse como insumo obligatorio en la Revisión de la Dirección (Módulo 5).",
    coherenceASCII: `[MÓDULO 4: Análisis Crítico]
       │
       ├─► [MÓDULO 2: Organizacional] ── (Asigna responsabilidades correctivas)
       ├─► [MÓDULO 3: Mapeo de Procesos] ── (Reajusta SOPs y controles preventivos)
       └─► [MÓDULO 5: Rev. Dirección] ───── (Suministra matriz de hallazgos críticos)`,
    connections: [
      { btnId: "estructuras", btnName: "Estructuras de Empresas", description: "Informa los perfiles y autoridades competentes para asumir las acciones de contención derivadas del plan 8D." },
      { btnId: "mapeo", btnName: "Mapeo de Procesos", description: "Recibe las mejoras y correcciones mecánicas para actualizar de forma permanente las hojas de instrucciones en línea." },
      { btnId: "direccion", btnName: "Análisis de Gestión", description: "Compila el estado de las CAPAs vivas como punto del orden del día para la junta de Cláusula 9.3." }
    ]
  },
  {
    id: "direccion",
    num: 5,
    name: "Análisis de Gestión (Cl. 9.3)",
    badge: "Cl. 9.3",
    normResourceDesc: "Activo de gobernanza estratégica para la alta dirección corporativa, evaluado específicamente bajo la Cláusula 9.3 (Revisión por la dirección) de la norma ISO 9001:2015.",
    consoleASCII: `========================================================================
 PANEL DE CONTROL ESTRATÉGICO: CLÁUSULA 9.3 - REVISIÓN POR LA DIRECCIÓN
========================================================================
 [JUNTA EJECUTIVA: ACTIVA] | [FACILITADOR: ROBERT TERÁN] SGI v5.0
------------------------------------------------------------------------
 ENTRADAS A REVISAR (ESTADO EN TIEMPO REAL):
  • AUDITORÍAS RECIENTES : [ CAPA RECONSERVADO 🟢 ] | Hallazgos cerrados: 88%
  • ACCIONES CORRECTIVAS : [ PENDIENTES COLA 🟡  ] | Avance general   : 65%
  • RETROALIMENTACIÓN CL : [ NET PROMOTER 90% 🟢 ] | Nivel de quejas  : Bajo
------------------------------------------------------------------------
 ACTA DE SALIDA SGI:
  - Presupuesto Calidad   : Modificado [+15% Autorizado para Control de Cambios]
  - Firmantes Activos     : Robert Terán, Dirección General, SGC, Operations
========================================================================`,
    visualDiag1Name: "Flujo de Entradas y Salidas de la Revisión por la Dirección",
    visualDiag1Mermaid: `graph LR
    subgraph INSUMOS[Entradas Cls. 9.3.2]
        E1[Auditorías]
        E2[Satisfacción]
        E3[FMEA / CAPA]
    end
    INSUMOS --> REUNION((REUNIÓN DE DIRECCIÓN <br/> Decisiones SGI))
    REUNION --> SALIDAS[Salidas Cls. 9.3.3: <br/> Recursos, Cambios, Mejoras]
    style REUNION fill:#D97706,stroke:#fff,color:#fff
    style SALIDAS fill:#16A34A,stroke:#fff,color:#fff`,
    visualDiag1ASCII: `   ┌─────────────────────────┐
   │ ENTRADAS DIRECTIVAS     │ ──────►  ┌─────────────────────────┐  ──────►  ┌─────────────────────────┐
   │ - Resultados Auditoría  │          │    REUNIÓN EJECUTIVA    │           │    ACTA DE ACUERDOS     │
   │ - Desempeño Proveedores │          │ (Robert Terán / Gerente)│           │ - Asignación Recursos   │
   │ - Metas SGC / OKRs      │          └─────────────────────────┘           │ - Cambios en el SGI     │
   └─────────────────────────┘                                                └─────────────────────────┘`,
    diagnostico: [
      "El acta de revisión por la dirección se elabora mecánicamente quince minutos antes de la auditoría de certificación para fingir cumplimiento con el auditor externo.",
      "Nula asimilación de las desviaciones repetitivas por parte de los accionistas, asumiendo los costos de no calidad como 'gastos normales de producción'.",
      "Falta de establecimiento de planes de mejora dinámicos reales de soporte con plazos, presupuestos y responsables claros tras la minuta."
    ],
    coachLook: "El Coach concibe esta cláusula como el gran puente de confianza entre el piso de planta y los decisores de la oficina corporativa. La reunión no debe ser una letanía aburrida de datos muertose inacabables, sino un diálogo socrático reflexivo de alta dirección donde se transparente el estado real del SGC, se sanen tensiones interdepartamentales y se asigne capital asertivamente para proteger la calidad del negocio.",
    matrixIntervention: [
      {
        problemType: "La junta de dirección es considerada una pérdida de tiempo por los directores",
        coachingApproach: "Enfocar el reporte en el valor financiero en riesgo y reducción de pérdidas por CoNC",
        keyTool: "Matriz de Costo de No Calidad alineada al balance general"
      },
      {
        problemType: "Falta de seguimiento sistémico a los acuerdos de la dirección",
        coachingApproach: "Establecimiento de hitos autogestionados y rendición de cuentas sin culpabilidad",
        keyTool: "Kanban Ejecutivo SGI integrado con alertas digitales automatizadas"
      }
    ],
    acompanamiento: [
      "Estructurar los expedientes técnicos de entrada reuniendo auditorías, quejas y riesgos previos.",
      "Facilitar la mediación asertiva en la junta general de calidad con técnicas Gestalt de liderazgo.",
      "Dar rigor legal y de cumplimiento al acuerdo formal firmado de salida según exigencias ISO 9001.",
      "Monitorear la tracción real y efectividad de las mejoras preventivas aprobadas por el consejo corporativo."
    ],
    visualDiag2Name: "Dashboard de KPI Gerenciales y Matriz de Prioridades",
    visualDiag2Mermaid: `graph TD
    A[Objetivo SGI] --> B[Indicador: CoNC < 3%]
    A --> C[Indicador: FTY > 95%]
    B --> B1{Semáforo}
    B1 -->|Cuidado 🟡| B2[Ajustar Preventivo]
    C --> C1{Semáforo}
    C1 -->|Crítico 🔴| C2[CAPA Emergencia]
    style B2 fill:#D97706,color:#fff
    style C2 fill:#DC2626,color:#fff`,
    visualDiag2ASCII: `  ====================== TRADUCCIÓN GERENCIAL (MÓDULO 5) ======================
    [KPI: Eficiencia OEE]   └──►  [92%]   ──► 🟢 ESTABLE  (Recursos Idóneos)
    [KPI: Costo No Calidad] └──►  [7.2%]  ──► 🔴 CRÍTICO  (Requiere Mitigación)
    [KPI: Clima de Auditor] └──►  [85%]   ──► 🟢 EXCELENTE (Enfoque Coach Activo)`,
    coherenceText: "La Revisión por la Dirección (Módulo 5) es la cúspide de 'Planear' y 'Verificar'. Recoge los insumos documentales del Análisis Crítico (Módulo 4), el Mapeo de Procesos (Módulo 3) y la Pirámide de Costos PAF (Módulo 6). Sus actas de salida definen presupuestos estratégicos y recursos críticos de apoyo que impactan directamente el desarrollo de Competencia Humana (Módulo 9) y de Startups Ágiles (Módulo 8).",
    coherenceASCII: `[MÓDULO 5: Rev. Dirección]
       │
       ├─► [MÓDULO 4: Análisis Crítico] ── (Sana fallas expuestas en la junta)
       ├─► [MÓDULO 6: Matriz FMEA & PAF] ─ (Determina presupuestos de mitigación PAF)
       └─► [MÓDULO 9: Liderazgo IBM] ────── (Asigna OKRs estratégicos de capital humano)`,
    connections: [
      { btnId: "auditorias", btnName: "Análisis Crítico", description: "Proporciona las estadísticas detalladas de no-conformidades cerradas y pendientes de cara a la evaluación." },
      { btnId: "problemas", btnName: "Análisis de Riesgo & COQ", description: "Presenta el ratio financiero del Costo de No Calidad frente a inversiones de prevención de fallas." },
      { btnId: "liderazgo", btnName: "IBM 2025 Coach", description: "Monitorea el clima de piso y las competencias directivas reales que apalancan de forma humana el sistema de calidad." }
    ]
  },
  {
    id: "problemas",
    num: 6,
    name: "Análisis de Riesgo & COQ (FMEA Matrix)",
    badge: "FMEA Matrix",
    normResourceDesc: "Activo cuantitativo de predicción de fallas y costeo PAF (Prevención, Evaluación, Fallas), evaluado bajo Cláusula 6.1 (Acciones para abordar riesgos) e ISO 31000.",
    consoleASCII: `========================================================================
 CALCULADORA INTEGRAL DE COSTOS DE CALIDAD (PAF) & NIVEL DE AMENAZA
========================================================================
 [MODO: EVALUACIÓN ACTIVA] | [NORMATIVA DE RIESGOS: ISO 31000] SGI v4.4
------------------------------------------------------------------------
 DATOS FINANCIEROS PAF:
  • INGRESOS ANUALES     : $500,000 USD | COSTO TOTAL NO CALIDAD (CoNC): $70,000
  • PREVENCIÓN (Filtros) : $15,000  USD | EVALUACIÓN (Inspección)      : $20,000
  • FALLAS INTERNAS      : $45,000  USD | FALLAS EXTERNAS (Retornos)   : $25,000
------------------------------------------------------------------------
 ANÁLISIS ECONÓMICO SISTÉMICO:
  - Ratio de Calidad (CoQ)  : 21.0% de VENTAS totales [ALTO COSTO 🔴]
  - Retorno sobre Inversión : Inversión baja en prevención genera fugas crónicas.
========================================================================`,
    visualDiag1Name: "Matriz de Evaluación de Riesgos (Probabilidad vs Impacto)",
    visualDiag1Mermaid: `graph TD
    subgraph MATRIX [Matriz 3x3 de Matriz de Riesgo]
        R1[Alto / Crítico 🔴]
        R2[Medio / Medio 🟡]
        R3[Bajo / Tolerable 🟢]
    end
    style R1 fill:#DC2626,color:#fff
    style R2 fill:#D97706,color:#fff
    style R3 fill:#16A34A,color:#fff`,
    visualDiag1ASCII: `                   MATRIZ DE RIESGO ISO 31000 (3x3)
                 ALTO  [  Medio 🟡  |  Crítico 🔴 |  Planes CAPA 🔴 ]
  PROBABILIDAD   MEDIO [  Bajo 🟢   |  Medio 🟡   |  Crítico 🔴    ]
                 BAJO  [  Toler 🟢  |  Bajo 🟢    |  Medio 🟡      ]
                         BAJO          MEDIO         ALTO
                                    IMPACTO DE LA FALLA`,
    diagnostico: [
      "Inversión asimétrica y equivocada: Las empresas gastan el 80% del capital de calidad conteniendo fallas (internas y externas) cuando debieran invertirlo de forma asertiva en prevención en primera fase.",
      "El inventario de riesgos en el FMEA general se diseña de forma superficial repitiendo conceptos abstractos sin priorizar la tasa NPR (Número de Prioridad de Riesgo).",
      "Nula vinculación de la matriz preventiva de riesgo técnico de planta con la contabilidad de la junta general, invisibilizando el valor real en riesgo."
    ],
    coachLook: "El Coach asume que la matriz FMEA no es un formulario interminable para asustar ingenieros, sino que es el radar financiero definitivo del SGC. El coaching busca evidenciar que una sólida inversión asertiva en prevención y control preventivo reduce de forma geométrica el dinero derramado por desperdicios de producción y reclamos de clientes.",
    matrixIntervention: [
      {
        problemType: "Falta de presupuesto para herramientas preventivas SGI",
        coachingApproach: "Demostrar cuantitativamente que el despilfarro acumulado cubre 3 veces el herramental preventivo",
        keyTool: "Análisis e informe PAF de Retorno de la Calidad (ROQ)"
      },
      {
        problemType: "Resistencia teórica a documentar riesgos por flojera técnica",
        coachingApproach: "Simulación participativa de fallas mayores e impactos de estrés en los operadores de planta",
        keyTool: "Matriz FMEA simplificada en piso de planta con umbral de colores"
      }
    ],
    acompanamiento: [
      "Estructurar la contabilidad integral de costos de calidad categorizando gastos bajo el modelo PAF.",
      "Facilitar talleres para el levantamiento de fallas con el equipo de primera línea calculando el NPR real.",
      "Asesorar en el diseño de herramentales físicos anti-error (Poka-Yokes) para blindar la operación.",
      "Vincular las alertas críticas preventivas del FMEA con planes dinámicos interactivos integrados en Firestore."
    ],
    visualDiag2Name: "Pirámide Financiera del Costo de Calidad (PAF Model)",
    visualDiag2Mermaid: `graph TD
    P_Prev[1. Prevención - Inversión Saludable] --> E_Eval[2. Evaluación - Inspeccionar]
    E_Eval --> F_Int[3. Fallas Internas - Scrap]
    F_Int --> F_Ext[4. Fallas Externas - RECLAMOS CRÍTICOS 🔴]
    style F_Ext fill:#DC2626,color:#fff
    style P_Prev fill:#16A34A,color:#fff`,
    visualDiag2ASCII: `                     PIRÁMIDE DE COSTO DE CALIDAD (PAF)
                        /  Fallas   \\     <─── Reclamos, Multas, Devoluciones
                       /   Externas  \\         (El Costo Más Destructivo 🔴)
                      /───────────────\\
                     / Fallas Internas \\    <─── Desperdicios, Retrabajos en Planta
                    /───────────────────\\
                   /    Evaluación       \\   <─── Ensayos, Auditorías, Inspección QC
                  /───────────────────────\\
                 /     Prevención          \\  <─── Capacitación, Poka-Yokes SGC 🟢`,
    coherenceText: "El Análisis de Riesgos y PAF (Módulo 6) traduce el SGC a lenguaje financiero. Justifica económicamente los recursos solicitados en la Revisión Directiva (Módulo 5), cuantifica la rentabilidad técnica evaluada en el Módulo de Procesos (Módulo 3) y suministra el blindaje operativo que requiere un Emprendimiento Ágil (Módulo 8) para escalar de manera sustentable y segura.",
    coherenceASCII: `[MÓDULO 6: Riesgos & COQ PAF]
       │
       ├─► [MÓDULO 3: Mapeo de Procesos] ── (Determina los puntos débiles de FTY)
       ├─► [MÓDULO 5: Rev. Dirección] ───── (Presenta justificantes económicos de capital)
       └─► [MÓDULO 8: SGC Ágil / Startup] ─ (Garantiza escalamiento financiero blindado de fallas)`,
    connections: [
      { btnId: "mapeo", btnName: "Mapeo de Procesos", description: "Informa los KPIs de desempeño FTY para auditar cuantitativamente las desviaciones monetarias de cada compuerta." },
      { btnId: "direccion", btnName: "Análisis de Gestión", description: "Provee la argumentación final del costo CoNC para redefinir el presupuesto corporativo del próximo ejercicio." },
      { btnId: "dashboard", btnName: "Emprendimiento & Startup", description: "Asegura la integración de métricas Lean de tracción financiera sin abandonar el rigor preventivo de riesgos ISO." }
    ]
  },
  {
    id: "costos",
    num: 7,
    name: "Análisis de Mercado (FODA / SWOT)",
    badge: "FODA / SWOT",
    normResourceDesc: "Activo estratégico integral de contexto de negocio, validado bajo la Cláusula 4.1 (Comprensión de la organización y de su contexto) e ISO 9001.",
    consoleASCII: `========================================================================
 CONSOLA DE DIRECCIÓN ESTRATÉGICA: ANÁLISIS DE MERCADO & CONTEXTO GLOBAL
========================================================================
 [STATUS: FORMULADO] | [MODO: PLANIFICACIÓN] INTEGRADO v4.4
------------------------------------------------------------------------
 COMPONENTES DE CONTEXTO (FODA EN VIVO):
  • FORTALEZAS (F)       : [ Robert Terán Coach, Know-how, Firestore SGI ] 🟢
  • DEBILIDADES (D)      : [ Micro-management sistémico, manuales desfasados ] 🔴
  • OPORTUNIDADES (O)    : [ Mercado Ágil, Automatización industrial Power BI ] 🟢
  • AMENAZAS (A)         : [ Rotación técnica acelerada, aduanas saturadas ] 🔴
------------------------------------------------------------------------
 DIAGNÓSTICO PESTEL:
  - Foco Regulatorio     : Cumplimiento de matrices legales actualizadas.
  - Mitigación Crítica   : Desplegar modelo ágil para neutralizar amenazas.
========================================================================`,
    visualDiag1Name: "Matriz FODA de Planeación Estratégica",
    visualDiag1Mermaid: `graph TD
    classDef swotStyle fill:#1E293B,stroke:#fff,color:#fff;
    subgraph FODA [Matriz FODA de Contexto]
        F[Fortalezas 🟢 <br/> Liderazgo SGI]
        D[Debilidades 🔴 <br/> Burocracia]
        O[Oportunidades 🟢 <br/> Power BI]
        A[Amenazas 🔴 <br/> Retrasos]
    end
    style F fill:#16A34A,color:#fff
    style D fill:#DC2626,color:#fff
    style O fill:#0284C7,color:#fff
    style A fill:#D97706,color:#fff`,
    visualDiag1ASCII: `                       MATRIZ FODA CONTEXTO ORGANIZACIONAL
       FACTORES INTERNOS               │        FACTORES EXTERNOS
  [ FORTALEZAS 🟢 ]                    │  [ OPORTUNIDADES 🟢 ]
  - Robert Terán Coach asertivo hito   │  - Automatización Industrial TI
  - Tasa de Retención del 98% de proy │  - Mercado de Alta Demanda Ágil
  ─────────────────────────────────────┼─────────────────────────────────────
  [ DEBILIDADES 🔴 ]                   │  [ AMENAZAS 🔴 ]
  - Silos internos en soporte técnico  │  - Rotación veloz de operarios
  - Manuales sin interactividad SGC   │  - Sanciones regulatorias sorpresivas`,
    diagnostico: [
      "El FODA estratégico se copia textualmente de internet y se archiva en una carpeta rígida únicamente para aprobar la Cláusula 4.1 ante el auditor de certificación.",
      "Análisis PESTEL ausente o desvinculado de los planes tácticos del SGC, impidiendo que la empresa reaccione ágilmente frente a volatilidad macroeconómica o fiscal.",
      "Desviación en la formulación de estrategias cruzadas FO-DA: Identificar debilidades del negocio sin instrumentar acciones correctivas asertivas que las solventen."
    ],
    coachLook: "El Coach asume la formulación de debilidades y amenazas no como fallas de carácter organizacional, sino como un mapa asertivo para el crecimiento resiliente. La planificación estratégica debe ser respirada semanalmente en piso, traduciendo cada cuadrante del FODA en objetivos anuales claros (OKRs) y en controles vivos eficaces que blinden la sostenibilidad de la compañía.",
    matrixIntervention: [
      {
        problemType: "FODA obsoleto arrastrado por años sin actualización estratégica",
        coachingApproach: "Análisis socrático participativo de las variables cambiantes de mercado real actual",
        keyTool: "Matriz FODA interactiva digital automatizada en equipo"
      },
      {
        problemType: "Inacción directiva frente a amenazas macroeconómicas identificadas",
        coachingApproach: "Establecimiento de planes de resistencia basados en escenarios ágiles de resiliencia",
        keyTool: "Plan de Contingencia de Continuidad de Negocio ISO 22301"
      }
    ],
    acompanamiento: [
      "Facilitar sesiones participativas grupales de diagnóstico PESTEL recopilando insumos reales.",
      "Co-crear de forma asertiva la matriz de planeación FODA con el comité directivo y Robert Terán.",
      "Traducir las fortalezas en salvaguardas y las debilidades en proyectos urgentes con planes CAPA.",
      "Conectar el contexto operativo SGI con las responsabilidades del equipo de piso para su tracción."
    ],
    visualDiag2Name: "Diagrama PESTEL de Factores de Entorno Macro",
    visualDiag2Mermaid: `graph LR
    P[Político] --> E[SGC Global]
    Ec[Económico] --> E
    S[Social] --> E
    T[Tecnológico] --> E
    Eco[Ecológico] --> E
    L[Legal] --> E
    style E fill:#4F46E5,color:#fff`,
    visualDiag2ASCII: `                       DIAGRAMA MACRO ENTORNO PESTEL
  (Político: Estabilidad) ────┐
  (Económico: Inflación)  ────┼─►  ┌─────────────────────────┐  ◄─── (Tecnológico: IA, Nube)
  (Social: Cambios Demo)  ────┤    │     CONTESTO VIVO SGI   │  ◄─── (Ecológico: Huella Carbono)
  (Legal: Normas ISO)     ────┘    │  (Cláusula 4.1 Org SGC) │
                                   └─────────────────────────┘`,
    coherenceText: "El Análisis de Contexto FODA/PESTEL (Módulo 7) es el telescopio estratégico. Suministra los objetivos macro, prioridades de mercado y normativas legales que delimitan el alcance del SGC (Módulo 1) y define la dirección de los OKRs directivos de la Revisión por la Dirección (Módulo 5). A la vez, delimita las pautas de valor de marca que debe consolidar el Emprendimiento Ágil (Módulo 8).",
    coherenceASCII: `[MÓDULO 7: Mercado FODA]
       │
       ├─► [MÓDULO 1: SGC 9001] ──────── (Establece el alcance y política del manual SGI)
       ├─► [MÓDULO 5: Rev. Dirección] ───── (Proporciona objetivos estratégicos a revisar)
       └─► [MÓDULO 8: SGC Ágil / Startup] ─ (Define la propuesta comercial de valor Lean)`,
    connections: [
      { btnId: "gestionycalidad", btnName: "ISO Gestión de Calidad", description: "Proporciona las variables externas e internas necesarias para calibrar el alcance general dictado en la Cláusula 4.3." },
      { btnId: "direccion", btnName: "Análisis de Gestión", description: "Inyecta las actualizaciones de riesgo externo legal y tecnológico como directrices para el rediseño de inversiones anuales." },
      { btnId: "dashboard", btnName: "Emprendimiento & Startup", description: "Vincula los bloques del Lean Canvas de tracción con las fortalezas declaradas por el comité ejecutivo de Robert Terán." }
    ]
  },
  {
    id: "dashboard",
    num: 8,
    name: "Emprendimiento & Startup (SGC Ágil)",
    badge: "SGC Ágil",
    normResourceDesc: "Guía metodológica para escalabilidad y pivots de alto impacto mercantil, diseñado bajo metodologías Lean Startup y Cláusula 8.1.",
    consoleASCII: `========================================================================
 CONSOLA INTEGRADA DE TRACCIÓN AGIL: LEAN STARTUP & LEAN CANVAS BOARD
========================================================================
 [STATUS: VALIDACIÓN DE TRACCIÓN] | [CÉLULA SCURM: TRABAJANDO] SGI v8.0
------------------------------------------------------------------------
 MÉTRICAS STARTUP:
  • COSTO ADQUISICIÓN    : $45 USD / Cl.     | VALOR DE VIDA (LTV) : $450 USD
  • TASA DE ABANDONO     : 2.1% (Churn Rate) | Tracción Operativa  : EXCELENTE 🟢
  • BLOQUES LEAN CANVAS  : [ 9/9 Bloques OK ] | Nivel de Peticiones: ESTABLE 🟢
------------------------------------------------------------------------
 CAMINO DE VALIDACIÓN:
  - Fase Actual          : Lanzar MVP para feedback temprano del cliente final.
  - Dirección            : Iterar producto basándose en el FTY de inspección.
========================================================================`,
    visualDiag1Name: "Lienzo Lean Canvas de 9 Bloques Interactivos",
    visualDiag1Mermaid: `graph TD
    subgraph LeanCanvas [Lienzo de Negocio Lean]
        P[1. Problema] --- S[2. Solución]
        S --- VM[3. Métricas Clave]
        P --- VP[4. Propuesta de Valor]
        S --- VC[5. Ventaja Distintiva]
        VM --- CA[6. Canales]
        VP --- SC[7. Segmento de Clientes]
        CA --- SC
        E_Cost[8. Estructura de Costos ] --- F_Ing[9. Fuentes de Ingresos]
    end
    style VP fill:#4F46E5,color:#fff
    style SC fill:#16A34A,color:#fff`,
    visualDiag1ASCII: `┌──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│  PROBLEMA            │  SOLUCIÓN            │  PROPUESTA DE VALOR  │  VENTAJA             │  SEGMENTO DE         │
│  - Falta automatizar │  - Dashboard Ágil    │  - Auditoría Coach   │  - Robert Terán Coach│  CLIENTES            │
├──────────────────────┼──────────────────────┤  - Cero Culpa SGC    ├──────────────────────┼──────────────────────┤
│  MÉTRICAS CLAVE      │                      │                      │  CANALES             │  - PYMES en busca    │
│  - FTY, NPS, Sigma   │                      │                      │  - Web, LinkedIn     │    de Certificación  │
├──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┤
│  ESTRUCTURA DE COSTOS                               │  FLUJO DE INGRESOS                                         │
│  - Desarrollo Ágil, Hosting Cloud                   │  - Licencias SaaS, Consultorías SGI                        │
└─────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────┘`,
    diagnostico: [
      "Parálisis por planificación: Startups obsesionadas con redactar un plan de negocios de 200 páginas antes de interactuar en piso o lanzar un MVP funcional al mercado.",
      "Lanzamiento ciego de productos técnicos sin calibrar el Churn Rate o el Costo de Adquisición de Cliente (CAC) del embudo de ventas real.",
      "Resistencia a pivotar el modelo de negocio por sesgo cognitivo, gastando el presupuesto total en ideas comerciales que el cliente de mercado rechaza reiteradamente."
    ],
    coachLook: "El Coach asume la metodología ágil Lean Startup como el herramental preventivo de tracción por excelencia de una organización moderna. El coaching destraba el miedo a equivocarse, instruyendo en que el error es una señal informativa rápida del mercado. Un ciclo de feedback ágil 'Construir-Medir-Aprender' acelerado consolida la madurez de la Startup antes de burocratizar procesos.",
    matrixIntervention: [
      {
        problemType: "Células organizativas desmotivadas por rigidez burocrática del SGC",
        coachingApproach: "Transformación a células Scrum autónomas con OKRs de tracción audaces",
        keyTool: "Marcos ágiles Kanban flexibles sintonizados con ISO 9001"
      },
      {
        problemType: "Falta de tracción comercial por no entender la necesidad real del cliente",
        coachingApproach: "Indagación reflexiva directa de piso y entrevistas activas de empatía con la cuenta piloto",
        keyTool: "Entrevistas estructuradas de validación y test de usabilidad MVP"
      }
    ],
    acompanamiento: [
      "Facilitar la estructuración veloz del Lean Canvas cruzando variables de operaciones y mercadotecnia.",
      "Coordinar el lanzamiento ágil de un Mínimo Producto Viable (MVP) para corroborar hipótesis técnicas.",
      "Asesorar en el cálculo continuo del costo de adquisición de cliente y LTV para blindaje financiero.",
      "Sincronizar las métricas KPI de tracción Lean con los reportes sistémicos del SGC en Firestore."
    ],
    visualDiag2Name: "Ciclo Lean Startup: Construir, Medir y Aprender",
    visualDiag2Mermaid: `graph TD
    C[1. Construir MVP] --> M[2. Medir Feedback / KPI]
    M --> A[3. Aprender Pivot vs Persistir]
    A --> C
    style C fill:#4F46E5,color:#fff
    style M fill:#D97706,color:#fff
    style A fill:#16A34A,color:#fff`,
    visualDiag2ASCII: `                     CICLO LEAN STARTUP - SGC ÁGIL SGI
                                  [ CONSPIRAR / CONSTRUIR ]
                                   (Dar forma al prototipo MVP)
                                               │
                                               ▼
         [ APRENDER / PIVOTAR ] ◄──────────────┼──────────────► [ MEDIR / CAPTURAR ]
        (Reajustar propuesta de valor SGC)             (Recopilar FTY de usabilidad)`,
    coherenceText: "El Módulo de Startups Ágiles (Módulo 8) es el motor de experimentación del SGI. Alimentado por el Mapeo de Procesos (Módulo 3) para operaciones ágiles y por el Análisis de Riesgos (Módulo 6) para evitar fallas catastróficas, genera los formatos asertivos que consolidan las bases del Liderazgo Moderno Coach de Robert Terán (Módulo 9).",
    coherenceASCII: `[MÓDULO 8: Emprendimiento Ágil]
       │
       ├─► [MÓDULO 3: Mapeo de Procesos] ── (Reduce la burocracia de SOPs a MVP rápido)
       ├─► [MÓDULO 6: Riesgos & COQ PAF] ─ (Mitiga el riesgo financiero de experimentación)
       └─► [MÓDULO 9: Liderazgo IBM] ────── (Alinea al equipo ágil con psicología de resiliencia)`,
    connections: [
      { btnId: "mapeo", btnName: "Mapeo de Procesos", description: "Adapta la rigidez de los niveles documentales N0-N2 a flujos interactivos de experimentación ágil." },
      { btnId: "problemas", btnName: "Análisis de Riesgo & COQ", description: "Compara el costo económico derivado de la experimentación frente al ahorro sustancial de cometer errores controlados de preventivo." },
      { btnId: "liderazgo", btnName: "IBM 2025 Coach", description: "Fomenta la destreza emocional requerida en equipos autónomos autogestionados de alta velocidad Scrum." }
    ]
  },
  {
    id: "liderazgo",
    num: 9,
    name: "IBM 2025 Coach (Liderazgo & Clima)",
    badge: "Liderazgo",
    normResourceDesc: "Activo de psicología laboral y resiliencia de equipos SGC, formulado según los preceptos de dirección empática y coaching transformacional Gestalt.",
    consoleASCII: `========================================================================
 CONSOLA DE AUDITORÍA DE LIDERAZGO EMPÁTICO & CLIMA LABORAL (IBM COACH)
========================================================================
 [FACILITADOR: ROBERT TERÁN] | [UMBRAL EMOCIONAL: SALUDABLE] SGI v5.0
------------------------------------------------------------------------
 MÉTRICAS PSI-ORGANIZACIONALES:
  • COPING INDEX (Estrés)  : [██████████████░░░] 85% | Nivel de sobrecarga: Bajo 🟢
  • COMUNICACIÓN DIRECTA   : [████████████░░░░░] 78% | Estado: ESTABLE 🟢
  • OKRs EMOCIONALES SIGN  : [ 3/3 Firmes    ] 100% | Custodiado en Firestore 🟢
------------------------------------------------------------------------
 SIMULADOR DE CONFLICTOS SGC:
  - Paso Actual            : Simulación resuelta con éxito (Enfoque Gestalt).
  - Efecto en el Clima     : Incremento sustancial del compromiso SGC (+15%).
========================================================================`,
    visualDiag1Name: "El Bucle Viviente 'The Loop' de IBM",
    visualDiag1Mermaid: `graph TD
    Obs[1. Observar Empáticamente] --> Ref[2. Reflexionar Colectivamente]
    Ref --> Fac[3. Hacer / Facilitar]
    Fac --> Iter[4. Iterar Acuerdos SGC]
    Iter --> Obs
    style Obs fill:#2563EB,color:#fff
    style Ref fill:#7C3AED,color:#fff
    style Fac fill:#16A34A,color:#fff
    style Iter fill:#DC2626,color:#fff`,
    visualDiag1ASCII: `                        BUCLE 'THE LOOP' - LIDERAZGO IBM 2025
                                    [ 1. OBSERVAR ]
                             (Sondear barreras invisibles reales)
                                           │
                                           ▼
         [ 4. ITERAR ACTAS ] ◄─────────────┼─────────────► [ 2. REFLEXIONAR ]
        (Reajustar el clima del SGC)                (Mesas de empatía activa)
                                           ▲
                                           │
                                    [ 3. HACER / ACCION ]
                              (Efectuar cambios en piso)`,
    diagnostico: [
      "El liderazgo tradicional ejerce coerción de calidad en planta, induciendo una cultura basada en el miedo y en la ocultación sistemática de no conformidades técnicas por temor a reprimendas laborales.",
      "Ignorar las dinámicas de estrés del operario, asumiendo que los fallas mecánicas ocurren por holgazanería técnica antes que por fatiga o mala ergonomía del proceso.",
      "Falta de comunicación asertiva interdepartamental, manteniendo al comité corporativo desconectado de las fricciones reales del personal de piso."
    ],
    coachLook: "El Coach concibe el liderazgo preventivo como la savia que da vida al SGC. Un líder Coach no asusta a los operadores con la norma ISO en la mano; genera un contexto de confianza y comunicación asertiva Gestalt donde auditarse es un acto de crecimiento y soporte mutuo, eliminando silos informativos y empoderando al operario.",
    matrixIntervention: [
      {
        problemType: "El personal de planta teme el periodo de auditorías",
        coachingApproach: "Encuadre integrador: 'El auditor audita procesos, no personas'. Talleres de simulación asertiva",
        keyTool: "Acuerdos preventivos firmados de cero represalias por fallas"
      },
      {
        problemType: "Rivalidad arraigada entre Jefes de Producción y el área de SGI",
        coachingApproach: "Sesión de coaching grupal de reconciliación integradora de metas corporativas",
        keyTool: "Acuerdo de Comunión sobre el costo real de No Calidad"
      }
    ],
    acompanamiento: [
      "Diagnosticar periódicamente el clima humano operativo vinculándolo con los desvíos técnicos.",
      "Facilitar círculos creativos mensuales de conciliación emocional y técnica en planta.",
      "Concientizar a los directores ejecutivos en metodologías ágiles de comunicación empática.",
      "Custodiar digitalmente en el panel interactivo los hitos y compromisos directivos."
    ],
    visualDiag2Name: "Estructura de OKRs con Tracción Sistémica",
    visualDiag2Mermaid: `graph TD
    O[OBJETIVO GENERAL: Operar con Cero Miedo y Altas Tasas FTY] --> K1[KR1: Firmar pactos cero-culpa SGI]
    O --> K2[KR2: Elevar clima de auditoría a > 85%]
    O --> K3[KR3: Lograr auditoría interna con cero desviaciones mayores]
    style O fill:#4F46E5,color:#fff
    style K1 fill:#16A34A,color:#fff
    style K2 fill:#16A34A,color:#fff
    style K3 fill:#16A34A,color:#fff`,
    visualDiag2ASCII: `  ================= OKRs LIDERAZGO INTEGRADO (MÓDULO 9) =================
    [OBJETIVO] Instaurar un SGC sustentable basado en el Bienestar Emocional.
     ├── KR 1 : Firmar el 100% de los Acuerdos Humanos directivos en Firestore 🟢
     ├── KR 2 : Lograr un índice de clima del simulador > 80% en planta 🟢
     └── KR 3 : Cero quejas de maltrato directivo durante procesos de control 🟢`,
    coherenceText: "El Liderazgo Coach IBM 2025 (Módulo 9) es el motor que da cohesión e inteligencia emocional a todo el SGI. Sin personas motivadas y seguras emocionalmente, los objetivos estratégicos de la Revisión por la Dirección (Módulo 5) fracasan, la estandarización del Mapeo de Procesos (Módulo 3) se abandona y la rigurosidad frente al Análisis de Riesgos FMEA (Módulo 6) se desvanece.",
    coherenceASCII: `[MÓDULO 9: IBM Coach Liderazgo]
       │
       ├─► [MÓDULO 3: Mapeo de Procesos] ── (Estandarización adoptada con agrado operativo)
       ├─► [MÓDULO 5: Rev. Dirección] ───── (Inyecta la dimensión de cultura de piso en actas)
       └─► [MÓDULO 10: Auditor Leader] ──── (Consolida la empatía técnica durante inspecciones real)`,
    connections: [
      { btnId: "mapeo", btnName: "Mapeo de Procesos", description: "Convierte las instrucciones N2 en acciones voluntarias asimiladas mediante capacitación Gestalt participativa." },
      { btnId: "direccion", btnName: "Análisis de Gestión", description: "Enriquece el acta final de la junta agregando metas tangibles relacionales de salud de cultura laboral." },
      { btnId: "auditor_leader", btnName: "Auditor Leader (ISO 19011)", description: "Proporciona las directrices de mediación pacífica y psicología asertiva para la ejecución de auditorías vivas." }
    ]
  },
  {
    id: "auditor_leader",
    num: 10,
    name: "Auditor Leader (ISO 19011 / Directrices)",
    badge: "ISO 19011",
    normResourceDesc: "Activo de protocolo técnico legal bajo directrices de la norma internacional ISO 19011:2018 para la gestión y ejecución de auditorías de calidad vivas de alto impacto.",
    consoleASCII: `========================================================================
 CONSOLA DE PLANIFICACIÓN & EJECUCIÓN DE AUDITORÍAS (ISO 19011)
========================================================================
 [FASE OPERATIVA: PLANIFICADA] | [AUDITOR LÍDER: ROBERT TERÁN] SGI v4.4
------------------------------------------------------------------------
 HITOS DEL PROTOCOLO DE AUDITORÍA:
  • PLAN GLOBLAL CORTADO : [████████████████░░] 88% | Cumplimiento: AUDIT-READY 🟢
  • REVISIÓN DOCUMENTAL : [ COMPLETADA 🟢    ] | Hallazgos Preliminares: 2
  • APERTURA PROGRAMADA  : [ 2026-06-25 ]       | Estado de Agenda: CONFIRMADA 🟢
------------------------------------------------------------------------
 EXPEDIENTE DE AUDITORÍA ACTIVO:
  - Norma Relacionada    : ISO 9001:2015, ISO 14001, ISO 45001
  - Criterio de Auditoria: Controles de diseño de Ingeniería & Cadena compras
========================================================================`,
    visualDiag1Name: "El Ciclo Sistemático de Auditoría según ISO 19011",
    visualDiag1Mermaid: `graph TD
    A_Plan[1. PLANIFICACIÓN <br/> Programa & Agenda] --> B_Doc[2. REVISIÓN DOC <br/> Listas de Verificación]
    B_Doc --> C_Field[3. TRABAJO DE CAMPO <br/> Entrevistas & Muestreo]
    C_Field --> D_Report[4. COMUNICACIÓN INFORME <br/> Registro de Desviaciones]
    D_Report --> E_Follow[5. SEGUIMIENTO CAPA <br/> Verificación de Eficacia]
    E_Follow --> A_Plan
    style A_Plan fill:#2563EB,color:#fff
    style B_Doc fill:#7C3AED,color:#fff
    style C_Field fill:#D97706,color:#fff
    style D_Report fill:#DC2626,color:#fff
    style E_Follow fill:#16A34A,color:#fff`,
    visualDiag1ASCII: `                        CICLO DE AUDITORÍA INTEGRAL SGI
                                  [ 1. PLANIFICACIÓN ]
                            (Cronograma de Agenda y Alcance)
                                           │
                                           ▼
         [ 5. SEGUIMIENTO CAPA ] ◄─────────┼─────────► [ 2. REVISIÓN DOCUMENTAL ]
       (Verificar cierre de causas raíz)              (Checklist de Cláusulas ISO)
                                           ▲
                                           │
                                  [ 4. INFORME OFICIAL ]
                            (Hallazgos, NC Menores y Mayores)
                                           ▲
                                           │
                                 [ 3. TRABAJO EN CAMPO ]
                           (Cláusulas en vivo en andén y planta)`,
    diagnostico: [
      "Las auditorías se diseñan y ejecutan como un proceso policíaco hostil enfocado en 'atrapar al infractor' en vez de verificar preventivamente la robustez del sistema SGC.",
      "Listas de verificación genéricas compradas de internet que no abordan la realidad técnica del sector ni mitigan la probabilidad de incidentes críticos.",
      "Seguimiento ineficaz de hallazgos previos: No conformidades que se acumulan auditoría tras auditoría sin que exista un cierre validado asertivamente."
    ],
    coachLook: "El Coach redefine la auditoría técnica como un acto de acompañamiento y facilitación de la excelencia de la empresa. No buscamos sancionar el quiebre humano; buscamos transparentar de forma empática los desafíos reales del operador para blindar los procesos mediante soluciones sistémicas (Poka-Yoke, digitalización), certificando con orgullo el esfuerzo del equipo.",
    matrixIntervention: [
      {
        problemType: "Resistencia emocional de los líderes de planta durante la entrevistas",
        coachingApproach: "Encuadre inicial empático, preguntas abiertas socráticas que dignifiquen su labor técnica",
        keyTool: "Técnica de Auditoría Basada en Diálogo de Aprendizaje Activo"
      },
      {
        problemType: "Redacción deficiente de hallazgos dificultando los planes de acción",
        coachingApproach: "Capacitación práctica en redacción rigurosa técnica basada en hechos y evidencias",
        keyTool: "Método de Hallazgos SGI estructurados (Hecho + Evidencia + Criterio)"
      }
    ],
    acompanamiento: [
      "Definir el programa de auditoría interna alineado al nivel de criticidad real de las áreas.",
      "Diseñar listas de verificación dinámicas interactuando directamente en las bitácoras.",
      "Liderar las reuniones ejecutivas formales de apertura y cierre con lenguaje asertivo y preventivo.",
      "Acompañar y asesorar al personal técnico en el diseño de planes de remediación CAPA eficaces."
    ],
    visualDiag2Name: "Matriz Taxonómica de Hallazgos de Auditoría SGC",
    visualDiag2Mermaid: `graph LR
    classDef main fill:#1E293B,stroke:#fff,color:#fff;
    subgraph Hallazgos[Taxonomía de Desviaciones]
        NC_MAJ[No Conformidad Mayor 🔴 <br/> Quiebre total de Cláusula de control]
        NC_MIN[No Conformidad Menor 🟡 <br/> Desviación aislada del SOP técnico]
        OPM[Oportunidad de Mejora 🟢 <br/> Recomendación de optimización manual]
        FOR[Fortaleza ⭐ <br/> Logro destacado de excelencia operacional]
    end
    style NC_MAJ fill:#DC2626,color:#fff
    style NC_MIN fill:#D97706,color:#fff
    style OPM fill:#16A34A,color:#fff
    style FOR fill:#EAB308,color:#333`,
    visualDiag2ASCII: `  ================= CLASIFICACIÓN DE HALLAZGOS SGI =================
   ┌───────────────────────────────────┬───────────────────────────────────┐
   │ 🔴 NO CONFORMIDAD MAYOR           │ 🟡 NO CONFORMIDAD MENOR           │
   │ Ausencia sistemática de elemento- │ Falla aislada en una bitácora o   │
   │ Cláusula. Clientes en peligro.    │ desviación casual en un instructiv│
   ├───────────────────────────────────┼───────────────────────────────────┤
   │ 🟢 OPORTUNIDAD DE MEJORA          │ ⭐ FORTALEZA                      │
   │ Recomendación técnica para elevar │ Práctica ejemplar observada que  │
   │ el rendimiento y automatizar.     │ aporta alto valor al SGC.         │
   └───────────────────────────────────┴───────────────────────────────────┘`,
    coherenceText: "Auditor Leader (Módulo 10) es el auditor definitivo de control. Revisa y evalúa la madurez integrada del SGC (Módulo 1) y los flujos en piso (Módulo 3); nutre con reportes técnicos formales la Revisión por la Dirección (Módulo 5); y consolida el ciclo de aprendizaje que alimenta la asimilación del Liderazgo Coach (Módulo 9) y el análisis de No Conformidades (Módulo 4).",
    coherenceASCII: `[MÓDULO 10: Auditor Leader]
       │
       ├─► [MÓDULO 1: SGC 9001] ──────── (Verifica el cumplimiento de todas las Cláusulas)
       ├─► [MÓDULO 4: Análisis Crítico] ── (Suministra hallazgos directos para plan 8D)
       └─► [MÓDULO 5: Rev. Dirección] ───── (Presenta el informe final de madurez auditado)`,
    connections: [
      { btnId: "gestionycalidad", btnName: "ISO Gestión de Calidad", description: "Verifica visualmente el 100% de la arquitectura documental del sistema frente a normativas internacionales." },
      { btnId: "auditorias", btnName: "Análisis Crítico", description: "Activa e implementa los planes 8D y matrices Ishikawa ante fallas de control identificadas en campo." },
      { btnId: "direccion", btnName: "Análisis de Gestión", description: "Proporciona el reporte oficial técnico ejecutivo para redefinir el plan estratégico de la junta Cláusula 9.3." }
    ]
  }
];
