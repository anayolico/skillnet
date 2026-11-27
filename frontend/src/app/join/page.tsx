'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { getApiUrl } from '@/src/utils/config';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import BrandLogo from '../../../components/BrandLogo';
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
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!regRes.ok) {
        const data = await regRes.json();
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed after registration');
        setLoading(false);
      } else {
        router.push('/onboarding');
      }
    } catch {
      setError('System error during registration');
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Desktop Visual Side */}
      <div className={styles.authVisual}>
        <img
          src="/images/live-session.jpg"
          alt="Modern workspace ready for peer skill exchange"
          className={styles.authVisualImg}
        />
        <div className={styles.authVisualOverlay} />
        <div className={styles.authVisualLogo}>
          <Link href="/" aria-label="SkillNet Home">
            <BrandLogo variant="light" size="md" />
          </Link>
        </div>
        <div className={styles.authVisualContent}>
          <h2 className={styles.authVisualTitle}>Trade what you know for what comes next.</h2>
          <p className={styles.authVisualSubtitle}>
            Build your peer profile, list your core expertise, and start milestone-verified skill
            exchanges on Essential for free.
          </p>
        </div>
      </div>

      {/* Main Form Side */}
      <div className={styles.authContent}>
        <div className={styles.authCard}>
          <div className={styles.logo}>
            <Link href="/" aria-label="SkillNet Home">
              <BrandLogo variant="dark" size="md" />
            </Link>
          </div>

          <span className={styles.headerTag}>Create Account</span>
          <h1 className={styles.title}>Create your profile.</h1>
          <p className={styles.subtitle}>
            Set up your account in under two minutes and list your first skill offer.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorAlert} role="alert">{error}</div>}

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label htmlFor="join-name" className={styles.label}>Full name</label>
              </div>
              <input
                id="join-name"
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
                <label htmlFor="join-email" className={styles.label}>Email address</label>
              </div>
              <input
                id="join-email"
                type="email"
                className={styles.input}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label htmlFor="join-password" className={styles.label}>Password</label>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  id="join-password"
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
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className={styles.checkboxWrapper}>
              <input type="checkbox" className={styles.checkbox} required id="terms" />
              <label htmlFor="terms" className={styles.checkboxText}>
                I agree to the{' '}
                <Link href="/terms" target="_blank" rel="noopener noreferrer">
                  <strong>Terms of Service</strong>
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                  <strong>Privacy Policy</strong>
                </Link>
                .
              </label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                'Creating profile...'
              ) : (
                <>
                  Start Swapping <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className={styles.secureBadgeText}>
            <Shield size={14} /> Protected by SkillNet Escrow Trust
          </div>

          <div className={styles.authFooter}>
            Already have an account?
            <Link href="/login" className={styles.authFooterLink}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
