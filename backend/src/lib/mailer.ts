import nodemailer from 'nodemailer';

interface SendPasswordResetParams {
  to: string;
  firstName?: string | null;
  resetUrl: string;
  expiresInMinutes: number;
}

function getTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendPasswordResetEmail({
  to,
  firstName,
  resetUrl,
  expiresInMinutes,
}: SendPasswordResetParams): Promise<{ delivered: boolean; mode: 'smtp' | 'dev-log' | 'unconfigured' }> {
  const greetingName = firstName?.trim() ? `Hi ${firstName.trim()},` : 'Hi there,';
  const from = process.env.MAIL_FROM?.trim() || 'SkillNet Security <no-reply@skillnet.app>';
  const subject = 'Reset your SkillNet password';

  const text = [
    greetingName,
    '',
    'We received a request to reset your SkillNet password.',
    `Use the link below within ${expiresInMinutes} minutes to set a new password:`,
    '',
    resetUrl,
    '',
    'If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.',
    '',
    '— SkillNet Security',
  ].join('\n');

  const html = `
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f7f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e2e8f0;border-top:3px solid #047857;border-radius:14px;padding:32px;">
            <tr>
              <td>
                <div style="font-size:18px;font-weight:800;color:#0a1f3c;letter-spacing:-0.02em;margin-bottom:20px;">
                  SkillNet
                </div>
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;color:#0a1f3c;">
                  Reset your password
                </h1>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
                  ${greetingName} We received a request to reset the password on your SkillNet account.
                </p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155;">
                  Click the button below to choose a new password. This link expires in <strong>${expiresInMinutes} minutes</strong> and can only be used once.
                </p>
                <a href="${resetUrl}" style="display:inline-block;background-color:#0a1f3c;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:10px;">
                  Reset Password
                </a>
                <p style="margin:24px 0 8px;font-size:13px;line-height:1.5;color:#64748b;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 24px;font-size:12px;line-height:1.5;word-break:break-all;color:#047857;">
                  ${resetUrl}
                </p>
                <hr style="border:none;border-top:1px solid #eef2f7;margin:20px 0;" />
                <p style="margin:0;font-size:12px;line-height:1.5;color:#64748b;">
                  If you did not request this reset, you can safely ignore this email. Your account stays protected.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  const transporter = getTransporter();

  if (transporter) {
    await transporter.sendMail({ from, to, subject, text, html });
    return { delivered: true, mode: 'smtp' };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('\n============================================================');
    console.log(`[mail][dev] Password reset requested for: ${to}`);
    console.log(`[mail][dev] Reset link (valid ${expiresInMinutes} min):`);
    console.log(resetUrl);
    console.log('============================================================\n');
    return { delivered: true, mode: 'dev-log' };
  }

  console.warn('[mail] SMTP is not configured in production; password reset email was not sent.');
  return { delivered: false, mode: 'unconfigured' };
}
