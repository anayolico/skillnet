import { getApiUrl } from '@/src/utils/config';
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import Skeleton from '../../../components/Skeleton';
import { 
  Settings, 
  Plus, 
  ShieldCheck, 
  FileText, 
  History, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Zap,
  User,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './profile.module.css';

export default function Profile() {
  const { user, getToken } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = getToken();
        if (!token) return;

        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/api/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchUserData();
    }
  }, [user]);


  if (loading) {
    return (
      <div className={styles.profileRoot}>
        <AppNav />
        <div className={styles.container}>
          <div className={styles.coverImage}>
            <div className={styles.profileAvatar}>
              <Skeleton width="100%" height="100%" borderRadius="50%" variant="circular" />
            </div>
            <div className={styles.headerActions}>
              <Skeleton width="120px" height="40px" borderRadius="8px" variant="rectangular" />
              <Skeleton width="120px" height="40px" borderRadius="8px" variant="rectangular" />
            </div>
          </div>
          <div>
            <Skeleton width="250px" height="40px" variant="text" style={{ marginBottom: '1rem' }} />
            <Skeleton width="180px" height="20px" variant="text" style={{ marginBottom: '1.5rem' }} />
            <Skeleton width="350px" height="24px" borderRadius="20px" variant="rectangular" />
          </div>
          <div className={styles.mainLayout} style={{ marginTop: '3rem' }}>
            <div>
              <Skeleton height="200px" variant="rectangular" style={{ marginBottom: '2rem' }} />
              <Skeleton height="300px" variant="rectangular" />
            </div>
            <div>
              <Skeleton height="150px" variant="rectangular" style={{ marginBottom: '2rem' }} />
              <Skeleton height="150px" variant="rectangular" style={{ marginBottom: '2rem' }} />
              <Skeleton height="200px" variant="rectangular" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = userData?.firstName ? `${userData.firstName} ${userData.lastName || ''}` : 'SkillNet Expert';
  const displayRole = userData?.profile?.headline || 'Expertise Arbitrageur';
  const displayBio = userData?.profile?.bio || 'No professional summary provided yet.';
  const skillsOffered = userData?.profile?.skillsOffered || [];
  const skillsSought = userData?.profile?.skillsSought || [];

  return (
    <div className={`${styles.profileRoot}`}>
      <AppNav />

      <main className={`${styles.container} animate-fade-in`}>
        <div className={styles.coverImage}>
          <div className={`${styles.profileAvatar} reveal-in`}>
             <User size={64} strokeWidth={1.5} color="#0c2b54" />
          </div>
          <div className={styles.headerActions}>
            <Link href="/profile/edit" className={styles.editBtn}>
              <Settings size={16} /> Edit Profile
            </Link>
            <Link href="/create-listing" className={styles.editBtn} style={{ background: '#4ade80', color: '#0c2b54', border: 'none' }}>
              <Plus size={16} /> New Listing
            </Link>
          </div>
        </div>

        <div className="reveal">
          <h1 className={styles.userName}>{displayName}</h1>
          <p className={styles.userRole}>{displayRole}</p>
          <div className={styles.trustBadge}>
             <ShieldCheck size={16} style={{ marginRight: '8px' }} /> Top 5% Escrow Trust Rating — 1.2k Verified Credits
          </div>
        </div>

        <div className={styles.mainLayout}>
          <div className="reveal stagger">
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <FileText size={20} style={{ marginRight: '8px' }} /> Professional Summary
              </h2>
              <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1rem' }}>
                {displayBio}
              </p>
            </div>

            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                  <History size={20} style={{ marginRight: '8px' }} /> Verified Exchange History
                </h2>
                <Link href="/chats" className={styles.viewAllLink}>View Ledger</Link>
              </div>
              <div className={styles.reviewCard}>
                <div className={styles.reviewer}>Elena Vance — Senior Financial Strategist</div>
                <div className={styles.reviewText}>"Alex facilitated an impeccable exchange. His architecture insights were pivotal for our Q3 expansion. Transfer was 100% secure via Escrow Protocol."</div>
              </div>
              <div className={styles.reviewCard}>
                <div className={styles.reviewer}>Marcus Chen — DevOps Lead</div>
                <div className={styles.reviewText}>"Exceptional technical depth. The skill-swap was equitable and highly professional. Looking forward to our next session."</div>
              </div>
            </div>
          </div>

          <div className="reveal stagger" style={{ animationDelay: '0.2s' }}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <ArrowUpCircle size={20} style={{ marginRight: '8px' }} /> Skills Offered
              </h2>
              <div className={styles.skillsGrid}>
                {skillsOffered.length > 0 ? skillsOffered.map((skill: string) => (
                  <span key={skill} className={`${styles.skillTag} ${styles.give}`}>{skill}</span>
                )) : <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No skills listed yet.</p>}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <ArrowDownCircle size={20} style={{ marginRight: '8px' }} /> Skills Seeking
              </h2>
              <div className={styles.skillsGrid}>
                {skillsSought.length > 0 ? skillsSought.map((skill: string) => (
                  <span key={skill} className={styles.skillTag}>{skill}</span>
                )) : <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No skills listed yet.</p>}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <Zap size={20} style={{ marginRight: '8px' }} /> Network Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/escrow" className={styles.actionLink}>
                  <ShieldCheck size={16} /> Active Trust Contracts
                </Link>
                <Link href="/subscriptions" className={styles.actionLink}>
                  <Sparkles size={16} /> Upgrade to Executive Tier
                </Link>
                <Link href="/settings" className={styles.actionLink}>
                  <Settings size={16} /> Security Preferences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
