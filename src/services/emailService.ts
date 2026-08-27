import { sendEmailViaFirebase } from './firebase';

export interface SendEmailOptions {
  to: string;
  subject: string;
  bodyText: string;
  senderName?: string;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
  log: string;
  docId?: string;
}

/**
 * Sends an email anonymously using Firebase Cloud Firestore Trigger Email.
 * Dispatches directly behind the scenes without launching any external applications.
 */
export async function sendEmailViaGmailSMTP(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const { to, subject, bodyText } = options;

  return await sendEmailViaFirebase(to, subject, bodyText);
}
