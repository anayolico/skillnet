'use client';
import React from 'react';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function Login() {
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
          <a href="/">SkillNet</a>
        </div>
        <div className={styles.authVisualContent}>
          <h2 className={styles.authVisualTitle}>Architect your next career move.</h2>
          <p className={styles.authVisualSubtitle}>Join thousands of professionals trading expertise in the world's most secure knowledge exchange.</p>
        </div>
      </div>

      {/* Main Form Content Side */}
      <div className={styles.authContent}>

        {/* Desktop Header Links */}
        <div className={styles.desktopHeader}>
          <Link href="/join" className={styles.headerLink}>Create an account</Link>
          <Link href="/login" className={`${styles.headerLink} ${styles.activeHeaderLink}`}>Sign In</Link>
        </div>

        <div className={styles.authCard}>
          <div className={styles.logo}>
            <div className={styles.logoShield}></div>
            SkillNet
          </div>

          <span className={styles.headerTag}>Architecting Careers</span>
          <h1 className={styles.title}>Welcome<br />Back.</h1>
          <p className={styles.subtitle}>
            Access your professional ledger and<br />continue building your expert network.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label className={styles.label}>Email Address</label>
              </div>
              <input
                type="email"
                className={styles.input}
                placeholder="name@company.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label className={styles.label}>Password</label>
                <Link href="#" className={styles.forgotLink}>FORGOT?</Link>
              </div>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Login to SkillNet
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>Or secure entry with</span>
          </div>

          <div className={styles.ssoGrid}>
            <button className={styles.ssoBtn}>
              <span style={{ color: '#EA4335', fontWeight: 'bold' }} className={styles.ssoIcon}>G</span>
              Google
            </button>
            <button className={styles.ssoBtn}>
              <span style={{ color: '#0A66C2', fontWeight: 'bold' }} className={styles.ssoIcon}>in</span>
              LinkedIn
            </button>
          </div>

          <div className={styles.secureBadge}>
            🛡️ Encrypted & Secure Session
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className={styles.bottomNav}>
          <Link href="/login" className={`${styles.navItem} ${styles.navItemActive}`}>
            <span className={styles.navIcon}>→]</span>
            Login
          </Link>
          <Link href="/join" className={styles.navItem}>
            <span className={styles.navIcon}>👤+</span>
            Join
          </Link>
        </nav>
      </div>
    </div>
  );
}
