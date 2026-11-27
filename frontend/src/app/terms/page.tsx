import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageLayout from '../../../components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | SkillNet',
  description:
    'The rules governing SkillNet accounts, peer-to-peer skill swaps, Essential and Professional plans, and community conduct.',
};

const SECTIONS = [
  { id: 'eligibility', label: '1. Accounts & Eligibility' },
  { id: 'peer-exchanges', label: '2. Peer Skill Exchanges' },
  { id: 'memberships', label: '3. Membership Plans' },
  { id: 'conduct', label: '4. Acceptable Conduct' },
  { id: 'termination', label: '5. Suspension & Termination' },
];

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      category="Legal"
      title="Terms of Service"
      summary="Clear terms for participating in peer-to-peer skill exchanges, publishing offers, and maintaining a trusted SkillNet account."
      lastUpdated="November 2026"
      sections={SECTIONS}
    >
      <section id="eligibility">
        <h2>1. Accounts &amp; Eligibility</h2>
        <p>
          By creating a SkillNet account, you confirm that the professional details you list during
          onboarding and on your public profile are accurate and belong to you. You are responsible
          for keeping your login credentials secure and for all activity conducted under your
          account.
        </p>
      </section>

      <section id="peer-exchanges">
        <h2>2. Peer Skill Exchanges</h2>
        <p>
          SkillNet facilitates direct, non-monetary knowledge swaps between independent
          professionals. When you publish a skill offer or accept a swap request:
        </p>
        <ul>
          <li>
            You agree to represent your skill level, session format (Live Video Call or Code and
            Design Review), and estimated time commitment honestly.
          </li>
          <li>
            Both partners are responsible for honoring scheduled sessions and confirming agreed
            milestones in good faith.
          </li>
          <li>
            SkillNet provides the matching platform, structured request lifecycle, and real-time
            messaging workspace, but members remain independent individuals rather than employees
            or agents of SkillNet.
          </li>
        </ul>
      </section>

      <section id="memberships">
        <h2>3. Membership Plans</h2>
        <p>SkillNet currently offers two membership tiers:</p>
        <ul>
          <li>
            <strong>Essential ($0/month):</strong> Includes up to 1 active skill listing and up to
            2 outbound swap requests, plus direct messaging with accepted partners.
          </li>
          <li>
            <strong>Professional ($49/month):</strong> Includes unlimited active skill listings,
            unlimited swap requests, priority placement in marketplace discovery, and a Verified
            Pro badge.
          </li>
        </ul>
        <p>
          Paid subscriptions are billed monthly via Flutterwave. Plan changes take effect once
          payment confirmation is verified by our billing webhook.
        </p>
      </section>

      <section id="conduct">
        <h2>4. Acceptable Conduct</h2>
        <p>To keep the exchange high-trust and productive, members must not:</p>
        <ul>
          <li>Spam swap requests, solicit off-platform paid schemes, or misrepresent credentials.</li>
          <li>Harass, intimidate, or share another member&apos;s private session materials without permission.</li>
          <li>Attempt to bypass plan limits, scrape member data, or disrupt platform WebSocket services.</li>
        </ul>
      </section>

      <section id="termination">
        <h2>5. Suspension &amp; Termination</h2>
        <p>
          You may close and permanently delete your account at any time from{' '}
          <Link href="/settings">Account Settings</Link>. SkillNet reserves the right to restrict or
          remove accounts that violate these Terms or our{' '}
          <Link href="/trust">Trust &amp; Safety guidelines</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
