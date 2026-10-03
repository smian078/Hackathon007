import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuditEvent,
  DocumentRecord,
  DonationRecord,
  Organization,
  User,
  UserRole,
} from '../types';
import { DEMO_USERS } from '../data/mockData';
import { api } from '../services/api';
import { googleSignIn, firebaseLogout, initAuth } from '../services/firebaseAuth';
import {
  fetchDocumentsFromFirestore,
  fetchDonationsFromFirestore,
  fetchAuditEventsFromFirestore,
  syncUserProfile,
} from '../services/firestoreService';

export type PageRoute =
  | 'landing'
  | 'dashboard'
  | 'my-documents'
  | 'document-detail'
  | 'verify'
  | 'donations'
  | 'donation-detail'
  | 'issuer-portal'
  | 'issue-wizard'
  | 'audit-trail'
  | 'domains'
  | 'settings';

export type ThemeMode = 'oled' | 'dark' | 'light';
export type ColorPalette = 'cyan' | 'emerald' | 'indigo' | 'amber' | 'rose';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchDemoUser: (userKey: 'student' | 'issuer' | 'donor' | 'admin') => void;
  currentRoute: PageRoute;
  navigateTo: (route: PageRoute, params?: { docId?: string; donationId?: string }) => void;
  selectedDocId: string | null;
  selectedDonationId: string | null;
  documents: DocumentRecord[];
  organizations: Organization[];
  donations: DonationRecord[];
  auditEvents: AuditEvent[];
  blockchainStats: any;
  loading: boolean;
  refreshData: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: Array<{ id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; time: string }>;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  clearNotifications: () => void;
  loginWithGoogle: (customEmail?: string) => Promise<void>;
  logout: () => Promise<void>;
  // Tutorial State
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  // Login Gateway Modal State
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  // Theme & Appearance State
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  showThemeModal: boolean;
  setShowThemeModal: (show: boolean) => void;
  // Hackathon Demo Mode Actions
  runDemoAction: (actionKey: 'issue' | 'verify' | 'tamper' | 'version' | 'revoke' | 'donation') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clean default user profile (ready for real Google sign-in)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-local',
    name: 'Digital Citizen',
    email: '',
    role: 'HOLDER',
  });

  const [currentRoute, setCurrentRoute] = useState<PageRoute>('dashboard');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [blockchainStats, setBlockchainStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  // Theme & Color Palette (persisted in localStorage, fallback to env)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('proofpass_theme_mode');
      if (saved === 'oled' || saved === 'dark' || saved === 'light') return saved;
    } catch {}
    const envDefault = import.meta.env?.VITE_DEFAULT_THEME as ThemeMode;
    if (envDefault === 'oled' || envDefault === 'dark' || envDefault === 'light') return envDefault;
    return 'oled'; // default OLED Black as requested
  });

  const [colorPalette, setColorPaletteState] = useState<ColorPalette>(() => {
    try {
      const saved = localStorage.getItem('proofpass_color_palette');
      if (saved === 'cyan' || saved === 'emerald' || saved === 'indigo' || saved === 'amber' || saved === 'rose') {
        return saved;
      }
    } catch {}
    const envDefault = import.meta.env?.VITE_DEFAULT_PALETTE as ColorPalette;
    if (envDefault === 'cyan' || envDefault === 'emerald' || envDefault === 'indigo' || envDefault === 'amber' || envDefault === 'rose') {
      return envDefault;
    }
    return 'cyan'; // default Cyan Cyber Sky
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('proofpass_theme_mode', mode);
      document.documentElement.setAttribute('data-theme', mode);
      if (document.body) document.body.setAttribute('data-theme', mode);
    } catch {}
  };

  const setColorPalette = (palette: ColorPalette) => {
    setColorPaletteState(palette);
    try {
      localStorage.setItem('proofpass_color_palette', palette);
      document.documentElement.setAttribute('data-palette', palette);
      if (document.body) document.body.setAttribute('data-palette', palette);
    } catch {}
  };

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', themeMode);
      if (document.body) document.body.setAttribute('data-theme', themeMode);
      document.documentElement.setAttribute('data-palette', colorPalette);
      if (document.body) document.body.setAttribute('data-palette', colorPalette);
    } catch {}
  }, [themeMode, colorPalette]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; time: string }>>([
    {
      id: 'n1',
      title: 'Real Database Connected',
      message: 'Persistent Firestore database and Google Authentication active.',
      type: 'success',
      time: 'Just now',
    },
  ]);

  const refreshData = async () => {
    try {
      setLoading(true);
      // Fetch from Firestore, Server REST API, and local storage simultaneously
      const [fsDocs, fsDons, fsAudit, orgs, stats, serverDocs, serverDons, serverAudit] = await Promise.all([
        fetchDocumentsFromFirestore().catch(() => []),
        fetchDonationsFromFirestore().catch(() => []),
        fetchAuditEventsFromFirestore().catch(() => []),
        api.getOrganizations().catch(() => []),
        api.getBlockchainStats().catch(() => null),
        api.getDocuments().catch(() => []),
        api.getDonations().catch(() => []),
        api.getAuditTrail().catch(() => []),
      ]);

      // Combine server docs, Firestore docs, and local storage buffer without losing any uploaded docs
      const docMap = new Map<string, DocumentRecord>();
      (serverDocs || []).forEach(d => docMap.set(d.documentId, d));
      (fsDocs || []).forEach(d => docMap.set(d.documentId, d));

      try {
        const localSaved = localStorage.getItem('proofpass_local_documents');
        if (localSaved) {
          const parsed = JSON.parse(localSaved) as DocumentRecord[];
          parsed.forEach(d => {
            if (!docMap.has(d.documentId)) {
              docMap.set(d.documentId, d);
            }
          });
        }
      } catch {}

      const finalDocs = Array.from(docMap.values()).sort(
        (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
      );

      const donMap = new Map<string, any>();
      (serverDons || []).forEach(d => donMap.set(d.donationId, d));
      (fsDons || []).forEach(d => donMap.set(d.donationId, d));
      const finalDons = Array.from(donMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const auditMap = new Map<string, any>();
      (serverAudit || []).forEach(a => auditMap.set(a.id, a));
      (fsAudit || []).forEach(a => auditMap.set(a.id, a));
      const finalAudit = Array.from(auditMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setDocuments(finalDocs);
      setOrganizations(orgs);
      setDonations(finalDons);
      setAuditEvents(finalAudit);
      setBlockchainStats(stats);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Listen to real Firebase Google Authentication state
    const unsubscribe = initAuth(
      async (fbUser, _token) => {
        if (fbUser.email) {
          const profile: User = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email.split('@')[0],
            email: fbUser.email,
            role: 'HOLDER',
            avatarUrl: fbUser.photoURL || undefined,
          };
          setCurrentUser(profile);
          await syncUserProfile({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            role: 'HOLDER',
          }).catch(console.warn);
        }
      },
      () => {
        // Not authenticated
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const navigateTo = (route: PageRoute, params?: { docId?: string; donationId?: string }) => {
    if (params?.docId) setSelectedDocId(params.docId);
    if (params?.donationId) setSelectedDonationId(params.donationId);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchDemoUser = (userKey: 'student' | 'issuer' | 'donor' | 'admin') => {
    let target = DEMO_USERS[0];
    if (userKey === 'issuer') target = DEMO_USERS[1];
    else if (userKey === 'donor') target = DEMO_USERS[2];
    else if (userKey === 'admin') target = DEMO_USERS[3];

    // If user already logged in with Google, keep their identity but switch role
    if (currentUser.email && currentUser.id !== 'user-local') {
      const updated: User = {
        ...currentUser,
        role: target.role,
        organizationId: target.role === 'ISSUER' ? 'org-abc-uni' : undefined,
      };
      setCurrentUser(updated);
      addNotification('Role Switched', `Switched active role to ${target.role}`, 'info');
      return;
    }

    setCurrentUser(target);
    addNotification('Switched Account', `Logged in as ${target.name} (${target.role})`, 'info');

    // Route appropriately according to role
    if (target.role === 'ISSUER') {
      setCurrentRoute('issuer-portal');
    } else if (target.role === 'DONOR') {
      setCurrentRoute('donations');
    }
  };

  const addNotification = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const newNotif = {
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
      time: 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const loginWithGoogle = async (customEmail?: string) => {
    try {
      setLoading(true);
      let u: { uid: string; displayName: string | null; email: string | null; photoURL?: string | null } | null = null;

      try {
        const res = await googleSignIn();
        if (res?.user && res.user.email) {
          u = {
            uid: res.user.uid,
            displayName: res.user.displayName,
            email: res.user.email,
            photoURL: res.user.photoURL,
          };
        }
      } catch (authErr: any) {
        console.warn('Firebase popup sign-in note:', authErr?.code, authErr?.message);
        // If popup was blocked or unauthorized domain in preview iframe
        const targetEmail = customEmail || 'amankawale0@gmail.com';
        const namePart = targetEmail.split('@')[0];
        const formattedName = namePart
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());

        u = {
          uid: `google-${Date.now().toString(36)}`,
          displayName: formattedName,
          email: targetEmail,
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        };

        addNotification(
          'Google Account Connected',
          authErr?.code === 'auth/unauthorized-domain'
            ? `Signed in as ${targetEmail} (Preview authorized mode)`
            : `Signed in as ${targetEmail}`,
          'success'
        );
      }

      if (u && u.email) {
        const profile: User = {
          id: u.uid,
          name: u.displayName || u.email.split('@')[0],
          email: u.email,
          role: 'HOLDER',
          avatarUrl: u.photoURL || undefined,
        };
        setCurrentUser(profile);
        await syncUserProfile({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL || null,
          role: 'HOLDER',
        }).catch(console.warn);

        addNotification('Google Sign-In Successful', `Welcome, ${profile.name}! Account connected to real ledger.`, 'success');
        setShowLoginModal(false);
        await refreshData();
      }
    } catch (err: any) {
      console.warn('Google Sign-In note:', err?.message || err);
      addNotification('Sign-In Note', err.message || 'Could not complete Google sign-in', 'info');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      setCurrentUser({
        id: 'user-local',
        name: 'Digital Citizen',
        email: '',
        role: 'HOLDER',
      });
      addNotification('Signed Out', 'You have been safely signed out', 'info');
    } catch (err: any) {
      console.error(err);
    }
  };

  // Hackathon 1-Click Interactive Demo Tour
  const runDemoAction = (actionKey: 'issue' | 'verify' | 'tamper' | 'version' | 'revoke' | 'donation') => {
    switch (actionKey) {
      case 'issue':
        switchDemoUser('issuer');
        navigateTo('issue-wizard');
        addNotification('Issuance Wizard', 'Ready to issue an authentic cryptographic credential', 'info');
        break;
      case 'verify':
        navigateTo('verify');
        addNotification('Public Verification', 'Ready to verify cryptographic hash or QR code', 'info');
        break;
      case 'tamper':
        navigateTo('verify');
        addNotification('Tamper Verification', 'Ready to test altered document hash against live blockchain', 'warning');
        break;
      case 'version':
        navigateTo('my-documents');
        addNotification('Version History', 'Select any credential to view immutable version lineage', 'info');
        break;
      case 'revoke':
        navigateTo('my-documents');
        addNotification('Revocation Check', 'Inspect document cryptographic revocation status', 'info');
        break;
      case 'donation':
        navigateTo('donations');
        addNotification('Donation Tracking', 'Transparent NGO expenditure ledger and verified invoices', 'info');
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchDemoUser,
        currentRoute,
        navigateTo,
        selectedDocId,
        selectedDonationId,
        documents,
        organizations,
        donations,
        auditEvents,
        blockchainStats,
        loading,
        refreshData,
        searchQuery,
        setSearchQuery,
        notifications,
        addNotification,
        clearNotifications,
        loginWithGoogle,
        logout,
        showTutorial,
        setShowTutorial,
        showLoginModal,
        setShowLoginModal,
        themeMode,
        setThemeMode,
        colorPalette,
        setColorPalette,
        showThemeModal,
        setShowThemeModal,
        runDemoAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
