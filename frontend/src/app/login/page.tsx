'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { startGoogleOAuth } from '@/src/utils/googleOAuth';
import { Shield, Linkedin, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import BrandLogo from '../../../components/BrandLogo';
import styles from '../auth.module.css';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email.trim().toLowerCase(), password);

    if (!result.success) {
      showToast(result.error || 'Invalid email or password', 'error');
      setLoading(false);
    } else {
      router.push(result.user?.isOnboarded ? '/dashboard' : '/onboarding');
    }
  };

  const handleGoogleStart = async () => {
    setGoogleLoading(true);
    const result = await startGoogleOAuth();
    if (!result.ok) {
      showToast(result.error, 'error');
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Desktop Visual Side */}
      <div className={styles.authVisual}>
        <img
          src="/images/hero-exchange.jpg"
          alt="SkillNet peer collaboration session"
          className={styles.authVisualImg}
        />
        <div className={styles.authVisualOverlay} />
        <div className={styles.authVisualLogo}>
          <Link href="/" aria-label="SkillNet Home">
            <BrandLogo variant="light" size="md" />
          </Link>
        </div>
        <div className={styles.authVisualContent}>
          <h2 className={styles.authVisualTitle}>Step back into your active skill swaps.</h2>
          <p className={styles.authVisualSubtitle}>
            Manage pending proposals, open live workspace rooms, and continue verified peer
            exchanges from your dashboard.
          </p>
        </div>
      </div>

      {/* Main Form Side */}
      <div className={styles.authContent}>
        <Link href="/" className={styles.backHomeLink}>
          <ArrowLeft size={15} /> Back
        </Link>
        <div className={styles.authCard}>
          <div className={styles.logo}>
            <Link href="/" aria-label="SkillNet Home">
              <BrandLogo variant="dark" size="md" />
            </Link>
          </div>

          <h1 className={styles.title}>Welcome back.</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label htmlFor="login-email" className={styles.label}>Email address</label>
              </div>
              <input
                id="login-email"
                type="email"
                className={styles.input}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label htmlFor="login-password" className={styles.label}>Password</label>
                <Link href="#" className={styles.forgotLink}>Forgot password?</Link>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="Enter your password"
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

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign in to SkillNet <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>Or continue with</span>
          </div>

          <div className={styles.ssoGrid}>
            <button
              type="button"
              className={styles.ssoBtn}
              onClick={handleGoogleStart}
              disabled={googleLoading}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              {googleLoading ? 'Connecting...' : 'Google'}
            </button>
            <button
              type="button"
              className={styles.ssoBtn}
              onClick={() => showToast('LinkedIn login is coming soon.', 'info')}
            >
              <Linkedin size={18} color="#0A66C2" />
              LinkedIn
            </button>
          </div>

          <div className={styles.secureBadgeText}>
            <Shield size={14} /> Encrypted session protection
          </div>

          <div className={styles.authFooter}>
            New to SkillNet?
            <Link href="/join" className={styles.authFooterLink}>
              Start Swapping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
