import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, XCircle, Maximize2, Share2, Check, X } from 'lucide-react';
import { useImageRegistry } from '../data/useImageRegistry';

interface ISOImageProps {
  id: string; // La prop principal ahora es el ID del registro
  className?: string;
}

export default function ISOImage({ 
  id, 
  className = '' 
}: ISOImageProps) {
  
  const { registry } = useImageRegistry();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  const imageData = registry[id];

  useEffect(() => {
    if (imageData?.src) {
      setImageSrc(imageData.src);
      setHasError(false);
    }
  }, [imageData?.src]);

  if (!imageData) {
    return (
      <div className={`flex flex-col items-center justify-center bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center ${className}`}>
        <XCircle className="w-8 h-8 text-red-500 mb-3" />
        <p className="text-red-400 font-bold">Imagen no encontrada</p>
        <p className="text-red-400/60 text-sm mt-1">El ID "{id}" no existe en el registro ISO.</p>
      </div>
    );
  }

  const { alt, description, normaRelacionada, clausula } = imageData;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Creamos un texto enriquecido para copiar al portapapeles
    const shareText = `Revisa este activo ISO:\n${alt}\n` +
      `Norma: ${normaRelacionada}` + 
      (clausula ? ` (Cláusula ${clausula})` : '') + 
      `\n🔗 ${window.location.origin}/normas`;
    
    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc('https://images.unsplash.com/photo-1507925922893-ce33af23b3f2?auto=format&fit=crop&q=80&w=1200');
    }
  };

  return (
    <>
      <motion.figure 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        // Diseño perfeccionado de Dashboard: fondo oscuro sofisticado, sombras sutiles integradas (glow) y bordes nítidos.
        className={`flex flex-col bg-gradient-to-b from-[#111111] to-[#0a0a0a] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] border border-white/10 overflow-hidden group hover:border-red-500/30 transition-colors ${className}`}
      >
        {/* Contenedor de la Imagen */}
        <div 
          className="relative w-full overflow-hidden bg-black/60 cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img 
            src={imageSrc || undefined} 
            alt={alt} 
            loading="lazy" 
            decoding="async" 
            onError={handleImageError}
            className="w-full h-auto object-cover max-h-[400px] transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100" 
          />
          
          {/* Badge Flotante para la Norma */}
          {(normaRelacionada || clausula) && (
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span className="tracking-widest">
                {normaRelacionada} {clausula ? `// CLAUSULA ${clausula}` : ''}
              </span>
            </div>
          )}

          {/* Overlay de expansión al pasar el mouse */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
               <Maximize2 className="w-6 h-6" />
             </div>
          </div>
        </div>

        {/* Caption y Metadata (Diseño de Tablero de Control) */}
        {(description || alt) && (
          <figcaption className="p-5 flex items-start justify-between gap-4 border-t border-white/5 relative bg-[#0f0f0f]">
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-1 bg-white/5 border border-white/10 p-2 rounded-lg shrink-0">
                <Info className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-gray-100 text-sm tracking-tight mb-1">{alt}</p>
                {description && <p className="text-gray-400 text-sm leading-relaxed">{description}</p>}
              </div>
            </div>

            {/* Botón de Compartir */}
            <button 
              onClick={handleShare}
              className="mt-1 shrink-0 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all focus:outline-none flex items-center gap-2 relative group/share"
              title="Copiar enlace"
            >
              {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {/* Tooltip local */}
              {isCopied && (
                <span className="absolute -top-8 right-0 text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded inline-block whitespace-nowrap">
                  Copiado!
                </span>
              )}
            </button>
          </figcaption>
        )}
      </motion.figure>

      {/* LIGHTBOX MODAL OVERLAY */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.img 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={imageSrc || undefined} 
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center max-w-2xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-bold text-xl mb-2">{alt}</h3>
              <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-red-400 mb-3">
                <span>{normaRelacionada}</span>
                {clausula && (
                  <>
                    <span className="text-white/20">•</span>
                    <span>Cláusula {clausula}</span>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
