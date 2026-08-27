import { Platform, Linking } from 'react-native';

export interface SendEmailOptions {
  to: string;
  subject: string;
  bodyText: string;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
  log: string;
}

/**
 * Directly launches the Gmail App (or Gmail Composer) pre-filled with recipient,
 * subject, and survey results report on Mobile App.
 */
export async function sendEmailViaGmailSMTP(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const { to, subject, bodyText } = options;
  let log = `[${new Date().toLocaleTimeString()}] Gmail App Launch Request\n`;
  log += `Recipient: ${to}\nSubject: ${subject}\nPlatform: ${Platform.OS}\n`;

  if (!to || !to.includes('@')) {
    const errorMsg = '유효한 이메일 주소를 입력해주세요. (Please enter a valid recipient email address.)';
    log += `[ERROR] ${errorMsg}\n`;
    return {
      success: false,
      message: errorMsg,
      log,
    };
  }

  const encodedTo = encodeURIComponent(to);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyText);

  // 1. Native Gmail App Scheme (Android / iOS)
  const gmailAppScheme = `googlegmail:///co?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
  // 2. Gmail Web Composer URL
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
  // 3. Standard mailto URL fallback
  const mailtoUrl = `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}`;

  try {
    // Attempt Gmail App scheme
    log += `[1] Checking Gmail app scheme (googlegmail://)...\n`;
    const canOpenGmailApp = await Linking.canOpenURL('googlegmail://').catch(() => false);

    if (canOpenGmailApp) {
      log += `[Gmail App Found] Opening native Gmail app...\n`;
      await Linking.openURL(gmailAppScheme);
      return {
        success: true,
        message: 'Gmail 앱이 열렸습니다. [전송]을 누르면 이메일이 발송됩니다.',
        log,
      };
    }

    // Fallback to mailto / Gmail Web URL on mobile
    log += `[2] Gmail app scheme not found, trying mailto / Gmail URL...\n`;
    const canOpenMailto = await Linking.canOpenURL(mailtoUrl).catch(() => false);

    if (canOpenMailto) {
      log += `[Opening Mail App] Launching mailto scheme...\n`;
      await Linking.openURL(mailtoUrl);
      return {
        success: true,
        message: '이메일 앱이 열렸습니다. [전송]을 누르면 발송됩니다.',
        log,
      };
    } else {
      log += `[Opening Gmail Web] Launching browser Gmail composer...\n`;
      await Linking.openURL(gmailWebUrl);
      return {
        success: true,
        message: 'Gmail 웹 작성 창이 열렸습니다.',
        log,
      };
    }
  } catch (err: any) {
    const errorDetail = err?.message || String(err);
    log += `[EXCEPTION] ${errorDetail}\n`;
    return {
      success: false,
      message: `Gmail 연결 실패: ${errorDetail}`,
      log,
    };
  }
}
