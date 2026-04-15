'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppNav from '../../../../components/AppNav';
import styles from './edit.module.css';
import { createClient } from '../../../utils/supabase/client';
import { DEFAULT_SKILLS } from '../../../utils/skills';

export default function EditProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'preferences'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsSought, setSkillsSought] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [availability, setAvailability] = useState('');

  // Custom Skill Input
  const [customOffered, setCustomOffered] = useState('');
  const [customSought, setCustomSought] = useState('');

  const handleAddCustom = (type: 'offered' | 'sought') => {
    const val = type === 'offered' ? customOffered : customSought;
    if (!val.trim()) return;
    
    if (type === 'offered') {
      if (!skillsOffered.includes(val)) setSkillsOffered(prev => [...prev, val]);
      setCustomOffered('');
    } else {
      if (!skillsSought.includes(val)) setSkillsSought(prev => [...prev, val]);
      setCustomSought('');
    }
  };

  const supabase = createClient();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/me`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await res.json();

        if (data.success && data.user) {
          const { user } = data;
          setFirstName(user.firstName || '');
          setLastName(user.lastName || '');
          if (user.profile) {
            setHeadline(user.profile.headline || '');
            setBio(user.profile.bio || '');
            setSkillsOffered(user.profile.skillsOffered || []);
            setSkillsSought(user.profile.skillsSought || []);
            setExperienceLevel(user.profile.experienceLevel || '');
            setAvailability(user.profile.availability || '');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const toggleSkill = (skill: string, type: 'offered' | 'sought') => {
    if (type === 'offered') {
      setSkillsOffered(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    } else {
      setSkillsSought(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required.");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          headline,
          bio,
          skillsOffered,
          skillsSought,
          experienceLevel,
          availability,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });

      if (!res.ok) throw new Error("Failed to update profile.");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.editRoot}>
        <AppNav />
        <div className={styles.container} style={{ textAlign: 'center', paddingTop: '10rem' }}>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editRoot}>
      <AppNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Edit Profile</h1>
            <p className={styles.subtitle}>Curate your professional presence on the SkillNet ledger.</p>
          </div>
          <Link href="/profile" className={styles.cancelBtn}>View Public Profile</Link>
        </div>

        {success && <div className={styles.successMsg}>✅ Profile updated successfully!</div>}
        {error && <div className={styles.errorText} style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <div className={styles.mainLayout}>
          <aside className={styles.sidebar}>
            <button 
              className={`${styles.navItem} ${activeTab === 'profile' ? styles.navActive : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span>👤</span> Public Identity
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'skills' ? styles.navActive : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <span>📜</span> Expertise & Learning
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'preferences' ? styles.navActive : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <span>⚙️</span> Match Preferences
            </button>
          </aside>

          <main>
            <form onSubmit={handleSave} className={styles.formCard}>
              {activeTab === 'profile' && (
                <div className="animate-fade-in">
                  <h2 className={styles.sectionTitle}>Basic Information</h2>
                  <div className={styles.nameGrid} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.formGroup}>

                      <label className={styles.label}>First Name</label>
                      <input className={styles.input} value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Last Name</label>
                      <input className={styles.input} value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Professional Headline</label>
                    <input 
                      className={styles.input} 
                      value={headline} 
                      onChange={e => setHeadline(e.target.value)}
                      placeholder="e.g. Senior Software Architect" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Bio / Exchange Proposition</label>
                    <textarea 
                      className={styles.textarea} 
                      value={bio} 
                      onChange={e => setBio(e.target.value)}
                      placeholder="What are you bringing to the network?"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="animate-fade-in">
                  <h2 className={styles.sectionTitle}>Skills I Offer</h2>
                  <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        className={styles.input} 
                        placeholder="Add a unique skill..." 
                        value={customOffered}
                        onChange={(e) => setCustomOffered(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddCustom('offered'); } }}
                      />
                      <button type="button" className={styles.saveBtn} onClick={() => handleAddCustom('offered')} style={{ width: 'auto', padding: '0 1.25rem' }}>Add</button>
                    </div>
                  </div>
                  <div className={styles.tagsGrid} style={{ marginBottom: '2.5rem' }}>
                    {/* Custom ones first */}
                    {skillsOffered.filter(s => !DEFAULT_SKILLS.includes(s)).map(skill => (
                      <button 
                        key={skill} 
                        type="button"
                        className={`${styles.tagBtn} ${styles.tagActive}`}
                        onClick={() => toggleSkill(skill, 'offered')}
                      >
                        {skill} ×
                      </button>
                    ))}
                    {DEFAULT_SKILLS.map(skill => (
                      <button 
                        key={skill} 
                        type="button"
                        className={`${styles.tagBtn} ${skillsOffered.includes(skill) ? styles.tagActive : ''}`}
                        onClick={() => toggleSkill(skill, 'offered')}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>

                  <h2 className={styles.sectionTitle}>Skills I am Seeking</h2>
                  <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        className={styles.input} 
                        placeholder="What else do you want to learn?" 
                        value={customSought}
                        onChange={(e) => setCustomSought(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddCustom('sought'); } }}
                      />
                      <button type="button" className={styles.saveBtn} onClick={() => handleAddCustom('sought')} style={{ width: 'auto', padding: '0 1.25rem' }}>Add</button>
                    </div>
                  </div>
                  <div className={styles.tagsGrid}>
                    {/* Custom ones first */}
                    {skillsSought.filter(s => !DEFAULT_SKILLS.includes(s)).map(skill => (
                      <button 
                        key={skill} 
                        type="button"
                        className={`${styles.tagBtn} ${styles.tagActive}`}
                        onClick={() => toggleSkill(skill, 'sought')}
                      >
                        {skill} ×
                      </button>
                    ))}
                    {DEFAULT_SKILLS.map(skill => (
                      <button 
                        key={skill} 
                        type="button"
                        className={`${styles.tagBtn} ${skillsSought.includes(skill) ? styles.tagActive : ''}`}
                        onClick={() => toggleSkill(skill, 'sought')}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="animate-fade-in">
                  <h2 className={styles.sectionTitle}>Network Availability</h2>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Experience Level</label>
                    <select className={styles.select} value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)}>
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner / Junior</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Senior">Senior / Architect</option>
                      <option value="Executive">Executive / Leader</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Weekly Commitment</label>
                    <select className={styles.select} value={availability} onChange={e => setAvailability(e.target.value)}>
                      <option value="">Select Availability</option>
                      <option value="Low">Low (~2h/week)</option>
                      <option value="Medium">Medium (3-5h/week)</option>
                      <option value="High">High (5h+/week)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className={styles.footer}>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? 'Syncing...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
