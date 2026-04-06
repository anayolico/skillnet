import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <header>
        <div className="container nav-container">
          <div className="nav-logo"><a href="/">SkillNet</a></div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">Catalog</a>
            <a href="#">Marketplace</a>
            <a href="#">Subscriptions</a>
            <Link href="/login" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Login</Link>
          </nav>
          <div className="nav-actions">
            <Link href="/join" className="btn btn-primary">Join Network</Link>
          </div>
        </div>
      </header>

      <main className="animate-fade-in">
        {/* Hero Section */}
        <section className="container">
          <div className="hero">
            <div className="hero-content">
              <span className="tag animate-fade-in delay-100">The Knowledge Exchange Protocol</span>
              <h1 className="animate-fade-in delay-200">Master the Art of the Exchange</h1>
              <p className="animate-fade-in delay-300">A sophisticated peer-to-peer ecosystem designed for professionals to architect their expertise through high-fidelity knowledge transfer.</p>
              <div className="hero-actions animate-fade-in delay-300">
                <button className="btn btn-primary">Explore Courses</button>
                <button className="btn btn-outline">Find a Swap Partner</button>
              </div>
            </div>
            <div className="hero-visual animate-fade-in delay-300">
              <img src="/images/hero.png" alt="SkillNet Dashboard" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
              <div className="hero-widget animate-float">
                <div className="hero-widget-icon">⚡</div>
                <div className="hero-widget-text">
                  <h4>12,482+</h4>
                  <p>Verified professionals currently exchanging high-value skillsets.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="trusted-by">
            <h5>Trusted by professionals from global leaders</h5>
            <div className="trusted-logos">
              <span>FINTECH_CORP</span>
              <span>NEXUS_ARCH</span>
              <span>GLOBAL_LEDGER</span>
              <span>TECH_MINT</span>
              <span>VALUATION_PRO</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container section-padding">
          <div className="section-header">
            <p>Our Framework</p>
            <h2>How SkillNet Operates</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>1. Learn</h3>
              <p>Access a curriculum designed by industry architects. Deep-dive into technical taxonomies and professional methodologies.</p>
              <a href="#" className="feature-link">Explore Curriculum →</a>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>2. Swap</h3>
              <p>Engage in peer-to-peer knowledge arbitrage. Trade your technical mastery for another professional's expertise in a secure sandbox.</p>
              <a href="#" className="feature-link">Find a Partner →</a>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>3. Grow</h3>
              <p>Validate your growth through our architectural ledger. Build a portfolio of verified skills backed by real professional exchanges.</p>
              <a href="#" className="feature-link">View Taxonomy →</a>
            </div>
          </div>
        </section>

        {/* Protocol Section */}
        <section className="protocol-section">
          <div className="container protocol-grid">
            <div className="protocol-content">
              <span className="tag">Secure Exchange Protocol</span>
              <h2>The Escrow Trust Protocol</h2>
              <p className="lead">We prioritize institutional-grade security for every intellectual exchange. Our ledger ensures that value is transferred only when professional milestones are met.</p>

              <div className="protocol-list">
                <div className="protocol-item">
                  <div className="protocol-item-icon">🛡️</div>
                  <div>
                    <h4>Identity Verification</h4>
                    <p>Every network member undergoes a multi-layer professional vetting process to ensure network integrity.</p>
                  </div>
                </div>
                <div className="protocol-item">
                  <div className="protocol-item-icon">🔒</div>
                  <div>
                    <h4>Milestone-based Release</h4>
                    <p>Credits and certifications are released proportionally as specific learning outcomes are documented.</p>
                  </div>
                </div>
                <div className="protocol-item">
                  <div className="protocol-item-icon">⚖️</div>
                  <div>
                    <h4>Conflict Resolution</h4>
                    <p>Our dedicated architectural board provides mediation for any discrepancies in knowledge transfer quality.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="protocol-visual animate-fade-in delay-300">
              <img src="/images/protocol.png" alt="Secure Escrow Protocol" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
              <div className="protocol-badge animate-pulse-glow">
                100%
                <span>Secure Delivery</span>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="container section-padding testimonials">
          <div className="section-header">
            <p>Professional Outcomes</p>
            <h2>Professional Success Stories</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div>
                  <h4>Elena Vance</h4>
                  <span>Senior Financial Architect</span>
                </div>
              </div>
              <p className="testimonial-quote">"SkillNet allowed me to trade my quantitative analysis mastery for expert-level Python automation. The structured exchange made it feel like a professional collaboration rather than a simple course."</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div>
                  <h4>Marcus Thorne</h4>
                  <span>Cloud Infrastructure Lead</span>
                </div>
              </div>
              <p className="testimonial-quote">"Having a swap partner who actually understands the nuances of enterprise-grade DevOps was a game changer. The Escrow Protocol gives me peace of mind."</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div>
                  <h4>Julian Rossi</h4>
                  <span>Head of Product Strategy</span>
                </div>
              </div>
              <p className="testimonial-quote">"The knowledge taxonomy here is unprecedented. I've architected a completely new skillset in strategic operations through high-fidelity swaps that actually stick."</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section section-padding">
          <div className="container">
            <h2>Ready to architect your expertise?</h2>
            <div className="cta-actions">
              <Link href="/join" className="btn btn-accent">Join the Network</Link>
              <button className="btn btn-primary" style={{ border: '1px solid #ffffff30' }}>View Skill Taxonomy</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h4>SkillNet</h4>
              <p style={{ marginBottom: '1rem' }}>Designing the future of professional knowledge exchange through architectural precision and peer-to-peer trust.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span>𝕏</span> <span>in</span> <span>gh</span>
              </div>
            </div>
            <div className="footer-links">
              <h5>Global Network</h5>
              <ul>
                <li><a href="#">Partner Directory</a></li>
                <li><a href="#">Regional Nodes</a></li>
                <li><a href="#">Exchange Marketplace</a></li>
                <li><a href="#">Corporate Access</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h5>Protocol</h5>
              <ul>
                <li><a href="#">Trust & Safety</a></li>
                <li><a href="#">Skill Taxonomy</a></li>
                <li><a href="#">Privacy Protocol</a></li>
                <li><a href="#">Security Audit</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h5>Company</h5>
              <ul>
                <li><a href="#">About the Ledger</a></li>
                <li><a href="#">Architecture Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} SkillNet Architecture. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
