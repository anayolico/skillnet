'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { Shield, Linkedin, Eye, EyeOff } from 'lucide-react';
import styles from '../auth.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      // Verification check: Ensure user exists in our local DB
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const verifyRes = await fetch(`${apiUrl}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${signInData.session?.access_token}`
          }
        });

        if (!verifyRes.ok) {
          const detail = await verifyRes.json();
          setError(detail.error || "Access Denied: Account not found in our professional records.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        const verifyData = await verifyRes.json();
        router.push(verifyData.isOnboarded ? '/dashboard' : '/onboarding');
      } catch (err) {
        setError("System synchronization error. Please try again later.");
        await supabase.auth.signOut();
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Desktop Visual Side */}
      <div className={styles.authVisual}>
        <div className={styles.authVisualBg}></div>
        <div className={styles.authVisualLogo}>
          <Shield className={styles.authVisualLucideShield} size={32} fill="white" strokeWidth={1} />
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
            <Shield className={styles.authVisualLucideShield} size={28} fill="#0c2b54" strokeWidth={1} style={{ marginRight: '0.5rem' }} />
            SkillNet
          </div>

          <span className={styles.headerTag}>Architecting Careers</span>
          <h1 className={styles.title}>Welcome<br />Back.</h1>
          <p className={styles.subtitle}>
            Access your professional ledger and<br />continue building your expert network.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label className={styles.label}>Email Address</label>
              </div>
              <input
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
                <label className={styles.label}>Password</label>
                <Link href="#" className={styles.forgotLink}>FORGOT?</Link>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="Password"
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

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Authenticating...' : 'Login to SkillNet'}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>Or secure entry with</span>
          </div>

          <div className={styles.ssoGrid}>
            <button className={styles.ssoBtn} onClick={() => supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` }
            })}>
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className={styles.ssoBtn} onClick={() => supabase.auth.signInWithOAuth({
              provider: 'linkedin_oidc',
              options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` }
            })}>
              <Linkedin size={18} color="#0A66C2" />
              LinkedIn
            </button>
          </div>

          <div className={styles.secureBadgeText} style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.6, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Shield size={14} /> Encrypted & Secure Session
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
