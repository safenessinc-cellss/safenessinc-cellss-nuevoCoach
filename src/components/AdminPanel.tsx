import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, query, orderBy, onSnapshot, doc, 
  setDoc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDoc 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { 
  onAuthStateChanged, signInWithPopup, signInWithRedirect, 
  GoogleAuthProvider, signOut, User as FirebaseUser 
} from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, Clock, User, Mail, Building, FileText, 
  CheckCircle, XCircle, Trash2, Loader2, LogOut, ShieldAlert, 
  Search, Filter, GraduationCap, BookOpen, MapPin, Video, Users, 
  Settings, Layers, Plus, Edit2, Copy, ExternalLink, CalendarDays, 
  ChevronLeft, ChevronRight, UploadCloud, Info, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { Course, Book, Visit, Tutorial, UserProfile, UserRole } from '../types';
import ImageRegistryManager from './ImageRegistryManager';
import ProfileEditor from './ProfileEditor';

// Operation Types for Audit and Errors
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    providerInfo?: any[];
  }
}

// Global Custom Error Handler following SDK Guidelines
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData?.map(p => ({
        providerId: p.providerId,
        email: p.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Hardened Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function AdminPanel() {
  const navigate = useNavigate();

  // Authentication & Role State from central AuthContext
  const { currentUser, logout: performContextLogout, loading: authChecking } = useAuth();
  
  // Active Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'books' | 'visits' | 'tutorials' | 'users' | 'registry' | 'profile'>('dashboard');

  // Domain Collections States
  const [courses, setCourses] = useState<Course[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);

  // Loading indicator states
  const [loadingStates, setLoadingStates] = useState({
    courses: true,
    books: true,
    visits: true,
    tutorials: true,
    users: true,
    consultations: true
  });

  // Pin & Account Bypass Simulation Mode
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState<UserRole | null>(null);

  const ADMIN_EMAIL = 'safeness.c.a@gmail.com';
  const MOCK_2FA_PIN = '550088';

  // --- Search and Filters States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // --- Modals Form States ---
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form Fields State
  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    title: '', description: '', duration: 10, level: 'Básico',
    price: 99, imageUrl: '', status: 'Activo', materials: []
  });

  const [bookForm, setBookForm] = useState<Partial<Book>>({
    title: '', author: '', category: 'ISO 9001', year: 2026,
    coverUrl: '', pdfUrl: '', downloadsCount: 0
  });

  const [visitForm, setVisitForm] = useState<Partial<Visit>>({
    clientName: '', company: '', date: '', time: '',
    address: '', status: 'pending', notes: ''
  });

  const [tutorialForm, setTutorialForm] = useState<Partial<Tutorial>>({
    studentName: '', email: '', date: '', time: '', duration: 60,
    platform: 'Zoom', link: '', topic: '', subtype: 'Técnica', status: 'pending', sendInvitation: true
  });

  const [userForm, setUserForm] = useState<Partial<UserProfile>>({
    email: '', name: '', role: 'viewer'
  });

  // --- Interactive Calendar State ---
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  // Enforce mandatory login gate redirection
  useEffect(() => {
    if (!authChecking && !currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, authChecking, navigate]);

  // Derive role properties
  const user = currentUser;
  const currentUserRole: UserRole = currentUser?.role || 'viewer';
  const isAdmin = currentUser?.role === 'admin';
  const is2FAVerified = true;

  // Compute permissions
  const activeRole = isSimulationMode && simulatedRole ? simulatedRole : currentUserRole;
  const canEdit = activeRole === 'admin' || activeRole === 'editor';
  const hasAdminRights = activeRole === 'admin';

  // Real-time queries for all entities
  useEffect(() => {
    if (!user && !isSimulationMode) return;

    // 1. Courses Subscription
    const unsubCourses = onSnapshot(collection(db, 'courses'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Course);
      setCourses(data);
      setLoadingStates(prev => ({ ...prev, courses: false }));
    }, (err) => {
      console.warn("Error courses snapshot. Falling back.");
      setLoadingStates(prev => ({ ...prev, courses: false }));
    });

    // 2. Books Subscription
    const unsubBooks = onSnapshot(collection(db, 'books'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Book);
      setBooks(data);
      setLoadingStates(prev => ({ ...prev, books: false }));
    }, (err) => {
      console.warn("Error books snapshot.");
      setLoadingStates(prev => ({ ...prev, books: false }));
    });

    // 3. Visits Subscription
    const unsubVisits = onSnapshot(collection(db, 'visits'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Visit);
      setVisits(data);
      setLoadingStates(prev => ({ ...prev, visits: false }));
    }, (err) => {
      console.warn("Error visits snapshot.");
      setLoadingStates(prev => ({ ...prev, visits: false }));
    });

    // 4. Tutorials Subscription
    const unsubTutorials = onSnapshot(collection(db, 'tutorials'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Tutorial);
      setTutorials(data);
      setLoadingStates(prev => ({ ...prev, tutorials: false }));
    }, (err) => {
      console.warn("Error tutorials snapshot.");
      setLoadingStates(prev => ({ ...prev, tutorials: false }));
    });

    // 5. Team Users Subscription
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }) as UserProfile);
      setUsersList(data);
      setLoadingStates(prev => ({ ...prev, users: false }));
    }, (err) => {
      console.warn("Error users snapshot.");
      setLoadingStates(prev => ({ ...prev, users: false }));
    });

    // 6. Legacy Consultations Subscription for KPI correlation
    const unsubConsultations = onSnapshot(collection(db, 'consultations'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setConsultations(data);
      setLoadingStates(prev => ({ ...prev, consultations: false }));
    }, (err) => {
      console.warn("Error consultations snapshot.");
      setLoadingStates(prev => ({ ...prev, consultations: false }));
    });

    return () => {
      unsubCourses();
      unsubBooks();
      unsubVisits();
      unsubTutorials();
      unsubUsers();
      unsubConsultations();
    };
  }, [user, isSimulationMode]);



  const handleLogoutClick = async () => {
    setIsSimulationMode(false);
    setSimulatedRole(null);
    performContextLogout();
    navigate('/login');
  };

  // Preload / Seed representative dataset for Robert ("Script de datos de ejemplo")
  const seedDemoData = async () => {
    if (!canEdit) {
      alert("No posees permisos de Editor/Admin para precargar datos.");
      return;
    }
    const confirmSeed = window.confirm("¿Seguro que deseas precargar los datos de prueba preestablecidos?");
    if (!confirmSeed) return;

    try {
      // 1. Seed Courses
      const demoCourses: Partial<Course>[] = [
        {
          title: "Sistemas de Gestión de Calidad ISO 9001:2015",
          description: "Domina la estructuración de procesos, auditorías internas y alineación de estrategias según la norma insignia global.",
          duration: 40,
          level: "Intermedio",
          price: 199,
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
          status: "Activo",
          materials: ["guia-9001-pdf"]
        },
        {
          title: "Seguridad de la Información ISO 27001",
          description: "Fundamentos teóricos para estructurar un SGSI sólido, evaluar riesgos informáticos y proteger activos corporativos.",
          duration: 32,
          level: "Avanzado",
          price: 249,
          imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
          status: "Activo",
          materials: ["seguridad-27001-pdf"]
        },
        {
          title: "Coaching de Liderazgo Estratégico",
          description: "Metodología basada en la excelencia sobre coaching gerencial para directores de calidad.",
          duration: 24,
          level: "Básico",
          price: 149,
          imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
          status: "Activo",
          materials: ["coaching-liderazgo-pdf"]
        }
      ];

      for (const course of demoCourses) {
        await addDoc(collection(db, 'courses'), course);
      }

      // 2. Seed Books
      const demoBooks: Partial<Book>[] = [
        {
          title: "Guía Práctica de Auditoría Líder ISO 9001",
          author: "Robert Terán",
          category: "ISO 9001",
          year: 2025,
          coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=405&auto=format&fit=crop",
          pdfUrl: "https://static.googleusercontent.com/media/www.google.com/en//intl/es-419/about/editorial/searchqualityevaluatorguidelines.pdf",
          downloadsCount: 145
        },
        {
          title: "Estructuración de Procesos para PYMEs",
          author: "Robert Terán",
          category: "ISO 27001",
          year: 2024,
          coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=400&auto=format&fit=crop",
          pdfUrl: "https://static.googleusercontent.com/media/www.google.com/en//intl/es-419/about/editorial/searchqualityevaluatorguidelines.pdf",
          downloadsCount: 88
        },
        {
          title: "Coaching Ejecutivo: El método IBM 2025",
          author: "Robert Terán",
          category: "Coaching",
          year: 2025,
          coverUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=400&auto=format&fit=crop",
          pdfUrl: "https://static.googleusercontent.com/media/www.google.com/en//intl/es-419/about/editorial/searchqualityevaluatorguidelines.pdf",
          downloadsCount: 204
        }
      ];

      for (const book of demoBooks) {
        await addDoc(collection(db, 'books'), book);
      }

      // 3. Seed Visits (Next months)
      const now = new Date();
      const formatDateStr = (daysAhead: number) => {
        const d = new Date();
        d.setDate(now.getDate() + daysAhead);
        return d.toISOString().split('T')[0];
      };

      const demoVisits: Partial<Visit>[] = [
        {
          clientName: "Consorcio Logístico Americano",
          company: "Alianza S.A.",
          date: formatDateStr(3),
          time: "09:00",
          address: "Av. Libertador 1450, Piso 5, Buenos Aires",
          status: "pending",
          notes: "Auditoría de pre-certificación del almacén logístico central."
        },
        {
          clientName: "Dra. Sofía Martínez",
          company: "MedTech Solutions",
          date: formatDateStr(7),
          time: "14:30",
          address: "Sede Corporativa Puerto Madero, Of. 302",
          status: "pending",
          notes: "Seguimiento ISO 27001 para la plataforma de telemedicina."
        },
        {
          clientName: "Ing. Alejandro Gómez",
          company: "PetroSur Corp",
          date: formatDateStr(-2),
          time: "10:00",
          address: "Planta de Refinería Luján",
          status: "completed",
          notes: "Auditoría del Sistema de Gestión Ambiental."
        }
      ];

      for (const visit of demoVisits) {
        const path = 'visits';
        try {
          await addDoc(collection(db, path), { ...visit, createdAt: serverTimestamp() });
        } catch(e) {
          handleFirestoreError(e, OperationType.WRITE, path);
        }
      }

      // 4. Seed Tutorials
      const demoTutorials: Partial<Tutorial>[] = [
        {
          studentName: "Carlos Pérez",
          email: "carlos.perez@example.com",
          date: formatDateStr(1),
          time: "17:00",
          duration: 45,
          platform: "Meet",
          link: "https://meet.google.com/abc-defg-hij",
          topic: "Revisión cláusula 8.5 de ISO 9001 (Producción)",
          status: "pending",
          sendInvitation: true,
          createdAt: new Date().toISOString()
        },
        {
          studentName: "Mariana Silva",
          email: "mariana.silva@example.com",
          date: formatDateStr(5),
          time: "10:30",
          duration: 60,
          platform: "Zoom",
          link: "https://zoom.us/j/9876543210",
          topic: "Estructurando matriz de riesgos ISO 27001",
          status: "confirmed",
          sendInvitation: true,
          createdAt: new Date().toISOString()
        }
      ];

      for (const tutorial of demoTutorials) {
        await addDoc(collection(db, 'tutorials'), tutorial);
      }

      // 5. Seed simulated users
      const demoUsers: Partial<UserProfile>[] = [
        {
          name: "Lucas Ferreira (Consultor)",
          email: "lucas.editor@gmail.com",
          role: "editor",
          createdAt: new Date().toISOString()
        },
        {
          name: "Ing. Clara Ramos (Auditor Junior)",
          email: "clara.view@gmail.com",
          role: "viewer",
          createdAt: new Date().toISOString()
        }
      ];

      for (const u of demoUsers) {
        await addDoc(collection(db, 'users'), u);
      }

      alert("¡Éxito! Datos corporativos de Robert Terán cargados correctamente en Firestore.");
    } catch (err) {
      console.error(err);
      alert("Error al cargar datos demo: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // --- CRUD Course Handlers ---
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return alert("Acceso denegado: solo editores o administradores.");

    try {
      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), courseForm);
        alert("Curso actualizado con éxito");
      } else {
        await addDoc(collection(db, 'courses'), courseForm);
        alert("Curso creado con éxito");
      }
      setIsCourseModalOpen(false);
      setEditingCourse(null);
      setCourseForm({
        title: '', description: '', duration: 10, level: 'Básico',
        price: 99, imageUrl: '', status: 'Activo', materials: []
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'courses');
    }
  };

  const handleDuplicateCourse = async (course: Course) => {
    if (!canEdit) return alert("Habilitación restringida de edición");
    try {
      const duplicated: Partial<Course> = {
        ...course,
        title: `${course.title} (Copia)`
      };
      // Delete ID from duplication
      delete (duplicated as any).id;
      await addDoc(collection(db, 'courses'), duplicated);
      alert("Curso duplicado correctamente.");
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'courses');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!canEdit) return alert("Sin privilegios de eliminación.");
    if (window.confirm("¿Seguro de eliminar este curso?")) {
      try {
        await deleteDoc(doc(db, 'courses', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `courses/${id}`);
      }
    }
  };

  // --- CRUD Book Handlers ---
  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return alert("Acceso denegado");
    try {
      if (editingBook) {
        await updateDoc(doc(db, 'books', editingBook.id), bookForm);
        alert("Recurso bibliográfico actualizado");
      } else {
        await addDoc(collection(db, 'books'), { ...bookForm, downloadsCount: 0 });
        alert("Recurso bibliográfico añadido");
      }
      setIsBookModalOpen(false);
      setEditingBook(null);
      setBookForm({
        title: '', author: '', category: 'ISO 9001', year: 2026,
        coverUrl: '', pdfUrl: '', downloadsCount: 0
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'books');
    }
  };

  const handleDuplicateBook = async (book: Book) => {
    if (!canEdit) return;
    try {
      const duplicated = { ...book, title: `${book.title} (Copia)`, downloadsCount: 0 };
      delete (duplicated as any).id;
      await addDoc(collection(db, 'books'), duplicated);
      alert("Recurso duplicado correctamente.");
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'books');
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!canEdit) return;
    if (window.confirm("¿Confirmas eliminar este libro/recurso?")) {
      try {
        await deleteDoc(doc(db, 'books', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `books/${id}`);
      }
    }
  };

  // --- CRUD Visit Handlers ---
  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    try {
      if (editingVisit) {
        await updateDoc(doc(db, 'visits', editingVisit.id), visitForm);
        alert("Visita agendada re-programada con éxito");
      } else {
        await addDoc(collection(db, 'visits'), {
          ...visitForm,
          createdAt: new Date().toISOString()
        });
        alert("Nueva visita onsite agendada con éxito");
      }
      setIsVisitModalOpen(false);
      setEditingVisit(null);
      setVisitForm({
        clientName: '', company: '', date: '', time: '',
        address: '', status: 'pending', notes: ''
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'visits');
    }
  };

  const handleDeleteVisit = async (id: string) => {
    if (!canEdit) return;
    if (window.confirm("¿Deseas desprogramar/eliminar esta visita presencial?")) {
      try {
        await deleteDoc(doc(db, 'visits', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `visits/${id}`);
      }
    }
  };

  // --- CRUD Tutorial Handlers ---
  const handleTutorialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    try {
      if (editingTutorial) {
        await updateDoc(doc(db, 'tutorials', editingTutorial.id), tutorialForm);
        alert("Tutoría telemática actualizada");
      } else {
        await addDoc(collection(db, 'tutorials'), {
          ...tutorialForm,
          createdAt: new Date().toISOString()
        });
        // Simulate google calendar integration alert
        if (tutorialForm.sendInvitation) {
          alert(`Invitación de Google Calendar y enlace ${tutorialForm.platform} enviada automáticamente a ${tutorialForm.studentEmail}`);
        }
        alert("Nueva tutoría online agendada con éxito");
      }
      setIsTutorialModalOpen(false);
      setEditingTutorial(null);
      setTutorialForm({
        studentName: '', email: '', date: '', time: '', duration: 60,
        platform: 'Zoom', link: '', topic: '', subtype: 'Técnica', status: 'pending', sendInvitation: true
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'tutorials');
    }
  };

  const handleDeleteTutorial = async (id: string) => {
    if (!canEdit) return;
    if (window.confirm("¿Seguro que deseas eliminar esta tutoría?")) {
      try {
        await deleteDoc(doc(db, 'tutorials', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `tutorials/${id}`);
      }
    }
  };

  // --- Teams User Management CRUD ---
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAdminRights) return alert("Operación exclusiva de Administradores");
    if (!userForm.email) return alert("Introduce un correo válido");
    
    try {
      // Use email lower as ID or random
      const userMail = userForm.email.trim().toLowerCase();
      const fakeId = userMail.replace(/[^a-zA-Z0-9]/g, "_");
      
      await setDoc(doc(db, 'users', fakeId), {
        email: userMail,
        name: userForm.name || "Colaborador",
        role: userForm.role || "viewer",
        createdAt: new Date().toISOString()
      });

      alert("Colaborador registrado/actualizado éxitosamente");
      setIsUserModalOpen(false);
      setUserForm({ email: '', name: '', role: 'viewer' });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'users');
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!hasAdminRights) return alert("Se requieren privilegios de Administrador");
    if (email === ADMIN_EMAIL) return alert("No se puede eliminar el superadministrador principal.");
    
    if (window.confirm(`¿Deseas revocar el acceso para ${email}?`)) {
      try {
        await deleteDoc(doc(db, 'users', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `users/${id}`);
      }
    }
  };

  // --- KPI Calculus & Recharts logic ---
  const kpis = useMemo(() => {
    const activeC = courses.filter(c => c.status === 'Activo').length;
    const countBooks = books.length;
    const upcomingV = visits.filter(v => v.status === 'pending').length;
    const pendingT = tutorials.filter(t => t.status === 'pending').length;
    return { activeC, countBooks, upcomingV, pendingT };
  }, [courses, books, visits, tutorials]);

  // Visits by month (aggregated list of past 6 months)
  const visitsChartData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const counts = Array(12).fill(0);
    
    visits.forEach(v => {
      if (v.date) {
        const mIdx = new Date(v.date).getMonth();
        if (!isNaN(mIdx)) counts[mIdx]++;
      }
    });

    return months.map((m, idx) => ({
      name: m,
      visitas: counts[idx] || (idx === 4 ? 4 : idx === 3 ? 2 : 0) // fallback mock layout if clean db
    })).slice(0, 7); // Show active first half
  }, [visits]);

  // Downloads by resource top bar chart
  const downloadsChartData = useMemo(() => {
    return books
      .map(b => ({ name: b.title.slice(0, 20) + '...', descargas: b.downloadsCount || 0 }))
      .sort((a, b) => b.descargas - a.descargas)
      .slice(0, 4);
  }, [books]);

  // Aggregate combined activities sorted chronologically for the timeline
  const nextActivities = useMemo(() => {
    const combined: any[] = [];
    visits.forEach(v => {
      combined.push({
        type: 'Onsite Visit',
        title: `Visita ${v.company}`,
        subtitle: v.clientName,
        date: v.date,
        time: v.time,
        status: v.status,
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      });
    });
    tutorials.forEach(t => {
      combined.push({
        type: 'Online Tutoring',
        title: `Tutoría: ${t.studentName}`,
        subtitle: t.topic,
        date: t.date,
        time: t.time,
        status: t.status,
        color: 'bg-teal-500/20 text-teal-400 border-teal-500/30'
      });
    });

    return combined
      .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime())
      .filter(act => new Date(act.date) >= new Date(new Date().setHours(0,0,0,0))) // future or today only
      .slice(0, 10);
  }, [visits, tutorials]);

  // --- Simple Calendar Calculation ---
  const daysInMonth = getDaysInMonth(calendarDate.getFullYear(), calendarDate.getMonth());
  const firstDayIndex = getFirstDayOfMonth(calendarDate.getFullYear(), calendarDate.getMonth());

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  const calendarEvents = useMemo(() => {
    const events: { [key: number]: any[] } = {};
    const extractDay = (dateStr: string) => {
      if (!dateStr) return null;
      const d = new Date(dateStr + "T12:00:00"); // avoid timezone offsets
      if (d.getMonth() === calendarDate.getMonth() && d.getFullYear() === calendarDate.getFullYear()) {
        return d.getDate();
      }
      return null;
    };

    visits.forEach(v => {
      const day = extractDay(v.date);
      if (day) {
        if (!events[day]) events[day] = [];
        events[day].push({ ...v, labelType: 'Visita', color: 'bg-blue-500' });
      }
    });

    tutorials.forEach(t => {
      const day = extractDay(t.date);
      if (day) {
        if (!events[day]) events[day] = [];
        events[day].push({ ...t, labelType: 'Tutoría', color: 'bg-teal-500' });
      }
    });

    return events;
  }, [visits, tutorials, calendarDate]);

  const changeMonth = (val: number) => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + val, 1));
    setSelectedCalendarDay(null);
  };

  const incrementDownload = async (book: Book) => {
    try {
      await updateDoc(doc(db, 'books', book.id), {
        downloadsCount: (book.downloadsCount || 0) + 1
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Filters calculation
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'all' || b.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [books, searchTerm, categoryFilter]);

  // Loading Shield logic
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
        <p className="text-gray-400 font-mono text-sm">Validando credenciales seguras de Auditor...</p>
      </div>
    );
  }

  // Auth gate redirection fallback
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
        <p className="text-gray-400 font-mono text-sm">Redirigiendo al panel de acceso seguro...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans selection:bg-red-500/30">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0">
        
        {/* Profile Card / Brand */}
        <div className="p-6 border-b border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-red-500/20 bg-black/40 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=250&auto=format&fit=crop" 
                alt="Robert Teran" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-[14px] truncate">Robert Terán</p>
              <p className="text-[10px] text-gray-400 font-mono">Especialista en SGI & Procesos</p>
            </div>
          </div>

          <div className="bg-white/5 px-2.5 py-1 rounded-md flex items-center justify-between text-[10px] font-mono">
            <span className="text-gray-500 uppercase">Rol Actual:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded uppercase ${
              activeRole === 'admin' ? 'text-red-400 bg-red-500/10' :
              activeRole === 'editor' ? 'text-yellow-400 bg-yellow-500/10' :
              'text-blue-400 bg-blue-500/10'
            }`}>{activeRole}</span>
          </div>

          {isSimulationMode && (
            <div className="text-[10px] text-yellow-500/80 bg-yellow-500/5 p-1.5 rounded border border-yellow-500/10 font-mono">
              🚧 Modo simulación local activo
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: Layers },
            { id: 'courses', name: 'Cursos', icon: GraduationCap },
            { id: 'books', name: 'Libros y PDF', icon: BookOpen },
            { id: 'visits', name: 'Visitas Onsite', icon: MapPin },
            { id: 'tutorials', name: 'Tutorías Online', icon: Video },
            { id: 'users', name: 'Gestión Usuarios', icon: Users },
            { id: 'registry', name: 'Activos ISO', icon: CabinetIconPlaceholder },
            { id: 'profile', name: 'Perfil Público', icon: Settings }
          ].map((item) => {
            const Icon = item.icon as any;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-tab-${item.id}`}
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/15 font-bold' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Seed Data Utilities Area for Editor/Admins */}
        {canEdit && (
          <div className="p-4 border-t border-white/5 bg-black/20 space-y-2">
            <p className="text-[10px] font-mono text-gray-500">UTILIDADES DEMO</p>
            <button 
              onClick={seedDemoData}
              className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-medium py-2 px-3 rounded-lg flex items-center gap-2 transition"
            >
              <UploadCloud className="w-4.5 h-4.5 text-red-500" />
              Recargar Datos de Prueba
            </button>
          </div>
        )}

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-white/5 flex gap-2">
          <Link 
            to="/" 
            className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] font-medium border border-white/5 transition"
          >
            Ir a la Web
          </Link>
          <button 
            onClick={handleLogoutClick}
            className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition"
            title="Cerrar sesión"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKING STAGE */}
      <main className="flex-1 bg-[#050505] p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {activeTab === 'dashboard' && 'Panel General y Analytics'}
              {activeTab === 'courses' && 'Gestión de Cursos'}
              {activeTab === 'books' && 'Librería Digital & PDFs'}
              {activeTab === 'visits' && 'Agenda de Visitas Presenciales'}
              {activeTab === 'tutorials' && 'Agenda de Tutorías Online'}
              {activeTab === 'users' && 'Colaboradores y Permisos'}
              {activeTab === 'registry' && 'Gestor de Activos ISO'}
              {activeTab === 'profile' && 'Configuración del Consultor'}
            </h2>
            <p className="text-sm text-gray-400">
              {activeTab === 'dashboard' && 'Rendimiento general y próximas actividades.'}
              {activeTab === 'courses' && 'Administración de programas educativos presenciales y digitales.'}
              {activeTab === 'books' && 'Gestor de libros técnicos, descargables e indicadores.'}
              {activeTab === 'visits' && 'Planificación semanal de auditorías físicas en plantas de clientes.'}
              {activeTab === 'tutorials' && 'Coaching telemático con enlaces automatizados de Zoom y Meet.'}
              {activeTab === 'users' && 'Control de accesos y roles (Admin, Editor y Viewer).'}
              {activeTab === 'registry' && 'Subidas y organización integrada de diagramas de cumplimiento.'}
              {activeTab === 'profile' && 'Modificar información pública, logo y testimonios.'}
            </p>
          </div>

          {/* Quick permissions state indicator */}
          <div className="flex items-center gap-3">
            {!hasAdminRights && (
              <span className="text-[11px] font-mono text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                Modo lectura (Viewer/Editor)
              </span>
            )}
            {activeTab !== 'dashboard' && activeTab !== 'registry' && activeTab !== 'profile' && activeTab !== 'users' && canEdit && (
              <button 
                onClick={() => {
                  if (activeTab === 'courses') { setEditingCourse(null); setIsCourseModalOpen(true); }
                  if (activeTab === 'books') { setEditingBook(null); setIsBookModalOpen(true); }
                  if (activeTab === 'visits') { setEditingVisit(null); setIsVisitModalOpen(true); }
                  if (activeTab === 'tutorials') { setEditingTutorial(null); setIsTutorialModalOpen(true); }
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition tracking-wider uppercase cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4 text-white" />
                Añadir Registro
              </button>
            )}
            {activeTab === 'users' && hasAdminRights && (
              <button 
                onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition tracking-wider uppercase cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                Añadir Colaborador
              </button>
            )}
          </div>
        </div>

        {/* --- DYNAMIC TAB VIEWS IMPLEMENTATION --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
          >
            
            {/* =======================================================
                T1: DASHBOARD GENERAL
                ======================================================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-10">
                
                {/* A. KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* KPI 1 */}
                  <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-red-500/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                      <GraduationCap className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Cursos Activos</p>
                      <p className="text-3xl font-extrabold text-white mt-1">{kpis.activeC}</p>
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-yellow-500/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                      <BookOpen className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Libros & Recursos</p>
                      <p className="text-3xl font-extrabold text-white mt-1">{kpis.countBooks}</p>
                    </div>
                  </div>

                  {/* KPI 3 */}
                  <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-blue-500/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <MapPin className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Visitas del Mes</p>
                      <p className="text-3xl font-extrabold text-white mt-1">{kpis.upcomingV}</p>
                    </div>
                  </div>

                  {/* KPI 4 */}
                  <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-teal-500/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                      <Video className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tutorías Pendientes</p>
                      <p className="text-3xl font-extrabold text-white mt-1">{kpis.pendingT}</p>
                    </div>
                  </div>

                </div>

                {/* B. ANALYTICS GRAPHS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Visitas onsite por mes */}
                  <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                    <div>
                      <h4 className="text-base font-bold tracking-tight text-white mb-1">Tendencia de Visitas Onsite</h4>
                      <p className="text-xs text-gray-400">Total auditorías físicas programadas por mes en este semestre.</p>
                    </div>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={visitsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="visitasGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                          <XAxis dataKey="name" stroke="#555" fontSize={11} tickLine={false} />
                          <YAxis stroke="#555" fontSize={11} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="visitas" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#visitasGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Descargas BarChart */}
                  <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                    <div>
                      <h4 className="text-base font-bold tracking-tight text-white mb-1">Top Libros más Descargados</h4>
                      <p className="text-xs text-gray-400">Recursos de Auditoría ISO con mayor número de interacciones.</p>
                    </div>
                    <div className="h-[240px]">
                      {downloadsChartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-500 font-mono text-xs">Carga libros técnicos para visualizar descargas.</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                          <BarChart data={downloadsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                            <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} />
                            <YAxis stroke="#555" fontSize={11} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px' }} />
                            <Bar dataKey="descargas" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={25} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                </div>

                {/* C. TIMELINE & COMBINED ACTIVITIES GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Proximas Actividades List */}
                  <div className="lg:col-span-2 glass p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center bg-black/40 p-1 rounded-xl">
                      <h4 className="text-sm font-bold text-white px-3">Próximas Actividades de Consulta</h4>
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Orden Cronológico</span>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {nextActivities.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 text-xs">
                          <CalendarIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          No hay visitas ni tutorías programadas para esta semana.
                        </div>
                      ) : (
                        nextActivities.map((act, index) => (
                          <div 
                            key={`next-act-${act.title || index}-${index}`} 
                            className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4 hover:bg-zinc-900/80 transition"
                          >
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1 border ${act.color}`}>
                                {act.type === 'Onsite Visit' ? '🏢 Visita' : '💻 Tutoría'}
                              </span>
                              <div>
                                <p className="text-xs font-bold text-white">{act.title}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{act.subtitle}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-mono text-xs text-white uppercase font-semibold">
                                {new Date(act.date + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                              </p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1 justify-end mt-0.5">
                                <Clock className="w-3 h-3 text-red-500" /> {act.time}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Top 3 Libros Descargados Side Column */}
                  <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                    <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2">Destacados ISO de Robert</h4>
                    <div className="space-y-4">
                      {books.sort((a,b) => b.downloadsCount - a.downloadsCount).slice(0, 3).map((b, idx) => (
                        <div key={b.id} className="flex gap-3 items-center">
                          <div className="w-10 h-14 bg-zinc-800 rounded overflow-hidden shadow shrink-0">
                            <img src={b.coverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=150"} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-xs truncate text-white">{b.title}</h5>
                            <p className="text-[10px] text-gray-400 truncate">{b.category} • {b.author}</p>
                            <p className="text-[10px] text-green-400 font-mono font-semibold mt-1">📥 {b.downloadsCount || 0} descargas</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* =======================================================
                T2: CURSOS MANAGEMENT
                ======================================================= */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                
                {/* Search Header */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Buscar cursos por título o clasificación..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div className="relative shrink-0">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer min-w-[150px]"
                    >
                      <option value="all">Filtro Estado</option>
                      <option value="Activo">Solo Activos</option>
                      <option value="Inactivo">Inactivos</option>
                    </select>
                  </div>
                </div>

                {/* Courses Card Grid */}
                {loadingStates.courses ? (
                  <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>
                ) : filteredCourses.length === 0 ? (
                  <div className="glass p-12 rounded-3xl text-center border border-white/5">
                    <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No se encontraron cursos</h3>
                    <p className="text-gray-400">Intenta cambiar los filtros de búsqueda o agrega un nuevo curso gerencial.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((c) => (
                      <div key={c.id} className="glass rounded-2xl border border-white/5 overflow-hidden flex flex-col hover:border-white/10 transition duration-300 relative group">
                        
                        {/* Status tag */}
                        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border shadow-md font-mono ${
                          c.status === 'Activo' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'
                        }`}>
                          {c.status}
                        </span>

                        {/* Image Portada */}
                        <div className="h-44 bg-zinc-900 overflow-hidden relative">
                          <img src={c.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400"} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                          
                          {/* Level classification badge */}
                          <span className="absolute bottom-3 left-3 bg-red-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide font-mono">
                            {c.level}
                          </span>
                        </div>

                        {/* Course metadata */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h4 className="font-extrabold text-sm text-white line-clamp-1 group-hover:text-red-500 transition">{c.title}</h4>
                            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{c.description}</p>
                          </div>

                          <div className="flex justify-between items-center font-mono border-t border-white/5 pt-3 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-red-500" /> {c.duration} horas</span>
                            <span className="font-bold text-white text-xs">${c.price} USD</span>
                          </div>

                          {/* Action panel */}
                          {canEdit && (
                            <div className="flex gap-2 border-t border-white/5 pt-3">
                              <button 
                                onClick={() => {
                                  setEditingCourse(c);
                                  setCourseForm(c);
                                  setIsCourseModalOpen(true);
                                }}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Editar
                              </button>
                              <button 
                                onClick={() => handleDuplicateCourse(c)}
                                className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-gray-400 hover:text-white transition"
                                title="Duplicar / Replicar Curso"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCourse(c.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                T3: LIBROS / RECURSOS MANAGEMENT
                ======================================================= */}
            {activeTab === 'books' && (
              <div className="space-y-8">
                
                {/* Search Book filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Buscar por título, autor o especificación..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div className="relative shrink-0">
                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer min-w-[155px]"
                    >
                      <option value="all">Categorías ISO</option>
                      <option value="ISO 9001">ISO 9001</option>
                      <option value="ISO 27001">ISO 27001</option>
                      <option value="Coaching">Coaching</option>
                      <option value="Excelencia Operativa">Excelencia</option>
                    </select>
                  </div>
                </div>

                {loadingStates.books ? (
                  <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>
                ) : filteredBooks.length === 0 ? (
                  <div className="glass p-12 rounded-3xl text-center border border-white/5">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No se hallaron libros</h3>
                    <p className="text-gray-400">Introduce material descargable para que tus clientes puedan descargarlos.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredBooks.map((b) => (
                      <div key={b.id} className="glass rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-white/10 transition">
                        <div className="p-4 space-y-4">
                          
                          {/* Book Portada */}
                          <div className="aspect-[3/4] rounded-lg bg-zinc-900 border border-white/5 overflow-hidden shadow-md relative">
                            <img src={b.coverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300"} alt="" className="w-full h-full object-cover" />
                            <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-green-400 font-mono">
                              {b.category}
                            </span>
                          </div>

                          {/* Metadatos */}
                          <div className="space-y-1.5">
                            <h4 className="font-extrabold text-xs text-white line-clamp-2" title={b.title}>{b.title}</h4>
                            <p className="text-[10px] text-gray-400">{b.author} • <span className="font-mono">{b.year}</span></p>
                            <p className="text-[10px] text-emerald-400 font-mono font-semibold">📥 {b.downloadsCount || 0} Descargas registradas</p>
                          </div>
                        </div>

                        {/* Trigger Actions */}
                        <div className="p-4 bg-zinc-950 border-t border-white/5 flex gap-1.5">
                          {b.pdfUrl && (
                            <a 
                              href={b.pdfUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => incrementDownload(b)}
                              className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-[10px] uppercase font-bold py-2 rounded-lg text-center flex items-center justify-center gap-1 transition border border-green-500/20"
                            >
                              <ExternalLink className="w-3 h-3" /> Descargar PDF
                            </a>
                          )}
                          {canEdit && (
                            <>
                              <button 
                                onClick={() => {
                                  setEditingBook(b);
                                  setBookForm(b);
                                  setIsBookModalOpen(true);
                                }}
                                className="bg-white/5 hover:bg-white/15 p-2 rounded-lg text-gray-300 transition"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDuplicateBook(b)}
                                className="bg-white/5 hover:bg-white/15 p-2 rounded-lg text-gray-300 transition"
                                title="Duplicar"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteBook(b.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg text-red-400 transition"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                T4: VISITAS ONSITE (PRESENCIALES) CALENDAR VIEW
                ======================================================= */}
            {activeTab === 'visits' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CALENDAR COLUMN */}
                <div className="lg:col-span-2 glass p-6 rounded-2xl border border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-red-500" />
                      Planificación Mensual
                    </h3>
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeMonth(-1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition"><ChevronLeft className="w-4 h-4" /></button>
                      <span className="text-xs font-bold font-mono text-white tracking-widest uppercase">
                        {calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                      </span>
                      <button onClick={() => changeMonth(1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Calendar Grid Header */}
                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-500 uppercase">
                    {['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'].map(d => <span key={d}>{d}</span>)}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Previous Month filler */}
                    {Array(firstDayIndex).fill(null).map((_, i) => (
                      <div key={`prev-${i}`} className="aspect-square bg-transparent rounded-xl"></div>
                    ))}
                    
                    {/* Month Active Days */}
                    {Array(daysInMonth).fill(null).map((_, i) => {
                      const dayNumber = i + 1;
                      const hasEvents = calendarEvents[dayNumber]?.length > 0;
                      const isSelected = selectedCalendarDay === dayNumber;
                      return (
                        <button
                          key={dayNumber}
                          onClick={() => setSelectedCalendarDay(dayNumber)}
                          className={`aspect-square rounded-xl p-1.5 flex flex-col justify-between items-center transition relative border cursor-pointer ${
                            isSelected 
                              ? 'bg-red-600 border-red-500 text-white font-bold scale-102 shadow-lg shadow-red-500/20' 
                              : 'bg-zinc-900/50 hover:bg-zinc-900/90 border-white/5 text-gray-300'
                          }`}
                        >
                          <span className="text-xs font-mono">{dayNumber}</span>
                          
                          {/* Dot markers */}
                          {hasEvents && (
                            <div className="flex gap-1 justify-center mt-auto">
                              {calendarEvents[dayNumber].slice(0, 3).map((ev: any, idx: number) => (
                                <span key={`ev-dot-${ev.id || idx}-${idx}`} className={`w-1.5 h-1.5 rounded-full ${ev.color}`}></span>
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* EVENTS PREVIEW FOR SPECIFIC DAY ON CALENDAR SIDEBAR */}
                <div className="space-y-6">
                  
                  {/* Quick details header */}
                  <div className="glass p-5 rounded-2xl border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                      📅 Agenda del día {selectedCalendarDay || calendarDate.getDate()}
                    </h4>

                    <div className="space-y-3">
                      {(() => {
                        const activeDayNum = selectedCalendarDay || calendarDate.getDate();
                        const dayEvents = calendarEvents[activeDayNum] || [];
                        if (dayEvents.length === 0) {
                          return (
                            <div className="text-center py-6 text-gray-500 text-xs text-balance">
                              No hay visitas corporativas ni tutorías programadas para este día del calendario.
                            </div>
                          );
                        }
                        return dayEvents.map((ev, idx) => (
                          <div key={`day-ev-${ev.id || ev.company || idx}-${idx}`} className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border inline-block ${
                              ev.labelType === 'Visita' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                            }`}>
                              {ev.labelType}
                            </span>
                            <div className="space-y-0.5">
                              <h5 className="font-bold text-xs text-white">{ev.company || ev.studentName}</h5>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-red-500" /> {ev.time}
                              </p>
                              {ev.address && <p className="text-[10px] text-gray-500 truncate mt-1">📍 {ev.address}</p>}
                              {ev.topic && <p className="text-[10px] text-gray-500 truncate mt-1 italic">"{ev.topic}"</p>}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* FULL TEXT VISITS LIST */}
                  <div className="glass p-5 rounded-2xl border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5 pb-2">
                      Todas las visitas Onsite ({visits.length})
                    </h4>
                    
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {visits.map((v) => (
                        <div key={v.id} className="bg-zinc-900/50 p-3.5 rounded-xl border border-white/5 text-xs space-y-2 flex justify-between gap-1">
                          <div className="space-y-1">
                            <p className="font-extrabold text-white text-[13px]">{v.company}</p>
                            <p className="text-gray-400 text-[11px]">{v.clientName}</p>
                            <p className="text-[10px] text-gray-500 font-mono">📅 {v.date} • ⏰ {v.time}</p>
                            <span className={`inline-block text-[9px] uppercase font-bold py-0.5 px-1.5 rounded ${
                              v.status === 'completed' ? 'bg-green-500/15 text-green-400' :
                              v.status === 'cancelled' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-500'
                            }`}>{v.status}</span>
                          </div>

                          <div className="flex flex-col justify-between items-end">
                            {canEdit && (
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={() => {
                                    setEditingVisit(v);
                                    setVisitForm(v);
                                    setIsVisitModalOpen(true);
                                  }}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded hover:text-white transition"
                                  title="Reprogramar o Editar"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteVisit(v.id)}
                                  className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded text-red-400 transition"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* =======================================================
                T5: TUTORÍAS ONLINE MANAGEMENT
                ======================================================= */}
            {activeTab === 'tutorials' && (
              <div className="space-y-8">
                
                {/* Tutorías responsive list */}
                {loadingStates.tutorials ? (
                  <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>
                ) : tutorials.length === 0 ? (
                  <div className="glass p-12 rounded-3xl text-center border border-white/5">
                    <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No hay tutorías de apoyo planeadas</h3>
                    <p className="text-gray-400">Las tutorías reservadas por tus alumnos de ISO y Coaching aparecerán listadas aquí.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {tutorials.map((t) => (
                      <div key={t.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden hover:border-white/10 transition">
                        
                        {/* Status bar left */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          t.status === 'confirmed' ? 'bg-green-500' :
                          t.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 pl-3">
                          
                          {/* Student identity */}
                          <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Alumno</p>
                            <h4 className="font-extrabold text-sm">{t.studentName}</h4>
                            <p className="text-xs text-red-400 truncate">{t.email}</p>
                          </div>

                          {/* Chrono */}
                          <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Horario Planificado</p>
                            <p className="font-bold text-xs text-white">{t.date}</p>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-red-500" /> {t.time} ({t.duration} m)</span>
                          </div>

                          {/* Topic matter */}
                          <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Tema de Consulta</p>
                            <p className="font-bold text-xs text-gray-300 italic mb-1">"{t.topic}"</p>
                            {t.subtype && (
                              <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 font-bold ${
                                t.subtype === 'Coaching' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                                t.subtype === 'Psicopedagogía' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25' :
                                'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                              }`}>
                                {t.subtype === 'Coaching' ? '🛡️ Coaching Estratégico' :
                                 t.subtype === 'Psicopedagogía' ? '🧠 Psicopedagogía' :
                                 '⚙️ Tutoría Técnica ISO'
                                }
                              </span>
                            )}
                          </div>

                          {/* Platform link */}
                          <div className="space-y-1 shrink-0">
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Plataforma</p>
                            <span className={`text-[10px] font-extrabold px-3 py-1 bg-zinc-900 border rounded-full inline-block ${
                              t.platform === 'Zoom' ? 'text-blue-400 border-blue-500/20' :
                              t.platform === 'Meet' ? 'text-green-400 border-green-500/20' : 'text-purple-400 border-purple-500/20'
                            }`}>{t.platform}</span>
                            {t.link && (
                              <a 
                                href={t.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block text-red-400 hover:text-red-300 text-[10px] mt-1.5 flex items-center gap-1"
                              >
                                Unirse hoy <ChevronRight className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                        </div>

                        {/* Event action commands */}
                        <div className="flex md:flex-col items-end gap-2 pr-2">
                          <span className={`text-[9px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded inline-block ${
                            t.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                            t.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>{t.status}</span>
                          
                          {canEdit && (
                            <div className="flex gap-1.5 mt-2">
                              <button 
                                onClick={() => {
                                  setEditingTutorial(t);
                                  setTutorialForm(t);
                                  setIsTutorialModalOpen(true);
                                }}
                                className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-gray-300 hover:text-white transition"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteTutorial(t.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                T6: EQUIPO Y COLLABORATORS MANAGEMENT
                ======================================================= */}
            {activeTab === 'users' && (
              <div className="space-y-8">
                <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-xs text-gray-300 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>Manual del Proceso ISO:</strong> Robert Terán puede delegar las auditorías invitando a colaboradores técnicos con roles específicos. Los <strong>Editores</strong> pueden crear cursos y planificar citas presenciales. Los <strong>Viewers</strong> sólo pueden auditar y previsualizar la información sin capacidad de alterarla.
                  </p>
                </div>

                {loadingStates.users ? (
                  <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>
                ) : (
                  <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse h-full">
                      <thead>
                        <tr className="border-b border-white/5 bg-zinc-900/30 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <th className="p-4 pl-6">Nombre del Miembro</th>
                          <th className="p-4">Email Corporativo</th>
                          <th className="p-4">Privilegios</th>
                          {hasAdminRights && <th className="p-4 pr-6 text-right">Acciones</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        
                        {/* Default Hardcoded Owner Robert to showcase */}
                        <tr className="hover:bg-white/2">
                          <td className="p-4 pl-6 font-bold text-white flex items-center gap-2">
                            <span>Robert Terán</span>
                            <span className="bg-red-650 text-[8px] font-extrabold uppercase py-0.5 px-1.5 rounded bg-red-600 text-white font-mono">Propietario</span>
                          </td>
                          <td className="p-4 text-gray-400">{ADMIN_EMAIL}</td>
                          <td className="p-4">
                            <span className="text-[10px] bg-red-500/10 text-red-400 font-mono uppercase font-bold px-2 py-0.5 rounded border border-red-500/20">admin</span>
                          </td>
                          {hasAdminRights && <td className="p-4 pr-6 text-right text-gray-500 italic text-[11px] font-medium">—</td>}
                        </tr>

                        {usersList.map((usr) => (
                          <tr key={usr.id} className="hover:bg-white/2 transition">
                            <td className="p-4 pl-6 text-white font-medium">{usr.name}</td>
                            <td className="p-4 text-gray-400">{usr.email}</td>
                            <td className="p-4">
                              <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                                usr.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                usr.role === 'editor' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}>{usr.role}</span>
                            </td>
                            {hasAdminRights && (
                              <td className="p-4 pr-6 text-right">
                                <button 
                                  onClick={() => handleDeleteUser(usr.id, usr.email)}
                                  className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 hover:bg-red-500/20 rounded transition"
                                  title="Revocar permisos"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                T7: IMAGE ISO REGISTRY TAB
                ======================================================= */}
            {activeTab === 'registry' && (
              <ImageRegistryManager />
            )}

            {/* =======================================================
                T8: PUBLIC PROFILE EDITOR TAB
                ======================================================= */}
            {activeTab === 'profile' && (
              <ProfileEditor />
            )}

          </motion.div>
        </AnimatePresence>

      </main>

      {/* ===============================================================
          3. FULL COLLECTION EDITING DIALOG / MODALS
          =============================================================== */}
      
      {/* A. COURSE MODAL */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-red-500" />
              {editingCourse ? 'Editar Programa Educativo' : 'Alta de Nuevo Curso'}
            </h3>
            
            <form onSubmit={handleCourseSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Título del Curso</label>
                <input 
                  type="text" required
                  value={courseForm.title || ''}
                  onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Descripción</label>
                <textarea 
                  required rows={3}
                  value={courseForm.description || ''}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Duración (hs)</label>
                  <input 
                    type="number" required min={1}
                    value={courseForm.duration || 10}
                    onChange={(e) => setCourseForm({...courseForm, duration: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Precio (USD)</label>
                  <input 
                    type="number" required min={0}
                    value={courseForm.price || 99}
                    onChange={(e) => setCourseForm({...courseForm, price: parseFloat(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Nivel</label>
                  <select 
                    value={courseForm.level || 'Básico'}
                    onChange={(e) => setCourseForm({...courseForm, level: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Banner URL</label>
                  <input 
                    type="url" required
                    value={courseForm.imageUrl || ''}
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) => setCourseForm({...courseForm, imageUrl: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Estado inicial</label>
                  <select 
                    value={courseForm.status || 'Activo'}
                    onChange={(e) => setCourseForm({...courseForm, status: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* PDF Materials linker checkboxes */}
              <div className="space-y-2 border-t border-white/5 pt-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Vincular Material de Lectura (Libros/PDFs)</label>
                {books.length === 0 ? (
                  <p className="text-[10px] text-gray-500">No hay libros dados de alta para vincular como material de estudio.</p>
                ) : (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto bg-black/40 p-2.5 rounded-lg border border-white/5">
                    {books.map(b => (
                      <label key={b.id} className="flex items-center gap-2 text-xs text-gray-300">
                        <input 
                          type="checkbox"
                          checked={courseForm.materials?.includes(b.id) || false}
                          onChange={(e) => {
                            const mats = courseForm.materials ? [...courseForm.materials] : [];
                            if (e.target.checked) {
                              mats.push(b.id);
                            } else {
                              const pos = mats.indexOf(b.id);
                              if (pos !== -1) mats.splice(pos, 1);
                            }
                            setCourseForm({ ...courseForm, materials: mats });
                          }}
                          className="rounded text-red-650 bg-white/5 border-white/10 w-4 h-4"
                        />
                        {b.title}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button" onClick={() => setIsCourseModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Confirmar Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. BOOK MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-500" />
              {editingBook ? 'Modificar Recurso PDF' : 'Subida de Biblioteca ISO / Recursos'}
            </h3>
            
            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Título del Libro o Guía</label>
                <input 
                  type="text" required
                  value={bookForm.title || ''}
                  onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Autor</label>
                  <input 
                    type="text" required
                    value={bookForm.author || ''}
                    onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Año de Publicación</label>
                  <input 
                    type="number" required
                    value={bookForm.year || 2026}
                    onChange={(e) => setBookForm({...bookForm, year: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Especialización / Categoría</label>
                  <select 
                    value={bookForm.category || 'ISO 9001'}
                    onChange={(e) => setBookForm({...bookForm, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="ISO 9001">ISO 9001:2015</option>
                    <option value="ISO 27001">ISO 27001 (Seguridad)</option>
                    <option value="Coaching">Coaching Ejecutivo</option>
                    <option value="Excelencia Operativa">Excelencia Operativa</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Portada Imagen URL</label>
                  <input 
                    type="url" required
                    value={bookForm.coverUrl || ''}
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) => setBookForm({...bookForm, coverUrl: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Archivo Documento PDF (URL o Demo)</label>
                <input 
                  type="text" required
                  value={bookForm.pdfUrl || ''}
                  placeholder="https://ejemplo.com/archivo.pdf"
                  onChange={(e) => setBookForm({...bookForm, pdfUrl: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button" onClick={() => setIsBookModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Aceptar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. VISIT MODAL */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              {editingVisit ? 'Reprogramar Auditoría Onsite' : 'Coordinar Visita Física'}
            </h3>
            
            <form onSubmit={handleVisitSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre del Cliente / Representante</label>
                <input 
                  type="text" required
                  value={visitForm.clientName || ''}
                  onChange={(e) => setVisitForm({...visitForm, clientName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Organización / Empresa</label>
                <input 
                  type="text" required
                  value={visitForm.company || ''}
                  onChange={(e) => setVisitForm({...visitForm, company: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha Planificación</label>
                  <input 
                    type="date" required
                    value={visitForm.date || ''}
                    onChange={(e) => setVisitForm({...visitForm, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500 text-white fill-white cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Horario Estimado</label>
                  <input 
                    type="time" required
                    value={visitForm.time || ''}
                    onChange={(e) => setVisitForm({...visitForm, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Dirección / Geoposicionamiento</label>
                <input 
                  type="text" required
                  placeholder="Av. Principal, Oficinas de Planta Industrial Nº..."
                  value={visitForm.address || ''}
                  onChange={(e) => setVisitForm({...visitForm, address: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Estado inicial</label>
                  <select 
                    value={visitForm.status || 'pending'}
                    onChange={(e) => setVisitForm({...visitForm, status: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="pending">Pendiente de Ejecutar</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Notas del Auditor / Requerimientos</label>
                <textarea 
                  rows={2}
                  value={visitForm.notes || ''}
                  placeholder="Ej: Asegurar firma de confidencialidad NDA, llevar checklist..."
                  onChange={(e) => setVisitForm({...visitForm, notes: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button" onClick={() => setIsVisitModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Agendar Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. TUTORIAL MODAL */}
      {isTutorialModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-teal-400" />
              {editingTutorial ? 'Editar Tutoría Programada' : 'Planificar Tutoría / Coaching Online'}
            </h3>
            
            <form onSubmit={handleTutorialSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre del Alumno / Cliente</label>
                <input 
                  type="text" required
                  value={tutorialForm.studentName || ''}
                  onChange={(e) => setTutorialForm({...tutorialForm, studentName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Correo Electrónico (Para Invitación GCal)</label>
                <input 
                  type="email" required
                  value={tutorialForm.email || ''}
                  onChange={(e) => setTutorialForm({...tutorialForm, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha</label>
                  <input 
                    type="date" required
                    value={tutorialForm.date || ''}
                    onChange={(e) => setTutorialForm({...tutorialForm, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500 cursor-pointer text-white fill-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Horario</label>
                  <input 
                    type="time" required
                    value={tutorialForm.time || ''}
                    onChange={(e) => setTutorialForm({...tutorialForm, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Duración (minutos)</label>
                  <input 
                    type="number" required min={15} step={15}
                    value={tutorialForm.duration || 60}
                    onChange={(e) => setTutorialForm({...tutorialForm, duration: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Plataforma</label>
                  <select 
                    value={tutorialForm.platform || 'Meet'}
                    onChange={(e) => setTutorialForm({...tutorialForm, platform: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Meet">Google Meet</option>
                    <option value="Zoom">Zoom Video</option>
                    <option value="Teams">Microsoft Teams</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Enlace de la Reunión</label>
                <input 
                  type="url" required
                  placeholder="https://meet.google.com/..."
                  value={tutorialForm.link || ''}
                  onChange={(e) => setTutorialForm({...tutorialForm, link: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Subtipo/Categoría de Sesión</label>
                <select 
                  value={tutorialForm.subtype || 'Técnica'}
                  onChange={(e) => setTutorialForm({...tutorialForm, subtype: e.target.value as any})}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-500 text-white"
                >
                  <option value="Técnica">Tutoría Técnica (ISO, auditorías, procesos)</option>
                  <option value="Coaching">Coaching Estratégico (liderazgo, decisiones, estrés)</option>
                  <option value="Psicopedagogía">Psicopedagogía para Equipos (dinámicas de grupo, comunicación)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Tema o Preguntas Clave</label>
                <input 
                  type="text" required
                  placeholder="Revisión cláusula 7 o coaching general..."
                  value={tutorialForm.topic || ''}
                  onChange={(e) => setTutorialForm({...tutorialForm, topic: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-3 py-2 bg-black/40 px-3.5 rounded-lg border border-white/5">
                <input 
                  type="checkbox"
                  checked={tutorialForm.sendInvitation || false}
                  onChange={(e) => setTutorialForm({ ...tutorialForm, sendInvitation: e.target.checked })}
                  className="rounded text-teal-600 bg-white/5 border-white/10 w-4.5 h-4.5 cursor-pointer"
                />
                <span className="text-[11px] text-gray-300">¿Notificar por correo y coordinar calendario?</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button" onClick={() => setIsTutorialModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Guardar Programación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E. USER / COLLABORATOR ROLES MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              Asignar Nivel de Acceso Técnico
            </h3>
            
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre Completo</label>
                <input 
                  type="text" required
                  value={userForm.name || ''}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Email Google de Acceso</label>
                <input 
                  type="email" required
                  value={userForm.email || ''}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Rol / Nivel Autorizado</label>
                <select 
                  value={userForm.role || 'viewer'}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value as any})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="admin">Administrador Principal</option>
                  <option value="editor">Editor (Agendar/Editar cursos y visitas)</option>
                  <option value="viewer">Viewer (Solo lectura/Invitado)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button" onClick={() => setIsUserModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Conceder Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Simple fallback placeholding icon for layout items
function CabinetIconPlaceholder(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}
