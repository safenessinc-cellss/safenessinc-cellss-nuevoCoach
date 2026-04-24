export interface ISOImageMetadata {
  id: string;
  src: string;
  alt: string;
  description: string;
  normaRelacionada: string;
  clausula?: string;
  categoria: 'iconos' | 'diagramas' | 'cumplimiento' | 'general';
}

export const imageRegistry: Record<string, ISOImageMetadata> = {
  'mapa-procesos-9001': {
    id: 'mapa-procesos-9001',
    src: 'https://images.unsplash.com/photo-1507925922893-ce33af23b3f2?auto=format&fit=crop&q=80&w=1200',
    alt: 'Mapa de Interacción de Procesos (SGC)',
    description: 'Representación visual de la interacción de los procesos del Sistema de Gestión de Calidad, incluyendo entradas, salidas y puntos de control operativos.',
    normaRelacionada: 'ISO 9001:2015',
    clausula: '4.4',
    categoria: 'diagramas'
  },
  'estructura-organizacional': {
    id: 'estructura-organizacional',
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
    alt: 'Estructura Organizacional y Roles',
    description: 'Definición de roles, responsabilidades y autoridades en la organización para asegurar la efectividad del SGC.',
    normaRelacionada: 'ISO 9001:2015',
    clausula: '5.3',
    categoria: 'diagramas'
  },
  'gestion-riesgos-45001': {
    id: 'gestion-riesgos-45001',
    src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
    alt: 'Matriz de Gestión de Riesgos',
    description: 'Captura del modelo de cumplimiento para la evaluación y mitigación de riesgos organizacionales e impacto operativo.',
    normaRelacionada: 'ISO 45001:2018',
    clausula: '6.1.2',
    categoria: 'cumplimiento'
  },
  'estandarizacion-sgc': {
    id: 'estandarizacion-sgc',
    src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200',
    alt: 'Estandarización del SGC',
    description: 'Diagrama sobre los procedimientos operativos estandarizados requeridos para el control de la información documentada.',
    normaRelacionada: 'ISO 9001:2015',
    clausula: '7.5',
    categoria: 'cumplimiento'
  },
  'conferencia1': {
    id: 'conferencia1',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    alt: 'Auditoría en Sitio - Kickoff',
    description: 'Imagen ilustrativa sobre las dinámicas de implementación y auditoría física con alto liderazgo gerencial.',
    normaRelacionada: 'ISO 19011:2018',
    clausula: 'General',
    categoria: 'general'
  },
  'conferencia2': {
    id: 'conferencia2',
    src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200',
    alt: 'Perfil Ejecutivo',
    description: 'Fotografía de perfil profesional para portafolio de Robert Terán.',
    normaRelacionada: 'Liderazgo ISO',
    clausula: 'General',
    categoria: 'general'
  },
  'logo-robert-teran': {
    id: 'logo-robert-teran',
    src: 'https://images.unsplash.com/photo-1614607242094-b1b22e11a141?auto=format&fit=crop&q=80&w=1200',
    alt: 'Logotipo de la Firma',
    description: 'Identidad visual del servicio de consultoría.',
    normaRelacionada: 'General',
    clausula: 'General',
    categoria: 'iconos'
  }
};
