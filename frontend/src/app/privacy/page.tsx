import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageLayout from '../../../components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | SkillNet',
  description:
    'How SkillNet collects, uses, protects, and lets you manage your account, profile, swap messages, and billing information.',
};

const SECTIONS = [
  { id: 'information-collected', label: '1. Information We Collect' },
  { id: 'how-we-use', label: '2. How We Use Information' },
  { id: 'messages-and-swaps', label: '3. Swap Rooms & Messages' },
  { id: 'payments', label: '4. Payments & Billing' },
  { id: 'cookies', label: '5. Cookies & Sessions' },
  { id: 'your-controls', label: '6. Your Controls & Deletion' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      category=""
      title="Privacy Policy"
      summary="How SkillNet handles your profile data, skill listings, real-time swap messages, and membership billing with clarity and restraint."
      sections={SECTIONS}
    >
      <section id="information-collected">
        <h2>1. Information We Collect</h2>
        <p>
          We collect only the information needed to operate peer-to-peer skill exchanges and keep
          your account secure:
        </p>
        <ul>
          <li>
            <strong>Account credentials:</strong> Your name, email address, encrypted password hash,
            or basic profile fields returned when you sign in with Google OAuth.
          </li>
          <li>
            <strong>Professional profile details:</strong> Headline, bio, skills offered, skills
            sought, experience level, weekly availability, and timezone provided during onboarding
            or profile edits.
          </li>
          <li>
            <strong>Exchange activity:</strong> Skill listings you publish, swap requests you send
            or receive, milestone status, and messages exchanged inside active swap rooms.
          </li>
        </ul>
      </section>

      <section id="how-we-use">
        <h2>2. How We Use Information</h2>
        <p>Your information is used strictly to deliver and improve the SkillNet platform:</p>
        <ul>
          <li>Display your active skill listings and public profile in the SkillNet Marketplace.</li>
          <li>Deliver real-time swap notifications, unread message counts, and match alerts.</li>
          <li>Verify membership tier entitlements (Essential and Professional plans).</li>
          <li>Protect platform integrity, prevent abuse, and assist with exchange mediation.</li>
        </ul>
        <p>We never sell your personal data or skill history to third-party advertisers.</p>
      </section>

      <section id="messages-and-swaps">
        <h2>3. Swap Rooms &amp; Messages</h2>
        <p>
          Private swap chat rooms are created only when a swap request is mutually accepted. Message
          history is stored securely in our database so both partners can reference session notes,
          scheduling details, and agreed milestones. Access to a swap room is restricted to its two
          participants.
        </p>
      </section>

      <section id="payments">
        <h2>4. Payments &amp; Billing</h2>
        <p>
          Upgrades to the SkillNet Professional tier are processed through Flutterwave. SkillNet
          does not store raw credit card numbers or bank credentials on our servers. We retain only
          transaction references, payment status, currency, and subscription tier records needed for
          account provisioning and receipts.
        </p>
      </section>

      <section id="cookies">
        <h2>5. Cookies &amp; Sessions</h2>
        <p>
          SkillNet uses essential authentication and onboarding state cookies (<code>token</code>{' '}
          and <code>onboarded</code>) strictly to keep you signed in and route you to the right
          workspace view. We do not use cross-site advertising trackers.
        </p>
      </section>

      <section id="your-controls">
        <h2>6. Your Controls &amp; Deletion</h2>
        <p>
          You can update your public profile visibility, match alert preferences, and escrow receipt
          options at any time in <Link href="/settings">Account Settings</Link>. You may also
          permanently delete your account directly from Settings, which removes your profile,
          listings, and associated account records.
        </p>
        <p>
          For privacy questions or data export requests, reach us via our{' '}
          <Link href="/contact">Contact page</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
