'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppNav from '../../../components/AppNav';
import Skeleton from '../../../components/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { getApiUrl } from '@/src/utils/config';
import { ShieldAlert, User, Mail, Briefcase, AlertTriangle, X } from 'lucide-react';
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
        alert('Your SkillNet account has been permanently deleted.');
        logout();
        router.push('/join');
      } else {
        alert('Failed to delete account. Please try again.');
        setDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting account.');
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
            <h2 className={styles.cardTitle} style={{ color: '#b91c1c' }}>Danger Zone</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700, color: '#0f172a' }}>Delete Account</p>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Permanently remove your SkillNet profile, active swaps, and all data.</p>
              </div>
              <button
                onClick={openDeleteModal}
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  border: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Professional Multi-step Delete Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className={styles.modalTitle}>
                  <AlertTriangle size={24} /> Delete Account
                </h3>
                <button
                  onClick={closeDeleteModal}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={20} />
                </button>
              </div>
              <p className={styles.modalSubtitle}>
                {deleteStep === 1
                  ? 'We are sorry to see you go. Please tell us why you are leaving so we can improve SkillNet.'
                  : 'Final verification: Confirm your identity to permanently erase your profile and records.'}
              </p>
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
                        style={{ marginRight: '0.75rem' }}
                      />
                      {reason}
                    </label>
                  ))}
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <label className={styles.label} style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Additional feedback (optional)
                  </label>
                  <textarea
                    className={styles.input}
                    style={{ minHeight: '70px', padding: '0.75rem' }}
                    placeholder="Anything we could have done better?"
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button className={styles.cancelModalBtn} onClick={closeDeleteModal}>
                    Keep My Account
                  </button>
                  <button
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
                    To prevent accidental deletions, please type your full name <strong>{firstName} {lastName}</strong> or your email <strong>{email}</strong> below:
                  </p>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder={`Type "${email || `${firstName} ${lastName}`}"`}
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    className={styles.cancelModalBtn}
                    onClick={() => setDeleteStep(1)}
                    disabled={deleting}
                  >
                    ← Back
                  </button>
                  <button
                    className={styles.deleteDangerBtn}
                    disabled={!isIdentityVerified || deleting}
                    onClick={handleExecuteDelete}
                  >
                    {deleting ? 'Deleting Account...' : 'Permanently Delete Account'}
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
