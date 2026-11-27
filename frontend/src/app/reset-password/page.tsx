'use client';

import { Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import BrandLogo from '../../../components/BrandLogo';
import PasswordRules from '../../../components/PasswordRules';
import { useToast } from '@/components/Toast';
import { getApiUrl } from '@/src/utils/config';
import {
  isPasswordStrong,
  validateConfirmPassword,
  validatePassword,
} from '@/src/utils/validation';
import styles from '../auth.module.css';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [token, setToken] = useState<string>('');
  const [tokenStatus, setTokenStatus] = useState<'validating' | 'valid' | 'invalid' | 'done'>(
    'validating'
  );
  const [tokenError, setTokenError] = useState<string>(
    'This password reset link is invalid or has expired.'
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (hasValidated.current) return;
    hasValidated.current = true;

    const rawToken = searchParams.get('token')?.trim() || '';

    // Remove sensitive reset token from browser URL/history immediately
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, '/reset-password');
    }

    if (!rawToken) {
      setTokenStatus('invalid');
      setTokenError('No password reset token found. Please request a new reset link.');
      return;
    }

    setToken(rawToken);

    const validateToken = async () => {
      try {
        const res = await fetch(
          `${getApiUrl()}/api/auth/reset-password/validate?token=${encodeURIComponent(rawToken)}`
        );
        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenStatus('valid');
        } else {
          setTokenError(data.error || 'This password reset link is invalid or has expired.');
          setTokenStatus('invalid');
        }
      } catch {
        setTokenError('Unable to verify your reset link. Please try again.');
        setTokenStatus('invalid');
      }
    };

    validateToken();
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const pwdCheck = validatePassword(newPassword);
    if (!pwdCheck.valid) {
      showToast(pwdCheck.error, 'error');
      return;
    }

    const confirmCheck = validateConfirmPassword(newPassword, confirmPassword);
    if (!confirmCheck.valid) {
      showToast(confirmCheck.error, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Could not reset password.', 'error');
        if (res.status === 400 && String(data.error || '').toLowerCase().includes('expired')) {
          setTokenError(data.error);
          setTokenStatus('invalid');
        }
        return;
      }

      setTokenStatus('done');
      showToast('Password reset successfully. Please sign in.', 'success');
    } catch {
      showToast('Network error while resetting password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = isPasswordStrong(newPassword) && confirmPassword === newPassword && !submitting;

  return (
    <div className={styles.pageWrapper}>
      {/* Left Visual Side — matches /login & /join */}
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
          <h2 className={styles.authVisualTitle}>Secure your account with a new password.</h2>
          <p className={styles.authVisualSubtitle}>
            Resetting your password immediately signs out older sessions so your workspace and
            exchanges remain protected.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className={styles.authContent}>
        <Link href="/login" className={styles.backHomeLink}>
          <ArrowLeft size={15} /> Back to Log in
        </Link>

        <div className={styles.authCard}>
          <div className={styles.logo}>
            <Link href="/" aria-label="SkillNet Home">
              <BrandLogo variant="dark" size="md" />
            </Link>
          </div>

          <h1 className={styles.title}>Reset your password.</h1>

          {tokenStatus === 'validating' && (
            <div className={styles.statusCard}>
              <p className={styles.statusBody}>Verifying your secure reset link...</p>
            </div>
          )}

          {tokenStatus === 'invalid' && (
            <div className={styles.statusCard}>
              <div className={styles.statusIconError}>
                <AlertTriangle size={20} />
              </div>
              <div className={styles.statusTitle}>Reset link unavailable</div>
              <p className={styles.statusBody}>{tokenError}</p>
              <button
                type="button"
                className={styles.submitBtn}
                onClick={() => router.push('/login')}
                style={{ marginTop: '0.35rem' }}
              >
                Return to Log in <ArrowRight size={16} />
              </button>
            </div>
          )}

          {tokenStatus === 'done' && (
            <div className={styles.statusCard}>
              <div className={styles.statusIconSuccess}>
                <CheckCircle2 size={20} />
              </div>
              <div className={styles.statusTitle}>Password updated</div>
              <p className={styles.statusBody}>
                Your new password is saved and all older sessions have been signed out. You can now
                sign in securely.
              </p>
              <button
                type="button"
                className={styles.submitBtn}
                onClick={() => router.push('/login')}
                style={{ marginTop: '0.35rem' }}
              >
                Sign in to SkillNet <ArrowRight size={16} />
              </button>
            </div>
          )}

          {tokenStatus === 'valid' && (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.formGroup}>
                <div className={styles.labelWrapper}>
                  <label htmlFor="reset-new-password" className={styles.label}>
                    New password
                  </label>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    id="reset-new-password"
                    type={showNew ? 'text' : 'password'}
                    className={`${styles.input} ${styles.passwordInput}`}
                    placeholder="Create a strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowNew((v) => !v)}
                    aria-label={showNew ? 'Hide password' : 'Show password'}
                    aria-pressed={showNew}
                  >
                    {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <PasswordRules password={newPassword} compact />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelWrapper}>
                  <label htmlFor="reset-confirm-password" className={styles.label}>
                    Confirm new password
                  </label>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    id="reset-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    className={`${styles.input} ${styles.passwordInput}`}
                    placeholder="Re-enter your new password"
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
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    aria-pressed={showConfirm}
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                  <p className={styles.fieldErrorText}>Passwords do not match.</p>
                )}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={!canSubmit}>
                {submitting ? (
                  'Updating password...'
                ) : (
                  <>
                    Update Password <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className={styles.secureBadgeText}>
                <Shield size={14} /> Single-use encrypted reset link
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f7f9fc',
            color: '#475569',
          }}
        >
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
