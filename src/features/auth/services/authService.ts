import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import type { AppUser, UserRole } from '../types';

const googleProvider = new GoogleAuthProvider();

/**
 * Ensures the user exists in Firestore and returns their role
 */
async function syncUserWithFirestore(user: FirebaseUser): Promise<AppUser> {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();
  const isPredefinedAdmin = user.email?.toLowerCase() === adminEmail;
  
  let role: UserRole = isPredefinedAdmin ? 'admin' : 'user';

  if (userSnap.exists()) {
    // User exists, read their role (in case we want to support dynamic roles later)
    // We still force 'admin' if their email matches the env var
    const data = userSnap.data();
    if (data.role === 'admin') role = 'admin'; 
    
    return {
      id: user.uid,
      email: user.email!,
      role,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } else {
    // Create new user record
    const newUser: AppUser = {
      id: user.uid,
      email: user.email!,
      role,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    
    await setDoc(userRef, newUser);
    return newUser;
  }
}

export const authService = {
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  },

  onAuthChange: (callback: (user: AppUser | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const appUser = await syncUserWithFirestore(firebaseUser);
          callback(appUser);
        } catch (error) {
          console.error("Error syncing user with Firestore", error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
};
