'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { getApiUrl } from '@/src/utils/config';
import { startGoogleOAuth } from '@/src/utils/googleOAuth';
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from '@/src/utils/validation';
import PasswordRules from '../../../components/PasswordRules';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Linkedin } from 'lucide-react';
import BrandLogo from '../../../components/BrandLogo';
import styles from '../auth.module.css';

export default function Join() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nameCheck = validateFullName(fullName);
    if (!nameCheck.valid) {
      showToast(nameCheck.error, 'error');
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      showToast(emailCheck.error, 'error');
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      showToast(passwordCheck.error, 'error');
      return;
    }

    const confirmCheck = validateConfirmPassword(password, confirmPassword);
    if (!confirmCheck.valid) {
      showToast(confirmCheck.error, 'error');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = getApiUrl();
      const regRes = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailCheck.value,
          password,
          confirmPassword,
          firstName: nameCheck.firstName,
          lastName: nameCheck.lastName,
        }),
      });

      if (!regRes.ok) {
        const data = await regRes.json();
        showToast(data.error || 'Registration failed', 'error');
        setLoading(false);
        return;
      }

      const result = await login(emailCheck.value, password);

      if (!result.success) {
        showToast(result.error || 'Login failed after registration', 'error');
        setLoading(false);
      } else {
        router.push('/onboarding');
      }
    } catch {
      showToast('System error during registration', 'error');
      setLoading(false);
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
        <Link href="/" className={styles.backHomeLink}>
          <ArrowLeft size={15} /> Back
        </Link>
        <div className={styles.authCard}>
          <div className={styles.logo}>
            <Link href="/" aria-label="SkillNet Home">
              <BrandLogo variant="dark" size="md" />
            </Link>
          </div>

          <h1 className={styles.title}>Create your profile.</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
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
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
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
              <PasswordRules password={password} compact />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label htmlFor="join-confirm-password" className={styles.label}>Confirm password</label>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  id="join-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className={styles.fieldErrorText}>Passwords do not match.</p>
              )}
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
