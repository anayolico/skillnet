'use client';
import React from 'react';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import styles from '../auth.module.css';

export default function Join() {

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
      <div className={styles.authContent} style={{ paddingBottom: '6rem' }}>

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

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <SignUp routing="hash" appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none p-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-gray-200 border text-black font-semibold",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                footerAction: "hidden"
              }
            }} />
          </div>

          <div className={styles.secureBadgeText} style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.8rem', marginTop: '1rem' }}>
            🛡️ Escrow Trust Secured
          </div>

          <div className={styles.avatarGroup}>
            <div className={`${styles.avatar} ${styles.avatarBg1}`}>👨</div>
            <div className={`${styles.avatar} ${styles.avatarBg2}`}>👨🏻‍💼</div>
            <div className={`${styles.avatar} ${styles.avatarBg3}`}>👨🏽‍💻</div>
            <div className={styles.avatar} style={{ backgroundColor: '#f1f5f9', color: '#0f3d7b' }}>+12k</div>
          </div>
          <p className={styles.avatarSubtext}>Join the verified community today.</p>

          <div className={styles.authFooter}>
            Already have an account? 
            <Link href="/login" className={styles.authFooterLink}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
