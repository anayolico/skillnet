'use client';
import React from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import Footer from '../../../components/Footer';
import styles from './profile.module.css';

export default function Profile() {
  return (
    <div className={`${styles.profileRoot}`}>
      <AppNav />

      <main className={`${styles.container} animate-fade-in`}>
        <div className={styles.coverImage}>
          <div className={`${styles.profileAvatar} reveal-in`}>👨‍💻</div>
          <div className={styles.headerActions}>
            <button className={styles.editBtn}><span>⚙️</span> Edit Profile</button>
            <Link href="/create-listing" className={styles.editBtn} style={{ background: '#4ade80', color: '#0c2b54', border: 'none' }}>
              <span>➕</span> New Listing
            </Link>
          </div>
        </div>

        <div className="reveal">
          <h1 className={styles.userName}>Architect Alex Sterling</h1>
          <p className={styles.userRole}>Senior Software Architect / Expertise Arbitrageur</p>
          <div className={styles.trustBadge}>🛡️ Top 5% Escrow Trust Rating — 1.2k Verified Credits</div>
        </div>

        <div className={styles.mainLayout}>
          <div className="reveal stagger">
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}><span>📄</span> Professional Summary</h2>
              <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1rem' }}>
                Strategic architect focused on high-performance system design and peer-to-peer knowledge transfer. 
                I specialize in vertical scaling using React and Node.js. Currently seeking deep-level risk modeling and 
                enterprise-grade financial arbitrage insights. 
                <strong> 48 successful sessions documented on the ledger.</strong>
              </p>
            </div>

            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className={styles.sectionTitle} style={{ margin: 0 }}><span>📜</span> Verified Exchange History</h2>
                <Link href="/messages" className={styles.viewAllLink}>View Ledger</Link>
              </div>
              <div className={styles.reviewCard}>
                <div className={styles.reviewer}>Elena Vance — Senior Financial Strategist</div>
                <div className={styles.reviewText}>"Alex facilitated an impeccable exchange. His architecture insights were pivotal for our Q3 expansion. Transfer was 100% secure via Escrow Protocol."</div>
              </div>
              <div className={styles.reviewCard}>
                <div className={styles.reviewer}>Marcus Chen — DevOps Lead</div>
                <div className={styles.reviewText}>"Exceptional technical depth. The skill-swap was equitable and highly professional. Looking forward to our next session."</div>
              </div>
            </div>
          </div>

          <div className="reveal stagger" style={{ animationDelay: '0.2s' }}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}><span>⬆️</span> Skills Offered</h2>
              <div className={styles.skillsGrid}>
                <span className={`${styles.skillTag} ${styles.give}`}>System Architecture</span>
                <span className={`${styles.skillTag} ${styles.give}`}>Node.js Scalability</span>
                <span className={`${styles.skillTag} ${styles.give}`}>React Performance</span>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}><span>⬇️</span> Skills Seeking</h2>
              <div className={styles.skillsGrid}>
                <span className={styles.skillTag}>Risk Modeling</span>
                <span className={styles.skillTag}>Financial Arbitrage</span>
                <span className={styles.skillTag}>Strategic Operations</span>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}><span>⚡</span> Network Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/escrow" className={styles.actionLink}>🛡️ Active Trust Contracts</Link>
                <Link href="/subscriptions" className={styles.actionLink}>✨ Upgrade to Executive Tier</Link>
                <Link href="/settings" className={styles.actionLink}>⚙️ Security Preferences</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
