'use client';
import React from 'react';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function Join() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.pageWrapper}>

      {/* Desktop Visual Side */}
      <div className={styles.authVisual}>
        <div className={styles.authVisualBg}></div>
        <div className={styles.authVisualLogo}>
          <div className={styles.authVisualLogoShield}></div>
          <a href='/'>SkillNet</a>
        </div>
        <div className={styles.authVisualContent}>
          <h2 className={styles.authVisualTitle}>Elevate your professional trajectory.</h2>
          <p className={styles.authVisualSubtitle}>Our escrow trust protocol guarantees 100% secure skill swaps without compromise.</p>
        </div>
      </div>

      {/* Main Form Content Side */}
      <div className={styles.authContent}>

        {/* Desktop Header Links */}
        <div className={styles.desktopHeader}>
          <Link href="/login" className={styles.headerLink}>Sign In</Link>
          <Link href="/join" className={`${styles.headerLink} ${styles.activeHeaderLink}`}>Create an account</Link>
        </div>

        <div className={styles.authCard}>
          <div className={styles.logo}>
            <div className={styles.logoShield}></div>
            SkillNet
          </div>

          <span className={styles.headerTag}>Join The Movement</span>
          <h1 className={styles.title} style={{ fontSize: '2.4rem' }}>Create your<br />professional<br />profile.</h1>
          <p className={styles.subtitle}>
            Join 12,000+ Professionals sharing insights<br />and opportunities across the globe.
          </p>

          <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '0 0.5rem 1rem 0', borderRadius: '16px', marginBottom: '1.5rem' }}>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label className={styles.label}>Full Name</label>
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label className={styles.label}>Email Address</label>
              </div>
              <input
                type="email"
                className={styles.input}
                placeholder="you@professional.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label className={styles.label}>Password</label>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Create a strong password"
                  required
                />
                <span className={styles.inputIcon}>👁️</span>
              </div>
            </div>

            <div className={styles.checkboxWrapper}>
              <input type="checkbox" className={styles.checkbox} required id="terms" />
              <label htmlFor="terms" className={styles.checkboxText}>
                I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
              </label>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Join Network →
            </button>
          </form>

          <div className={styles.secureBadge}>
            🛡️ Escrow Trust Secured
          </div>

          <div className={styles.avatarGroup}>
            <div className={`${styles.avatar} ${styles.avatarBg1}`}>👨</div>
            <div className={`${styles.avatar} ${styles.avatarBg2}`}>👨🏻‍💼</div>
            <div className={`${styles.avatar} ${styles.avatarBg3}`}>👨🏽‍💻</div>
            <div className={styles.avatar} style={{ backgroundColor: '#f1f5f9', color: '#0f3d7b' }}>+12k</div>
          </div>
          <p className={styles.avatarSubtext}>Join the verified community today.</p>
        </div>

        {/* Mobile Nav */}
        <nav className={styles.bottomNav}>
          <Link href="/login" className={styles.navItem}>
            <span className={styles.navIcon}>→]</span>
            Login
          </Link>
          <Link href="/join" className={`${styles.navItem} ${styles.navItemActive}`}>
            <span className={styles.navIcon}>👤+</span>
            Join
          </Link>
        </nav>

      </div>
    </div>
  );
}
