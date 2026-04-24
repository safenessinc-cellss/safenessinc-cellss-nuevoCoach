import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers } from 'lucide-react';
import ISOImage from './ISOImage';
import { useImageRegistry } from '../data/useImageRegistry';
import { ISOImageMetadata } from '../data/imageRegistry';

export default function ClauseViewer() {
  const [activeClause, setActiveClause] = useState('4.4');
  const [activeNorm, setActiveNorm] = useState('ISO 9001:2015');

  const { registry } = useImageRegistry();

  // Recupera la imagen preconfigurada basándose en sus metadatos
  const mappedImage = (Object.values(registry) as ISOImageMetadata[]).find(
    (img) => img.clausula === activeClause && img.normaRelacionada === activeNorm
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans py-20 px-4 selection:bg-red-500/30">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Volver al Portafolio
        </Link>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Manual de Auditoría Interactiva</h1>
          <p className="text-red-400 font-medium text-lg">Visor Dinámico de Normativas (Demostración de Activos)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navegación Lateral */}
          <div className="lg:col-span-4 space-y-2">
            <div className="p-4 border border-white/5 bg-white/[0.02] rounded-2xl mb-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-500" /> Índice ISO 9001:2015
              </h3>
              <div className="space-y-1">
                <button 
                  onClick={() => { setActiveClause('4.4'); setActiveNorm('ISO 9001:2015'); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition text-sm font-medium ${activeClause === '4.4' && activeNorm === 'ISO 9001:2015' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  Cláusula 4.4: Sistema de Gestión
                </button>
                <button 
                  onClick={() => { setActiveClause('5.3'); setActiveNorm('ISO 9001:2015'); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition text-sm font-medium ${activeClause === '5.3' && activeNorm === 'ISO 9001:2015' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  Cláusula 5.3: Roles y Autoridades
                </button>
                <button 
                  onClick={() => { setActiveClause('7.5'); setActiveNorm('ISO 9001:2015'); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition text-sm font-medium ${activeClause === '7.5' && activeNorm === 'ISO 9001:2015' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  Cláusula 7.5: Información Documentada
                </button>
                <button 
                  onClick={() => { setActiveClause('8.1'); setActiveNorm('ISO 9001:2015'); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition text-sm font-medium ${activeClause === '8.1' && activeNorm === 'ISO 9001:2015' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  Cláusula 8.1: Planificación (Vacía)
                </button>
              </div>
            </div>
            
            <div className="p-4 border border-white/5 bg-white/[0.02] rounded-2xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Índice ISO 45001:2018
              </h3>
              <div className="space-y-1">
                <button 
                  onClick={() => { setActiveClause('6.1.2'); setActiveNorm('ISO 45001:2018'); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition text-sm font-medium ${activeClause === '6.1.2' && activeNorm === 'ISO 45001:2018' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  Cláusula 6.1.2: Gestión de Riesgos
                </button>
              </div>
            </div>
          </div>

          {/* Área de Visualización (ISOImage Render Engine) */}
          <div className="lg:col-span-8">
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-6">Material de Apoyo Técnico</h2>
              
              {mappedImage ? (
                <>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    A continuación se presenta el activo verificado para la validación de la cláusula seleccionada. Este recurso es utilizado oficialmente durante las sesiones de auditoría de Coach-ISO.
                  </p>
                  {/* AQUÍ SE UTILIZA EL COMPONENTE ISOImage REFACTORIZADO PASANDO EL ID */}
                  <ISOImage id={mappedImage.id} />
                </>
              ) : (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-black/20">
                  <p className="text-gray-500">No hay activos registrados para la cláusula {activeClause} actualmente.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
