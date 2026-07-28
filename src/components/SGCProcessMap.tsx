import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Settings, 
  Target, 
  ArrowRight, 
  CheckCircle, 
  Activity, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  User, 
  Sparkles, 
  ShieldCheck, 
  X,
  HelpCircle
} from 'lucide-react';

interface ProcessNode {
  id: string;
  name: string;
  type: 'entradas' | 'estrategicos' | 'operacionales' | 'soporte' | 'salidas';
  phase?: 'P' | 'H' | 'V' | 'A';
  shortDesc: string;
  owner: string;
  inputs: string[];
  outputs: string[];
  kpis: string[];
  risks: string[];
  color: string;
  glowColor: string;
  textColor: string;
}

function SGCProcessMap() {
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);
  const [activeCycleTab, setActiveCycleTab] = useState<'all' | 'P' | 'H' | 'V' | 'A'>('all');

  const processes: ProcessNode[] = [
    // ENTRADAS (INPUTS)
    {
      id: 'requisitos-cliente',
      name: 'Requisitos del Cliente',
      type: 'entradas',
      shortDesc: 'Necesidades explícitas e implícitas de los clientes y especificaciones de servicio.',
      owner: 'Líder Comercial / Ingeniería de Clientes',
      inputs: ['Estudios de mercado', 'Solicitudes de propuesta (RFQs)', 'Términos de referencia (ToR)'],
      outputs: ['Especificaciones validadas del cliente', 'Matriz de alcance acordada'],
      kpis: ['% de claridad de especificaciones iniciales', 'Tiempo medio de cotización'],
      risks: ['Interpretación errónea de requerimientos', 'Cambios frecuentes no controlados de diseño'],
      color: 'border-blue-500/40 bg-blue-950/20 hover:border-blue-400 hover:bg-blue-950/30 text-blue-400',
      glowColor: 'shadow-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      id: 'partes-interesadas',
      name: 'Partes Interesadas',
      type: 'entradas',
      shortDesc: 'Expectativas legales, regulatorias y requisitos de accionistas u órganos de control.',
      owner: 'Dirección Corporativa / Legal',
      inputs: ['Matrices de reglamentos nacionales e internacionales', 'Acuerdos de accionistas'],
      outputs: ['Matriz de requisitos legales vigentes (ISO 9001 Cláusula 4.2)', 'Manuales de compliance'],
      kpis: ['% de cumplimiento preventivo de normas', 'Riesgos regulatorios mitigados'],
      risks: ['Vencimiento de licencias operativas', 'Multas por actualizaciones no identificadas'],
      color: 'border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400 hover:bg-cyan-950/30 text-cyan-400',
      glowColor: 'shadow-cyan-500/10',
      textColor: 'text-cyan-400'
    },

    // PROCESOS ESTRATÉGICOS
    {
      id: 'liderazgo-direccion',
      name: 'Liderazgo & Dirección',
      type: 'estrategicos',
      phase: 'P',
      shortDesc: 'Establecimiento de políticas, objetivos anuales de calidad (OKRs) y asignación de recursos.',
      owner: 'Alta Dirección (Robert Terán / Gerencia)',
      inputs: ['Resultados del ejercicio anterior', 'Análisis macroeconómico de entorno SGI'],
      outputs: ['Política de calidad autorizada', 'Presupuestos aprobados', 'Matriz de asignación de recursos'],
      kpis: ['% de efectividad de OKRs trimestrales', 'ROI de inversiones en infraestructura'],
      risks: ['Falta de alineación del equipo medio', 'Asignación deficiente de presupuestos para SGC'],
      color: 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-950/30 text-amber-400',
      glowColor: 'shadow-amber-500/10',
      textColor: 'text-amber-400'
    },
    {
      id: 'planificacion-sgi',
      name: 'Planificación SGI',
      type: 'estrategicos',
      phase: 'P',
      shortDesc: 'Identificación de riesgos y oportunidades operativas, gestión estratégica de procesos.',
      owner: 'Especialista SGI (Robert Terán)',
      inputs: ['FODA organizacional', 'Diagnóstico de brechas de cumplimiento (Gap Analysis)'],
      outputs: ['Plan global de mitigación de riesgos', 'Matriz de objetivos de calidad por proceso'],
      kpis: ['% de procesos clave estandarizados', 'Proporción de contingencias mitigadas exitosamente'],
      risks: ['Mitigación insuficiente de riesgos críticos', 'Metas poco realistas que desmotivan al personal'],
      color: 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-950/30 text-amber-400',
      glowColor: 'shadow-amber-500/10',
      textColor: 'text-amber-400'
    },

    // PROCESOS OPERATIVOS (CADENA DE VALOR - PHVA)
    {
      id: 'ingenieria-diseno',
      name: 'Diseño & Ingeniería',
      type: 'operacionales',
      phase: 'P',
      shortDesc: 'Traducción de requerimientos de cliente en documentos técnicos y planos de proceso operativos.',
      owner: 'Gerente de Proyectos / Ingeniería',
      inputs: ['Ficha de cliente', 'Estándares internacionales de ingeniería', 'Base de datos histórica'],
      outputs: ['Planos y especificaciones de control', 'Fórmulas y hojas de ruta certificadas'],
      kpis: ['% de precisión en el primer ciclo de diseño', 'Número de correcciones post-liberación'],
      risks: ['Error en planos que causa reproceso en planta', 'Incumplimiento de tolerancias técnicas'],
      color: 'border-red-500/40 bg-red-950/20 hover:border-red-400 hover:bg-red-950/30 text-red-400',
      glowColor: 'shadow-red-500/10',
      textColor: 'text-red-400'
    },
    {
      id: 'compras-abastecimiento',
      name: 'Compras & Suministros',
      type: 'operacionales',
      phase: 'H',
      shortDesc: 'Evaluación de proveedores estratégicos, adquisición de insumos conforme a la calidad.',
      owner: 'Líder de Abastecimiento',
      inputs: ['Requisitos de materiales (BOM)', 'Evaluación anual de fiabilidad del proveedor'],
      outputs: ['Órdenes de compra autorizadas', 'Materias primas inspeccionadas en andén'],
      kpis: ['% de entregas de proveedores a tiempo (OTIF)', '% de insumos con no-conformidad al recibo'],
      risks: ['Atrasos en aduanas / desabastecimiento', 'Falta de certificados de materias primas críticas'],
      color: 'border-red-500/40 bg-red-950/20 hover:border-red-400 hover:bg-red-950/30 text-red-400',
      glowColor: 'shadow-red-500/10',
      textColor: 'text-red-400'
    },
    {
      id: 'produccion-operaciones',
      name: 'Operaciones & Producción',
      type: 'operacionales',
      phase: 'H',
      shortDesc: 'Ejecución física del servicio o manufactura del producto bajo estrictos controles estables.',
      owner: 'Gerente / Superintendente de Operaciones',
      inputs: ['Ordenes de producción activas', 'Instrucciones técnicas (SOPs)', 'Insumos verificados'],
      outputs: ['Lotes de producto terminado', 'Hojas de medición en ruta (Run Sheets)'],
      kpis: ['Generación de desperdicios (% Scrap)', 'Rendimiento general de maquinaria (OEE)'],
      risks: ['Fallas mayores de equipo en producción activa', 'Desviación de parámetros críticos del operador'],
      color: 'border-red-500/40 bg-red-950/20 hover:border-red-400 hover:bg-red-950/30 text-red-400',
      glowColor: 'shadow-red-500/10',
      textColor: 'text-red-400'
    },
    {
      id: 'control-calidad',
      name: 'Inspección & Verificación',
      type: 'operacionales',
      phase: 'V',
      shortDesc: 'Aseguramiento del cumplimiento técnico antes del despacho final al cliente.',
      owner: 'Líder de Control de Calidad',
      inputs: ['Criterios de aceptación', 'Muestras aleatorias', 'Servicios listos para validación'],
      outputs: ['Certificados de conformidad de producto', 'Reportes de desviación (No Conformidad)'],
      kpis: ['% de defectos escapados a cliente final', '% de liberación conforme al primer test (FTY)'],
      risks: ['Fuga de lote defectuoso no detectado', 'Calibración vencida de equipos de medición SGI'],
      color: 'border-red-500/40 bg-red-950/20 hover:border-red-400 hover:bg-red-950/30 text-red-400',
      glowColor: 'shadow-red-500/10',
      textColor: 'text-red-400'
    },
    {
      id: 'mejora-continua',
      name: 'Optimización & Mejora',
      type: 'operacionales',
      phase: 'A',
      shortDesc: 'Análisis de causas raíz frente a desviaciones operativas y aplicación de kaizen.',
      owner: 'Líder de Mejora Continua (Especialista en Procesos)',
      inputs: ['No Conformidades reportadas', 'Hallazgos de auditoría interna'],
      outputs: ['Planes de acción preventivos/correctivos (CAPA)', 'Actualizaciones en matriz de procesos'],
      kpis: ['% de efectividad de acciones correctivas aplicadas', 'Sugerencias de mejora ejecutadas en el mes'],
      risks: ['Aplicación de soluciones superficiales (sin causa raíz)', 'Falta de seguimiento a metas CAPA'],
      color: 'border-red-500/40 bg-red-950/20 hover:border-red-400 hover:bg-red-950/30 text-red-400',
      glowColor: 'shadow-red-500/10',
      textColor: 'text-red-400'
    },

    // PROCESOS DE SOPORTE
    {
      id: 'recursos-humanos',
      name: 'Talento & Competencias',
      type: 'soporte',
      shortDesc: 'Capacitación del recurso humano para garantizar la habilidad técnica y el clima emocional óptimo.',
      owner: 'Coordinador de Selección y Entrenamiento',
      inputs: ['Necesidades de capacitación del área', 'Resultados de evaluaciones de desempeño'],
      outputs: ['Programa de capacitación anual', 'Historial técnico calificado del personal'],
      kpis: ['% de efectividad de capacitación (Evaluación indirecta)', 'Índice de retención del talento clave'],
      risks: ['Brechas críticas de competencia operativa no cubiertas', 'Interrupción del servicio por rotación acelerada'],
      color: 'border-purple-500/40 bg-purple-950/20 hover:border-purple-400 hover:bg-purple-950/30 text-purple-400',
      glowColor: 'shadow-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      id: 'tecnologia-infra',
      name: 'Sistemas & Infraestructura',
      type: 'soporte',
      shortDesc: 'Mantener la integridad física y tecnológica de los activos clave de la empresa.',
      owner: 'Líder de TI y Mantenimiento',
      inputs: ['Programa preventivo de hardware/software', 'Reportes incidentales de soporte técnico'],
      outputs: ['Servidores de alta disponibilidad activos', 'Fichas de mantenimiento de equipos'],
      kpis: ['Tiempo de actividad general de los sistemas (Uptime)', '% de mantenimientos críticos completados'],
      risks: ['Pérdida inesperada de información por falta de backups', 'Falla de máquinas indispensables en producción'],
      color: 'border-purple-500/40 bg-purple-950/20 hover:border-purple-400 hover:bg-purple-950/30 text-purple-400',
      glowColor: 'shadow-purple-500/10',
      textColor: 'text-purple-400'
    },

    // SALIDAS (OUTPUTS)
    {
      id: 'satisfaccion-cliente',
      name: 'Satisfacción del Cliente',
      type: 'salidas',
      shortDesc: 'Confirmación objetiva de la superación de expectativas comerciales del cliente final.',
      owner: 'Especialista en Experiencia del Cliente',
      inputs: ['Encuestas de satisfacción recurrentes', 'Puntos de contacto post-venta'],
      outputs: ['Índice de Satisfacción (CSAT / NPS)', 'Portafolio de retención de cuentas clave'],
      kpis: ['Net Promoter Score (NPS) organizacional', '% de retención de clientes recurrentes'],
      risks: ['Pasividad técnica en responder reclamos de clientes', 'Falta de objetividad en la recolección de feedback'],
      color: 'border-green-500/40 bg-green-950/20 hover:border-green-400 hover:bg-green-950/30 text-green-400',
      glowColor: 'shadow-green-500/10',
      textColor: 'text-green-400'
    },
    {
      id: 'operacion-rentabilidad',
      name: 'Rentabilidad Operativa',
      type: 'salidas',
      shortDesc: 'Reducción de reprocesos, costos de no calidad y optimización de recursos financieros a largo plazo.',
      owner: 'Dirección de Finanzas & Robert Terán',
      inputs: ['Estados financieros provisionales', 'Métricas agregadas del SGI'],
      outputs: ['Rentabilidad neta del proyecto', 'Ahorros derivados de la reducción de scrap'],
      kpis: ['Disminución del Costo de No Calidad (CoNC)', 'Margen bruto operativo por proyecto'],
      risks: ['Costos ocultos por no conformidad técnica', 'Asignación errática del capital'],
      color: 'border-green-500/40 bg-green-950/20 hover:border-green-400 hover:bg-green-950/30 text-green-400',
      glowColor: 'shadow-green-500/10',
      textColor: 'text-green-400'
    }
  ];

  const filteredProcesses = activeCycleTab === 'all' 
    ? processes 
    : (Array.isArray(processes) ? processes : []).filter(p => p.phase === activeCycleTab || p.type !== 'operacionales' && p.type !== 'estrategicos');

  return (
    <div className="w-full flex flex-col gap-6" id="sgc-process-map-container">
      {/* Selector de Ciclo PHVA */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase font-mono">Consola Interactiva del Mapa</span>
        </div>
        <div className="flex gap-1 bg-black/40 p-1 border border-white/10 rounded-xl max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveCycleTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeCycleTab === 'all' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Ver Todo
          </button>
          <button
            onClick={() => setActiveCycleTab('P')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${activeCycleTab === 'P' ? 'bg-amber-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping"></span>
            Planear (P)
          </button>
          <button
            onClick={() => setActiveCycleTab('H')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${activeCycleTab === 'H' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block animate-ping"></span>
            Hacer (H)
          </button>
          <button
            onClick={() => setActiveCycleTab('V')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${activeCycleTab === 'V' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block animate-ping"></span>
            Verificar (V)
          </button>
          <button
            onClick={() => setActiveCycleTab('A')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${activeCycleTab === 'A' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-ping"></span>
            Actuar (A)
          </button>
        </div>
      </div>

      {/* Grid del Mapa de Procesos SGC */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch p-4 md:p-6 bg-[#080808] border border-white/5 rounded-3xl relative overflow-hidden">
        {/* Glow de fondo decorativo */}
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-red-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

        {/* COLUMNA 1: ENTRADAS */}
        <div className="space-y-4 flex flex-col justify-center">
          <div className="text-center lg:text-left">
            <h4 className="text-[10px] font-bold tracking-widest text-blue-400 uppercase font-mono mb-2">// 1. Requisitos & Entradas</h4>
            <p className="text-xs text-gray-500">Inputs técnicos y de mercado que movilizan la operación corporativa.</p>
          </div>
          {(Array.isArray(processes) ? processes : []).filter(p => p.type === 'entradas').map((node, idx) => (
            <div
              key={`entradas-${node.id}-${idx}`}
              onClick={() => setSelectedNode(node)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.4)] ${node.color} ${node.glowColor} group-hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">Entrada</span>
                <Sparkles className="w-3 h-3 text-blue-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h5 className="font-extrabold text-white text-xs">{node.name}</h5>
              <p className="text-[10.5px] text-gray-400 leading-tight mt-1 line-clamp-2">{node.shortDesc}</p>
              <div className="flex items-center gap-1 mt-2 text-[9.5px] font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Inspeccionar panel</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* COLUMNA 2, 3, 4 combinadas: CADENA DE CICLO DE MEJORA SGI */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
          
          {/* Fila Superior: Procesos Estratégicos */}
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase font-mono">// Procesos Estratégicos</span>
              <span className="text-[9px] font-mono text-gray-500">Cláusula 5 (Liderazgo) & Cláusula 6 (Planificación)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Array.isArray(processes) ? processes : []).filter(p => p.type === 'estrategicos').map((node, idx) => {
                const isSelectedTab = activeCycleTab === 'all' || activeCycleTab === node.phase;
                return (
                  <div
                    key={`estrategicos-${node.id}-${idx}`}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 shadow-md ${node.color} ${node.glowColor} ${!isSelectedTab ? 'opacity-40 filter grayscale' : 'scale-[1.01]'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">Estratégico</span>
                      <span className="bg-amber-600 text-black text-[9px] font-extrabold px-1.5 rounded-full">Phase: {node.phase}</span>
                    </div>
                    <h5 className="font-extrabold text-white text-xs">{node.name}</h5>
                    <p className="text-[10.5px] text-gray-400 leading-tight mt-1 line-clamp-1">{node.shortDesc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fila del Medio: Procesos de la Cadena de Valor (Operacionales) */}
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl relative">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase font-mono">// Proceso Operativos - Ciclo PHVA</span>
              <span className="text-[9px] font-mono text-red-500/60 font-black animate-pulse">FLUJO PRINCIPAL DE VALOR</span>
            </div>
            
            {/* Camino interactivo */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {(Array.isArray(processes) ? processes : []).filter(p => p.type === 'operacionales').map((node, idx) => {
                const isSelectedTab = activeCycleTab === 'all' || activeCycleTab === node.phase;
                
                // Color mapping for phases
                let phaseColorClass = "bg-amber-500";
                if (node.phase === "H") phaseColorClass = "bg-red-500";
                if (node.phase === "V") phaseColorClass = "bg-blue-500";
                if (node.phase === "A") phaseColorClass = "bg-green-500";

                return (
                  <div key={`operacionales-${node.id}-${idx}`} className="relative flex flex-col justify-between">
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-300 shadow h-full flex flex-col justify-between ${node.color} ${node.glowColor} ${!isSelectedTab ? 'opacity-30 filter grayscale' : 'scale-[1.01]'}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`${phaseColorClass} text-black font-black text-[8px] px-1 rounded-full uppercase`}>{node.phase}</span>
                          <span className="text-[8px] font-mono text-gray-500">Nod.{idx+1}</span>
                        </div>
                        <h5 className="font-semibold text-white text-[11px] leading-snug line-clamp-2">{node.name}</h5>
                      </div>
                      <p className="text-[9px] text-gray-500 leading-none mt-2">Ver controles SGI</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fila Inferior: Procesos de Soporte */}
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold tracking-widest text-purple-500 uppercase font-mono">// Procesos de Apoyo / Soporte Técnico</span>
              <span className="text-[9px] font-mono text-gray-500">Sostenibilidad operante y de personas</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Array.isArray(processes) ? processes : []).filter(p => p.type === 'soporte').map((node, idx) => (
                <div
                  key={`soporte-${node.id}-${idx}`}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-300 shadow-md ${node.color} ${node.glowColor}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono">Apoyo</span>
                    <Settings className="w-3.5 h-3.5 text-purple-500/40" />
                  </div>
                  <h5 className="font-extrabold text-white text-xs">{node.name}</h5>
                  <p className="text-[10.5px] text-gray-400 leading-tight mt-1 line-clamp-1">{node.shortDesc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA 5: SALIDAS & MEJORA */}
        <div className="space-y-4 flex flex-col justify-center">
          <div className="text-center lg:text-right">
            <h4 className="text-[10px] font-bold tracking-widest text-green-400 uppercase font-mono mb-2">// 2. Resultados & Retorno</h4>
            <p className="text-xs text-gray-500">Impacto medible en reputación corporativa y rentabilidad acumulada.</p>
          </div>
          {(Array.isArray(processes) ? processes : []).filter(p => p.type === 'salidas').map((node, idx) => (
            <div
              key={`salidas-${node.id}-${idx}`}
              onClick={() => setSelectedNode(node)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.4)] ${node.color} ${node.glowColor} group-hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-mono">Salida SGI</span>
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              </div>
              <h5 className="font-extrabold text-white text-xs">{node.name}</h5>
              <p className="text-[10.5px] text-gray-400 leading-tight mt-1 line-clamp-2">{node.shortDesc}</p>
              <div className="flex items-center gap-1 mt-2 text-[9.5px] font-bold text-green-400 group-hover:translate-x-1 transition-transform">
                <span>Inspeccionar panel</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEYENDA RÁPIDA */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-2 px-4 rounded-xl border border-white/5 bg-white/[0.01] text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block"></span>
          <span>Entradas (Requisitos Ley/Cliente)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
          <span>Procesos de Liderazgo (Estratégico)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
          <span>Procesos Operativos (Cadena de Valor)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 block"></span>
          <span>Apoyo e Infraestructura</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 block"></span>
          <span>Impacto y Resultados de Negocio</span>
        </div>
      </div>

      {/* MODAL DETALLADO DE CONTROL DE PROCESO (DIAL DE CONTROL) */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#0b0b0b] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden focus:outline-none shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cabecera del Panel de Proceso */}
              <div className="p-6 border-b border-white/5 bg-[#0f0f0f] relative flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 uppercase border border-red-500/30 px-2 py-0.5 rounded">
                      Ficha Técnica SGI
                    </span>
                    {selectedNode.phase && (
                      <span className="text-[10px] bg-white/5 text-gray-300 px-2.5 py-0.5 rounded font-bold">
                        Fase PHVA: {selectedNode.phase}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    {selectedNode.type === 'entradas' && <ArrowRight className="w-5 h-5 text-blue-400" />}
                    {selectedNode.type === 'estrategicos' && <Target className="w-5 h-5 text-amber-400" />}
                    {selectedNode.type === 'operacionales' && <Activity className="w-5 h-5 text-red-500" />}
                    {selectedNode.type === 'soporte' && <Settings className="w-5 h-5 text-purple-400" />}
                    {selectedNode.type === 'salidas' && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {selectedNode.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido / Datos de Procesamiento */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto font-sans">
                {/* Breve descripción */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-xs font-mono text-gray-500 uppercase mb-1">Descripción del Proceso</p>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">{selectedNode.shortDesc}</p>
                </div>

                {/* Dueño del Proceso */}
                <div className="flex items-center gap-3 p-3.5 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-red-600/10 flex items-center justify-center text-red-400 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase">Líder / Propietario del Proceso</p>
                    <p className="text-sm font-extrabold text-white">{selectedNode.owner}</p>
                  </div>
                </div>

                {/* Columnas dinámicas: Entradas y Salidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0d0d0d] border border-white/5 rounded-xl">
                    <h4 className="text-xs font-extrabold text-blue-400 mb-2.5 pb-1 border-b border-white/5 uppercase tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 block h-1.5 w-1.5"></span>
                      Entradas Clínicas (Inputs)
                    </h4>
                    <ul className="space-y-1.5">
                      {(selectedNode.inputs || []).map((inp, i) => (
                        <li key={`inp-${i}`} className="text-xs text-gray-400 flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold mt-0.5">•</span>
                          <span>{inp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#0d0d0d] border border-white/5 rounded-xl">
                    <h4 className="text-xs font-extrabold text-green-400 mb-2.5 pb-1 border-b border-white/5 uppercase tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 block h-1.5 w-1.5"></span>
                      Resultados Entregables (Outputs)
                    </h4>
                    <ul className="space-y-1.5">
                      {(selectedNode.outputs || []).map((out, i) => (
                        <li key={`out-${i}`} className="text-xs text-gray-400 flex items-start gap-1.5">
                          <span className="text-green-500 font-bold mt-0.5">•</span>
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* KPIs & Riesgos Críticos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0d0d0d] border border-white/5 rounded-xl">
                    <h4 className="text-xs font-extrabold text-red-400 mb-2.5 pb-1 border-b border-white/5 uppercase tracking-wide flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                      KPIs de Control Continuo
                    </h4>
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      {(selectedNode.kpis || []).map((kpi, i) => (
                        <li key={`kpi-${i}`} className="text-gray-300 flex items-start gap-1.5">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{kpi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#0d0d0d] border border-white/5 rounded-xl">
                    <h4 className="text-xs font-extrabold text-orange-400 mb-2.5 pb-1 border-b border-white/5 uppercase tracking-wide flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                      Riesgos Operacionales ISO 31000
                    </h4>
                    <ul className="space-y-1.5 text-xs">
                      {(selectedNode.risks || []).map((risk, i) => (
                        <li key={`risk-${i}`} className="text-gray-400 flex items-start gap-1.5">
                          <span className="text-orange-400 font-bold">•</span>
                          <span className="italic">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-[#090909] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 px-6">
                <span className="font-mono">Audit Ready // Robert Terán SGI</span>
                <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold uppercase">ISO 9001:2015 Cert.</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(SGCProcessMap);
