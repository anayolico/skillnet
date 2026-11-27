import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  LineChart,
  Lock,
  MessagesSquare,
  Palette,
  Server,
} from 'lucide-react';
import PublicHeader from '../../components/landing/PublicHeader';
import SwapExplorer from '../../components/landing/SwapExplorer';
import ScrollReveal from '../../components/landing/ScrollReveal';
import Footer from '../../components/Footer';
import styles from './landing.module.css';

const DISCIPLINES = [
  { label: 'Engineering & Systems', icon: Code2 },
  { label: 'Product & UI', icon: Palette },
  { label: 'AI Engineering', icon: Cpu },
  { label: 'Cloud & DevOps', icon: Server },
  { label: 'Financial Strategy', icon: LineChart },
  { label: 'Growth & Ops', icon: Layers },
];

const WORKFLOW_STEPS = [
  {
    title: 'Publish your skill offer',
    description:
      'Set what you teach, what you want to learn, your session format, and time value.',
  },
  {
    title: 'Match and formalize the swap',
    description:
      'Find a vetted peer in the marketplace and send a focused exchange proposal.',
  },
  {
    title: 'Collaborate inside a live room',
    description:
      'Once accepted, a private real-time channel opens to deliver and verify milestones.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'I traded two Next.js architecture reviews for a full design-system audit. Both sessions were focused, structured, and immediately useful in production.',
    name: 'Nadia Okafor',
    role: 'Staff Frontend Architect',
    initials: 'NO',
  },
  {
    quote:
      'Having a clear request, milestone check-in, and private swap room turns informal networking into real skill transfer that both sides follow through on.',
    name: 'Daniel Mensah',
    role: 'Cloud Infrastructure Lead',
    initials: 'DM',
  },
  {
    quote:
      'Instead of watching generic courses, I paired directly with a senior ML engineer and exchanged product strategy workshops for hands-on Python automation.',
    name: 'Priya Subramanian',
    role: 'Principal Product Manager',
    initials: 'PS',
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <PublicHeader />

      <main>
        {/* 1. ASYMMETRIC SPLIT HERO */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>Peer-to-Peer Skill Exchange</span>
                <h1 className={styles.heroTitle}>
                  Trade your expertise.
                  <br />
                  Master what&apos;s next.
                </h1>
                <p className={styles.heroSubtext}>
                  Swap 1-on-1 sessions and portfolio reviews with vetted peers. Zero tuition,
                  verified milestones.
                </p>
                <div className={styles.heroActions}>
                  <Link href="/join" className={styles.btnPrimary}>
                    Start Swapping <ArrowRight size={16} />
                  </Link>
                  <Link href="/marketplace" className={styles.btnSecondary}>
                    Explore Marketplace
                  </Link>
                </div>
              </div>

              <div className={styles.heroMedia}>
                <img
                  src="/images/hero-exchange.jpg"
                  alt="Two professionals collaborating over a laptop and grid notebook during a peer skill exchange session"
                  className={styles.heroImg}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. DISCIPLINES STRIP (directly below hero) */}
        <section className={styles.disciplineStrip} aria-label="Skill exchange disciplines">
          <div className={styles.container}>
            <div className={styles.disciplineGrid}>
              {DISCIPLINES.map(({ label, icon: Icon }) => (
                <div key={label} className={styles.disciplineItem}>
                  <Icon size={17} strokeWidth={1.8} className={styles.disciplineIcon} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE EXCHANGE ARCHITECTURE + WORKFLOW */}
        <section id="how-it-works" className={styles.section}>
          <div className={styles.container}>
            <ScrollReveal>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>How a skill exchange works</h2>
                <p className={styles.sectionLead}>
                  List your skill, match with a peer, and complete verified milestones.
                </p>
              </div>
            </ScrollReveal>

            <div className={styles.workflowStack}>
              <ScrollReveal delayMs={60}>
                <SwapExplorer />
              </ScrollReveal>

              <ScrollReveal delayMs={120}>
                <div className={styles.stepList}>
                  {WORKFLOW_STEPS.map((step, index) => (
                    <div key={step.title} className={styles.stepRow}>
                      <span className={styles.stepIndex}>0{index + 1}</span>
                      <div className={styles.stepBody}>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <p className={styles.stepDesc}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 4. ESCROW TRUST STANDARD (4-CELL ASYMMETRIC BENTO ON TONAL BAND) */}
        <section id="escrow" className={styles.tonalBand}>
          <div className={styles.container}>
            <ScrollReveal>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Structured trust for every session</h2>
                <p className={styles.sectionLead}>
                  Every exchange runs from approval to live collaboration and milestone confirmation.
                </p>
              </div>
            </ScrollReveal>

            <div className={styles.bentoGrid}>
              {/* Cell 1: Wide Visual */}
              <ScrollReveal className={`${styles.bentoCell} ${styles.bentoVisual}`}>
                <img
                  src="/images/live-session.jpg"
                  alt="Minimal architectural studio workspace prepared for a structured 1-on-1 skill exchange session"
                  className={styles.bentoImg}
                />
              </ScrollReveal>

              {/* Cell 2: Deep Navy Anchor Tile */}
              <ScrollReveal delayMs={80} className={`${styles.bentoCell} ${styles.bentoNavy}`}>
                <div className={styles.bentoIconNavy} aria-hidden="true">
                  <Lock size={21} strokeWidth={1.7} />
                </div>
                <div className={styles.bentoCopy}>
                  <h3 className={styles.bentoTitleLight}>Milestone-gated completion</h3>
                  <p className={styles.bentoBodyLight}>
                    Both partners agree on deliverables upfront across 1-on-1 sessions or code and
                    design reviews. Completion is logged only when both sides confirm.
                  </p>
                </div>
              </ScrollReveal>

              {/* Cell 3: Crisp White Private Room Tile */}
              <ScrollReveal delayMs={120} className={`${styles.bentoCell} ${styles.bentoNeutral}`}>
                <div className={styles.bentoIconDark} aria-hidden="true">
                  <MessagesSquare size={21} strokeWidth={1.7} />
                </div>
                <div className={styles.bentoCopy}>
                  <h3 className={styles.bentoTitleDark}>Instant private swap rooms</h3>
                  <p className={styles.bentoBodyDark}>
                    Accepting a swap request automatically opens a private real-time channel with
                    read tracking and instant notifications.
                  </p>
                </div>
              </ScrollReveal>

              {/* Cell 4: Crisp White Editorial Capabilities Tile */}
              <ScrollReveal delayMs={160} className={`${styles.bentoCell} ${styles.bentoLight}`}>
                <div className={styles.bentoCopy}>
                  <h3 className={styles.bentoTitleDark}>Vetted peer profiles and clear fit</h3>
                  <p className={styles.bentoBodyDark}>
                    Onboarding captures every member&apos;s headline, skills offered and sought,
                    seniority level, and weekly availability before they enter the marketplace.
                  </p>
                </div>
                <div className={styles.capabilityGrid}>
                  <div className={styles.capabilityItem}>Matched by seniority &amp; timezone</div>
                  <div className={styles.capabilityItem}>
                    40+ curated technical &amp; strategy domains
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 5. MEMBER PERSPECTIVES (EDITORIAL HAIRLINE COLUMNS) */}
        <section className={styles.quotesSection}>
          <div className={styles.container}>
            <ScrollReveal>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Built for practitioners who ship</h2>
                <p className={styles.sectionLead}>
                  Real 1-on-1 peer feedback instead of passive video lectures.
                </p>
              </div>
            </ScrollReveal>

            <div className={styles.quotesGrid}>
              {TESTIMONIALS.map((item, idx) => (
                <ScrollReveal key={item.name} delayMs={idx * 80} className={styles.quoteCol}>
                  <p className={styles.quoteText}>“{item.quote}”</p>
                  <div className={styles.quoteMeta}>
                    <div className={styles.quoteAvatar}>{item.initials}</div>
                    <div>
                      <div className={styles.quoteName}>{item.name}</div>
                      <div className={styles.quoteRole}>{item.role}</div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CLOSING ACTION BAND */}
        <section className={styles.closingSection}>
          <div className={styles.container}>
            <ScrollReveal>
              <div className={styles.closingBox}>
                <h2 className={styles.closingTitle}>
                  Ready to trade what you know for what you need?
                </h2>
                <p className={styles.closingDesc}>
                  Create your SkillNet profile in two minutes, list your core strength, and send
                  your first swap proposal today.
                </p>
                <div className={styles.closingActions}>
                  <Link href="/join" className={styles.btnPrimary}>
                    Start Swapping <ArrowRight size={16} />
                  </Link>
                  <Link href="/catalog" className={styles.btnSecondary}>
                    Browse Catalog
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
