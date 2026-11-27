import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageLayout from '../../../components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Trust & Safety | SkillNet',
  description:
    'How SkillNet structures mutual swap proposals, private swap rooms, milestone verification, and peer safety.',
};

const SECTIONS = [
  { id: 'profile-standards', label: '1. Structured Member Profiles' },
  { id: 'swap-lifecycle', label: '2. Mutual Proposal Lifecycle' },
  { id: 'milestone-accountability', label: '3. Milestone Verification' },
  { id: 'safe-sessions', label: '4. Session Safety Guidelines' },
  { id: 'reporting', label: '5. Reporting & Mediation' },
];

export default function TrustAndSafetyPage() {
  return (
    <LegalPageLayout
      category="Escrow & Trust Standard"
      title="Trust & Safety"
      summary="How SkillNet protects every peer-to-peer knowledge exchange through structured proposals, private rooms, and milestone accountability."
      lastUpdated="November 2026"
      sections={SECTIONS}
    >
      <section id="profile-standards">
        <h2>1. Structured Member Profiles</h2>
        <p>
          Every member completes guided onboarding before accessing the marketplace. Profiles
          explicitly state each practitioner&apos;s headline, skills offered, skills sought,
          experience tier, weekly availability, and timezone so partners can evaluate fit before
          proposing a swap.
        </p>
      </section>

      <section id="swap-lifecycle">
        <h2>2. Mutual Proposal Lifecycle</h2>
        <p>
          No exchange begins unilaterally. Every swap follows an explicit three-stage workflow:
        </p>
        <ul>
          <li>
            <strong>Structured request:</strong> A member sends a scoped proposal tied directly to a
            published skill listing with clear goals and what they offer in return.
          </li>
          <li>
            <strong>Explicit approval:</strong> The listing owner reviews the proposal in Swap
            Requests and chooses to accept or decline before any workspace is created.
          </li>
          <li>
            <strong>Private swap room:</strong> Acceptance automatically provisions a dedicated
            real-time WebSocket channel shared only by the two participants.
          </li>
        </ul>
      </section>

      <section id="milestone-accountability">
        <h2>3. Milestone Verification</h2>
        <p>
          Each active swap tracks deliverables across clear milestones matching the listing&apos;s
          session format and time value (1 Hour Session, 2 Hour Deep Dive, 5 Hour Mini-Course, or
          Ongoing Mentorship). Keeping scope concrete upfront prevents mismatched expectations and
          ensures both sides deliver equitable value.
        </p>
      </section>

      <section id="safe-sessions">
        <h2>4. Session Safety Guidelines</h2>
        <ul>
          <li>Keep initial coordination and milestone scope inside your SkillNet swap room.</li>
          <li>Never share production secrets, API keys, or confidential employer IP during code or design reviews.</li>
          <li>Agree on concrete session outcomes before starting your first live call.</li>
        </ul>
      </section>

      <section id="reporting">
        <h2>5. Reporting &amp; Mediation</h2>
        <p>
          If a swap partner fails to honor an agreed milestone or behaves unprofessionally, contact
          our team through the <Link href="/contact">Contact page</Link> with the swap listing title
          and summary. We review reports promptly and take action under our{' '}
          <Link href="/terms">Terms of Service</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
