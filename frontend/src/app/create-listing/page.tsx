'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AppNav from '../../../components/AppNav';
import styles from './create-listing.module.css';
import { DEFAULT_SKILLS } from '../../utils/skills';

export default function CreateListing() {
  const router = useRouter();
  const { getToken } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: DEFAULT_SKILLS[0],
    timeValue: '1 Hour Session',
    skillsSought: '',
    sessionFormat: 'Live Video Call'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormatChange = (format: string) => {
    setFormData(prev => ({ ...prev, sessionFormat: format }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      // Clean up skillsSought by splitting commas
      const skillsSoughtArray = formData.skillsSought
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const res = await fetch('http://localhost:3001/api/marketplace/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          timeValue: formData.timeValue,
          sessionFormat: formData.sessionFormat,
          skillsOffered: [formData.category], // Default single giving skill for MVP
          skillsSought: skillsSoughtArray
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create listing');
      }

      router.push('/marketplace');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.createRoot} reveal`}>
      <AppNav />

      <main className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Post a Skill Offer</h1>
          <p className={styles.pageSubtitle}>List your expertise in the marketplace and specify what you want in return.</p>
        </div>

        <div className={styles.formCard}>
          {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Listing Title</label>
              <input 
                type="text" 
                name="title"
                className={styles.input} 
                placeholder="e.g. I will teach you Advanced React Architecture" 
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description &amp; Deliverables</label>
              <textarea 
                name="description"
                className={styles.textarea} 
                placeholder="Describe exactly what they will learn and how you will run the session..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className={styles.skillsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category (Giving)</label>
                <select 
                  name="category"
                  className={styles.input}
                  value={formData.category}
                  onChange={handleChange}
                >
                  {DEFAULT_SKILLS.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Estimated Time Value</label>
                <select 
                  name="timeValue"
                  className={styles.input}
                  value={formData.timeValue}
                  onChange={handleChange}
                >
                  <option value="1 Hour Session">1 Hour Session</option>
                  <option value="2 Hour Deep Dive">2 Hour Deep Dive</option>
                  <option value="5 Hour Mini-Course">5 Hour Mini-Course</option>
                  <option value="Ongoing Mentorship">Ongoing Mentorship</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup} style={{marginTop: '1rem'}}>
              <label className={styles.label}>What are you seeking in return? (Comma separated)</label>
              <input 
                type="text" 
                name="skillsSought"
                className={styles.input} 
                placeholder="e.g. Financial Modeling, Investor Pitch Prep, etc." 
                value={formData.skillsSought}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup} style={{marginTop: '2rem'}}>
              <label className={styles.label}>Session Format</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="format" 
                    className={styles.radioInput} 
                    checked={formData.sessionFormat === 'Live Video Call'}
                    onChange={() => handleFormatChange('Live Video Call')}
                  />
                  <div className={styles.radioContent}>
                    <span className={styles.radioTitle}>Live Video Call</span>
                    <span className={styles.radioDesc}>1-on-1 interaction via Zoom or Google Meet.</span>
                  </div>
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="format" 
                    className={styles.radioInput} 
                    checked={formData.sessionFormat === 'Code/Design Review'}
                    onChange={() => handleFormatChange('Code/Design Review')}
                  />
                  <div className={styles.radioContent}>
                    <span className={styles.radioTitle}>Code/Design Review</span>
                    <span className={styles.radioDesc}>Asynchronous feedback on their repository or Figma file.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.actionRow}>
              <Link href="/profile" className={styles.cancelBtn}>Cancel</Link>
              <button 
                type="submit" 
                className={styles.publishBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : 'Publish to Marketplace'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
