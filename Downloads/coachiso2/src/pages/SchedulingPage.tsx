import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, Mail, Building, FileText, CheckCircle, AlertCircle, LogIn, ArrowLeft, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
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
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      if (window.innerWidth < 768) {
         await signInWithRedirect(auth, provider);
      } else {
         await signInWithPopup(auth, provider);
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log('El usuario cerró la ventana de inicio de sesión.');
      } else {
        console.error('Error de inicio de sesión:', error);
        alert('Error de inicio de sesión: ' + error.message);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#03050C] text-white font-mono">
        {/* Holographic grid in loading */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
        <Loader2 className="w-10 h-10 text-[#00F0FF] animate-spin mb-4" />
        <p className="text-gray-400 animate-pulse text-xs tracking-widest uppercase">// SECURE_AUTH_INIT // CARGANDO SISTEMA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03050C] text-gray-200 font-sans py-20 px-4 relative overflow-hidden">
      {/* Dynamic Cyber background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#00F0FF]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#FF007A]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00F0FF] mb-8 transition-colors font-mono text-xs uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> [ VOLVER AL PORTAFOLIO ]
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
        >
          {/* Top subtle scan line decoration */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent"></div>

          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/5 text-[#00F0FF] text-[10px] font-mono font-bold mb-4 tracking-[0.15em] uppercase">
              // TERMINAL_REGISTRY_CONSOLE
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-display text-white mb-4 tracking-tight">Agendar Consulta</h1>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">Reserva una sesión estratégica de alta ingeniería operacional con Robert Terán para diagnosticar tus sistemas.</p>
          </div>

          {!user ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-[#00F0FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00F0FF]/25">
                <User className="w-8 h-8 text-[#00F0FF]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 font-display">Inicia sesión para agendar</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">Para registrar tus consultas de manera segura bajo protocolos encriptados, inicia sesión con Google.</p>
              
              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/35 rounded-xl flex items-start gap-3 text-red-400 max-w-md mx-auto text-left">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-xs font-mono">{errorMessage}</p>
                </div>
              )}

              <button 
                onClick={handleLogin}
                className="inline-flex items-center gap-2 bg-[#090D1A] text-white border border-[#00F0FF]/30 px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#00F0FF]" />
                AUTENTICAR_CON_GOOGLE
              </button>
            </div>
          ) : status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-4 font-mono text-xs"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              
              <div className="border border-emerald-500/20 bg-emerald-500/[0.03] p-8 rounded-2xl max-w-lg mx-auto mb-8 text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                
                <h3 className="text-emerald-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  [ TRANSMISIÓN_COMPLETADA // RESERVA_ESTABLE ]
                </h3>
                
                <div className="space-y-2.5 text-gray-300 font-mono text-xs leading-relaxed">
                  <p><span className="text-gray-500">OPERADOR:</span> {formData.name}</p>
                  <p><span className="text-gray-500">CANAL:</span> {formData.email}</p>
                  {formData.company && <p><span className="text-gray-500">EMPRESA:</span> {formData.company}</p>}
                  <p><span className="text-gray-500">FECHA_TIME:</span> {formData.date} // T_{formData.time}</p>
                  <p className="border-t border-white/5 pt-2 mt-2 text-gray-400 leading-relaxed font-sans text-sm">
                    Hemos registrado tu solicitud de manera exitosa en nuestro Ledger de Consultas. Robert Terán revisará los parámetros de interacción y se pondrá en contacto pronto.
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/" className="inline-block bg-gradient-to-r from-[#00F0FF] to-[#FF007A] text-white px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all transform hover:scale-105 active:scale-95">
                  [ VOLVER AL ESCRITORIO_PRINCIPAL ]
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400 font-mono text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className={`text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${focusedField === 'name' ? 'text-[#00F0FF]' : validationErrors.name ? 'text-red-500' : 'text-gray-400'}`}>
                    <User className="w-3.5 h-3.5" />_Nombre Completo
                  </label>
                  <input 
                    id="name" required type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    aria-invalid={!!validationErrors.name}
                    aria-describedby={validationErrors.name ? "name-error" : undefined}
                    className={`w-full bg-[#050814]/75 border ${validationErrors.name ? 'border-red-500 bg-red-500/5' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20 transition-all`}
                  />
                  <AnimatePresence>
                    {validationErrors.name && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="name-error" className="text-xs text-red-500 mt-1 font-mono">{validationErrors.name}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className={`text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${focusedField === 'email' ? 'text-[#00F0FF]' : validationErrors.email ? 'text-red-500' : 'text-gray-400'}`}>
                    <Mail className="w-3.5 h-3.5" />_Canal de Enlace (Email)
                  </label>
                  <input 
                    id="email" required type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? "email-error" : undefined}
                    className={`w-full bg-[#050814]/75 border ${validationErrors.email ? 'border-red-500 bg-red-500/5' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20 transition-all`}
                  />
                  <AnimatePresence>
                    {validationErrors.email && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="email-error" className="text-xs text-red-500 mt-1 font-mono">{validationErrors.email}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className={`text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${focusedField === 'company' ? 'text-[#00F0FF]' : 'text-gray-400'}`}>
                  <Building className="w-3.5 h-3.5" />_Organización Comercial (Opcional)
                </label>
                <input 
                  id="company" type="text" name="company" value={formData.company} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                  className="w-full bg-[#050814]/75 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="date" className={`text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${focusedField === 'date' ? 'text-[#00F0FF]' : validationErrors.date ? 'text-red-500' : 'text-gray-400'}`}>
                    <Calendar className="w-3.5 h-3.5" />_Fecha Estelar
                  </label>
                  <input 
                    id="date" required type="date" name="date" value={formData.date} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    aria-invalid={!!validationErrors.date}
                    aria-describedby={validationErrors.date ? "date-error" : undefined}
                    className={`w-full bg-[#050814]/75 border ${validationErrors.date ? 'border-red-500 bg-red-500/5' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20 transition-all [color-scheme:dark]`}
                  />
                  <AnimatePresence>
                    {validationErrors.date && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="date-error" className="text-xs text-red-500 mt-1 font-mono">{validationErrors.date}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label htmlFor="time" className={`text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${focusedField === 'time' ? 'text-[#00F0FF]' : 'text-gray-400'}`}>
                    <Clock className="w-3.5 h-3.5" />_Ciclo Horario (Hora)
                  </label>
                  <input 
                    id="time" required type="time" name="time" value={formData.time} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    className="w-full bg-[#050814]/75 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="topic" className={`text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${focusedField === 'topic' ? 'text-[#00F0FF]' : validationErrors.topic ? 'text-red-500' : 'text-gray-400'}`}>
                  <FileText className="w-3.5 h-3.5" />_Diagnóstico Requerido (Tema)
                </label>
                <textarea 
                  id="topic" required name="topic" value={formData.topic} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} rows={4}
                  aria-invalid={!!validationErrors.topic}
                  aria-describedby={validationErrors.topic ? "topic-error" : undefined}
                  placeholder="Ej: Necesitamos implementar ISO 9001 en nuestra organización o realizar un diagnóstico sistémico integral..."
                  className={`w-full bg-[#050814]/75 border ${validationErrors.topic ? 'border-red-500 bg-red-500/5' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20 transition-all resize-none font-sans`}
                />
                <AnimatePresence>
                  {validationErrors.topic && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="topic-error" className="text-xs text-red-500 mt-1 font-mono">{validationErrors.topic}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-[#00F0FF] to-[#FF007A] text-white py-4.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2 relative overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_35px_rgba(255,0,122,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 cursor-pointer"
              >
                {status === 'submitting' ? (
                  <div className="flex flex-col items-center justify-center py-1">
                    <div className="flex items-center gap-2 text-[#00F0FF]">
                      <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping"></span>
                      <span className="font-mono text-xs uppercase tracking-widest">[TRANSMISIÓN_INICIADA...]</span>
                    </div>
                    <div className="w-48 h-1 bg-white/15 rounded-full overflow-hidden mt-2 relative">
                      <div className="absolute top-0 left-0 bg-[#00F0FF] h-full rounded-full animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                ) : (
                  <span className="font-mono tracking-widest text-xs uppercase flex items-center gap-2.5">
                    <span>[ TRANSMITIR_SOLICITUD_RESERVA ]</span>
                  </span>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
