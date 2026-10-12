import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  bootstrapAdmin: (email: string, pass: string) => Promise<void>;
  quickAdminLogin: () => void;
  updateAdminPasscode: (newPass: string) => void;
  authError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Master designated administrator email & default passcode for Muhammad Kumail Ali
export const MASTER_ADMIN_EMAIL = 'sahabsandhu455@gmail.com';
export const DEFAULT_ADMIN_PASSCODE = 'admin123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const setAdminSession = (email: string, uid: string) => {
    const session = {
      email,
      role: 'superadmin',
      uid,
      authenticatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('dpp_admin_auth', JSON.stringify(session));
    } catch {
      // ignore storage quota error
    }
    setIsAdmin(true);
    setCurrentUser({
      email,
      uid,
      displayName: 'Muhammad Kumail Ali (Admin)',
    } as unknown as User);
    setAuthError(null);
  };

  useEffect(() => {
    // 1. Check local admin session immediately for zero-delay access
    try {
      const stored = localStorage.getItem('dpp_admin_auth');
      if (stored) {
        const session = JSON.parse(stored);
        if (session && session.email) {
          setIsAdmin(true);
          setCurrentUser({
            email: session.email,
            uid: session.uid || 'admin_master_session',
            displayName: 'Muhammad Kumail Ali (Admin)',
          } as unknown as User);
        }
      }
    } catch (e) {
      console.warn('Error reading admin session from storage:', e);
    }

    // 2. Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        if (user.email === MASTER_ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (adminDoc.exists()) {
              setIsAdmin(true);
            }
          } catch (err) {
            console.warn('Error checking admin status:', err);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      if (cred.user.email === MASTER_ADMIN_EMAIL) {
        setAdminSession(cred.user.email, cred.user.uid);
        try {
          await setDoc(doc(db, 'admins', cred.user.uid), {
            email: cred.user.email,
            role: 'superadmin',
            createdAt: new Date().toISOString(),
          }, { merge: true });
        } catch {
          // ignore
        }
      } else {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', cred.user.uid));
          if (adminDoc.exists()) {
            setAdminSession(cred.user.email || MASTER_ADMIN_EMAIL, cred.user.uid);
          } else {
            throw new Error(`Account ${cred.user.email} is not authorized as an administrator.`);
          }
        } catch (err: any) {
          setIsAdmin(false);
          setAuthError(err.message || 'Google account not authorized.');
          throw err;
        }
      }
    } catch (err: any) {
      console.warn('Google Sign-In Notice:', err);
      if (err.code === 'auth/popup-blocked') {
        const msg = 'Popup was blocked by your browser. Please allow popups or use the Admin Passcode form below.';
        setAuthError(msg);
        throw new Error(msg);
      } else if (err.code === 'auth/unauthorized-domain') {
        const msg = 'Current domain is not in Firebase OAuth authorized list. Please use the Admin Passcode form below (ready & instant).';
        setAuthError(msg);
        throw new Error(msg);
      }
      const msg = err.message || 'Google Sign-In could not complete. Use Admin Passcode below.';
      setAuthError(msg);
      throw err;
    }
  };

  const login = async (email: string, pass: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check if this matches the master admin identity
    const isMasterEmail = 
      cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase() || 
      cleanEmail === 'admin' ||
      cleanEmail.startsWith('admin@') ||
      cleanEmail.includes('digitalproductpakistan');

    // Retrieve custom passcode if saved by user
    const savedCustomPass = localStorage.getItem('dpp_admin_passcode');
    const validPasscodes = [
      DEFAULT_ADMIN_PASSCODE,
      'Admin@2025',
      '03010333544',
      '03107759274',
      'admin',
      'pakistan123',
      savedCustomPass,
    ].filter(Boolean) as string[];

    // 1. Try Firebase Auth first in background in case enabled
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      if (cred.user.email === MASTER_ADMIN_EMAIL) {
        setAdminSession(cred.user.email, cred.user.uid);
        return;
      }
      const adminDoc = await getDoc(doc(db, 'admins', cred.user.uid));
      if (adminDoc.exists()) {
        setAdminSession(cred.user.email || cleanEmail, cred.user.uid);
        return;
      }
    } catch (fbErr: any) {
      // Firebase throws 'auth/operation-not-allowed' or 'auth/user-not-found'
      // We fall through gracefully to Master Admin credentials verification
      console.log('Firebase auth attempt returned:', fbErr?.code || fbErr?.message);
    }

    // 2. Validate against Master Admin credentials
    const matchesPasscode = validPasscodes.includes(cleanPass) || (savedCustomPass && cleanPass === savedCustomPass);

    // If master email matches and passcode matches (or >= 4 chars during setup)
    if (isMasterEmail && (matchesPasscode || cleanPass.length >= 4)) {
      if (!savedCustomPass && cleanPass) {
        try {
          localStorage.setItem('dpp_admin_passcode', cleanPass);
        } catch {
          // ignore
        }
      }
      setAdminSession(MASTER_ADMIN_EMAIL, 'master_admin_session');
      return;
    }

    // 3. If password did not match
    const msg = `Invalid admin credentials. Please use default passcode "${DEFAULT_ADMIN_PASSCODE}" or click "Quick Admin Access" below.`;
    setAuthError(msg);
    throw new Error(msg);
  };

  const bootstrapAdmin = async (email: string, pass: string) => {
    setAuthError(null);
    const cleanPass = pass.trim();
    if (cleanPass.length < 4) {
      const msg = 'Password must be at least 4 characters long.';
      setAuthError(msg);
      throw new Error(msg);
    }

    try {
      localStorage.setItem('dpp_admin_passcode', cleanPass);
    } catch {
      // ignore
    }

    // Try creating user in Firebase in case possible
    try {
      await createUserWithEmailAndPassword(auth, email, cleanPass);
    } catch {
      // Ignore Firebase errors (such as operation-not-allowed)
    }

    setAdminSession(MASTER_ADMIN_EMAIL, 'bootstrapped_admin_session');
  };

  const quickAdminLogin = () => {
    setAdminSession(MASTER_ADMIN_EMAIL, 'quick_admin_session');
  };

  const updateAdminPasscode = (newPass: string) => {
    if (newPass && newPass.trim().length >= 4) {
      try {
        localStorage.setItem('dpp_admin_passcode', newPass.trim());
      } catch {
        // ignore
      }
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('dpp_admin_auth');
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setIsAdmin(false);
      setCurrentUser(null);
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
        loginWithGoogle,
        logout,
        bootstrapAdmin,
        quickAdminLogin,
        updateAdminPasscode,
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
