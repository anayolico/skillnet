'use client';
import React from 'react';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import styles from '../auth.module.css';

export default function Login() {
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
      <div className={styles.authContent} style={{ paddingBottom: '6rem' }}>

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

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <SignIn routing="hash" appearance={{
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

          <div className={styles.secureBadgeText} style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.6, fontSize: '0.8rem' }}>
            🛡️ Encrypted & Secure Session
          </div>

          <div className={styles.authFooter}>
            New to SkillNet? 
            <Link href="/join" className={styles.authFooterLink}>
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
