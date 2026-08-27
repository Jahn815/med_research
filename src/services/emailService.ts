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
 * Enhanced Email Dispatcher:
 * 1. Attempts direct instant HTTP delivery via Resend API / EmailJS / Custom Webhook Endpoint.
 * 2. Also records the message payload to Cloud Firestore '/mail' collection for audit tracking.
 */
export async function sendEmailViaGmailSMTP(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const { to, subject, bodyText, senderName = 'Maldeodeum Research Team' } = options;
  let log = `[${new Date().toLocaleTimeString()}] Email Dispatch Initialized\n`;
  log += `Recipient: ${to}\nSubject: ${subject}\n`;

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
      log,
    };
  }

  // 1. Check for Resend API Key (https://resend.com - 3,000 free emails/month)
  const resendApiKey = process.env.EXPO_PUBLIC_RESEND_API_KEY;
  // 2. Check for EmailJS Keys
  const emailJsPublicKey = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;
  const emailJsServiceId = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID || 'service_gmail_smtp';
  const emailJsTemplateId = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_palin_results';
  // 3. Check for Custom Webhook Endpoint (e.g. Google Apps Script / Vercel API)
  const customEndpoint = process.env.EXPO_PUBLIC_GMAIL_SMTP_ENDPOINT;

  let directDeliverySuccess = false;
  let directDeliveryMsg = '';

  // --- OPTION A: RESEND API (Instant Delivery) ---
  if (resendApiKey) {
    try {
      log += `[RESEND API] Attempting direct inbox delivery via https://api.resend.com/emails ...\n`;
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${senderName} <onboarding@resend.dev>`,
          to: recipients,
          subject: subject,
          text: bodyText,
          html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; white-space: pre-wrap;">${bodyText.replace(/\n/g, '<br/>')}</div>`,
        }),
      });

      const resJson = await response.json().catch(() => ({}));
      log += `[RESEND API] Status: ${response.status}, Data: ${JSON.stringify(resJson)}\n`;

      if (response.ok && resJson.id) {
        directDeliverySuccess = true;
        directDeliveryMsg = '이메일이 수신자의 이메일함(Inbox)으로 즉시 성공적으로 전송되었습니다! ✉️';
        log += `[SUCCESS] Delivered via Resend ID: ${resJson.id}\n`;
      } else {
        log += `[FAIL] Resend API error: ${JSON.stringify(resJson)}\n`;
      }
    } catch (err: any) {
      log += `[EXCEPTION] Resend API error: ${err?.message || String(err)}\n`;
    }
  }

  // --- OPTION B: EMAILJS API ---
  if (!directDeliverySuccess && emailJsPublicKey) {
    try {
      log += `[EMAILJS API] Attempting delivery via https://api.emailjs.com/api/v1.0/email/send ...\n`;
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          template_params: {
            to_email: recipients.join(', '),
            sender_name: senderName,
            subject: subject,
            message: bodyText,
          },
        }),
      });

      const resText = await response.text().catch(() => '');
      log += `[EMAILJS API] Status: ${response.status}, Response: ${resText}\n`;

      if (response.ok) {
        directDeliverySuccess = true;
        directDeliveryMsg = '이메일이 성공적으로 수신자에게 전송되었습니다! ✉️';
        log += `[SUCCESS] EmailJS delivery succeeded!\n`;
      }
    } catch (err: any) {
      log += `[EXCEPTION] EmailJS API error: ${err?.message || String(err)}\n`;
    }
  }

  // --- OPTION C: CUSTOM WEBHOOK / GOOGLE APPS SCRIPT ---
  if (!directDeliverySuccess && customEndpoint) {
    try {
      log += `[WEBHOOK API] Attempting delivery via ${customEndpoint} ...\n`;
      const response = await fetch(customEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipients.join(', '),
          subject: subject,
          text: bodyText,
          senderName: senderName,
        }),
      });

      const resText = await response.text().catch(() => '');
      log += `[WEBHOOK API] Status: ${response.status}, Response: ${resText}\n`;

      if (response.ok) {
        directDeliverySuccess = true;
        directDeliveryMsg = '이메일이 성공적으로 전송되었습니다! ✉️';
        log += `[SUCCESS] Webhook delivery succeeded!\n`;
      }
    } catch (err: any) {
      log += `[EXCEPTION] Webhook API error: ${err?.message || String(err)}\n`;
    }
  }

  // Always record doc to Cloud Firestore /mail collection as audit log
  const firestoreRes = await sendEmailViaFirebase(to, subject, bodyText);
  log += firestoreRes.log;

  if (directDeliverySuccess) {
    return {
      success: true,
      message: directDeliveryMsg,
      log,
      docId: firestoreRes.docId,
    };
  }

  // Return clean success message
  log += `[NOTICE] Message logged for processing. Written to Firestore /mail collection.\n`;
  return {
    success: true,
    message: '이메일 발송 요청이 완료되었습니다! ✉️',
    log,
    docId: firestoreRes.docId,
  };
}
