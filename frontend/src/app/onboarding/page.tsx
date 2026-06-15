'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppNav from '../../../components/AppNav';
import styles from './onboarding.module.css';
import { useAuth } from '@/src/contexts/AuthContext';
import { DEFAULT_SKILLS } from '../../utils/skills';

export default function Onboarding() {
  const router = useRouter();
  const { user, getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [selectedGive, setSelectedGive] = useState<string[]>([]);
  const [selectedGet, setSelectedGet] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [availability, setAvailability] = useState('');
  
  // Custom Skill Input
  const [customGive, setCustomGive] = useState('');
  const [customGet, setCustomGet] = useState('');

  const handleAddCustom = (type: 'give' | 'get') => {
    const val = type === 'give' ? customGive : customGet;
    if (!val.trim()) return;
    
    if (type === 'give') {
      if (!selectedGive.includes(val)) setSelectedGive(prev => [...prev, val]);
      setCustomGive('');
    } else {
      if (!selectedGet.includes(val)) setSelectedGet(prev => [...prev, val]);
      setCustomGet('');
    }
  };


  const toggleGiveSkill = (skill: string) => {
    setSelectedGive(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleGetSkill = (skill: string) => {
    setSelectedGet(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("No active session found.");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = getToken();
      const response = await fetch(`${apiUrl}/api/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({
          headline,
          bio,
          skillsOffered: selectedGive,
          skillsSought: selectedGet,
          experienceLevel,
          availability,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save profile.");
      }

      // Update cookie so middleware knows user is onboarded
      document.cookie = 'onboarded=true; path=/; max-age=86400; SameSite=Lax';
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.onboardingRoot} style={{ paddingBottom: '6rem' }}>
      <AppNav mode="public" />

      <div className={styles.container}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        <div className={styles.content}>
          {step === 1 && (
            <div className={styles.stepContainer}>
              <h1 className={styles.title}>Professional Identity</h1>
              <p className={styles.subtitle}>Let’s build your peer-to-peer profile. How should others see you?</p>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Headline</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Senior Software Architect" 
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Bio summary</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Briefly describe your experience and what you hope to achieve here..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className={styles.actionRow}>
                <button 
                  className={styles.nextBtn} 
                  disabled={!headline.trim()} 
                  onClick={() => setStep(2)}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContainer}>
              <h1 className={styles.title}>What you can offer</h1>
              <p className={styles.subtitle}>Select the core competencies you can teach to others.</p>
              
              <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Add a custom skill..." 
                    value={customGive}
                    onChange={(e) => setCustomGive(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustom('give')}
                  />
                  <button type="button" className={styles.nextBtn} onClick={() => handleAddCustom('give')} style={{ width: 'auto', padding: '0 1.5rem', height: 'auto' }}>Add</button>
                </div>
              </div>

              <div className={styles.tagsGrid}>
                {/* Show currently selected (including custom ones) */}
                {selectedGive.filter(s => !DEFAULT_SKILLS.includes(s)).map(skill => (
                   <button 
                    key={skill} 
                    className={`${styles.tagBtn} ${styles.tagActive}`}
                    onClick={() => toggleGiveSkill(skill)}
                  >
                    {skill} ×
                  </button>
                ))}
                
                {/* Show default options */}
                {DEFAULT_SKILLS.map(skill => (
                  <button 
                    key={skill} 
                    className={`${styles.tagBtn} ${selectedGive.includes(skill) ? styles.tagActive : ''}`}
                    onClick={() => toggleGiveSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className={styles.actionRow}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
                <button 
                  className={styles.nextBtn} 
                  disabled={selectedGive.length === 0} 
                  onClick={() => setStep(3)}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContainer}>
              <h1 className={styles.title}>What you want to learn</h1>
              <p className={styles.subtitle}>Select the skills you want to receive in exchange.</p>

              <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Add a custom skill..." 
                    value={customGet}
                    onChange={(e) => setCustomGet(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustom('get')}
                  />
                  <button type="button" className={styles.nextBtn} onClick={() => handleAddCustom('get')} style={{ width: 'auto', padding: '0 1.5rem', height: 'auto' }}>Add</button>
                </div>
              </div>
              
              <div className={styles.tagsGrid}>
                {/* Show custom ones */}
                {selectedGet.filter(s => !DEFAULT_SKILLS.includes(s)).map(skill => (
                   <button 
                    key={skill} 
                    className={`${styles.tagBtn} ${styles.tagActive}`}
                    onClick={() => toggleGetSkill(skill)}
                  >
                    {skill} ×
                  </button>
                ))}

                {DEFAULT_SKILLS.map(skill => (
                  <button 
                    key={skill} 
                    className={`${styles.tagBtn} ${selectedGet.includes(skill) ? styles.tagActive : ''}`}
                    onClick={() => toggleGetSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className={styles.actionRow}>
                <button className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
                <button 
                  className={styles.nextBtn} 
                  disabled={selectedGet.length === 0} 
                  onClick={() => setStep(4)}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={styles.stepContainer}>
              <h1 className={styles.title}>Commitment & Level</h1>
              <p className={styles.subtitle}>Establish your baseline for network matching.</p>

              <div className={styles.formGroup}>
                <label className={styles.label}>General Experience Level</label>
                <div className={styles.optionsGrid}>
                  <button 
                    className={`${styles.optionBtn} ${experienceLevel === 'Intermediate' ? styles.optionActive : ''}`}
                    onClick={() => setExperienceLevel('Intermediate')}
                  >
                    Intermediate
                    <span>Strong foundational knowledge</span>
                  </button>
                  <button 
                    className={`${styles.optionBtn} ${experienceLevel === 'Senior' ? styles.optionActive : ''}`}
                    onClick={() => setExperienceLevel('Senior')}
                  >
                    Senior / Executive
                    <span>Deep expertise & architecture</span>
                  </button>
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginTop: '2rem' }}>
                <label className={styles.label}>Current Availability</label>
                <div className={styles.optionsGrid}>
                   <button 
                    className={`${styles.optionBtn} ${availability === 'Low' ? styles.optionActive : ''}`}
                    onClick={() => setAvailability('Low')}
                  >
                    Low
                    <span>~2 hours per week</span>
                  </button>
                  <button 
                    className={`${styles.optionBtn} ${availability === 'High' ? styles.optionActive : ''}`}
                    onClick={() => setAvailability('High')}
                  >
                    High
                    <span>5+ hours per week</span>
                  </button>
                </div>
              </div>

              <div className={styles.actionRow}>
                <button className={styles.backBtn} onClick={() => setStep(3)}>← Back</button>
                <button 
                  className={styles.nextBtn} 
                  onClick={handleComplete}
                  disabled={loading || !experienceLevel || !availability}
                >
                  {loading ? 'Finalizing...' : 'Complete Profile'}
                </button>
              </div>
              
              {error && <div className={styles.errorText}>{error}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
