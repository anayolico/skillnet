'use client';
import React from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import styles from './messages.module.css';

export default function Messages() {
  return (
    <div className={`${styles.messagesRoot} animate-fade-in`}>
      <AppNav />

      <div className={styles.chatContainer}>
        {/* Sidebar List: Ledger Styles */}
        <div className={styles.sidebar}>
          <div className={`${styles.sidebarHeader} reveal`}>
            <h1 className={styles.sidebarTitle}>Verification Hub</h1>
          </div>
          <ul className={`${styles.chatList} stagger`}>
            <li className={`${styles.chatItem} ${styles.active} reveal`}>
              <div className={styles.chatAvatar}>👩🏼‍💻</div>
              <div className={styles.chatDetails}>
                <div className={styles.chatName}>
                  Elena Vance (Titan)
                  <span className={styles.chatTime}>10:42 AM</span>
                </div>
                <div className={styles.chatSnippet}>Verified protocol release scheduled for Thursday.</div>
              </div>
            </li>
            <li className={`${styles.chatItem} reveal`}>
              <div className={styles.chatAvatar}>👨🏽‍💻</div>
              <div className={styles.chatDetails}>
                <div className={styles.chatName}>
                  Marcus Chen
                  <span className={styles.chatTime}>Yesterday</span>
                </div>
                <div className={styles.chatSnippet}>Contract updated for K8s Core module.</div>
              </div>
            </li>
            <li className={`${styles.chatItem} reveal`}>
              <div className={styles.chatAvatar}>🧑🏼‍💼</div>
              <div className={styles.chatDetails}>
                <div className={styles.chatName}>
                  David Sterling
                  <span className={styles.chatTime}>Mon</span>
                </div>
                <div className={styles.chatSnippet}>Trust credits released. Pleasure working together.</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Main Chat Area: Secure Channel */}
        <div className={styles.chatMain}>
          <div className={`${styles.chatHeader} reveal`}>
            <div className={styles.chatHeaderInfo}>
              <div className={styles.chatAvatar}>👩🏼‍💻</div>
              <div>
                <div className={styles.chatHeaderName}>Elena Vance</div>
                <div className={styles.chatHeaderStatus}>● Secure Channel Open</div>
              </div>
            </div>
            <Link href="/escrow" className={`${styles.proposeBtn} click-scale`}>Lock Protocol</Link>
          </div>

          <div className={`${styles.messagesArea} reveal`}>
            <div className={`${styles.message} ${styles.received}`}>
              Hi Alex! I reviewed your post for Architecture Mentoring. I have 6 years of experience in Corporate Risk Analysis.
              I'm looking for guidance on vertical scalability. Shall we lock the 2-hour swap?
            </div>
            <div className={`${styles.message} ${styles.sent}`}>
              Hi Elena, that matches my current goals perfectly. My React performance architecture is ready for transfer.
              I'll lock the protocol now. Thursday works for the first milestone.
            </div>
            <div className={`${styles.message} ${styles.received}`}>
              Excellent. Protocol verified. See you on the ledger.
            </div>
          </div>

          <div className={`${styles.inputArea} reveal`}>
            <input type="text" className={styles.inputField} placeholder="Secure message..." />
            <button className={`${styles.sendBtn} click-scale`}>↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
