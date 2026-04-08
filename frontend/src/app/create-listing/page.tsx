'use client';
import React from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import styles from './create-listing.module.css';

export default function CreateListing() {
  return (
    <div className={`${styles.createRoot} reveal`}>
      <AppNav />

      <main className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Post a Skill Offer</h1>
          <p className={styles.pageSubtitle}>List your expertise in the marketplace and specify what you want in return.</p>
        </div>

        <div className={styles.formCard}>
          <form>
            <div className={styles.formGroup}>
              <label className={styles.label}>Listing Title</label>
              <input type="text" className={styles.input} placeholder="e.g. I will teach you Advanced React Architecture" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description &amp; Deliverables</label>
              <textarea className={styles.textarea} placeholder="Describe exactly what they will learn and how you will run the session..."></textarea>
            </div>

            <div className={styles.skillsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category (Giving)</label>
                <select className={styles.input}>
                  <option>Software Engineering</option>
                  <option>UI/UX Design</option>
                  <option>Business Strategy</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estimated Time Value</label>
                <select className={styles.input}>
                  <option>1 Hour Session</option>
                  <option>2 Hour Deep Dive</option>
                  <option>5 Hour Mini-Course</option>
                  <option>Ongoing Mentorship</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup} style={{marginTop: '1rem'}}>
              <label className={styles.label}>What are you seeking in return?</label>
              <input type="text" className={styles.input} placeholder="e.g. Financial Modeling, Investor Pitch Prep, etc." />
            </div>

            <div className={styles.formGroup} style={{marginTop: '2rem'}}>
              <label className={styles.label}>Session Format</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="format" className={styles.radioInput} defaultChecked />
                  <div className={styles.radioContent}>
                    <span className={styles.radioTitle}>Live Video Call</span>
                    <span className={styles.radioDesc}>1-on-1 interaction via Zoom or Google Meet.</span>
                  </div>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="format" className={styles.radioInput} />
                  <div className={styles.radioContent}>
                    <span className={styles.radioTitle}>Code/Design Review</span>
                    <span className={styles.radioDesc}>Asynchronous feedback on their repository or Figma file.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.actionRow}>
              <Link href="/profile" className={styles.cancelBtn}>Cancel</Link>
              <button type="button" className={styles.publishBtn}>Publish to Marketplace</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
