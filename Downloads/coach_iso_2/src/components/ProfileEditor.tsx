import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, User, Camera, Award, FileText, Loader2, Quote } from 'lucide-react';
import { useProfileSettings, ProfileSettings } from '../data/useProfileSettings';

export default function ProfileEditor() {
  const { profile, updateProfile, loading } = useProfileSettings();
  const [formData, setFormData] = useState<ProfileSettings>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>(profile.photoUrl);

  useEffect(() => {
    setFormData(profile);
    setPhotoPreview(profile.photoUrl);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'experienceYears' ? parseInt(value) || 0 : value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setFormData(prev => ({ ...prev, photoUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-8">
          <User className="w-6 h-6 text-red-500" /> Editar Perfil Público (Robert Teran)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Edit */}
          <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-red-600/20 overflow-hidden shadow-2xl bg-black/40">
                <img src={photoPreview || undefined} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <label className="absolute bottom-2 right-2 p-3 bg-red-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-red-700 transition transform group-hover:scale-110">
                <Camera className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-white font-bold">Foto de Perfil</h3>
              <p className="text-gray-400 text-sm">Esta imagen se mostrará en la barra de navegación y en el modal de perfil. Se recomienda una imagen cuadrada de alta calidad.</p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                 <p className="text-xs text-red-400 font-bold uppercase tracking-widest">Tip de Auditor</p>
                 <p className="text-xs text-gray-400 mt-1 italic">"Una imagen profesional genera confianza inmediata en el proceso de consultoría."</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre Completo</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Años de Experiencia</label>
              <input 
                type="number" 
                name="experienceYears" 
                value={formData.experienceYears} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-500" /> Título Principal
              </label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                placeholder="ej. Auditor Líder ISO"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                <Award className="w-3 h-3 text-red-500" /> Título de Coaching
              </label>
              <input 
                type="text" 
                name="coachTitle" 
                value={formData.coachTitle} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" 
                placeholder="ej. IBM 2025 Coach"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-500" /> Biografía Corta (Bio)
              </label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-24 resize-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                <Quote className="w-3 h-3 text-red-500" /> Cita Destacada (Modal)
              </label>
              <textarea 
                name="quote" 
                value={formData.quote} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 h-32 resize-none transition-colors" 
              />
            </div>
          </div>

          <button 
            disabled={isSaving} 
            type="submit" 
            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-red-600 hover:text-white transition flex justify-center items-center gap-2 group overflow-hidden relative shadow-xl shadow-red-500/10"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                Guardar Cambios del Perfil
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
