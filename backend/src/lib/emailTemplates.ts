function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface LayoutOptions {
  preheader: string;
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}

function wrapEmailLayout({
  preheader,
  heading,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerNote,
}: LayoutOptions): string {
  const safePreheader = escapeHtml(preheader);
  const safeHeading = escapeHtml(heading);
  const safeFooter = escapeHtml(
    footerNote || 'You received this email because of activity on your SkillNet account.'
  );

  const ctaSection =
    ctaLabel && ctaUrl
      ? `
        <div style="margin:24px 0 20px;">
          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background-color:#0a1f3c;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:10px;">
            ${escapeHtml(ctaLabel)}
          </a>
        </div>
        <p style="margin:0 0 6px;font-size:12px;color:#64748b;">
          If the button does not work, copy and paste this link into your browser:
        </p>
        <p style="margin:0 0 20px;font-size:12px;line-height:1.5;word-break:break-all;color:#047857;">
          ${escapeHtml(ctaUrl)}
        </p>
      `
      : '';

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f7f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border:1px solid #e2e8f0;border-top:3px solid #047857;border-radius:14px;padding:32px;">
            <tr>
              <td>
                <div style="font-size:18px;font-weight:800;color:#0a1f3c;letter-spacing:-0.02em;margin-bottom:20px;">
                  SkillNet
                </div>
                <h1 style="margin:0 0 14px;font-size:22px;line-height:1.25;color:#0a1f3c;">
                  ${safeHeading}
                </h1>
                ${bodyHtml}
                ${ctaSection}
                <hr style="border:none;border-top:1px solid #eef2f7;margin:22px 0 16px;" />
                <p style="margin:0;font-size:12px;line-height:1.55;color:#64748b;">
                  ${safeFooter}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildPasswordResetEmail(params: {
  firstName?: string | null;
  resetUrl: string;
  expiresInMinutes: number;
}) {
  const greeting = params.firstName?.trim() ? `Hi ${params.firstName.trim()},` : 'Hi there,';
  const subject = 'Reset your SkillNet password';

  const text = [
    greeting,
    '',
    'We received a request to reset the password on your SkillNet account.',
    `Use the single-use link below within ${params.expiresInMinutes} minutes to set a new password:`,
    '',
    params.resetUrl,
    '',
    'If you did not request a password reset, you can safely ignore this email.',
    '',
    'SkillNet Security',
  ].join('\n');

  const html = wrapEmailLayout({
    preheader: `Reset your SkillNet password (expires in ${params.expiresInMinutes} minutes).`,
    heading: 'Reset your password',
    bodyHtml: `
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155;">
        ${escapeHtml(greeting)} We received a request to reset the password on your SkillNet account.
      </p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">
        Click below to choose a new password. This link expires in <strong>${params.expiresInMinutes} minutes</strong> and can only be used once.
      </p>
    `,
    ctaLabel: 'Reset Password',
    ctaUrl: params.resetUrl,
    footerNote:
      'If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.',
  });

  return { subject, text, html };
}

export function buildPasswordChangedEmail(params: {
  firstName?: string | null;
  changedAt: Date;
  loginUrl: string;
}) {
  const greeting = params.firstName?.trim() ? `Hi ${params.firstName.trim()},` : 'Hi there,';
  const timestamp = params.changedAt.toUTCString();
  const subject = 'Your SkillNet password was changed';

  const text = [
    greeting,
    '',
    `Your SkillNet account password was updated on ${timestamp}.`,
    'For your protection, older sessions on other devices have been signed out, and password changes are locked for 7 days.',
    '',
    'If you did not make this change, please contact SkillNet Support immediately.',
    '',
    `Sign in: ${params.loginUrl}`,
  ].join('\n');

  const html = wrapEmailLayout({
    preheader: 'Security alert: your SkillNet password was updated.',
    heading: 'Your password was updated',
    bodyHtml: `
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155;">
        ${escapeHtml(greeting)} Your SkillNet password was changed on <strong>${escapeHtml(timestamp)}</strong>.
      </p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">
        For your protection, older sessions have been signed out and further password changes are restricted for 7 days.
      </p>
    `,
    ctaLabel: 'Go to SkillNet',
    ctaUrl: params.loginUrl,
    footerNote:
      'If you did not authorize this change, contact SkillNet Support immediately so we can secure your account.',
  });

  return { subject, text, html };
}

export function buildWelcomeEmail(params: {
  firstName?: string | null;
  onboardingUrl: string;
}) {
  const greeting = params.firstName?.trim() ? `Welcome, ${params.firstName.trim()}!` : 'Welcome to SkillNet!';
  const subject = 'Welcome to SkillNet — start your first skill exchange';

  const text = [
    greeting,
    '',
    'Your SkillNet account is ready.',
    'Complete your profile, list the expertise you can teach, and send your first peer-to-peer swap proposal.',
    '',
    `Get started: ${params.onboardingUrl}`,
  ].join('\n');

  const html = wrapEmailLayout({
    preheader: 'Complete your SkillNet profile and start swapping skills with vetted peers.',
    heading: greeting,
    bodyHtml: `
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155;">
        Your SkillNet account is ready. Trade 1-on-1 sessions, code reviews, and domain expertise with vetted peers at zero tuition.
      </p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">
        Finish setting up your profile to unlock the marketplace and open milestone-tracked swap rooms.
      </p>
    `,
    ctaLabel: 'Complete Your Profile',
    ctaUrl: params.onboardingUrl,
  });

  return { subject, text, html };
}

export function buildSwapRequestEmail(params: {
  recipientName?: string | null;
  requesterName: string;
  listingTitle: string;
  message?: string | null;
  escrowUrl: string;
}) {
  const greeting = params.recipientName?.trim() ? `Hi ${params.recipientName.trim()},` : 'Hi there,';
  const subject = `New skill swap proposal from ${params.requesterName}`;

  const text = [
    greeting,
    '',
    `${params.requesterName} sent you a skill swap proposal for "${params.listingTitle}".`,
    params.message ? `\nMessage:\n"${params.message}"\n` : '',
    `Review and respond: ${params.escrowUrl}`,
  ]
    .filter(Boolean)
    .join('\n');

  const messageBlock = params.message
    ? `<div style="margin:16px 0;padding:14px 16px;background:#f7f9fc;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;line-height:1.55;color:#334155;">"${escapeHtml(
        params.message
      )}"</div>`
    : '';

  const html = wrapEmailLayout({
    preheader: `${params.requesterName} proposed a swap for ${params.listingTitle}.`,
    heading: 'New swap proposal received',
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">
        ${escapeHtml(greeting)} <strong>${escapeHtml(params.requesterName)}</strong> proposed a skill exchange for <strong>${escapeHtml(
          params.listingTitle
        )}</strong>.
      </p>
      ${messageBlock}
    `,
    ctaLabel: 'Review Swap Request',
    ctaUrl: params.escrowUrl,
  });

  return { subject, text, html };
}

export function buildSwapAcceptedEmail(params: {
  requesterName?: string | null;
  partnerName: string;
  listingTitle: string;
  chatUrl: string;
}) {
  const greeting = params.requesterName?.trim() ? `Hi ${params.requesterName.trim()},` : 'Hi there,';
  const subject = `${params.partnerName} accepted your SkillNet swap proposal`;

  const text = [
    greeting,
    '',
    `${params.partnerName} accepted your swap request for "${params.listingTitle}".`,
    'Your private real-time swap room is now open.',
    '',
    `Open swap room: ${params.chatUrl}`,
  ].join('\n');

  const html = wrapEmailLayout({
    preheader: `Your swap room with ${params.partnerName} is now open.`,
    heading: 'Your swap proposal was accepted',
    bodyHtml: `
      <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">
        ${escapeHtml(greeting)} <strong>${escapeHtml(params.partnerName)}</strong> accepted your swap request for <strong>${escapeHtml(
          params.listingTitle
        )}</strong>. Your private swap room is ready to coordinate milestones.
      </p>
    `,
    ctaLabel: 'Open Swap Room',
    ctaUrl: params.chatUrl,
  });

  return { subject, text, html };
}

export function buildContactNotificationEmail(params: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  const subject = `[SkillNet Contact] ${params.topic} — ${params.name}`;

  const text = [
    `New contact form submission on SkillNet`,
    '',
    `From: ${params.name} <${params.email}>`,
    `Topic: ${params.topic}`,
    '',
    'Message:',
    params.message,
  ].join('\n');

  const html = wrapEmailLayout({
    preheader: `New message from ${params.name} (${params.topic})`,
    heading: `New Support Inquiry: ${params.topic}`,
    bodyHtml: `
      <p style="margin:0 0 10px;font-size:14px;color:#334155;">
        <strong>From:</strong> ${escapeHtml(params.name)} (${escapeHtml(params.email)})
      </p>
      <p style="margin:0 0 14px;font-size:14px;color:#334155;">
        <strong>Topic:</strong> ${escapeHtml(params.topic)}
      </p>
      <div style="padding:14px 16px;background:#f7f9fc;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;line-height:1.6;color:#0f172a;white-space:pre-wrap;">${escapeHtml(
        params.message
      )}</div>
    `,
    footerNote: 'Reply directly to this email to respond to the sender.',
  });

  return { subject, text, html };
}
