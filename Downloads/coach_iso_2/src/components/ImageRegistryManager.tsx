import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ImagePlus, CheckCircle, ShieldCheck, Tag, Loader2, Edit3, XCircle, Save, Trash2 } from 'lucide-react';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useImageRegistry } from '../data/useImageRegistry';
import { ISOImageMetadata } from '../data/imageRegistry';
import ISOImage from './ISOImage';

export default function ImageRegistryManager() {
  const { registry, loading } = useImageRegistry();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    alt: '',
    description: '',
    normaRelacionada: '',
    clausula: '',
    categoria: 'diagramas' as 'iconos' | 'diagramas' | 'cumplimiento' | 'general',
  });
  const [fileBase64, setFileBase64] = useState<string | null>(null);

  const imagesList = Object.values(registry) as ISOImageMetadata[];

  // Search logic
  const filteredImages = useMemo(() => {
    return imagesList.filter(img => {
      const term = searchTerm.toLowerCase();
      return (
        img.normaRelacionada?.toLowerCase().includes(term) ||
        img.clausula?.toLowerCase().includes(term) ||
        img.description?.toLowerCase().includes(term) ||
        img.id.toLowerCase().includes(term)
      );
    });
  }, [imagesList, searchTerm]);

  // Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Convert File to Base64 (simulating upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.alt || !formData.normaRelacionada || !fileBase64) {
      alert("Por favor llena los campos requeridos y selecciona una imagen (ID, Alt, Norma).");
      return;
    }

    // Uniqueness validation only if new
    if (!editingId && registry[formData.id]) {
      alert("El ID ya está registrado. Por favor, usa un ID único.");
      return;
    }

    setIsUploading(true);
    try {
      // Registrar en Firestore
      await setDoc(doc(db, 'image_registry', formData.id), {
        ...formData,
        src: fileBase64
      });
      
      alert(editingId ? "Imagen actualizada con éxito" : "Imagen registrada con éxito");
      setFormData({
        id: '',
        alt: '',
        description: '',
        normaRelacionada: '',
        clausula: '',
        categoria: 'diagramas',
      });
      setFileBase64(null);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Error al procesar imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (img: ISOImageMetadata) => {
    setEditingId(img.id);
    setFormData({
      id: img.id,
      alt: img.alt,
      description: img.description || '',
      normaRelacionada: img.normaRelacionada,
      clausula: img.clausula || '',
      categoria: img.categoria as any,
    });
    setFileBase64(img.src);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este activo?')) {
      await deleteDoc(doc(db, 'image_registry', id));
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Upload Form */}
      <div className={`glass p-6 md:p-8 rounded-3xl border transition-all duration-500 ${editingId ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-white/5'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {editingId ? <Edit3 className="w-6 h-6 text-amber-500" /> : <ImagePlus className="w-6 h-6 text-blue-500" />} 
            {editingId ? `Editando Activo: ${editingId}` : 'Registrar Nuevo Activo ISO'}
          </h2>
          {editingId && (
            <button 
              onClick={() => {
                setEditingId(null);
                setFormData({ id: '', alt: '', description: '', normaRelacionada: '', clausula: '', categoria: 'diagramas' });
                setFileBase64(null);
              }}
              className="text-xs font-bold text-amber-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              <XCircle className="w-4 h-4" /> Cancelar Edición
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">ID Único *</label>
              <input type="text" name="id" required disabled={!!editingId} value={formData.id} onChange={handleChange} className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="ej. mapa-procesos-v2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Texto Alternativo (Alt) *</label>
              <input type="text" name="alt" required value={formData.alt} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Descripción breve de la imagen" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Descripción / Caption</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24 resize-none" placeholder="Contexto técnico para el auditor..." />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Norma *</label>
                <input type="text" name="normaRelacionada" required value={formData.normaRelacionada} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="ej. ISO 9001:2015" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cláusula</label>
                <input type="text" name="clausula" value={formData.clausula} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="ej. 4.4" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                <option value="diagramas">Diagramas</option>
                <option value="cumplimiento">Cumplimiento</option>
                <option value="iconos">Iconos</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Archivo de Imagen *</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30" />
            </div>
            
            <button disabled={isUploading} type="submit" className={`w-full mt-4 font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 ${editingId ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin"/> : editingId ? <Save className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />} 
              {editingId ? 'Guardar Cambios' : 'Registrar Imagen'}
            </button>
          </div>
        </form>
      </div>

      {/* Registry Database View */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-500" /> Registro de Activos ISO
            </h2>
            <p className="text-sm text-gray-400 mt-1">Total registrados: {imagesList.length}</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por norma, cláusula, descripción..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredImages.map((img) => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-4 rounded-2xl border border-white/5 flex flex-col gap-4"
            >
              <div className="relative h-40 bg-black/40 rounded-xl overflow-hidden">
                <img src={img.src || undefined} alt={img.alt} className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold tracking-widest text-white/80 uppercase">
                  {img.id}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-white truncate pr-2" title={img.alt}>{img.alt}</h3>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 capitalize">{img.categoria}</span>
                </div>
                {img.description && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{img.description}</p>}
                
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg">
                  <Tag className="w-3 h-3" />
                  {img.normaRelacionada} {img.clausula ? `// Cláusula ${img.clausula}` : ''}
                </div>

                <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                  <button 
                    onClick={() => handleEdit(img)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-3 h-3" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredImages.length === 0 && (
            <div className="col-span-full text-center py-12 border border-white/5 bg-white/[0.02] rounded-2xl text-gray-500 text-sm">
              No se encontraron coincidencias para "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
