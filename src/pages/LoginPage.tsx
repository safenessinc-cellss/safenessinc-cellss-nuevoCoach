import React, { useState } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2, Chrome, Clock, ShieldX } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { loginWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const isPending = params.get('pending') === '1';
  const isBlocked = params.get('blocked') === '1';
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError('Inicio de sesión cancelado.');
      } else {
        setError(err?.message || 'Error al iniciar sesión con Google.');
      }
    } finally { setIsLoggingIn(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white relative font-sans">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-600/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 blur-3xl rounded-full"></div>
      <div className="relative z-10 max-w-md w-full glass p-8 rounded-3xl border border-white/10 space-y-8 shadow-2xl overflow-hidden bg-black/60 backdrop-blur-md">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-amber-500 to-blue-600"></div>
        <div className="text-center space-y-3">
          <div className="mx-auto flex justify-center"><img src="/coach-iso-globe.png" alt="COACH ISO" className="brand-globe-spin h-16 w-16 rounded-2xl shadow-lg" /></div>
          <div>
            <p className="text-[10px] font-bold tracking-[.24em] text-emerald-200">COACH ISO · CONSULTORÍA</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Acceso Privado</h1>
            <p className="text-gray-400 text-xs mt-1">Sistemas de Gestión ISO | Liderazgo y Coaching Estratégico</p>
          </div>
        </div>

        {isBlocked && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2">
            <ShieldX className="w-4 h-4 shrink-0" />
            <span>Tu cuenta está suspendida. Contacta al administrador.</span>
          </div>
        )}
        {isPending && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Tu cuenta está <b>pendiente de aprobación</b>. El Super Administrador debe autorizarte antes de acceder.</span>
          </div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" /><span>{error}</span>
          </motion.div>
        )}

        <button type="button" disabled={isLoggingIn || authLoading} onClick={handleGoogleLogin}
          className="w-full bg-[#050814]/80 border border-[#00F0FF]/30 hover:bg-[#00F0FF]/15 hover:border-[#00F0FF] text-white py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all text-xs uppercase font-mono tracking-wider cursor-pointer disabled:opacity-50">
          {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Chrome className="w-4.5 h-4.5 text-[#00F0FF]" /> Acceder con Google</>}
        </button>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-gray-500 hover:text-white transition inline-block">← Volver al Portal</Link>
        </div>
      </div>
    </div>
  );
}
