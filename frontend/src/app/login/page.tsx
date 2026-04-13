'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import styles from '../auth.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
              <span style={{ color: '#EA4335', fontWeight: 'bold' }} className={styles.ssoIcon}>G</span>
              Google
            </button>
            <button className={styles.ssoBtn} onClick={() => supabase.auth.signInWithOAuth({ 
              provider: 'linkedin_oidc', 
              options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` } 
            })}>
              <span style={{ color: '#0A66C2', fontWeight: 'bold' }} className={styles.ssoIcon}>in</span>
              LinkedIn
            </button>
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
