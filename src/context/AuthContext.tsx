import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export interface AuthInfo {
  email: string;
  name: string;
  role: 'admin' | 'viewer';
  uid?: string;
}

interface AuthContextType {
  currentUser: AuthInfo | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || '';
        // If email is safeness.c.a@gmail.com or robert@teran.com, it is an ADMIN
        const isAdminEmail = email.toLowerCase() === 'safeness.c.a@gmail.com' || email.toLowerCase() === 'robert@teran.com';
        
        const authUser: AuthInfo = {
          email: email,
          name: firebaseUser.displayName || email.split('@')[0],
          role: isAdminEmail ? 'admin' : 'viewer',
          uid: firebaseUser.uid
        };
        setCurrentUser(authUser);
        setLoading(false);
      } else {
        // Fallback to simulated local storage credentials if no Firebase user logged in
        const savedUser = localStorage.getItem('rt_consultant_user');
        if (savedUser) {
          try {
            setCurrentUser(JSON.parse(savedUser));
          } catch (e) {
            console.error("Failed to parse saved user credentials:", e);
            localStorage.removeItem('rt_consultant_user');
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    
    if (cleanEmail === 'safeness.c.a@gmail.com' && password === 'Mustafa@5500') {
      const authUser: AuthInfo = {
        email: 'safeness.c.a@gmail.com',
        name: 'Administrador Senior',
        role: 'admin'
      };
      localStorage.setItem('rt_consultant_user', JSON.stringify(authUser));
      setCurrentUser(authUser);
      setLoading(false);
      return true;
    } else {
      setLoading(false);
      throw new Error("Credenciales inválidas. Intente con safeness.c.a@gmail.com / Mustafa@5500 o inicie sesión con Google.");
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      await signInWithPopup(auth, provider);
      setLoading(false);
      return true;
    } catch (e: any) {
      setLoading(false);
      console.error("Failed Google Login:", e);
      throw e;
    }
  };

  const logout = async () => {
    localStorage.removeItem('rt_consultant_user');
    await signOut(auth);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
