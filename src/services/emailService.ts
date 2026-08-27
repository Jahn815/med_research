import { Platform, Linking } from 'react-native';

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
  log: string;
  statusCode?: number;
}

/**
 * Direct Mobile App Email Dispatcher with detailed diagnostic logging.
 */
export async function sendEmailViaGmailSMTP(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const { to, subject, bodyText, senderName = 'Maldeodeum Research Team' } = options;
  let logOutput = `[${new Date().toLocaleTimeString()}] Email Dispatch Initialized\n`;
  logOutput += `Target Recipient: ${to}\nSubject: ${subject}\nPlatform: ${Platform.OS}\n`;

  if (!to || !to.includes('@')) {
    const errorMsg = '유효한 이메일 주소를 입력해주세요. (Invalid recipient email address)';
    logOutput += `[ERROR] ${errorMsg}\n`;
    return {
      success: false,
      message: errorMsg,
      log: logOutput,
    };
  }

  // EmailJS configuration variables
  const serviceId = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID;
  const userId = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;

  logOutput += `Config - ServiceID: ${serviceId || '(not set)'}, TemplateID: ${templateId || '(not set)'}, PublicKey: ${userId ? '(present)' : '(not set)'}\n`;

  if (userId && serviceId && templateId) {
    try {
      logOutput += `[HTTP POST] Sending payload to https://api.emailjs.com/api/v1.0/email/send ...\n`;
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

      const responseText = await response.text().catch(() => '');
      logOutput += `[HTTP Response] Status Code: ${response.status} ${response.statusText}\nResponse Data: ${responseText || '(empty)'}\n`;

      if (response.ok || response.status === 200) {
        logOutput += `[SUCCESS] Email successfully dispatched via EmailJS API!\n`;
        return {
          success: true,
          message: '앱에서 이메일이 성공적으로 전송되었습니다! ✉️',
          log: logOutput,
          statusCode: response.status,
        };
      } else {
        const errorMsg = `EmailJS API Error [HTTP ${response.status}]: ${responseText || 'Bad Request'}`;
        logOutput += `[FAIL] ${errorMsg}\n`;

        // Native Mobile Mailto Fallback
        return await tryMailtoFallback(to, subject, bodyText, logOutput, errorMsg);
      }
    } catch (err: any) {
      const errorMsg = `Fetch exception: ${err?.message || String(err)}`;
      logOutput += `[EXCEPTION] ${errorMsg}\n`;
      return await tryMailtoFallback(to, subject, bodyText, logOutput, errorMsg);
    }
  } else {
    const missingKeysMsg = 'EmailJS API 키(EXPO_PUBLIC_EMAILJS_PUBLIC_KEY 등)가 .env에 설정되지 않았습니다.';
    logOutput += `[WARNING] ${missingKeysMsg}\nAttempting mobile native mail application launcher...\n`;
    return await tryMailtoFallback(to, subject, bodyText, logOutput, missingKeysMsg);
  }
}

async function tryMailtoFallback(
  to: string,
  subject: string,
  bodyText: string,
  existingLog: string,
  reasonMsg: string
): Promise<SendEmailResult> {
  let log = existingLog;
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyText);
  const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodedSubject}&body=${encodedBody}`;

  log += `[FALLBACK] Launching mailto scheme: ${mailtoUrl.slice(0, 60)}...\n`;

  if (Platform.OS !== 'web') {
    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl).catch((e) => {
        log += `[Linking Check Error] ${e?.message || String(e)}\n`;
        return false;
      });

      log += `[Linking Check] canOpenURL: ${canOpen}\n`;

      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        log += `[SUCCESS] Native mail application launched successfully via Linking.openURL!\n`;
        return {
          success: true,
          message: '메일 앱으로 연결되었습니다. 메일 앱에서 [전송]을 누르면 이메일이 발송됩니다.',
          log: log,
        };
      } else {
        log += `[FAIL] Device cannot open mailto URLs. No email app installed or supported.\n`;
        return {
          success: false,
          message: `전송 실패: ${reasonMsg} (디바이스에 메일 앱이 없거나 지원되지 않습니다)`,
          log: log,
        };
      }
    } catch (err: any) {
      const linkErr = `Linking.openURL error: ${err?.message || String(err)}`;
      log += `[FAIL] ${linkErr}\n`;
      return {
        success: false,
        message: `전송 실패: ${reasonMsg}`,
        log: log,
      };
    }
  }

  log += `[FAIL] Web platform requires API keys for background send.\n`;
  return {
    success: false,
    message: `전송 실패: ${reasonMsg}`,
    log: log,
  };
}
