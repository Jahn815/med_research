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

/**
 * Sends an automated, anonymous email via Firebase Cloud Firestore '/mail' trigger collection
 * Collection: 'mail'
 */
export async function sendEmailViaFirebase(
  to: string,
  subject: string,
  bodyText: string
): Promise<{ success: boolean; message: string; docId: string; log: string }> {
  let log = `[${new Date().toLocaleTimeString()}] Firebase Email Trigger Initialized\n`;
  log += `Target Recipient: ${to}\nFirebase Project: ${firebaseConfig.projectId}\nCollection: /mail\n`;

  try {
    const recipients = to
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.includes('@'));

    if (recipients.length === 0) {
      const err = '유효한 이메일 주소를 입력해주세요.';
      log += `[ERROR] ${err}\n`;
      return {
        success: false,
        message: err,
        docId: '',
        log,
      };
    }

    const mailRef = doc(collection(db, 'mail'));
    const mailPayload = {
      to: recipients,
      message: {
        subject: subject,
        text: bodyText,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">${bodyText.replace(/\n/g, '<br/>')}</div>`,
      },
      createdAt: serverTimestamp(),
      createdAtIso: new Date().toISOString(),
      sender: 'Maldeodeum Research Team',
    };

    log += `[Firestore WRITE] Document Path: /mail/${mailRef.id}\n`;
    log += `Payload: To [${recipients.join(', ')}], Subject: "${subject}"\n`;

    await setDoc(mailRef, mailPayload);

    log += `[SUCCESS] Document created in Firestore /mail collection with ID: ${mailRef.id}\n`;

    return {
      success: true,
      message: '파이어베이스(Firebase)를 통해 이메일 발송 요청이 성공적으로 완료되었습니다! ✉️',
      docId: mailRef.id,
      log,
    };
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    log += `[EXCEPTION] Firebase write failed: ${errorMsg}\n`;
    console.error('[Firebase] Email trigger error:', errorMsg);
    return {
      success: false,
      message: `파이어베이스 이메일 발송 오류: ${errorMsg}`,
      docId: '',
      log,
    };
  }
}
