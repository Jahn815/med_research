import { Platform } from 'react-native';

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
  statusCode?: number;
}

/**
 * Direct Background Gmail SMTP Dispatcher.
 * Sends emails directly via Gmail SMTP (smtp.gmail.com) without opening any external mail apps.
 */
export async function sendEmailViaGmailSMTP(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const { to, subject, bodyText, senderName = 'Maldeodeum Research Team' } = options;
  let log = `[${new Date().toLocaleTimeString()}] Direct Gmail SMTP Dispatch Request\n`;
  log += `Recipient: ${to}\nSubject: ${subject}\nPlatform: ${Platform.OS}\n`;
  log += `SMTP Host: smtp.gmail.com (Port 465 / 587)\n`;

  if (!to || !to.includes('@')) {
    const errorMsg = '유효한 이메일 주소를 입력해주세요. (Please enter a valid recipient email address.)';
    log += `[ERROR] ${errorMsg}\n`;
    return {
      success: false,
      message: errorMsg,
      log,
    };
  }

  // Gmail SMTP credentials from environment variables (.env)
  const serviceId = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID || 'service_gmail_smtp';
  const templateId = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_palin_results';
  const userId = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;
  const customSmtpEndpoint = process.env.EXPO_PUBLIC_GMAIL_SMTP_ENDPOINT;

  // 1. Custom Gmail SMTP HTTP Relay Endpoint (if configured)
  if (customSmtpEndpoint) {
    try {
      log += `[HTTP POST] Dispatching via Custom Gmail SMTP Endpoint (${customSmtpEndpoint})...\n`;
      const response = await fetch(customSmtpEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          text: bodyText,
          senderName,
        }),
      });

      const resText = await response.text().catch(() => '');
      log += `[HTTP Response] Status Code: ${response.status}\nData: ${resText}\n`;

      if (response.ok) {
        log += `[SUCCESS] Email successfully sent via Gmail SMTP backend!\n`;
        return {
          success: true,
          message: 'Gmail SMTP를 통해 이메일이 전송되었습니다! ✉️',
          log,
          statusCode: response.status,
        };
      } else {
        const errorMsg = `Gmail SMTP Endpoint Error [HTTP ${response.status}]: ${resText}`;
        log += `[FAIL] ${errorMsg}\n`;
        return {
          success: false,
          message: errorMsg,
          log,
          statusCode: response.status,
        };
      }
    } catch (err: any) {
      const errorMsg = `Custom SMTP Endpoint Exception: ${err?.message || String(err)}`;
      log += `[EXCEPTION] ${errorMsg}\n`;
      return {
        success: false,
        message: errorMsg,
        log,
      };
    }
  }

  // 2. EmailJS Gmail SMTP API Service
  if (userId) {
    try {
      log += `[HTTP POST] Dispatching via EmailJS Gmail SMTP Service...\n`;
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      const responseText = await response.text().catch(() => '');
      log += `[HTTP Response] Status Code: ${response.status} ${response.statusText}\nData: ${responseText || '(empty)'}\n`;

      if (response.ok || response.status === 200) {
        log += `[SUCCESS] Email sent directly via Gmail SMTP (EmailJS)!\n`;
        return {
          success: true,
          message: 'Gmail SMTP를 통해 이메일이 성공적으로 발송되었습니다! ✉️',
          log,
          statusCode: response.status,
        };
      } else {
        const errorMsg = `Gmail SMTP Error [HTTP ${response.status}]: ${responseText || 'Invalid Service Key or Template'}`;
        log += `[FAIL] ${errorMsg}\n`;
        return {
          success: false,
          message: `Gmail SMTP 발송 실패: ${responseText || 'API 키를 확인해주세요.'}`,
          log,
          statusCode: response.status,
        };
      }
    } catch (err: any) {
      const errorMsg = `Fetch exception: ${err?.message || String(err)}`;
      log += `[EXCEPTION] ${errorMsg}\n`;
      return {
        success: false,
        message: `Gmail SMTP 통신 오류: ${errorMsg}`,
        log,
      };
    }
  }

  // 3. If no SMTP API credentials are provided in .env
  const unconfiguredMsg = 'Gmail SMTP 설정이 필요합니다. .env 파일에 EXPO_PUBLIC_EMAILJS_PUBLIC_KEY 또는 EXPO_PUBLIC_GMAIL_SMTP_ENDPOINT를 입력해주세요.';
  log += `[CONFIG ERROR] ${unconfiguredMsg}\n`;
  return {
    success: false,
    message: unconfiguredMsg,
    log,
  };
}
