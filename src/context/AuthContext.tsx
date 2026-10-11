import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrapAdmin: (email: string, pass: string) => Promise<void>;
  authError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Master designated administrator email
export const MASTER_ADMIN_EMAIL = 'sahabsandhu455@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check if user is designated admin email or in admins collection
        if (user.email === MASTER_ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            setIsAdmin(adminDoc.exists());
          } catch (err) {
            console.warn('Error checking admin status:', err);
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please verify credentials.';
      setAuthError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setIsAdmin(false);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Safe bootstrapping helper for the master administrator
  const bootstrapAdmin = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await setDoc(doc(db, 'admins', cred.user.uid), {
        email: cred.user.email,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      });
      setIsAdmin(true);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        // Fallback to normal sign in if already exists
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        setAuthError(err.message || 'Admin bootstrapping failed');
        throw err;
      }
    }
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        login,
        logout,
        bootstrapAdmin,
        authError,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
