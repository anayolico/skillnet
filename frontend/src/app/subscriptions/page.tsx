'use client';
import React from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import styles from './subscriptions.module.css';

export default function Subscriptions() {
  const tiers = [
    {
      name: 'Essential',
      price: '0',
      description: 'Ideal for those just starting their professional knowledge exchange journey.',
      features: [
        '3 Skill Swaps per month',
        'Access to Public Marketplace',
        'Basic Skill Certification',
        'Standard Search Visibility',
        'Email Support'
      ],
      cta: 'Get Started',
      featured: false
    },
    {
      name: 'Professional',
      price: '49',
      description: 'Designed for architects and executives scaling their technical mastery.',
      features: [
        'Unlimited Skill Swaps',
        'Priority Partner Matching',
        'Verified "Expert" Badge',
        'Access to Industry Labs',
        '24/7 Priority Support',
        'Personal Learning Ledger'
      ],
      cta: 'Go Professional',
      featured: true
    },
    {
      name: 'Architect / Titans',
      price: '149',
      description: 'The elite tier for industry leaders swapping high-stakes expertise.',
      features: [
        ' Titans Private Network Access',
        'C-Level Mentor Matching',
        'Architectural Board Mediation',
        'Custom Learning Tracks',
        'Internal Team Swaps',
        'White-glove Concierge'
      ],
      cta: 'Join The Elite',
      featured: false
    }
  ];

  return (
    <div className={styles.subscriptionsRoot}>
      <AppNav mode="public" />

      <main className={styles.container}>
        <section className={`${styles.hero} reveal`}>
          <span className={styles.tag}>Network Access Protocol</span>
          <h1 className={styles.title}>Refine your Edge. <br /> Architect your Future.</h1>
          <p className={styles.subtitle}>
            Choose the tier that aligns with your professional velocity. 
            All exchanges are secured by our institutional-grade Escrow Protocol.
          </p>
        </section>

        <div className={`${styles.pricingGrid} stagger`}>
          {tiers.map((tier, idx) => (
            <div 
              key={tier.name} 
              className={`${styles.priceCard} ${tier.featured ? styles.featuredCard : ''} reveal hover-lift`}
              style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
            >
              {tier.featured && <div className={styles.featuredBadge}>Most Popular</div>}
              <h3 className={styles.tierName}>{tier.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{tier.price}</span>
                <span className={styles.period}>/mo</span>
              </div>
              <p className={styles.description} style={{ marginBottom: '2rem', opacity: 0.8, fontSize: '0.9rem' }}>
                {tier.description}
              </p>
              
              <ul className={styles.featureList}>
                {tier.features.map(feature => (
                  <li key={feature} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/join">
                <button className={`${styles.ctaBtn} ${tier.featured ? styles.ctaBtnWhite : styles.ctaBtnPrimary} click-scale`}>
                  {tier.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        <section className={`${styles.trustSection} reveal`} style={{ animationDelay: '0.6s' }}>
          <h3 className={styles.trustTitle}>The SkillNet Security Standard</h3>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🛡️</div>
              <h4>Identity Governance</h4>
              <p>Every member is professionally vetted to maintain network integrity.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>⚖️</div>
              <h4>Equity Arbitrage</h4>
              <p>Our ledger ensures equitable time-value exchange for both partners.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🔒</div>
              <h4>Ledger Stability</h4>
              <p>Skill credits are held in trust until outcomes are verified.</p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
