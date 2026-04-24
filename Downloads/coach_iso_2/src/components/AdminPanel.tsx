import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Mail, Building, FileText, CheckCircle, XCircle, Trash2, Loader2, LogOut, ShieldAlert, Search, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ImageRegistryManager from './ImageRegistryManager';
import ProfileEditor from './ProfileEditor';

interface Consultation {
  id: string;
  name: string;
  email: string;
  company?: string;
  date: string;
  topic: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

export default function AdminPanel() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authChecking, setAuthChecking] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'crm' | 'registry' | 'profile'>('crm');

  // Search and Filter logic
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const navigate = useNavigate();

  const ADMIN_EMAIL = 'safeness.c.a@gmail.com';
  const MOCK_2FA_PIN = '550088';

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        setIs2FAVerified(false);
      }
      setAuthChecking(false);
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin || !is2FAVerified) return;

    try {
      const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Consultation[];
        setConsultations(data);
        setLoading(false);
      }, (error) => {
        console.error("Error al obtener consultas:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [isAdmin, is2FAVerified]);

  const recordAudit = async (action: string, documentId: string, details: string) => {
     try {
       await addDoc(collection(db, 'audit_logs'), {
         action,
         documentId,
         adminEmail: user?.email,
         timestamp: serverTimestamp(),
         details
       });
     } catch(e) {
       console.error("Error logging audit:", e);
     }
  };

  const simulateEmailNotification = async (to: string, subject: string, body: string) => {
     try {
       await addDoc(collection(db, 'mail'), {
         to,
         message: {
           subject,
           html: body
         }
       });
       console.log("Email request queued for: ", to);
     } catch(e) {
       console.error("Error queuing email:", e);
     }
  }

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleStatusChange = async (consultation: Consultation, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const ref = doc(db, 'consultations', consultation.id);
      await updateDoc(ref, { status: newStatus });
      
      // Grabar en Auditoría
      await recordAudit('STATUS_CHANGE', consultation.id, `Status changed from ${consultation.status} to ${newStatus}`);
      
      // Simular notificación por email
      await simulateEmailNotification(
         consultation.email, 
         `Actualización de tu consulta: ${newStatus === 'confirmed' ? 'Confirmada' : 'Cancelada'}`, 
         `<p>Hola ${consultation.name},</p><p>Tu solicitud de consultoría para el ${new Date(consultation.date).toLocaleDateString()} ahora ha sido <strong>${newStatus === 'confirmed' ? 'Confirmada' : 'Cancelada'}</strong>.</p>`
      );
      
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("Hubo un error al actualizar. Recuerda revisar las reglas de Firestore.");
    }
  };

  const handleDelete = async (consultation: Consultation) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
      try {
        await deleteDoc(doc(db, 'consultations', consultation.id));
        await recordAudit('DELETE', consultation.id, `Deleted consultation for ${consultation.name}`);
      } catch (error) {
        console.error("Error eliminando:", error);
      }
    }
  }

  // Filter Data
  const filteredConsultations = useMemo(() => {
    return consultations.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.topic.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [consultations, searchTerm, statusFilter]);

  // Chart Data
  const chartData = useMemo(() => {
    const pending = consultations.filter(c => c.status === 'pending').length;
    const confirmed = consultations.filter(c => c.status === 'confirmed').length;
    const cancelled = consultations.filter(c => c.status === 'cancelled').length;
    return [
      { name: 'Pendientes', value: pending, color: '#EAB308' },
      { name: 'Confirmadas', value: confirmed, color: '#22C55E' },
      { name: 'Canceladas', value: cancelled, color: '#EF4444' }
    ].filter(d => d.value > 0);
  }, [consultations]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="glass p-12 rounded-3xl max-w-sm w-full border border-white/5 space-y-6">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Acceso Restringido</h1>
            <p className="text-gray-400 text-sm">Inicia sesión como administrador para acceder al CRM.</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            Iniciar Sesión con Google
          </button>
          <Link to="/" className="block mt-4 text-xs text-gray-500 hover:text-white transition">Volver a la Web</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="glass p-12 rounded-3xl max-w-sm w-full border border-red-500/20 bg-red-500/5 space-y-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2">No tienes permiso</h1>
            <p className="text-gray-400 text-sm">Tu cuenta de Google ({user.email}) no está autorizada para acceder a este panel.</p>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (!is2FAVerified) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="glass p-12 rounded-3xl max-w-sm w-full border border-white/5 space-y-6">
          <ShieldAlert className="w-16 h-16 text-blue-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Autenticación 2FA</h1>
            <p className="text-gray-400 text-xs">Por razones de seguridad, ingresa tu PIN de Administrador (550088).</p>
          </div>
          <input 
            type="password" 
            placeholder="Introduce el PIN de 6 dígitos"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-center text-2xl tracking-[0.5em] text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            onClick={() => {
              if (pinInput === MOCK_2FA_PIN) setIs2FAVerified(true);
              else alert('PIN Incorrecto');
            }}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            Verificar Identidad
          </button>
          <button onClick={() => auth.signOut()} className="text-xs text-gray-500 hover:text-white mt-4">Cancelar y Salir</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-gray-400">Gestiona tus solicitudes de consultoría</p>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm font-medium">
              Volver a la Web
            </Link>
            <button 
              onClick={() => auth.signOut()}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('crm')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'crm' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            Gestión CRM
          </button>
          <button 
            onClick={() => setActiveTab('registry')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'registry' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            Gestor de Activos ISO
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            Configuración de Perfil
          </button>
        </div>

        {activeTab === 'registry' ? (
          <ImageRegistryManager />
        ) : activeTab === 'profile' ? (
          <ProfileEditor />
        ) : (
          <>
            {/* DASHBOARD SUMMARY (CHARTS & STATS) */}
            {!loading && consultations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
            {/* STATS COL */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Solicitudes</p>
                  <p className="text-4xl font-extrabold text-white">{consultations.length}</p>
                </div>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pendientes</p>
                  <p className="text-4xl font-extrabold text-white">{consultations.filter(c => c.status === 'pending').length}</p>
                </div>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Confirmadas</p>
                  <p className="text-4xl font-extrabold text-white">{consultations.filter(c => c.status === 'confirmed').length}</p>
                </div>
              </div>
            </div>

            {/* CHART COL */}
            <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center h-[200px] lg:h-auto">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider w-full text-center mb-2">Distribución de Estados</p>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CONTROLES BÚSQUEDA Y FILTRO */}
        {!loading && consultations.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar por nombre, email o asunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : consultations.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center border border-white/5">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No hay solicitudes aún</h3>
            <p className="text-gray-400">Las nuevas reservas de consultoría aparecerán aquí.</p>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center border border-white/5">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
            <p className="text-gray-400">Intenta ajustar tu búsqueda o filtros.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredConsultations.map((consultation, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={consultation.id} 
                className="glass p-6 rounded-2xl border border-white/5 flex flex-col lg:flex-row gap-6 relative overflow-hidden"
              >
                {/* Indicador de estado lateral */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  consultation.status === 'pending' ? 'bg-yellow-500' :
                  consultation.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pl-2">
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Cliente</p>
                    <p className="font-bold flex items-center gap-2"><User className="w-4 h-4 text-gray-400"/> {consultation.name}</p>
                    {consultation.company && (
                      <p className="text-sm text-gray-400 flex items-center gap-2"><Building className="w-4 h-4"/> {consultation.company}</p>
                    )}
                    <a href={`mailto:${consultation.email}`} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2">
                      <Mail className="w-4 h-4"/> {consultation.email}
                    </a>
                  </div>

                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Fecha Solicitada</p>
                    <div className="bg-white/5 rounded-lg p-3 inline-block">
                      <p className="font-mono font-bold text-lg text-white">
                        {new Date(consultation.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        {new Date(consultation.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 lg:col-span-2 mt-2">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Motivo de la consulta</p>
                    <div className="bg-black/40 rounded-lg p-4 border border-white/5 h-full">
                      <p className="flex items-start gap-2 text-sm text-gray-300">
                        <FileText className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" />
                        {consultation.topic}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-center lg:justify-center gap-3 lg:border-l lg:border-white/10 lg:pl-6">
                  {consultation.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(consultation, 'confirmed')}
                        className="flex-1 lg:w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Aprobar
                      </button>
                      <button 
                        onClick={() => handleStatusChange(consultation, 'cancelled')}
                        className="flex-1 lg:w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Rechazar
                      </button>
                    </>
                  )}
                  {consultation.status === 'confirmed' && (
                    <div className="flex-1 lg:w-full bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-semibold text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Confirmado
                    </div>
                  )}
                  {consultation.status === 'cancelled' && (
                    <div className="flex-1 lg:w-full bg-gray-500/10 text-gray-400 border border-gray-500/20 px-4 py-2 rounded-lg text-sm font-semibold text-center flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" /> Rechazado
                    </div>
                  )}
                  <button 
                    onClick={() => handleDelete(consultation)}
                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition lg:mt-2"
                    title="Eliminar registro"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
