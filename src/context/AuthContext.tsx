import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isConfigured, initFirebase } from '../firebase/config';
import { UserProfile, AgentInfo } from '../types/property';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isFirebaseActive: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsDemoAgent: (agentKey?: 'geraldine' | 'marcus' | 'sarah') => void;
  signOut: () => Promise<void>;
  isAgent: boolean;
  activeAgent: AgentInfo | null;
  reloadConfig: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_AGENTS: Record<string, AgentInfo> = {
  geraldine: {
    id: 'agent-gerald',
    name: 'Geraldine Tan',
    email: 'geraldine.tan@estateguru.pro',
    phone: '+65 9123 4567',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    agency: 'PropNex Premier Luxury Group',
    licenseNumber: 'R048291B',
    rating: 4.95,
    reviewsCount: 148
  },
  marcus: {
    id: 'agent-marcus',
    name: 'Marcus Chen',
    email: 'marcus.chen@estateguru.pro',
    phone: '+65 9876 5432',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    agency: 'ERA Luxury Homes Division',
    licenseNumber: 'R019842C',
    rating: 4.98,
    reviewsCount: 215
  },
  sarah: {
    id: 'agent-sarah',
    name: 'Sarah Lim',
    email: 'sarah.lim@estateguru.pro',
    phone: '+65 9345 6789',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    agency: 'Huttons Real Estate Group',
    licenseNumber: 'R055812A',
    rating: 4.92,
    reviewsCount: 89
  }
};

const USER_SESSION_KEY = 'estateguru_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseActive, setIsFirebaseActive] = useState(isConfigured);

  // Initialize from localStorage or Firebase Auth
  useEffect(() => {
    let unsubscribe = () => {};

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setFirebaseUser(fbUser);
          const userProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Real Estate Agent',
            photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            isAgent: true,
            agencyName: 'EstateGuru Premier Partners',
            licenseNumber: 'R0' + Math.floor(100000 + Math.random() * 900000) + 'X',
            phoneNumber: fbUser.phoneNumber || '+65 9800 1234'
          };
          setUser(userProfile);
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userProfile));
        } else {
          setFirebaseUser(null);
          // Check if there was a local mock session
          const stored = localStorage.getItem(USER_SESSION_KEY);
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });
    } else {
      // Mock / Local mode
      const stored = localStorage.getItem(USER_SESSION_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    if (auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Google User',
          photoURL: fbUser.photoURL,
          isAgent: true,
          agencyName: 'EstateGuru Verified Agency',
          licenseNumber: 'R0' + Math.floor(100000 + Math.random() * 900000) + 'A',
          phoneNumber: '+65 9123 8888'
        };
        setUser(profile);
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile));
        setLoading(false);
        return;
      } catch (err: unknown) {
        console.warn('Firebase popup failed or closed, falling back to simulated Google Login:', err);
      }
    }

    // High fidelity Google Auth simulation if Firebase credentials are pending or blocked in iframe
    const simulatedGoogleUser: UserProfile = {
      uid: 'google-user-' + Date.now().toString(36),
      email: 'alex.tan.property@gmail.com',
      displayName: 'Alex Tan',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      isAgent: true,
      agencyName: 'PropNex Realty International',
      licenseNumber: 'R067123D',
      phoneNumber: '+65 9777 8888'
    };
    setUser(simulatedGoogleUser);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(simulatedGoogleUser));
    setLoading(false);
  };

  const signInAsDemoAgent = (agentKey: 'geraldine' | 'marcus' | 'sarah' = 'geraldine') => {
    const agent = DEMO_AGENTS[agentKey];
    const profile: UserProfile = {
      uid: agent.id,
      email: agent.email,
      displayName: agent.name,
      photoURL: agent.photoUrl,
      isAgent: true,
      agencyName: agent.agency,
      licenseNumber: agent.licenseNumber,
      phoneNumber: agent.phone
    };
    setUser(profile);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile));
  };

  const signOut = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout error', e);
      }
    }
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem(USER_SESSION_KEY);
  };

  const reloadConfig = () => {
    const updated = initFirebase();
    setIsFirebaseActive(updated.isConfigured);
  };

  // Compute active agent info
  const activeAgent: AgentInfo | null = user ? {
    id: user.uid,
    name: user.displayName || 'Licensed Agent',
    email: user.email || 'agent@estateguru.pro',
    phone: user.phoneNumber || '+65 9123 4567',
    photoUrl: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    agency: user.agencyName || 'EstateGuru Premier Agency',
    licenseNumber: user.licenseNumber || 'R012345Z',
    rating: 4.95,
    reviewsCount: 68
  } : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isFirebaseActive,
        signInWithGoogle,
        signInAsDemoAgent,
        signOut,
        isAgent: !!user?.isAgent,
        activeAgent,
        reloadConfig,
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
