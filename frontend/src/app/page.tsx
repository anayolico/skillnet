import React from 'react';
import Link from 'next/link';
import AppNav from '../../components/AppNav';
import Footer from '../../components/Footer';
import { 
  Zap, 
  BookOpen, 
  ArrowLeftRight, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Scale,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  return (
    <>
      <AppNav mode="public" />

      <main className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
        {/* Hero Section */}
        <section className="container">
          <div className="hero">
            <div className="hero-content">
              <span className="tag animate-fade-in delay-100">The Knowledge Exchange Protocol</span>
              <h1 className="animate-fade-in delay-200">Master the Art of the Exchange</h1>
              <p className="animate-fade-in delay-300">A sophisticated peer-to-peer ecosystem designed for professionals to architect their expertise through high-fidelity knowledge transfer.</p>
              <div className="hero-actions animate-fade-in delay-300">
                <Link href="/catalog" className="btn btn-primary">Explore Courses</Link>
                <Link href="/marketplace" className="btn btn-outline">Find a Swap Partner</Link>
              </div>
            </div>
            <div className="hero-visual animate-fade-in delay-300">
              <img src="/images/hero.png" alt="SkillNet Dashboard" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
              <div className="hero-widget animate-float">
                <div className="hero-widget-icon">
                  <Zap size={20} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
                </div>
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
              <div className="feature-icon"><BookOpen size={28} color="#0c2b54" /></div>
              <h3>1. Learn</h3>
              <p>Access a curriculum designed by industry architects. Deep-dive into technical taxonomies and professional methodologies.</p>
              <Link href="/catalog" className="feature-link">Explore Curriculum <ChevronRight size={16} /></Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><ArrowLeftRight size={28} color="#0c2b54" /></div>
              <h3>2. Swap</h3>
              <p>Engage in peer-to-peer knowledge arbitrage. Trade your technical mastery for another professional's expertise in a secure sandbox.</p>
              <Link href="/marketplace" className="feature-link">Find a Partner <ChevronRight size={16} /></Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><TrendingUp size={28} color="#0c2b54" /></div>
              <h3>3. Grow</h3>
              <p>Validate your growth through our architectural ledger. Build a portfolio of verified skills backed by real professional exchanges.</p>
              <Link href="/profile" className="feature-link">View Your Portfolio <ChevronRight size={16} /></Link>
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
                  <div className="protocol-item-icon">
                    <ShieldCheck size={24} color="#0c2b54" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4>Identity Verification</h4>
                    <p>Every network member undergoes a multi-layer professional vetting process to ensure network integrity.</p>
                  </div>
                </div>
                <div className="protocol-item">
                  <div className="protocol-item-icon">
                    <Lock size={24} color="#0c2b54" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4>Milestone-based Release</h4>
                    <p>Credits and certifications are released proportionally as specific learning outcomes are documented.</p>
                  </div>
                </div>
                <div className="protocol-item">
                  <div className="protocol-item-icon">
                    <Scale size={24} color="#0c2b54" strokeWidth={2.5} />
                  </div>
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
              <Link href="/catalog" className="btn btn-primary" style={{ border: '1px solid #ffffff30' }}>View Skill Catalog</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
