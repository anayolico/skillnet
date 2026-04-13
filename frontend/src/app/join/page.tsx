'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import styles from '../auth.module.css';

export default function Join() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const [firstName, ...lastNames] = fullName.split(' ');
    const lastName = lastNames.join(' ');

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName || '',
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      if (signUpData?.session) {
        // Sync user to backend immediately if session exists
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
          await fetch(`${apiUrl}/api/auth/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${signUpData.session.access_token}`
            },
            body: JSON.stringify({ metadata: signUpData.user?.user_metadata })
          })
        } catch (e) {
          console.error('Failed to sync new user to DB', e)
        }
      }
      
      router.push('/onboarding');
    }
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

          <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '0 0.5rem 1rem 0', borderRadius: '16px', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
            {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label className={styles.label}>Full Name</label>
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Profile...' : 'Join Network →'}
            </button>
          </form>

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
