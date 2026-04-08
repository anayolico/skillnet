'use client';
import React from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import styles from './settings.module.css';

export default function Settings() {
  return (
    <div className={`${styles.settingsRoot} reveal`}>
      <AppNav />

      <main className={styles.container}>
        <div className={styles.sideMenu}>
          <div className={`${styles.menuItem} ${styles.active}`}><span>⚙️</span> Account Settings</div>
          <div className={styles.menuItem}><span>🔔</span> Notifications</div>
          <div className={styles.menuItem}><span>🔒</span> Privacy &amp; Security</div>
          <div className={styles.menuItem}><span>💳</span> Payments &amp; Escrow</div>
        </div>

        <div className={styles.settingsContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Account Settings</h1>
            <p className={styles.pageSubtitle}>Update your personal details and platform preferences.</p>
          </div>

          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Personal Information</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input type="text" className={styles.input} defaultValue="Alex Sterling" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" className={styles.input} defaultValue="alex.sterling@example.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Professional Role</label>
              <input type="text" className={styles.input} defaultValue="Senior Software Engineer / Mentor" />
            </div>
            <div style={{marginTop: '2rem', textAlign: 'right'}}>
              <button className={styles.saveBtn}>Save Changes</button>
            </div>
          </div>

          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Preferences</h2>
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Match Alerts</span>
                <span className={styles.toggleDesc}>Receive weekly emails about perfect skill matches.</span>
              </div>
              <label className={styles.switch}><input type="checkbox" defaultChecked /><span className={styles.slider}></span></label>
            </div>
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Public Profile</span>
                <span className={styles.toggleDesc}>Allow non-logged-in visitors to see your portfolio.</span>
              </div>
              <label className={styles.switch}><input type="checkbox" /><span className={styles.slider}></span></label>
            </div>
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Escrow Receipts</span>
                <span className={styles.toggleDesc}>Automatically send receipt records upon swap completion.</span>
              </div>
              <label className={styles.switch}><input type="checkbox" defaultChecked /><span className={styles.slider}></span></label>
            </div>
          </div>

          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Danger Zone</h2>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <p style={{fontWeight:700, color:'#0f172a'}}>Delete Account</p>
                <p style={{fontSize:'0.85rem', color:'#64748b'}}>Permanently remove your SkillNet profile and all data.</p>
              </div>
              <button style={{background:'#fee2e2', color:'#b91c1c', border:'none', padding:'0.75rem 1.25rem', borderRadius:'8px', fontWeight:700, cursor:'pointer'}}>Delete</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
