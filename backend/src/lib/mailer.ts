import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import {
  buildContactNotificationEmail,
  buildPasswordChangedEmail,
  buildPasswordResetEmail,
  buildSwapAcceptedEmail,
  buildSwapRequestEmail,
  buildWelcomeEmail,
} from './emailTemplates';

export interface SendEmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  delivered: boolean;
  provider: 'resend' | 'smtp' | 'terminal-only';
  id?: string;
}

let cachedResend: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!cachedResend) {
    cachedResend = new Resend(apiKey);
  }
  return cachedResend;
}

function getSmtpTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function shouldPrintToTerminal(): boolean {
  if (process.env.EMAIL_DEV_LOG === 'false') return false;
  if (process.env.EMAIL_DEV_LOG === 'true') return true;
  return process.env.NODE_ENV !== 'production';
}

function logEmailToTerminal(
  payload: SendEmailPayload,
  from: string,
  statusLabel: string
) {
  console.log('\n==================== [SKILLNET EMAIL] ====================');
  console.log(`Status  : ${statusLabel}`);
  console.log(`From    : ${from}`);
  console.log(`To      : ${payload.to}`);
  if (payload.replyTo) console.log(`Reply-To: ${payload.replyTo}`);
  console.log(`Subject : ${payload.subject}`);
  console.log('----------------------------------------------------------');
  console.log(payload.text);
  console.log('==========================================================\n');
}

/**
 * Unified email dispatcher:
 * 1. Uses Resend HTTPS API when RESEND_API_KEY is configured (ideal for Render hosting).
 * 2. Falls back to SMTP (nodemailer) if SMTP_* vars are configured.
 * 3. Prints every email (including reset links) cleanly in the terminal in dev / when EMAIL_DEV_LOG=true.
 */
export async function sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  const from =
    process.env.MAIL_FROM?.trim() ||
    (process.env.RESEND_API_KEY ? 'SkillNet <onboarding@resend.dev>' : 'SkillNet <no-reply@skillnet.app>');

  const resend = getResendClient();
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
      });

      if (error) {
        console.warn('[mail][resend] Delivery warning:', error.message);
        if (shouldPrintToTerminal()) {
          logEmailToTerminal(payload, from, `RESEND FALLBACK (${error.message})`);
        }
        return { delivered: false, provider: 'terminal-only' };
      }

      if (shouldPrintToTerminal()) {
        logEmailToTerminal(payload, from, `SENT VIA RESEND (id: ${data?.id || 'ok'})`);
      }
      return { delivered: true, provider: 'resend', id: data?.id };
    } catch (err: any) {
      console.error('[mail][resend] Error:', err?.message || err);
      if (shouldPrintToTerminal()) {
        logEmailToTerminal(payload, from, 'RESEND ERROR — TERMINAL PREVIEW');
      }
      return { delivered: false, provider: 'terminal-only' };
    }
  }

  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
      });
      if (shouldPrintToTerminal()) {
        logEmailToTerminal(payload, from, `SENT VIA SMTP (id: ${info.messageId})`);
      }
      return { delivered: true, provider: 'smtp', id: info.messageId };
    } catch (err: any) {
      console.error('[mail][smtp] Error:', err?.message || err);
      if (shouldPrintToTerminal()) {
        logEmailToTerminal(payload, from, 'SMTP ERROR — TERMINAL PREVIEW');
      }
      return { delivered: false, provider: 'terminal-only' };
    }
  }

  // No provider configured yet (local dev before domain/API setup)
  logEmailToTerminal(payload, from, 'LOCAL TERMINAL PREVIEW (no RESEND_API_KEY set yet)');
  return { delivered: process.env.NODE_ENV !== 'production', provider: 'terminal-only' };
}

export async function sendPasswordResetEmail(params: {
  to: string;
  firstName?: string | null;
  resetUrl: string;
  expiresInMinutes: number;
}) {
  const content = buildPasswordResetEmail(params);
  return sendEmail({ to: params.to, ...content });
}

export async function sendPasswordChangedEmail(params: {
  to: string;
  firstName?: string | null;
  loginUrl: string;
}) {
  const content = buildPasswordChangedEmail({
    firstName: params.firstName,
    changedAt: new Date(),
    loginUrl: params.loginUrl,
  });
  return sendEmail({ to: params.to, ...content });
}

export async function sendWelcomeEmail(params: {
  to: string;
  firstName?: string | null;
  onboardingUrl: string;
}) {
  const content = buildWelcomeEmail(params);
  return sendEmail({ to: params.to, ...content });
}

export async function sendSwapRequestEmail(params: {
  to: string;
  recipientName?: string | null;
  requesterName: string;
  listingTitle: string;
  message?: string | null;
  escrowUrl: string;
}) {
  const content = buildSwapRequestEmail(params);
  return sendEmail({ to: params.to, ...content });
}

export async function sendSwapAcceptedEmail(params: {
  to: string;
  requesterName?: string | null;
  partnerName: string;
  listingTitle: string;
  chatUrl: string;
}) {
  const content = buildSwapAcceptedEmail(params);
  return sendEmail({ to: params.to, ...content });
}

export async function sendContactSupportEmail(params: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  const supportInbox = process.env.SUPPORT_INBOX_EMAIL?.trim() || 'support@skillnet.app';
  const content = buildContactNotificationEmail(params);
  return sendEmail({
    to: supportInbox,
    replyTo: params.email,
    ...content,
  });
}
