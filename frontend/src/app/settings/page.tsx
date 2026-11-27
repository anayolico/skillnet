'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppNav from '../../../components/AppNav';
import Skeleton from '../../../components/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { getApiUrl } from '@/src/utils/config';
import {
  isPasswordStrong,
  validateConfirmPassword,
  validatePassword,
} from '@/src/utils/validation';
import PasswordRules from '../../../components/PasswordRules';
import { AlertTriangle, Eye, EyeOff, X } from 'lucide-react';
import styles from './settings.module.css';

const LEAVE_REASONS = [
  'Achieved my skill exchange goals',
  'Not enough skill matches in my area',
  'Platform too complex / difficult to use',
  'Privacy or account security concerns',
  'Taking a temporary break',
  'Other reason'
];

export default function Settings() {
  const router = useRouter();
  const { user, getToken, logout, isLoading } = useAuth();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [headline, setHeadline] = useState('');
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [escrowReceipts, setEscrowReceipts] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);
  const [passwordCooldownUntil, setPasswordCooldownUntil] = useState<string | null>(null);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Multi-step Delete Account Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  const [confirmInput, setConfirmInput] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        const token = getToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success && data.user) {
          const u = data.user;
          setFirstName(u.firstName || '');
          setLastName(u.lastName || '');
          setEmail(u.email || '');
          setHeadline(u.profile?.headline || '');
          if (typeof u.hasPassword === 'boolean') {
            setHasPassword(u.hasPassword);
          }
          setPasswordCooldownUntil(u.passwordCooldownUntil || null);
          
          if (u.profile) {
            if (u.profile.matchAlerts !== undefined) setMatchAlerts(u.profile.matchAlerts);
            if (u.profile.publicProfile !== undefined) setPublicProfile(u.profile.publicProfile);
            if (u.profile.escrowReceipts !== undefined) setEscrowReceipts(u.profile.escrowReceipts);
          }
        }
      } catch (err) {
        console.error('Failed to load settings data', err);
      } finally {
        setLoading(false);
      }
    }

    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadUserData();
      }
    }
  }, [user, isLoading, router]);

  const openPasswordModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowCurrentPwd(false);
    setShowNewPwd(false);
    setShowConfirmPwd(false);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    if (updatingPassword) return;
    setIsPasswordModalOpen(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasPassword && !currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }

    const pwdCheck = validatePassword(newPassword);
    if (!pwdCheck.valid) {
      showToast(pwdCheck.error, 'error');
      return;
    }

    const confirmCheck = validateConfirmPassword(newPassword, confirmNewPassword);
    if (!confirmCheck.valid) {
      showToast(confirmCheck.error, 'error');
      return;
    }

    if (hasPassword && currentPassword === newPassword) {
      showToast('New password must be different from your current password.', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${getApiUrl()}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: hasPassword ? currentPassword : '',
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.passwordCooldownUntil) {
          setPasswordCooldownUntil(data.passwordCooldownUntil);
        }
        showToast(data.error || 'Could not update password.', 'error');
        return;
      }

      setHasPassword(true);
      if (data.passwordCooldownUntil) {
        setPasswordCooldownUntil(data.passwordCooldownUntil);
      }
      setIsPasswordModalOpen(false);
      showToast(data.message || 'Password updated successfully.', 'success');
    } catch {
      showToast('Network error while updating password.', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const isCooldownActive =
    Boolean(passwordCooldownUntil) && new Date(passwordCooldownUntil as string).getTime() > Date.now();

  const cooldownDateLabel = isCooldownActive
    ? new Date(passwordCooldownUntil as string).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const canSubmitPassword =
    !isCooldownActive &&
    (!hasPassword || currentPassword.length > 0) &&
    isPasswordStrong(newPassword) &&
    confirmNewPassword === newPassword &&
    (!hasPassword || currentPassword !== newPassword);

  const saveSettings = async (overrides?: { matchAlerts?: boolean; publicProfile?: boolean; escrowReceipts?: boolean }) => {
    setSaving(true);
    try {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          headline,
          matchAlerts: overrides?.matchAlerts !== undefined ? overrides.matchAlerts : matchAlerts,
          publicProfile: overrides?.publicProfile !== undefined ? overrides.publicProfile : publicProfile,
          escrowReceipts: overrides?.escrowReceipts !== undefined ? overrides.escrowReceipts : escrowReceipts
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('Settings saved successfully', 'success');
      } else {
        showToast(data.error || 'Failed to update settings', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings();
  };

  const handleTogglePreference = (key: 'matchAlerts' | 'publicProfile' | 'escrowReceipts', value: boolean) => {
    if (key === 'matchAlerts') setMatchAlerts(value);
    if (key === 'publicProfile') setPublicProfile(value);
    if (key === 'escrowReceipts') setEscrowReceipts(value);
    saveSettings({ [key]: value });
  };

  const openDeleteModal = () => {
    setDeleteStep(1);
    setSelectedReason('');
    setFeedbackNote('');
    setConfirmInput('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setIsDeleteModalOpen(false);
  };

  // Expected confirmation phrase is user's email or full name
  const expectedName = `${firstName} ${lastName}`.trim().toLowerCase();
  const expectedEmail = email.trim().toLowerCase();
  const currentInput = confirmInput.trim().toLowerCase();
  const isIdentityVerified = (expectedEmail && currentInput === expectedEmail) || (expectedName && currentInput === expectedName);

  const handleExecuteDelete = async () => {
    if (!isIdentityVerified) return;
    setDeleting(true);

    try {
      const token = getToken();
      if (!token) return;

      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/user`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        showToast('Your SkillNet account has been permanently deleted.', 'success');
        logout();
        router.push('/join');
      } else {
        showToast('Failed to delete account. Please try again.', 'error');
        setDeleting(false);
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting account.', 'error');
      setDeleting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className={styles.settingsRoot}>
        <AppNav />
        <main className={styles.container}>
          <div className={styles.settingsContent}>
            <Skeleton width="min(250px, 100%)" height="36px" variant="text" style={{ marginBottom: '1rem' }} />
            <Skeleton width="min(400px, 100%)" height="20px" variant="text" style={{ marginBottom: '2rem' }} />
            <Skeleton height="280px" variant="rectangular" style={{ marginBottom: '2rem' }} />
            <Skeleton height="200px" variant="rectangular" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.settingsRoot}>
      <AppNav />

      <main className={`${styles.container} reveal`}>
        <div className={styles.settingsContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Account Settings</h1>
            <p className={styles.pageSubtitle}>Update your personal details and platform preferences.</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className={styles.settingsCard}>
              <h2 className={styles.cardTitle}>Personal Information</h2>
              
              <div className={styles.nameGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  disabled
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Email is linked to your authentication account.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Professional Role / Headline</label>
                <input
                  type="text"
                  className={styles.input}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Software Engineer / Mentor"
                />
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>

          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Preferences</h2>
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Match Alerts</span>
                <span className={styles.toggleDesc}>Receive notifications about matching skill offers.</span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={matchAlerts}
                  onChange={(e) => handleTogglePreference('matchAlerts', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Public Profile</span>
                <span className={styles.toggleDesc}>Allow network peers to discover your skills in the marketplace.</span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={publicProfile}
                  onChange={(e) => handleTogglePreference('publicProfile', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Escrow Receipts</span>
                <span className={styles.toggleDesc}>Automatically record proof upon swap completion.</span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={escrowReceipts}
                  onChange={(e) => handleTogglePreference('escrowReceipts', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Security</h2>
            <div className={styles.securityRow}>
              <div>
                <p className={styles.securityRowTitle}>
                  {hasPassword ? 'Change Password' : 'Set Account Password'}
                </p>
                <p className={styles.securityRowDesc}>
                  {isCooldownActive
                    ? `Your password was recently changed. For security, you can change it again on ${cooldownDateLabel} (7-day restriction).`
                    : hasPassword
                      ? 'Update your password regularly to keep your SkillNet account secure.'
                      : 'Your account uses Google Sign-In. Set a password if you also want to log in with email.'}
                </p>
              </div>
              <button
                type="button"
                onClick={openPasswordModal}
                className={styles.changePwdBtn}
                disabled={isCooldownActive}
              >
                {hasPassword ? 'Change Password' : 'Set Password'}
              </button>
            </div>
          </div>

          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle} style={{ color: '#b91c1c' }}>Danger Zone</h2>
            <div className={styles.securityRow}>
              <div>
                <p className={styles.securityRowTitle}>Delete Account</p>
                <p className={styles.securityRowDesc}>Permanently remove your SkillNet profile, active swaps, and all data.</p>
              </div>
              <button
                type="button"
                onClick={openDeleteModal}
                className={styles.dangerOutlineBtn}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className={styles.modalOverlay} onClick={closePasswordModal}>
          <div
            className={`${styles.modalCard} ${styles.modalCardPassword}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleRow}>
                <h3 className={styles.modalTitlePrimary}>
                  {hasPassword ? 'Change Password' : 'Set Password'}
                </h3>
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className={styles.modalCloseBtn}
                  aria-label="Close modal"
                >
                  <X size={19} />
                </button>
              </div>
              <p className={styles.modalSubtitle}>
                {hasPassword
                  ? 'Enter your current password and choose a strong new one.'
                  : 'Create a strong password for email sign-in.'}
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} noValidate>
              {hasPassword && (
                <div className={styles.pwdFieldGroup}>
                  <label htmlFor="settings-current-pwd" className={styles.label}>
                    Current password
                  </label>
                  <div className={styles.pwdInputWrap}>
                    <input
                      id="settings-current-pwd"
                      type={showCurrentPwd ? 'text' : 'password'}
                      className={`${styles.input} ${styles.pwdInput}`}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className={styles.pwdToggle}
                      onClick={() => setShowCurrentPwd((v) => !v)}
                      aria-label={showCurrentPwd ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.pwdFieldGroup}>
                <label htmlFor="settings-new-pwd" className={styles.label}>
                  New password
                </label>
                <div className={styles.pwdInputWrap}>
                  <input
                    id="settings-new-pwd"
                    type={showNewPwd ? 'text' : 'password'}
                    className={`${styles.input} ${styles.pwdInput}`}
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
                    className={styles.pwdToggle}
                    onClick={() => setShowNewPwd((v) => !v)}
                    aria-label={showNewPwd ? 'Hide password' : 'Show password'}
                  >
                    {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordRules password={newPassword} compact />
              </div>

              <div className={styles.pwdFieldGroup}>
                <label htmlFor="settings-confirm-pwd" className={styles.label}>
                  Confirm new password
                </label>
                <div className={styles.pwdInputWrap}>
                  <input
                    id="settings-confirm-pwd"
                    type={showConfirmPwd ? 'text' : 'password'}
                    className={`${styles.input} ${styles.pwdInput}`}
                    placeholder="Re-enter new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                  />
                  <button
                    type="button"
                    className={styles.pwdToggle}
                    onClick={() => setShowConfirmPwd((v) => !v)}
                    aria-label={showConfirmPwd ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmNewPassword.length > 0 && confirmNewPassword !== newPassword && (
                  <p className={styles.fieldMismatch}>Passwords do not match.</p>
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelModalBtn}
                  onClick={closePasswordModal}
                  disabled={updatingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryModalBtn}
                  disabled={!canSubmitPassword || updatingPassword}
                >
                  {updatingPassword
                    ? 'Updating...'
                    : hasPassword
                      ? 'Update Password'
                      : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-step Delete Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
          <div
            className={`${styles.modalCard} ${deleteStep === 2 ? styles.modalCardCompact : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleRow}>
                <h3 className={styles.modalTitle}>
                  <AlertTriangle size={20} /> Delete Account
                </h3>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className={styles.modalCloseBtn}
                  aria-label="Close modal"
                >
                  <X size={19} />
                </button>
              </div>
              {deleteStep === 2 && (
                <p className={styles.modalSubtitle}>Confirm your identity.</p>
              )}
            </div>

            {deleteStep === 1 ? (
              <div>
                <div className={styles.surveyList}>
                  {LEAVE_REASONS.map((reason) => (
                    <label
                      key={reason}
                      className={`${styles.reasonOption} ${selectedReason === reason ? styles.reasonOptionActive : ''}`}
                    >
                      <input
                        type="radio"
                        name="leave_reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className={styles.reasonRadio}
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                <div className={styles.feedbackGroup}>
                  <label className={styles.feedbackLabel}>Additional feedback (optional)</label>
                  <textarea
                    className={`${styles.input} ${styles.feedbackTextarea}`}
                    placeholder="Anything we could have done better?"
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelModalBtn} onClick={closeDeleteModal}>
                    Keep My Account
                  </button>
                  <button
                    type="button"
                    className={styles.deleteDangerBtn}
                    disabled={!selectedReason}
                    onClick={() => setDeleteStep(2)}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className={styles.confirmBox}>
                  <p className={styles.confirmNotice}>
                    {`${firstName} ${lastName}`.trim() ? (
                      <>
                        Type <strong>{`${firstName} ${lastName}`.trim()}</strong> or{' '}
                        <strong>{email}</strong> to confirm deletion:
                      </>
                    ) : (
                      <>
                        Type <strong>{email}</strong> to confirm deletion:
                      </>
                    )}
                  </p>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder={`Type "${email || `${firstName} ${lastName}`.trim()}"`}
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelModalBtn}
                    onClick={() => setDeleteStep(1)}
                    disabled={deleting}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className={styles.deleteDangerBtn}
                    disabled={!isIdentityVerified || deleting}
                    onClick={handleExecuteDelete}
                  >
                    {deleting ? 'Deleting...' : 'Permanently Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
