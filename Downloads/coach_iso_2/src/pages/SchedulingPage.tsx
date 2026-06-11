import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, Mail, Building, FileText, CheckCircle, AlertCircle, LogIn, ArrowLeft, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function SchedulingPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    date: '',
    time: '',
    topic: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setFormData(prev => ({ ...prev, name: u.displayName || '', email: u.email || '' }));
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log('El usuario cerró la ventana de inicio de sesión.');
      } else {
        console.error('Error de inicio de sesión:', error);
        setStatus('error');
        setErrorMessage('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (value.trim().length < 2) error = 'El nombre debe tener al menos 2 caracteres.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Correo electrónico inválido.';
        break;
      case 'date':
        if (value) {
          // Create dates in local timezone to avoid UTC shift issues
          const [year, month, day] = value.split('-').map(Number);
          const selectedDate = new Date(year, month - 1, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) error = 'La fecha no puede ser en el pasado.';
        }
        break;
      case 'topic':
        if (value.trim().length < 10) error = 'Por favor, proporciona más detalles (mínimo 10 caracteres).';
        break;
    }
    setValidationErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Validate all fields before submitting
    const isNameValid = validateField('name', formData.name);
    const isEmailValid = validateField('email', formData.email);
    const isDateValid = validateField('date', formData.date);
    const isTopicValid = validateField('topic', formData.topic);

    if (!isNameValid || !isEmailValid || !isDateValid || !isTopicValid) {
      return;
    }

    setStatus('submitting');
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      const docRef = await addDoc(collection(db, 'consultations'), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        date: dateTime,
        topic: formData.topic,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Simular notificación por email a ambos: admin y cliente
      try {
        await addDoc(collection(db, 'mail'), {
          to: formData.email,
          message: {
            subject: 'Confirmación de solicitud de consultoría',
            html: `<p>Hola ${formData.name},</p><p>Hemos recibido tu solicitud para el ${formData.date} a las ${formData.time}. Pronto validaremos la disponibilidad.</p>`
          }
        });
        await addDoc(collection(db, 'mail'), {
          to: 'safeness.c.a@gmail.com', // Admin email
          message: {
            subject: 'Nueva solicitud de consultoría',
            html: `<p>Tienes una nueva solicitud de consultoría de ${formData.name} (${formData.email}) para el ${formData.date}.</p>`
          }
        });
      } catch (emailErr) {
        console.error("Error scheduling email", emailErr);
      }
      
      setStatus('success');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || 'Error al agendar la consulta.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocusedField(null);
    validateField(e.target.name, e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocusedField(e.target.name);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
        <p className="text-gray-400 animate-pulse">Cargando sistema de reservas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Volver al Portafolio
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Agendar Consulta</h1>
            <p className="text-gray-400">Reserva una sesión estratégica con Robert Terán para evaluar las necesidades de tu empresa.</p>
          </div>

          {!user ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Inicia sesión para agendar</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Para mantener un registro seguro de tus consultas, por favor inicia sesión con tu cuenta de Google.</p>
              
              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400 max-w-md mx-auto">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm text-left">{errorMessage}</p>
                </div>
              )}

              <button 
                onClick={handleLogin}
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
              >
                <LogIn className="w-5 h-5" />
                Continuar con Google
              </button>
            </div>
          ) : status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
              className="text-center py-10"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-4"
              >
                ¡Consulta Agendada!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 mb-8 text-lg"
              >
                Hemos recibido tu solicitud. Robert Terán se pondrá en contacto contigo pronto para confirmar los detalles.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/" className="inline-block bg-red-600 text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition hover:scale-105 active:scale-95">
                  Volver al Inicio
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{errorMessage}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className={`text-sm font-medium flex items-center gap-2 transition-colors ${focusedField === 'name' ? 'text-red-400' : validationErrors.name ? 'text-red-500' : 'text-gray-400'}`}>
                    <User className="w-4 h-4" /> Nombre Completo
                  </label>
                  <input 
                    id="name" required type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    aria-invalid={!!validationErrors.name}
                    aria-describedby={validationErrors.name ? "name-error" : undefined}
                    className={`w-full bg-black/50 border ${validationErrors.name ? 'border-red-500 bg-red-500/5' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all`}
                  />
                  <AnimatePresence>
                    {validationErrors.name && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="name-error" className="text-xs text-red-500 mt-1">{validationErrors.name}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className={`text-sm font-medium flex items-center gap-2 transition-colors ${focusedField === 'email' ? 'text-red-400' : validationErrors.email ? 'text-red-500' : 'text-gray-400'}`}>
                    <Mail className="w-4 h-4" /> Correo Electrónico
                  </label>
                  <input 
                    id="email" required type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? "email-error" : undefined}
                    className={`w-full bg-black/50 border ${validationErrors.email ? 'border-red-500 bg-red-500/5' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all`}
                  />
                  <AnimatePresence>
                    {validationErrors.email && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="email-error" className="text-xs text-red-500 mt-1">{validationErrors.email}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className={`text-sm font-medium flex items-center gap-2 transition-colors ${focusedField === 'company' ? 'text-red-400' : 'text-gray-400'}`}>
                  <Building className="w-4 h-4" /> Empresa (Opcional)
                </label>
                <input 
                  id="company" type="text" name="company" value={formData.company} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="date" className={`text-sm font-medium flex items-center gap-2 transition-colors ${focusedField === 'date' ? 'text-red-400' : validationErrors.date ? 'text-red-500' : 'text-gray-400'}`}>
                    <Calendar className="w-4 h-4" /> Fecha Preferida
                  </label>
                  <input 
                    id="date" required type="date" name="date" value={formData.date} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    aria-invalid={!!validationErrors.date}
                    aria-describedby={validationErrors.date ? "date-error" : undefined}
                    className={`w-full bg-black/50 border ${validationErrors.date ? 'border-red-500 bg-red-500/5' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all [color-scheme:dark]`}
                  />
                  <AnimatePresence>
                    {validationErrors.date && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="date-error" className="text-xs text-red-500 mt-1">{validationErrors.date}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label htmlFor="time" className={`text-sm font-medium flex items-center gap-2 transition-colors ${focusedField === 'time' ? 'text-red-400' : 'text-gray-400'}`}>
                    <Clock className="w-4 h-4" /> Hora Preferida
                  </label>
                  <input 
                    id="time" required type="time" name="time" value={formData.time} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="topic" className={`text-sm font-medium flex items-center gap-2 transition-colors ${focusedField === 'topic' ? 'text-red-400' : validationErrors.topic ? 'text-red-500' : 'text-gray-400'}`}>
                  <FileText className="w-4 h-4" /> Tema de la Consulta
                </label>
                <textarea 
                  id="topic" required name="topic" value={formData.topic} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} rows={4}
                  aria-invalid={!!validationErrors.topic}
                  aria-describedby={validationErrors.topic ? "topic-error" : undefined}
                  placeholder="Ej: Necesitamos implementar ISO 9001 en nuestra fábrica..."
                  className={`w-full bg-black/50 border ${validationErrors.topic ? 'border-red-500 bg-red-500/5' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none`}
                />
                <AnimatePresence>
                  {validationErrors.topic && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="topic-error" className="text-xs text-red-500 mt-1">{validationErrors.topic}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition flex justify-center items-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : 'Confirmar Agendamiento'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
