import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfileSettings } from '../data/useProfileSettings';
import { ShieldAlert, Mail, Lock, Loader2, ArrowRight, Chrome } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const { profile } = useProfileSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('safeness.c.a@gmail.com');
  const [password, setPassword] = useState('Mustafa@5500');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirection target after successful login (defaults to /admin)
  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError('Inicio de sesión cancelado por el usuario.');
      } else {
        setError(err?.message || 'Error al iniciar sesión con Google.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white relative font-sans">
      {/* Decorative ambient spots */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-600/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-md w-full glass p-8 rounded-3xl border border-white/10 space-y-8 shadow-2xl relative overflow-hidden bg-black/60 backdrop-blur-md">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-amber-500 to-blue-600"></div>
        
        {/* Branding header in Login */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex justify-center">
            {profile.logoUrl ? (
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 p-1 bg-white/5 shadow-inner">
                <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Acceso Privado</h1>
            <p className="text-gray-400 text-xs mt-1">Sistemas de Gestión ISO | Liderazgo y Coaching Estratégico</p>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><Mail className="w-4 h-4" /></span>
              <input 
                type="email" 
                required
                placeholder="ejemplo@teran.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-red-600 focus:bg-white/[0.05] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Contraseña</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><Lock className="w-4 h-4" /></span>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-red-600 focus:bg-white/[0.05] transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-white text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all text-xs uppercase tracking-wider cursor-pointer shadow-lg disabled:opacity-50 font-mono"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Ingresar al Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-[10px] uppercase font-mono tracking-widest">[ O ]</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button 
          type="button"
          disabled={isLoggingIn}
          onClick={handleGoogleLogin}
          className="w-full bg-[#050814]/80 border border-[#00F0FF]/30 hover:bg-[#00F0FF]/15 hover:border-[#00F0FF] text-white py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all text-xs uppercase font-mono tracking-wider cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.05)] active:scale-95"
        >
          <Chrome className="w-4.5 h-4.5 text-[#00F0FF]" />
          Acceso con Google
        </button>



        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-gray-500 hover:text-white transition inline-block">
            ← Volver al Portal de Robert Terán
          </Link>
        </div>
      </div>
    </div>
  );
}
