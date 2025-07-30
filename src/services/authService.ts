import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
  type AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from './firebase';
import type { User, LoginForm, RegisterForm } from '../types';

// Convert Firebase user to our User type
async function convertFirebaseUser(firebaseUser: FirebaseUser): Promise<User | null> {
  if (!firebaseUser) return null;

  // Get additional user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || undefined,
    phoneNumber: firebaseUser.phoneNumber || undefined,
    address: userData?.address,
    createdAt: userData?.createdAt?.toDate() || new Date(),
    updatedAt: userData?.updatedAt?.toDate() || new Date(),
  };
}

// Save/update user data in Firestore
async function saveUserToFirestore(user: FirebaseUser, additionalData?: any) {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Create new user document
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...additionalData,
    });
  } else {
    // Update existing user document
    await setDoc(userRef, {
      ...userDoc.data(),
      updatedAt: new Date(),
      ...additionalData,
    }, { merge: true });
  }
}

// Error handling
function handleAuthError(error: AuthError): Error {
  switch (error.code) {
    case 'auth/user-not-found':
      return new Error('Không tìm thấy tài khoản với email này');
    case 'auth/wrong-password':
      return new Error('Mật khẩu không đúng');
    case 'auth/email-already-in-use':
      return new Error('Email này đã được sử dụng');
    case 'auth/weak-password':
      return new Error('Mật khẩu quá yếu');
    case 'auth/invalid-email':
      return new Error('Email không hợp lệ');
    case 'auth/popup-closed-by-user':
      return new Error('Đăng nhập bị hủy');
    case 'auth/cancelled-popup-request':
      return new Error('Đăng nhập bị hủy');
    default:
      return new Error(error.message || 'Đã xảy ra lỗi không xác định');
  }
}

// Email/Password Authentication
export async function signInWithEmail({ email, password }: LoginForm): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(result.user);
    const user = await convertFirebaseUser(result.user);
    if (!user) throw new Error('Failed to convert user data');
    return user;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
}

export async function signUpWithEmail({ email, password, displayName }: RegisterForm): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(result.user, { displayName });
    
    // Save user data to Firestore
    await saveUserToFirestore(result.user, { displayName });
    
    const user = await convertFirebaseUser(result.user);
    if (!user) throw new Error('Failed to convert user data');
    return user;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
}

// Social Authentication
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(result.user);
    const user = await convertFirebaseUser(result.user);
    if (!user) throw new Error('Failed to convert user data');
    return user;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
}

export async function signInWithFacebook(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    await saveUserToFirestore(result.user);
    const user = await convertFirebaseUser(result.user);
    if (!user) throw new Error('Failed to convert user data');
    return user;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
}

// Get current user
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        const user = await convertFirebaseUser(firebaseUser);
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
}

// Auth state listener
export function onAuthStateChanged(callback: (user: User | null) => void) {
  return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await convertFirebaseUser(firebaseUser);
      callback(user);
    } else {
      callback(null);
    }
  });
} 