'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import Footer from '../../../components/Footer';
import styles from './profile.module.css';
import { createClient } from '../../utils/supabase/client';

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/me`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
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
    fetchUserData();
  }, []);

  if (loading) return <div className={styles.profileRoot}><AppNav /></div>;

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
          <div className={`${styles.profileAvatar} reveal-in`}>👨‍💻</div>
          <div className={styles.headerActions}>
            <Link href="/profile/edit" className={styles.editBtn}><span>⚙️</span> Edit Profile</Link>
            <Link href="/create-listing" className={styles.editBtn} style={{ background: '#4ade80', color: '#0c2b54', border: 'none' }}>
              <span>➕</span> New Listing
            </Link>
          </div>
        </div>

        <div className="reveal">
          <h1 className={styles.userName}>{displayName}</h1>
          <p className={styles.userRole}>{displayRole}</p>
          <div className={styles.trustBadge}>🛡️ Top 5% Escrow Trust Rating — 1.2k Verified Credits</div>
        </div>

        <div className={styles.mainLayout}>
          <div className="reveal stagger">
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}><span>📄</span> Professional Summary</h2>
              <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1rem' }}>
                {displayBio}
              </p>
            </div>

            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className={styles.sectionTitle} style={{ margin: 0 }}><span>📜</span> Verified Exchange History</h2>
                <Link href="/messages" className={styles.viewAllLink}>View Ledger</Link>
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
              <h2 className={styles.sectionTitle}><span>⬆️</span> Skills Offered</h2>
              <div className={styles.skillsGrid}>
                {skillsOffered.length > 0 ? skillsOffered.map((skill: string) => (
                  <span key={skill} className={`${styles.skillTag} ${styles.give}`}>{skill}</span>
                )) : <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No skills listed yet.</p>}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}><span>⬇️</span> Skills Seeking</h2>
              <div className={styles.skillsGrid}>
                {skillsSought.length > 0 ? skillsSought.map((skill: string) => (
                  <span key={skill} className={styles.skillTag}>{skill}</span>
                )) : <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No skills listed yet.</p>}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}><span>⚡</span> Network Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/escrow" className={styles.actionLink}>🛡️ Active Trust Contracts</Link>
                <Link href="/subscriptions" className={styles.actionLink}>✨ Upgrade to Executive Tier</Link>
                <Link href="/settings" className={styles.actionLink}>⚙️ Security Preferences</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
