import React from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import {
  Zap,
  BookOpen,
  ArrowLeftRight,
  TrendingUp,
  ShieldCheck,
  Lock,
  Scale,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* ── PUBLIC MARKETING NAV ── */}
      <header className="public-nav">
        <div className="public-nav-inner">
          <Link href="/" className="public-nav-logo">
            <div className="public-nav-shield" />
            SkillNet
          </Link>

          <nav className="public-nav-links" aria-label="Main navigation">
            <Link href="/catalog" className="public-nav-link">Courses</Link>
            <Link href="/marketplace" className="public-nav-link">Marketplace</Link>
            <Link href="/join" className="public-nav-link">Pricing</Link>
          </nav>

          <div className="public-nav-actions">
            <Link href="/login" className="public-nav-login">Log in</Link>
            <Link href="/join" className="public-nav-cta">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-hero-content">
              <div className="lp-eyebrow">
                <span className="lp-eyebrow-dot" />
                The Knowledge Exchange Protocol
              </div>
              <h1 className="lp-h1">
                Master the Art of<br />
                <span>the Exchange.</span>
              </h1>
              <p className="lp-hero-desc">
                A sophisticated peer-to-peer ecosystem where professionals architect their expertise through high-fidelity knowledge transfer — no currency, just pure intellectual arbitrage.
              </p>
              <div className="lp-hero-actions">
                <Link href="/join" className="lp-btn-primary">
                  Join the Network <ArrowRight size={16} />
                </Link>
                <Link href="/marketplace" className="lp-btn-secondary">
                  Find a Swap Partner
                </Link>
              </div>
              <div className="lp-hero-stats">
                <div>
                  <span className="lp-hero-stat-value">12,482+</span>
                  <span className="lp-hero-stat-label">Verified Experts</span>
                </div>
                <div>
                  <span className="lp-hero-stat-value">98%</span>
                  <span className="lp-hero-stat-label">Swap Success Rate</span>
                </div>
                <div>
                  <span className="lp-hero-stat-value">340+</span>
                  <span className="lp-hero-stat-label">Skill Domains</span>
                </div>
              </div>
            </div>

            <div className="lp-hero-visual animate-fade-in">
              <div className="lp-hero-image-wrap">
                <img src="/images/hero.png" alt="SkillNet platform preview" />
              </div>
              <div className="lp-floating-card animate-float">
                <div className="lp-floating-card-icon">
                  <Zap size={22} fill="white" color="white" strokeWidth={1} />
                </div>
                <div>
                  <h4>12,482+</h4>
                  <p>Professionals exchanging high-value skillsets right now.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUSTED BY ── */}
        <div className="lp-trusted">
          <div className="lp-trusted-inner">
            <p className="lp-trusted-label">Trusted by professionals from</p>
            <div className="lp-trusted-logos">
              <span>Fintech Corp</span>
              <span>Nexus Arch</span>
              <span>Global Ledger</span>
              <span>Tech Mint</span>
              <span>Valuation Pro</span>
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="lp-section">
          <div className="lp-section-inner">
            <span className="lp-section-tag">Our Framework</span>
            <h2 className="lp-section-title">How SkillNet Operates</h2>
            <p className="lp-section-subtitle">
              Three precise steps to transform your professional trajectory through the power of knowledge exchange.
            </p>

            <div className="lp-steps">
              <div className="lp-step">
                <div className="lp-step-number">Step 01</div>
                <div className="lp-step-icon">
                  <BookOpen size={26} color="#0c2b54" strokeWidth={2} />
                </div>
                <h3>Learn</h3>
                <p>Access a curriculum designed by industry architects. Deep-dive into technical taxonomies and professional methodologies curated for real-world application.</p>
                <Link href="/catalog" className="lp-step-link">
                  Explore Curriculum <ChevronRight size={15} />
                </Link>
              </div>

              <div className="lp-step">
                <div className="lp-step-number">Step 02</div>
                <div className="lp-step-icon">
                  <ArrowLeftRight size={26} color="#0c2b54" strokeWidth={2} />
                </div>
                <h3>Swap</h3>
                <p>Engage in peer-to-peer knowledge arbitrage. Trade your technical mastery for another professional's expertise in a secure, milestoned sandbox.</p>
                <Link href="/marketplace" className="lp-step-link">
                  Find a Partner <ChevronRight size={15} />
                </Link>
              </div>

              <div className="lp-step">
                <div className="lp-step-number">Step 03</div>
                <div className="lp-step-icon">
                  <TrendingUp size={26} color="#0c2b54" strokeWidth={2} />
                </div>
                <h3>Grow</h3>
                <p>Validate your growth through our architectural ledger. Build a verifiable portfolio of skills backed by real professional exchanges.</p>
                <Link href="/join" className="lp-step-link">
                  Build Your Portfolio <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── ESCROW PROTOCOL ── */}
        <section className="lp-protocol">
          <div className="lp-protocol-inner">
            <div className="lp-protocol-content">
              <span className="lp-protocol-tag">Secure Exchange Protocol</span>
              <h2>The Escrow<br />Trust Protocol</h2>
              <p className="lead">
                Institutional-grade security for every intellectual exchange. Our ledger ensures value transfers only when professional milestones are verified and met.
              </p>

              <div className="lp-protocol-items">
                <div className="lp-protocol-item">
                  <div className="lp-protocol-item-icon">
                    <ShieldCheck size={22} color="#6bf0a5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4>Identity Verification</h4>
                    <p>Every member undergoes a multi-layer professional vetting process to ensure network integrity and trust.</p>
                  </div>
                </div>
                <div className="lp-protocol-item">
                  <div className="lp-protocol-item-icon">
                    <Lock size={22} color="#6bf0a5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4>Milestone-based Release</h4>
                    <p>Credits and certifications are released proportionally as specific learning outcomes are documented and validated.</p>
                  </div>
                </div>
                <div className="lp-protocol-item">
                  <div className="lp-protocol-item-icon">
                    <Scale size={22} color="#6bf0a5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4>Conflict Resolution</h4>
                    <p>Our dedicated architectural board provides expert mediation for any discrepancies in knowledge transfer quality.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-protocol-visual animate-fade-in">
              <img src="/images/protocol.png" alt="Secure Escrow Protocol" />
              <div className="lp-protocol-badge animate-pulse-glow">
                100%
                <span>Secure Delivery</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="lp-testimonials">
          <div className="lp-testimonials-inner">
            <div className="lp-testimonials-header">
              <span className="lp-section-tag">Professional Outcomes</span>
              <h2 className="lp-section-title">Trusted by Industry Leaders</h2>
              <p className="lp-section-subtitle" style={{ margin: '0 auto' }}>
                Real professionals. Real exchanges. Real results.
              </p>
            </div>

            <div className="lp-testimonials-grid">
              <div className="lp-testimonial-card">
                <div className="lp-testimonial-stars">★★★★★</div>
                <p className="lp-testimonial-quote">
                  "SkillNet allowed me to trade my quantitative analysis mastery for expert-level Python automation. The structured exchange felt like a true professional collaboration."
                </p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar">EV</div>
                  <div>
                    <div className="lp-testimonial-name">Elena Vance</div>
                    <div className="lp-testimonial-role">Senior Financial Architect</div>
                  </div>
                </div>
              </div>

              <div className="lp-testimonial-card">
                <div className="lp-testimonial-stars">★★★★★</div>
                <p className="lp-testimonial-quote">
                  "Having a swap partner who understands the nuances of enterprise-grade DevOps was a game changer. The Escrow Protocol gives me complete peace of mind."
                </p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar">MT</div>
                  <div>
                    <div className="lp-testimonial-name">Marcus Thorne</div>
                    <div className="lp-testimonial-role">Cloud Infrastructure Lead</div>
                  </div>
                </div>
              </div>

              <div className="lp-testimonial-card">
                <div className="lp-testimonial-stars">★★★★★</div>
                <p className="lp-testimonial-quote">
                  "The knowledge taxonomy here is unprecedented. I've architected a completely new skillset in strategic operations through high-fidelity swaps that actually stick."
                </p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar">JR</div>
                  <div>
                    <div className="lp-testimonial-name">Julian Rossi</div>
                    <div className="lp-testimonial-role">Head of Product Strategy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-cta">
          <div className="lp-cta-inner">
            <div className="lp-cta-card">
              <h2>Ready to architect<br />your expertise?</h2>
              <p>
                Join 12,000+ professionals already exchanging high-value skillsets on the world's most trusted knowledge exchange network.
              </p>
              <div className="lp-cta-actions">
                <Link href="/join" className="lp-cta-btn-primary">
                  Join the Network <ArrowRight size={16} />
                </Link>
                <Link href="/catalog" className="lp-cta-btn-secondary">
                  Explore Courses
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
