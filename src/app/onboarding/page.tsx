'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import styles from './onboarding.module.css';

const SKILLS_LIST = [
  "React", "Node.js", "Python", "UI/UX Design", "Figma",
  "Product Management", "SEO", "Digital Marketing", "Data Analysis",
  "Copywriting", "Financial Modeling", "Public Speaking"
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedGive, setSelectedGive] = useState<string[]>([]);
  const [selectedGet, setSelectedGet] = useState<string[]>([]);

  const toggleSkill = (skill: string, type: 'give' | 'get') => {
    if (type === 'give') {
      setSelectedGive(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    } else {
      setSelectedGet(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    }
  };

  return (
    <div className={styles.onboardingRoot} style={{ paddingBottom: '6rem' }}>
      <AppNav mode="public" />

      <div className={styles.container}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: step === 1 ? '50%' : '100%' }}></div>
        </div>

        <div className={styles.content}>
          {step === 1 && (
            <div className={styles.stepContainer}>
              <h1 className={styles.title}>What skills can you offer?</h1>
              <p className={styles.subtitle}>Select the areas where you excel and can teach others.</p>
              
              <div className={styles.tagsGrid}>
                {SKILLS_LIST.map(skill => (
                  <button 
                    key={skill} 
                    className={`${styles.tagBtn} ${selectedGive.includes(skill) ? styles.tagActive : ''}`}
                    onClick={() => toggleSkill(skill, 'give')}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className={styles.actionRow}>
                <button className={styles.nextBtn} onClick={() => setStep(2)}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContainer}>
              <h1 className={styles.title}>What do you want to learn?</h1>
              <p className={styles.subtitle}>Select the skills you want to receive in exchange.</p>
              
              <div className={styles.tagsGrid}>
                {SKILLS_LIST.map(skill => (
                  <button 
                    key={skill} 
                    className={`${styles.tagBtn} ${selectedGet.includes(skill) ? styles.tagActive : ''}`}
                    onClick={() => toggleSkill(skill, 'get')}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className={styles.actionRow}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>
                  ← Back
                </button>
                <Link href="/dashboard" className={styles.nextBtn}>
                  Complete Setup
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
