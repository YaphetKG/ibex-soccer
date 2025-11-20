import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc,
  doc,
  query, 
  orderBy,
  onSnapshot,
  FirestoreError
} from 'firebase/firestore';
import { TeamEvent, HistoryItem, RecruitProfile, SquadMember } from '../types';

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBbWYXn6Ax7t4XuuxRzLVzs84xM0Fscmqc",
  authDomain: "ibex-soccer.firebaseapp.com",
  projectId: "ibex-soccer",
  storageBucket: "ibex-soccer.firebasestorage.app",
  messagingSenderId: "1078255111676",
  appId: "1:1078255111676:web:692c1080ec212a0f6bf679",
  measurementId: "G-CZMTY2WY4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

/* 
  NOTE: Ensure your Firestore Security Rules allow read/write access 
  or implement authentication for the Admin panel to be fully secure.
*/

// --- EVENTS ---
export const subscribeToEvents = (
  callback: (events: TeamEvent[]) => void, 
  onError?: (error: FirestoreError) => void
) => {
  const q = query(collection(db, 'events'), orderBy('date', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamEvent));
    callback(events);
  }, (error) => {
    console.error("Error subscribing to events:", error);
    if (onError) onError(error);
  });
};

export const addEvent = async (event: Omit<TeamEvent, 'id'>) => {
  await addDoc(collection(db, 'events'), event);
};

// --- HISTORY ---
export const subscribeToHistory = (
  callback: (history: HistoryItem[]) => void,
  onError?: (error: FirestoreError) => void
) => {
  const q = query(collection(db, 'history'), orderBy('year', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoryItem));
    callback(history);
  }, (error) => {
    console.error("Error subscribing to history:", error);
    if (onError) onError(error);
  });
};

export const addHistoryItem = async (item: Omit<HistoryItem, 'id'>) => {
  await addDoc(collection(db, 'history'), item);
};

// --- RECRUITS & SQUAD ---
export const addRecruit = async (recruit: Omit<RecruitProfile, 'id' | 'status' | 'submittedAt'>) => {
  await addDoc(collection(db, 'recruits'), {
    ...recruit,
    status: 'PENDING',
    submittedAt: new Date().toISOString()
  });
};

export const subscribeToRecruits = (
  callback: (recruits: RecruitProfile[]) => void,
  onError?: (error: FirestoreError) => void
) => {
  const q = query(collection(db, 'recruits'), orderBy('submittedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const recruits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RecruitProfile));
    callback(recruits);
  }, (error) => {
    console.error("Error subscribing to recruits:", error);
    if (onError) onError(error);
  });
};

export const approveRecruit = async (recruitId: string, recruitData: RecruitProfile) => {
  try {
    // 1. Update recruit status
    const recruitRef = doc(db, 'recruits', recruitId);
    await updateDoc(recruitRef, { status: 'APPROVED' });

    // 2. Add to Squad collection
    const newSquadMember: Omit<SquadMember, 'id'> = {
      name: recruitData.name,
      position: recruitData.position,
      number: Math.floor(Math.random() * 99) + 1, // Assign random kit number
      joinedDate: new Date().toISOString().split('T')[0]
    };
    await addDoc(collection(db, 'squad'), newSquadMember);
  } catch (e) {
    console.error("Error approving recruit:", e);
    throw e;
  }
};

export const subscribeToSquad = (
  callback: (squad: SquadMember[]) => void,
  onError?: (error: FirestoreError) => void
) => {
  const q = query(collection(db, 'squad'), orderBy('number', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const squad = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SquadMember));
    callback(squad);
  }, (error) => {
    console.error("Error subscribing to squad:", error);
    if (onError) onError(error);
  });
};