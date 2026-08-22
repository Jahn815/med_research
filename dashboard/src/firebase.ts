import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Firebase configuration using environment variables or fallback values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAeEkILjMg4XWLYk3AbAeICJW6t72HDXWs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "med-research-e4ae6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "med-research-e4ae6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "med-research-e4ae6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "196756062260",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:196756062260:web:850302c2bd7b998c3d0a61"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface FirestoreSurveyDoc {
  id: string;
  answers: Record<string, any>;
  scores: {
    consentAgreed?: boolean;
    sbisTotalScore?: number;
    sbisMaxScore?: number;
    pprsImpactAvg?: number;
    pprsConcernAvg?: number;
    pprsKnowledgeAvg?: number;
    totalAnsweredCount?: number;
    totalQuestionsCount?: number;
    factor1?: {
      score: number;
      levelLabelKr?: string;
      rangeInfo?: {
        rangeLabel: string;
        badgeColor: string;
        descriptionKr: string;
      };
      itemDetails?: Array<{
        qNum: number;
        text: string;
        value: number | null;
        weight: number;
        weightedValue: number;
      }>;
    };
    factor2?: {
      score: number;
      levelLabelKr?: string;
      rangeInfo?: {
        rangeLabel: string;
        badgeColor: string;
        descriptionKr: string;
      };
      itemDetails?: Array<{
        qNum: number;
        text: string;
        value: number | null;
        weight: number;
        weightedValue: number;
      }>;
    };
    factor3?: {
      score: number;
      levelLabelKr?: string;
      rangeInfo?: {
        rangeLabel: string;
        badgeColor: string;
        descriptionKr: string;
      };
      itemDetails?: Array<{
        qNum: number;
        text: string;
        value: number | null;
        weight: number;
        weightedValue: number;
      }>;
    };
    sbis?: {
      totalScore: number;
      rangeInfo?: {
        rangeLabel: string;
        badgeColor: string;
        descriptionKr: string;
      };
      itemDetails?: Array<{
        id: number;
        qNum: number;
        text: string;
        value: number | null;
        score: number;
        selectedLabel: string;
      }>;
    };
  };
  locale?: string;
  submittedAtIso?: string;
  createdAt?: any;
  metadata?: {
    platform?: string;
    userAgent?: string;
  };
}

/**
 * Fetch all survey responses from Cloud Firestore
 */
export async function fetchSurveyResponses(): Promise<FirestoreSurveyDoc[]> {
  try {
    const responsesRef = collection(db, 'survey_responses');
    const q = query(responsesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const docs: FirestoreSurveyDoc[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      docs.push({
        id: doc.id,
        ...data,
      } as FirestoreSurveyDoc);
    });

    return docs;
  } catch (error) {
    console.error('Error fetching survey responses from Firestore:', error);
    // Fallback: try fetching without ordering if index is missing
    try {
      const responsesRef = collection(db, 'survey_responses');
      const snapshot = await getDocs(responsesRef);
      const docs: FirestoreSurveyDoc[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          ...data,
        } as FirestoreSurveyDoc);
      });
      return docs;
    } catch (fallbackError) {
      console.error('Fallback fetch also failed:', fallbackError);
      throw fallbackError;
    }
  }
}

/**
 * Utility function to seed sample survey responses into Firestore
 */
export async function seedSampleSurveyResponse(payload: Omit<FirestoreSurveyDoc, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'survey_responses'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
