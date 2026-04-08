'use client';
import React from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import styles from './escrow.module.css';

import Footer from '../../../components/Footer';

export default function Escrow() {
  return (
    <div className={`${styles.escrowRoot}`}>
      <AppNav />

      <main className={`${styles.container} animate-fade-in`}>
        <div className={`${styles.pageHeader} reveal`}>
          <h1 className={styles.pageTitle}>Escrow Trust Manager</h1>
          <p className={styles.pageSubtitle}>
            Manage your peer-to-peer knowledge contracts and verify intellectual releases via the secure ledger.
          </p>
        </div>

        <div className={`${styles.statsRow} stagger`}>
          <div className={`${styles.statCard} reveal`}>
            <span className={styles.statLabel}>Active Contracts</span>
            <span className={styles.statValue}>02</span>
          </div>
          <div className={`${styles.statCard} ${styles.light} reveal`}>
            <span className={styles.statLabel}>Credits in Trust</span>
            <span className={`${styles.statValue} ${styles.green}`}>15.0</span>
          </div>
          <div className={`${styles.statCard} ${styles.light} reveal`}>
            <span className={styles.statLabel}>Architectural Rating</span>
            <span className={styles.statValue}>A++</span>
          </div>
        </div>

        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Open Intellectual Contracts</h2>
          <button className={styles.secondaryBtn} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Download Ledger PDF</button>
        </div>

        <div className={`${styles.contractList} stagger`}>
          {/* Ongoing Contract */}
          <div className={`${styles.contractCard} reveal hover-lift`}>
            <div className={styles.contractHeader}>
              <div className={styles.contractPartner}>
                <div className={styles.partnerAvatar}>👩🏼‍💻</div>
                <div>
                  <div className={styles.partnerName}>Elena Vance</div>
                  <div className={styles.partnerRole}>Senior Financial Strategist</div>
                </div>
              </div>
              <span className={`${styles.badge} ${styles.active}`}>PROTOCOL ACTIVE</span>
            </div>
            <div className={styles.contractBody}>
              <div className={styles.swapSide}>
                <span className={styles.swapLabel}>OFFERING</span>
                <span className={styles.swapSkill}>System Architecture (Core)</span>
              </div>
              <div className={styles.swapIcon}>⇄</div>
              <div className={styles.swapSide} style={{ textAlign: 'right' }}>
                <span className={styles.swapLabel}>RECEIVING</span>
                <span className={styles.swapSkill} style={{ color: '#4ade80' }}>Risk Analysis Matrix</span>
              </div>
            </div>
            <div className={styles.contractFooter}>
              <div className={styles.progressArea}>
                <div className={styles.progressText}>
                  <span>Ledger Milestone 1 of 2 Verified</span><span>50%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '50%' }}></div>
                </div>
              </div>
              <button className={`${styles.actionBtn} click-scale`}>Enter Secure Room</button>
            </div>
          </div>

          {/* Pending Contract */}
          <div className={`${styles.contractCard} reveal hover-lift`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.contractHeader}>
              <div className={styles.contractPartner}>
                <div className={styles.partnerAvatar}>👨🏽‍💻</div>
                <div>
                  <div className={styles.partnerName}>Marcus Chen</div>
                  <div className={styles.partnerRole}>DevOps Lead</div>
                </div>
              </div>
              <span className={`${styles.badge} ${styles.pending}`}>PENDING SIGNATURE</span>
            </div>
            <div className={styles.contractBody}>
              <div className={styles.swapSide}>
                <span className={styles.swapLabel}>OFFERING</span>
                <span className={styles.swapSkill}>UI Component Governance</span>
              </div>
              <div className={styles.swapIcon}>⇄</div>
              <div className={styles.swapSide} style={{ textAlign: 'right' }}>
                <span className={styles.swapLabel}>RECEIVING</span>
                <span className={styles.swapSkill} style={{ color: '#4ade80' }}>K8s Orchestration Core</span>
              </div>
            </div>
            <div className={styles.contractFooter} style={{ padding: '1.5rem 2rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Awaiting trust lock from partner.</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className={`${styles.secondaryBtn} click-scale`}>Audit Contract</button>
                <button className={`${styles.actionBtn} click-scale`} style={{ background: '#4ade80', color: '#0c2b54' }}>Sign Protocol</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
