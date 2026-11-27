import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Code2,
  Cpu,
  Layers,
  LineChart,
  Lock,
  MessageSquare,
  Palette,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import PublicHeader from '../../components/landing/PublicHeader';
import SwapExplorer from '../../components/landing/SwapExplorer';
import ScrollReveal from '../../components/landing/ScrollReveal';
import Footer from '../../components/Footer';
import styles from './landing.module.css';

const DISCIPLINES = [
  { label: 'Engineering & Systems', icon: Code2 },
  { label: 'Product & UI Design', icon: Palette },
  { label: 'AI & Machine Learning', icon: Cpu },
  { label: 'Cloud & DevOps', icon: Server },
  { label: 'Financial Strategy', icon: LineChart },
  { label: 'Growth & Operations', icon: Layers },
];

const WORKFLOW_STEPS = [
  {
    title: 'Publish your skill offer',
    description:
      'Set what you teach, what you want to learn, your session format, and realistic time value.',
    href: '/create-listing',
    linkLabel: 'Post an offer',
  },
  {
    title: 'Match and formalize the swap',
    description:
      'Browse vetted peers in the marketplace and send a clear exchange proposal with your goals.',
    href: '/marketplace',
    linkLabel: 'Browse marketplace',
  },
  {
    title: 'Collaborate inside a live room',
    description:
      'Once accepted, a dedicated real-time swap channel opens so both partners deliver and verify milestones.',
    href: '/escrow',
    linkLabel: 'See how escrow works',
  },
];

const ESSENTIAL_FEATURES = [
  '1 active skill listing in the marketplace',
  'Send up to 2 peer swap requests',
  'Dedicated real-time chat with swap partners',
  'Full access to public marketplace discovery',
  'Structured profile with offered and sought skills',
];

const PRO_FEATURES = [
  'Unlimited active skill listings',
  'Unlimited swap requests and active pairs',
  'Priority ranking in marketplace partner discovery',
  'Verified Pro badge on your public listings',
  'Direct real-time rooms with all swap partners',
  '24/7 priority member support',
];

const TESTIMONIALS = [
  {
    quote:
      'I traded two Next.js architecture reviews for a full design-system audit. Both sessions were focused, structured, and immediately useful in production.',
    name: 'Nadia Okafor',
    role: 'Staff Frontend Architect, Lagos',
    swap: 'Next.js Architecture for Design Systems',
    initials: 'NO',
  },
  {
    quote:
      'Having a clear request, milestone check-in, and private swap room turns informal networking into real skill transfer that both sides follow through on.',
    name: 'Daniel Mensah',
    role: 'Cloud Infrastructure Lead, London',
    swap: 'Kubernetes Scaling for Financial Modeling',
    initials: 'DM',
  },
  {
    quote:
      'Instead of watching generic courses, I paired directly with a senior ML engineer and exchanged product strategy workshops for hands-on Python automation.',
    name: 'Priya Subramanian',
    role: 'Principal Product Manager, Toronto',
    swap: 'Product Strategy for AI Engineering',
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
                  Master what comes next.
                </h1>
                <p className={styles.heroSubtext}>
                  Swap live sessions and portfolio reviews directly with vetted engineers,
                  designers, and operators. Zero tuition, verified milestones.
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
                <h2 className={styles.sectionTitle}>How a direct skill exchange works</h2>
                <p className={styles.sectionLead}>
                  Publish what you teach, match with a complementary practitioner, and work
                  through structured milestones inside a private room.
                </p>
              </div>
            </ScrollReveal>

            <div className={styles.workflowGrid}>
              <ScrollReveal delayMs={60}>
                <SwapExplorer />
              </ScrollReveal>

              <ScrollReveal delayMs={140} className={styles.workflowRight}>
                <div className={styles.stepList}>
                  {WORKFLOW_STEPS.map((step, index) => (
                    <div key={step.title} className={styles.stepRow}>
                      <span className={styles.stepIndex}>0{index + 1}</span>
                      <div className={styles.stepBody}>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <p className={styles.stepDesc}>{step.description}</p>
                        <Link href={step.href} className={styles.stepLink}>
                          {step.linkLabel} <ArrowRight size={14} />
                        </Link>
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
                  Every exchange follows an explicit lifecycle from request approval to live
                  collaboration and mutual milestone confirmation.
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
                <div className={styles.bentoIconNavy}>
                  <Lock size={20} strokeWidth={2} />
                </div>
                <h3 className={styles.bentoTitleLight}>Milestone-gated completion</h3>
                <p className={styles.bentoBodyLight}>
                  Both partners define deliverables upfront across Live Video Calls or Code and
                  Design Reviews. Completion is logged only when both sides confirm the exchange.
                </p>
                <div className={styles.bentoMetaLight}>
                  <span>Equitable time-value pairing</span>
                </div>
              </ScrollReveal>

              {/* Cell 3: Soft Emerald Accent Tile */}
              <ScrollReveal delayMs={120} className={`${styles.bentoCell} ${styles.bentoEmerald}`}>
                <div className={styles.bentoIconEmerald}>
                  <MessageSquare size={20} strokeWidth={2} />
                </div>
                <h3 className={styles.bentoTitleEmerald}>Instant private swap rooms</h3>
                <p className={styles.bentoBodyEmerald}>
                  Accepting a swap request automatically creates a persistent real-time WebSocket
                  channel with read tracking and instant notifications.
                </p>
                <div className={styles.bentoMetaEmerald}>
                  <span>Direct 1-on-1 workspace</span>
                </div>
              </ScrollReveal>

              {/* Cell 4: Crisp White Structured Capabilities Tile */}
              <ScrollReveal delayMs={160} className={`${styles.bentoCell} ${styles.bentoLight}`}>
                <div className={styles.bentoLightTop}>
                  <div className={styles.bentoIconLight}>
                    <ShieldCheck size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className={styles.bentoTitleDark}>Vetted peer profiles and clear fit</h3>
                    <p className={styles.bentoBodyDark}>
                      Onboarding captures every member&apos;s headline, skills offered, skills
                      sought, seniority level, and weekly availability before they enter the
                      marketplace.
                    </p>
                  </div>
                </div>
                <div className={styles.capabilityGrid}>
                  <div className={styles.capabilityItem}>
                    <Users size={16} />
                    <span>Matched by seniority &amp; timezone</span>
                  </div>
                  <div className={styles.capabilityItem}>
                    <Sparkles size={16} />
                    <span>40+ curated technical &amp; strategy domains</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 5. TRANSPARENT MEMBERSHIP PLANS (MATCHING REAL BACKEND TIERS) */}
        <section id="pricing" className={styles.section}>
          <div className={styles.container}>
            <ScrollReveal>
              <div className={styles.sectionHeader}>
                <span className={styles.eyebrow}>Simple Membership</span>
                <h2 className={styles.sectionTitle}>Start free, upgrade as your network grows</h2>
                <p className={styles.sectionLead}>
                  Begin exchanging skills on Essential at zero cost, or move to Professional for
                  unlimited listings and priority placement.
                </p>
              </div>
            </ScrollReveal>

            <div className={styles.pricingGrid}>
              <ScrollReveal className={styles.planCard}>
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>Essential</h3>
                  <p className={styles.planTagline}>
                    For professionals starting their first structured peer swaps.
                  </p>
                </div>
                <div className={styles.planPrice}>
                  <span className={styles.priceFigure}>$0</span>
                  <span className={styles.pricePeriod}>/ month</span>
                </div>
                <ul className={styles.planList}>
                  {ESSENTIAL_FEATURES.map((feat) => (
                    <li key={feat} className={styles.planListItem}>
                      <Check size={16} className={styles.planCheck} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/join" className={styles.planBtnSecondary}>
                  Start Swapping
                </Link>
              </ScrollReveal>

              <ScrollReveal delayMs={90} className={`${styles.planCard} ${styles.planCardFeatured}`}>
                <div className={styles.planHeaderRow}>
                  <h3 className={styles.planName}>Professional</h3>
                  <span className={styles.planPill}>Recommended</span>
                </div>
                <p className={styles.planTagline}>
                  For active practitioners scaling multiple concurrent exchanges.
                </p>
                <div className={styles.planPrice}>
                  <span className={styles.priceFigure}>$49</span>
                  <span className={styles.pricePeriod}>/ month</span>
                </div>
                <ul className={styles.planList}>
                  {PRO_FEATURES.map((feat) => (
                    <li key={feat} className={styles.planListItem}>
                      <Check size={16} className={styles.planCheckFeatured} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/subscriptions" className={styles.planBtnPrimary}>
                  Upgrade to Pro <ArrowRight size={15} />
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 6. MEMBER PERSPECTIVES (EDITORIAL HAIRLINE COLUMNS) */}
        <section className={styles.quotesSection}>
          <div className={styles.container}>
            <ScrollReveal>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Built for practitioners who ship</h2>
                <p className={styles.sectionLead}>
                  Direct 1-on-1 transfers replace passive video lectures with actionable peer
                  feedback.
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
                      <div className={styles.quoteSwap}>{item.swap}</div>
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
