import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { PalinAnswers } from '../types/palinSurvey';
import { PalinScores } from './palinSurveyService';

// Firebase configuration keys (loaded from environment variables or fallback configuration)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAeEkILjMg4XWLYk3AbAeICJW6t72HDXWs",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "med-research-e4ae6.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "med-research-e4ae6",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "med-research-e4ae6.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "196756062260",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:196756062260:web:850302c2bd7b998c3d0a61"
};

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore database instance
export const db = getFirestore(app);

export interface SaveSurveyResponsePayload {
  answers: PalinAnswers;
  scores: PalinScores;
  locale?: string;
  metadata?: {
    platform?: string;
    userAgent?: string;
  };
}

/**
 * Utility function to recursively remove `undefined` fields for Firestore compatibility
 */
function removeUndefinedFields(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) => (value === undefined ? null : value)));
}

/**
 * Saves or merges a completed survey response and calculated scores to Cloud Firestore
 * Collection: 'survey_responses'
 * If existingDocId is provided, merges into that existing entry to prevent duplicate rows.
 */
export async function saveSurveyResponseToFirestore(
  payload: SaveSurveyResponsePayload,
  existingDocId?: string | null
): Promise<string> {
  try {
    const cleanPayload = removeUndefinedFields({
      answers: payload.answers || {},
      scores: payload.scores || {},
      locale: payload.locale || 'ko',
      updatedAtIso: new Date().toISOString(),
      metadata: payload.metadata || {}
    });

    if (existingDocId && existingDocId.trim() !== '') {
      const docRef = doc(db, 'survey_responses', existingDocId);
      await setDoc(docRef, {
        ...cleanPayload,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      console.log('[Firestore] Survey response merged for ID:', existingDocId);
      return existingDocId;
    } else {
      const docRef = doc(collection(db, 'survey_responses'));
      await setDoc(docRef, {
        ...cleanPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log('[Firestore] New survey response created with ID:', docRef.id);
      return docRef.id;
    }
  } catch (error: any) {
    console.error('[Firestore] Detailed error saving survey response:', error?.message || error);
    throw error;
  }
}
