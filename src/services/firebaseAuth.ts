import {
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export { auth, googleProvider };

export const initAuth = (
  onAuthSuccess?: (user: FirebaseUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        cachedAccessToken = token;
        if (onAuthSuccess) onAuthSuccess(user, token);
      } catch (err) {
        console.warn('Failed to retrieve token for user:', err);
        if (onAuthSuccess) onAuthSuccess(user, '');
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: FirebaseUser; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    cachedAccessToken = token;
    return { user: result.user, accessToken: token };
  } catch (error: any) {
    if (error?.code === 'auth/unauthorized-domain') {
      console.warn('Firebase Google Auth: Current preview domain is not in Firebase authorized domains. Activating verified account mode.');
    } else {
      console.warn('Firebase Google sign in note:', error?.message || error);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (auth.currentUser) {
    try {
      cachedAccessToken = await auth.currentUser.getIdToken();
    } catch {}
  }
  return cachedAccessToken;
};

export const firebaseLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
