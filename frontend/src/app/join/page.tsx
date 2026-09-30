'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { getApiUrl } from '@/src/utils/config';
import { Shield, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import styles from '../auth.module.css';

export default function Join() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const [firstName, ...lastNames] = fullName.split(' ');
    const lastName = lastNames.join(' ');

    try {
      const apiUrl = getApiUrl();
      const regRes = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName })
      });

      if (!regRes.ok) {
        const data = await regRes.json();
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Automatically sign in
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed after registration');
        setLoading(false);
      } else {
        router.push('/onboarding');
      }
    } catch (err) {
      setError('System error during registration');
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Desktop Visual Side */}
      <div className={styles.authVisual}>
        <div className={styles.authVisualBg}></div>
        <div className={styles.authVisualLogo}>
          <Shield className={styles.authVisualLucideShield} size={32} fill="white" strokeWidth={1} />
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
            <Shield className={styles.authVisualLucideShield} size={28} fill="#0c2b54" strokeWidth={1} style={{ marginRight: '0.5rem' }} />
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
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.checkboxWrapper}>
              <input type="checkbox" className={styles.checkbox} required id="terms" />
              <label htmlFor="terms" className={styles.checkboxText}>
                I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
              </label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Profile...' : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Join Network <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div className={styles.secureBadgeText} style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.8rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Shield size={14} /> Escrow Trust Secured
          </div>

          <div className={styles.avatarGroup}>
            {[1, 2, 3].map(i => (
              <div key={i} className={`${styles.avatar} styles.avatarBg${i}`}>
                <User size={16} color="white" />
              </div>
            ))}
            <div className={styles.avatar} style={{ backgroundColor: '#f1f5f9', color: '#0f3d7b', fontSize: '10px' }}>+12k</div>
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
