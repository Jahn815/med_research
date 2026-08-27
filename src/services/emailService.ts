export interface SendEmailOptions {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  senderName?: string;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
  docId?: string;
}

/**
 * Sends an email using Gmail SMTP via EmailJS / Serverless SMTP relay service.
 * Standard Gmail SMTP Details:
 * Host: smtp.gmail.com
 * Port: 465 (SSL) or 587 (TLS)
 */
export async function sendEmailViaGmailSMTP(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const { to, subject, bodyText, senderName = 'Maldeodeum Research Team' } = options;

  if (!to || !to.includes('@')) {
    return {
      success: false,
      message: '유효한 이메일 주소를 입력해주세요. (Please enter a valid recipient email address.)',
    };
  }

  // Environment variable configurations for EmailJS / Gmail SMTP Relay
  const serviceId = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID || 'service_gmail_smtp';
  const templateId = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_palin_results';
  const userId = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (userId) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: userId,
          template_params: {
            to_email: to,
            sender_name: senderName,
            subject: subject,
            message: bodyText,
          },
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Gmail SMTP를 통해 이메일이 성공적으로 발송되었습니다!',
        };
      } else {
        const errText = await response.text();
        console.warn('EmailJS API response not OK:', errText);
      }
    } catch (err) {
      console.error('Failed to send email via EmailJS API:', err);
    }
  }

  // Fallback / Direct Web Launch if API keys aren't set yet:
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyText);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(
    to
  )}&su=${encodedSubject}&body=${encodedBody}`;

  if (typeof window !== 'undefined') {
    window.open(gmailUrl, '_blank');
  }

  return {
    success: true,
    message: 'Gmail 작성 창이 열렸습니다. 발송 버튼을 눌러주세요!',
  };
}
