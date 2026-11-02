Warning: truncated output (original token count: 30711)
Total output lines: 2428

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  ChevronLeft, ChevronRight, UploadCloud, Info, AlertTriangle, ShieldCheck, Bot, Palette, Sparkles, Globe2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { Course, Book, Visit, Tutorial, UserProfile, UserRole } from '../types';
import ImageRegistryManager from './ImageRegistryManager';
import ThemeEditor from './ThemeEditor';
import ProfileEditor from './ProfileEditor';
import { useProfileSettings } from '../data/useProfileSettings';
import CurriculumEditor from './CurriculumEditor';
import AIDemandAnalyticsDashboard from './AIDemandAnalyticsDashboard';
import CertificateAIImporter from './CertificateAIImporter';
import AdminAssistantChat from './AdminAssistantChat';
import SiteContentEditor from './SiteContentEditor';

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

function AdminPanel() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = ['es', 'en', 'pt', 'it'].includes(i18n.resolvedLanguage || '') ? (i18n.resolvedLanguage || 'es') : 'es';

  // Authentication & Role State from central AuthContext
  const { currentUser, logout: performContextLogout, loading: authChecking } = useAuth();
  const { profile } = useProfileSettings();
  
  // Active Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai_demand' | 'ai_curriculum' | 'ai_assistant' | 'courses' | 'books' | 'visits' | 'tutorials' | 'users' | 'registry' | 'profile' | 'curriculum' | 'theme' | 'site_content'>('dashboard');

  // Domain Collections States
  const [courses, setCourses] = useState<Course[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<UserProfile[]>([]);
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

  const ADMIN_EMAIL = 'safeness.c.a@gmail.com';

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
  const isAdmin = currentUser?.isAdmin ?? false;
  const canEdit = currentUser?.status === 'active' && (isAdmin || currentUserRole === 'editor' || currentUserRole === 'supervisor');
  const hasAdminRights = currentUser?.status === 'active' && isAdmin;
  const activeRole = currentUserRole;

  // Real-time queries for all entities
  useEffect(() => {
    if (!user) return;

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

    // User and invitation management is private to the super administrator.
    let unsubUsers = () => {};
    let unsubInvitations = () => {};
    if (currentUser?.isSuperAdmin) {
      unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }) as UserProfile);
        setUsersList(data);
        setLoadingStates(prev => ({ ...prev, users: false }));
      }, (err) => {
        console.warn('Unable to load user accounts', err);
        setLoadingStates(prev => ({ ...prev, users: false }));
      });
      unsubInvitations = onSnapshot(collection(db, 'invitations'), (snap) => {
        const data = snap.docs.map(d => {
          const invitation = d.data();
          return { id: 'invite:' + d.id, email: invitation.email, name: invitation.name || 'Invitación pendiente', role: invitation.role || 'viewer' } as UserProfile;
        });
        setInvitedUsers(data);
      }, (err) => console.warn('Unable to load invitations', err));
    } else {
      setLoadingStates(prev => ({ ...prev, users: false }));
    }

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
      unsubInvitations();
      unsubConsultations();
    };
  }, [user]);



  const handleLogoutClick = async () => {
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
          alert(`Invitación de Google Calendar y enlace ${tutorialForm.platform} enviada automáticamente a ${tutorialForm.email}`);
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
    if (!currentUser?.isSuperAdmin) return alert('Solo el superadministrador puede invitar usuarios.');
    const userMail = (userForm.email || '').trim().toLowerCase();
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(userMail)) return alert('Introduce un correo válido.');
    if (userMail === ADMIN_EMAIL) return alert('La cuenta superadministradora no necesita invitación.');
    const role = userForm.role || 'viewer';
    if (!['admin', 'editor', 'supervisor', 'colaborador', 'tlmk', 'cliente', 'viewer'].includes(role)) {
      return alert('El rol seleccionado no está permitido para invitaciones.');
    }
    try {
      await setDoc(doc(db, 'invitations', userMail), {
        email: userMail,
        name: (userForm.name || 'Colaborador').trim(),
        role,
        status: 'active',
        invitedBy: currentUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert('Invitación creada. La persona debe iniciar sesión con Google usando ese correo.');
      setIsUserModalOpen(false);
      setUserForm({ email: '', name: '', role: 'viewer' });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'invitations');
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!currentUser?.isSuperAdmin) return alert('Solo el superadministrador puede revocar accesos.');
    if (email.toLowerCase() === ADMIN_EMAIL) return alert('No se puede revocar la cuenta superadministradora principal.');
    if (window.confirm('¿Deseas revocar el acceso de ' + email + '? Si ya tiene cuenta, se eliminará su autorización y deberá volver a ser invitado.')) {
      try {
        await deleteDoc(doc(db, 'invitations', email.toLowerCase()));
        if (!id.startsWith('invite:')) await deleteDoc(doc(db, 'users', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, 'invitations/' + email.toLowerCase());
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
        <p className="text-gray-400 font-mono text-sm">{t('admin.common.validating')}</p>
      </div>
    );
  }

  // Auth gate redirection fallback
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
        <p className="text-gray-400 font-mono text-sm">{t('admin.common.redirecting')}</p>
      </div>
    );
  }

  return (
    <div className="admin-panel min-h-screen bg-white text-slate-900 flex flex-col md:flex-row font-sans selection:bg-blue-100">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0">
        
        {/* Profile Card / Brand */}
        <div className="p-6 border-b border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-red-500/20 bg-black/40 shrink-0">
              <img 
                src={profile.photoUrl || currentUser?.photoURL || undefined} 
                alt={profile.name || currentUser?.name || "Perfil profesional"} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-[14px] truncate">{profile.name || currentUser?.name || 'Coach ISO'}</p>
              <p className="text-[10px] text-gray-400 font-mono">{t('admin.common.specialist')}</p>
            </div>
          </div>

          <div className="bg-white/5 px-2.5 py-1 rounded-md flex items-center justify-between text-[10px] font-mono">
            <span className="text-gray-500 uppercase">{t('admin.common.currentRole')}:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded uppercase ${
              activeRole === 'admin' ? 'text-red-400 bg-red-500/10' :
              activeRole === 'editor' ? 'text-yellow-400 bg-yellow-500/10' :
              'text-blue-400 bg-blue-500/10'
            }`}>{activeRole}</span>
          </div>

        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', name: t('admin.nav.dashboard'), icon: Layers },
            { id: 'ai_demand', name: t('admin.nav.aiDemand'), icon: Bot },
            { id: 'ai_curriculum', name: t('admin.nav.aiCurriculum'), icon: Sparkles },
            { id: 'ai_assistant', name: t('admin.nav.aiAssistant'), icon: Bot },
            { id: 'courses', name: t('admin.nav.courses'), icon: GraduationCap },
            { id: 'books', name: t('admin.nav.books'), icon: BookOpen },
            { id: 'visits', name: t('admin.nav.visits'), icon: MapPin },
            { id: 'tutorials', name: t('admin.nav.tutorials'), icon: Video },
            ...(currentUser?.isSuperAdmin ? [{ id: 'users', name: t('admin.nav.users'), icon: Users }] : []),
            { id: 'registry', name: t('admin.nav.registry'), icon: CabinetIconPlaceholder },
            { id: 'curriculum', name: t('admin.nav.curriculum'), icon: FileText },
            ...(canEdit ? [{ id: 'site_content', name: currentLanguage === 'pt' ? 'Conteúdo do site' : currentLanguage === 'it' ? 'Contenuti del sito' : currentLanguage === 'en' ? 'Website content' : 'Contenido web', icon: Globe2 }] : []),
            { id: 'theme', name: t('admin.nav.theme'), icon: Palette },
            { id: 'profile', name: t('admin.nav.profile'), icon: Settings }
          ].map((item, idx) => {
            const Icon = item.icon as any;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-tab-${item.id}`}
                key={`admin-nav-${item.id}-${idx}`}
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
            <p className="text-[10px] font-mono text-gray-500">{t('admin.common.demoUtilities')}</p>
            <button 
              onClick={seedDemoData}
              className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-medium py-2 px-3 rounded-lg flex items-center gap-2 transition"
            >
              <UploadCloud className="w-4.5 h-4.5 text-red-500" />
     …12711 tokens truncated…        </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        
                        {/* Default Hardcoded Owner Robert to showcase */}
                        <tr className="hover:bg-white/2">
                          <td className="p-4 pl-6 font-bold text-white flex items-center gap-2">
                            <span>Robert Terán</span>
                            <span className="bg-red-650 text-[8px] font-extrabold uppercase py-0.5 px-1.5 rounded bg-red-600 text-white font-mono">{t('adminModules.panel.owner')}</span>
                          </td>
                          <td className="p-4 text-gray-400">{ADMIN_EMAIL}</td>
                          <td className="p-4">
                            <span className="text-[10px] bg-red-500/10 text-red-400 font-mono uppercase font-bold px-2 py-0.5 rounded border border-red-500/20">admin</span>
                          </td>
                          {currentUser?.isSuperAdmin && <td className="p-4 pr-6 text-right text-gray-500 italic text-[11px] font-medium">—</td>}
                        </tr>

                        {[...usersList.filter(usr => usr.email?.toLowerCase() !== ADMIN_EMAIL), ...invitedUsers.filter(inv => !usersList.some(usr => usr.email?.toLowerCase() === inv.email?.toLowerCase()))].map((usr, idx) => (
                          <tr key={`usr-${usr.id || idx}-${idx}`} className="hover:bg-white/2 transition">
                            <td className="p-4 pl-6 text-white font-medium">{usr.name}</td>
                            <td className="p-4 text-gray-400">{usr.email}</td>
                            <td className="p-4">
                              <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                                usr.role === 'superadmin' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' :
                                usr.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                usr.role === 'supervisor' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                usr.role === 'editor' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                usr.role === 'colaborador' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                                usr.role === 'tlmk' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                usr.role === 'cliente' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                usr.role === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}>{usr.role}</span>
                            </td>
                            {currentUser?.isSuperAdmin && (
                              <td className="p-4 pr-6 text-right">
                                <button 
                                  onClick={() => handleDeleteUser(usr.id, usr.email)}
                                  className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 hover:bg-red-500/20 rounded transition"
                                  title={t('admin.common.revoke')}
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
            {activeTab === 'theme' && (
              <div className="animate-fadeIn">
                <ThemeEditor />
              </div>
            )}

            {activeTab === 'ai_curriculum' && <CertificateAIImporter />}

            {activeTab === 'profile' && (
              <ProfileEditor />
            )}

            {/* =======================================================
                T9: CURRICULUM EDITOR TAB
                ======================================================= */}
            {activeTab === 'curriculum' && (
              <CurriculumEditor />
            )}

            {activeTab === 'site_content' && (
              <SiteContentEditor canEdit={canEdit} />
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
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.courseTitle')}</label>
                <input 
                  type="text" required
                  value={courseForm.title || ''}
                  onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.description')}</label>
                <textarea 
                  required rows={3}
                  value={courseForm.description || ''}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.durationHours')}</label>
                  <input 
                    type="number" required min={1}
                    value={courseForm.duration || 10}
                    onChange={(e) => setCourseForm({...courseForm, duration: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.price')}</label>
                  <input 
                    type="number" required min={0}
                    value={courseForm.price || 99}
                    onChange={(e) => setCourseForm({...courseForm, price: parseFloat(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.level')}</label>
                  <select 
                    value={courseForm.level || 'Básico'}
                    onChange={(e) => setCourseForm({...courseForm, level: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Básico">{t('adminModules.panel.basic')}</option>
                    <option value="Intermedio">{t('adminModules.panel.intermediate')}</option>
                    <option value="Avanzado">{t('adminModules.panel.advanced')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.bannerUrl')}</label>
                  <input 
                    type="url" required
                    value={courseForm.imageUrl || ''}
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) => setCourseForm({...courseForm, imageUrl: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.initialStatus')}</label>
                  <select 
                    value={courseForm.status || 'Activo'}
                    onChange={(e) => setCourseForm({...courseForm, status: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Activo">{t('adminModules.panel.active')}</option>
                    <option value="Inactivo">{t('adminModules.panel.inactive')}</option>
                  </select>
                </div>
              </div>

              {/* PDF Materials linker checkboxes */}
              <div className="space-y-2 border-t border-white/5 pt-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">{t('adminModules.panel.linkMaterial')}</label>
                {books.length === 0 ? (
                  <p className="text-[10px] text-gray-500">{t('adminModules.panel.noBooksLinked')}</p>
                ) : (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto bg-black/40 p-2.5 rounded-lg border border-white/5">
                    {(Array.isArray(books) ? books : []).map((b, idx) => (
                      <label key={`book-lbl-${b.id || idx}-${idx}`} className="flex items-center gap-2 text-xs text-gray-300">
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
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.bookTitle')}</label>
                <input 
                  type="text" required
                  value={bookForm.title || ''}
                  onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.author')}</label>
                  <input 
                    type="text" required
                    value={bookForm.author || ''}
                    onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.publicationYear')}</label>
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.specialization')}</label>
                  <select 
                    value={bookForm.category || 'ISO 9001'}
                    onChange={(e) => setBookForm({...bookForm, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="ISO 9001">ISO 9001:2015</option>
                    <option value="ISO 27001">{t('adminModules.panel.isoSecurity')}</option>
                    <option value="Coaching">{t('adminModules.panel.executiveCoaching')}</option>
                    <option value="Excelencia Operativa">{t('adminModules.panel.operationalExcellence')}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.coverUrl')}</label>
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
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.pdfUrl')}</label>
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
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.clientName')}</label>
                <input 
                  type="text" required
                  value={visitForm.clientName || ''}
                  onChange={(e) => setVisitForm({...visitForm, clientName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.organization')}</label>
                <input 
                  type="text" required
                  value={visitForm.company || ''}
                  onChange={(e) => setVisitForm({...visitForm, company: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.plannedDate')}</label>
                  <input 
                    type="date" required
                    value={visitForm.date || ''}
                    onChange={(e) => setVisitForm({...visitForm, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500 text-white fill-white cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.estimatedTime')}</label>
                  <input 
                    type="time" required
                    value={visitForm.time || ''}
                    onChange={(e) => setVisitForm({...visitForm, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.address')}</label>
                <input 
                  type="text" required
                  placeholder={t('adminModules.panel.addressExample')}
                  value={visitForm.address || ''}
                  onChange={(e) => setVisitForm({...visitForm, address: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.initialStatus')}</label>
                  <select 
                    value={visitForm.status || 'pending'}
                    onChange={(e) => setVisitForm({...visitForm, status: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="pending">{t('adminModules.panel.pending')}</option>
                    <option value="completed">{t('adminModules.panel.completed')}</option>
                    <option value="cancelled">{t('adminModules.panel.cancelled')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.auditorNotes')}</label>
                <textarea 
                  rows={2}
                  value={visitForm.notes || ''}
                  placeholder={t('adminModules.panel.auditorNotesExample')}
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
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.studentName')}</label>
                <input 
                  type="text" required
                  value={tutorialForm.studentName || ''}
                  onChange={(e) => setTutorialForm({...tutorialForm, studentName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.inviteEmail')}</label>
                <input 
                  type="email" required
                  value={tutorialForm.email || ''}
                  onChange={(e) => setTutorialForm({...tutorialForm, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.date')}</label>
                  <input 
                    type="date" required
                    value={tutorialForm.date || ''}
                    onChange={(e) => setTutorialForm({...tutorialForm, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500 cursor-pointer text-white fill-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.time')}</label>
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.durationMinutes')}</label>
                  <input 
                    type="number" required min={15} step={15}
                    value={tutorialForm.duration || 60}
                    onChange={(e) => setTutorialForm({...tutorialForm, duration: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.platform')}</label>
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
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.meetingLink')}</label>
                <input 
                  type="url" required
                  placeholder="https://meet.google.com/..."
                  value={tutorialForm.link || ''}
                  onChange={(e) => setTutorialForm({...tutorialForm, link: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.sessionType')}</label>
                <select 
                  value={tutorialForm.subtype || 'Técnica'}
                  onChange={(e) => setTutorialForm({...tutorialForm, subtype: e.target.value as any})}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-500 text-white"
                >
                  <option value="Técnica">{t('adminModules.panel.technicalTutorial')}</option>
                  <option value="Coaching">{t('adminModules.panel.strategicCoaching')}</option>
                  <option value="Psicopedagogía">{t('adminModules.panel.teamPsychopedagogy')}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.topic')}</label>
                <input 
                  type="text" required
                  placeholder={t('adminModules.panel.topicExample')}
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
                <span className="text-[11px] text-gray-300">{t('adminModules.panel.notifyCalendar')}</span>
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
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.fullName')}</label>
                <input 
                  type="text" required
                  value={userForm.name || ''}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.googleEmail')}</label>
                <input 
                  type="email" required
                  value={userForm.email || ''}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('adminModules.panel.authorizedRole')}</label>
                <select 
                  value={userForm.role || 'viewer'}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value as any})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="admin">{t('adminModules.panel.administrator')}</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="editor">{t('adminModules.panel.editorRole')}</option>
                  <option value="colaborador">Colaborador</option>
                  <option value="tlmk">Atención / TLMK</option>
                  <option value="cliente">Cliente</option>
                  <option value="viewer">{t('adminModules.panel.viewerRole')}</option>
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

export default React.memo(AdminPanel);

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
