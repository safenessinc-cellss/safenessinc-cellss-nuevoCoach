import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type Role =
  | 'superadmin' | 'admin' | 'supervisor'
  | 'colaborador' | 'tlmk' | 'cliente'
  | 'editor' | 'viewer' | 'pending';
export type Status = 'pending' | 'active' | 'suspended';

export interface AuthInfo {
  uid: string;
  email: string;
  name: string;
  role: Role;
  status: Status;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  photoURL?: string;
}

interface AuthContextType {
  currentUser: AuthInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  can: (permission: string) => boolean;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SUPERADMIN_EMAILS = ['safeness.c.a@gmail.com'];

function buildAuthInfo(uid: string, email: string, name: string, role: Role, status: Status, photoURL?: string): AuthInfo {
  const isSuperAdmin = role === 'superadmin';
  const isAdmin = role === 'admin' || isSuperAdmin;
  return { uid, email, name, role, status, isAdmin, isSuperAdmin, photoURL };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try { localStorage.removeItem('rt_consultant_user'); } catch {}
    const unsub = onAuthStateChanged(auth, async (fu) => {
      setLoading(true);
      if (!fu) { setCurrentUser(null); setLoading(false); return; }
      try {
        const email = (fu.email || '').toLowerCase();
        let role: Role = 'pending';
        let status: Status = 'pending';
        let displayName = fu.displayName || email.split('@')[0] || 'Usuario';
        const ref = doc(db, 'users', fu.uid);
        try {
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const d = snap.data() as any;
            if (d.role) role = d.role;
            if (d.status) status = d.status;
            if (d.name) displayName = d.name;
          } else if (!SUPERADMIN_EMAILS.includes(email)) {
            try {
              await setDoc(ref, {
                email,
                name: displayName,
                role: 'pending',
                status: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                requestedRole: 'colaborador',
              });
              role = 'pending';
              status = 'pending';
            } catch (createErr) {
              console.warn('auto-create /users failed', createErr);
            }
          }
        } catch (e) { console.warn('read /users failed', e); }
        if (SUPERADMIN_EMAILS.includes(email)) {
          role = 'superadmin';
          status = 'active';
        }
        setCurrentUser(buildAuthInfo(fu.uid, email, displayName, role, status, fu.photoURL || undefined));
      } catch (e) {
        console.error('AuthContext error', e);
        setCurrentUser(null);
      } finally { setLoading(false); }
    });
    return () => unsub();
  }, []);

  const login = async (_e: string, _p: string): Promise<boolean> => {
    throw new Error('El acceso por contraseña está deshabilitado. Usa Google.');
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, p);
    return true;
  };

  const logout = async () => {
    try { localStorage.removeItem('rt_consultant_user'); } catch {}
    await signOut(auth);
    setCurrentUser(null);
  };

  const hasRole = (...roles: Role[]) => {
    if (!currentUser) return false;
    if (roles.includes(currentUser.role)) return true;
    if (currentUser.role === 'superadmin') return roles.some(r => r !== 'pending');
    return false;
  };

  const can = (permission: string): boolean => {
    if (!currentUser || currentUser.status !== 'active') return false;
    const MAP: Record<string, Role[]> = {
      'admin.view': ['superadmin', 'admin'],
      'users.approve': ['superadmin'],
      'users.edit': ['superadmin'],
      'clients.view_all': ['superadmin', 'admin', 'supervisor'],
      'clients.view_assigned': ['superadmin', 'admin', 'supervisor', 'colaborador', 'tlmk'],
      'courses.edit': ['superadmin', 'admin', 'editor'],
      'settings.edit': ['superadmin', 'admin'],
    };
    return (MAP[permission] || []).includes(currentUser.role);
  };

  const value = useMemo(
    () => ({ currentUser, loading, login, loginWithGoogle, logout, can, hasRole }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
